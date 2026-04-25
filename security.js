<script type="module">
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

  // Initialize
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // --- LOGIN FUNCTION ---
  window.handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user);
      // Redirect to your admin page after successful login
      window.location.href = "admin.html"; 
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };
</script>
