// redeem.js – ZTA Cosmic Rank Redemption System (15-letter codes)
// Works with your 15-letter codes: PLANETHUNTERZTA, COSMOSMASTERZTA, etc.

document.getElementById("redeemForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputCode = document.getElementById("code").value.trim().toUpperCase();
    const status = document.getElementById("statusMessage");

    // Validate: exactly 15 uppercase letters
    if (inputCode.length !== 15 || !/^[A-Z]+$/.test(inputCode)) {
        status.textContent = "Code must be exactly 15 letters (A-Z only)";
        status.className = "status-message error";
        return;
    }

    try {
        const docRef = firebase.firestore().collection("redeemCodes").doc(inputCode);
        const doc = await docRef.get();

        if (!doc.exists) {
            status.textContent = "Invalid code. Not found.";
            status.className = "status-message error";
            return;
        }

        const data = doc.data();

        if (data.used === true) {
            status.textContent = "This code has already been claimed!";
            status.className = "status-message error";
            return;
        }

        const user = firebase.auth().currentUser;

        // Mark code as used
        await docRef.update({
            used: true,
            usedBy: user.uid,
            usedAt: new Date()
        });

        // Grant the cosmic rank
        await firebase.firestore().collection("users").doc(user.uid).set({
            role: data.role
        }, { merge: true });

        // Success message
        status.innerHTML = `
            <div style="font-size:32px; margin:20px 0;">CLAIMED!</div>
            <div style="font-size:40px; color:#9acd32; text-shadow:0 0 30px #9acd32; font-weight:bold;">
                ${data.role}
            </div>
            <div style="margin-top:20px; color:#aaa;">Your rank is now permanent</div>
        `;
        status.className = "status-message success";
        document.getElementById("code").value = "";

    } catch (err) {
        console.error("Redeem error:", err);
        status.textContent = "Something went wrong. Try again.";
        status.className = "status-message error";
    }
});