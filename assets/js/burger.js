function getBurgerElements() {
  const overlay = document.getElementById("burger-overlay");
  const burger = document.getElementById("burger-menu");
  const toggleButton = document.getElementById("burger");

  if (!overlay || !burger || !toggleButton) {
    console.warn("Бургер-меню: не найдены необходимые элементы");
    return null;
  }

  return { overlay, burger, toggleButton };
}

function closeBurger({ burger, overlay, toggleButton }) {
  burger.classList.remove("flex");
  burger.classList.add("hidden");
  overlay.classList.add("hidden");
  toggleButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("overflow-hidden");

  // Закрываем все дропдауны при закрытии бургера
  closeAllDropdowns();
}

function openBurger({ burger, overlay, toggleButton }) {
  burger.classList.remove("hidden");
  burger.classList.add("flex");
  overlay.classList.remove("hidden");
  toggleButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("overflow-hidden");
}

function toggleBurgerState(burgerData) {
  const { toggleButton } = burgerData;
  const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    closeBurger(burgerData);
  } else {
    openBurger(burgerData);
  }
}

// ========== ЛОГИКА ДРОПДАУНОВ ==========

// Закрыть все дропдауны
function closeAllDropdowns() {
  document.querySelectorAll(".burger-dropdown").forEach((dropdown) => {
    const menu = dropdown.querySelector(".burger-dropdown__menu");
    const arrow = dropdown.querySelector(".burger-dropdown__arrow");

    if (menu) {
      menu.classList.add("hidden");
    }
    if (arrow) {
      arrow.style.transform = "rotate(0deg)";
    }
  });
}

// Закрыть все кроме текущего
function closeOtherDropdowns(currentDropdown) {
  document.querySelectorAll(".burger-dropdown").forEach((dropdown) => {
    if (dropdown !== currentDropdown) {
      const menu = dropdown.querySelector(".burger-dropdown__menu");
      const arrow = dropdown.querySelector(".burger-dropdown__arrow");

      if (menu && !menu.classList.contains("hidden")) {
        menu.classList.add("hidden");
        if (arrow) {
          arrow.style.transform = "rotate(0deg)";
        }
      }
    }
  });
}

// Переключение конкретного дропдауна
function toggleDropdown(dropdown) {
  const menu = dropdown.querySelector(".burger-dropdown__menu");
  const arrow = dropdown.querySelector(".burger-dropdown__arrow");

  if (!menu) return;

  const isOpen = !menu.classList.contains("hidden");

  // Закрываем другие дропдауны
  closeOtherDropdowns(dropdown);

  // Переключаем текущий
  if (isOpen) {
    menu.classList.add("hidden");
    if (arrow) {
      arrow.style.transform = "rotate(0deg)";
    }
  } else {
    menu.classList.remove("hidden");
    if (arrow) {
      arrow.style.transform = "rotate(180deg)";
    }
  }
}

// Инициализация дропдаунов
function initDropdowns() {
  const dropdowns = document.querySelectorAll(".burger-dropdown");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".burger-dropdown__trigger");

    if (trigger) {
      // Удаляем старый обработчик, если есть
      trigger.removeEventListener("click", dropdown.clickHandler);

      // Создаем новый обработчик
      dropdown.clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown(dropdown);
      };

      // Добавляем обработчик
      trigger.addEventListener("click", dropdown.clickHandler);
    }
  });
}

// Обработчик клика вне дропдаунов
function handleClickOutside(e) {
  // Если клик не по дропдауну и не по бургеру
  if (
    !e.target.closest(".burger-dropdown") &&
    !e.target.closest("#burger-menu")
  ) {
    closeAllDropdowns();
  }
}

// ========== ОСНОВНАЯ ЛОГИКА БУРГЕРА ==========

function prepareBurger() {
  const elements = getBurgerElements();
  if (!elements) return;

  const { toggleButton, burger, overlay } = elements;
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", "burger");

  // Обработчики — объявляем один раз
  const handleClickToggle = () => toggleBurgerState(elements);
  const handleClickOverlay = () => closeBurger(elements);
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      if (!burger.classList.contains("hidden")) {
        closeBurger(elements);
      }
      // Закрываем дропдауны по Escape
      closeAllDropdowns();
    }
  };

  function checkScreenSize() {
    // const isMobile = window.innerWidth < 1280;
    const isMobile = window.innerWidth < 5000;

    if (isMobile) {
      toggleButton.addEventListener("click", handleClickToggle);
      overlay.addEventListener("click", handleClickOverlay);
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("click", handleClickOutside);

      // Инициализируем дропдауны
      initDropdowns();
    } else {
      closeBurger(elements);
      toggleButton.removeEventListener("click", handleClickToggle);
      overlay.removeEventListener("click", handleClickOverlay);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    }
  }

  // Инициализация бургера
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  // Наблюдаем за изменениями в DOM (если дропдауны добавляются динамически)
  const observer = new MutationObserver(() => {
    if (window.innerWidth < 5000) {
      initDropdowns();
    }
  });

  observer.observe(document.getElementById("burger-menu"), {
    childList: true,
    subtree: true,
  });
}

// Закрытие бургера при нажатии на "Обратная связь" внутри него
function initFeedbackInBurger() {
  document.addEventListener("click", (e) => {
    const button = e.target.closest('[data-open-modal="questions"]');
    if (!button) return;

    // Проверяем, находится ли кнопка внутри бургера
    const burger = document.getElementById("burger-menu");
    if (burger && burger.contains(button)) {
      const elements = getBurgerElements();
      if (elements) {
        closeBurger(elements);
      }
    }
  });
}

// Запуск всего при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  prepareBurger();
  initFeedbackInBurger();
});

// Если нужно программно закрыть все дропдауны (можно вызвать из консоли)
window.closeBurgerDropdowns = closeAllDropdowns;
