// DISPLAY CREATE CLASS POPUP
const createClassButton = document.getElementById('createClassButton')
const backgroundOverlay = document.getElementById('backgroundOverlay')
const classPopupOverlay = document.getElementById('classPopupOverlay')
const cancelCreateButton = document.getElementById('cancelCreateButton')
const createCourseButton = document.getElementById('createCourseButton')

// FUNCTION TO SHOW THE POPUP
createClassButton.addEventListener('click', (event) => {
  event.stopPropagation()
  showPopup()
})

function showPopup () {
  backgroundOverlay.style.display = 'flex'
  classPopupOverlay.style.display = 'block'
}

// FUNCTION TO HIDE THE POPUP AND RESET THE FORM
function hidePopupAndResetForm () {
  backgroundOverlay.style.display = 'none'
  classPopupOverlay.style.display = 'none'
  createClassForm.reset()
}

// ADD EVENT LISTENERS TO THE CANCEL BUTTON AND THE BACKGROUND OVERLAY
cancelCreateButton.addEventListener('click', hidePopupAndResetForm)
backgroundOverlay.addEventListener('click', hidePopupAndResetForm)
document.addEventListener('click', hidePopupAndResetForm)

// PREVENT THE POPUP FROM CLOSING WHEN CLICKING ON THE POPUP ITSELF
classPopupOverlay.addEventListener('click', (event) => {
  event.stopPropagation()
})

// RETRIGGER CREATE JOIN POPUP
const retriggerPopupIcon = document.getElementById('retriggerPopupIcon')
const retriggerCreateJoinContainer = document.getElementById(
  'retriggerCreateJoinContainer'
)

const retriggerCreate = document.getElementById('retriggerCreate')

// ADD EVENT LISTENERS TO THE CREATE CLASS BUTTON AND THE RETRIGGER BUTTON
retriggerPopupIcon.addEventListener('click', (event) => {
  event.stopPropagation()
  if (retriggerCreateJoinContainer.style.display === 'flex') {
    hideRetriggerPopupContainer()
  } else {
    showCreateJoin()
  }
})

retriggerCreate.addEventListener('click', (event) => {
  event.stopPropagation()
  hideRetriggerPopupContainer()
  showPopup()
})

function showCreateJoin () {
  retriggerCreateJoinContainer.style.display = 'flex'
}

function hideRetriggerPopupContainer () {
  retriggerCreateJoinContainer.style.display = 'none'
}

document.addEventListener('click', hideRetriggerPopupContainer)

// PREVENT THE POPUP FROM CLOSING WHEN CLICKNG ON THE POPUP ITSELF
retriggerCreateJoinContainer.addEventListener('click', (event) => {
  event.stopPropagation()
})

// ====================================================================================

// CHECKING WHETHER THE FORM IS FILLED OUT
const inputFields = document.querySelectorAll('.input__fields')

// CHECK IF ALL INPUT FIELDS ARE FILLED OUT
function checkFields () {
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].value.trim() === '') {
      return false
    }
  }
  return true
}

// UPDATE THE COLOR AND DISABLED STATE OF THE CREATE COURSE BUTTON
function updateButtonColor () {
  if (checkFields()) {
    createCourseButton.style.color = 'black'
    createCourseButton.disabled = false
  } else {
    createCourseButton.style.color = ''
    createCourseButton.disabled = true
  }
}

// INITIALLY DISABLE THE CREATECOURSEBUTTON
createCourseButton.disabled = true

// ADD EVENT LISTENERS TO THE INPUT FIELDS
for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener('input', updateButtonColor)
}

// ==================== CREATE A NEW COURSE ====================

const createClassForm = document.getElementById('createClassForm')

const submitForm = async (event) => {
  event.preventDefault()

  // GETTING THE VALUE FROM THE FORM
  const className = document.getElementById('className').value
  const lecturerName = document.getElementById('lecturerName').value
  const classSubject = document.getElementById('classSubject').value
  const classRoom = document.getElementById('classRoom').value

  const userEmail = localStorage.getItem('userEmail')
  // MAKE A REQUEST TO THE SERVER
  const response = await fetch('http://localhost:5001/client/lms-home', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      className,
      lecturerName,
      classSubject,
      classRoom,
      userEmail,
    }),
  })

  const createCourseContainer = document.getElementById(
    'createCourseContainer'
  )

  // GETTING THE RESPONSE FROM THE SERVER IF THE REQUEST IS SUCCESSFUL
  if (response.ok) {
    const data = await response.json()
    console.log(data.message)
    alert('Class Created Successfully')
    backgroundOverlay.style.display = 'none'
    classPopupOverlay.style.display = 'none'
    createCourseContainer.style.display = 'none'
    localStorage.setItem('createCourseContainerDisplay', 'none')
    createClassForm.reset()
  } else {
    const error = await response.json()
    console.error(error.message)
    alert('Error Creating Class')
    backgroundOverlay.style.display = 'none'
    classPopupOverlay.style.display = 'none'
    createCourseContainer.style.display = 'none'
    localStorage.setItem('createCourseContainerDisplay', 'none')
    createClassForm.reset()
  }
}

// ==================== RETRIEVE COURSES ====================

const retrieveCourse = async () => {
  const userEmail = localStorage.getItem('userEmail')

  const response = await fetch(
    `http://localhost:5001/client/lms-home?userEmail=${userEmail}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (response.ok) {
    const data = await response.json()
    console.log(data.courses)

    const createDisplayCourseContainer = document.getElementById(
      'createDisplayCourseContainer'
    )

    // CLEAN THE EXISTING CODE
    createDisplayCourseContainer.innerHTML = ''

    // CREATE AN ARRAY TO STORE THE COURSE IDS
    const courseIDs = []

    data.courses.forEach((course) => {
      const className = course.className
      const lecturerName = course.lecturerName
      const classRoom = course.classRoom
      const courseID = course._id

      courseIDs.push(courseID)

      const courseDiv = document.createElement('div')
      courseDiv.className = 'display__course__container'
      courseDiv.dataset.courseId = course._id
      courseDiv.innerHTML = `
      <div class="delete__background__overlay" id="backgroundOverlay"></div>

      <div class="display__course__data__container">
      <div class="display__course__data">
        <p id="displayClassTitle">${className}</p>
        <p id="displayLecturerName">${lecturerName}</p>
      </div>
    </div>

    <div class="empty__main__container">
      <div
        class="empty__functionality__container"
        id="emptyFunctionalityContainer"
      >
        <input type="submit" name="Edit" value="Edit" id="editButton"/>
        <input type="submit" name="Delete" value="Delete" data-course-id="${courseID}" id="deleteButton"/>
      </div>
    </div>

    <div
      class="display__delete__confirmation__container"
      id="displayDeleteConfirmationContainer"
    >
      <p class="delete__title">Delete ${className} ?</p>

      <div class="paragraph__container">
        <p>
          You will no longer have access to any posts or comments that
          have been added to this class.
        </p>

        <p class="paragraph__bottom">You can't undo this action after delete.</p>
       
      </div>
      <div class="cancel__delete__container">
        <button class="cancel__button" id="cancelButton">
          Cancel
        </button>
       
        <input type="submit" name="Delete" value="Delete" class="delete__button" data-course-id="${courseID}" id="deleteCourseButton"/>
        
      </div>
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
      `
      createDisplayCourseContainer.appendChild(courseDiv)

      const deleteButton = courseDiv.querySelector('#deleteButton')
      const deleteConfirmatonContainer = courseDiv.querySelector(
        '#displayDeleteConfirmationContainer'
      )
      const backgroundOverlay = courseDiv.querySelector(
        '.delete__background__overlay'
      )
      const cancelButton = courseDiv.querySelector('#cancelButton')
      const deleteCourseButton = courseDiv.querySelector('#deleteCourseButton')

      // Add event listener to the delete button of the current course
      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation()
        const emptyFunctionalityContainer = courseDiv.querySelector(
          '.empty__functionality__container'
        )

        // Hide the empty__functionality__container
        emptyFunctionalityContainer.style.display = 'none'
        deleteConfirmatonContainer.style.display = 'flex'
        backgroundOverlay.style.display = 'flex'
      })

      // Add event listener to the cancel button of the current course
      cancelButton.addEventListener('click', (event) => {
        event.stopPropagation()
        deleteConfirmatonContainer.style.display = 'none'
        backgroundOverlay.style.display = 'none'
      })

      deleteCourseButton.addEventListener('click', (event) => {
        deleteCourseButton.value = 'Deleting...'
        event.stopPropagation()
        deleteCourseButton.style.background = 'none'
        deleteCourseButton.style.color = 'grey'
        cancelButton.disabled = true
        deleteCourseButton.style.boxShadow = 'none'

        setTimeout(() => {
          event.preventDefault()
          console.log('Delete button clicked')
          const courseId = event.target.dataset.courseId
          deleteCourse(courseId)
          deleteConfirmatonContainer.style.display = 'none'
          backgroundOverlay.style.display = 'none'
          deleteCourseButton.style.background = 'red'
          deleteCourseButton.style.color = 'white'
          alert('Delete Succesful')
        }, 1000)
      })

      // Add event listener to the window outside of the loop
      window.addEventListener('click', (event) => {
        // Get all deleteConfirmationContainer elements
        const deleteConfirmationContainers = document.querySelectorAll(
          '.display__delete__confirmation__container'
        )

        // Loop through all deleteConfirmationContainer elements
        deleteConfirmationContainers.forEach((deleteConfirmationContainer) => {
          // If the click event is not within the current deleteConfirmationContainer, hide it
          if (!deleteConfirmationContainer.contains(event.target)) {
            deleteConfirmationContainer.style.display = 'none'
          }
        })

        // Get all backgroundOverlay elements
        const backgroundOverlays = document.querySelectorAll(
          '.delete__background__overlay'
        )

        // Hide all background overlays
        backgroundOverlays.forEach((overlay) => {
          overlay.style.display = 'none'
        })

        // Add event listener to the deleteConfirmationContainer of the current course
        deleteConfirmatonContainer.addEventListener('click', (event) => {
          event.stopPropagation()
        })
      })

      // FUNCTION TO CLOSE ALL EMPTY__FUNCTIONALITY__CONTAINER ELEMENTS
      function closeAllFunctionalityContainers () {
        const functionalityContainers = document.querySelectorAll(
          '.empty__functionality__container'
        )
        functionalityContainers.forEach((container) => {
          container.style.display = 'none'
        })
      }

      // ADD EVENT LISTENER TO THE CREATEDISPLAYCOURSECONTAINER
      courseDiv.addEventListener('click', function (event) {
        // CHECK IF THE CLICKED ELEMENT OR ITS PARENT IS A .DISPLAY__THREE__DOTS__CONTAINER
        const threeDotContainer = event.target.closest(
          '.display__three__dots__container'
        )
        if (threeDotContainer) {
          // PREVENT THE WINDOW CLICK EVENT FROM FIRING
          event.stopPropagation()

          // GET THE EMPTY__FUNCTIONALITY__CONTAINER CORRESPONDING TO THE CLICKED DISPLAY__THREE__DOTS__CONTAINER
          const parentContainer = threeDotContainer.closest(
            '.display__course__container'
          )
          const functionalityContainer = parentContainer.querySelector(
            '.empty__functionality__container'
          )

          // IF THE FUNCTIONALITYCONTAINER IS ALREADY OPEN, CLOSE IT; OTHERWISE, CLOSE ALL CONTAINERS AND OPEN IT
          if (functionalityContainer.style.display === 'flex') {
            functionalityContainer.style.display = 'none'
          } else {
            closeAllFunctionalityContainers()
            functionalityContainer.style.display = 'flex'
          }
        }
      })

      // ADD EVENT LISTENER TO THE WINDOW THAT CLOSES THE EMPTY__FUNCTIONALITY__CONTAINER WHEN CLICKED
      window.addEventListener('click', closeAllFunctionalityContainers)
    })
  } else {
    const error = await response.json()
    console.error(error.message)
  }
} // here ends

// ADD EVENT LISTENER TO THE CREATE COURSE BUTTON
createCourseButton.addEventListener('click', async (event) => {
  await submitForm(event)
  await retrieveCourse()
})

// ENSURE THAT THE CREATE COURSE CONTAINER ONLY APPEAR AFTER THERE IS NO MORE COURSES
window.onload = async function () {
  const createCourseContainer = document.getElementById(
    'createCourseContainer'
  )
  const createDisplayCourseContainer = document.getElementById(
    'createDisplayCourseContainer'
  )

  // RETRIEVE COURSES
  await retrieveCourse()

  // CHECK IF THERE ARE ANY COURSES
  if (createDisplayCourseContainer.children.length === 0) {
    // IF THERE ARE NO COURSES, DISPLAY THE CREATECOURSECONTAINER
    createCourseContainer.style.display = 'flex'
  } else {
    // IF THERE ARE COURSES, HIDE THE CREATECOURSECONTAINER
    createCourseContainer.style.display = 'none'
  }
}

// ================================= DELETE =====================================

const deleteCourse = async (courseId) => {
  const response = await fetch(`http://localhost:5001/client/lms/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (response.ok) {
    const data = await response.json()
    console.log(data.message)
    // AFTER SUCCESSFUL DELETION, REMOVE THE COURSE FROM THE DOM
    const courseDiv = document.querySelector(
      `div[data-course-id="${courseId}"]`
    )
    courseDiv.remove()

    // CHECK IF THERE ARE ANY COURSES LEFT
    const createDisplayCourseContainer = document.getElementById(
      'createDisplayCourseContainer'
    )
    if (createDisplayCourseContainer.children.length === 0) {
      // IF THERE ARE NO COURSES LEFT, DISPLAY THE CREATECOURSECONTAINER
      const createCourseContainer = document.getElementById(
        'createCourseContainer'
      )
      createCourseContainer.style.display = 'flex'
      localStorage.setItem('createCourseContainerDisplay', 'flex')
    }
  } else {
    const error = await response.json()
    console.error(error.message)
  }
}
