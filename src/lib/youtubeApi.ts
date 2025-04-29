/**
  fetches channel snippet & statistics from YouTube Data API v3.
 */
export async function fetchChannelStats(channelId: string, apiKey: string): Promise<object> {
    if (!channelId) throw new Error('Channel ID is required.');
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.startsWith('PUBLIC_') || apiKey === import.meta.env.VITE_PLACEHOLDER_API_KEY ) throw new Error('API Key is missing or not configured.');

    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('API Error Response:', errorData);
            throw new Error(`Network response not ok (Status: ${response.status}). ${errorData?.error?.message || ''}`);
        }
        const data = await response.json();
        if (data.items && data.items.length > 0) return data.items[0];
        else throw new Error(`No channel found for ID: ${channelId}`);
    } catch (error) {
        console.error(`Failed to fetch channel data for ID ${channelId}:`, error);
        throw error;
    }
}

/**
  resolves a channel handle/name to channel ID using YouTube Data API v3 Search.
 */
export async function resolveNameToId(name: string, apiKey: string): Promise<string | null> {
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.startsWith('PUBLIC_') || apiKey === import.meta.env.VITE_PLACEHOLDER_API_KEY) throw new Error("API Key is missing or not configured.");

    const query = name.startsWith('@') ? name.substring(1) : name;
    const url = `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Search API Error Response:', errorData);
            throw new Error(`Search API request failed (Status: ${response.status})`);
        }
        const data = await response.json();
        if (data.items?.[0]?.id?.channelId) return data.items[0].id.channelId;
        else return null;
    } catch (error) {
        console.error('Failed to resolve name to ID:', error);
        throw error;
    }
}

/**
  Extracts identifier (ID, handle, name) from various input formats (URL, @handle, raw).!!!
 */
export function extractIdentifier(input: string): { type: 'id' | 'handle_or_name' | 'invalid', value: string | null } {
    const trimmedInput = input.trim();
    if (/^UC[a-zA-Z0-9_-]{22}$/.test(trimmedInput)) return { type: 'id', value: trimmedInput };
    if (/^@[a-zA-Z0-9_.-]+$/.test(trimmedInput)) return { type: 'handle_or_name', value: trimmedInput };
    try {
        const urlInput = trimmedInput.startsWith('http://') || trimmedInput.startsWith('https://') ? trimmedInput : `https://${trimmedInput}`;
        const url = new URL(urlInput);
        if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
            const pathParts = url.pathname.split('/').filter(part => part);
            const channelIndex = pathParts.indexOf('channel');
            if (channelIndex !== -1 && pathParts.length > channelIndex + 1 && /^UC[a-zA-Z0-9_-]{22}$/.test(pathParts[channelIndex + 1])) {
                return { type: 'id', value: pathParts[channelIndex + 1] };
            }
            if (pathParts.length > 0 && pathParts[0].startsWith('@')) {
                const handle = pathParts[0].split('?')[0];
                if (/^@[a-zA-Z0-9_.-]+$/.test(handle)) return { type: 'handle_or_name', value: handle };
            }
            const legacyPrefixIndex = pathParts.findIndex(p => p === 'c' || p === 'user');
            if (legacyPrefixIndex !== -1 && pathParts.length > legacyPrefixIndex + 1) {
                const legacyName = pathParts[legacyPrefixIndex + 1].split('?')[0];
                return { type: 'handle_or_name', value: legacyName };
            }
        }
    } catch (e) { /* Ignore */ }
    if (trimmedInput.length > 2 && !trimmedInput.includes(' ') && !trimmedInput.startsWith('UC')) {
        return { type: 'handle_or_name', value: trimmedInput };
    }
    return { type: 'invalid', value: null };
}

/**
 * helper to process input, resolve (if  it is needed), and return ID.
 */
export async function processIdentifier(input: string, inputLabel: string, apiKey: string): Promise<string> {
    const identifier = extractIdentifier(input);
    let resolvedId: string | null = null;

    if (identifier.type === 'id' && identifier.value) {
        resolvedId = identifier.value;
    } else if (identifier.type === 'handle_or_name' && identifier.value) {
        resolvedId = await resolveNameToId(identifier.value, apiKey);
        if (!resolvedId) {
            throw new Error(`Could not find channel ID for ${inputLabel} ('${identifier.value}')`);
        }
    } else {
        throw new Error(`Invalid input format for ${inputLabel}.`);
    }
    if (!resolvedId) { // Should be unreachable due to checks above, but good practice
        throw new Error(`Failed to resolve identifier for ${inputLabel}.`);
    }
    return resolvedId;
}