document.addEventListener('DOMContentLoaded', async() => {
  // retrieve profile picture
  const username = localStorage.getItem("username");

  if (!username) return;

  const response = await fetch("http://localhost:5001/client/retrieveProfilePicture", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (response.ok) {
    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    const profilePicture = document.querySelectorAll(".user__account, .user__account__display, .user__profile__picture");

    profilePicture.forEach((element) => {
      // Hide the <i> element
      element.style.display = 'none';

      // Create a new <img> element
      const img = document.createElement('img');
      img.src = imageUrl;
      img.classList.add("user__account__img");
      img.alt = 'Profile Picture';

      // Insert the new <img> element after the <i> element
      element.parentNode.insertBefore(img, element.nextSibling);
    });
  } else {
    console.log("Failed to retrieve profile picture");
  }
});