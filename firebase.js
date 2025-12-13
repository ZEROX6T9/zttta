// ==========================================================
// ZTA – Firebase Setup (FULL FIXED)
// ==========================================================

const firebaseConfig = {
    apiKey: "AIzaSyB7P7DL0zypsux8x0fIf4v0UMNVR30GB_k",
    authDomain: "zta-only.firebaseapp.com",
    projectId: "zta-only",
    storageBucket: "zta-only.firebasestorage.app",
    messagingSenderId: "26521974056",
    appId: "1:26521974056:web:e3bfe3e1bb02fd60ad0c1d",
    measurementId: "G-HR9W0GJ4MT"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const rtdb = firebase.database();


// ==========================================================
// SIGNUP → Create Firestore User Document
// ==========================================================

async function ztaSignup(username, email, password) {
    try {
        const user = await auth.createUserWithEmailAndPassword(email, password);

        await db.collection("users").doc(user.user.uid).set({
            username: username,
            email: email,
            banned: false,
            created: Date.now()
        });

        return { success: true, user: user.user };

    } catch (error) {
        return { success: false, error: error.message };
    }
}


// ==========================================================
// LOGIN + Realtime Presence
// ==========================================================

async function ztaLogin(email, password) {
    try {
        const res = await auth.signInWithEmailAndPassword(email, password);
        const uid = res.user.uid;

        localStorage.setItem("zta_user", uid);

        // presence
        const statusRef = rtdb.ref("status/" + uid);
        statusRef.set({ state: "online", time: Date.now() });
        statusRef.onDisconnect().set({ state: "offline", time: Date.now() });

        return { success: true, user: res.user };

    } catch (e) {
        return { success: false, error: e.message };
    }
}


// ==========================================================
// LOGOUT
// ==========================================================

function ztaLogout() {
    const uid = localStorage.getItem("zta_user");

    if (uid) {
        rtdb.ref("status/" + uid).set({ state: "offline", time: Date.now() });
    }

    auth.signOut();
    localStorage.removeItem("zta_user");
    window.location.href = "login.html";
}


// ==========================================================
// ADMIN LOGIN FIXED
// ==========================================================

const adminMasterPass = "89OQBSADETWNA";

function checkAdminPassword(input) {
    if (input === adminMasterPass) {
        localStorage.setItem("zta_admin_login", "true");
        return true;
    }
    return false;
}

function requireAdmin() {
    if (!localStorage.getItem("zta_admin_login")) {
        window.location.href = "admin-login.html";
    }
}


// ==========================================================
// GLOBAL EXPORT
// ==========================================================

window.ZTA = {
    signup: ztaSignup,
    login: ztaLogin,     // ✔ FIXED
    logout: ztaLogout,

    checkAdminPassword,
    requireAdmin,

    db,
    auth,
    storage,
    rtdb
};
