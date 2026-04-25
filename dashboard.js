import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXQW4khEovrBUtP5JpYFTUch_p5KT-8F8",
  authDomain: "first-project-2082-12-26.firebaseapp.com",
  projectId: "first-project-2082-12-26",
  storageBucket: "first-project-2082-12-26.firebasestorage.app",
  messagingSenderId: "545170954251",
  appId: "1:545170954251:web:0d2f7905834af3b0be8f0e",
  measurementId: "G-17X7R542YC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const bikesCol = collection(db, "bikes");

let allBikes = []; 

function startApp() {
    onSnapshot(bikesCol, (snapshot) => {
        // We take the data exactly as it is in the database
        allBikes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderBikes(allBikes); 
    });
}

function renderBikes(bikes) {
    let container = document.getElementById("bike-container");
    if (container) {
        if (bikes.length === 0) {
            container.innerHTML = "<p class='col-span-full text-center py-10 text-gray-400'>No bikes found.</p>";
            return;
        }

        container.innerHTML = bikes.map(bike => `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                <div class="h-48 bg-slate-50 flex items-center justify-center p-4">
                    <img src="${bike.img || 'https://cdn-icons-png.flaticon.com/512/8163/8163149.png'}" 
                         alt="${bike.name}" 
                         class="h-full object-contain">
                </div>
                
                <div class="p-5">
                    <h3 class="text-xl font-bold text-slate-800 uppercase tracking-tight">${bike.name}</h3>
                    <p class="text-sm text-gray-500 mt-1">Insurance: Rs. ${bike.Insurance || '0'}</p>
                    
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">MRP Price</span>
                        <div class="text-2xl font-black text-black-600">
                            Rs. ${parseFloat(bike.price).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Search Functionality
window.searchBikes = function() {
    const input = document.getElementById('search-input');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const filteredBikes = allBikes.filter(bike => bike.name.toLowerCase().includes(filter));
    renderBikes(filteredBikes);
};

document.getElementById('search-input')?.addEventListener('input', window.searchBikes);

startApp();
