<script lang="ts">
    import Header from '../components/Header.svelte';
    import Footer from '../components/Footer.svelte';
</script>

<div class="app-container">
    <Header />
    <main class="main-content">
        <slot />
    </main>
    <Footer />
</div>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #000;
        color: #FFD700;
    }

    .main-content {
        flex: 1; /* allows main content to grow and push footer down */
        padding: 0 2rem;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    /* add some base styles if not using app.css */
    :global(body) {
        margin: 0;
        font-family: sans-serif;
        background-color: #000; /* ensure body bg matches */
    }
    :global(h1, h2, h3) {
        color: #FFD700; 
        text-align: center;
    }
</style>