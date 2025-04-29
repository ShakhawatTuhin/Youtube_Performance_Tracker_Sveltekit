<div class="spinner-container">
    <div class="spinner"></div>
    <p><slot>Loading...</slot></p>
</div>

<style>
    .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #FFD700;
    }
    .spinner {
        border: 4px solid rgba(255, 215, 0, 0.3); /* light gold border, for color blind people */
        border-left-color: #FFD700;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    p {
        margin: 0;
        font-size: 1rem;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>