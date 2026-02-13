function toggleFavourite() {
  const favouriteButtons = document.querySelectorAll("button#addToFavourite");
  const currentPath = window.location.pathname;
  const isFavouritePage = currentPath.includes("/favourites");

  favouriteButtons.forEach((button) => {
    if (isFavouritePage) {
      // На странице избранного все сердечки заполнены
      const paths = button.querySelectorAll("path");
      paths.forEach((path) => {
        path.style.fill = "#db4431";
        path.style.stroke = "none";
      });
      button.classList.add("active");
    } else {
      // На других страницах - пустые сердечки
      const paths = button.querySelectorAll("path");
      paths.forEach((path) => {
        path.style.fill = "none";
        path.style.stroke = "#BFBFBF";
      });
      button.classList.remove("active");
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const paths = this.querySelectorAll("path");
      const isActive = this.classList.contains("active");

      if (isActive) {
        paths.forEach((path) => {
          path.style.fill = "none";
          path.style.stroke = "#BFBFBF";
        });
        this.classList.remove("active");
      } else {
        paths.forEach((path) => {
          path.style.fill = "#db4431";
          path.style.stroke = "none";
        });
        this.classList.add("active");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  toggleFavourite();
});
