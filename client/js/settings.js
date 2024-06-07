const userProfilePicture = document.getElementById("userProfilePicture");

const changeProfileButton = document.getElementById("changeProfileButton");

const cancelChangeProfile = document.getElementById("cancelChangeProfile");

const backgroundSettingsOverlay = document.getElementById(
  "backgroundSettingsOverlay"
);

const changeProfileOverlayContainer = document.getElementById(
  "changeProfileOverlayContainer"
);

const cancelProfileUpload = document.getElementById("cancelProfileUpload");

changeProfileButton.addEventListener("click", () => {
  changeProfileOverlayContainer.style.display = "flex";
  backgroundSettingsOverlay.style.display = "flex";
});

cancelChangeProfile.addEventListener("click", () => {
  if (
    changeProfileOverlayContainer.style.display === "flex" ||
    backgroundSettingsOverlay.style.display === "flex"
  ) {
    backgroundSettingsOverlay.style.display = "none";
    changeProfileOverlayContainer.style.display = "none";
  }
});

cancelProfileUpload.addEventListener("click", () => {
  if (
    changeProfileOverlayContainer.style.display === "flex" ||
    backgroundSettingsOverlay.style.display === "flex"
  ) {
    backgroundSettingsOverlay.style.display = "none";
    changeProfileOverlayContainer.style.display = "none";
  }
});

const uploadProfile = async (event) => {
  event.preventDefault();
  const chooseProfilePicture = document.getElementById("chooseProfilePicture")
    .files[0];
  const userEmail = localStorage.getItem("userEmail");

  const formData = new FormData();
  formData.append("profilePicture", chooseProfilePicture);
  formData.append("userEmail", userEmail);

  const response = await fetch("/client/profile-picture", {
    method: "PUT",
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    userProfilePicture.src = data.profilePicture;
    backgroundSettingsOverlay.style.display = "none";
    changeProfileOverlayContainer.style.display = "none";
  } else {
    const errorData = await response.json(); // Parse the error response as JSON
    console.error(errorData.error); // Log the error message
    console.error(`Error: ${response.status}`);

    alert(`Failed to upload profile picture: ${errorData.error}`);
  }
};

const uploadProfilePicture = document.getElementById("uploadProfilePicture");

uploadProfilePicture.addEventListener("click", uploadProfile);

window.addEventListener("click", (e) => {
  if (e.target === backgroundSettingsOverlay) {
    backgroundSettingsOverlay.style.display = "none";
    changeProfileOverlayContainer.style.display = "none";
  }
});
