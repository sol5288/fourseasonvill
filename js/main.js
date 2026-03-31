/* ============================================
   포시즌 - Four Season | Main JavaScript
   ============================================ */

// ==================== DATA ====================
const heroSlides = [
  { id: 1, image: "/images/hero-1.webp", alt: "포시즌 메인 슬라이드 1" },
  { id: 2, image: "/images/hero-2.webp", alt: "포시즌 메인 슬라이드 2" },
  { id: 3, image: "/images/hero-3.webp", alt: "포시즌 단지배치도" }
];

const galleryItems = [
  { src: "/images/interior-1.jpeg", category: "interior", title: "거실" },
  { src: "/images/interior-2.jpeg", category: "interior", title: "주방" },
  { src: "/images/interior-3.jpeg", category: "interior", title: "주방 전경" },
  { src: "/images/interior-4.jpeg", category: "interior", title: "다이닝" },
  { src: "/images/interior-5.jpeg", category: "interior", title: "침실" },
  { src: "/images/interior-6.jpeg", category: "interior", title: "침실 2" },
  { src: "/images/interior-7.jpeg", category: "interior", title: "욕실" },
  { src: "/images/interior-8.jpeg", category: "interior", title: "욕실 2" },
  { src: "/images/interior-9.jpeg", category: "interior", title: "드레스룸" },
  { src: "/images/interior-10.jpeg", category: "interior", title: "복도" },
  { src: "/images/interior-11.jpeg", category: "interior", title: "계단" },
  { src: "/images/interior-12.jpeg", category: "interior", title: "테라스" },
  { src: "/images/interior-13.jpeg", category: "interior", title: "테라스 뷰" },
  { src: "/images/interior-14.jpeg", category: "interior", title: "전망" },
  { src: "/images/interior-15.jpeg", category: "interior", title: "인테리어" },
  { src: "/images/interior-16.jpeg", category: "interior", title: "인테리어 2" },
  { src: "/images/interior-17.jpeg", category: "interior", title: "공간" },
  { src: "/images/interior-18.jpeg", category: "interior", title: "공간 2" },
  { src: "/images/interior-2-alt.jpg", category: "interior", title: "전경" },
  { src: "/images/exterior-1.jpeg", category: "exterior", title: "외관" },
  { src: "/images/exterior-2.jpeg", category: "exterior", title: "외관 2" },
  { src: "/images/exterior-aerial.jpeg", category: "exterior", title: "항공 전경" },
  { src: "/images/location-1.webp", category: "location", title: "단지배치도 1" },
  { src: "/images/location-2.webp", category: "location", title: "단지배치도 2" },
  { src: "/images/location-3.webp", category: "location", title: "단지배치도 3" },
  { src: "/images/interior-1-alt.jpg", category: "interior", title: "세탁실" }
];

const floorplanItems = [
  { src: "/images/floorplan-1.jpg", title: "1층 평면도" },
  { src: "/images/floorplan-2.jpg", title: "2층 평면도" }
];

// ==================== STATE ====================
let currentHeroSlide = 0;
let heroInterval = null;
let currentGalleryIndex = 0;
let filteredGallery = [...galleryItems];
let currentCategory = "all";
let currentFloorplanIndex = 0;
let lightboxMode = "gallery";

// ==================== HERO SLIDER ====================
let heroAnimating = false;

function goToSlide(index) {
  if (index === currentHeroSlide || heroAnimating) return;
  heroAnimating = true;

  const container = document.getElementById("hero-slides-container");
  const direction = index > currentHeroSlide || (currentHeroSlide === heroSlides.length - 1 && index === 0) ? 1 : -1;

  // Current slide
  const currentSlide = container.querySelector(".hero-slide-active");

  // Create new slide
  const newSlide = document.createElement("div");
  newSlide.className = "absolute inset-0 w-full h-full";
  newSlide.style.transform = `translateX(${direction * 100}%)`;
  newSlide.style.transition = "transform 1s ease-in-out";

  const newImg = document.createElement("img");
  newImg.src = heroSlides[index].image;
  newImg.alt = heroSlides[index].alt;
  newImg.className = "w-full h-full object-cover";
  newImg.style.objectPosition = "center center";
  newImg.setAttribute("data-loc", "client/src/components/HeroSlider.tsx:47");
  newSlide.appendChild(newImg);
  container.appendChild(newSlide);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (currentSlide) {
        currentSlide.style.transition = "transform 1s ease-in-out";
        currentSlide.style.transform = `translateX(${-direction * 100}%)`;
      }
      newSlide.style.transform = "translateX(0)";
    });
  });

  // Clean up after animation
  setTimeout(() => {
    if (currentSlide) currentSlide.remove();
    newSlide.classList.add("hero-slide-active");
    heroAnimating = false;
  }, 1000);

  currentHeroSlide = index;

  // Update dots
  const dots = document.querySelectorAll(".hero-dot");
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.className = "hero-dot w-3 h-3 rounded-full transition-all duration-300 bg-white w-8";
    } else {
      dot.className = "hero-dot w-3 h-3 rounded-full transition-all duration-300 bg-white/50 hover:bg-white/75";
    }
  });

  resetHeroInterval();
}

function resetHeroInterval() {
  if (heroInterval) clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    goToSlide((currentHeroSlide + 1) % heroSlides.length);
  }, 4000);
}

// ==================== GALLERY ====================
function renderThumbnails() {
  const container = document.getElementById("gallery-thumbs");
  container.innerHTML = "";

  filteredGallery.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = `flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 ${
      index === currentGalleryIndex ? "ring-2 ring-[#b8956c] opacity-100" : "opacity-50 hover:opacity-80"
    }`;
    btn.onclick = () => goToGalleryImage(index);

    const img = document.createElement("img");
    img.alt = item.title;
    img.className = "w-full h-full object-cover";
    img.src = item.src;

    btn.appendChild(img);
    container.appendChild(btn);
  });
}

function updateGalleryMainImage() {
  const img = document.getElementById("gallery-main-img");
  const counter = document.getElementById("gallery-counter");
  const item = filteredGallery[currentGalleryIndex];

  img.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  img.style.opacity = "0";
  img.style.transform = "scale(1.05)";
  setTimeout(() => {
    img.src = item.src;
    img.alt = item.title;
    img.style.opacity = "1";
    img.style.transform = "scale(1)";
  }, 500);

  counter.textContent = `${currentGalleryIndex + 1} / ${filteredGallery.length}`;

  // Update thumbnail active state
  const thumbs = document.querySelectorAll("#gallery-thumbs button");
  thumbs.forEach((thumb, i) => {
    if (i === currentGalleryIndex) {
      thumb.className = "flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 ring-2 ring-[#b8956c] opacity-100";
    } else {
      thumb.className = "flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 opacity-50 hover:opacity-80";
    }
  });

  // Scroll active thumbnail into view (without affecting page scroll)
  const container = document.getElementById("gallery-thumbs");
  const activeThumb = thumbs[currentGalleryIndex];
  if (activeThumb && container) {
    const thumbLeft = activeThumb.offsetLeft;
    const thumbWidth = activeThumb.offsetWidth;
    const containerWidth = container.offsetWidth;
    container.scrollTo({
      left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
      behavior: "smooth"
    });
  }
}

function goToGalleryImage(index) {
  currentGalleryIndex = index;
  updateGalleryMainImage();
}

function galleryPrev() {
  currentGalleryIndex = (currentGalleryIndex - 1 + filteredGallery.length) % filteredGallery.length;
  updateGalleryMainImage();
}

function galleryNext() {
  currentGalleryIndex = (currentGalleryIndex + 1) % filteredGallery.length;
  updateGalleryMainImage();
}

function filterGallery(category) {
  currentCategory = category;
  currentGalleryIndex = 0;

  if (category === "all") {
    filteredGallery = [...galleryItems];
  } else {
    filteredGallery = galleryItems.filter((item) => item.category === category);
  }

  // Update tab styles
  document.querySelectorAll(".gallery-tab").forEach((tab) => {
    if (tab.dataset.category === category) {
      tab.className = "gallery-tab px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-sans-kr transition-all duration-300 whitespace-nowrap bg-[#1a3a2a] text-white";
    } else {
      tab.className = "gallery-tab px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-sans-kr transition-all duration-300 whitespace-nowrap bg-[#f5f4f2] text-[#6a6a6a] hover:bg-[#e8e6e2]";
    }
  });

  renderThumbnails();
  updateGalleryMainImage();
}

// ==================== FLOORPLAN ====================
function renderFloorplanThumbnails() {
  const container = document.getElementById("floorplan-thumbs");
  container.innerHTML = "";

  floorplanItems.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = `flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 ${
      index === currentFloorplanIndex ? "ring-2 ring-[#b8956c] opacity-100" : "opacity-50 hover:opacity-80"
    }`;
    btn.onclick = () => goToFloorplanImage(index);

    const img = document.createElement("img");
    img.alt = item.title;
    img.className = "w-full h-full object-cover";
    img.src = item.src;

    btn.appendChild(img);
    container.appendChild(btn);
  });
}

function updateFloorplanMainImage() {
  const img = document.getElementById("floorplan-main-img");
  const counter = document.getElementById("floorplan-counter");
  const item = floorplanItems[currentFloorplanIndex];

  img.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  img.style.opacity = "0";
  img.style.transform = "scale(1.05)";
  setTimeout(() => {
    img.src = item.src;
    img.alt = item.title;
    img.style.opacity = "1";
    img.style.transform = "scale(1)";
  }, 500);

  counter.textContent = `${currentFloorplanIndex + 1} / ${floorplanItems.length}`;

  const thumbs = document.querySelectorAll("#floorplan-thumbs button");
  thumbs.forEach((thumb, i) => {
    if (i === currentFloorplanIndex) {
      thumb.className = "flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 ring-2 ring-[#b8956c] opacity-100";
    } else {
      thumb.className = "flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 opacity-50 hover:opacity-80";
    }
  });
}

function goToFloorplanImage(index) {
  currentFloorplanIndex = index;
  updateFloorplanMainImage();
}

function floorplanPrev() {
  currentFloorplanIndex = (currentFloorplanIndex - 1 + floorplanItems.length) % floorplanItems.length;
  updateFloorplanMainImage();
}

function floorplanNext() {
  currentFloorplanIndex = (currentFloorplanIndex + 1) % floorplanItems.length;
  updateFloorplanMainImage();
}

// ==================== LIGHTBOX ====================
function updateLightboxContent() {
  const img = document.getElementById("lightbox-img");
  const counter = document.getElementById("lightbox-counter");
  let item, index, total;
  if (lightboxMode === "gallery") {
    item = filteredGallery[currentGalleryIndex];
    index = currentGalleryIndex;
    total = filteredGallery.length;
  } else {
    item = floorplanItems[currentFloorplanIndex];
    index = currentFloorplanIndex;
    total = floorplanItems.length;
  }
  img.src = item.src;
  img.alt = item.title;
  counter.textContent = `${index + 1} / ${total}`;
}

function openGalleryLightbox() {
  lightboxMode = "gallery";
  updateLightboxContent();
  showLightbox();
}

function openFloorplanLightbox() {
  lightboxMode = "floorplan";
  updateLightboxContent();
  showLightbox();
}

function showLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "flex";
  requestAnimationFrame(() => {
    lightbox.style.transition = "opacity 0.3s ease";
    lightbox.style.opacity = "1";
  });
  document.body.style.overflow = "hidden";
}

function lightboxPrev() {
  if (lightboxMode === "gallery") galleryPrev();
  else floorplanPrev();
  updateLightboxContent();
}

function lightboxNext() {
  if (lightboxMode === "gallery") galleryNext();
  else floorplanNext();
  updateLightboxContent();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.transition = "opacity 0.3s ease";
  lightbox.style.opacity = "0";
  setTimeout(() => {
    lightbox.style.display = "none";
  }, 300);
  document.body.style.overflow = "";
}

// ==================== NOTICE ACCORDION ====================
function toggleNotice(btn) {
  const noticeItem = btn.closest(".notice-item");
  const content = noticeItem.querySelector(".notice-content");
  const icon = noticeItem.querySelector(".notice-icon");
  const chevron = icon.querySelector("svg");
  const isOpen = content.style.height !== "0px" && content.style.height !== "0";

  if (isOpen) {
    // Close
    content.style.height = "0";
    content.style.opacity = "0";
    icon.className = "notice-icon w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-all duration-300";
    chevron.className = "lucide lucide-chevron-down w-5 h-5 transition-all duration-300 text-[#8a8578]";
  } else {
    // Close all others first
    document.querySelectorAll(".notice-item").forEach((item) => {
      const c = item.querySelector(".notice-content");
      const ic = item.querySelector(".notice-icon");
      const ch = ic.querySelector("svg");
      c.style.height = "0";
      c.style.opacity = "0";
      ic.className = "notice-icon w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-all duration-300";
      ch.className = "lucide lucide-chevron-down w-5 h-5 transition-all duration-300 text-[#8a8578]";
    });
    // Open this one
    content.style.height = "auto";
    content.style.opacity = "1";
    icon.className = "notice-icon w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-[#1a3a2a]";
    chevron.className = "lucide lucide-chevron-down w-5 h-5 transition-all duration-300 rotate-180 text-white";
  }
}

// ==================== HEADER SCROLL ====================
function handleHeaderScroll() {
  const header = document.getElementById("site-header");
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    header.className = "fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-white/98 backdrop-blur-lg shadow-sm";
    // Update text colors
    header.querySelectorAll("nav button").forEach((btn) => {
      btn.className = btn.className.replace("text-white/90 hover:text-white", "text-[#1a3a2a] hover:text-[#b8956c]");
    });
    header.querySelector("a[href='#']").querySelectorAll("span").forEach((s) => {
      s.className = s.className.replace("text-white", "text-[#1a3a2a]").replace("text-white/80", "text-[#8a8578]");
    });
    const phoneBtn = header.querySelector("a[href='tel:031-266-9970']");
    if (phoneBtn) {
      phoneBtn.className = "hidden md:flex items-center gap-3 px-4 lg:px-6 py-3 transition-all duration-500 group bg-[#1a3a2a] text-white border border-[#1a3a2a] hover:bg-[#2a4a3a]";
    }
    const menuBtn = document.getElementById("mobile-menu-btn");
    if (menuBtn) menuBtn.className = "md:hidden p-2 transition-colors duration-300 text-[#1a3a2a]";
  } else {
    header.className = "fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-gradient-to-b from-black/40 to-transparent";
    header.querySelectorAll("nav button").forEach((btn) => {
      btn.className = btn.className.replace("text-[#1a3a2a] hover:text-[#b8956c]", "text-white/90 hover:text-white");
    });
    header.querySelector("a[href='#']").querySelectorAll("span").forEach((s) => {
      s.className = s.className.replace("text-[#1a3a2a]", "text-white").replace("text-[#8a8578]", "text-white/80");
    });
    const phoneBtn = header.querySelector("a[href='tel:031-266-9970']");
    if (phoneBtn) {
      phoneBtn.className = "hidden md:flex items-center gap-3 px-4 lg:px-6 py-3 transition-all duration-500 group bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20";
    }
    const menuBtn = document.getElementById("mobile-menu-btn");
    if (menuBtn) menuBtn.className = "md:hidden p-2 transition-colors duration-300 text-white";
  }
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.add("hidden");
}

// ==================== FLOATING CONTACT ====================
let floatingOpen = false;

function handleFloatingVisibility() {
  const el = document.getElementById("floating-contact");
  if (window.scrollY > 300) {
    el.style.display = "flex";
  } else {
    el.style.display = "none";
  }
}

function toggleFloatingContact() {
  floatingOpen = !floatingOpen;
  const buttons = document.getElementById("floating-buttons");
  const iconPhone = document.getElementById("floating-icon-phone");
  const iconClose = document.getElementById("floating-icon-close");
  const toggle = document.getElementById("floating-toggle");

  if (floatingOpen) {
    buttons.style.display = "flex";
    iconPhone.style.display = "none";
    iconClose.style.display = "block";
    toggle.style.backgroundColor = "#1A2A3A";
  } else {
    buttons.style.display = "none";
    iconPhone.style.display = "block";
    iconClose.style.display = "none";
    toggle.style.backgroundColor = "#C9A962";
  }
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const observerY = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observerY.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "-100px" }
  );

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observerY.observe(el);
  });

  const observerX = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
          observerX.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "-100px" }
  );

  document.querySelectorAll(".animate-on-scroll-x").forEach((el) => {
    observerX.observe(el);
  });
}

// ==================== SMOOTH SCROLL ====================
function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ==================== FOOTER LINKS ====================
function initFooterLinks() {
  document.querySelectorAll(".footer-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      scrollToSection(href);
    });
  });
}

// ==================== KEYBOARD ====================
function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox.style.display === "flex") {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    }
  });
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  // Hero slider - create initial slide
  const heroContainer = document.getElementById("hero-slides-container");
  const initialSlide = document.createElement("div");
  initialSlide.className = "hero-slide-active absolute inset-0 w-full h-full";
  const initialImg = document.createElement("img");
  initialImg.src = heroSlides[0].image;
  initialImg.alt = heroSlides[0].alt;
  initialImg.className = "w-full h-full object-cover";
  initialImg.style.objectPosition = "center center";
  initialImg.setAttribute("data-loc", "client/src/components/HeroSlider.tsx:47");
  initialSlide.appendChild(initialImg);
  heroContainer.appendChild(initialSlide);
  resetHeroInterval();

  // Gallery
  renderThumbnails();

  // Floorplan
  renderFloorplanThumbnails();
  const fpImg = document.getElementById("floorplan-main-img");
  if (fpImg && floorplanItems.length > 0) {
    fpImg.src = floorplanItems[0].src;
    fpImg.alt = floorplanItems[0].title;
  }

  // Header scroll
  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();

  // Floating contact
  window.addEventListener("scroll", handleFloatingVisibility);

  // Mobile menu
  document.getElementById("mobile-menu-btn").addEventListener("click", toggleMobileMenu);

  // Scroll animations
  initScrollAnimations();

  // Footer links
  initFooterLinks();

  // Keyboard navigation
  initKeyboard();
});
