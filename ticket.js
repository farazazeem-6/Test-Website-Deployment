// // Range Slider JS
class DualRangeSlider {
  constructor() {
    this.MIN = 500;
    this.MAX = 3000;
    this.minValue = 500;
    this.maxValue = 3000;
    this.isDragging = null;

    this.sliderTrack = document.getElementById("sliderTrack");
    this.sliderRange = document.getElementById("sliderRange");
    this.minThumb = document.getElementById("minThumb");
    this.maxThumb = document.getElementById("maxThumb");
    this.minDisplay = document.getElementById("minDisplay");
    this.maxDisplay = document.getElementById("maxDisplay");

    this.init();
  }

  init() {
    this.updateSlider();
    this.bindEvents();
  }

  bindEvents() {
    this.minThumb.addEventListener("mousedown", (e) =>
      this.handleMouseDown(e, "min")
    );
    this.maxThumb.addEventListener("mousedown", (e) =>
      this.handleMouseDown(e, "max")
    );

    document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    document.addEventListener("mouseup", () => this.handleMouseUp());

    this.sliderTrack.addEventListener("click", (e) => this.handleTrackClick(e));

    this.minThumb.addEventListener("touchstart", (e) =>
      this.handleTouchStart(e, "min")
    );
    this.maxThumb.addEventListener("touchstart", (e) =>
      this.handleTouchStart(e, "max")
    );
    document.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    document.addEventListener("touchend", () => this.handleTouchEnd());
  }

  getPercentage(value) {
    return ((value - this.MIN) / (this.MAX - this.MIN)) * 100;
  }

  getValueFromPosition(clientX) {
    const rect = this.sliderTrack.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    return Math.round(this.MIN + (percentage / 100) * (this.MAX - this.MIN));
  }

  updateSlider() {
    const minPercent = this.getPercentage(this.minValue);
    const maxPercent = this.getPercentage(this.maxValue);

    this.minThumb.style.left = minPercent + "%";
    this.maxThumb.style.left = maxPercent + "%";

    this.sliderRange.style.left = minPercent + "%";
    this.sliderRange.style.width = maxPercent - minPercent + "%";
    this.sliderRange.style.background = "#008000";

    this.minDisplay.textContent = this.minValue;
    this.maxDisplay.textContent = this.maxValue;

    // refresh cards based on current slider range
    renderCards(this.minValue, this.maxValue);
  }

  handleMouseDown(e, thumb) {
    e.preventDefault();
    this.isDragging = thumb;
    document.body.style.userSelect = "none";
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    const newValue = this.getValueFromPosition(e.clientX);

    if (this.isDragging === "min") {
      this.minValue = Math.max(this.MIN, Math.min(newValue, this.maxValue - 1));
    } else if (this.isDragging === "max") {
      this.maxValue = Math.min(this.MAX, Math.max(newValue, this.minValue + 1));
    }

    this.updateSlider();
  }

  handleMouseUp() {
    this.isDragging = null;
    document.body.style.userSelect = "";
  }

  handleTrackClick(e) {
    if (this.isDragging) return;

    const newValue = this.getValueFromPosition(e.clientX);
    const distanceToMin = Math.abs(newValue - this.minValue);
    const distanceToMax = Math.abs(newValue - this.maxValue);

    if (distanceToMin < distanceToMax) {
      this.minValue = Math.max(this.MIN, Math.min(newValue, this.maxValue - 1));
    } else {
      this.maxValue = Math.min(this.MAX, Math.max(newValue, this.minValue + 1));
    }

    this.updateSlider();
  }

  handleTouchStart(e, thumb) {
    e.preventDefault();
    this.isDragging = thumb;
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const newValue = this.getValueFromPosition(touch.clientX);

    if (this.isDragging === "min") {
      this.minValue = Math.max(this.MIN, Math.min(newValue, this.maxValue - 1));
    } else if (this.isDragging === "max") {
      this.maxValue = Math.min(this.MAX, Math.max(newValue, this.minValue + 1));
    }

    this.updateSlider();
  }

  handleTouchEnd() {
    this.isDragging = null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DualRangeSlider();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new DualRangeSlider();
  });
} else {
  new DualRangeSlider();
}

document.addEventListener("DOMContentLoaded", () => {
  const slider = new DualRangeSlider();
  renderCards(slider.minValue, slider.maxValue);
});


// CREATE BUS CARD JAVASCRIPT

let routesCounter = document.querySelector(".routes-counter");

let noBusText = document.querySelector(".no-bus-text");
let cardsParentDiv = document.querySelector(".cards-storing-container");

let cardsData = localStorage.getItem("cardsData");
let parseCardsData = cardsData ? JSON.parse(cardsData) : [];

const origin = localStorage.getItem("originCity");
const destination = localStorage.getItem("destinationCity");
const date = localStorage.getItem("travelDate");

function renderCards(minFare, maxFare) {
  cardsParentDiv.innerHTML = "";
  let count = 0;

  parseCardsData.forEach((card) => {
    if (
      origin === card.departure &&
      destination === card.destination &&
      date === card.date &&
      card.fare >= minFare &&
      card.fare <= maxFare
    ) {
      count++;
      routesCounter.textContent = `${count} Results`;
      noBusText.style.display = "none";

      const busCard = document.createElement("div");
      busCard.classList.add("bus-card");

      const busCardContent = document.createElement("div");
      busCardContent.classList.add("bus-card-content");

      const departureInfo = document.createElement("div");
      departureInfo.classList.add("departure-info");

      const busIcon = document.createElement("div");
      busIcon.classList.add("bus-icon");
      const busImg = document.createElement("img");
      busImg.src = "bus (2).png";
      busImg.alt = "";
      busIcon.appendChild(busImg);

      const timeLocation = document.createElement("div");
      timeLocation.classList.add("time-location");

      const depTime = document.createElement("div");
      depTime.classList.add("time");
      depTime.textContent = card.departureTime;

      const depDate = document.createElement("div");
      depDate.classList.add("date");
      depDate.textContent = card.date;

      const depLocation = document.createElement("div");
      depLocation.classList.add("des-location");
      depLocation.textContent = card.departure;

      timeLocation.append(depTime, depDate, depLocation);
      departureInfo.append(busIcon, timeLocation);

      const routeInfo = document.createElement("div");
      routeInfo.classList.add("route-info");

      const routeText = document.createElement("div");
      routeText.classList.add("route-text");
      routeText.textContent = "Via Motorway";

      const routeLine = document.createElement("div");
      routeLine.classList.add("route-line");

      const busType = document.createElement("div");
      busType.classList.add("bus-type");
      busType.textContent = card.type;

      routeInfo.append(routeText, routeLine, busType);

      const arrivalInfo = document.createElement("div");
      arrivalInfo.classList.add("arrival-info");

      const arrTime = document.createElement("div");
      arrTime.classList.add("time");
      arrTime.textContent = card.destinationTime;

      const arrDate = document.createElement("div");
      arrDate.classList.add("date");
      arrDate.textContent = card.date;

      const arrLocation = document.createElement("div");
      arrLocation.classList.add("dep-location");
      arrLocation.textContent = card.destination;

      arrivalInfo.append(arrTime, arrDate, arrLocation);

      const bookingSection = document.createElement("div");
      bookingSection.classList.add("booking-section");

      const priceSection = document.createElement("div");
      priceSection.classList.add("price-section");

      const specialOffer = document.createElement("div");
      specialOffer.classList.add("special-offer");
      specialOffer.textContent = "SPECIAL OFFER";

      const price = document.createElement("div");
      price.classList.add("price");
      price.textContent = `PKR ${card.fare}`;

      const originalPrice = document.createElement("div");
      originalPrice.classList.add("original-price");
      originalPrice.textContent = "PKR 3000";

      priceSection.append(specialOffer, price, originalPrice);

      const bookBtn = document.createElement("button");
      bookBtn.classList.add("book-btn");
      bookBtn.setAttribute("onclick", "showSeatModal()");
      bookBtn.textContent = "Book Now";

      bookingSection.append(priceSection, bookBtn);

      busCardContent.append(
        departureInfo,
        routeInfo,
        arrivalInfo,
        bookingSection
      );
      busCard.appendChild(busCardContent);

      cardsParentDiv.append(busCard);
    }
  });

  if (count === 0) {
    routesCounter.textContent = "0 Results";
    noBusText.style.display = "flex";
  }
}





//////////////////////////////////////////////


// Function to  convert "hh:mm AM/PM" -> minutes since midnight 


function timeToMinutes(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}



//  RENDER FUNCTION FOR A SINGLE ROUTE CARD

function renderCard(route) {
  const busCard = document.createElement("div");
  busCard.classList.add("bus-card");

  busCard.innerHTML = `
    <div class="bus-card-content">
      <div class="departure-info">
        <div class="bus-icon"><img src="bus (2).png" alt="" /></div>
        <div class="time-location">
          <div class="time">${route.departureTime}</div>
          <div class="date">${route.date}</div>
          <div class="des-location">${route.departure}</div>
        </div>
      </div>
      <div class="route-info">
        <div class="route-text">Via Motorway</div>
        <div class="route-line"></div>
        <div class="bus-type">${route.type}</div>
      </div>
      <div class="arrival-info">
        <div class="time">${route.destinationTime}</div>
        <div class="date">${route.date}</div>
        <div class="dep-location">${route.destination}</div>
      </div>
      <div class="booking-section">
        <div class="price-section">
          <div class="special-offer">SPECIAL OFFER</div>
          <div class="price">PKR ${route.fare}</div>
          <div class="original-price">PKR 3000</div>
        </div>
        <button class="book-btn" onclick="showSeatModal()">Book Now</button>
      </div>
    </div>
  `;

  cardsParentDiv.appendChild(busCard);
}


const before6Btn = document.getElementById("before-6");
const after6Btn = document.getElementById("after-6");
const sixTo12Btn = document.getElementById("six-12");
const twelveTo6Btn = document.getElementById("twelve-6");
const resetBtn = document.getElementById("resetButton");


//  RENDER LIST OF ROUTES

function renderFilteredRoutes(filtered) {
  cardsParentDiv.innerHTML = "";
  if (filtered.length === 0) {
    routesCounter.textContent = "0 Results";
    noBusText.style.display = "flex";
    return;
  }
  routesCounter.textContent = `${filtered.length} Results`;
  noBusText.style.display = "none";

  filtered.forEach(route => renderCard(route));
}

//  BASE FILTERED ROUTES BY CITY/DATE

let baseFilteredRoutes = parseCardsData.filter(route =>
  route.departure === origin &&
  route.destination === destination &&
  route.date === date
);


//BUTTONS LOGIC HERE


const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("button-active"));
    btn.classList.add("button-active");
  });
});



// Button 1: 

before6Btn.addEventListener("click", (e) => {
  e.preventDefault()
  const filtered = baseFilteredRoutes.filter(route => {
    const minutes = timeToMinutes(route.departureTime);
    return minutes < 6 * 60;
  });
  renderFilteredRoutes(filtered);
});

// Button 2:

sixTo12Btn.addEventListener("click", (e) => {
  e.preventDefault()
  const filtered = baseFilteredRoutes.filter(route => {
    const minutes = timeToMinutes(route.departureTime);
    return minutes >= 6 * 60 && minutes < 12 * 60;
  });
  renderFilteredRoutes(filtered);
});

// Button 3:

twelveTo6Btn.addEventListener("click", (e) => {
  e.preventDefault()
  const filtered = baseFilteredRoutes.filter(route => {
    const minutes = timeToMinutes(route.departureTime);
    return minutes >= 12 * 60 && minutes < 18 * 60;
  });
  renderFilteredRoutes(filtered);
});

// Button 4:

after6Btn.addEventListener("click", (e) => {
  e.preventDefault();
  const filtered = baseFilteredRoutes.filter(route => {
    const minutes = timeToMinutes(route.departureTime);
    return minutes >= 6 * 60;
  });

  renderFilteredRoutes(filtered);
});



// Reset

resetBtn.addEventListener("click", (e) => {
  e.preventDefault()
  renderFilteredRoutes(baseFilteredRoutes);
});


// JS

const modifySearchBtn = document.querySelector(".right-booking-heading a");
const targetElement = document.querySelector(".search-form");

modifySearchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  targetElement.classList.toggle("active-2");
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", weekday: "long" };
  const formatted = date.toLocaleDateString("en-US", options);
  const parts = formatted.split(", ");
  return `${parts[1]}, ${parts[0]}`;
}

const headingContainer = document.querySelector(".left-booking-heading");
const headingTitle = headingContainer.querySelector("h4");
const headingDate = headingContainer.querySelector("p");

if (headingTitle && headingDate) {
  headingTitle.innerText = `${origin} - ${destination}`;
  headingDate.innerText = formatDate(date);
}

// function capitalizeWords(str) {
//     return str
//         .toLowerCase()
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
// }

const formattedOrigin = origin;
const formattedDestination = destination;

document.querySelectorAll(".dep-location").forEach((el) => {
  el.innerText = formattedDestination;
});

document.querySelectorAll(".des-location").forEach((el) => {
  el.innerText = formattedOrigin;
});

document.querySelectorAll(".date").forEach((da) => {
  da.innerText = formatDate(date);
});


cardsParentDiv.addEventListener("click", (e) => {
  const btn = e.target.closest(".book-btn");
  if (!btn) return;

  const busCard = btn.closest(".bus-card");
  const priceText = busCard.querySelector(".price")?.innerText || "PKR 0";
  const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;


  localStorage.setItem("currentPrice", price);
  currentSeatPrice = price;

  showSeatModal();
});

// SEAT MODAL JAVASCRIPT LOGIC

document.addEventListener("DOMContentLoaded", () => {
  const seatModal = document.querySelector(".seat-modal-overlay");
  const seatcloseIcon = document.querySelector(".modal-cross-icon img");

  if (seatModal && seatcloseIcon) {
    seatcloseIcon.addEventListener("click", () => {
      seatModal.style.display = "none";
      document.body.classList.remove("seat-modal-open");
      document.body.style.overflow = "auto";
      resetUserSelectedSeats();
    });
  } else {
  }
});

function showSeatModal() {
  document.querySelector(".seat-modal-overlay").style.display = "flex";
  document.body.classList.add("seat-modal-open");
  document.body.style.overflow = "hidden";
}

function resetUserSelectedSeats() {
  const allSeats = document.querySelectorAll(".seat");

  document.querySelector(".seat-counts p span").innerText = "";
  document.querySelector(".total-amount-of-seat p span").innerText = "0";

  allSeats.forEach((seat) => {
    const bgColor = window.getComputedStyle(seat).backgroundColor;
    if (bgColor === "rgb(0, 128, 0)") {
      seat.style.backgroundColor = "white";
      seat.style.border = "1px solid black";
      seat.style.color = "black";
    }
  });
}

let seatGenderMap = {};
let currentSelectedSeat = null;

const seats = document.querySelectorAll(".seat");
const genderModal = document.getElementById("genderModal");
const closeGenderModal = document.getElementById("closeGenderModal");
const maleBtn = document.getElementById("maleBtn");
const femaleBtn = document.getElementById("femaleBtn");
const seatNo = document.querySelector(".seat-counts p span");
let currentSeatPrice = parseInt(localStorage.getItem("currentPrice")) || 0;

const totalPrice = document.querySelector(".total-amount-of-seat p span");

let selectedSeat = null;

function extractPrice(text) {
  const match = text.match(/\d+/g);
  return match ? parseInt(match.join("")) : 0;
}

function getSelectedSeats() {
  return seatNo.innerText.replace("Seat No: ", "").split(", ").filter(Boolean);
}

function updateSeatListText(seatsArray) {
  seatNo.innerText = `${seatsArray.join(", ")}`;

  const pricePerSeat = currentSeatPrice || parseInt(localStorage.getItem("currentPrice")) || 0;

  totalPrice.innerText = seatsArray.length * pricePerSeat;
  updateNextButtonState();
}


function updateLocalStorage() {
  localStorage.setItem("seatGenderMap", JSON.stringify(seatGenderMap));
}

seats.forEach((seat) => {
  seat.addEventListener("click", () => {
    const bg = window.getComputedStyle(seat).backgroundColor;
    const seatText = seat.innerText.trim();
    let selectedSeats = getSelectedSeats();

    if (bg === "rgb(255, 255, 255)") {
      if (selectedSeats.length >= 5) {
        alert("You canot select more than 5 seats.");
        return;
      }
      selectedSeat = seat;
      currentSelectedSeat = seatText;
      genderModal.style.display = "block";
      document.body.style.overflow = "hidden";
    } else if (bg === "rgb(0, 128, 0)") {
      seat.style.backgroundColor = "white";
      seat.style.color = "black";
      seat.style.border = "1px solid black";

      const updatedSeats = selectedSeats.filter((s) => s !== seatText);
      updateSeatListText(updatedSeats);

      delete seatGenderMap[seatText];
      updateLocalStorage();
    }
  });
});

closeGenderModal.addEventListener("click", () => {
  genderModal.style.display = "none";
  document.body.style.overflow = "auto";
  selectedSeat = null;
  currentSelectedSeat = null;
});

[maleBtn, femaleBtn].forEach((btn) => {
  btn.addEventListener("click", () => {
    if (selectedSeat && currentSelectedSeat) {
      selectedSeat.style.backgroundColor = "#008000";
      selectedSeat.style.color = "white";
      selectedSeat.style.border = "none";

      let selectedSeats = getSelectedSeats();
      const seatText = selectedSeat.innerText.trim();
      if (!selectedSeats.includes(seatText)) {
        selectedSeats.push(seatText);
      }
      updateSeatListText(selectedSeats);
      seatGenderMap[currentSelectedSeat] = btn.innerText;
      updateLocalStorage();

      localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
      localStorage.setItem("totalPrice", totalPrice.innerText);
      updateNextButtonState();
    }

    genderModal.style.display = "none";
    document.body.style.overflow = "auto";
    selectedSeat = null;
    currentSelectedSeat = null;
  });
});

const Modalpage1 = document.querySelector(".modal-seats-div");
const Modalpage2 = document.querySelector(".select-terminal-container");
const ModalBtn1 = document.querySelector("#select-seat-btn");
const ModalBtn2 = document.querySelector("#select-terminal-btn");
const ModalBackBtn = document.querySelector("#modal-back-btn");
const ModalNextBtn = document.querySelector("#modal-next-btn");
const ModalFooter = document.querySelector(".seat-modal-footer");

let currentPage = 1;

function showPage1() {
  currentPage = 1;
  Modalpage1.style.display = "flex";
  Modalpage2.style.display = "none";

  ModalBtn1.style.backgroundColor = "#008000";
  ModalBtn1.style.color = "white";

  ModalBtn2.style.backgroundColor = "#ece8e8";
  ModalBtn2.style.color = "#000";

  ModalNextBtn.innerText = "Next";

  updateNextButtonState();
}

function showPage2() {
  currentPage = 2;
  Modalpage1.style.display = "none";
  Modalpage2.style.display = "block";

  ModalBtn2.style.backgroundColor = "#008000";
  ModalBtn2.style.color = "white";

  ModalBtn1.style.backgroundColor = "#ece8e8";
  ModalBtn1.style.color = "#000";

  ModalNextBtn.innerText = "Check Out";

  updateNextButtonState();
}

ModalBtn1.addEventListener("click", function (e) {
  e.preventDefault();
  showPage1();
});

ModalBtn2.addEventListener("click", function (e) {
  e.preventDefault();
  showPage2();
});

ModalBackBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (currentPage === 2) {
    showPage1();
  }
});

ModalNextBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (currentPage === 1) {
    const selectedSeats =
      document
        .querySelector(".seat-counts p span")
        ?.innerText.split(",")
        .filter(Boolean) || [];

    if (selectedSeats.length > 0) {
      showPage2();
    }
  } else if (currentPage === 2) {
    const departureCity = formattedOrigin;
    // console.log(departureCity);

    const destinationCity = formattedDestination;
    const travelDate = localStorage.getItem("travelDate") || "";
    const selectedTerminal =
      document.querySelector(".form-select")?.value || "";
    const totalPrice =
      document.querySelector(".total-amount-of-seat p span")?.innerText || "0";
    const selectedSeats =
      JSON.parse(localStorage.getItem("selectedSeats")) || [];
    const pricePerSeat = currentSeatPrice || parseInt(localStorage.getItem("currentPrice")) || 0;


    const bookingInfo = {
      departureCity,
      destinationCity,
      travelDate,
      selectedTerminal,
      selectedSeats,
      seatGenderMap,
      pricePerSeat,
      totalTicketPrice: totalPrice,
    };

    localStorage.setItem("bookingInfo", JSON.stringify(bookingInfo));
    localStorage.setItem("seatGenderMap", JSON.stringify(seatGenderMap));
    window.location.href = "payment.html";
  }
});

function updateNextButtonState() {
  if (currentPage !== 1) return;

  const selectedSeats =
    document
      .querySelector(".seat-counts p span")
      ?.innerText.split(",")
      .filter(Boolean) || [];

  if (selectedSeats.length === 0) {
    ModalNextBtn.style.pointerEvents = "none";
    ModalNextBtn.style.opacity = "0.5";
    ModalNextBtn.style.backgroundColor = "#008000";
    ModalNextBtn.style.color = "white";
    ModalNextBtn.removeAttribute("href");
  } else {
    ModalNextBtn.style.pointerEvents = "auto";
    ModalNextBtn.style.opacity = "1";
    ModalNextBtn.style.backgroundColor = "#008000";
    ModalNextBtn.style.color = "white";
    ModalNextBtn.style.cursor = "pointer";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  showPage1();
});





// FILTER DROPDOWN JS 

const dropdownContainer = document.querySelector('.filter-dropdown-container');
const dropdownInput = document.querySelector('.filter-dropdown-input');
const dropdownArrow = document.querySelector('.filter-dropdown-arrow');
const dropdownOptions = document.querySelector('.filter-dropdown-options');
const options = document.querySelectorAll('.filter-dropdown-option');

// Toggle dropdown when input is clicked
dropdownInput.addEventListener('click', function (e) {
  e.stopPropagation();
  toggleDropdown();
});

// Handle option selection
options.forEach(option => {
  option.addEventListener('click', function (e) {
    e.stopPropagation();
    const value = this.textContent;
    dropdownInput.value = value;
    console.log(value);
    if (value === 'Low to High') {
      const ascending = [...parseCardsData].sort((a, b) => a.fare - b.fare);
      // console.log(ascending);
      cardsParentDiv.innerHTML = ''
      ascending.forEach((newcard) => {
        renderCard(newcard)
      })
    }
    else {
      const descending = [...parseCardsData].sort((a, b) => b.fare - a.fare);
      cardsParentDiv.innerHTML = ''
      descending.forEach((card) => {
        renderCard(card)
      })
    }
    closeDropdown();
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
  if (!dropdownContainer.contains(e.target)) {
    closeDropdown();
  }
});

function toggleDropdown() {
  const isOpen = dropdownOptions.classList.contains('show');
  if (isOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function openDropdown() {
  dropdownOptions.classList.add('show');
  dropdownArrow.classList.add('active');
}

function closeDropdown() {
  dropdownOptions.classList.remove('show');
  dropdownArrow.classList.remove('active');
}

