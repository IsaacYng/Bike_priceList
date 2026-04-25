import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
    // We use a query to make sure the order is correct
    // If you have a 'createdAt' field in Firebase, it's even better!
    onSnapshot(bikesCol, (snapshot) => {
        // Mapping data and keeping the Firebase order
        allBikes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // This ensures: First Added -> Top, Second Added -> Next
        renderBikes(allBikes); 
    });
}

function renderBikes(bikes) {
    let container = document.getElementById("bike-container");
    if (container) {
        if (bikes.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center text-gray-400 py-10">No bikes in stock.</p>`;
            return;
        }

        container.innerHTML = bikes.map(bike => `
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div class="h-52 bg-slate-50 flex items-center justify-center p-4">
                    <img src="${bike.img || 'https://cdn-icons-png.flaticon.com/512/8163/8163149.png'}" 
                         alt="${bike.name}" 
                         class="h-full object-contain hover:scale-105 transition-transform duration-500">
                </div>
                
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-bold text-slate-800">${bike.name}</h3>
                        <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Verified</span>
                    </div>

                    <p class="text-sm text-gray-500 mb-6 flex items-center">
                        <i class="fa-solid fa-shield-halved mr-2 text-blue-500"></i>
                        Insurance: Rs. ${bike.Insurance || '0'}
                    </p>
                    
                    <div class="pt-4 border-t border-dashed border-gray-200">
                        <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total MRP Price</p>
                        <p class="text-3xl font-black text-red-600 tracking-tight">
                            <span class="text-sm mr-1 font-bold italic">Rs.</span>${parseFloat(bike.price).toLocaleString()}
                        </p>
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

document.getElementById('search-input')?.addEventListener('input', window.searchBikes);

startApp();
