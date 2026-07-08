document.addEventListener("DOMContentLoaded", () => {
  
  const hamburgerToggle = document.getElementById("hamburger-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileClose = document.getElementById("mobile-close");
  const mobileLinks = mobileMenu.querySelectorAll("a");

  function openMobileMenu(e) {
    if (e) e.preventDefault();
    mobileMenu.classList.add("active");
    hamburgerToggle.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu(e) {
    if (e && e.currentTarget === mobileClose) e.preventDefault();
    mobileMenu.classList.remove("active");
    hamburgerToggle.setAttribute("aria-expanded", "false");
  }

  if (hamburgerToggle && mobileMenu) {
    hamburgerToggle.addEventListener("click", openMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Fechar menu se redimensionar para ecrã maior
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && mobileMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });


  // 2. DARK MODE / LIGHT MODE TOGGLE
 
  const themeToggleBtn = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme");

  // Iniciar com tema salvo
  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    if (themeToggleBtn) themeToggleBtn.innerHTML = "🌙"; // Ícone de lua para voltar a escuro
  } else {
    document.body.classList.remove("light-mode");
    if (themeToggleBtn) themeToggleBtn.innerHTML = "☀️"; // Ícone de sol para ir para claro
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");
      
      if (isLight) {
        localStorage.setItem("theme", "light");
        themeToggleBtn.innerHTML = "🌙";
      } else {
        localStorage.setItem("theme", "dark");
        themeToggleBtn.innerHTML = "☀️";
      }
    });
  }


  
  // 3. BOTÃO VOLTAR AO TOPO
  
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  
  // 4. VALIDAÇÃO DE FORMULÁRIO (CUSTOM JS)
  
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");

  function showError(input, message) {
    const parent = input.parentElement;
    parent.classList.add("error");
    let errorSpan = parent.querySelector(".error-msg");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error-msg";
      parent.appendChild(errorSpan);
    }
    errorSpan.innerText = message;
    input.classList.add("invalid");
  }

  function clearError(input) {
    const parent = input.parentElement;
    parent.classList.remove("error");
    const errorSpan = parent.querySelector(".error-msg");
    if (errorSpan) {
      parent.removeChild(errorSpan);
    }
    input.classList.remove("invalid");
  }

  function validateForm(e) {
    e.preventDefault();
    let isValid = true;

    // Validar Nome
    if (nameInput.value.trim() === "") {
      showError(nameInput, "O nome completo é obrigatório.");
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      showError(nameInput, "O nome deve conter pelo menos 3 caracteres.");
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === "") {
      showError(emailInput, "O e-mail é obrigatório.");
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, "Insira um endereço de e-mail válido.");
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Validar Mensagem
    if (messageInput.value.trim() === "") {
      showError(messageInput, "A mensagem é obrigatória.");
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, "A mensagem deve conter pelo menos 10 caracteres.");
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      showSuccessPopup();
      contactForm.reset();
    }
  }

  function showSuccessPopup() {
    // Criar popup de sucesso dinamicamente
    const popup = document.createElement("div");
    popup.className = "success-popup";
    popup.innerHTML = `
      <div class="success-popup-content">
        <span class="success-popup-icon">✓</span>
        <h3>Mensagem Enviada!</h3>
        <p>Agradecemos o seu contacto. A nossa equipa responderá o mais breve possível.</p>
        <button class="btn-primary" id="success-popup-close">Fechar</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Fade-in
    setTimeout(() => popup.classList.add("active"), 10);

    const closeBtn = popup.querySelector("#success-popup-close");
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("active");
      setTimeout(() => document.body.removeChild(popup), 300);
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", validateForm);

    // Validação em tempo real (on input)
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim().length >= 3) clearError(nameInput);
    });
    emailInput.addEventListener("input", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailInput.value.trim())) clearError(emailInput);
    });
    messageInput.addEventListener("input", () => {
      if (messageInput.value.trim().length >= 10) clearError(messageInput);
    });
  }



  // 5. CARROSSÉIS E SLIDERS (DEPOIMENTOS)
  
  function initCarousel(carouselContainer) {
    if (!carouselContainer) return;

    const track = carouselContainer.querySelector(".testemunhos-carousel");
    if (!track) return;
    const slides = Array.from(track.children);
    const nextButton = carouselContainer.querySelector(".carousel-btn.next");
    const prevButton = carouselContainer.querySelector(".carousel-btn.prev");
    const dotsContainer = carouselContainer.querySelector(".carousel-dots");

    if (slides.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    // Criar dots indicadores
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (index === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Ir para slide ${index + 1}`);
      dot.addEventListener("click", () => moveToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateDots() {
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    function moveToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    // Garantir estado inicial correto (1º slide, 1º dot activo)
    moveToSlide(0);

    // Eventos de clique para botões
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        moveToSlide(currentIndex + 1);
      });
    }
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        moveToSlide(currentIndex - 1);
      });
    }

    // Suporte para Toque / Swipe (iPhone XR)
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;
      
      // Se arrastar muito para o lado
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          moveToSlide(currentIndex + 1);
        } else {
          moveToSlide(currentIndex - 1);
        }
        isDragging = false;
      }
    }, { passive: true });

    track.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Auto-play opcional a cada 6 segundos
    let autoPlayTimer = setInterval(() => moveToSlide(currentIndex + 1), 6000);

    // Resetar timer quando o utilizador interage
    carouselContainer.addEventListener("mouseenter", () => clearInterval(autoPlayTimer));
    carouselContainer.addEventListener("mouseleave", () => {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => moveToSlide(currentIndex + 1), 6000);
    });
    carouselContainer.addEventListener("touchstart", () => clearInterval(autoPlayTimer), { passive: true });
  }

  // Inicializar o carrossel de depoimentos
  const testimonialsWrapper = document.querySelector(".carousel-container");
  if (testimonialsWrapper) {
    initCarousel(testimonialsWrapper);
  }


  
  // 6. MAPA INTERATIVO (GOOGLE MAPS API)
  
 
  const MAPS_API_KEY = ""; // <-- coloca aqui a tua chave da API do Google Maps

  const GYM_LOCATION = { lat: -8.8272, lng: 13.2450 }; // Rua da Maianga, Luanda

  function initGoogleMap() {
    const mapEl = document.getElementById("map");
    if (!mapEl || typeof google === "undefined") return;

    mapEl.innerHTML = ""; // remove o iframe de fallback

    const map = new google.maps.Map(mapEl, {
      center: GYM_LOCATION,
      zoom: 15,
      disableDefaultUI: false,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1A1A1A" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0A0A0A" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#BBBBBB" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#222222" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#111111" }] }
      ]
    });

    const marker = new google.maps.Marker({
      position: GYM_LOCATION,
      map: map,
      title: "PowerCore Gym"
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-family:sans-serif;font-size:13px;color:#111;">
                   <strong>PowerCore Gym</strong><br>Rua da Maianga, 142, Luanda
                 </div>`
    });

    marker.addListener("click", () => infoWindow.open(map, marker));
  }

  // Torna a função acessível ao callback do <script> da API do Google Maps
  window.initGoogleMap = initGoogleMap;

  if (MAPS_API_KEY) {
    const mapsScript = document.createElement("script");
    mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=initGoogleMap`;
    mapsScript.async = true;
    mapsScript.defer = true;
    document.head.appendChild(mapsScript);
  }
 


 
  // 7. INTEGRAÇÃO COM REDES SOCIAIS (WEB SHARE API)

  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: "PowerCore Gym — Forja o teu limite",
        text: "Conhece o PowerCore Gym em Luanda: musculação, boxe, personal trainer e nutrição.",
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // utilizador cancelou a partilha — nada a fazer
        }
      } else {
        // Fallback: copiar link para a área de transferência
        try {
          await navigator.clipboard.writeText(shareData.url);
          shareBtn.setAttribute("title", "Link copiado!");
          const originalHTML = shareBtn.innerHTML;
          shareBtn.innerHTML = "✓";
          setTimeout(() => { shareBtn.innerHTML = originalHTML; }, 1500);
        } catch (err) {
          window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, "_blank");
        }
      }
    });
  }
});
