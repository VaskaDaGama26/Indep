function initSlider() {
  const slider = document.getElementById("slider");
  if (!slider) {
    console.error("Slider element not found");
    return;
  }

  const slides = slider.children;
  const slideCount = slides.length;

  if (slideCount === 0) return;

  let state = {
    currentIndex: 0,
    isAnimating: false,
    isDragging: false,
    startPos: 0,
    currentTranslate: 0,
    prevTranslate: 0,
    autoPlayInterval: null,
  };

  // Получение ширины слайда
  const getSlideWidth = () => {
    return slider.offsetWidth;
  };

  // Применение трансформации
  const applyTransform = (translateX, withTransition = false) => {
    if (withTransition) {
      slider.style.transition = "transform 0.5s ease-in-out";
    } else {
      slider.style.transition = "none";
    }
    slider.style.transform = `translateX(${translateX}px)`;
  };

  // Получение координаты X указателя
  const getPointerX = (e) => {
    if (e.type.includes("mouse")) return e.pageX;
    if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
    return 0;
  };

  // Переход к слайду
  const goToSlide = (index) => {
    if (state.isAnimating) return;

    state.isAnimating = true;
    state.currentIndex = index;
    state.prevTranslate = -index * getSlideWidth();

    applyTransform(state.prevTranslate, true);

    setTimeout(() => {
      state.isAnimating = false;
    }, 500);

    resetAutoPlay();
  };

  // Следующий слайд
  const nextSlide = () => {
    const nextIndex = (state.currentIndex + 1) % slideCount;
    goToSlide(nextIndex);
  };

  // Предыдущий слайд
  const prevSlide = () => {
    const prevIndex = (state.currentIndex - 1 + slideCount) % slideCount;
    goToSlide(prevIndex);
  };

  // Обработчики событий перетаскивания
  const handleStart = (e) => {
    if (state.isAnimating) return;

    e.preventDefault();
    state.isDragging = true;
    state.startPos = getPointerX(e);
    state.prevTranslate = -state.currentIndex * getSlideWidth();
    state.currentTranslate = state.prevTranslate;

    slider.style.transition = "none";
    stopAutoPlay();
  };

  const handleMove = (e) => {
    if (!state.isDragging || state.isAnimating) return;

    const currentX = getPointerX(e);
    const diff = currentX - state.startPos;
    state.currentTranslate = state.prevTranslate + diff;

    applyTransform(state.currentTranslate);
  };

  const handleEnd = () => {
    if (!state.isDragging || state.isAnimating) return;

    state.isDragging = false;

    const movedBy = state.currentTranslate - state.prevTranslate;
    const slideWidth = getSlideWidth();
    const threshold = slideWidth * 0.15; // 15% порог для смены слайда

    if (movedBy < -threshold) {
      // Свайп влево - следующий слайд
      nextSlide();
    } else if (movedBy > threshold) {
      // Свайп вправо - предыдущий слайд
      prevSlide();
    } else {
      // Возврат к текущему слайду
      applyTransform(state.prevTranslate, true);
    }

    startAutoPlay();
  };

  // Автопрокрутка
  const startAutoPlay = () => {
    stopAutoPlay();
    state.autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    if (state.autoPlayInterval) {
      clearInterval(state.autoPlayInterval);
      state.autoPlayInterval = null;
    }
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Удаление индикаторов если они есть
  const removeIndicators = () => {
    const indicatorsContainer = document.querySelector(".absolute.bottom-4");
    if (indicatorsContainer) {
      indicatorsContainer.remove();
    }
  };

  // Привязка событий
  const bindEvents = () => {
    // События перетаскивания
    slider.addEventListener("mousedown", handleStart);
    slider.addEventListener("touchstart", handleStart, { passive: false });

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove, { passive: false });

    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);
    document.addEventListener("touchcancel", handleEnd);

    // Остановка автопрокрутки при наведении
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);

    // Обновление при изменении размера окна
    window.addEventListener("resize", () => {
      if (!state.isAnimating && !state.isDragging) {
        state.prevTranslate = -state.currentIndex * getSlideWidth();
        applyTransform(state.prevTranslate);
      }
    });
  };

  // Инициализация
  const init = () => {
    // Устанавливаем начальную позицию
    slider.style.display = "flex";
    slider.style.width = "100%";

    state.prevTranslate = -state.currentIndex * getSlideWidth();
    applyTransform(state.prevTranslate);

    // Удаляем индикаторы
    removeIndicators();

    bindEvents();
    startAutoPlay();
  };

  init();

  // Публичное API
  return {
    goTo: goToSlide,
    next: nextSlide,
    prev: prevSlide,
    currentIndex: () => state.currentIndex,
    destroy: () => {
      stopAutoPlay();
      // Удаление обработчиков событий
      slider.removeEventListener("mousedown", handleStart);
      slider.removeEventListener("touchstart", handleStart);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);
      slider.removeEventListener("mouseenter", stopAutoPlay);
      slider.removeEventListener("mouseleave", startAutoPlay);
    },
  };
}

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.slider = initSlider();
  }, 100);
});

// Инициализация когда страница полностью загружена
window.addEventListener("load", () => {
  if (!window.slider) {
    window.slider = initSlider();
  }
});
