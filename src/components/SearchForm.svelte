<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';

    export let isLoading: boolean = false;
    export let formType: 'single' | 'compare'; // determines which inputs to show

    let input1 = '';
    let input2 = '';

    const dispatch = createEventDispatcher();

    function handleSubmit() {
        if (isLoading) return;

        if (formType === 'single') {
            if (input1.trim()) {
                dispatch('search', { value: input1.trim() });
            }
        } else {
            if (input1.trim() && input2.trim()) {
                dispatch('compare', { value1: input1.trim(), value2: input2.trim() });
            }
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }
</script>

<div class="search-form-container">
    <div class="input-group">
        <input
                type="text"
                bind:value={input1}
                placeholder={formType === 'single' ? "Channel ID, @handle, or URL" : "First Channel ID, @handle, or URL"}
                disabled={isLoading}
                on:keydown={handleKeydown}
        />
        {#if formType === 'compare'}
            <input
                    type="text"
                    bind:value={input2}
                    placeholder="Second Channel ID, @handle, or URL"
                    disabled={isLoading}
                    on:keydown={handleKeydown}
            />
        {/if}
    </div>

    <button on:click={handleSubmit} disabled={isLoading || (formType === 'single' && !input1.trim()) || (formType === 'compare' && (!input1.trim() || !input2.trim()))}>
        {#if isLoading}
            <LoadingSpinner>Processing...</LoadingSpinner>
        {:else if formType === 'single'}
            Search
        {:else}
            Compare
        {/if}
    </button>
</div>

<style>
    .search-form-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        max-width: 400px; /* adjust max width */
    }

    input {
        padding: 0.75rem;
        border-radius: 4px;
        border: 1px solid #FFD700;
        background: #111;
        color: #FFD700;
        width: 100%;
        font-size: 1rem;
        box-sizing: border-box;
        text-align: center;
    }

    input:disabled {
        background-color: #333;
        cursor: not-allowed;
    }

    button {
        padding: 0.6rem 1.5rem;
        border-radius: 4px;
        border: 1px solid #FFD700;
        background-color: #FFD700;
        color: #000;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
        min-width: 120px;
        min-height: 48px; /* ensure button height matches inputs roughly */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button:hover:not(:disabled) {
        background-color: #333;
        color: #FFD700;
    }

    button:disabled {
        cursor: not-allowed;
        background-color: #555;
        border-color: #777;
        color: #aaa;
    }

    /* style loading spinner inside the button */
    button:disabled > :global(.spinner-container) {
        padding: 0;
        transform: scale(0.6); /* make spinner smaller inside the button */
    }
    button:disabled > :global(.spinner-container p) {
        font-size: 0.9em; /* smaller text */
        margin-left: 0.5rem;
    }
    button:disabled > :global(.spinner) {
        width: 20px;
        height: 20px;
        border-width: 3px;
        margin-bottom: 0;
    }
</style>