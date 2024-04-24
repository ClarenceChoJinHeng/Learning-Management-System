// SIDE BAR NAVIGATION
const openCloseSideNav = document.getElementById("openSideNav");
const navMainContainer = document.getElementById("navMainContainer");
const sideLabels = navMainContainer.querySelectorAll("label");

// SET INITIAL WIDTH OF NAVIGATION CONTAINER
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

// ==================== POP UP MODAL ====================

const backgroundOverlay = document.getElementById("popupBackgroundOverlay");

const popupOverlay = document.getElementById("classPopupOverlay");

const createClassBtn = document.getElementById("createClassButton");

const cancelBtn = document.getElementById("cancelClassButton");

// OPEN OVERLAY FOR BACKGROUND AND POPUP

createClassBtn.addEventListener("click", () => {
  backgroundOverlay.style.display = "block";
  popupOverlay.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  backgroundOverlay.style.display = "none";
  popupOverlay.style.display = "none";
});