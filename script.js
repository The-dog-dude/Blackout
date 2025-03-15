// Wait for the page to fully load
window.addEventListener('load', () => {
    // Simulate slower load time (you can adjust the delay)
    setTimeout(() => {
        // Commented out this line to keep the loading screen visible for testing
        // document.getElementById('loading-screen').style.display = 'none';

        // Show the main content
        document.getElementById('content').style.display = 'block';
    }, 5000);  // 5000 milliseconds = 5 seconds (you can adjust the time)
});
