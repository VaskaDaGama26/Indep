function getEntities() {
  const toggleRealtorBtn = document.getElementById("toggle-left");
  const toggleClientBtn = document.getElementById("toggle-right");
  const contentRealtor = document.getElementById("content-left");
  const contentClient = document.getElementById("content-right");
  const toggleButtonsContainer = document.getElementById("toggle-buttons");

  const activeColorClass = toggleButtonsContainer
    ? toggleButtonsContainer.dataset.enableColorClass || "bg-[#080717]"
    : "bg-[#080717]";

  return {
    toggleClientBtn,
    toggleRealtorBtn,
    contentClient,
    contentRealtor,
    activeColorClass,
  };
}

function showTab(tabName) {
  const {
    toggleClientBtn,
    toggleRealtorBtn,
    contentClient,
    contentRealtor,
    activeColorClass,
  } = getEntities();

  // Скрываем весь контент
  contentClient.classList.add("hidden");
  contentRealtor.classList.add("hidden");

  // Сбрасываем стили обеих кнопок
  toggleClientBtn.classList.remove(activeColorClass, "text-[#FFFFFF]");
  toggleRealtorBtn.classList.remove(activeColorClass, "text-[#FFFFFF]");

  // Возвращаем дефолтные стили
  toggleClientBtn.classList.add("text-[#080717]");
  toggleRealtorBtn.classList.add("text-[#080717]");

  if (tabName === "right") {
    // Показываем контент "Ищу авто"
    contentClient.classList.remove("hidden");
    // Активируем кнопку "Ищу авто"
    toggleClientBtn.classList.remove("text-[#080717]");
    toggleClientBtn.classList.add(activeColorClass, "text-[#FFFFFF]");
  } else if (tabName === "left") {
    // Показываем контент "Я подборщик"
    contentRealtor.classList.remove("hidden");
    // Активируем кнопку "Я подборщик"
    toggleRealtorBtn.classList.remove("text-[#080717]");
    toggleRealtorBtn.classList.add(activeColorClass, "text-[#FFFFFF]");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const { toggleClientBtn, toggleRealtorBtn } = getEntities();

  // По умолчанию показываем "Ищу авто"
  showTab("right");

  toggleClientBtn.addEventListener("click", function () {
    showTab("right");
  });

  toggleRealtorBtn.addEventListener("click", function () {
    showTab("left");
  });
});
