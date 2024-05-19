// ============  EXPORTING ID INTO VARIABLE ============
const triggerAddUser = document.getElementById("triggerAddUser");
const addUserContainer = document.getElementById("addUserContainer");
const addUser = document.getElementById("addUser");
const addUserForm = document.getElementById("addUserForm");
const cancelUserButton = document.getElementById("cancelUserButton");

// ============  TRIGGER ADD USER CONTAINER ============
triggerAddUser.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (addUserForm.style.display === "flex") {
    addUserForm.style.display = "none";
  } else if (
    addUserContainer.style.display === "none" ||
    addUserContainer.style.display === ""
  ) {
    addUserContainer.style.display = "flex";
  } else {
    addUserContainer.style.display = "none";
  }
});

// ============  TRIGGER ADD USER FORM ============
addUser.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  addUserContainer.style.display = "none";
  addUserForm.style.display = "flex";
});

cancelUserButton.addEventListener("click", (event) => {
  event.stopPropagation();
  event.preventDefault();
  addUserForm.style.display = "none";
});

// ============  CANCEL ADD USER FORM ============
window.addEventListener("click", (event) => {
  if (
    !addUserContainer.contains(event.target) &&
    !addUserForm.contains(event.target)
  ) {
    addUserContainer.style.display = "none";
    addUserForm.style.display = "none";
  }
});

// ============  ADD USER ACCOUNT ============
const submitForm = async (event) => {
  event.preventDefault();
  const senderName = localStorage.getItem("username");
  const senderUserEmail = localStorage.getItem("userEmail");
  const receiverNameInput = document.getElementById("userNameInput").value;
  const receiverEmailInput = document.getElementById("userEmailInput").value;

  //============  MAKE A REQUEST TO THE SERVER ============
  const response = await fetch("http://localhost:5001/client/group-study", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      senderName,
      senderUserEmail,
      receiverNameInput,
      receiverEmailInput,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    alert(data.message);
    console.log(data.message);
    addUserForm.style.display = "none";
  } else {
    const error = await response.json();
    alert(error.message);
    console.log(error.message);
    addUserForm.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // ============ RETRIEVE THE USER ACCOUNT DATABASE ============
  const displayUserContainer = document.getElementById("displayUserContainer");
  const addUserButton = document.getElementById("addUserButton");

  const chatBoxNoUserContainer = document.getElementById(
    "chatBoxNoUserContainer"
  );
  const chatBoxHeader = document.querySelector(".chatbox__header");

  const chatBoxDisplayMessageContainer = document.querySelector(
    ".chatbox__display__message__container"
  );
  const chatBoxEnterMessageContainer = document.querySelector(
    ".chatbox__enter__message__container"
  );
  const enterMessageContainer = document.querySelector(
    ".enter__message__container"
  );
  const receiverName = document.getElementById("receiverName");

  const chatBoxDisplayMessageMainContainer = document.querySelector(
    ".chatbox__display__message__main__container"
  );

  const retrieveChatForm = async () => {
    let userEmail = localStorage.getItem("userEmail");

    const response = await fetch(
      `http://localhost:5001/client/group-study/?userEmail=${userEmail}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data.userChat);

      // ============  CLEAN THE EXISTING CODE ============
      displayUserContainer.innerHTML = "";

      // ============  CREATE AN ARRAY TO STORE THE COURSE IDS ============
      let chatIDs = [];

      data.userChat.forEach((chat) => {
        const senderName = chat.senderName;
        const senderUserEmail = chat.senderUserEmail;
        const receiverNameInput = chat.receiverNameInput;
        const receiverEmailInput = chat.receiverEmailInput;
        const chatID = chat._id;

        chatIDs.push(chatID);

        // ============ MAKING HTML AND APPLY DATA INTO IT `============
        let chatDiv; // Declare chatDiv here
        if (senderUserEmail === userEmail) {
          const chatDiv = document.createElement("div");
          chatDiv.className = "user__container";
          chatDiv.dataset.chatId = chat._id;
          chatDiv.innerHTML = `
       
          <i class="bx bx-user-circle user__profile__picture"></i>
          <div class="user__details__container">
            <div class="user__message__time__container">
              <p>${receiverNameInput}</p> 
              <p>Test</p>
            </div>
          </div>
      `;

          displayUserContainer.appendChild(chatDiv);

          chatDiv.addEventListener("click", async (event) => {
            event.preventDefault();
            receiverName.innerHTML = receiverNameInput;
            const chatBoxDisplayMessageContainer =
              document.createElement("div");
            chatBoxDisplayMessageContainer.className =
              "chatbox__display__message__container";
            chatBoxDisplayMessageContainer.innerHTML = `
            
            <div class="sender__container">
            <p id="senderContainer">31312</p>
            </div>

            <div class="receiver__container">
            <p id="receiverContainer">3123211</p>
          </div>
            `;

            sendMessage.dataset.chatId = chat._id;

            chatBoxDisplayMessageMainContainer.appendChild(
              chatBoxDisplayMessageContainer
            );
            if (
              chatBoxNoUserContainer.style.display === "flex" ||
              chatBoxNoUserContainer.style.display === ""
            ) {
              chatBoxNoUserContainer.style.display = "none";
              chatBoxHeader.style.display = "flex";
              chatBoxDisplayMessageContainer.style.display = "flex";
              chatBoxDisplayMessageMainContainer.style.display = "flex";
              chatBoxEnterMessageContainer.style.display = "flex";
              enterMessageContainer.style.display = "flex";
            }
          });
        } else if (receiverEmailInput === userEmail) {
          const chatDiv = document.createElement("div");
          chatDiv.className = "user__container";
          chatDiv.dataset.chatId = chat._id;
          chatDiv.innerHTML = `
       
          <i class="bx bx-user-circle user__profile__picture"></i>
          <div class="user__details__container">
            <div class="user__message__time__container">
              <p>${senderName}</p> 
              <p>Test</p>
            </div>
          </div>
      `;

          displayUserContainer.appendChild(chatDiv);

          chatDiv.addEventListener("click", async (event) => {
            event.preventDefault();
            receiverName.innerHTML = receiverNameInput;
            const chatBoxDisplayMessageContainer =
              document.createElement("div");
            chatBoxDisplayMessageContainer.className =
              "chatbox__display__message__container";
            chatBoxDisplayMessageContainer.innerHTML = `
            
            <div class="sender__container">
            <p id="senderContainer">31312</p>
            </div>

            <div class="receiver__container">
            <p id="receiverContainer">3123211</p>
          </div>
            `;

            sendMessage.dataset.chatId = chat._id;

            chatBoxDisplayMessageMainContainer.appendChild(
              chatBoxDisplayMessageContainer
            );
            if (
              chatBoxNoUserContainer.style.display === "flex" ||
              chatBoxNoUserContainer.style.display === ""
            ) {
              chatBoxNoUserContainer.style.display = "none";
              chatBoxHeader.style.display = "flex";
              chatBoxDisplayMessageContainer.style.display = "flex";
              chatBoxDisplayMessageMainContainer.style.display = "flex";
              chatBoxEnterMessageContainer.style.display = "flex";
              enterMessageContainer.style.display = "flex";
            }
          });
        }
      });
    } else {
      const error = await response.json();
      console.log(error.message);
    }
  };

  retrieveChatForm();

  addUserButton.addEventListener("click", async (event) => {
    await submitForm(event);
    await retrieveChatForm();
  });
});

// ================= SEND MESSAGES =================

const sendMessage = document.getElementById("sendMessage");

const sendMessages = async () => {
  let chatId = sendMessage.dataset.chatId;

  const enterMessage = document.getElementById("enterMessage").value;

  const response = await fetch("http://localhost:5001/client/group-study", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      enterMessage,
      chatId,
    }),

  });
  console.log(chatId);

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
  } else {
    const error = await response.json();
    console.log(error.message);
  }
};

sendMessage.addEventListener("click", async (event) => {
  await sendMessages(event);
});

//  =================  RETRIEVE MESSAGES  =================

// const retrieveMessages = async () => {
//   const response = await fetch("http://localhost:5001/client/group-study", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (response.ok) {
//     const data = await response.json();
//     console.log(data);
//   } else {
//     const error = await response.json();
//     console.log(error.message);
//   }
// };
