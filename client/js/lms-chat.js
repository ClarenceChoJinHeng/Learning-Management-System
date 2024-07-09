let selectedUserEmail = []; // Array to store the selected user emails
let currentChatId = "";
let messageRetrievalInterval;
// ============  EXPORTING ID INTO VARIABLE ============
const triggerAddUser = document.getElementById("triggerAddUser");
const addUserContainer = document.getElementById("addUserContainer");
const addUser = document.getElementById("addUser");
const createGroup = document.getElementById("createGroup");
const createGroupButton = document.getElementById("createGroupButton");
const addUserForm = document.getElementById("addUserForm");
const createGroupForm = document.getElementById("createGroupForm");
const cancelUserButton = document.getElementById("cancelUserButton");
const receiverNameInput = document.getElementById("receiverNameInput");

// ============  TRIGGER ADD USER CONTAINER ============
triggerAddUser.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (
    addUserForm.style.display === "flex" ||
    createGroupForm.style.display === "flex"
  ) {
    addUserForm.style.display = "none";
    createGroupForm.style.display = "none";
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
  createGroupForm.style.display = "none";
});

createGroup.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  addUserContainer.style.display = "none";
  createGroupForm.style.display = "flex";
  addUserForm.style.display = "none";
});

cancelUserButton.addEventListener("click", (event) => {
  event.stopPropagation();
  event.preventDefault();
  createGroupForm.style.display = "none";
  addUserForm.style.display = "none";
});

cancelGroupButton.addEventListener("click", (event) => {
  event.stopPropagation();
  event.preventDefault();
  createGroupForm.style.display = "none";
  addUserForm.style.display = "none";
});

// ============  CANCEL ADD USER FORM ============
window.addEventListener("click", (event) => {
  if (
    !addUserContainer.contains(event.target) &&
    !addUserForm.contains(event.target) &&
    !createGroupForm.contains(event.target)
  ) {
    addUserContainer.style.display = "none";
    addUserForm.style.display = "none";
    createGroupForm.style.display = "none";
  }
});

// ============ VALIDATE EMPTY FORM IN GROUP CHAT ===============

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

  const userEmailCheckBoxMainContainer = document.getElementById(
    "userEmailCheckBoxMainContainer"
  );

  // ============  ADD USER ACCOUNT ============
  const submitForm = async (event) => {
    event.preventDefault();
    const senderName = localStorage.getItem("username");
    const senderUserEmail = localStorage.getItem("userEmail");
    const receiverNameInput = document.getElementById("userNameInput").value;
    const receiverEmailInput = document.getElementById("userEmailInput").value;

    //============  MAKE A REQUEST TO THE SERVER ============
    const response = await fetch(
      "http://localhost:5001/client/single-chat-creation",
      {
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
      }
    );

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

  const retrieveChatForm = async () => {
    let userEmail = localStorage.getItem("userEmail");

    const individualChatsResponse = await fetch(
      `http://localhost:5001/client/single-chat-retrieval/?userEmail=${userEmail}`
    );

    if (individualChatsResponse.ok) {
      const individualChatsData = await individualChatsResponse.json();

      // ============  CLEAN THE EXISTING CODE ============

      displayUserContainer.innerHTML = "";

      // ============  CREATE AN ARRAY TO STORE THE COURSE IDS ============
      let chatIDs = [];
      individualChatsData.userChat.forEach((chat) => {
        const senderName = chat.senderName;
        const senderUserEmail = chat.senderUserEmail;
        const receiverNameInput = chat.receiverNameInput;
        const receiverEmailInput = chat.receiverEmailInput;
        const receiverSideSenderName = chat.receiverSideSenderName;
        const chatID = chat._id;

        chatIDs.push(chatID);
        // ============ MAKING HTML AND APPLY DATA INTO IT `============

        if (senderUserEmail === userEmail) {
          const chatDiv = document.createElement("div");
          chatDiv.className = "user__container";
          chatDiv.dataset.chatId = chat._id;
          chatDiv.innerHTML = `
       
          <div class="user__message__name__container">
          <div class="user__profile__picture">
            <i class="bx bx-user-circle user__profile__picture"></i>
          </div>
            <p class="user__message__name">${receiverNameInput}</p>
          </div>

          <div class="user__message__time__container">
            <p>Test</p>
          </div>
      `;

          displayUserContainer.appendChild(chatDiv);

          chatDiv.addEventListener("click", async (event) => {
            event.preventDefault();
            receiverName.innerHTML = receiverNameInput;
            currentChatId = chat._id;
            sendMessage.dataset.chatId = chat._id;
            retrieveMessages(currentChatId);
            if (
              chatBoxNoUserContainer.style.display === "flex" ||
              chatBoxNoUserContainer.style.display === ""
            ) {
              chatBoxNoUserContainer.style.display = "none";
              chatBoxHeader.style.display = "flex";
              chatBoxDisplayMessageMainContainer.style.display = "flex";
              chatBoxDisplayMessageContainer.style.display = "flex";
              chatBoxEnterMessageContainer.style.display = "flex";
              enterMessageContainer.style.display = "flex";
            }
          });
        } else if (receiverEmailInput === userEmail) {
          const chatDiv = document.createElement("div");
          chatDiv.className = "user__container";
          chatDiv.dataset.chatId = chat._id;
          chatDiv.innerHTML = `
       
          <div class="user__message__name__container">
          <div class="user__profile__picture">
            <i class="bx bx-user-circle user__profile__picture"></i>
          </div>
            <p class="user__message__name">${receiverSideSenderName}</p>
          </div>

          <div class="user__message__time__container">
            <p>Test</p>
          </div>
      `;

          displayUserContainer.appendChild(chatDiv);

          chatDiv.addEventListener("click", async (event) => {
            event.preventDefault();
            receiverName.innerHTML = receiverSideSenderName;
            currentChatId = chat._id;
            sendMessage.dataset.chatId = chat._id;
            retrieveMessages(currentChatId);
            if (
              chatBoxNoUserContainer.style.display === "flex" ||
              chatBoxNoUserContainer.style.display === ""
            ) {
              chatBoxNoUserContainer.style.display = "none";
              chatBoxHeader.style.display = "flex";
              chatBoxDisplayMessageMainContainer.style.display = "flex";
              chatBoxDisplayMessageContainer.style.display = "flex";
              chatBoxEnterMessageContainer.style.display = "flex";
              enterMessageContainer.style.display = "flex";
            }
          });
        }
      });
    } else {
      const individualChatsError = await individualChatsResponse.json();
      console.log(individualChatsError.message);
    }
  };

  retrieveChatForm();

  addUserButton.addEventListener("click", async (event) => {
    await submitForm(event);
    await retrieveChatForm();
    receiverNameInput.value = "";
    receiverEmailInput.value = "";
  });
});

// ================= SEND MESSAGES =================

const enterMessage = document.getElementById("enterMessage");
const sendMessage = document.getElementById("sendMessage");
const sendMessages = async (currentChatId) => {
  let userEmail = localStorage.getItem("userEmail");
  let messageText = enterMessage.value;

  // Prevent sending empty messages
  if (!messageText.trim()) {
    console.log("Cannot send an empty message");
    return;
  }

  const message = {
    sender: userEmail,
    text: messageText,
  };

  const response = await fetch(
    "http://localhost:5001/client/single-chat-send-message",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        currentChatId,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    // enterMessage.value = "";
  } else {
    const error = await response.json();
    console.log(error.message);
  }
};

//  =================  RETRIEVE MESSAGES  =================
const retrieveMessages = async (currentChatId) => {
  let userEmail = localStorage.getItem("userEmail");

  // Form the fetch URL
  const fetchUrl = `http://localhost:5001/client/single-chat-message-retrieval/api/chats/${currentChatId}/messages`;

  // Make the fetch request
  const response = await fetch(fetchUrl);

  // Check if the response is ok
  if (response.ok) {
    const data = await response.json();

    console.log("Data:", data);

    // Check if data.messages is defined
    if (!data.messages) {
      console.error("data.messages is undefined", data);
      return;
    }

    const chatBoxDisplayMessageContainer = document.getElementById(
      "chatBoxDisplayMessageContainer"
    );

    // Clear the chatBoxDisplayMessageContainer
    chatBoxDisplayMessageContainer.innerHTML = "";

    // Process each message
    data.messages.forEach((message, index) => {
      let messageType;
      if (message.sender === userEmail) {
        messageType = "sender";
      } else {
        messageType = "receiver";
      }

      const container = document.createElement("div");
      container.className = messageType + "__container";

      // Create a text node with the message content
      const textNode = document.createTextNode(message.text); // Change this line

      // Append the text node to the container
      container.appendChild(textNode);

      // Append the container to the chatBoxDisplayMessageContainer
      chatBoxDisplayMessageContainer.appendChild(container);
    });

    // Scroll to the bottom of the chatBoxDisplayMessageContainer
    chatBoxDisplayMessageContainer.scrollTop =
      chatBoxDisplayMessageContainer.scrollHeight;
  } else {
    // If the response is not ok, log the error message
    const error = await response.json();
    console.log(error.message);
  }
};

window.onload = () => {
  clearInterval(messageRetrievalInterval);
  messageRetrievalInterval = setInterval(
    () => retrieveMessages(currentChatId),
    1000
  );
};

async function handleSendMessage(event) {
  event.preventDefault();
  await sendMessages(currentChatId);
  await retrieveMessages(currentChatId);

  clearInterval(messageRetrievalInterval);
  messageRetrievalInterval = setInterval(
    () => retrieveMessages(currentChatId),
    1000
  );
}

sendMessage.addEventListener("click", handleSendMessage);

enterMessage.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSendMessage(event);
    enterMessage.value = "";
  }
});

// =================== GROUP CHAT ===================

// ============== RETRIEVE USER EMAIL FOR GROUP CHAT ================

const userEmailCheckBoxMainContainer = document.getElementById(
  "userEmailCheckBoxMainContainer"
);

const retrieveUserChat = async () => {
  userEmailCheckBoxMainContainer.innerHTML = "";
  selectedUserEmail = [];
  const userEmail = localStorage.getItem("userEmail");

  if (!selectedUserEmail.includes(userEmail)) {
    selectedUserEmail.push(userEmail);
  }

  const response = await fetch(
    `http://localhost:5001/client/single-chat-retrieval/?userEmail=${userEmail}`
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

createGroup.addEventListener("click", async (event) => {
  await retrieveUserChat(event);
});

// ============  CREATE GROUP CHAT ============

const createGroupChat = async () => {
  const userEmail = localStorage.getItem("userEmail");
  const userGroupNameInput =
    document.getElementById("userGroupNameInput").value;

  const userSelectWarning = document.getElementById("userSelectWarning");
  const groupNameWarning = document.getElementById("groupNameWarning");

  // Client-side validation
  if (!userGroupNameInput.trim()) {
    groupNameWarning.style.display = "flex";
  } else if (userGroupNameInput.trim()) {
    groupNameWarning.style.display = "none";
  }

  if (selectedUserEmail.length <= 1) {
    userSelectWarning.style.display = "flex";
    return;
  } else {
    userSelectWarning.style.display = "none";
  }

  const users = selectedUserEmail.map((email) => ({
    email,
    role: email === userEmail ? "owner" : "member",
  }));

  const response = await fetch(
    "http://localhost:5001/client/group-study/group-chat-creation",
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
    alert(data.message);
    createGroupForm.style.display = "none";
  } else {
    const error = await response.json();
    console.log(error.message);
  }
};

createGroupButton.addEventListener("click", async (event) => {
  await createGroupChat(event);
});
