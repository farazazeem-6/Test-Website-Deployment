const Username = document.getElementById('username');
const UserPassword = document.getElementById('password');
if (Username) {
    Username.addEventListener('input', function () {
        document.querySelector('.username-error').innerText = '';
    })
}

UserPassword.addEventListener('input', function () {
    document.querySelector('.password-error').innerText = '';
})

const forgetModal1 = document.getElementById('forget-modal-1');
const forgetEmail = document.getElementById('forget-email');
const closeIcon1 = document.querySelector('.cross-img-1 img');
const SubmitBtn = document.getElementsByClassName('send-email-btn');
const ForgetBtn = document.querySelector('.forgot-password');
const googleBtn = document.querySelector('#google-btn');
// const phoneBtn = document.querySelector('#phone-login');
const phoneDiv = document.querySelector('.phoneModal-overlay');
const closeIcon2 = document.querySelector('.close-phonebtn');
const otpBtn = document.querySelector('.send-otp-btn');
const phone = document.querySelector('#phone');
const phoneError = document.querySelector('.login-phone-error');
const formPhoneNo = document.querySelector('.form-phone-no');
const otpError = document.querySelector('.otp-error');
const formOtp = document.querySelector('.form-otp');
const verInfo = document.querySelector('.ver-info');
const otp = document.querySelector('#otp');
const verifyOtpBtn = document.querySelector('.verify-otp-btn');
const closeemailbtn = document.querySelector('.close-emailbtn');
const emailmodaloverlay = document.querySelector('.email-modal-overlay');
const emailmodalBtn = document.querySelector('.emailmodalBtn');
const phonemodalBtn = document.querySelector('.phonemodalBtn');
const emailModalCrossBtn = document.querySelector('#emailModalCrossBtn');


if (emailmodalBtn) {
    emailmodalBtn.addEventListener('click', function (e) {
        e.preventDefault();
        emailmodaloverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'
    })

}

if (phonemodalBtn) {
    phonemodalBtn.addEventListener('click', (e) => {
        e.preventDefault()
        phoneDiv.style.display = 'flex';
        document.body.style.overflow = 'hidden';

    });
}

if (emailModalCrossBtn) {
    emailModalCrossBtn.addEventListener('click', () => {
        emailmodaloverlay.style.display = 'none';
        document.body.style.overflow = 'auto'
    })
}

if (closeIcon2) {
    closeIcon2.addEventListener('click', () => {
        phoneDiv.style.display = 'none';
        document.body.style.overflow = 'auto';
    })
}

if (closeIcon1) {
    closeIcon1.addEventListener('click', () => {
        forgetModal1.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto'
    });

}



function showForgetModal() {
    document.getElementById('forget-modal-1').style.display = 'flex';
    document.body.classList.add('modal-open');

}

if (ForgetBtn) {
    ForgetBtn.addEventListener('click', function (e) {
        emailmodaloverlay.style.display = 'none';
        document.querySelector('.invalid-forget-email').innerText = '';
        e.preventDefault()
        showForgetModal()

    })
}



import { app } from "/JSfirebase-config.js"
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
const Gitprovider = new GithubAuthProvider();

let confirmationResult = null;

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
    callback: (response) => {
        sendOTP();
    }
});
recaptchaVerifier.render();



//  Phone Validation + Firebase OTP Send
function sendOTP() {
    const phoneValue = phone.value.trim();
    const phoneRegex = /^03\d{9}$/;

    if (phoneValue === '') {
        phoneError.innerText = 'Phone no required';
        return;
    } else if (!phoneRegex.test(phoneValue)) {
        phoneError.innerText = 'Invalid phone no';
        return;
    }

    phoneError.innerText = '';
    // otpBtn.style.opacity = '0.3';

    const fullPhone = '+92' + phoneValue.slice(1); // Convert to international format

    signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier)
        .then((result) => {
            confirmationResult = result;
            formPhoneNo.style.display = 'none';
            formOtp.style.display = 'block';
            verInfo.innerText = `OTP sent to ${phoneValue}`;
        })
        .catch((error) => {
            phoneError.innerText = error.message;
            console.error('OTP send error:', error);
        });
}

otpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sendOTP();
});




// OTP Validation + Firebase Confirm
function verifyOTP() {
    const otpValue = otp.value.trim();

    if (otpValue === '') {
        otpError.innerText = 'OTP required';
        return;
    } else if (isNaN(otpValue)) {
        otpError.innerText = 'Invalid OTP';
        return;
    }

    otpError.innerText = '';
    // verifyOtpBtn.style.opacity = '0.3';

    confirmationResult.confirm(otpValue)
        .then((result) => {
            const user = result.user;
            alert('Phone verified successfully!');
            // console.log('User:', user);

            phoneDiv.style.display = 'none';
            document.body.style.overflow = 'auto';


            const fallbackName = user.displayName || "Guest User";
            const fallbackEmail = user.email || "Not Provided";
            const fallbackPhoto = user.photoURL || "default-avatar.png";
            // const fallbackPhone = user.phoneNumber || "Unknown";

            localStorage.setItem("user", JSON.stringify({
                name: fallbackName,
                email: fallbackEmail,
                photo: fallbackPhoto,
                phone: user.phoneNumber,
                uid: user.uid
            }));
            window.location.href = "index.html";


        })
        .catch((error) => {
            otpError.innerText = 'Incorrect OTP';
            console.error('OTP verify error:', error);
        });
}

verifyOtpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    verifyOTP();
});



window.CheckValidationsForLogin = function () {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const GetUserName = Username.value.trim();
    const GetUserPassword = UserPassword.value.trim();

    let isValidLoginInput = true;

    document.querySelector('.username-error').innerText = '';
    document.querySelector('.password-error').innerText = '';


    const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/;
    const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;


    if (GetUserName === "") {
        document.querySelector('.username-error').innerText = 'Username or email required';
        isValidLoginInput = false;
    } else if (!emailRegex.test(GetUserName) && !usernameRegex.test(GetUserName)) {
        document.querySelector('.username-error').innerText = 'Invalid username or email';
        isValidLoginInput = false;
    }

    if (GetUserPassword === "") {
        document.querySelector('.password-error').innerText = 'Password required';
        isValidLoginInput = false;
    }

    else if (GetUserPassword.length < 8) {
        document.querySelector('.password-error').innerText = 'Password must be at least 8 characters';
        isValidLoginInput = false;
    }
    else if (GetUserPassword.length > 20) {
        document.querySelector('.password-error').innerText = 'Too long password (maximum-20)';
        isValidLoginInput = false;
    }

    if (isValidLoginInput) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                alert("Login successful!", userCredential);
                window.location.href = "index.html";
            })
            .catch((error) => {
                document.querySelector(".username-error").textContent = 'invalid email or password';
                document.querySelector(".password-error").textContent = "";
            });
    }

};


window.CheckForgetValidation = function () {
    const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/;
    const GetforgetValue = forgetEmail.value.trim();
    const errorDiv = document.querySelector('.invalid-forget-email');

    let isValidForgetEmail = true;
    errorDiv.innerText = '';

    if (GetforgetValue === "") {
        errorDiv.innerText = 'Email required';
        isValidForgetEmail = false;
    } else if (!emailRegex.test(GetforgetValue)) {
        errorDiv.innerText = 'Invalid email';
        isValidForgetEmail = false;
    }

    if (isValidForgetEmail) {
        sendPasswordResetEmail(auth, GetforgetValue)
            .then(() => {
                alert('Verification link sent!');
                forgetModal1.style.display = 'none';
                document.body.classList.remove('modal-open');
                document.body.style.overflow = 'auto'
                forgetEmail.value = "";
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    errorDiv.innerText = 'No account found with this email.';
                } else if (error.code === 'auth/invalid-email') {
                    errorDiv.innerText = 'Invalid email format.';
                } else {
                    errorDiv.innerText = 'Error: ' + error.message;
                }
            });
    }
};


// Login With Google JS:

window.loginWithGoogle = function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            // console.log("Google login successful:", user);
            // Save user info in localStorage
            localStorage.setItem("user", JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                uid: user.uid
            }));

            // alert("Welcome, " + user.displayName);
            window.location.href = "/Home-Section-files/index.html";
        })
        .catch((error) => {
            // console.error("Google login failed:", error);
            // document.querySelector('.username-error').innerText = 'Google login failed:';
            alert("Login failed: " + error.message);
        });
};


// Log in with FaceBook:


window.loginWithFacebook = function () {
    console.log("Triggering Facebook login");
    signInWithPopup(auth, fbProvider)
        .then((result) => {
            const user = result.user;
            console.log(" Facebook login successful:", user);
            // alert(`Welcome, ${user.displayName}`);
            window.location.href = "index.html";

            // Optional: store user info
            localStorage.setItem("user", JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                uid: user.uid
            }));
        })
        .catch((error) => {
            console.error("Facebook login failed:", error);
            // document.querySelector('.username-error').innerText = 'Facebook login failed:';
            alert(`Login failed: ${error.message}`);
        });
};

// Login in with GitHub:

document.getElementById("github-login").addEventListener("click", () => {
    signInWithPopup(auth, Gitprovider)
        .then((result) => {
            const user = result.user;
            console.log("GitHub login successful:", user);

            // Save user info in localStorage
            localStorage.setItem("user", JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                uid: user.uid
            }));

            // alert("Login successful! Welcome " + user.displayName);
            window.location.href = "/Home-Section-files/index.html";
        })
        .catch((error) => {
            console.error("GitHub login failed:", error);
            // document.querySelector('.username-error').innerText = 'Github login failed:';
            alert("Login failed: " + error.message);
        });
});

if (forgetEmail) {
    forgetEmail.addEventListener('input', () => {
        document.querySelector('.invalid-forget-email').innerText = '';
    });
}

phone.addEventListener('input', function () {
    phoneError.innerText = ''
})