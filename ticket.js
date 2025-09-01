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

// CREATE BUS CARD JAVASCRIPT
let routesCounter = document.querySelector(".routes-counter");

let noBusText = document.querySelector(".no-bus-text");
let cardsParentDiv = document.querySelector("#booking-main-data");

let cardsData = localStorage.getItem("cardsData");
let parseCardsData = cardsData ? JSON.parse(cardsData) : [];

const origin = localStorage.getItem("originCity");
const destination = localStorage.getItem("destinationCity");
const date = localStorage.getItem("travelDate");
let count = 0;

parseCardsData.forEach((card) => {
  //   console.log("origin:", origin, "card.departure:", card.departure);
  //   console.log(
  //     "destination:",
  //     destination,
  //     "card.destination:",
  //     card.destination
  //   );
  //   console.log("date:", date, "card.date:", card.date);

  count++;
  routesCounter.textContent = `${count} Results`;

  if (
    origin === card.departure &&
    destination === card.destination &&
    date === card.date
  ) {
    // console.log(count);

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

document.querySelectorAll(".book-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const busCard = this.closest(".bus-card");
    const priceText = busCard.querySelector(".price")?.innerText || "PKR 0";
    const price = parseInt(priceText.replace(/[^\d]/g, ""));

    localStorage.setItem("currentPrice", price);

    // const modalPriceElement = document.querySelector(".price");
    // if (modalPriceElement) {
    //   modalPriceElement.innerText = `PKR ${price}`;
    // }

    showSeatModal();
  });
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
const seatPrice = document.querySelector(".price");
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
  const pricePerSeat = extractPrice(seatPrice.innerText);
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
    const pricePerSeat = extractPrice(
      document.querySelector(".price")?.innerText || "PKR 0"
    );

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
