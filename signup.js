// SignUp FireBase JS: 

import { app } from "/JSfirebase-config.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const email = document.getElementById('email');
const password = document.getElementById('password');
const Confirmpassword = document.getElementById('confirm-password');
const signupbtn = document.querySelector('#signup-btn')
const registerBtn = document.getElementById('register-btn');
const formoverlaydiv = document.querySelector('.form-overlay-div');
const closesignupBtn = document.querySelector('.close-signupBtn');
const phone = document.querySelector('#phone');
const phoneError = document.querySelector('.login-phone-error');


registerBtn.addEventListener('click', () => {
    formoverlaydiv.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});
closesignupBtn.addEventListener('click', () => {
    formoverlaydiv.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.querySelector('.email-error').innerText = '';
    document.querySelector('.password-error2').innerText = '';
    document.querySelector('.confirm-password-error').innerText = '';



})

function checkValidationSignUp() {
    let getEmail = email.value.trim();
    let getPassword = password.value.trim();
    let getConfirmPassword = Confirmpassword.value.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let isValidSignUp = true;

    document.querySelector('.email-error').innerText = '';
    document.querySelector('.password-error2').innerText = '';
    document.querySelector('.confirm-password-error').innerText = '';



    if (getEmail === "") {
        document.querySelector('.email-error').innerText = 'Email required';
        isValidSignUp = false;
    }
    else if (!emailRegex.test(getEmail)) {
        document.querySelector('.email-error').innerText = 'Invalid email';
        isValidSignUp = false;
    }

    if (getPassword === "") {
        document.querySelector('.password-error2').innerText = 'Password required';
        isValidSignUp = false
    }

    else if (getPassword.length < 8) {
        document.querySelector('.password-error2').innerText = 'Too short (at least 8 char)';
        isValidSignUp = false
    }
    else if (getPassword.length > 20) {
        document.querySelector('.password-error2').innerText = 'Too long (maximum 20 char)';
        isValidSignUp = false
    }

    if (getConfirmPassword === "") {
        document.querySelector('.confirm-password-error').innerText = 'Confirm Password required';
        isValidSignUp = false
    }
    else if (getConfirmPassword !== getPassword) {
        document.querySelector('.confirm-password-error').innerText = 'Confirm password should be same to Password';
        isValidSignUp = false
    }

    if (isValidSignUp) {
        createUserWithEmailAndPassword(auth, getEmail, getPassword)
            .then(async (userCredential) => {
                const user = userCredential.user;

                try {
                    await setDoc(doc(db, "users", user.uid), {
                        firstName: 'User',
                        // lastName: 'Azeem',
                        email: getEmail,
                        // phone: getPhone,
                        // cnic: getCnic,
                        // gender: GenderValue,
                        createdAt: new Date()
                    });

                    alert("Signup successful");
                    window.location.href = "index.html";
                } catch (firestoreError) {
                    alert("Signup succeeded but failed to save info: " + firestoreError.message);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/email-already-in-use') {
                    document.querySelector('.email-error').innerText = 'This email is already registered';
                } else if (errorCode === 'auth/invalid-email') {
                    document.querySelector('.email-error').innerText = 'Invalid email format';
                } else if (errorCode === 'auth/weak-password') {
                    document.querySelector('.password-error2').innerText = 'Weak password. Try a stronger one';
                } else {
                    alert("Signup failed: " + errorMessage);
                }
            });
    }

}

email.addEventListener('input', () => {
    document.querySelector('.email-error').innerText = '';
});

password.addEventListener('input', () => {
    document.querySelector('.password-error2').innerText = '';
});
Confirmpassword.addEventListener('input', () => {
    document.querySelector('.confirm-password-error').innerText = '';
});

phone.addEventListener('input', function () {
    phoneError.innerText = ''
})


if (signupbtn) {
    signupbtn.addEventListener('click', function (e) {
        e.preventDefault()
        checkValidationSignUp()
    });
}
