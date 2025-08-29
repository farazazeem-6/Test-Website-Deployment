// import { auth, db } from "/JS-auth-check-js/auth-check.js";
// import {
//     updateEmail,
//     updatePassword,
//     onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// import {
//     doc,
//     updateDoc
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// document.addEventListener("DOMContentLoaded", function () {
//     const cnicInput = document.getElementById("cnic");
//     cnicInput.addEventListener("input", function (e) {
//         let value = e.target.value.replace(/[^0-9]/g, "");

//         if (value.length > 5 && value.length <= 12) {
//             value = value.slice(0, 5) + "-" + value.slice(5);
//         } else if (value.length > 12) {
//             value = value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12, 13);
//         }

//         e.target.value = value;
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     const phoneInput = document.getElementById('phone');
//     phoneInput.addEventListener('input', function (e) {
//         let value = e.target.value.replace(/[^0-9]/g, ""); // Only digits

//         if (value.length > 4) {
//             value = value.slice(0, 4) + "-" + value.slice(4, 11);
//         }

//         e.target.value = value;
//     })
// });


// const updateBtn = document.querySelector(".Update-Btn");

// const firstName = document.getElementById("first-name")
// const lastName = document.getElementById("last-name")
// const email = document.getElementById("email")
// const phone = document.getElementById("phone")
// const cnic = document.getElementById("cnic")
// const gender = document.getElementById("Gender")
// updateBtn.addEventListener("click", async (e) => {
//     e.preventDefault();


//     const street = document.getElementById("street-no")
//     const city = document.getElementById("city-name")
//     const state = document.getElementById("state")
//     const zipCode = document.getElementById("zip-code")


//     const firstNameValue = firstName.value.trim();
//     const lastNameValue = lastName.value.trim();
//     const emailValue = email.value.trim();
//     const phoneValue = phone.value.trim();
//     const cnicValue = cnic.value.trim();
//     const genderValue = gender.value.trim();

//     let isValid = true;

//     if (firstNameValue.length < 3 || firstName.length > 20) {
//         document.querySelector('.first-name-error').innerText = 'A valid name required';

//         isValid = false;
//     }

//     if (lastNameValue.length < 3 || lastName.length > 20) {
//         document.querySelector('.last-name-error').innerText = 'A valid name required';
//         isValid = false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(emailValue)) {
//         document.querySelector('.email-error').innerText = 'Invalid email';
//         isValid = false;
//     }

//     const phoneRegex = /^03\d{9}$/;
//     if (phoneValue === '') {
//         document.querySelector('.phone-no-error').innerText = 'Enter phone number';
//         isValid = false;
//     }

//     const cnicRegex = /^\d{13}$/;
//     if (cnicValue === '') {
//         document.querySelector('.cnic-error').innerText = 'CNIC required';
//         isValid = false;
//     }

//     if (genderValue === "") {
//         document.querySelector('.gender-error').innerText = 'Choose a Gender';
//         isValid = false;
//     }


//     if (!isValid) return;

//     // Proceed to update if validation passed
//     // onAuthStateChanged(auth, async (user) => {
//     //     if (!user) {
//     //         alert("User not logged in!");
//     //         return;
//     //     }

//     //     const userRef = doc(db, "users", user.uid);

//     //     try {
//     //         // Update email if changed
//     //         if (email !== user.email) {
//     //             await updateEmail(user, email);
//     //         }

//     //         // Update password if provided
//     //         if (password) {
//     //             await updatePassword(user, password);
//     //         }

//     //         // Update Firestore document
//     //         await updateDoc(userRef, {
//     //             firstName,
//     //             lastName,
//     //             email,
//     //             phone,
//     //             cnic,
//     //             gender,
//     //         
//     //         });

//     //         alert("Profile updated successfully!");
//     //     } catch (error) {
//     //         console.error("Error updating profile:", error);
//     //         alert("Error: " + error.message);
//     //     }
//     // });
// });


let headingName = document.getElementById('heading-name')
const firstName1 = localStorage.getItem('first-name');
// const lastName1 = localStorage.getItem('last-name');
const email1 = localStorage.getItem('email');
const phone1 = localStorage.getItem('phone');
const cnic1 = localStorage.getItem('cnic');
const gender1 = localStorage.getItem('gender');






window.onload = function () {
    document.getElementById("first-name").value = firstName1;
    // document.getElementById("last-name").value = lastName1;
    document.getElementById("email").value = email1;
    document.getElementById("phone").value = phone1;
    document.getElementById("cnic").value = cnic1 || 'Not provided';
    headingName.innerText = `${firstName1}`
};


// firstName.addEventListener('click', function () {
//     document.querySelector('.first-name-error').innerText = '';
// });
// lastName.addEventListener('click', function () {
//     document.querySelector('.last-name-error').innerText = '';
// });
// email.addEventListener('click', function () {
//     document.querySelector('.email-error').innerText = '';
// });
// phone.addEventListener('click', function () {
//     document.querySelector('.phone-no-error').innerText = '';
// });
// cnic.addEventListener('click', function () {
//     document.querySelector('.cnic-error').innerText = '';
// });
// gender.addEventListener('click', function () {
//     document.querySelector('.gender-error').innerText = '';
// });