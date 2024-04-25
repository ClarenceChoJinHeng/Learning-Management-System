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

// ==================== POP UP MODAL ====================
// Get the elements needed for the popup modal
const backgroundOverlay = document.getElementById("popupBackgroundOverlay");
const popupOverlay = document.getElementById("classPopupOverlay");
const createClassBtn = document.getElementById("createClassButton");
const cancelCreate = document.getElementById("cancelCreate");

// OPEN OVERLAY FOR BACKGROUND AND POPUP
// Add a click event listener to the create class button
createClassBtn.addEventListener("click", () => {
  // Show the background overlay and the popup
  backgroundOverlay.style.display = "block";
  popupOverlay.style.display = "block";
});

// Add a click event listener to the cancel button
cancelCreate.addEventListener("click", () => {
  // Hide the background overlay and the popup
  backgroundOverlay.style.display = "none";
  popupOverlay.style.display = "none";
});

// ==================== CREATE CLASS FORM VALIDATION ====================

// Get the input fields and the button
const classNameInput = document.getElementById("className");
const classSectionInput = document.getElementById("classSection");
const classSubjectInput = document.getElementById("classSubject");
const classRoomInput = document.getElementById("classRoom");
const createCourseButton = document.getElementById("createCourse");

// Disable the button initially
createCourseButton.disabled = true;

// Function to check if all fields are filled
function checkFields() {
  if (
    classNameInput.value.trim() !== "" &&
    classSectionInput.value.trim() !== "" &&
    classSubjectInput.value.trim() !== "" &&
    classRoomInput.value.trim() !== ""
  ) {
    createCourseButton.disabled = false;
  } else {
    createCourseButton.disabled = true;
  }
}

// Add event listeners to the input fields
classNameInput.addEventListener("input", checkFields);
classSectionInput.addEventListener("input", checkFields);
classSubjectInput.addEventListener("input", checkFields);
classRoomInput.addEventListener("input", checkFields);

// ==================== CREATE CLASS FORM ====================
// Get the elements needed for the create class form

const pageRedirectClass = document.getElementById("pageRedirectClass");
const createCourse = document.getElementById("createCourse");

// CREATE CLASS FORM SUBMISSION
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
    // window.location.href = "course-display.html";
    createCourse.addEventListener("click", () => {
      const pageRedirectClass = document.getElementById("pageRedirectClass");
      pageRedirectClass.src = "https://course-display.html";
    });
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Fail to Create Class");
  }
};

// ADD EVENT LISTENER TO THE BUTTON
createCourse.addEventListener("click", (event) => {
  submitForm(event);
});

//  ==================== PAGE REDIRECT ====================

// Get the container that you want to replace
const container = document.getElementById("pageRedirectClass");

// Fetch the new HTML page
fetch("course-display.html")
  .then((response) => response.text())
  .then((html) => {
    // Replace the container's content with the new HTML
    container.innerHTML = html;
  })
  .catch((error) => {
    console.warn(error);
  });
