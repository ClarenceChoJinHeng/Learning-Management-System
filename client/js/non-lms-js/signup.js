// CHANGING THE SIGNUP LINK TO LOGIN LINK
window.addEventListener('DOMContentLoaded', (event) => {
  const signupLink = document.getElementById('signupLink')

  // Check if the current page is login.html
  if (window.location.pathname.endsWith('login.html')) {
    signupLink.textContent = 'Login'
    signupLink.href = 'login.html'
  } else if (window.location.pathname.endsWith('signup.html')) {
    signupLink.textContent = 'Login'
    signupLink.href = 'login.html'
  }
})

// SHOW PASSWORD FUNCTIONALITY
const passwordInput = document.getElementById('password')
const confirmpasswordInput = document.getElementById('confirm-password')

passwordInput.addEventListener('click', () => {
  passwordInput.type = 'text'
})

confirmpasswordInput.addEventListener('click', () => {
  confirmpasswordInput.type = 'text'
})

passwordInput.addEventListener('blur', () => {
  passwordInput.type = 'password'
})

confirmpasswordInput.addEventListener('blur', () => {
  confirmpasswordInput.type = 'password'
})

// GETTING SIGNUP BUTTON
const signupButton = document.getElementById('submit-button')
// GETTING THE FORM
const signupForm = document.getElementById('signup-form')

// CREATE A FUNCTION THAT CAN VALIDATE THE EMAIL
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// CREATE A FUNCTION THAT CAN VALIDATE THE FORM
const validateSignupForm = (event) => {
  // RESET THE ERROR MESSAGE
  document.getElementById('username-error').style.display = 'none'
  document.getElementById('email-error').style.display = 'none'
  document.getElementById('password-error').style.display = 'none'
  document.getElementById('confirm-password-error').style.display = 'none'

  // GETTING THE VALUES FROM THE FORM
  const username = document.getElementById('username').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirm-password').value

  // CHECKING IF THE NAME IS EMPTY
  if (username.trim() === '') {
    document.getElementById('username-error').style.display = 'block'
    return false
  }

  // CHECKING IF THE EMAIL IS EMPTY
  if (email === ' ') {
    document.getElementById('email-error').style.display = 'block'
    return false
  } else if (!validateEmail(email)) {
    document.getElementById('email-error').style.display = 'block'
    document.getElementById('email-error').textContent =
      'Invalid Email Address'
    return false
  }

  // CHECKING IF THE PASSWORD IS EMPTY
  if (password === ' ') {
    document.getElementById('password-error').style.display = 'block'
    return false
  } else if (password.length < 8) {
    document.getElementById('password-error').style.display = 'block'
    document.getElementById('password-error').textContent =
      'Passowrd must contain atleast 8 characters'
    return false
  } else if (
    !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password)
  ) {
    document.getElementById('password-error').innerHTML =
      'Password Format Incorrect<br>' + 'Example: Secure1$'
    document.getElementById('password-error').style.display = 'block'
    return false
  }

  // CHECKING IF THE CONFIRM PASSWORD IS EMPTY
  if (confirmPassword === '') {
    document.getElementById('confirm-password-error').style.display = 'block'
    return false
  } else if (confirmPassword !== password) {
    document.getElementById('confirm-password-error').style.display = 'block'
    document.getElementById('confirm-password-error').textContent =
      'Password does not match'
    return false
  }
  return true
}

// SUBMIT FORM FUNCTION
const submitForm = async (event) => {
  event.preventDefault()

  // VALIDATE THE FORM
  if (!validateSignupForm(event)) {
    event.preventDefault()
    return
  }

  // GETTING THE VALUES FROM THE FORM
  const username = document.getElementById('username').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const role = 'user'

  // MAKE A REQUEST TO THE SERVER (LOCALHOST)
  const response = await fetch('http://localhost:5001/client/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, role }),
  })

  // GETTING THE RESPONSE FROM THE SERVER IF THE REQUEST IS SUCCESSFUL
  if (response.ok) {
    const data = await response.json()
    console.log(data.message)
    // alert('Signup Successful! Please Login to continue')
    window.location.href = 'login.html'
  } else {
    const error = await response.json()
    console.error(error.message)
    alert('Account already exist')
    window.location.href = 'signup.html'

    if (response.status === 400) {
      // HANDLE THE DUPLICATE ENTRY ERROR
      console.log(error.message)
      alert(data.message)
    }
  }
}

// ADD EVENT LISTENER TO THE BUTTON
signupButton.addEventListener('click', (event) => {
  submitForm(event)
})
