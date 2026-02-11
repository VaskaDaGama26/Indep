function toggleMarks() {
  const filtersContainer = document.getElementById("filters");

  if (!filtersContainer) {
    console.error("Элемент #filters не найден в DOM");
    return;
  }

  filtersContainer.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-mark]");

    if (button && filtersContainer.contains(button)) {
      button.classList.toggle("btn-mark-active");
    }
  });
}

document.addEventListener("DOMContentLoaded", toggleMarks);
