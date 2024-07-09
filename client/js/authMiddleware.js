// PREVENT USER FROM GOING TO lms-home.html WHEN LOCAL STORAGE DONT HAVE USERNAME
const logoutButton = document.getElementById("logoutButton");

const protectRoute = () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("You are not login");
    window.location.href = "index.html";
    return false;
  }

  return true;
};

if (
  window.location.pathname === "/lms-home.html" ||
  window.location.pathname === "/enrolled.html" ||
  window.location.pathname === "/teaching.html" ||
  window.location.pathname === "/settings.html" ||
  window.location.pathname === "/calendar.html" ||
  window.location.pathname === "/login.html"
) {
  protectRoute();
}

const logout = () => {
  localStorage.removeItem("username");
  window.location.href = "index.html";
};

document.getElementById("logoutButton").addEventListener("click", logout);
