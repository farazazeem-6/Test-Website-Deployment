const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo'));
console.log(bookingInfo);

const checkbox = document.getElementById('valid');
const payButton = document.getElementById('pay-now');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        payButton.disabled = false;
        payButton.style.opacity = '1';
        payButton.style.cursor = 'pointer';
    } else {
        payButton.disabled = true;
        payButton.style.opacity = '0.5';
        payButton.style.cursor = 'not-allowed';
    }
});


payButton.addEventListener('click', () => {
    alert('Payment Successful.Seat Booked');
    window.location.href = '/Home-Section-files/index.html';
});



// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// }



let departure = document.getElementById('departure');
let destination = document.getElementById('destination');
let terminal = document.getElementById('terminal');
let date = document.getElementById('date');
let fare = document.getElementById('fare');
let fare2 = document.getElementById('fare-2');
let totalamount = document.getElementById('total-amount');
let seatnum = document.getElementById('seat-num');

departure.innerText = `${bookingInfo.departureCity}`;
destination.innerText = bookingInfo.destinationCity;
terminal.innerText = `${bookingInfo.selectedTerminal}`;
date.innerText = `${bookingInfo.travelDate}`;
fare.innerText = `Rs ${bookingInfo.totalTicketPrice}.00`;
fare2.innerText = `Rs ${bookingInfo.pricePerSeat}.00`;
totalamount.innerText = `Rs ${bookingInfo.totalTicketPrice - 100}.00`;
seatnum.innerText = bookingInfo.selectedSeats;





const table = document.getElementById("payment-detail-table");
const seatGenderMap = bookingInfo.seatGenderMap || {};
const price = parseInt(bookingInfo.pricePerSeat);

const oldRow = document.getElementById("data-row");
if (oldRow) oldRow.remove();

Object.entries(seatGenderMap).forEach(([seatNumber, gender]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${seatNumber}</td>
        <td>${price}</td>
        <td><span style=' background-color: #ffc107;
    border-radius: 5px;
    color: #000000;
    font-size: 12px;
    font-weight: bolder;
    padding: 5px;'>PENDING</span></td>
        <td>${gender}</td>
        <td>Rs 0</td>
        <td>Rs 0</td>
    `;
    table.appendChild(row);
});
