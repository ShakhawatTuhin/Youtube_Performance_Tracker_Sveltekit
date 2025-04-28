<!-- src/routes/about/+page.svelte -->
<svelte:head>
    <title>About - YouTube Tracker</title>
</svelte:head>

<div class="about-container">
    <h1>About This Project</h1>

    <p>
        This YouTube Performance Tracker is a demonstration project built with SvelteKit.
        It allows users to look up lifetime statistics for YouTube channels and compare
        two channels side-by-side using data fetched from the official YouTube Data API v3.
    </p>

    <h2>Features</h2>
    <ul>
        <li>Search channels by ID, @handle, or full URL.</li>
        <li>View lifetime Subscribers, Views, and Video Count.</li>
        <li>Visual comparison of two channels using bar charts (powered by Chart.js).</li>
        <li>Handles large differences in stats using logarithmic scales on charts.</li>
        <li>Responsive design.</li>
        <li>Stores search history server-side (using a simple JSON file in this version).</li>
    </ul>

    <h2>Technology Stack</h2>
    <ul>
        <li>Framework: SvelteKit</li>
        <li>Language: TypeScript</li>
        <li>Charting: Chart.js</li>
        <li>Styling: CSS (within Svelte components)</li>
        <li>API: YouTube Data API v3</li>
        <li>Server-side Storage: Node.js File System (fs/promises)</li>
    </ul>

    <h2>Disclaimer</h2>
    <p>
        Statistics are fetched directly from the YouTube Data API and reflect lifetime totals provided by Google.
        API usage is subject to Google's quotas and terms of service. Ensure you have a valid API key configured
        in your environment variables. Subscriber counts may be hidden by channel owners.
    </p>

</div>

<style>
    .about-container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: #1a1a1a;
        border: 1px solid #FFD700;
        border-radius: 8px;
        color: #eee;
    }

    h1, h2 {
        color: #FFD700;
        border-bottom: 1px solid #444;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
        text-align: left;
    }

    p, li {
        line-height: 1.6;
        margin-bottom: 1rem;
    }

    ul {
        list-style: disc;
        margin-left: 2rem;
    }

    h2:last-of-type { /* Disclaimer heading */
        margin-top: 2rem;
    }
</style>