import { app } from "JSfirebase-config.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);



onAuthStateChanged(auth, async (user) => {
    const dropdown = document.querySelector(".custom-dropdown");
    const loginSignupBtn = document.querySelector("#loginSignup-li");

    if (!dropdown || !loginSignupBtn) return;

    if (user) {
        dropdown.style.display = "block";
        loginSignupBtn.style.display = "none";

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            let firstName = "";
            let lastName = "";
            let email = user.email || "";
            let phone = "";
            let cnic = "";
            let gender = "";

            if (userDoc.exists()) {
                // User signed up via form — fetch full details from Firestore
                const userData = userDoc.data();
                firstName = userData.firstName;
                lastName = userData.lastName;
                email = userData.email;
                phone = userData.phone;
                cnic = userData.cnic;
                gender = userData.gender;
            } else {
                // Social login fallback (Google, GitHub, Facebook)
                const displayName = user.displayName || "User";
                const nameParts = displayName.split(" ");
                firstName = nameParts[0];
                lastName = nameParts[1] || "";
            }

            // Store data in localStorage for later use
            localStorage.setItem("first-name", firstName);
            localStorage.setItem("last-name", lastName);
            localStorage.setItem("email", email);
            localStorage.setItem("phone", phone);
            localStorage.setItem("cnic", cnic);
            localStorage.setItem("gender", gender);

            document.getElementById("customDropdownBtn").innerHTML =
                `<span><i class="fa-solid fa-user"></i></span> ${firstName} <i class="fa-solid fa-caret-down"></i>`;
            document.querySelector('.switch-to-admin').style.display = 'block';

        } catch (error) {
            console.error("Error fetching user data:", error);
        }

    } else {
        dropdown.style.display = "none";
        loginSignupBtn.style.display = "block";
    }
});

// Logout
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector('#log-out');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                alert("Logged out!");
                window.location.href = "index.html";
            });
        });
    }
});

export { auth, db };
