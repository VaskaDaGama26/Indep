function toggleFilters() {
  let isOpen = false;
  let filtersButton = null;
  let filtersSection = null;

  function closeFilters() {
    if (!filtersSection) return;
    filtersSection.classList.add("-translate-x-full");
    isOpen = false;
    document.body.classList.remove("overflow-hidden");
    if (filtersButton) {
      filtersButton.classList.remove("bg-[#F3E4E2]", "text-[#DB4431]");
      filtersButton.classList.add("bg-[#DB4431]", "text-[#FFFFFF]");
    }
  }

  function openFilters() {
    if (!filtersSection) return;
    filtersSection.classList.remove("-translate-x-full");
    isOpen = true;
    document.body.classList.add("overflow-hidden");
    if (filtersButton) {
      filtersButton.classList.remove("bg-[#DB4431]", "text-[#FFFFFF]");
      filtersButton.classList.add("bg-[#F3E4E2]", "text-[#DB4431]");
    }
  }

  // Инициализация при DOMContentLoaded
  filtersButton = document.querySelector("#filter-btn");
  filtersSection = document.querySelector("#filters");

  if (!filtersButton || !filtersSection) {
    console.error("Не найдены элементы фильтра");
    return;
  }

  filtersButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (isOpen) {
      closeFilters();
    } else {
      openFilters();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      isOpen &&
      filtersSection &&
      filtersButton &&
      !filtersSection.contains(event.target) &&
      !filtersButton.contains(event.target)
    ) {
      closeFilters();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      closeFilters();
    }
  });
}

document.addEventListener("DOMContentLoaded", toggleFilters);
