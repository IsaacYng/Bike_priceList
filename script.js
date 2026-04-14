// Firebase Config - आफ्नो Firebase Console बाट पाएको डाटा यहाँ पेस्ट गर्नुहोस्
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
    // 1. UI Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const profileBtn = document.getElementById('profile-btn');
    const profileDrawer = document.getElementById('profile-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const overlay = document.getElementById('overlay');
    
    const emailField = document.getElementById('email-field');
    const passField = document.getElementById('pass-field');
    const authActionBtn = document.getElementById('auth-action-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const displayDiv = document.getElementById('profile-display');
    const editDiv = document.getElementById('profile-edit-form');

    // 2. Open/Close Drawer Logic
    profileBtn.onclick = () => {
        profileDrawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    };

    const closeAll = () => {
        profileDrawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        mobileMenu.classList.add('hidden');
    };

    closeDrawer.onclick = closeAll;
    overlay.onclick = closeAll;
    mobileMenuBtn.onclick = () => mobileMenu.classList.toggle('hidden');

    // 3. Firebase Auth Logic
    // Google Login
    googleLoginBtn.onclick = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Success!");
        } catch (e) { alert(e.message); }
    };

    // Email/Pass Logic
    authActionBtn.onclick = async () => {
        const email = emailField.value;
        const pass = passField.value;
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (e) {
            try { await signInWithEmailAndPassword(auth, email, pass); }
            catch (err) { alert(err.message); }
        }
    };

    // Sign Out
    logoutBtn.onclick = () => signOut(auth);

    // Watch Auth State
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('disp-name').innerText = user.displayName || user.email;
            if (user.photoURL) {
                document.getElementById('nav-profile-preview').src = user.photoURL;
                document.getElementById('drawer-profile-preview').src = user.photoURL;
            }
            document.getElementById('auth-section').classList.add('hidden');
        } else {
            document.getElementById('auth-section').classList.remove('hidden');
            document.getElementById('disp-name').innerText = "Guest User";
        }
    });

    // 4. Edit Profile Logic
    editBtn.onclick = () => {
        displayDiv.classList.add('hidden');
        editDiv.classList.remove('hidden');
        document.getElementById('edit-name').value = document.getElementById('disp-name').innerText;
    };

    saveBtn.onclick = () => {
        document.getElementById('disp-name').innerText = document.getElementById('edit-name').value;
        document.getElementById('disp-dob').innerText = document.getElementById('edit-dob').value;
        document.getElementById('disp-address').innerText = document.getElementById('edit-address').value;
        document.getElementById('disp-bio').innerText = document.getElementById('edit-bio').value;
        displayDiv.classList.remove('hidden');
        editDiv.classList.add('hidden');
    };

    cancelBtn.onclick = () => {
        displayDiv.classList.remove('hidden');
        editDiv.classList.add('hidden');
    };
});
