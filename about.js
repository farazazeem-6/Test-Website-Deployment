
// JS for Modal 


const forgetModal = document.getElementById('forget-modal');
const subsEmail = document.getElementById('subscribe-email');
const closeIcon = document.querySelector('.cross-img img');
const SubmitBtn = document.getElementsByClassName('send-email-btn');

closeIcon.addEventListener('click', () => {
    forgetModal.style.display = 'none';
    document.body.classList.remove('modal-open');
});

function showSubModal() {
    document.getElementById('forget-modal').style.display = 'flex';
    document.body.classList.remove("no-scroll");
}

const form = document.getElementById("subscribe-form");
const emailInput = document.getElementById("subscribe-email");
const modal = document.getElementById("forget-modal");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailValue = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailValue)) {
        modal.style.display = "flex";
        document.body.classList.add("no-scroll");

    } else {
        alert("Please enter a valid email address.");
    }
})



