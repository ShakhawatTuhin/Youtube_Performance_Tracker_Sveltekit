// src/routes/history/+page.js

// Keep the JSDoc comment - SvelteKit uses this to generate types
/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) { // 'fetch' type comes from PageLoad via JSDoc
    try {
        const response = await fetch('/api/history'); // Fetch from our internal API endpoint
        if (!response.ok) {
            const errorText = await response.text();
            // Throw an actual Error object for better handling
            throw new Error(`Failed to load history: ${response.status} ${errorText || response.statusText}`);
        }
        const history = await response.json();
        // Ensure it's always an array
        return {
            history: Array.isArray(history) ? history : []
            // No error property needed on success
        };
    } catch (error) { // error is implicitly 'unknown'
        console.error('Error loading history page:', error);

        // Type guard to extract a meaningful message
        let errorMessage = 'Could not load search history.'; // Default
        if (error instanceof Error) {
            errorMessage = error.message; // Use message from Error object
        } else if (typeof error === 'string') {
            errorMessage = error; // Use the string directly if thrown
        }
        // It's good practice to pass the error message clearly
        return {
            history: [], // Return empty history on error
            loadError: errorMessage // Use a distinct property name for the error
        };
    }
}