// Get the elements needed for the side navigation
const openCloseSideNav = document.getElementById("openSideNav");
const navMainContainer = document.getElementById("navMainContainer");
const sideLabels = navMainContainer.querySelectorAll("p");

// SET INITIAL WIDTH OF NAVIGATION CONTAINER
// Set the initial width of the navigation container and hide the labels
navMainContainer.style.width = "6rem";
sideLabels.forEach((p) => {
  p.style.display = "none";
});

// Add a click event listener to the open/close button
openCloseSideNav.addEventListener("click", (event) => {
  event.preventDefault();
  // If the navigation container is closed, open it and show the labels
  if (navMainContainer.style.width === "6rem") {
    navMainContainer.style.width = "20rem";
    sideLabels.forEach((p) => {
      p.style.display = "flex";
    });
  } else {
    // If the navigation container is open, close it and hide the labels
    navMainContainer.style.width = "6rem";
    sideLabels.forEach((p) => {
      p.style.display = "none";
    });
  }
});

// Add a mouseover event listener to the navigation container
navMainContainer.addEventListener("mouseover", (event) => {
  event.preventDefault();
  // If the navigation container is closed, open it and show the labels
  if (navMainContainer.style.width === "6rem") {
    navMainContainer.style.width = "20rem";
    sideLabels.forEach((p) => {
      p.style.display = "flex";
    });
  }
});

// Add a mouseout event listener to the navigation container
navMainContainer.addEventListener("mouseout", (event) => {
  event.preventDefault();
  // If the navigation container is open, close it and hide the labels
  if (navMainContainer.style.width === "20rem") {
    navMainContainer.style.width = "6rem";
    sideLabels.forEach((p) => {
      p.style.display = "none";
    });
  }
});
