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

// ==================== CREATE CLASS FORM SUBMISSION ====================

// Get the input fields and the button
const inputs = document.querySelectorAll("input");
const createClassButton = document.querySelector(".create__class__button");

// Function to check if all fields are filled
function checkFields() {
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() === "") {
      return false;
    }
  }
  return true;
}

// Function to update the button color
function updateButtonColor() {
  if (checkFields()) {
    createClassButton.style.color = "black";
  } else {
    createClassButton.style.color = "grey";
  }
}

// Add event listeners to the input fields
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("input", updateButtonColor);
}
