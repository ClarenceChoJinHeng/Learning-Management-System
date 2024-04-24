const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

// SHOW PASSWORD FUNCTIONALITY
const passwordInput = document.getElementById('password');

passwordInput.addEventListener('click', () => {
  passwordInput.type = 'text';
});

passwordInput.addEventListener('blur', () => {
  passwordInput.type = 'password';
});


const submitForm = async (event) => {
  event.preventDefault();

  // GET THE VALUES FROM THE CLIENT (JSON.stringify)
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email or password is empty or invalid
  if (!email || !emailRegex.test(email)) {
    emailError.textContent = !email
      ? "Email is required"
      : "Invalid email format";
    emailError.style.display = "block";
    return; // Stop the form submission
  } else {
    emailError.style.display = "none";
  }

  if (!password) {
    passwordError.style.display = "block";
    return; // Stop the form submission
  } else {
    passwordError.style.display = "none";
  }

  // FETCH REQUEST TO SERVER
  const response = await fetch("http://localhost:5001/client/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // GETTING THE RESPONSE FROM THE SERVER IF THE LOGIN IS MATCHING WITH THE DATA IN DATABASE

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    alert("Login successful");
    window.location.href = "lms_home.html";
  } else {
    const text = await response.text();
    console.log(text);
    alert("User does not exist or password is incorrect");
    window.location.href = "login.html";
  }
};

const submitButton = document.getElementById("login-button");
// ADD EVENT LISTENER TO THE BUTTON
submitButton.addEventListener("click", (event) => {
  submitForm(event);
});
