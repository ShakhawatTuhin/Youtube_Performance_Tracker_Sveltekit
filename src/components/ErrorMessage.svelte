<!-- src/components/ErrorMessage.svelte -->
<script lang="ts">
    // Ensure the type explicitly allows string or null/undefined
    export let message: string | null | undefined = null;
</script>

{#if message}
    <div class="error-message">
        <p>{message}</p>
    </div>
{/if}

<style>
    /* styles... */
</style>