const slides = Array.from(document.querySelectorAll(".hero__slide"));
const indicators = Array.from(document.querySelectorAll(".carousel-controls__indicator"));
const currentSlideLabel = document.querySelector("#current-slide");
const arrowButtons = document.querySelectorAll(".carousel-controls__arrow");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const newsletterForm = document.querySelector("#newsletter-form");
const newsletterStatus = document.querySelector("#newsletter-status");

let activeSlide = 0;
let carouselTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  indicators.forEach((indicator, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    indicator.classList.toggle("is-active", isActive);
    if (isActive) {
      indicator.setAttribute("aria-current", "true");
    } else {
      indicator.removeAttribute("aria-current");
    }
  });

  currentSlideLabel.textContent = String(activeSlide + 1).padStart(2, "0");
}

function startCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
}

arrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSlide(activeSlide + Number(button.dataset.direction));
    startCarousel();
  });
});

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    showSlide(index);
    startCarousel();
  });
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterStatus.textContent = "La suscripción aún no está habilitada. Vuelva pronto para recibir novedades.";
});

startCarousel();
