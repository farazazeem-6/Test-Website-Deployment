// ------------------ Hamburger Menu ------------------
const hamburgerBtn = document.querySelector('.ham-burger-btn');
const navButtons = document.querySelector('.nav-buttons');
const cargoContainer = document.querySelector('.cargo-container');

if (hamburgerBtn && navButtons && cargoContainer) {
  hamburgerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navButtons.classList.toggle('show');
    cargoContainer.classList.toggle('show');
  });
}

// ------------------ Search Validation ------------------
document.addEventListener('DOMContentLoaded', function () {
  const searchBtn = document.getElementsByClassName('search-button');
  const OrigindropdownMenu = document.getElementById('origin-dropdown-menu');
  const DesdropdownMenu = document.getElementById('destination-dropdown-menu');

  let selectedOrigin = null;
  let selectedDes = null;

  if (OrigindropdownMenu) {
    OrigindropdownMenu.addEventListener('click', function (event) {
      const clickedOption = event.target.closest('.selection-dropdown-option');

      if (clickedOption) {
        selectedOrigin = clickedOption.getAttribute('data-value');
        console.log('Selected origin:', selectedOrigin);

        const depErrorDiv = document.querySelector('.dep-error-div');
        if (depErrorDiv) depErrorDiv.innerText = '';

        document.querySelectorAll('.selection-dropdown-option').forEach(option => {
          option.classList.remove('selected');
        });
        // clickedOption.classList.add('selected');
      }
    });
  }

  if (DesdropdownMenu) {
    DesdropdownMenu.addEventListener('click', function (event) {
      const clickedOption = event.target.closest('.selection-dropdown-option');

      if (clickedOption) {
        selectedDes = clickedOption.getAttribute('data-value');
        console.log('Selected Des:', selectedDes);

        const desErrorDiv = document.querySelector('.des-error-div');
        if (desErrorDiv) desErrorDiv.innerText = '';

        document.querySelectorAll('.selection-dropdown-option').forEach(option => {
          option.classList.remove('selected');
        });
        // clickedOption.classList.add('selected');
      }
    });
  }

  function CheckValidation() {
    const DesError = document.querySelector('.des-error-div');
    const DepError = document.querySelector('.dep-error-div');
    const travelDate = document.getElementById('datepicker')?.value.trim();

    if (DesError) DesError.innerText = '';
    if (DepError) DepError.innerText = '';

    if (!selectedOrigin) {
      if (DepError) DepError.innerText = 'Select a departure city';
      return;
    }

    if (!selectedDes) {
      if (DesError) DesError.innerText = 'Select a destination city';
      return;
    }

    if (selectedOrigin === selectedDes) {
      if (DesError) DesError.innerText = 'Departure and Destination cities cannot be same';
      return;
    }

    localStorage.setItem("originCity", selectedOrigin);
    localStorage.setItem("destinationCity", selectedDes);
    localStorage.setItem("travelDate", travelDate);

    setTimeout(() => {
      if (DesError) DesError.innerText = '';
      window.location.href = "ticket-section.html";
    }, 1000);
  }

  Array.from(searchBtn).forEach(btn => {
    btn.addEventListener('click', CheckValidation);
  });
});

// // ------------------ Card Carousel ------------------
const cards = document.querySelectorAll('.card');
let currentCard = 0;
const totalCards = cards.length;

function updateCards() {
  cards.forEach((card, index) => {
    card.classList.remove('active', 'prev', 'next');

    if (index === currentCard) {
      card.classList.add('active');
    } else if (index === (currentCard - 1 + totalCards) % totalCards) {
      card.classList.add('prev');
    } else if (index === (currentCard + 1) % totalCards) {
      card.classList.add('next');
    }
  });
}

function nextCard() {
  currentCard = (currentCard + 1) % totalCards;
  updateCards();
}

function previousCard() {
  currentCard = (currentCard - 1 + totalCards) % totalCards;
  updateCards();
}

if (cards.length > 0) {
  updateCards();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') previousCard();
    else if (e.key === 'ArrowRight') nextCard();
  });

  let startX = 0, endX = 0;

  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) nextCard();
      else previousCard();
    }
  }

  // startAutoPlay();
}

// ------------------ Modal Subscription ------------------
const forgetModal = document.getElementById('forget-modal');
const emailInput = document.getElementById('subscribe-email');
const closeIcon = document.querySelector('.cross-img img');
const form = document.getElementById("subscribe-form");

if (closeIcon && forgetModal) {
  closeIcon.addEventListener('click', () => {
    forgetModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
  });
}

if (form && emailInput && forgetModal) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailValue)) {
      forgetModal.style.display = "flex";
      document.body.classList.add("no-scroll");
    } else {
      alert("Please enter a valid email address.");
    }
  });
}

function showSubModal() {
  if (forgetModal) {
    forgetModal.style.display = 'flex';
    document.body.classList.add("no-scroll");

  }
}


// dropdown js 


class CustomDropdown {
  constructor(buttonId, menuId, textId, placeholder = "Select an option...") {
    this.button = document.getElementById(buttonId);
    this.menu = document.getElementById(menuId);
    this.text = document.getElementById(textId);
    this.isOpen = false;
    this.placeholder = placeholder;

    if (!this.button || !this.menu || !this.text) {
      console.error('Dropdown elements not found:', { buttonId, menuId, textId });
      return;
    }

    this.init();
  }

  init() {
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    this.menu.addEventListener('click', (e) => {
      if (e.target.classList.contains('selection-dropdown-option')) {
        this.selectOption(e.target);
      }
    });

    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.button.contains(e.target) && !this.menu.contains(e.target)) {
        this.close();
      }
    });

    this.menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    window.addEventListener('resize', () => {
      if (this.isOpen) {
        this.updatePosition();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.closeOtherDropdowns();

    this.isOpen = true;
    this.button.classList.add('active');
    this.updatePosition();
    this.menu.classList.add('show');

    const firstOption = this.menu.querySelector('.selection-dropdown-option');
    if (firstOption) {
      firstOption.focus();
    }
  }

  close() {
    this.isOpen = false;
    this.button.classList.remove('active');
    this.menu.classList.remove('show', 'show-up');
    this.button.focus();
  }

  closeOtherDropdowns() {
    if (window.dropdownInstances) {
      window.dropdownInstances.forEach(instance => {
        if (instance !== this && instance.isOpen) {
          instance.close();
        }
      });
    }
  }

  updatePosition() {
    const buttonRect = this.button.getBoundingClientRect();
    const menuHeight = this.menu.scrollHeight;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // Remove existing position classes
    this.menu.classList.remove('show-up');

    // Always show upward as requested
    this.menu.classList.add('show-up');
  }

  selectOption(option) {
    const value = option.getAttribute('data-value');
    const text = option.textContent;

    this.text.textContent = text;
    this.button.classList.remove('placeholder');
    this.close();

    // Trigger custom event
    const event = new CustomEvent('dropdownChange', {
      detail: { value, text, dropdown: this }
    });
    this.button.dispatchEvent(event);
  }

  setValue(value) {
    const option = this.menu.querySelector(`[data-value="${value}"]`);
    if (option) {
      this.selectOption(option);
    }
  }
}

// Initialize dropdownInstances array
window.dropdownInstances = window.dropdownInstances || [];

// Only create dropdown instances if the elements exist in the DOM
if (document.getElementById('origin-dropdown-btn') &&
  document.getElementById('origin-dropdown-menu') &&
  document.getElementById('origin-dropdown-text')) {
  const originDropdown = new CustomDropdown('origin-dropdown-btn', 'origin-dropdown-menu', 'origin-dropdown-text', 'Select Origin');
  window.dropdownInstances.push(originDropdown);
}

if (document.getElementById('destination-dropdown-btn') &&
  document.getElementById('destination-dropdown-menu') &&
  document.getElementById('destination-dropdown-text')) {
  const destinationDropdown = new CustomDropdown('destination-dropdown-btn', 'destination-dropdown-menu', 'destination-dropdown-text', 'Select Destination');
  window.dropdownInstances.push(destinationDropdown);
}

if (document.getElementById('depTime-dropdown-btn') &&
  document.getElementById('depTime-dropdown-menu') &&
  document.getElementById('depTime-dropdown-text')) {
  const departureTimeDropdown = new CustomDropdown('depTime-dropdown-btn', 'depTime-dropdown-menu', 'depTime-dropdown-text', 'Select Departure Time');
  window.dropdownInstances.push(departureTimeDropdown);
}


if (document.getElementById('desTime-dropdown-btn') &&
  document.getElementById('desTime-dropdown-menu') &&
  document.getElementById('desTime-dropdown-text')) {
  const destinationTimeDropdown = new CustomDropdown('desTime-dropdown-btn', 'desTime-dropdown-menu', 'desTime-dropdown-text', 'Select Destination Time');
  window.dropdownInstances.push(destinationTimeDropdown);
}

if (document.getElementById('BusType-dropdown-btn') &&
  document.getElementById('BusType-dropdown-menu') &&
  document.getElementById('BusType-dropdown-text')) {
  const BusTypeDropdown = new CustomDropdown('BusType-dropdown-btn', 'BusType-dropdown-menu', 'BusType-dropdown-text', 'Select Bus Type');
  window.dropdownInstances.push(BusTypeDropdown);
}

if (document.getElementById('BusTerminal-dropdown-btn') &&
  document.getElementById('BusTerminal-dropdown-menu') &&
  document.getElementById('BusTerminal-dropdown-text')) {
  const BusTerminalDropdown = new CustomDropdown('BusTerminal-dropdown-btn', 'BusTerminal-dropdown-menu', 'BusTerminal-dropdown-text', 'Select Terminal');
  window.dropdownInstances.push(BusTerminalDropdown);
}


// custom dropdown for profile :

document.addEventListener('DOMContentLoaded', function () {
  const ProfiledropdownBtn = document.getElementById('customDropdownBtn');
  const ProfiledropdownMenu = document.getElementById('customDropdownMenu');

  if (ProfiledropdownBtn && ProfiledropdownMenu) {
    ProfiledropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ProfiledropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      ProfiledropdownMenu.classList.remove('show');
    });
  }
});

