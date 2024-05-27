// ==================== RETRIEVE USERNAME FROM LOCALSTORAGE ====================
const username = document.querySelectorAll('.userName')
const userAccountParent = document.querySelector('.user__account__container')

// EXTRACT THE USERNAME FROM LOCALSTORAGE
const user = localStorage.getItem('username')

// SET THE USERNAME TO THE ELEMENT
username.forEach((element) => {
  element.textContent = user
})

// CHANGE THE BORDER RADIUS TO 0.25rem
userAccountParent.style.borderRadius = '0.25rem'
userAccountParent.style.gap = '0.25rem'
userAccountParent.style.padding = '0.25rem'
