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

document.addEventListener("DOMContentLoaded", () => {
  const navDisplayTeachingContainer = document.getElementById(
    "navDisplayTeachingContainer"
  );
  const teachingArrow = document.getElementById("teachingArrow");
  const enrolledArrow = document.getElementById("enrolledArrow");
  const navDisplayEnrolledContainer = document.getElementById(
    "navDisplayEnrolledContainer"
  );
  const openSideNav = document.getElementById("openSideNav");
  const navTeachingContainer = document.getElementById("navTeachingContainer");
  const navEnrolledContainer = document.getElementById("navEnrolledContainer");

  navTeachingContainer.addEventListener("click", (event) => {
    if (navDisplayTeachingContainer.style.display !== "flex") {
      navDisplayTeachingContainer.style.display = "flex";
      teachingArrow.style.transform = "rotate(180deg)";
    } else {
      navDisplayTeachingContainer.style.display = "none";
      teachingArrow.style.transform = "rotate(0deg)";
    }
  });

  navEnrolledContainer.addEventListener("click", (event) => {
    if (navDisplayEnrolledContainer.style.display !== "flex") {
      navDisplayEnrolledContainer.style.display = "flex";
      enrolledArrow.style.transform = "rotate(180deg)";
    } else {
      navDisplayEnrolledContainer.style.display = "none";
      enrolledArrow.style.transform = "rotate(0deg)";
    }
  });

  window.addEventListener("mouseover", (event) => {
    if (
      !navMainContainer.contains(event.target) &&
      navDisplayTeachingContainer.style.display === "flex"
    ) {
      navDisplayTeachingContainer.style.display = "none";
      teachingArrow.style.transform = "rotate(0deg)";
    }

    if (
      !navMainContainer.contains(event.target) &&
      navDisplayEnrolledContainer.style.display === "flex"
    ) {
      navDisplayEnrolledContainer.style.display = "none";
      enrolledArrow.style.transform = "rotate(0deg)";
    }
  });
});

// ===================== DISPLAYING COURSES IN TEACHING AND ENROLLED =====================
