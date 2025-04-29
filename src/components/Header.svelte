<script lang="ts">
    import { page } from '$app/stores';
</script>

<header>
    <nav>
        <a href="/" class:active={$page.url.pathname === '/'}>Tracker</a>
        <a href="/history" class:active={$page.url.pathname === '/history'}>History</a>
        <a href="/about" class:active={$page.url.pathname === '/about'}>About</a>
    </nav>
</header>

<style>
    header {
        background-color: #111;
        padding: 1rem 2rem;
        border-bottom: 2px solid #FFD700;
        margin-bottom: 2rem; /* add space below header */
    }
    nav {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }
    a {
        color: #FFD700;
        text-decoration: none;
        font-size: 1.1rem;
        font-weight: bold;
        padding: 0.5rem 0;
        border-bottom: 2px solid transparent;
        transition: border-color 0.2s ease, color 0.2s ease;
    }
    a:hover {
        color: #fff;
    }
    a.active {
        color: #fff; /* white color for active link */
        border-bottom-color: #fff;
    }
</style>