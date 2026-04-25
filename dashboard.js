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
                <div class="col-span-full text-center py-20">
                    <i class="fa-solid fa-motorcycle text-gray-200 text-6xl mb-4"></i>
                    <p class="text-gray-400">No bikes found in the showroom.</p>
                </div>`;
            return;
        }

        container.innerHTML = bikes.map(bike => `
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div class="relative h-56 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
                    <div class="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest"><i class="fa-solid fa-bolt mr-1"></i> New Model</span>
                    </div>
                    <img src="${bike.img || 'https://cdn-icons-png.flaticon.com/512/8163/8163149.png'}" 
                         alt="${bike.name}" 
                         class="h-full object-contain group-hover:scale-110 transition-transform duration-500">
                </div>
                
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight leading-tight">${bike.name}</h3>
                        <i class="fa-solid fa-circle-check text-blue-500 text-lg"></i>
                    </div>

                    <div class="space-y-3 mb-6">
                        <div class="flex items-center text-sm text-slate-500">
                            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                                <i class="fa-solid fa-shield-halved text-blue-600"></i>
                            </div>
                            <span class="font-medium">Insurance: <span class="text-slate-900 font-bold">Rs. ${bike.Insurance || '0'}</span></span>
                        </div>
                        
                        <div class="flex items-center text-sm text-slate-500">
                            <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                                <i class="fa-solid fa-tag text-green-600"></i>
                            </div>
                            <span class="font-medium">Status: <span class="text-green-600 font-bold">Available Now</span></span>
                        </div>
                    </div>
                    
                    <div class="pt-5 border-t border-dashed border-gray-200">
                        <div class="flex items-baseline justify-between">
                            <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">MRP Total Price</span>
                            <i class="fa-solid fa-receipt text-gray-300"></i>
                        </div>
                        <div class="text-3xl font-black text-slate-900 mt-1 flex items-center">
                            <span class="text-lg mr-2 text-red-600">Rs.</span>
                            ${parseFloat(bike.price).toLocaleString()}
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
