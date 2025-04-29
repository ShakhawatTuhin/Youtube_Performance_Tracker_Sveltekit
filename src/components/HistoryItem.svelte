<script lang="ts">
    export let item: any;

    function formatInput(item: any): string {
        if (item.type === 'single') {
            return `Single: "${item.input}" (ID: ${item.channelId})`;
        } else if (item.type === 'compare') {
            return `Compare: "${item.inputs[0]}" vs "${item.inputs[1]}" (IDs: ${item.channelIds[0]}, ${item.channelIds[1]})`;
        }
        return 'Unknown search type';
    }
</script>

<li class="history-item">
    <span class="timestamp">{new Date(item.timestamp).toLocaleString()}</span>
    <span class="details">{formatInput(item)}</span>
</li>

<style>
    .history-item {
        background-color: #1f1f1f;
        border: 1px solid #444;
        border-left: 4px solid #FFD700;
        padding: 1rem 1.5rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: #eee;
    }

    .timestamp {
        font-size: 0.85em;
        color: #aaa;
    }

    .details {
        font-size: 1em;
        word-break: break-word; /* prevent long URLs/IDs from breaking layout */
    }
</style>