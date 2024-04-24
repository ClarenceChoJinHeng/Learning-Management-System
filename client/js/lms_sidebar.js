const openCloseSideNav = document.getElementById("openSideNav");
const navMainContainer = document.getElementById("navMainContainer");
const sideLabels = navMainContainer.querySelectorAll("label");

// Set initial width in JavaScript
navMainContainer.style.width = "13vh";
sideLabels.forEach((label) => {
  label.style.display = "none";
});

openCloseSideNav.addEventListener("click", () => {
  if (navMainContainer.style.width === "13vh") {
    navMainContainer.style.width = "50vh";
    sideLabels.forEach((label) => {
      label.style.display = "flex";
    });
  } else {
    navMainContainer.style.width = "13vh";
    sideLabels.forEach((label) => {
      label.style.display = "none";
    });
  }
});

navMainContainer.addEventListener("mouseover", () => {
  if (navMainContainer.style.width === "13vh") {
    navMainContainer.style.width = "50vh";
    sideLabels.forEach((label) => {
      label.style.display = "flex";
    });
  }
});

navMainContainer.addEventListener("mouseout", () => {
  if (navMainContainer.style.width === "50vh") {
    navMainContainer.style.width = "13vh";
    sideLabels.forEach((label) => {
      label.style.display = "none";
    });
  }
});