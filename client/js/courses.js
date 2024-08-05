let currentCourseId = "";
let clickedNoteId = "";
let clickedNoteIdArray = [];

// DISPLAY CREATE CLASS POPUP
const createClassButton = document.getElementById("createClassButton");
const backgroundOverlay = document.getElementById("backgroundOverlay");
const classPopupOverlay = document.getElementById("classPopupOverlay");
const cancelCreateButton = document.getElementById("cancelCreateButton");
const createCourseButton = document.getElementById("createCourseButton");
const folderNameInput = document.getElementById("folderNameInput");
const folderErrorResponse = document.getElementById("folderErrorResponse");
const fileErrorResponse = document.getElementById("fileErrorResponse");
const selectedNotes = document.getElementById("selectedNotes");
const addFolder = document.getElementById("addFolder");
const cancelFolder = document.getElementById("cancelFolder");
const openFolderContainer = document.getElementById("openFolderContainer");
const folderMainContainer = document.getElementById("folderMainContainer");
const filesInputCheckBox = document.getElementById("filesInputCheckBox");

// FUNCTION TO SHOW THE POPUP
createClassButton.addEventListener("click", (event) => {
  event.stopPropagation();
  showPopup();
});

function showPopup() {
  backgroundOverlay.style.display = "flex";
  classPopupOverlay.style.display = "block";
}

//  ================= FUNCTION TO HIDE THE POPUP AND RESET THE FORM =================
function hidePopupAndResetForm() {
  backgroundOverlay.style.display = "none";
  classPopupOverlay.style.display = "none";
  createClassForm.reset();
}

// ================= ADD EVENT LISTENERS TO THE CANCEL BUTTON AND THE BACKGROUND OVERLAY =================
cancelCreateButton.addEventListener("click", hidePopupAndResetForm);
backgroundOverlay.addEventListener("click", hidePopupAndResetForm);
document.addEventListener("click", hidePopupAndResetForm);

// ================= PREVENT THE POPUP FROM CLOSING WHEN CLICKING ON THE POPUP ITSELF =================
classPopupOverlay.addEventListener("click", (event) => {
  event.stopPropagation();
});

// ================= RETRIGGER CREATE JOIN POPUP =================
const retriggerPopupIcon = document.getElementById("retriggerPopupIcon");
const retriggerCreateJoinContainer = document.getElementById(
  "retriggerCreateJoinContainer"
);

const retriggerCreate = document.getElementById("retriggerCreate");

// ================= ADD EVENT LISTENERS TO THE CREATE CLASS BUTTON AND THE RETRIGGER BUTTON =================
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

// ================= PREVENT THE POPUP FROM CLOSING WHEN CLICKNG ON THE POPUP ITSELF =================
retriggerCreateJoinContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

const inputFields = document.querySelectorAll(".input__fields");

// ================= CHECK IF ALL INPUT FIELDS ARE FILLED OUT =================
function checkFields() {
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].value.trim() === "") {
      return false;
    }
  }
  return true;
}

// ================= UPDATE THE COLOR AND DISABLED STATE OF THE CREATE COURSE BUTTON =================
function updateButtonColor() {
  if (checkFields()) {
    createCourseButton.style.color = "black";
    createCourseButton.disabled = false;
  } else {
    createCourseButton.style.color = "";
    createCourseButton.disabled = true;
  }
}

createCourseButton.disabled = true;

for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener("input", updateButtonColor);
}

// ================== TOASTIFY ==================
const toastifyMainContainer = document.getElementById("toastifyMainContainer");
const courseNotification = document.getElementById("courseNotification");

const toastiyfySuccess = () => {
  courseNotification.textContent = "Class Created Successfully";
  toastifyMainContainer.style.display = "flex";
  toastifyMainContainer.classList.add("active");
  setTimeout(() => {
    toastifyMainContainer.classList.remove("active");
    toastifyMainContainer.style.display = "none";
  }, 2000);
};

const toastiyfyDeletion = () => {
  toastifyMainContainer.style.display = "flex";
  courseNotification.textContent = "Class Deleted Successfully";
  toastifyMainContainer.classList.add("active");
  setTimeout(() => {
    toastifyMainContainer.classList.remove("active");
    toastifyMainContainer.style.display = "none";
  }, 2000);
};

// // =============== FOLDER FUNCTIONALITY ===============
// openFolderContainer.addEventListener("click", (event) => {
//   event.preventDefault();
//   event.stopPropagation();
//   if (folderMainContainer.style.display == "none") {
//     folderMainContainer.style.display = "flex";
//   } else if (folderMainContainer.style.display == "flex") {
//     folderMainContainer.style.display = "none";
//   }
// });

cancelFolder.addEventListener("click", (event) => {
  folderMainContainer.style.display = "none";
});

document.addEventListener("click", (event) => {
  if (!folderMainContainer.contains(event.target)) {
    event.stopPropagation();
    folderNameInput.value = "";
    folderMainContainer.style.display = "none";
  }
});

// ==================== CREATE A NEW COURSE ====================

const createClassForm = document.getElementById("createClassForm");
const sortCoursesContainer = document.getElementById("sortCoursesContainer");

const createCourse = async (event) => {
  event.preventDefault();

  const userEmail = localStorage.getItem("userEmail");
  const className = document.getElementById("className").value;
  const lecturerName = document.getElementById("lecturerName").value;
  const classSubject = document.getElementById("classSubject").value;
  const classRoom = document.getElementById("classRoom").value;
  const courseNotes = [];
  const students = [];

  // ================= MAKE A REQUEST TO THE SERVER =================
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
      students,
      courseNotes,
    }),
  });

  const createCourseContainer = document.getElementById(
    "createCourseContainer"
  );

  // ================= GETTING THE RESPONSE FROM THE SERVER IF THE REQUEST IS SUCCESSFUL =================
  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    // alert("Class Created Successfully");
    updateDisplayProperties();

    backgroundOverlay.style.display = "none";
    classPopupOverlay.style.display = "none";
    createCourseContainer.style.display = "none";
    sortCoursesContainer.style.display = "flex";
    toastiyfySuccess();
    localStorage.setItem("createCourseContainerDisplay", "none");
    createClassForm.reset();
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Error Creating Class");
    updateDisplayProperties();

    backgroundOverlay.style.display = "none";
    classPopupOverlay.style.display = "none";
    sortCoursesContainer.style.display = "none";
    createCourseContainer.style.display = "none";
    localStorage.setItem("createCourseContainerDisplay", "none");
    createClassForm.reset();
  }
};

// ==================== RETRIEVE COURSES ====================

const retrieveCourse = async () => {
  const userEmail = localStorage.getItem("userEmail");

  const response = await fetch(
    `http://localhost:5001/client/lms-home?userEmail=${userEmail}`,
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

    // CLEAN THE EXISTING CODE
    createDisplayCourseContainer.innerHTML = "";

    // CREATE AN ARRAY TO STORE THE COURSE IDS
    const courseIDs = [];

    data.courses.forEach((course) => {
      const className = course.className;
      const lecturerName = course.lecturerName;
      const classRoom = course.classRoom;
      const courseID = course._id;
      // console.log(currentCourseId);

      courseIDs.push(courseID);

      const courseDiv = document.createElement("div");
      courseDiv.className = "display__course__container";
      courseDiv.dataset.courseId = course._id;
      courseDiv.id = "displayCourseContainer";
      courseDiv.innerHTML = `
      <div class="delete__background__overlay" id="backgroundOverlay"></div>

      <div class="display__course__data__container">
          <div class="display__course__data">
              <p id="displayClassTitle">${className}</p>
              <p id="displayLecturerName">${lecturerName}</p>
          </div>
      </div>
      
      <div class="empty__main__container">
          <div class="empty__functionality__container" id="emptyFunctionalityContainer">
              <input type="submit" name="Edit" value="Edit" id="editButton" class="edit__course__button"/>
              <input type="submit" name="Delete" value="Delete" data-course-id="${courseID}" id="deleteButton" class="delete__course__button"/>
          </div>
      </div>
      
      <div class="display__delete__confirmation__container" id="displayDeleteConfirmationContainer">
          <p class="delete__title">Delete ${className} ?</p>
          <div class="paragraph__container">
              <p>You will no longer have access to any posts or comments that have been added to this class.</p>
              <p class="paragraph__bottom">You can't undo this action after delete.</p>
          </div>

          <div class="cancel__delete__container">
              <button class="cancel__button" id="cancelButton">Cancel</button>
              <input type="submit" name="Delete" value="Delete" class="delete__button" data-course-id="${courseID}" id="deleteCourseButton"/>
          </div>
      </div>
      
      <div class="class__room__main__container">
          <p id="displayClassRoom">ClassRoom - ${classRoom}</p>
          <div class="display__three__dots__container" id="displayEmptyFunctionalityContainer">
              <i class="bx bx-dots-vertical-rounded three-dots"></i>
          </div>
      </div>
        `;

      createDisplayCourseContainer.appendChild(courseDiv);

      // ============== DISPLAYING COURSES DURING CLICK ON COURSES ==============
      const deleteButton = courseDiv.querySelector("#deleteButton");
      const deleteConfirmatonContainer = courseDiv.querySelector(
        "#displayDeleteConfirmationContainer"
      );
      const backgroundOverlay = courseDiv.querySelector(
        ".delete__background__overlay"
      );
      const cancelButton = courseDiv.querySelector("#cancelButton");
      const deleteCourseButton = courseDiv.querySelector("#deleteCourseButton");

      // =================== ADD EVENT LISTENER TO THE DELETE BUTTON OF THE CURRENT COURSE ===================
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const emptyFunctionalityContainer = courseDiv.querySelector(
          ".empty__functionality__container"
        );

        emptyFunctionalityContainer.style.display = "none";
        deleteConfirmatonContainer.style.display = "flex";
        backgroundOverlay.style.display = "flex";
      });

      // =================== ADD EVENT LISTENER TO THE CANCEL BUTTON OF THE CURRENT COURSE ===================
      cancelButton.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteConfirmatonContainer.style.display = "none";
        backgroundOverlay.style.display = "none";
      });

      deleteCourseButton.addEventListener("click", (event) => {
        deleteCourseButton.value = "Deleting...";
        event.stopPropagation();
        deleteCourseButton.style.background = "none";
        deleteCourseButton.style.color = "grey";
        cancelButton.disabled = true;
        deleteCourseButton.style.boxShadow = "none";

        setTimeout(() => {
          event.preventDefault();
          console.log("Delete button clicked");
          const courseId = event.target.dataset.courseId;
          deleteCourse(courseId); // data is send here for deletion
          deleteConfirmatonContainer.style.display = "none";
          backgroundOverlay.style.display = "none";
          deleteCourseButton.style.background = "red";
          deleteCourseButton.style.color = "white";
        }, 1000);
      });

      // =============== ADD EVENT LISTENER TO THE WINDOW OUTSIDE OF THE LOOP ===============

      deleteConfirmatonContainer.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      window.addEventListener("click", (event) => {
        const deleteConfirmationContainers = document.querySelectorAll(
          ".display__delete__confirmation__container"
        );

        deleteConfirmationContainers.forEach((deleteConfirmationContainer) => {
          if (!deleteConfirmationContainer.contains(event.target)) {
            deleteConfirmationContainer.style.display = "none";
          }
        });

        const backgroundOverlays = document.querySelectorAll(
          ".delete__background__overlay"
        );

        backgroundOverlays.forEach((overlay) => {
          overlay.style.display = "none";
        });
      });

      function closeAllFunctionalityContainers() {
        const functionalityContainers = document.querySelectorAll(
          ".empty__functionality__container"
        );
        functionalityContainers.forEach((container) => {
          container.style.display = "none";
        });
      }

      // ADD EVENT LISTENER TO THE CREATEDISPLAYCOURSECONTAINER
      courseDiv.addEventListener("click", function (event) {
        // CHECK IF THE CLICKED ELEMENT OR ITS PARENT IS A .DISPLAY__THREE__DOTS__CONTAINER
        currentCourseId = courseID;
        console.log(currentCourseId);

        const threeDotContainer = event.target.closest(
          ".display__three__dots__container"
        );
        if (threeDotContainer) {
          // PREVENT THE WINDOW CLICK EVENT FROM FIRING

          event.preventDefault();
          event.stopPropagation();

          // GET THE EMPTY__FUNCTIONALITY__CONTAINER CORRESPONDING TO THE CLICKED DISPLAY__THREE__DOTS__CONTAINER
          const parentContainer = threeDotContainer.closest(
            ".display__course__container"
          );
          const functionalityContainer = parentContainer.querySelector(
            ".empty__functionality__container"
          );

          // IF THE FUNCTIONALITYCONTAINER IS ALREADY OPEN, CLOSE IT; OTHERWISE, CLOSE ALL CONTAINERS AND OPEN IT
          if (functionalityContainer.style.display === "flex") {
            functionalityContainer.style.display = "none";
          } else {
            closeAllFunctionalityContainers();
            functionalityContainer.style.display = "flex";
          }
        }
      });

      // ADD EVENT LISTENER TO THE WINDOW THAT CLOSES THE EMPTY__FUNCTIONALITY__CONTAINER WHEN CLICKED
      window.addEventListener("click", closeAllFunctionalityContainers);

      const displayTeachingNavigationMainContainer = document.getElementById(
        "displayTeachingNavigationMainContainer"
      );
      const displayTeachingDetailsMainContainer = document.getElementById(
        "displayTeachingDetailsMainContainer"
      );

      courseDiv.addEventListener("click", async (event) => {
        if (
          Array.from(document.querySelectorAll(".three-dots")).some(
            (dot) => dot.outerHTML === event.target.outerHTML
          ) ||
          Array.from(
            document.querySelectorAll(".delete__background__overlay")
          ).some((dot) => dot.outerHTML === event.target.outerHTML) ||
          Array.from(document.querySelectorAll(".edit__course__button")).some(
            (dot) => dot.outerHTML === event.target.outerHTML
          )
        ) {
          return;
        }

        const classNameId = document.getElementById("classNameId");
        const classRoomId = document.getElementById("classRoomId");
        const classCodeId = document.getElementById("classCodeId");
        createDisplayCourseContainer.style.display = "none";
        displayTeachingDetailsMainContainer.style.display = "flex";
        displayTeachingNavigationMainContainer.style.display = "flex";
        sortCoursesContainer.style.display = "none";

        classNameId.textContent = className;
        classRoomId.textContent = classRoom;
        classCodeId.textContent = courseID;
      });

      // =========== TEACHING STREAM NAV ============

      const teachingStreamNavId = document.getElementById("teachingStreamNav");

      teachingStreamNavId.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        displayClassworkDetailsMainContainer.style.display = "none";
        displayPeopleDetailsMainContainer.style.display = "none";
        displayGradesDetailsMainContainer.style.display = "none";
        displayNotesDetailsMainContainer.style.display = "none";
        displayTeachingDetailsMainContainer.style.display = "flex";
      });

      // =========== TEACHING CLASSWORK NAV ============

      const teachingClassWorkNav = document.getElementById(
        "teachingClassWorkNav"
      );

      const displayClassworkDetailsMainContainer = document.getElementById(
        "displayClassworkDetailsMainContainer"
      );

      teachingClassWorkNav.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        displayGradesDetailsMainContainer.style.display = "none";
        displayTeachingDetailsMainContainer.style.display = "none";
        displayPeopleDetailsMainContainer.style.display = "none";
        displayNotesDetailsMainContainer.style.display = "none";
        displayClassworkDetailsMainContainer.style.display = "flex";
      });

      arrowBack.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = "lms-home.html";
      });

      // ============== PEOPLE STREAM NAV ===============

      const teachingPeopleNav = document.getElementById("teachingPeopleNav");
      const displayPeopleDetailsMainContainer = document.getElementById(
        "displayPeopleDetailsMainContainer"
      );

      teachingPeopleNav.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        displayTeachingDetailsMainContainer.style.display = "none";
        displayGradesDetailsMainContainer.style.display = "none";
        displayNotesDetailsMainContainer.style.display = "none";
        displayClassworkDetailsMainContainer.style.display = "none";
        displayPeopleDetailsMainContainer.style.display = "flex";
      });

      // ========== TEACHING GRADES NAV ============

      const teachingGradesNav = document.getElementById("teachingGradesNav");
      const displayGradesDetailsMainContainer = document.getElementById(
        "displayGradesDetailsMainContainer"
      );
      teachingGradesNav.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        displayTeachingDetailsMainContainer.style.display = "none";
        displayClassworkDetailsMainContainer.style.display = "none";
        displayNotesDetailsMainContainer.style.display = "none";
        displayPeopleDetailsMainContainer.style.display = "none";
        displayGradesDetailsMainContainer.style.display = "flex";
      });

      // ============== TEACHING NOTES NAV ===============
      const teachingNoteNav = document.getElementById("teachingNoteNav");
      const displayNotesDetailsMainContainer = document.getElementById(
        "displayNotesDetailsMainContainer"
      );
      teachingNoteNav.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        displayTeachingDetailsMainContainer.style.display = "none";
        displayClassworkDetailsMainContainer.style.display = "none";
        displayPeopleDetailsMainContainer.style.display = "none";
        displayGradesDetailsMainContainer.style.display = "none";
        displayNotesDetailsMainContainer.style.display = "flex";
        // await retrieveNotesFolder(currentCourseId);
      });

      // =================== TEACHING STREAM UNDERLINE ===================
      const teachingStream = document.querySelectorAll(".teaching__nav");
      const teachingStreamNav = document.querySelectorAll(".teaching__nav");
      if (teachingStreamNav[0]) {
        teachingStreamNav[0].style.borderBottom = "3px solid red";
      }
      // ================ ADD EVENT LISTENER TO THE TEACHING STREAM NAV ================
      teachingStream.forEach((navItem) => {
        navItem.addEventListener("click", (event) => {
          teachingStream.forEach((item) => {
            item.style.borderBottom = "";
          });

          if (event.target.tagName === "P") {
            event.target.parentNode.style.borderBottom = "3px solid red";
          } else {
            event.target.style.borderBottom = "3px solid red";
          }
        });
      });
    });
  } else {
    const error = await response.json();
    console.error(error.message);
  }
};

// ADD EVENT LISTENER TO THE CREATE COURSE BUTTON
createCourseButton.addEventListener("click", async (event) => {
  await createCourse(event);
  await retrieveCourse();
});

const teachingCourseButton = document.getElementById("teachingCourseButton");

teachingCourseButton.addEventListener("click", async (event) => {
  await retrieveCourse();
});

//  ================= ENSURE THAT THE CREATE COURSE CONTAINER ONLY APPEAR AFTER THERE IS NO MORE COURSES ==================

// Function to update the display properties
function updateDisplayProperties() {
  const createDisplayCourseContainer = document.getElementById(
    "createDisplayCourseContainer"
  );
  const createCourseContainer = document.getElementById(
    "createCourseContainer"
  );
  const sortCoursesContainer = document.getElementById("sortCoursesContainer");

  if (createDisplayCourseContainer.children.length === 0) {
    // IF THERE ARE NO COURSES, DISPLAY THE CREATECOURSECONTAINER
    createCourseContainer.style.display = "flex";
    sortCoursesContainer.style.display = "none";
  } else {
    // IF THERE ARE COURSES, HIDE THE CREATECOURSECONTAINER
    createCourseContainer.style.display = "none";
    sortCoursesContainer.style.display = "flex";
  }
}

window.onload = async function () {
  await retrieveCourse();
  updateDisplayProperties();
};

// ================================= DELETE =====================================

const deleteCourse = async (courseId) => {
  const response = await fetch(`http://localhost:5001/client/lms/${courseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    toastiyfyDeletion();

    console.log(data.message);
    // AFTER SUCCESSFUL DELETION, REMOVE THE COURSE FROM THE DOM
    const courseDiv = document.querySelector(
      `div[data-course-id="${courseId}"]`
    );
    courseDiv.remove();

    // CHECK IF THERE ARE ANY COURSES LEFT
    const createDisplayCourseContainer = document.getElementById(
      "createDisplayCourseContainer"
    );
    if (createDisplayCourseContainer.children.length === 0) {
      // IF THERE ARE NO COURSES LEFT, DISPLAY THE CREATECOURSECONTAINER
      const createCourseContainer = document.getElementById(
        "createCourseContainer"
      );
      createCourseContainer.style.display = "flex";
      localStorage.setItem("createCourseContainerDisplay", "flex");
    }
    await retrieveCourse();

    updateDisplayProperties();
  } else {
    const error = await response.json();
    console.error(error.message);
  }
};

// =============== CREATING NOTES FOR COURSES ================
const createCoursesNotes = async (currentCourseId) => {
  const courseNotes = {
    noteTitle: "",
    notePageTitle: "",
    noteContent: "",
  };

  const response = await fetch("http://localhost:5001/client/lms-notes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentCourseId,
      courseNotes,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
  } else {
    const error = await response.json();
    console.error(error.message);
  }
};

const addFile = document.getElementById("addFile");

const displayNotesFilesContainer = document.getElementById(
  "displayNotesFilesContainer"
);

// ============== RETRIEVE COURSE NOTES FOR DISPLAY ===============

const retrieveCreateCourseNotes = async (currentCourseId) => {
  const response = await fetch(
    `http://localhost:5001/client/lms-retrieve-notes?currentCourseId=${currentCourseId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.courseNotes); // Changed from data.notes to data.courseNotes
    // console.log(data.courseFolder);
    displayNotesFilesContainer.innerHTML = "";

    data.courseNotes.forEach((note) => {
      const noteTitle = note.noteTitle;
      const id = note._id;
      const noteContainerDiv = document.createElement("div");
      noteContainerDiv.className = "notes__files__container";
      noteContainerDiv.id = "notesFiles";
      noteContainerDiv.dataset.noteId = id;
      noteContainerDiv.draggable = true;
      noteContainerDiv.innerHTML = `
      <input type='text' id='noteTitleName' class='notes__files__title' placeholder='Untitled' value=${noteTitle}  >

      <div class="notes__files__functionality__container" id="notesFilesFunctionalityContainer">
       
          <input type="submit" name="Delete" value="Delete" id="deleteNoteButton" class="delete__note__button"/>
      </div>

      `;

      noteContainerDiv.addEventListener("contextmenu", function (event) {
        event.preventDefault();
      });

      noteContainerDiv.addEventListener("click", async (event) => {
        clickedNoteId = event.currentTarget.dataset.noteId;
        console.log(clickedNoteId, "1");
        retrieveCourseNotes(clickedNoteId);
      });

      // RIGHT CLICK FUNCTIONALITY

      noteContainerDiv.addEventListener("mousedown", function (event) {
        if (event.button === 2) {
          event.preventDefault();
          notesFilesFunctionalityContainer.style.display = "flex";
        }
      });

      window.onclick = function (event) {
        notesFilesFunctionalityContainer.style.display = "none";
      };

      // DELETE NOTE FUNCTIONALITY
      displayNotesFilesContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete__note__button")) {
          event.stopPropagation();
          const noteId = event.target.closest(".notes__files__container")
            .dataset.noteId;
          const response = await fetch(
            `http://localhost:5001/client/lms-delete-note?noteId=${noteId}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            event.target.closest(".notes__files__container").remove();
          } else {
            try {
              const error = await response.json();
              console.error("Failed to delete note:", error.message);
            } catch (jsonError) {
              console.error(
                "Failed to delete note, and also failed to parse the error message"
              );
            }
          }
        }
      });

      displayNotesFilesContainer.appendChild(noteContainerDiv);
    });
  } else {
    const error = await response.json();
    console.error(error.message);
  }
};

retrieveCreateCourseNotes(currentCourseId);

addFile.addEventListener("click", async (event) => {
  event.preventDefault();
  await createCoursesNotes(currentCourseId);
  await retrieveCreateCourseNotes(currentCourseId);
});

teachingNoteNav.addEventListener("click", async (event) => {
  await retrieveCreateCourseNotes(currentCourseId);
  // await retrieveFolderNotes(currentCourseId);
  console.log(currentCourseId, "log");
});
// =============== RETRIEVE NOTES FOR DISPLAY ===============

const retrieveCourseNotes = async (clickedNoteId) => {
  const response = await fetch(
    `http://localhost:5001/client/lms-specific-retrieve-notes?clickedNoteId=${clickedNoteId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    const note = data.courseNotes.find((note) => note._id === clickedNoteId);

    const id = note._id;

    const selectedWritingNotesSpaceContainer = document.getElementById(
      "selectedWritingNotesSpaceContainer"
    );

    selectedWritingNotesSpaceContainer.style.display = "flex";
    notesFilesContainer.style.display = "flex";
    const noteTitleNameSecond = document.getElementById("noteTitleNameSecond");

    const selectedWritingNotesSpace = document.getElementById(
      "selectedWritingNotesSpace"
    );

    const notePageTitle = document.getElementById("notePageTitle");
    // noteTitleNameSecond.innerHTML = note.noteTitle;
    selectedWritingNotesSpace.value = note.noteContent;
    notePageTitle.value = note.notePageTitle;
    noteTitleNameSecond.value = note.noteTitle;

    if (note) {
      console.log(note);
    } else {
      console.error("Note not found.");
    }
  } else {
    const error = await response.json();
    console.error(error.message);
  }
};

// =================== RETRIEVE FILES FOR FOLDER ====================

// const retrieveCreatedFile = async (currentCourseId) => {
//   const response = await fetch(
//     `http://localhost:5001/client/lms-retrieve-notes?currentCourseId=${currentCourseId}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (response.ok) {
//     const data = await response.json();
//     console.log(data.courseNotes); // Changed from data.notes to data.courseNotes
//     filesInputCheckBox.innerHTML = "";

//     data.courseNotes.forEach((note) => {
//       const noteTitle = note.noteTitle;
//       const noteId = note._id;
//       const filesContainer = document.createElement("div");
//       filesContainer.className = "files__container";
//       filesContainer.id = "filesContainer";
//       filesContainer.innerHTML = `
//         <input type='text' id='' class='notes__files__insert' placeholder='Untitled' value='${noteTitle}' data-id='${noteId}' >
//           <input
//               type="checkbox"
//               class="folder__checkbox"
//               id="${noteId}"
//               placeholder="testing"
//               value="${noteTitle}"
//           />
//     `;
//       filesInputCheckBox.appendChild(filesContainer);

//       const folderCheckbox = filesContainer.querySelector(
//         "input[type='checkbox']"
//       );

//       folderCheckbox.addEventListener("click", async (event) => {
//         if (event.target.checked) {
//           clickedNoteIdArray.push(event.target.id);
//         } else {
//           clickedNoteIdArray = clickedNoteIdArray.filter(
//             (id) => id !== event.target.id
//           );
//         }
//         console.log(clickedNoteIdArray);
//       });
//     });
//   } else {
//     const error = await response.json();
//     console.error(error.message);
//   }
// };

// retrieveCreatedFile(currentCourseId);

// openFolderContainer.addEventListener("click", async (event) => {
//   event.preventDefault();
//   event.stopPropagation();
//   await retrieveCreatedFile(currentCourseId);
// });

// =================== CREATE FOLDER ===================
const createFolder = async () => {
  const folderName = folderNameInput.value;

  if (folderNameInput.value === "" || clickedNoteIdArray.length === 0) {
    folderErrorResponse.style.display = "flex";
    fileErrorResponse.style.display = "flex";
    return;
  }

  // Retrieve the notes
  const responseNotes = await fetch(
    `http://localhost:5001/client/lms-retrieve-notes?currentCourseId=${currentCourseId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!responseNotes.ok) {
    const error = await responseNotes.json();
    console.error(error.message);
    alert("Error Retrieving Notes");
    return;
  }

  const dataNotes = await responseNotes.json();

  // Create an array of note objects
  const folderNotes = clickedNoteIdArray.map((id) => {
    const note = dataNotes.courseNotes.find((note) => note._id === id);
    return note
      ? {
          _id: note._id,
          noteContent: note.noteContent,
          notePageTitle: note.notePageTitle,
          noteTitle: note.noteTitle,
        }
      : null;
  });

  const response = await fetch("http://localhost:5001/client/lms-folder", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentCourseId,
      folderName,
      folderNotes,
      type: "folder",
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    alert("Folder Created Successfully");
    folderErrorResponse.style.display = "none";
    fileErrorResponse.style.display = "none";
    folderMainContainer.style.display = "none";
    folderNameInput.value = "";
    clickedNoteIdArray = [];
    await retrieveCreatedFile(currentCourseId);
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Error Creating Folder");
  }
};

addFolder.addEventListener("click", async (event) => {
  event.preventDefault();
  await createFolder();
  await deleteFolder(currentCourseId);
  await retrieveCreateCourseNotes(currentCourseId);
  // await retrieveFolderNotes(currentCourseId);
});

const nav__function__container = document.querySelectorAll(
  "nav__function__container"
);

// ============= FOLDER FUNCTIONALITY =============
// const retrieveFolderNotes = async (currentCourseId) => {
//   console.log("test");
//   const response = await fetch(
//     `http://localhost:5001/client/lms-retrieve-notes?currentCourseId=${currentCourseId}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const displayFolderFilesContainer = document.getElementById(
//     "displayFolderFilesContainer"
//   );

//   displayFolderFilesContainer.innerHTML = "";

//   if (response.ok) {
//     const data = await response.json();
//     console.log(data.courseFolder);

//     data.courseFolder.forEach((folder) => {
//       const folderContainerDiv = document.createElement("div");
//       const folderName = folder.folderName;
//       const id = folder._id;
//       folderContainerDiv.className = "folder__files__container";
//       folderContainerDiv.id = "folderFilesContainer";
//       folderContainerDiv.dataset.noteId = id;
//       folderContainerDiv.draggable = true;
//       folderContainerDiv.innerHTML = `

//         <div class="folder__files__title__container" id="folderFilesTitleContainer">
//           <i class='bx bx-chevron-right arrow-right'></i>
//           <input type='text' id='folderTitleName' class='folder__files__title' placeholder='${folderName}' value="${folderName}"  data-id='${id}' >
//         </div>
//         `;

//       folder.folderNotes.forEach((notes) => {
//         console.log(notes.noteTitle);
//         const noteContainerDiv = document.createElement("div");
//         // FILE CONTENT
//         const noteFileId = notes._id;
//         const noteTitle = notes.noteTitle;
//         console.log(noteTitle, "112");
//         // FOLDER CONTENT
//         noteContainerDiv.className = "notes__files__container";
//         noteContainerDiv.id = "notesFiles";
//         noteContainerDiv.dataset.noteId = noteFileId;
//         noteContainerDiv.innerHTML = `
//         <div class="folder__files__functionality__container" id="folderFilesFunctionalityContainer">
//           <div class="notes__files__container" id="notesFiles" data-id="${noteFileId}">
//             <input type='text' id='noteTitleName' class='notes__files__title' placeholder='Untitled' value="${noteTitle}"  >
//               <div class="notes__files__functionality__container" id="notesFilesFunctionalityContainer">
//                 <input type="submit" name="Delete" value="Delete" id="deleteNoteButton" class="delete__note__button"/>
//               </div>
//           </div>
//         </div>

//   `;

//         displayFolderFilesContainer.appendChild(folderContainerDiv);

//         // ============= FOLDER FILES CONTAINER ACTIVE ===============
//         const folderFilesTitleContainer = folderContainerDiv.querySelector(
//           ".folder__files__title__container"
//         );

//         const folderFilesFunctionalityContainer =
//           folderContainerDiv.querySelector(
//             ".folder__files__functionality__container"
//           );

//         const arrowRight = folderContainerDiv.querySelector(".arrow-right");

//         if (folderFilesTitleContainer) {
//           folderFilesTitleContainer.addEventListener("click", async (event) => {
//             if (folderFilesFunctionalityContainer.style.display === "none") {
//               event.preventDefault();
//               folderFilesFunctionalityContainer.style.display = "flex";
//               arrowRight.style.transform = "rotate(90deg)";
//             } else {
//               event.preventDefault();
//               folderFilesFunctionalityContainer.style.display = "none";
//               arrowRight.style.transform = "rotate(0deg)";
//             }
//           });
//         }

//         const notesFilesFunctionalityContainer = document.querySelectorAll(
//           "notes__files__functionality__container"
//         );

//         const noteContainer = document.querySelectorAll(
//           "notes__files__container"
//         );

//         noteContainer.forEach((noteContainerDiv) => {
//           noteContainerDiv.addEventListener("contextmenu", function (event) {
//             event.preventDefault();
//           });

//           noteContainerDiv.addEventListener("click", async (event) => {
//             clickedNoteId = event.currentTarget.dataset.noteId;
//             console.log(clickedNoteId, "1");
//             retrieveCourseNotes(clickedNoteId);
//           });

//           // RIGHT CLICK FUNCTIONALITY

//           noteContainerDiv.addEventListener("mousedown", function (event) {
//             if (event.button === 2) {
//               event.preventDefault();
//               notesFilesFunctionalityContainer.style.display = "flex";
//             }
//           });

//           window.onclick = function (event) {
//             notesFilesFunctionalityContainer.style.display = "none";
//           };
//           folderContainerDiv.appendChild(noteContainerDiv);
//         });
//       });
//     });
//   } else {
//     const error = await response.json();
//     console.log(error.message);
//   }
// };

//  =================== DELETE FOLDER ====================
// const deleteFolder = async (currentCourseId) => {
//   // FETCHING THE FOLDER ID
//   const fetchFolderId = await fetch(
//     `http://localhost:5001/client/lms-retrieve-notes?currentCourseId=${currentCourseId}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   let folderId; // Define folderId here

//   if (fetchFolderId.ok) {
//     const data = await fetchFolderId.json();
//     console.log("Data:", data);
//     console.log("Course Folder:", data.courseFolder);

//     if (data.courseNotes && Array.isArray(data.courseFolder)) {
//       data.courseFolder.forEach((folder) => {
//         folderId = folder._id; // Assign a value to folderId here
//         console.log(folderId, "CHUCK");
//       });
//     } else {
//       const error = await fetchFolderId.json();
//       console.error(error.message);
//       console.error("courseFolder is undefined or not an array");
//     }
//   }
//   if (folderId) {
//     const response = await fetch(
//       `http://localhost:5001/client/lms-folder/${folderId}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.ok) {
//       const data = await response.json();
//       console.log(data.message);
//       // alert("Folder Deleted Successfully");
//       await retrieveCreatedFile(folderId);
//     } else {
//       const error = await response.json();
//       console.error(error.message);
//       alert("Error Deleting Folder");
//     }
//   } else {
//     console.error("Folder ID is undefined");
//   }
// };

// ================== UPDATING THE NOTES DATA ==================

const updateNotes = async (clickedNoteId) => {
  const noteContent = document.getElementById(
    "selectedWritingNotesSpace"
  ).value;

  const response = await fetch(
    "http://localhost:5001/client/lms-update-notes",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clickedNoteId,
        noteContent,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    console.log("Note Updated Successfully");
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Error Updating Note");
  }
};

const selectedWritingNotesSpace = document.getElementById(
  "selectedWritingNotesSpace"
);

selectedWritingNotesSpace.addEventListener("input", function (event) {
  event.preventDefault();
  console.log("updateNotes called with id:", clickedNoteId);
  updateNotes(clickedNoteId);
});

// ================== UPDATING THE NOTES TITLE ==================

const updateNotesTitle = async (clickedNoteId) => {
  const noteTitleNameSecond = document.getElementById(
    "noteTitleNameSecond"
  ).value;

  const response = await fetch(
    "http://localhost:5001/client/lms-update-notes-title",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clickedNoteId,
        noteTitleNameSecond,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    console.log("Note Title Updated Successfully");
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Error Updating Note");
  }
};

const noteTitleNameSecond = document.getElementById("noteTitleNameSecond");

noteTitleNameSecond.addEventListener("input", (event) => {
  event.preventDefault();
  updateNotesTitle(clickedNoteId);
});

// ================== UPDATING THE NOTES PAGE TITLE ==================

const updateNotesPageTitle = async (clickedNoteId) => {
  const notePageTitle = document.getElementById("notePageTitle").value;

  const response = await fetch(
    "http://localhost:5001/client/lms-update-notes-page-title",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clickedNoteId,
        notePageTitle,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    console.log("Note Title Updated Successfully");
  } else {
    const error = await response.json();
    console.error(error.message);
    alert("Error Updating Note");
  }
};

const notePageTitle = document.getElementById("notePageTitle");

notePageTitle.addEventListener("input", (event) => {
  event.preventDefault();
  updateNotesPageTitle(clickedNoteId);
});
