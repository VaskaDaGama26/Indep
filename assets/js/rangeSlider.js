function handleRangeSlider() {
  const rangeElements = document.querySelectorAll(".range-slider");

  rangeElements.forEach((element) => {
    function updateProgress() {
      const min = element.min || 0;
      const max = element.max || 100;
      const value = element.value;

      const percent = ((value - min) / (max - min)) * 100;

      element.style.setProperty("--progress", `${percent}%`);
    }

    updateProgress();

    element.addEventListener("input", updateProgress);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handleRangeSlider();
});
