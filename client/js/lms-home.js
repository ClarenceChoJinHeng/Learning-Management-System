// SIDE BAR NAVIGATION
// Get the elements needed for the side navigation
const openCloseSideNav = document.getElementById("openSideNav");
const navMainContainer = document.getElementById("navMainContainer");
const sideLabels = navMainContainer.querySelectorAll("p");

// SET INITIAL WIDTH OF NAVIGATION CONTAINER
// Set the initial width of the navigation container and hide the labels
navMainContainer.style.width = "7rem";
sideLabels.forEach((p) => {
  p.style.display = "none";
});

// Add a click event listener to the open/close button
openCloseSideNav.addEventListener("click", () => {
  // If the navigation container is closed, open it and show the labels
  if (navMainContainer.style.width === "7rem") {
    navMainContainer.style.width = "20rem";
    sideLabels.forEach((p) => {
      p.style.display = "flex";
    });
  } else {
    // If the navigation container is open, close it and hide the labels
    navMainContainer.style.width = "7rem";
    sideLabels.forEach((p) => {
      p.style.display = "none";
    });
  }
});

// Add a mouseover event listener to the navigation container
navMainContainer.addEventListener("mouseover", () => {
  // If the navigation container is closed, open it and show the labels
  if (navMainContainer.style.width === "7rem") {
    navMainContainer.style.width = "20rem";
    sideLabels.forEach((p) => {
      p.style.display = "flex";
    });
  }
});

// Add a mouseout event listener to the navigation container
navMainContainer.addEventListener("mouseout", () => {
  // If the navigation container is open, close it and hide the labels
  if (navMainContainer.style.width === "20rem") {
    navMainContainer.style.width = "7rem";
    sideLabels.forEach((p) => {
      p.style.display = "none";
    });
  }
});

// ==================== RETRIEVE USERNAME FROM LOCALSTORAGE ====================
const username = document.querySelectorAll(".userName");
const userAccountParent = document.querySelector(".user__account__container");

// EXTRACT THE USERNAME FROM LOCALSTORAGE
const user = localStorage.getItem("username");

// SET THE USERNAME TO THE ELEMENT
username.forEach((element) => {
  element.textContent = user;
});

// CHANGE THE BORDER RADIUS TO 0.25rem
userAccountParent.style.borderRadius = "0.25rem";
userAccountParent.style.gap = "0.25rem";
userAccountParent.style.padding = "0.25rem";

// // Select all the display__three__dots__container elements
// const threeDotContainers = document.querySelectorAll('.display__three__dots__container');

// // Function to close all empty__functionality__container elements
// function closeAllFunctionalityContainers() {
//     const functionalityContainers = document.querySelectorAll('.empty__functionality__container');
//     functionalityContainers.forEach(container => {
//         container.style.display = 'none';
//     });
// }

// // Add event listener to each display__three__dots__container
// threeDotContainers.forEach(container => {
//     container.addEventListener('click', function(event) {
//         // Prevent the window click event from firing
//         event.stopPropagation();

//         // Get the empty__functionality__container corresponding to the clicked display__three__dots__container
//         const parentContainer = container.closest('.display__course__container');
//         const functionalityContainer = parentContainer.querySelector('.empty__functionality__container');

//         // If the functionalityContainer is already open, close it; otherwise, close all containers and open it
//         if (functionalityContainer.style.display === 'flex') {
//             functionalityContainer.style.display = 'none';
//         } else {
//             closeAllFunctionalityContainers();
//             functionalityContainer.style.display = 'flex';
//         }
//     });
// });

// // Add event listener to the window that closes the empty__functionality__container when clicked
// window.addEventListener('click', closeAllFunctionalityContainers);