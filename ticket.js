// Range Slider JS
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

    // Update the global filter state and apply all filters
    filterState.priceRange = {
      min: this.minValue,
      max: this.maxValue
    };
    applyAllFilters();
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

// ===== CENTRALIZED FILTERING SYSTEM =====

// Global filter state
let filterState = {
  priceRange: { min: 500, max: 3000 },
  timeFilter: 'all', // 'all', 'before6', '6to12', '12to18', 'after6'
  sortOrder: 'none' // 'none', 'lowToHigh', 'highToLow'
};

let routesCounter = document.querySelector(".routes-counter");
let noBusText = document.querySelector(".no-bus-text");
let cardsParentDiv = document.querySelector(".cards-storing-container");

let cardsData = localStorage.getItem("cardsData");
let parseCardsData = cardsData ? JSON.parse(cardsData) : [];

const origin = localStorage.getItem("originCity");
const destination = localStorage.getItem("destinationCity");
const date = localStorage.getItem("travelDate");

// Base filtered routes by city/date (this never changes)
let baseFilteredRoutes = parseCardsData.filter(route =>
  route.departure === origin &&
  route.destination === destination &&
  route.date === date
);

// Function to convert "hh:mm AM/PM" -> minutes since midnight 
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

// Apply all filters in sequence
function applyAllFilters() {
  let filteredRoutes = [...baseFilteredRoutes];

  // 1. Apply price filter
  filteredRoutes = filteredRoutes.filter(route => 
    route.fare >= filterState.priceRange.min && 
    route.fare <= filterState.priceRange.max
  );

  // 2. Apply time filter
  if (filterState.timeFilter !== 'all') {
    filteredRoutes = filteredRoutes.filter(route => {
      const minutes = timeToMinutes(route.departureTime);
      
      switch (filterState.timeFilter) {
        case 'before6':
          return minutes < 6 * 60;
        case '6to12':
          return minutes >= 6 * 60 && minutes < 12 * 60;
        case '12to18':
          return minutes >= 12 * 60 && minutes < 18 * 60;
        case 'after6':
          return minutes >= 18 * 60;
        default:
          return true;
      }
    });
  }

  // 3. Apply sorting
  if (filterState.sortOrder === 'lowToHigh') {
    filteredRoutes.sort((a, b) => a.fare - b.fare);
  } else if (filterState.sortOrder === 'highToLow') {
    filteredRoutes.sort((a, b) => b.fare - a.fare);
  }

  // 4. Render the results
  renderFilteredRoutes(filteredRoutes);
}

// Render the filtered and sorted routes
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

// Render function for a single route card
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

// ===== EVENT LISTENERS FOR FILTERS =====

// Time filter buttons
const before6Btn = document.getElementById("before-6");
const after6Btn = document.getElementById("after-6");
const sixTo12Btn = document.getElementById("six-12");
const twelveTo6Btn = document.getElementById("twelve-6");
const resetBtn = document.getElementById("resetButton");

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("button-active"));
    btn.classList.add("button-active");
  });
});

// Time filter button events
before6Btn.addEventListener("click", (e) => {
  e.preventDefault();
  filterState.timeFilter = 'before6';
  applyAllFilters();
});

sixTo12Btn.addEventListener("click", (e) => {
  e.preventDefault();
  filterState.timeFilter = '6to12';
  applyAllFilters();
});

twelveTo6Btn.addEventListener("click", (e) => {
  e.preventDefault();
  filterState.timeFilter = '12to18';
  applyAllFilters();
});

after6Btn.addEventListener("click", (e) => {
  e.preventDefault();
  filterState.timeFilter = 'after6';
  applyAllFilters();
});

// Reset button
resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  filterState.timeFilter = 'all';
  applyAllFilters();
});

// ===== DROPDOWN FILTER =====

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
    
    if (value === 'Low to High') {
      filterState.sortOrder = 'lowToHigh';
    } else if (value === 'High to Low') {
      filterState.sortOrder = 'highToLow';
    } else {
      filterState.sortOrder = 'none';
    }
    
    applyAllFilters();
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

// ===== INITIALIZATION =====

document.addEventListener("DOMContentLoaded", () => {
  const slider = new DualRangeSlider();
  // Initial render with all filters
  applyAllFilters();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new DualRangeSlider();
  });
} else {
  new DualRangeSlider();
}

// ===== REST OF YOUR EXISTING CODE (unchanged) =====

// JS for modify search button
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
        alert("You cannot select more than 5 seats.");
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