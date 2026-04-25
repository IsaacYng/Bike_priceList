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
        allBikes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderBikes(allBikes); 
    });
}

function renderBikes(bikes) {
    let container = document.getElementById("bike-container");
    if (container) {
        if (bikes.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-gray-400 italic">No bikes found matching your search.</p>
                </div>`;
            return;
        }

        container.innerHTML = bikes.map(bike => `
            <div class="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="h-48 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                    <img src="${bike.img || 'https://cdn-icons-png.flaticon.com/512/8163/8163149.png'}" 
                         alt="${bike.name}" 
                         class="h-full object-contain group-hover:scale-110 transition-transform duration-500">
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-bold text-slate-800 mb-1">${bike.name}</h3>
                    <p class="text-sm text-gray-500 mb-4 flex items-center">
                        <i class="fa-solid fa-shield-halved mr-2 text-blue-500"></i>
                        Insurance: <span class="ml-1 font-semibold text-slate-700">Rs. ${bike.Insurance || '0'}</span>
                    </p>
                    
                    <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                        <div>
                            <p class="text-xs uppercase tracking-wider text-gray-400 font-bold">MRP Price</p>
                            <p class="text-2xl font-black text-red-600">Rs. ${parseFloat(bike.price).toLocaleString()}</p>
                        </div>
                        <button class="bg-slate-900 text-white p-3 rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-slate-200">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Search Logic
window.searchBikes = function() {
    const input = document.getElementById('search-input');
    if (!input) return;

    const filter = input.value.toLowerCase();
    const filteredBikes = allBikes.filter(bike => 
        bike.name.toLowerCase().includes(filter)
    );

    renderBikes(filteredBikes);
};

// Add listener to the search input for real-time typing search
document.getElementById('search-input')?.addEventListener('input', window.searchBikes);

startApp();
