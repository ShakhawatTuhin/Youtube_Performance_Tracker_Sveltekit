<script lang="ts">
    import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';
    import { fetchChannelStats, processIdentifier } from '$lib/youtubeApi';

    import SearchForm from '../components/SearchForm.svelte';
    import LoadingSpinner from '../components/LoadingSpinner.svelte';
    import ErrorMessage from '../components/ErrorMessage.svelte';

    import ChannelPerformance from '../components/ChannelPerformance.svelte';
    import ComparisonChart from '../components/ComparisonChart.svelte';

    let isLoadingSingle = false;
    let singleError: string | null = null;
    let currentSingleChannelId: string | null = null; // ID for ChannelPerformance

    let isLoadingCompare = false;
    let compareError: string | null = null;
    let compareData1: any = null; // Full data for ComparisonChart
    let compareData2: any = null; // Full data for ComparisonChart

    const API_KEY = PUBLIC_YOUTUBE_API_KEY;

    async function saveHistory(entry: any) {
        try {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            if (!response.ok) {
                console.error('Failed to save history:', await response.text());
            }
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    async function handleSearch(event: CustomEvent<{ value: string }>) {
        const input = event.detail.value;
        isLoadingSingle = true;
        singleError = null;
        currentSingleChannelId = null; // Reset previous result

        try {
            const finalId = await processIdentifier(input, 'channel', API_KEY);
            currentSingleChannelId = finalId; // Set ID for ChannelPerformance component

            // save to history (fire-and-forget, don't wait)
            saveHistory({ type: 'single', input: input, channelId: finalId });

        } catch (error: any) {
            singleError = error.message || 'An error occurred during search.';
            currentSingleChannelId = null;
        } finally {
            isLoadingSingle = false;
        }
    }

    async function handleCompare(event: CustomEvent<{ value1: string, value2: string }>) {
        const input1 = event.detail.value1;
        const input2 = event.detail.value2;
        isLoadingCompare = true;
        compareError = null;
        compareData1 = null;
        compareData2 = null;

        try {
            // Process both identifiers concurrently
            const [resolvedId1, resolvedId2] = await Promise.all([
                processIdentifier(input1, 'Channel 1', API_KEY),
                processIdentifier(input2, 'Channel 2', API_KEY)
            ]);

            // Fetch data for both channels concurrently
            const [data1, data2] = await Promise.all([
                fetchChannelStats(resolvedId1, API_KEY),
                fetchChannelStats(resolvedId2, API_KEY)
            ]);

            compareData1 = data1;
            compareData2 = data2;

            // Save to history (fireeee-and-forgettttt)
            saveHistory({ type: 'compare', inputs: [input1, input2], channelIds: [resolvedId1, resolvedId2] });

        } catch (error: any) {
            compareError = error.message || 'An error occurred during comparison.';
            compareData1 = null;
            compareData2 = null;
        } finally {
            isLoadingCompare = false;
        }
    }
</script>

<h1>YouTube Channel Performance Tracker</h1>
<p class="subtitle">View and Compare Lifetime Channel Statistics</p>

<!-- Single Channel Search Section -->
<section class="section-container">
    <h2>Search a Channel</h2>
    <SearchForm formType="single" isLoading={isLoadingSingle} on:search={handleSearch} />
    {#if isLoadingSingle}
        <LoadingSpinner />
    {/if}
    <ErrorMessage message={singleError} />

    {#if currentSingleChannelId && !isLoadingSingle && !singleError}
        <ChannelPerformance channelId={currentSingleChannelId} />
    {/if}
</section>

<hr />

<!-- Compare Two Channels Section -->
<section class="section-container">
    <h2>Compare Two Channels</h2>
    <SearchForm formType="compare" isLoading={isLoadingCompare} on:compare={handleCompare} />
    {#if isLoadingCompare}
        <LoadingSpinner />
    {/if}
    <ErrorMessage message={compareError} />

    {#if compareData1 && compareData2 && !isLoadingCompare && !compareError}
        <ComparisonChart channelData1={compareData1} channelData2={compareData2} />
    {/if}
</section>

<style>
    .subtitle { text-align: center; color: #ccc; margin-bottom: 2rem; margin-top: -1rem; }
    .section-container { margin-bottom: 3rem; }
    h2 { margin-bottom: 1.5rem; }
    hr { border: 0; height: 1px; background: #FFD700; margin: 4rem auto; width: 80%; }
    /* Centering for loading/error when no chart is shown */
    .section-container > :global(.spinner-container),
    .section-container > :global(.error-message) {
        margin-top: 1.5rem;
    }
</style>