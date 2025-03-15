// Wait for the page to fully load
window.addEventListener('load', () => {
    // Set a delay to simulate slow loading for testing (e.g., 3 seconds)
    setTimeout(() => {
        // Hide the loading screen after the delay
        document.getElementById('loading-screen').style.display = 'none';

        // Show the main content
        document.getElementById('content').style.display = 'block';
    }, 30000);  // 3000 milliseconds = 3 seconds
});
