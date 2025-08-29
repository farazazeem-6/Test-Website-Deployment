const Name = document.getElementById('name');
const Email = document.getElementById('email');
const Subject = document.getElementById('subject');
const PhoneNumber = document.getElementById('phonenumber');
const Message = document.getElementById('message');

function CheckValidtionsOfContactForm() {
    const GetName = Name.value.trim();
    const GetEmail = Email.value.trim();
    const GetSubject = Subject.value.trim();
    const GetPhoneNumber = PhoneNumber.value.trim();
    const GetMessage = Message.value.trim();

    let isValidContactsInput = true;

    document.querySelector('.contact-name-error').innerText = '';
    document.querySelector('.email-error').innerText = '';
    document.querySelector('.subject-error').innerText = '';
    document.querySelector('.phone-num-error').innerText = '';
    document.querySelector('.message-error').innerText = '';

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const subjectRegex = /^[A-Za-z0-9 ,.'"-]{3,100}$/;
    const pkPhoneRegex = /^03\d{9}$/;
    const messageRegex = /^[A-Za-z0-9 @#&(),.?!'"%\-_\n]{5,1000}$/;

    if (GetName === "") {
        document.querySelector('.contact-name-error').innerText = 'Name required';
        isValidContactsInput = false;
    } else if (!nameRegex.test(GetName)) {
        document.querySelector('.contact-name-error').innerText = 'Invalid Name';
        isValidContactsInput = false;
    } else if (GetName.length < 3) {
        document.querySelector('.contact-name-error').innerText = 'Too short name';
        isValidContactsInput = false;
    } else if (GetName.length > 15) {
        document.querySelector('.contact-name-error').innerText = 'Too long name';
        isValidContactsInput = false;
    }

    if (GetEmail === "") {
        document.querySelector('.email-error').innerText = 'Email required';
        isValidContactsInput = false;
    } else if (!emailRegex.test(GetEmail)) {
        document.querySelector('.email-error').innerText = 'Invalid email';
        isValidContactsInput = false;
    }

    if (GetSubject === "") {
        document.querySelector('.subject-error').innerText = 'Subject required';
        isValidContactsInput = false;
    } else if (!subjectRegex.test(GetSubject)) {
        document.querySelector('.subject-error').innerText = 'Invalid subject';
        isValidContactsInput = false;
    }

    if (GetPhoneNumber === "") {
        document.querySelector('.phone-num-error').innerText = 'Phone number required';
        isValidContactsInput = false;
    } else if (!pkPhoneRegex.test(GetPhoneNumber)) {
        document.querySelector('.phone-num-error').innerText = 'Invalid number';
        isValidContactsInput = false;
    }

    if (GetMessage === "") {
        document.querySelector('.message-error').innerText = 'Message required';
        isValidContactsInput = false;
    } else if (!messageRegex.test(GetMessage)) {
        document.querySelector('.message-error').innerText = 'Only text allowed. Minimum 5 characters';
        isValidContactsInput = false;
    }

    return isValidContactsInput;
}

document.getElementsByClassName("send-msg-btn")[0].addEventListener("click", function (e) {
    e.preventDefault();

    if (CheckValidtionsOfContactForm()) {
        const contactForm = document.getElementById("contactForm");
        const messageForm = document.getElementById("messageForm");

        const combinedForm = new FormData();

        [...contactForm.elements].forEach(el => {
            if (el.name) combinedForm.append(el.name, el.value);
        });
        [...messageForm.elements].forEach(el => {
            if (el.name) combinedForm.append(el.name, el.value);
        });

        const data = {
            name: Name.value.trim(),
            email: Email.value.trim(),
            subject: Subject.value.trim(),
            phone: PhoneNumber.value.trim(),
            message: Message.value.trim()
        };

        emailjs.send('service_hi1re2n', 'template_4l20rkn', data)
            .then(function (response) {
                alert("Message sent successfully!");
                contactForm.reset();
                messageForm.reset();
            }, function (error) {
                alert("Failed to send message. Please try again.");
                console.error("EmailJS error:", error);
            });

    }
});

Name.addEventListener('input', () => document.querySelector('.contact-name-error').innerText = '');
Email.addEventListener('input', () => document.querySelector('.email-error').innerText = '');
Subject.addEventListener('input', () => document.querySelector('.subject-error').innerText = '');
PhoneNumber.addEventListener('input', () => document.querySelector('.phone-num-error').innerText = '');
Message.addEventListener('input', () => document.querySelector('.message-error').innerText = '');
