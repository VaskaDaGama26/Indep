document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");
  if (!slider || slider.children.length < 2) return;

  const isInteractive = (el) =>
    el?.closest(
      "button, a, input, textarea, select, label, form, [contenteditable], .open-modal-btn"
    );

  let idx = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let isAnimating = false;
  let autoTimer = null;
  const slides = slider.children;
  const total = slides.length;
  const parent = slider.parentElement;

  const getVisibleWidth = () => parent?.offsetWidth || window.innerWidth;

  const setPos = (x, animate) => {
    slider.style.transform = `translate3d(${x}px, 0, 0)`;
    slider.style.transition = animate ? "transform 1s ease" : "none";

    if (animate) {
      isAnimating = true;
      clearTimeout(slider._animEnd);
      slider._animEnd = setTimeout(() => {
        isAnimating = false;
      }, 410);
    } else {
      isAnimating = false;
      clearTimeout(slider._animEnd);
    }
  };

  const goTo = (i) => {
    if (isAnimating || isDragging) return;
    idx = ((i % total) + total) % total;
    setPos(-idx * getVisibleWidth(), true);
    resetAuto();
  };

  const startAuto = () => {
    stopAuto();
    if (!isAnimating && !isDragging) {
      autoTimer = setTimeout(() => {
        if (!isAnimating && !isDragging) goTo(idx + 1);
      }, 5000);
    }
  };
  const stopAuto = () => {
    clearTimeout(autoTimer);
    autoTimer = null;
  };
  const resetAuto = () => {
    stopAuto();
    startAuto();
  };

  const onStart = (e) => {
    if (isInteractive(e.target) || (e.type === "mousedown" && e.button !== 0))
      return;

    if (isAnimating) {
      clearTimeout(slider._animEnd);
      isAnimating = false;
    }

    const width = getVisibleWidth();
    const matrix = getComputedStyle(slider).transform;
    const currentTranslate =
      matrix === "none" ? -idx * width : parseFloat(matrix.split(",")[4]);

    idx = Math.min(
      Math.max(Math.round(-currentTranslate / width), 0),
      total - 1
    );

    isDragging = true;
    startX = e.type.startsWith("touch") ? e.touches[0].clientX : e.pageX;
    currentX = currentTranslate;
    setPos(currentX, false);
    stopAuto();

    if (e.cancelable) e.preventDefault();
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const x = e.type.startsWith("touch") ? e.touches[0].clientX : e.pageX;
    setPos(currentX + (x - startX), false);
    if (e.cancelable) e.preventDefault();
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    const width = getVisibleWidth();
    const matrix = getComputedStyle(slider).transform;
    const currentTranslate =
      matrix === "none" ? -idx * width : parseFloat(matrix.split(",")[4]);
    const diff = currentTranslate + idx * width;
    const threshold = width * 0.25;

    if (diff < -threshold) goTo(idx + 1);
    else if (diff > threshold) goTo(idx - 1);
    else setPos(-idx * width, true);
  };

  const initSizes = () => {
    const width = getVisibleWidth();
    for (let i = 0; i < total; i++) {
      slides[i].style.width = `${width}px`;
    }
    slider.style.width = "auto";

    if (!isDragging) {
      setPos(-idx * width, false);
    }
  };

  Object.assign(slider.style, {
    display: "flex",
    height: "100%",
    touchAction: "pan-y pinch-zoom",
    willChange: "transform",
  });

  slider.addEventListener("mousedown", onStart);
  slider.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);
  document.addEventListener("touchcancel", onEnd);
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isDragging && !isAnimating) {
        initSizes();
      }
    }, 100);
  });

  initSizes();
  startAuto();

  window.addEventListener("beforeunload", stopAuto);
});
