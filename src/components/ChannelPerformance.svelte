<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
    import { fetchChannelStats } from '$lib/youtubeApi';
    import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';

    export let channelId: string = '';

    let channelData: any = null;
    let errorMessage: string = '';
    let isLoading: boolean = false;
    let chartInstance: Chart | null = null;
    let canvasElement: HTMLCanvasElement;

    const API_KEY = PUBLIC_YOUTUBE_API_KEY;

    async function loadData(id: string) {
        if (!id) { resetState(); return; }
        isLoading = true;
        errorMessage = '';
        channelData = null;
        destroyChart();
        try {
            const data = await fetchChannelStats(id, API_KEY);
            channelData = data;
        } catch (error: any) {
            errorMessage = `Failed to load data: ${error.message}`;
            channelData = null;
        } finally {
            isLoading = false;
        }
    }

    function destroyChart() {
        if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    }

    function createOrUpdateChart() {
        if (!channelData?.statistics || !canvasElement) { destroyChart(); return; }
        destroyChart();
        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;

        const stats = channelData.statistics;
        const subs = stats.hiddenSubscriberCount ? 0 : Number(stats.subscriberCount || 0);
        const views = Number(stats.viewCount || 0);
        const videos = Number(stats.videoCount || 0);
        const useLogScale = views > 10000 || subs > 10000;

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Subscribers', 'Views', 'Videos'],
                datasets: [{
                    label: `${channelData.snippet.title} (Lifetime)`,
                    data: [subs + (subs === 0 ? 0.1 : 0), views, videos],
                    backgroundColor: [ 'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)' ],
                    borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)' ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: `Lifetime Stats for ${channelData.snippet.title}`, color: '#FFD700' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                const parsedY = Number(context.parsed.y || 0);
                                const value = (context.label === 'Subscribers' && stats.hiddenSubscriberCount)
                                    ? 0
                                    : parsedY - (context.label === 'Subscribers' && subs === 0 ? 0.1 : 0);
                                label += value.toLocaleString();
                                if (context.label === 'Subscribers' && stats.hiddenSubscriberCount) label += ' (Hidden)';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: useLogScale ? 'logarithmic' : 'linear', beginAtZero: !useLogScale,
                        ticks: {
                            color: '#CCCCCC',
                            callback: function(value, index, values) {
                                const numericValue = Number(value);
                                if (isNaN(numericValue)) return '';
                                if (useLogScale) {
                                    if (numericValue > 0) {
                                        const log10Value = Math.log10(numericValue);
                                        if (Math.abs(log10Value - Math.round(log10Value)) < 0.01) return numericValue.toLocaleString();
                                    }
                                    return null;
                                }
                                return numericValue.toLocaleString();
                            }
                        },
                        grid: { color: 'rgba(255, 215, 0, 0.2)' }
                    },
                    x: { ticks: { color: '#CCCCCC' }, grid: { display: false } }
                }
            }
        });
    }

    function resetState() { destroyChart(); channelData = null; errorMessage = ''; isLoading = false; }
    $: { loadData(channelId); }
    $: { if (canvasElement && channelData && !isLoading && !errorMessage) createOrUpdateChart(); else destroyChart(); }
    onDestroy(() => { destroyChart(); });
</script>

<div class="channel-card">
    {#if isLoading} <p>Loading channel data...</p>
    {:else if errorMessage} <p class="error">{errorMessage}</p>
    {:else if channelData?.snippet}
        <h3>{channelData.snippet.title}</h3>
        <div class="chart-container"> <canvas bind:this={canvasElement}></canvas> </div>
        {#if channelData.statistics.hiddenSubscriberCount} <p class="info-note">(Subscriber count is hidden)</p> {/if}
    {:else if channelId && !isLoading} <p>No data to display.</p>
    {/if}
    {#if !channelId && !isLoading && !errorMessage} <p>Enter a channel identifier above.</p> {/if}
</div>

<style> /* Styles from previous version */
.channel-card { background-color: #111; border: 2px solid #FFD700; padding: 1.5rem; border-radius: 8px; text-align: center; width: 100%; max-width: 500px; margin: 1rem auto; min-height: 350px; display: flex; flex-direction: column; justify-content: center; }
.chart-container { position: relative; height: 250px; width: 100%; margin-top: 1rem; }
canvas { display: block; width: 100%; height: 100%; }
h3 { color: #FFD700; margin-bottom: 0.5rem; }
p { margin: 0.5rem 0; color: #eee; }
.info-note { font-size: 0.85em; font-style: italic; opacity: 0.8; margin-top: 1rem; }
.error { color: #ff4444; background-color: #330000; border: 1px solid #ff4444; padding: 0.75rem; border-radius: 4px; margin: 1rem auto; max-width: 90%; text-align: center; }
</style>