/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    try {
        const response = await fetch('/api/history');
        if (!response.ok) {
            const errorText = await response.text();
            // throw an actual error for better handling
            throw new Error(`Failed to load history: ${response.status} ${errorText || response.statusText}`);
        }
        const history = await response.json();
        return {
            history: Array.isArray(history) ? history : []
        };
    } catch (error) {
        console.error('Error loading history page:', error);
        let errorMessage = 'Could not load search history.';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        return {
            history: [],
            loadError: errorMessage
        };
    }
}