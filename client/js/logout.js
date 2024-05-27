// ==================== LOGOUT FUNCTION ====================
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  // Clear all data from local storage
  localStorage.clear();
  // Redirect the user to the login page
  window.location.href = "index.html";
});