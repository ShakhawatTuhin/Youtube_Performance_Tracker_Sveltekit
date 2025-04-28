<!-- src/routes/history/+page.svelte -->
<script lang="ts">
    import HistoryItem from '../../components/HistoryItem.svelte';
    import ErrorMessage from '../../components/ErrorMessage.svelte';

    // Type from +page.js, possibly including loadError: string
    export let data: { history: any[], loadError?: string };
</script>

<svelte:head>
    <title>Search History - YouTube Tracker</title>
</svelte:head>

<h1>Search History</h1>

{#if data.loadError}
    <!-- Inside this block, data.loadError is known to be a string -->
    <!-- Pass it directly -->
    <ErrorMessage message={data.loadError} />
{:else if data.history && data.history.length > 0}
    <p>Your recent searches (newest first, max {data.history.length}):</p>
    <ul class="history-list">
        {#each data.history as item (item.timestamp)}
            <HistoryItem {item} />
        {/each}
    </ul>
{:else}
    <p>No search history found. Perform some searches on the main page!</p>
{/if}

<style>
    /* styles... */
</style>