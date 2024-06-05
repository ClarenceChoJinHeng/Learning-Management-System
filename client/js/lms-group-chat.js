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

// ================== RETRIEVE GROUP CHAT FOR DISPLAY ====================
// document.addEventListener("DOMContentLoaded", function () {
//   const displayUserContainer = document.getElementById("displayUserContainer");

//   const chatBoxNoUserContainer = document.getElementById(
//     "chatBoxNoUserContainer"
//   );

//   const chatBoxHeader = document.querySelector(".chatbox__header");

//   const chatBoxDisplayMessageContainer = document.querySelector(
//     ".chatbox__display__message__container"
//   );

//   const chatBoxEnterMessageContainer = document.querySelector(
//     ".chatbox__enter__message__container"
//   );

//   const chatBoxDisplayMessageMainContainer = document.querySelector(
//     ".chatbox__display__message__main__container"
//   );

//   const enterMessageContainer = document.querySelector(
//     ".enter__message__container"
//   );

//   const receiverName = document.getElementById("receiverName");

//   const retrieveChatForm = async () => {
//     let userEmail = localStorage.getItem("userEmail");

//     const response = await fetch(
//       `http://localhost:5001/client/group-study/group-chat-retrieval/?userEmail=${userEmail}`
//     );

//     if (response.ok) {
//       const data = await response.json();
//       console.log(data.userChat);

//       // ============  CLEAN THE EXISTING CODE ============
//       displayUserContainer.innerHTML = "";
//       let displayedChatIDs = new Set();

//       // ============  CREATE AN ARRAY TO STORE THE COURSE IDS ============
//       let chatIDs = [];

//       data.userChat.forEach((chat) => {
//         const groupName = chat.groupName;
//         const chatID = chat._id;

//         if (displayedChatIDs.has(chatID)) {
//           return;
//         }

//         chatIDs.push(chatID);
//         displayedChatIDs.add(chatID);

//         const emailObject = chat.emails.find(
//           (emailObject) => emailObject.email === userEmail
//         );

//         // ============ MAKING HTML AND APPLY DATA INTO IT `============

//         if (emailObject) {
//           const chatDiv = document.createElement("div");
//           chatDiv.className = "user__container";
//           chatDiv.dataset.chatId = chat._id;
//           chatDiv.innerHTML = `
     
//         <div class="user__message__name__container">
//         <i class="bx bx-user-circle user__profile__picture"></i>
//         <p class="user__message__name">${groupName}</p>
//       </div>

//       <div class="user__message__time__container">
//         <p>Test</p>
//       </div>
//     `;

//           displayUserContainer.appendChild(chatDiv);
//           chatDiv.addEventListener("click", async (event) => {
//             event.preventDefault();
//             receiverName.innerHTML = groupName;
//             if (
//               chatBoxNoUserContainer.style.display === "flex" ||
//               chatBoxNoUserContainer.style.display === ""
//             ) {
//               chatBoxNoUserContainer.style.display = "none";
//               chatBoxHeader.style.display = "flex";
//               chatBoxDisplayMessageMainContainer.style.display = "flex";
//               chatBoxDisplayMessageContainer.style.display = "flex";
//               chatBoxEnterMessageContainer.style.display = "flex";
//               enterMessageContainer.style.display = "flex";
//             }
//           });
//         }
//       });
//     } else {
//       const error = response.json();
//       console.log(error.message);
//     }
//   };

//   retrieveChatForm();

//   const createGroupButtonConfirm = document.getElementById("createGroupButton");

//   createGroupButtonConfirm.addEventListener("click", async (event) => {
//     await createGroupChat(event);
//     await retrieveChatForm();
//   });
// });
