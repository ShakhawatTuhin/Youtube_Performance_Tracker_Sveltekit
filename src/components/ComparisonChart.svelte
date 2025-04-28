<!-- src/components/ComparisonChart.svelte -->
<!-- (Use the version from the previous TypeScript fix, ensuring Number() conversions) -->
<script lang="ts">
    import { onMount, onDestroy, tick } from 'svelte';
    import Chart from 'chart.js/auto';

    export let channelData1: any;
    export let channelData2: any;

    let chartInstance: Chart | null = null;
    let canvasElement: HTMLCanvasElement;

    function destroyChart() { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } }

    function createOrUpdateChart() {
        if (!channelData1?.statistics || !channelData2?.statistics || !canvasElement) { destroyChart(); return; }
        destroyChart();
        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;

        const stats1 = channelData1.statistics; const stats2 = channelData2.statistics;
        const subs1 = stats1.hiddenSubscriberCount ? 0 : Number(stats1.subscriberCount || 0);
        const views1 = Number(stats1.viewCount || 0);
        const videos1 = Number(stats1.videoCount || 0);
        const subs2 = stats2.hiddenSubscriberCount ? 0 : Number(stats2.subscriberCount || 0);
        const views2 = Number(stats2.viewCount || 0);
        const videos2 = Number(stats2.videoCount || 0);
        const maxSubs = Math.max(subs1, subs2); const maxViews = Math.max(views1, views2);
        const useLogScale = maxViews > 10000 || maxSubs > 10000;

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Subscribers', 'Views', 'Videos'],
                datasets: [
                    { label: `${channelData1.snippet.title} ${stats1.hiddenSubscriberCount ? '(Subs Hidden)' : ''}`, data: [subs1 + (subs1 === 0 ? 0.1 : 0), views1, videos1], backgroundColor: 'rgba(255, 99, 132, 0.7)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 },
                    { label: `${channelData2.snippet.title} ${stats2.hiddenSubscriberCount ? '(Subs Hidden)' : ''}`, data: [subs2 + (subs2 === 0 ? 0.1 : 0), views2, videos2], backgroundColor: 'rgba(255, 215, 0, 0.7)', borderColor: 'rgba(255, 215, 0, 1)', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top', labels: { color: '#FFD700' } },
                    title: { display: true, text: 'Lifetime Stats Comparison', color: '#FFD700', padding: { bottom: 15 } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                const valueIndex = context.dataIndex; const isSubs = valueIndex === 0;
                                let actualValue = Number(context.parsed.y || 0);
                                if (isSubs && actualValue === 0.1) actualValue = 0;
                                let subsHidden = false;
                                if (isSubs) {
                                    if (context.datasetIndex === 0 && channelData1.statistics.hiddenSubscriberCount) subsHidden = true;
                                    if (context.datasetIndex === 1 && channelData2.statistics.hiddenSubscriberCount) subsHidden = true;
                                }
                                if (label) {
                                    const nameEndIndex = label.indexOf('(Subs Hidden)');
                                    label = nameEndIndex !== -1 ? label.substring(0, nameEndIndex).trim() : label;
                                    label += ': ';
                                }
                                label += actualValue.toLocaleString();
                                if (subsHidden) label += ' (Hidden)';
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
                                const numericValue = Number(value); if (isNaN(numericValue)) return '';
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

    $: { tick().then(() => { if (channelData1 && channelData2 && canvasElement) createOrUpdateChart(); else destroyChart(); }); }
    onDestroy(() => { destroyChart(); });
</script>

<div class="comparison-chart-container"> <canvas bind:this={canvasElement}></canvas> </div>

<style> /* Styles from previous version */
.comparison-chart-container { position: relative; height: 400px; width: 100%; max-width: 700px; margin: 2rem auto; background-color: #111; border: 2px solid #FFD700; padding: 1.5rem; border-radius: 8px; }
canvas { display: block; width: 100%; height: 100%; }
</style>