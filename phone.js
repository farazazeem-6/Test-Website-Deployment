import { app } from "JSfirebase-config.js"
import {
    getAuth,
   

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const auth = getAuth(app);

 


        // Initialize Firebase (uncomment when you have real config)
        // firebase.initializeApp(firebaseConfig);
        // const auth = firebase.auth();

        // Global variables
        let currentStep = 'phone';
        let confirmationResult = null;
        let recaptchaVerifier = null;
        let resendCountdown = 0;
        let countdownInterval = null;

        // Demo mode (remove when using real Firebase)
        const DEMO_MODE = true;

        // Phone number formatting
        function formatPhoneNumber(value) {
            const phoneNumber = value.replace(/[^\d]/g, '');
            const phoneNumberLength = phoneNumber.length;
            if (phoneNumberLength < 4) return phoneNumber;
            if (phoneNumberLength < 7) {
                return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
            }
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }

        // Setup reCAPTCHA
        function setupRecaptcha() {
            if (DEMO_MODE) return;
            
            recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                size: 'normal',
                callback: function(response) {
                    console.log('reCAPTCHA solved');
                }
            });
        }

        // Modal functions
        function openModal() {
            document.getElementById('modalOverlay').classList.add('active');
            setupRecaptcha();
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('active');
            resetModal();
        }

        function resetModal() {
            currentStep = 'phone';
            updateModalStep();
            clearError();
            document.getElementById('phoneInput').value = '';
            document.getElementById('otpInput').value = '';
            confirmationResult = null;
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
        }

        // Update modal based on current step
        function updateModalStep() {
            const phoneStep = document.getElementById('phoneStep');
            const otpStep = document.getElementById('otpStep');
            const successStep = document.getElementById('successStep');
            const modalIcon = document.getElementById('modalIcon');
            const modalTitle = document.getElementById('modalTitle');
            const modalSubtitle = document.getElementById('modalSubtitle');
            const progressFill = document.getElementById('progressFill');

            // Hide all steps
            phoneStep.classList.add('hidden');
            otpStep.classList.add('hidden');
            successStep.classList.add('hidden');

            if (currentStep === 'phone') {
                phoneStep.classList.remove('hidden');
                modalIcon.textContent = '📱';
                modalTitle.textContent = 'Phone Verification';
                modalSubtitle.textContent = "We'll send you a verification code";
                progressFill.className = 'progress-fill';
            } else if (currentStep === 'otp') {
                otpStep.classList.remove('hidden');
                modalIcon.textContent = '💬';
                modalTitle.textContent = 'Enter Verification Code';
                modalSubtitle.textContent = `Code sent to ${document.getElementById('phoneInput').value}`;
                progressFill.className = 'progress-fill step-2';
            } else if (currentStep === 'success') {
                successStep.classList.remove('hidden');
                modalIcon.textContent = '✓';
                modalTitle.textContent = 'Verification Complete';
                modalSubtitle.textContent = "You're all set!";
                progressFill.className = 'progress-fill step-3';
            }
        }

        // Error handling
        function showError(message) {
            const errorElement = document.getElementById('errorMessage');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        function clearError() {
            const errorElement = document.getElementById('errorMessage');
            errorElement.classList.remove('show');
        }

        // Loading states
        function setLoading(buttonId, spinnerId, textId, isLoading) {
            const button = document.getElementById(buttonId);
            const spinner = document.getElementById(spinnerId);
            const text = document.getElementById(textId);
            
            button.disabled = isLoading;
            if (isLoading) {
                spinner.classList.remove('hidden');
            } else {
                spinner.classList.add('hidden');
            }
        }

        // Send verification code
        async function sendVerificationCode() {
            const phoneInput = document.getElementById('phoneInput');
            const phoneNumber = '+1' + phoneInput.value.replace(/[^\d]/g, '');
            
            if (!phoneInput.value || phoneInput.value.length < 14) {
                showError('Please enter a valid phone number');
                return;
            }

            clearError();
            setLoading('sendCodeBtn', 'sendSpinner', 'sendCodeText', true);

            try {
                if (DEMO_MODE) {
                    // Demo mode - simulate sending code
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    confirmationResult = { phoneNumber: phoneNumber };
                } else {
                    // Real Firebase implementation
                    confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
                }

                currentStep = 'otp';
                updateModalStep();
                startResendCountdown();
            } catch (error) {
                console.error('Error sending code:', error);
                showError('Failed to send verification code. Please try again.');
            } finally {
                setLoading('sendCodeBtn', 'sendSpinner', 'sendCodeText', false);
            }
        }

        // Verify code
        async function verifyCode() {
            const otpInput = document.getElementById('otpInput');
            const code = otpInput.value;
            
            if (!code || code.length !== 6) {
                showError('Please enter the 6-digit verification code');
                return;
            }

            clearError();
            setLoading('verifyCodeBtn', 'verifySpinner', 'verifyCodeText', true);

            try {
                if (DEMO_MODE) {
                    // Demo mode - simulate verification
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    if (code !== '123456') {
                        throw new Error('Invalid code');
                    }
                } else {
                    // Real Firebase implementation
                    await confirmationResult.confirm(code);
                }

                currentStep = 'success';
                updateModalStep();
            } catch (error) {
                console.error('Error verifying code:', error);
                showError('Invalid verification code. Please try again.');
            } finally {
                setLoading('verifyCodeBtn', 'verifySpinner', 'verifyCodeText', false);
            }
        }

        // Resend code
        async function resendCode() {
            if (resendCountdown > 0) return;
            
            clearError();
            const resendBtn = document.getElementById('resendBtn');
            resendBtn.disabled = true;
            
            try {
                await sendVerificationCode();
                document.getElementById('otpInput').value = '';
            } catch (error) {
                showError('Failed to resend code. Please try again.');
            } finally {
                resendBtn.disabled = false;
            }
        }

        // Countdown for resend button
        function startResendCountdown() {
            resendCountdown = 30;
            updateResendButton();
            
            countdownInterval = setInterval(() => {
                resendCountdown--;
                updateResendButton();
                
                if (resendCountdown <= 0) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
            }, 1000);
        }

        function updateResendButton() {
            const resendBtn = document.getElementById('resendBtn');
            const resendText = document.getElementById('resendText');
            
            if (resendCountdown > 0) {
                resendBtn.disabled = true;
                resendText.textContent = `Resend code in ${resendCountdown}s`;
            } else {
                resendBtn.disabled = false;
                resendText.textContent = 'Resend code';
            }
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Phone number formatting
            const phoneInput = document.getElementById('phoneInput');
            phoneInput.addEventListener('input', function(e) {
                this.value = formatPhoneNumber(this.value);
            });

            // OTP input - only numbers
            const otpInput = document.getElementById('otpInput');
            otpInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^\d]/g, '').slice(0, 6);
            });

            // Enter key handling
            phoneInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendVerificationCode();
                }
            });

            otpInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    verifyCode();
                }
            });

            // Close modal on overlay click
            document.getElementById('modalOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        });

        // Auth state observer (uncomment when using real Firebase)
        /*
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('User signed in:', user);
                // Handle successful authentication
            } else {
                console.log('User signed out');
            }
        });
        */
