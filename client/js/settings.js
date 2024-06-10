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

document.addEventListener("DOMContentLoaded", () => {
 // Get the form
  const uploadForm = document.getElementById("upload-profile");

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const file = uploadForm.querySelector('input[type="file"]').files[0]

      if (!file) {
        alert("Please select a file to upload");
        return;
      }

      const formData = new FormData(uploadForm);

      const username = localStorage.getItem("username");
      formData.append("username", username);

      const response = await fetch("http://localhost:5001/client/profile-picture", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();

        pollForImage(data.file, 1000, 10)
          .then(async (imageResponse) => {
            // Create a blob URL from the image response
            const imageBlob = await imageResponse.blob();
            console.log(imageBlob);
            const imageUrl = URL.createObjectURL(imageBlob);

            // Display the image
            const profilePicture = document.querySelectorAll(".user__account");

            profilePicture.forEach((element) => {
              // Hide the <i> element
              element.style.display = 'none';

              // Get the parent of profilePicture
              const parent = element.parentElement;

              // Remove the <img> element if it exists
              const prevImg = parent.querySelector('img');
              if (prevImg) {
                prevImg.remove();
              }

              // Create a new <img> element
              const img = document.createElement('img');
              img.src = imageUrl;
              img.classList.add("user__account__img");
              img.alt = 'Profile Picture';

              // Insert the new <img> element after the <i> element
              element.parentNode.insertBefore(img, element.nextSibling);

              // Remove this element
              const changeProfileOverlayContainer = document.getElementById("changeProfileOverlayContainer");
              const backgroundSettingsOverlay = document.getElementById("backgroundSettingsOverlay");

              changeProfileOverlayContainer.style.display = "none";
              backgroundSettingsOverlay.style.display = "none";
            });
          })
      } else {
        const data = await response.json();
        console.error(data);
      }
    })
  }
});

async function pollForImage(file, interval, maxAttempts) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Retrieve the image from the backend
    const imageResponse = await fetch(
      `http://localhost:5001/image/${file}`
    );

    if (imageResponse.ok) {
      console.log(imageResponse);
      return imageResponse;
    }

    // Image not found, wait for the interval then try again
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("Image not found after maximum attempts");
}

window.addEventListener("click", (e) => {
  if (e.target === backgroundSettingsOverlay) {
    backgroundSettingsOverlay.style.display = "none";
    changeProfileOverlayContainer.style.display = "none";
  }
});
