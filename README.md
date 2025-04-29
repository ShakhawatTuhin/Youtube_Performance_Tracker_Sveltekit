# YouTube Channel Performance Tracker (SvelteKit)

This project is a YouTube channel statistics tracker built using the SvelteKit framework. It allows users to retrieve lifetime performance data (Subscribers, Views, Videos) for any public YouTube channel using the YouTube Data API v3. Comparisons between two channels are visualized using Chart.js.

**View the live deployment on Vercel:** [https://youtube-performance-tracker-sveltekit.vercel.app/](https://youtube-performance-tracker-sveltekit.vercel.app/)

## Key Technologies

*   **Framework:** SvelteKit
*   **Language:** TypeScript
*   **API:** YouTube Data API v3
*   **Charting:** Chart.js
*   **Styling:** Component-scoped CSS
*   **Backend API (History):** Node.js (via SvelteKit endpoints)
*   **Deployment:** Vercel

## Functionality

*   Input channel identifiers (ID, @handle, URL).
*   Resolve handles/URLs to Channel IDs via YouTube Search API.
*   Fetch channel snippet and statistics via YouTube Channels API.
*   Display single channel stats with a bar chart.
*   Display two-channel comparison with a grouped bar chart.
*   Logarithmic scales used for charts with large data variance.
*   Basic search history stored server-side (Note: uses local file storage, persistence limited on platforms like Vercel).
*   Multiple routes (`/`, `/history`, `/about`).