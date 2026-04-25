import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXQW4khEovrBUtP5JpYFTUch_p5KT-8F8",
    authDomain: "first-project-2082-12-26.firebaseapp.com",
    projectId: "first-project-2082-12-26",
    storageBucket: "first-project-2082-12-26.firebasestorage.app",
    messagingSenderId: "545170954251",
    appId: "1:545170954251:web:0d2f7905834af3b0be8f0e",
    measurementId: "G-17X7R542YC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Logic to check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is already logged in:", user.email);
        // If you want them to skip login page if already logged in:
        // window.location.href = "admin.html";
    }
});

// Login Function
const loginBtn = document.getElementById('loginBtn');
if(loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if(!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "admin.html"; // Redirect to your other project
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
}

// Show/Hide Password Toggle
const toggleBtn = document.getElementById('togglePass');
if(toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const passInput = document.getElementById('password');
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        toggleBtn.querySelector('i').classList.toggle('fa-eye');
        toggleBtn.querySelector('i').classList.toggle('fa-eye-slash');
    });
}
