// Wait for the page to fully load
window.addEventListener('load', () => {
    // Hide the loading screen once the page has finished loading
    document.getElementById('loading-screen').style.display = 'none';

    // Show the main content
    document.getElementById('content').style.display = 'block';
});
