// ==================== LOGOUT FUNCTION ====================
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  // Remove the token from the local storage
  localStorage.removeItem("username");
  // Redirect the user to the login page
  window.location.href = "index.html";
});
