// src/routes/api/history/+server.ts  <- Ensure file is named .ts
import fs from 'fs/promises';
import path from 'path';
import { json } from '@sveltejs/kit';
// Type definitions are automatically handled for $types in .ts files usually
// No explicit import needed here for json helper

// Define the path to the history file relative to the project root
const historyFilePath = path.join(process.cwd(), 'data', 'history.json');
const MAX_HISTORY_ITEMS = 50;

// --- GET Handler ---
// Add explicit return type annotation for clarity (optional but good practice)
export async function GET(): Promise<Response> {
    try {
        const data = await fs.readFile(historyFilePath, 'utf-8');
        const history = JSON.parse(data);
        // Ensure history is an array before returning
        return json(Array.isArray(history) ? history : []);
    } catch (error: unknown) { // Use unknown type
        // Check the specific error code for file not found
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            console.log('History file not found, returning empty array.');
            return json([]); // Return empty array if file doesn't exist
        }
        // For other errors, log and return an error response
        console.error('Failed to read history:', error);
        return json({ error: 'Failed to retrieve history' }, { status: 500 });
    }
}

// --- POST Handler ---
// Use the RequestEvent type from SvelteKit for better type safety
import type { RequestEvent } from './$types';

export async function POST({ request }: RequestEvent): Promise<Response> { // Add type to RequestEvent
    try {
        const newEntry = await request.json();

        // Basic validation
        if (!newEntry || !newEntry.type || !(newEntry.input || newEntry.inputs) || !(newEntry.channelId || newEntry.channelIds)) {
            return json({ error: 'Invalid history entry format' }, { status: 400 });
        }

        newEntry.timestamp = Date.now(); // Add timestamp

        let history: any[] = []; // Define history as an array
        try {
            const data = await fs.readFile(historyFilePath, 'utf-8');
            const parsedData = JSON.parse(data);
            // Ensure we only proceed if the parsed data is actually an array
            if (Array.isArray(parsedData)) {
                history = parsedData;
            } else {
                console.warn('History file contained non-array data, resetting.');
                history = []; // Reset if file content is invalid
            }
        } catch (error: unknown) { // Use unknown type
            // Check specifically for file not found error
            if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
                console.log('History file not found, creating new one.');
                // History is already initialized as [], so just continue
            } else {
                // For other read errors, re-throw to be caught by the outer catch
                throw error;
            }
        }

        // Add new entry to the beginning
        history.unshift(newEntry);

        // Limit history size
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        // Write updated history back to file
        await fs.writeFile(historyFilePath, JSON.stringify(history, null, 2), 'utf-8');

        return json({ success: true, entry: newEntry }, { status: 201 });

    } catch (error: unknown) { // Use unknown type
        console.error('Failed to save history:', error);
        // Provide a more specific error message if possible
        let message = 'Failed to save history entry';
        if (error instanceof Error) {
            message = error.message;
        }
        return json({ error: message }, { status: 500 });
    }
}