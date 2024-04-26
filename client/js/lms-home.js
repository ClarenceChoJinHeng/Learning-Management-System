// SIDE BAR NAVIGATION
// Get the elements needed for the side navigation
const openCloseSideNav = document.getElementById("openSideNav");
const navMainContainer = document.getElementById("navMainContainer");
const sideLabels = navMainContainer.querySelectorAll("label");

// SET INITIAL WIDTH OF NAVIGATION CONTAINER
// Set the initial width of the navigation container and hide the labels
navMainContainer.style.width = "13vh";
sideLabels.forEach((label) => {
  label.style.display = "none";
});

// Add a click event listener to the open/close button
openCloseSideNav.addEventListener("click", () => {
  // If the navigation container is closed, open it and show the labels
  if (navMainContainer.style.width === "13vh") {
    navMainContainer.style.width = "50vh";
    sideLabels.forEach((label) => {
      label.style.display = "flex";
    });
  } else {
    // If the navigation container is open, close it and hide the labels
    navMainContainer.style.width = "13vh";
    sideLabels.forEach((label) => {
      label.style.display = "none";
    });
  }
});

// Add a mouseover event listener to the navigation container
navMainContainer.addEventListener("mouseover", () => {
  // If the navigation container is closed, open it and show the labels
  if (navMainContainer.style.width === "13vh") {
    navMainContainer.style.width = "50vh";
    sideLabels.forEach((label) => {
      label.style.display = "flex";
    });
  }
});

// Add a mouseout event listener to the navigation container
navMainContainer.addEventListener("mouseout", () => {
  // If the navigation container is open, close it and hide the labels
  if (navMainContainer.style.width === "50vh") {
    navMainContainer.style.width = "13vh";
    sideLabels.forEach((label) => {
      label.style.display = "none";
    });
  }
});

// ==================== CREATE CLASS FORM ====================
// Get the elements needed for the create class form

const pageRedirectClass = document.getElementById("pageRedirectClass");
const createCourse = document.getElementById("createCourse");

/// Initialize a counter variable
let classCreatedCount = 0;

// Modify the submitForm function
const submitForm = async (event) => {
  event.preventDefault();

  // GETTING THE VALUES FROM THE FORM
  const className = document.getElementById("className").value;
  const classSection = document.getElementById("classSection").value;
  const classSubject = document.getElementById("classSubject").value;
  const classRoom = document.getElementById("classRoom").value;

  // MAKE A REQUEST TO THE SERVER
  const response = await fetch("http://localhost:5001/client/lms-home", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ className, classSection, classSubject, classRoom }),
  });

  // GETTING THE RESPONSE FROM THE SERVER IF THE REQUEST IS SUCCESSFUL
  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    alert("Class created succesfully");

    popupOverlay.style.display = "none";
    backgroundOverlay.style.display = "none";
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Fail to Create Class");
  }
  createClassForm.reset();
};

// ADD EVENT LISTENER TO THE BUTTON
createCourse.addEventListener("click", (event) => {
  submitForm(event);
});

// ==================== REQUEST FORM INPUT DATA FROM DATABASE ====================
