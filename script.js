document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const profileBtn = document.getElementById('profile-btn');
    const profileDrawer = document.getElementById('profile-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const overlay = document.getElementById('overlay');

    // Toggle Mobile Menu (3-dot)
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Open Profile Drawer
    profileBtn.addEventListener('click', () => {
        profileDrawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    });

    // Close Profile Drawer
    const hideDrawer = () => {
        profileDrawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    };

    closeDrawer.addEventListener('click', hideDrawer);
    overlay.addEventListener('click', hideDrawer);
});
                          
