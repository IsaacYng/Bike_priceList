document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('login-progress');
    const greeting = document.getElementById('dynamic-greeting');
    
    // 1. Set Greeting based on Nepal Time
    const hour = new Date().getHours();
    if (hour < 12) greeting.innerText = "Good Morning";
    else if (hour < 18) greeting.innerText = "Good Afternoon";
    else greeting.innerText = "Good Evening";

    // 2. Loading Animation
    let progressValue = 0;
    const interval = setInterval(() => {
        progressValue += Math.floor(Math.random() * 15) + 5; // Random jump for realism
        
        if (progressValue >= 100) {
            progressBar.value = 100;
            clearInterval(interval);
            
            // 3. Redirect to dashboard
            setTimeout(() => {
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            }, 500);
        } else {
            progressBar.value = progressValue;
        }
    }, 300); // Speed of loading
});
