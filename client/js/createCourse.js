// DISPLAY CREATE CLASS POPUP
const createClassButton = document.getElementById("createClassButton");
const backgroundOverlay = document.getElementById("backgroundOverlay");
const classPopupOverlay = document.getElementById("classPopupOverlay");
const cancelCreateButton = document.getElementById("cancelCreateButton");
const createCourseButton = document.getElementById("createCourseButton");

// Function to show the popup
createClassButton.addEventListener("click", (event) => {
  event.stopPropagation();
  showPopup();
});

function showPopup() {
  backgroundOverlay.style.display = "flex";
  classPopupOverlay.style.display = "block";
}

// Function to hide the popup and reset the form
function hidePopupAndResetForm() {
  backgroundOverlay.style.display = "none";
  classPopupOverlay.style.display = "none";
  createClassForm.reset();
}

// Add event listeners to the cancel button and the background overlay
cancelCreateButton.addEventListener("click", hidePopupAndResetForm);
backgroundOverlay.addEventListener("click", hidePopupAndResetForm);
document.addEventListener("click", hidePopupAndResetForm);
classPopupOverlay.addEventListener("click", (event) => {
  event.stopPropagation();
});
// ====================================================================================

// RETRIGGER CREATE JOIN POPUP
const retriggerPopupIcon = document.getElementById("retriggerPopupIcon");
const retriggerCreateJoinContainer = document.getElementById(
  "retriggerCreateJoinContainer"
);

const retriggerCreate = document.getElementById("retriggerCreate");

// Add event listeners to the create class button and the retrigger button
retriggerPopupIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  if (retriggerCreateJoinContainer.style.display === "flex") {
    hideRetriggerPopupContainer();
  } else {
    showCreateJoin();
  }
});

retriggerCreate.addEventListener("click", (event) => {
  event.stopPropagation();
  hideRetriggerPopupContainer();
  showPopup();
});

function showCreateJoin() {
  retriggerCreateJoinContainer.style.display = "flex";
}

function hideRetriggerPopupContainer() {
  retriggerCreateJoinContainer.style.display = "none";
}

document.addEventListener("click", hideRetriggerPopupContainer);

// Prevent the popup from closing when clicking on the popup itself
retriggerCreateJoinContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});
// ====================================================================================

// CHECKING WHETHER THE FORM IS FILLED OUT
const inputFields = document.querySelectorAll(".input__fields");

// Check if all input fields are filled out
function checkFields() {
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].value.trim() === "") {
      return false;
    }
  }
  return true;
}

// Update the color of the create course button
function updateButtonColor() {
  if (checkFields()) {
    createCourseButton.style.color = "black";
  } else {
    createCourseButton.style.color = "";
  }
}

// Add event listeners to the input fields
for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener("input", updateButtonColor);
}

// ==================== CREATE A NEW COURSE ====================

const createClassForm = document.getElementById("createClassForm");

const submitForm = async (event) => {
  event.preventDefault();

  // GETTING THE VALUE FROM THE FORM
  const className = document.getElementById("className").value;
  const lecturerName = document.getElementById("lecturerName").value;
  const classSubject = document.getElementById("classSubject").value;
  const classRoom = document.getElementById("classRoom").value;

  const userEmail = localStorage.getItem("userEmail");
  // MAKE A REQUEST TO THE SERVER
  const response = await fetch("http://localhost:5001/client/lms-home", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      className,
      lecturerName,
      classSubject,
      classRoom,
      userEmail,
    }),
  });

  const createCourseContainer = document.getElementById(
    "createCourseContainer"
  );

  // GETTING THE RESPONSE FROM THE SERVER IF THE REQUEST IS SUCCESSFUL
  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    alert("Class Created Successfully");
    backgroundOverlay.style.display = "none";
    classPopupOverlay.style.display = "none";
    createCourseContainer.style.display = "none";
    localStorage.setItem("createCourseContainerDisplay", "none");
    createClassForm.reset();
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Error Creating Class");
    backgroundOverlay.style.display = "none";
    classPopupOverlay.style.display = "none";
    createCourseContainer.style.display = "block";
    localStorage.setItem("createCourseContainerDisplay", "block");
    createClassForm.reset();
  }
};

const retrieveCourse = async () => {
  const userEmail = localStorage.getItem("userEmail");

  const response = await fetch(
    `http://localhost:5001/client/retrieveCourse?userEmail=${userEmail}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.courses);

    const createDisplayCourseContainer = document.getElementById(
      "createDisplayCourseContainer"
    );

    // Clear the existing course data
    createDisplayCourseContainer.innerHTML = "";

    data.courses.forEach((course) => {
      const className = course.className;
      const lecturerName = course.lecturerName;
      const classRoom = course.classRoom;

      const courseDiv = document.createElement("div");
      courseDiv.className = "display__course__container";
      courseDiv.innerHTML = `
      <div class="display__course__data__container">
      <div class="display__course__data">
        <p id="displayClassTitle">${className}</p>
        <p id="displayLecturerName">${lecturerName}</p>
      </div>
    </div>
    
    <div class="empty__main__container">
      <div class="empty__functionality__container" id="emptyFunctionalityContainer">
        <button id="editButton">Edit</button>
        <button id="deleteButton">Delete</button>
      </div>
    </div>
    
    <div
      class="display__delete__confirmation__container"
      id="displayDeleteConfirmationContainer"
    >
      <p>Delete 1?</p>
    
      <div class="paragraph__container">
        <p>
          You will no longer have access to any posts or comments that have been
          added to this class.
        </p>
    
        <p>Class files will remain in Google Drive.</p>
      </div>
      <p>You can't undo this action.</p>
    </div>
    
    <div class="class__room__main__container">
      <p id="displayClassRoom">ClassRoom - ${classRoom}</p>
      <div
        class="display__three__dots__container"
        id="displayEmptyFunctionalityContainer"
      >
        <i class="bx bx-dots-vertical-rounded three-dots"></i>
      </div>
    </div>
      `;
      createDisplayCourseContainer.appendChild(courseDiv);

      const deleteButton = courseDiv.querySelector("#deleteButton");
      const deleteConfirmatonContainer = courseDiv.querySelector(
        "#displayDeleteConfirmationContainer"
      );

      // Add event listener to the delete button of the current course
      deleteButton.addEventListener("click", () => {
        deleteConfirmatonContainer.style.display = "flex";
      });

      // Function to close all empty__functionality__container elements
      function closeAllFunctionalityContainers() {
        const functionalityContainers = document.querySelectorAll(
          ".empty__functionality__container"
        );
        functionalityContainers.forEach((container) => {
          container.style.display = "none";
        });
      }

      // Add event listener to the createDisplayCourseContainer
      courseDiv.addEventListener("click", function (event) {
        // Check if the clicked element or its parent is a .display__three__dots__container
        const threeDotContainer = event.target.closest(
          ".display__three__dots__container"
        );
        if (threeDotContainer) {
          // Prevent the window click event from firing
          event.stopPropagation();

          // Get the empty__functionality__container corresponding to the clicked display__three__dots__container
          const parentContainer = threeDotContainer.closest(
            ".display__course__container"
          );
          const functionalityContainer = parentContainer.querySelector(
            ".empty__functionality__container"
          );

          // If the functionalityContainer is already open, close it; otherwise, close all containers and open it
          if (functionalityContainer.style.display === "flex") {
            functionalityContainer.style.display = "none";
          } else {
            closeAllFunctionalityContainers();
            functionalityContainer.style.display = "flex";
          }
        }
      });

      // Add event listener to the window that closes the empty__functionality__container when clicked
      window.addEventListener("click", closeAllFunctionalityContainers);
    });
  } else {
    const error = await response.json();
    console.error(error.message);
  }
};

// ADD EVENT LISTENER TO THE CREATE COURSE BUTTON
createCourseButton.addEventListener("click", async (event) => {
  await submitForm(event);
  await retrieveCourse();
});

window.onload = async function () {
  const createCourseContainer = document.getElementById(
    "createCourseContainer"
  );
  const createDisplayCourseContainer = document.getElementById(
    "createDisplayCourseContainer"
  );

  // Retrieve courses
  await retrieveCourse();

  // Check if there are any courses
  if (createDisplayCourseContainer.children.length === 0) {
    // If there are no courses, display the createCourseContainer
    createCourseContainer.style.display = "flex";
    localStorage.setItem("createCourseContainerDisplay", "flex");
  } else {
    // If there are courses, use the display value from local storage
    const display = localStorage.getItem("createCourseContainerDisplay");
    if (display !== null) {
      createCourseContainer.style.display = display;
    }
  }
};
