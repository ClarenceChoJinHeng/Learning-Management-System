const loginButton = document.getElementById("submit-login");
const loginForm = document.getElementById("login-form");

function validateEmail(email) {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateLoginForm() {
  document.getElementById("error__email").style.display = "none";
  document.getElementById("error__password").style.display = "none";

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // Validate email
  if (email.trim() === "") {
    document.getElementById("error__email").style.display = "block";
    return false;
  } else if (!validateEmail(email)) {
    document.getElementById("error__email").innerText = "Invalid email format";
    document.getElementById("error__email").style.display = "block";
    return false;
  }

  if (password.trim() === "") {
    document.getElementById("error__password").style.display = "block";
    return false;
  }

  // If all validations pass, the form is submitted
  return true;
}

async function submitLoginForm(event) {
  event.preventDefault();
  if (!validateLoginForm()) {
    event.preventDefault();
    return;
  }

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  try {
    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      window.location.href = "signup.html";
    } else {
      const data = await response.json();
      console.log(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

loginButton.addEventListener("click", submitLoginForm);
