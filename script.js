import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot, deleteDoc, doc, addDoc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXQW4khEovrBUtP5JpYFTUch_p5KT-8F8",
    authDomain: "first-project-2082-12-26.firebaseapp.com",
    projectId: "first-project-2082-12-26",
    appId: "1:545170954251:web:0d2f7905834af3b0be8f0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentEditId = null; 
let allMasterBikes = []; 

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'flex';
        loadProfile(user.uid);
        loadMasterPriceList();
        loadLiveStock();
    } else {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('admin-section').style.display = 'none';
    }
});

// --- 1. MASTER PRICE SETUP ---
function loadMasterPriceList() {
    onSnapshot(collection(db, "bikes"), (snap) => {
        allMasterBikes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const tableBody = document.getElementById('masterTableBody');
        const select = document.getElementById('stockModelSelect');

        let rows = "";
        let options = '<option value="">-- Select Model --</option>';

        allMasterBikes.forEach(b => {
            rows += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-8 py-4">
                        <div class="flex items-center gap-4">
                            <img src="${b.img || 'favicon.png'}" class="w-12 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200 shadow-sm">
                            <span class="font-bold text-slate-800">${b.name}</span>
                        </div>
                    </td>
                    <td class="px-8 py-4 font-semibold text-slate-700 font-mono">Rs. ${Number(b.price).toLocaleString()}</td>
                    <td class="px-8 py-4 text-slate-500 font-mono">Rs. ${Number(b.Insurance || 0).toLocaleString()}</td>
                    <td class="px-8 py-4 text-slate-500 font-mono">Rs. ${Number(b.financeInsurance || 0).toLocaleString()}</td>
                    <td class="px-8 py-4 text-right">
                        <button onclick="editMaster('${b.id}')" class="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all mr-2"><i class="fa fa-edit"></i></button>
                        <button onclick="deleteEntry('bikes', '${b.id}')" class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`;
            options += `<option value="${b.name}">${b.name}</option>`;
        });
        tableBody.innerHTML = rows;
        select.innerHTML = options;
    });
}

window.editMaster = (id) => {
    const bike = allMasterBikes.find(b => b.id === id);
    if(bike) {
        document.getElementById('mName').value = bike.name;
        document.getElementById('mPrice').value = bike.price;
        document.getElementById('mNormalIns').value = bike.Insurance || 0;
        document.getElementById('mFinanceIns').value = bike.financeInsurance || 0;
        document.getElementById('mImg').value = bike.img || "";
        currentEditId = id;
        document.getElementById('saveModelBtn').innerText = "Update Model Info";
        document.getElementById('saveModelBtn').classList.replace('bg-slate-900', 'bg-indigo-600');
        switchTab('tab-price'); 
    }
};

document.getElementById('saveModelBtn').onclick = async () => {
    const data = {
        name: document.getElementById('mName').value,
        price: Number(document.getElementById('mPrice').value),
        Insurance: Number(document.getElementById('mNormalIns').value) || 0,
        financeInsurance: Number(document.getElementById('mFinanceIns').value) || 0,
        img: document.getElementById('mImg').value
    };

    if(!data.name || !data.price) return alert("Please enter at least Name and Price!");

    try {
        if(currentEditId) {
            await updateDoc(doc(db, "bikes", currentEditId), data);
            currentEditId = null;
            document.getElementById('saveModelBtn').innerText = "Save to Master List";
            document.getElementById('saveModelBtn').classList.replace('bg-indigo-600', 'bg-slate-900');
        } else {
            await addDoc(collection(db, "bikes"), data);
        }
        alert("Operation Successful!");
        clearMasterForm();
    } catch(e) { alert(e.message); }
};

function clearMasterForm() {
    ['mName', 'mPrice', 'mNormalIns', 'mFinanceIns', 'mImg'].forEach(id => document.getElementById(id).value = "");
}

// --- 2. LIVE STOCK ---
document.getElementById('saveStockBtn').onclick = async () => {
    const modelName = document.getElementById('stockModelSelect').value;
    const bikeInfo = allMasterBikes.find(b => b.name === modelName);

    if(!modelName || !bikeInfo) return alert("Please select a valid model!");

    await addDoc(collection(db, "inventory"), {
        model: modelName,
        price: bikeInfo.price, 
        regNo: document.getElementById('sRegNo').value,
        chassis: document.getElementById('sChassis').value,
        engine: document.getElementById('sEngine').value,
        color: document.getElementById('sColor').value,
        addedAt: new Date()
    });
    alert("Stock Added!");
    ['sRegNo', 'sChassis', 'sEngine', 'sColor'].forEach(id => document.getElementById(id).value = "");
};

function loadLiveStock() {
    onSnapshot(collection(db, "inventory"), (snap) => {
        const tableBody = document.getElementById('stockTableBody');
        let rows = "";
        snap.docs.forEach(d => {
            const s = d.data();
            rows += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-8 py-5">
                        <div class="font-bold text-slate-800">${s.model}</div>
                        <div class="text-[11px] text-indigo-600 font-bold uppercase tracking-wider">Rs. ${Number(s.price).toLocaleString()}</div>
                    </td>
                    <td class="px-8 py-5 font-mono text-xs">${s.chassis}</td>
                    <td class="px-8 py-5 font-mono text-xs text-slate-500">${s.engine}</td>
                    <td class="px-8 py-5 font-semibold text-slate-700">${s.regNo || 'N/A'}</td>
                    <td class="px-8 py-5">
                        <span class="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600 border border-slate-200">${s.color}</span>
                    </td>
                    <td class="px-8 py-5 text-right">
                        <button onclick="deleteEntry('inventory', '${d.id}')" class="h-9 w-9 text-red-400 hover:bg-red-50 rounded-xl transition-all"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`;
        });
        tableBody.innerHTML = rows;
    });
}

// --- 3. GLOBAL FUNCTIONS ---
window.deleteEntry = async (col, id) => {
    if(confirm("Are you sure you want to delete this permanently?")) {
        await deleteDoc(doc(db, col, id));
    }
};

async function loadProfile(uid) {
    try {
        const docSnap = await getDoc(doc(db, "profiles", uid));
        if (docSnap.exists()) {
            const d = docSnap.data();
            document.getElementById('headerUserName').innerText = d.name || "Admin";
            document.getElementById('dispRole').innerText = d.role || "Sales Advisor";
        }
    } catch(e) { console.error("Profile load error", e); }
}

document.getElementById('logoutBtn').onclick = () => signOut(auth);
document.getElementById('loginBtn').onclick = () => {
    signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('pass').value).catch(err => alert("Login Failed: " + err.message));
};
