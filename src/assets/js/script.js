const slides = Array.from(document.querySelectorAll(".hero__slide"));
const indicators = Array.from(document.querySelectorAll(".carousel-controls__indicator"));
const currentSlideLabel = document.querySelector("#current-slide");
const arrowButtons = document.querySelectorAll(".carousel-controls__arrow");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const newsletterForm = document.querySelector("#newsletter-form");
const newsletterStatus = document.querySelector("#newsletter-status");
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
const catalogFilters = document.querySelector("#catalog-filters");
const vehicleCards = Array.from(document.querySelectorAll(".vehicle-card"));
const catalogEmptyMessage = document.querySelector("#catalog-empty");
const sedeMapButtons = Array.from(document.querySelectorAll("[data-sede-map]"));
const sedeDialog = document.querySelector("#sede-dialog");
const sedeDialogTitle = document.querySelector("#sede-dialog-title");
const sedeDialogAddress = document.querySelector("#sede-dialog-address");
const sedeDialogMap = document.querySelector("#sede-dialog-map");
const sedeDialogClose = document.querySelector(".sede-dialog__close");
const testimoniosTrack = document.querySelector(".testimonios__track");
const testimoniosGroup = document.querySelector(".testimonios__group");
const testimoniosToggle = document.querySelector("#testimonios-toggle");

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

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactStatus.textContent = "El formulario aún no está conectado a un servicio de envío; su mensaje no se ha enviado.";
});

catalogFilters.addEventListener("change", () => {
  const filters = new FormData(catalogFilters);
  const selectedFilters = {
    brand: filters.get("marca"),
    model: filters.get("modelo"),
    year: filters.get("ano"),
    condition: filters.get("condicion"),
  };
  let visibleCards = 0;

  vehicleCards.forEach((card) => {
    const matchesFilters = Object.entries(selectedFilters).every(([attribute, selectedValue]) =>
      !selectedValue || selectedValue === card.dataset[attribute]
    );

    card.hidden = !matchesFilters;
    if (matchesFilters) {
      visibleCards += 1;
    }
  });

  catalogEmptyMessage.hidden = visibleCards > 0;
});

sedeMapButtons.forEach((button) => {
  const { lat, lon, city } = button.dataset;
  button.querySelector("iframe").src = createMapUrl(lat, lon, 13);

  button.addEventListener("click", () => {
    sedeDialogTitle.textContent = city;
    sedeDialogAddress.textContent = button.dataset.address;
    sedeDialogMap.title = `Mapa ampliado de ${city}`;
    sedeDialogMap.src = createMapUrl(lat, lon, 16);
    sedeDialog.showModal();
  });
});

sedeDialogClose.addEventListener("click", () => sedeDialog.close());
sedeDialog.addEventListener("click", (event) => {
  if (event.target === sedeDialog) {
    sedeDialog.close();
  }
});
sedeDialog.addEventListener("close", () => sedeDialogMap.removeAttribute("src"));

const duplicatedTestimonios = testimoniosGroup.cloneNode(true);
duplicatedTestimonios.setAttribute("aria-hidden", "true");
testimoniosTrack.append(duplicatedTestimonios);

testimoniosToggle.addEventListener("click", () => {
  const isPaused = testimoniosTrack.classList.toggle("is-paused");
  const action = isPaused ? "Reanudar" : "Pausar";

  testimoniosToggle.setAttribute("aria-pressed", String(isPaused));
  testimoniosToggle.setAttribute("aria-label", `${action} carrusel de testimonios`);
  testimoniosToggle.firstElementChild.textContent = isPaused ? "▶" : "Ⅱ";
  testimoniosToggle.querySelector("[data-testimonios-toggle-label]").textContent = action;
});

function createMapUrl(latitude, longitude, zoom) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const latitudeDelta = 0.1 / 2 ** (zoom - 10);
  const longitudeDelta = latitudeDelta / Math.cos((lat * Math.PI) / 180);
  const bounds = [
    lon - longitudeDelta,
    lat - latitudeDelta,
    lon + longitudeDelta,
    lat + latitudeDelta,
  ].map((coordinate) => coordinate.toFixed(6));

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.join("%2C")}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

startCarousel();
