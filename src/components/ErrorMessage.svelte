<script lang="ts">
    export let message: string | null | undefined = null;
</script>

{#if message}
    <div class="error-message">
        <p>{message}</p>
    </div>
{/if}

<style>

</style>