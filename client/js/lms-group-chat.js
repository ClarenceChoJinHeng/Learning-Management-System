const createGroupButton = document.getElementById("createGroup");
const userEmailCheckBoxMainContainer = document.getElementById(
  "userEmailCheckBoxMainContainer"
);

let selectedUserEmail = [];
const retrieveUserChat = async () => {
  userEmailCheckBoxMainContainer.innerHTML = "";
  selectedUserEmail = [];
  const userEmail = localStorage.getItem("userEmail");

  if (!selectedUserEmail.includes(userEmail)) {
    selectedUserEmail.push(userEmail);
  }

  const response = await fetch(
    `http://localhost:5001/client/group-study/?userEmail=${userEmail}`
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.userChat);

    // ============  CREATE AN ARRAY TO STORE THE COURSE IDS ============
    let chatIDs = [];

    data.userChat.forEach((chat) => {
      const senderUserEmail = chat.senderUserEmail;
      const receiverEmailInput = chat.receiverEmailInput;
      const chatID = chat._id;

      chatIDs.push(chatID);

      // ============ MAKING HTML AND APPLY DATA INTO IT `============

      if (senderUserEmail === userEmail) {
        const emailDiv = document.createElement("div");
        emailDiv.className = "user__email__checkbox__container";
        emailDiv.dataset.chatId = chat._id;
        emailDiv.innerHTML = `
     
        <p class="user__email__contacts">
          ${receiverEmailInput}                          
        </p>

        <input
          type="checkbox"
          name="userEmail"
          id="userEmailSelect"
          value="${receiverEmailInput}"
        />
    `;
        userEmailCheckBoxMainContainer.appendChild(emailDiv);
        const userEmailSelect = emailDiv.querySelector(
          "input[type='checkbox']"
        );

        userEmailSelect.addEventListener("click", async (event) => {
          const selectedEmail = event.target.value;

          if (event.target.checked) {
            selectedUserEmail.push(selectedEmail);
          } else {
            selectedUserEmail = selectedUserEmail.filter(
              (email) => email !== selectedEmail
            );
          }
          console.log(selectedUserEmail);
        });
      } else if (receiverEmailInput === userEmail) {
        const emailDiv = document.createElement("div");
        emailDiv.className = "user__email__checkbox__container";
        emailDiv.dataset.chatId = chat._id;
        emailDiv.innerHTML = `
     
        <p class="user__email__contacts">
          ${senderUserEmail}                          
        </p>

        <input
          type="checkbox"
          name="userEmail"
          id="userEmailSelect"
          value="${senderUserEmail}"
        />
    `;

        userEmailCheckBoxMainContainer.appendChild(emailDiv);

        const userEmailSelect = emailDiv.querySelector(
          "input[type='checkbox']"
        );
        userEmailSelect.addEventListener("click", async (event) => {
          const selectedEmail = event.target.value;

          if (event.target.checked) {
            selectedUserEmail.push(selectedEmail);
          } else {
            selectedUserEmail = selectedUserEmail.filter(
              (email) => email !== selectedEmail
            );
          }
          console.log(selectedUserEmail);
        });
      }
    });
  }
};

createGroupButton.addEventListener("click", async (event) => {
  await retrieveUserChat(event);  
});

// =================== CREATE GROUP CHAT ====================

const createGroupChat = async () => {
  const userEmail = localStorage.getItem("userEmail");
  const userGroupNameInput =
    document.getElementById("userGroupNameInput").value;

  if (selectedUserEmail.length === 0) {
    console.log("No emails selected");
    return; // Exit the function if no emails are selected
  }

  const users = selectedUserEmail.map((email) => ({
    email,
    role: email === userEmail ? "owner" : "member",
  }));

  const response = await fetch(
    "http://localhost:5001/client/group-study/group-chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userGroupNameInput,
        users,
      }),
    }
  );

  console.log("userGroupNameInput:", userGroupNameInput);
  console.log("selectedUserEmail:", selectedUserEmail);

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    createGroupForm.style.display = "none";
  } else {
    const error = await response.json();
    console.log(error.message);
    createGroupForm.style.display = "none";
  }
};

