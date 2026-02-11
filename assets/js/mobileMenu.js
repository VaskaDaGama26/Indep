const updateMobileMenu = () => {
  const path = location.pathname;
  const activeIndex =
    path === "/"
      ? 0
      : path.includes("chat")
        ? 1
        : path.includes("call")
          ? 2
          : path.includes("profile")
            ? 3
            : -1;

  const items = document.querySelectorAll("#mobilemenu a.mobile-menu-item");
  items.forEach((item, index) => {
    const color = index === activeIndex ? "#DB4431" : "#A0A0A0";

    item.querySelectorAll("path").forEach((path) => (path.style.fill = color));

    const text = item.querySelector("p");
    if (text) text.style.color = color;
  });
};

document.addEventListener("DOMContentLoaded", updateMobileMenu);
window.addEventListener("popstate", updateMobileMenu);
