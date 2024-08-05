let selectedUserEmail = []; // Array to store the selected user emails
let currentChatId = "";
let messageRetrievalInterval;

// ============  EXPORTING ID INTO VARIABLE ============
const triggerAddUser = document.getElementById("triggerAddUser");
const addUserContainer = document.getElementById("addUserContainer");
const addUser = document.getElementById("addUser");
const createGroup = document.getElementById("createGroup");
const createGroupButton = document.getElementById("createGroupButton");
const cancelGroupButton = document.getElementById("cancelGroupButton");
const addUserForm = document.getElementById("addUserForm");
const createGroupForm = document.getElementById("createGroupForm");
const cancelUserButton = document.getElementById("cancelUserButton");
const receiverNameInput = document.getElementById("receiverNameInput");
const receiverEmailInput = document.getElementById("receiverEmailInput");
const userNameInput = document.getElementById("userNameInput");
const userEmailInput = document.getElementById("userEmailInput");
const userGroupNameInput = document.getElementById("userGroupNameInput");
// ============ RETRIEVE THE USER ACCOUNT DATABASE ============
const displayUserContainer = document.getElementById("displayUserContainer");
const addUserButton = document.getElementById("addUserButton");

const chatBoxNoUserContainer = document.getElementById(
  "chatBoxNoUserContainer"
);

const receiverNameLabel = document.getElementById("receiverName");

const userEmailCheckBoxMainContainer = document.getElementById(
  "userEmailCheckBoxMainContainer"
);

const successAddingSymbol = document.getElementById("successAddingSymbol");

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

const chatBoxDisplayMessageMainContainer = document.querySelector(
  ".chatbox__display__message__main__container"
);

// ============  TRIGGER ADD USER CONTAINER ============

triggerAddUser.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (
    addUserForm.style.display === "flex" ||
    acceptDeclineOverlayContainer.style.display === "flex" ||
    createGroupForm.style.display === "flex"
  ) {
    addUserForm.style.display = "none";
    createGroupForm.style.display = "none";
    acceptDeclineOverlayContainer.style.display = "none";
  } else if (
    addUserContainer.style.display === "none" ||
    addUserContainer.style.display === ""
  ) {
    addUserContainer.style.display = "flex";
    acceptDeclineOverlayContainer.style.display = "none";
  } else {
    addUserContainer.style.display = "none";
    acceptDeclineOverlayContainer.style.display = "none";
  }
});

// ============  TRIGGER ADD USER FORM ============
addUser.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  addUserContainer.style.display = "none";
  addUserForm.style.display = "flex";
  createGroupForm.style.display = "none";
  acceptDeclineOverlayContainer.style.display = "none";
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
  userGroupNameInput.value = "";
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
    userGroupNameInput.value = "";
    userNameInput.value = "";
    userEmailInput.value = "";
  }
});

const acceptDeclineOverlayContainer = document.getElementById(
  "acceptDeclineOverlayContainer"
);

const triggerAcceptDeclineContainer = document.getElementById(
  "triggerAcceptDeclineContainer"
);

// ============  TRIGGER ACCEPT DECLINE CONTAINER ============
triggerAcceptDeclineContainer.addEventListener("click", (event) => {
  event.stopPropagation();
  event.preventDefault();
  let computedDisplay = window.getComputedStyle(
    acceptDeclineOverlayContainer
  ).display;
  console.log("Clicked! Current display:", computedDisplay);

  if (computedDisplay === "none") {
    acceptDeclineOverlayContainer.style.display = "flex";
    addUserForm.style.display = "none";
    createGroupForm.style.display = "none";
  } else {
    acceptDeclineOverlayContainer.style.display = "none";
    addUserForm.style.display = "none";
    createGroupForm.style.display = "none";
  }
});

acceptDeclineOverlayContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", (event) => {
  if (!acceptDeclineOverlayContainer.contains(event.target)) {
    acceptDeclineOverlayContainer.style.display = "none";
  }
});
// ============= UPLOAD FILE FORM CONTAINER ===============
const uploadFileForm = document.getElementById("upload-file-form");
const addDocument = document.getElementById("addDocument");
const cancelFileUpload = document.getElementById("cancelFileUpload");
const uploadFile = document.getElementById("uploadFile");
const uploadInput = document.getElementById("upload-file");

addDocument.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  uploadFileForm.style.display = "flex";
});

cancelFileUpload.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  uploadFileForm.style.display = "none";
});

document.addEventListener("click", (event) => {
  if (!uploadFileForm.contains(event.target)) {
    uploadFileForm.style.display = "none";
  }
});

// ============ VALIDATE EMPTY FORM IN GROUP CHAT ===============

document.addEventListener("DOMContentLoaded", function () {
  // ================== TOASTIFY ==================
  const toastifyChatContainer = document.getElementById(
    "toastifyChatContainer"
  );
  const courseNotification = document.getElementById("courseChatNotification");

  const toastiyfyChatSuccess = () => {
    // courseNotification.textContent = "Chat Created Successfully";
    toastifyChatContainer.classList.add("active");
    setTimeout(() => {
      toastifyChatContainer.classList.remove("active");
    }, 2000);
  };

  // ============= SEND ADD FRIEND REQUEST TO NOTIFICATION ==============
  const sendAddFriendRequest = async (event) => {
    event.preventDefault();
    const senderEmail = localStorage.getItem("userEmail");
    const senderName = localStorage.getItem("username");
    const receiverEmail = document.getElementById("userEmailInput").value;
    const receiverName = document.getElementById("userNameInput").value;

    console.log(senderEmail, senderName, receiverEmail, receiverName);

    const senderEmailConfirmation = "";
    const receiverEmailConfirmation = "";
    const sender = { senderEmail, senderName, receiverEmailConfirmation };
    const receiver = { receiverEmail, receiverName, senderEmailConfirmation };
    const response = await fetch(
      "http://localhost:5001/client/friend-request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender,
          receiver,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      addUserForm.style.display = "none";
      successAddingSymbol.style.display = "none";
      courseNotification.innerHTML = `<i class='bx bxs-user-check' ></i>${data.message}`;
      toastiyfyChatSuccess();
      console.log(data.message);
    } else {
      const error = await response.json();
      addUserForm.style.display = "none";
      successAddingSymbol.style.display = "none";
      toastifyChatContainer.style.borderBottom = "5px solid red";
      courseNotification.innerHTML = `<i class='bx bxs-user-x'></i>${error.message}`;
      toastiyfyChatSuccess();
      console.log(error.message);
    }
  };

  const retrieveAddFriendRequest = async (event) => {
    // event.preventDefault();
    const userEmail = localStorage.getItem("userEmail");

    const response = await fetch(
      `http://localhost:5001/client/retrieve-friend-request/?userEmail=${userEmail}`
    );

    acceptDeclineOverlayContainer.innerHTML = "";

    if (response.ok) {
      const data = await response.json();
      // console.log(data.message);

      data.friendRequests.forEach((friendRequest) => {
        const senderName = friendRequest.sender.senderName;
        const senderEmail = friendRequest.sender.senderEmail;
        const receiverEmail = friendRequest.receiver.receiverEmail;
        const receiverName = friendRequest.receiver.receiverName;
        const _id = friendRequest._id;
        if (receiverEmail === userEmail) {
          const userProfileNameContainer = document.createElement("div");
          userProfileNameContainer.className = "user__profile__name__container";
          userProfileNameContainer.dataset.friendRequestId = _id;
          userProfileNameContainer.innerHTML = `


                      <!-- =========== USER PROFILE ============ -->
                      <div class="user__profile__picture">
                        <i class="bx bx-user-circle user__profile__picture"></i>
                      </div>

                      <!-- =========== USER INFO ============ -->
                      <div class="user__info__container">
                        <p class="user__profile__email">${senderEmail}</p>
                        <p class="user__profile__incoming__status"> Incoming Friend Request</p>
                      </div>

                      <!-- =========== ACCEPT OR DECLINE BUTTON ============ -->
                      <div class="accept__decline__button__container">
                        <i class="bx bx-check accept-request" id="accept-request" data-decline-request-id="${_id}"></i>
                        <i
                          class="bx bx-x decline-request"
                          id="delete-request"  data-decline-request-id=${_id}
                        ></i>
                      </div>
     
                    `;

          acceptDeclineOverlayContainer.appendChild(userProfileNameContainer);
          const acceptRequests = document.querySelectorAll("#accept-request");
          acceptRequests.forEach((acceptRequest) => {
            // Store the required data in the dataset of the acceptRequest element
            acceptRequest.dataset.senderEmail = senderEmail;
            acceptRequest.dataset.senderName = senderName;
            acceptRequest.dataset.receiverEmail = receiverEmail;
            acceptRequest.dataset.receiverName = receiverName;

            acceptRequest.addEventListener("click", async (event) => {
              event.stopPropagation();
              console.log("Accept Button is Clicked");

              setTimeout(async () => {
                // Retrieve the data from the dataset of the acceptRequest element
                const senderEmail = event.target.dataset.senderEmail;
                const senderName = event.target.dataset.senderName;
                const receiverEmail = event.target.dataset.receiverEmail;
                const receiverName = event.target.dataset.receiverName;
                const requestId = event.target.dataset.declineRequestId;
                // Call the submitForm function with the required data
                submitForm(
                  senderEmail,
                  senderName,
                  receiverEmail,
                  receiverName
                );

                await deleteRequest(requestId);
                await retrieveChatForm();
              }, 1000);
            });
          });

          const declineRequests = document.querySelectorAll("#delete-request");
          declineRequests.forEach((declineRequest) => {
            declineRequest.addEventListener("click", (event) => {
              event.stopPropagation();
              console.log("Decline Button is Clicked");

              setTimeout(() => {
                // event.preventDefault();
                console.log("Decline Button is Clicked");
                const requestId = event.target.dataset.declineRequestId;
                deleteRequest(requestId);
              }, 1000);
            });
          });
        } else if (senderEmail === userEmail) {
          const userProfileNameContainer = document.createElement("div");
          userProfileNameContainer.className = "user__profile__name__container";
          userProfileNameContainer.dataset.friendRequestId = _id;
          userProfileNameContainer.innerHTML = `
      
          <div class="user__profile__name__container">
          <!-- =========== USER PROFILE ============ -->
          <div class="user__profile__picture">
            <i class="bx bx-user-circle user__profile__picture"></i>
          </div>

          <!-- =========== USER INFO ============ -->
          <div class="user__info__container">
            <p class="user__profile__email">${receiverEmail}</p>
            <p class="user__profile__outgoing__status"> Outgoing Friend Request</p>
          </div>

          <!-- =========== ACCEPT OR DECLINE BUTTON ============ -->
          <div class="accept__decline__button__container">
            <i
              class="bx bx-x decline-request"
              id="delete-request" data-decline-request-id=${_id}
            ></i>
          </div>
        </div>
        `;

          acceptDeclineOverlayContainer.appendChild(userProfileNameContainer);

          const declineRequests = document.querySelectorAll("#delete-request");
          declineRequests.forEach((declineRequest) => {
            declineRequest.addEventListener("click", (event) => {
              event.stopPropagation();
              console.log("Decline Button is Clicked");

              setTimeout(() => {
                // event.preventDefault();
                console.log("Decline Button is Clicked");
                const requestId = event.target.dataset.declineRequestId;
                deleteRequest(requestId);
              }, 1000);
            });
          });
        }
      });
    } else {
      const error = await response.json();
      console.log(error.message);
    }
  };

  addUserButton.addEventListener("click", async (event) => {
    await sendAddFriendRequest(event);
    userEmailInput.value = "";
    userNameInput.value = "";
  });

  triggerAcceptDeclineContainer.addEventListener("click", async (event) => {
    await retrieveAddFriendRequest(event);
  });

  // ============  ACCEPT OR DECLINE FRIEND REQUEST ============
  const deleteRequest = async (requestId) => {
    const response = await fetch(
      `http://localhost:5001/client/decline-request/${requestId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Friend request deleted successfully");
      const requestDiv = document.querySelector(
        `div[data-friend-request-id="${requestId}"]`
      );
      requestDiv.remove();
      await retrieveAddFriendRequest();
      await retrieveChatForm();
      // successAddingSymbol.style.display = "none";
      // courseNotification.innerHTML = `<i class='bx bxs-user-check' ></i>${data.message}`;
      // toastiyfyChatSuccess();
    } else {
      const error = await response.json();
      courseNotification.textContent = error.message;
      successAddingSymbol.style.display = "none";
      toastifyChatContainer.style.borderBottom = "5px solid red";
      toastiyfyChatSuccess();
      console.log(error.message);
    }
  };

  // ============  ADD USER ACCOUNT ============
  const submitForm = async (
    senderEmail,
    senderName,
    receiverEmail,
    receiverName
  ) => {
    if (receiverEmail === senderEmail) {
      alert("You cannot add yourself to a chat");
      return;
    }

    const emails = [
      {
        email: senderEmail,
        role: "sender",
      },
      {
        email: receiverEmail,
        role: "receiver",
      },
    ];

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
          receiverName,
          emails,
          receiverEmail,
          senderEmail,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      courseNotification.textContent = data.message;
      toastiyfyChatSuccess();
      // alert(data.message);
      console.log(data.message);
      acceptDeclineOverlayContainer.style.display = "none";
      addUserForm.style.display = "none";
    } else {
      const error = await response.json();
      courseNotification.textContent = error.message;
      toastifyChatContainer.style.borderBottom = "5px solid red";
      toastiyfyChatSuccess();
      console.log(error.message);
      addUserForm.style.display = "none";
    }
  };

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
      courseNotification.textContent = data.message;
      toastiyfyChatSuccess();
      createGroupForm.style.display = "none";
    } else {
      const error = await response.json();
      console.log(error.message);
      courseNotification.textContent = error.message;
      toastifyChatContainer.style.borderBottom = "5px solid red";
      toastiyfyChatSuccess();
    }
  };

  // ============  RETRIEVE CHAT FORM ============
  const retrieveChatForm = async () => {
    let userEmail = localStorage.getItem("userEmail");

    const individualChatsResponse = await fetch(
      `http://localhost:5001/client/chat-retrieval/?userEmail=${userEmail}`
    );

    if (individualChatsResponse.ok) {
      const individualChatsData = await individualChatsResponse.json();

      // ============  CLEAN THE EXISTING CODE ============

      displayUserContainer.innerHTML = "";

      // ============  CREATE AN ARRAY TO STORE THE COURSE IDS ============
      let chatIDs = [];
      individualChatsData.userChat.forEach((chat) => {
        // ============  HOUR AND MINUTES ============

        const senderName = chat.senderName;
        const receiverName = chat.receiverName;
        const emails = chat.emails; // Array of emails
        const chatID = chat._id;
        const groupName = chat.groupName;
        const chatTime = chat.chatTime;

        let senderEmail, receiverEmail, singleRole;

        let ownerEmail, memberEmail, ownerRole, memberRole;

        chatIDs.push(chatID);
        console.log(senderName);

        emails.forEach((emailObj) => {
          if (emailObj.role === "sender") {
            senderEmail = emailObj.email;
            singleRole = emailObj.role;
          } else if (emailObj.role === "receiver") {
            receiverEmail = emailObj.email;
            singleRole = emailObj.role;
          }
        });

        emails.forEach((emailObj) => {
          if (emailObj.role === "owner") {
            ownerEmail = emailObj.email;
            ownerRole = emailObj.role;
          } else if (emailObj.role === "member") {
            memberEmail = emailObj.email;
            memberRole = emailObj.role;
          }
        });

        // Handle single chat case

        if (senderEmail === userEmail) {
          const chatDiv = document.createElement("div");
          chatDiv.className = "user__container";
          chatDiv.dataset.chatId = chat._id;
          chatDiv.innerHTML = `

            <div class="user__message__name__container">
            <div class="user__profile__picture">
              <i class="bx bx-user-circle user__profile__picture"></i>
            </div>
              <p class="user__message__name">${receiverName}</p>
            </div>

            <div class="user__message__time__container">
              <p class="time"></p>
            </div>
        `;

          displayUserContainer.appendChild(chatDiv);
          const chatDivTime = chatDiv.querySelector(".time");
          chatDivTime.innerHTML = chatTime;

          chatDiv.addEventListener("click", async (event) => {
            event.preventDefault();
            receiverNameLabel.innerHTML = receiverName;
            currentChatId = chat._id;
            sendMessage.dataset.chatId = chat._id;
            retrieveMessages(currentChatId);
            updateTime(currentChatId);
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

        if (receiverEmail === userEmail) {
          const chatDiv = document.createElement("div");
          chatDiv.className = "user__container";
          chatDiv.dataset.chatId = chat._id;
          chatDiv.innerHTML = `

            <div class="user__message__name__container">
            <div class="user__profile__picture">
              <i class="bx bx-user-circle user__profile__picture"></i>
            </div>
              <p class="user__message__name">${senderName}</p>
            </div>

            <div class="user__message__time__container">
              <p class="time"></p>
            </div>
        `;

          displayUserContainer.appendChild(chatDiv);
          const chatDivTime = chatDiv.querySelector(".time");
          chatDivTime.innerHTML = chatTime;

          chatDiv.addEventListener("click", async (event) => {
            event.preventDefault();
            receiverNameLabel.innerHTML = senderName;
            currentChatId = chat._id;

            sendMessage.dataset.chatId = chat._id;
            retrieveMessages(currentChatId);
            updateTime(currentChatId);
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

        if (ownerRole === "owner" && memberRole === "member") {
          console.log("Owner or member");
          const chatDiv = document.createElement("div");
          chatDiv.className = "user__container";
          chatDiv.dataset.chatId = chat._id;
          chatDiv.innerHTML = `

            <div class="user__message__name__container">
            <div class="user__profile__picture">
              <i class="bx bx-user-circle user__profile__picture"></i>
            </div>
              <p class="user__message__name">${groupName}</p>
            </div>

            <div class="user__message__time__container">
              <p class="time"></p>
            </div>
        `;

          displayUserContainer.appendChild(chatDiv);
          const chatDivTime = chatDiv.querySelector(".time");
          chatDivTime.innerHTML = chatTime;

          chatDiv.addEventListener("click", async (event) => {
            event.preventDefault();
            receiverNameLabel.innerHTML = groupName;
            currentChatId = chat._id;
            sendMessage.dataset.chatId = chat._id;
            retrieveMessages(currentChatId);
            updateTime(currentChatId);
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

        console.log(
          `Single chat sender email: ${senderEmail}, receiver email: ${receiverEmail}`
        );

        // ============ MAKING HTML AND APPLY DATA INTO IT `============
      });
    } else {
      const individualChatsError = await individualChatsResponse.json();
      console.log(individualChatsError.message);
    }
  };

  createGroupButton.addEventListener("click", async (event) => {
    await createGroupChat(event);
    await retrieveChatForm(event);
  });

  retrieveChatForm();
});

// ================= SEND MESSAGES =================
const enterMessage = document.getElementById("enterMessage");
const sendMessage = document.getElementById("sendMessage");
const sendMessages = async (currentChatId) => {
  let userEmail = localStorage.getItem("userEmail");
  let messageText = enterMessage.value;
  const now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  if (hour < 12) {
    hour = `${hour}:${minutes} AM`;
  } else if (hour > 12) {
    hour = `${hour - 12}:${minutes} PM`;
  }

  console.log(hour);
  // Prevent sending empty messages
  if (!messageText.trim()) {
    console.log("Cannot send an empty message");
    return;
  }

  const message = {
    sender: userEmail,
    text: messageText,
    time: hour,
    file: "",
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
    enterMessage.value = "";
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
        // ============ MESSAGE CONTAINER ============
        const container = document.createElement("div");
        container.className = messageType + "__container";
        // ============ MESSAGE ============
        const messages = document.createElement("p");
        messages.className = messageType + "__message";

        // ============ PROFILE PICTURE ============
        const firstNameIndex = message.sender.charAt(0);
        const profilePicture = document.createElement("div");
        profilePicture.className = messageType + "__profile__picture";
        profilePicture.innerHTML = `<p>${firstNameIndex}</p>`;

        // ============ DISPLAY USER TIME FOR MESSAGE ============
        const time = document.createElement("p");
        time.className = `${messageType}__time`;
        time.innerHTML = message.time;

        const messageTimeDiv = document.createElement("div");
        messageTimeDiv.className = "sender__time__div";

        // ============ DISPLAY USER EMAIL FOR PP ============

        // Create a text node with the message content
        const textNode = document.createTextNode(message.text); // Change this line
        messages.appendChild(textNode);
        messageTimeDiv.appendChild(messages);
        messageTimeDiv.appendChild(time);
        container.appendChild(messageTimeDiv);
        container.appendChild(profilePicture);

        chatDivTime = time;

        // Append the container to the chatBoxDisplayMessageContainer
        chatBoxDisplayMessageContainer.appendChild(container);
      } else {
        messageType = "receiver";
        // ============ MESSAGE CONTAINER ============
        const container = document.createElement("div");
        container.className = messageType + "__container";
        // ============ MESSAGE ============
        const messages = document.createElement("p");
        messages.className = messageType + "__message";

        // ============ PROFILE PICTURE ============
        const receiverFullEmail = message.sender;
        const firstNameIndex = message.sender.charAt(0);
        const receiverEmail = message.sender.split("@")[0];
        const profilePicture = document.createElement("div");
        profilePicture.className = messageType + "__profile__picture";
        profilePicture.innerHTML = `<p>${firstNameIndex}</p>`;

        // ============ DISPLAY USER TIME FOR MESSAGE ============
        const time = document.createElement("p");
        time.className = `${messageType}__time`;
        time.innerHTML = message.time;

        const messageTimeDiv = document.createElement("div");
        messageTimeDiv.className = "receiver__time__div";

        const messageTimeDivContainer = document.createElement("div");
        messageTimeDivContainer.className = "receiver__time__div__container";

        const receiverNameAndEmailDiv = document.createElement("div");
        receiverNameAndEmailDiv.className = "receiver__name__email__div";
        receiverNameAndEmailDiv.innerHTML = ` 
        <p class="receiver__name">${receiverEmail}</p>
     
        `;

        const userNameMessageDiv = document.createElement("div");
        userNameMessageDiv.className = "user__name__message__div";
        // const receiverName = document.createElement("p");
        // receiverName.className = "receiver__name";
        // receiverName.innerHTML = `<u>${receiverEmail}<u>`;

        // <div class="receiver__container">

        //   <div class="receiver__profile__picture">
        //     <p>h</p>
        //     </div>
        //   <div class="receiver__time__div">
        //     <p class="receiver__message">yes?</p>
        //     <p class="receiver__time">10:20 PM</p>
        //   </div>
        //   </div>

        // Create a text node with the message content
        const textNode = document.createTextNode(message.text); // Change this line
        messages.appendChild(textNode);
        container.appendChild(profilePicture);
        container.appendChild(messageTimeDivContainer);
        messageTimeDivContainer.appendChild(receiverNameAndEmailDiv);
        messageTimeDiv.appendChild(messages);
        messageTimeDiv.appendChild(time);
        messageTimeDivContainer.appendChild(messageTimeDiv);
        // container.appendChild(messageTimeDiv);

        profilePicture.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
        });

        // Append the container to the chatBoxDisplayMessageContainer
        chatBoxDisplayMessageContainer.appendChild(container);
      }
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
  // await updateTime(currentChatId);
  await sendMessages(currentChatId);
  await retrieveMessages(currentChatId);
  await updateTime(currentChatId);

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

// ================== UPDATE TIME ==================
const updateTime = async (currentChatId) => {
  // ================= UPDATE TIME FOR CHAT =================
  const now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  if (hour < 12) {
    hour = `${hour}:${minutes} AM`;
  } else if (hour > 12) {
    hour = `${hour - 12}:${minutes} PM`;
  }

  const response = await fetch(
    "http://localhost:5001/client/single-chat-update-time",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: hour,
        currentChatId,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
  } else {
    const error = await response.json();
    console.log(error.message);
  }
};

// ============== RETRIEVE USER EMAIL FOR GROUP CHAT ================

const retrieveUserChat = async () => {
  userEmailCheckBoxMainContainer.innerHTML = "";
  selectedUserEmail = [];
  const userEmail = localStorage.getItem("userEmail");

  if (!selectedUserEmail.includes(userEmail)) {
    selectedUserEmail.push(userEmail);
  }

  const response = await fetch(
    `http://localhost:5001/client/chat-retrieval/?userEmail=${userEmail}`
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data.userChat);

    // ============  CREATE AN ARRAY TO STORE THE COURSE IDS ============
    let chatIDs = [];

    data.userChat.forEach((chat) => {
      let senderEmail, receiverEmail;
      const chatID = chat._id;

      chat.emails.forEach((emailObj) => {
        if (emailObj.role === "sender") {
          senderEmail = emailObj.email;
        } else if (emailObj.role === "receiver") {
          receiverEmail = emailObj.email;
        }
      });

      chatIDs.push(chatID);

      // ============ MAKING HTML AND APPLY DATA INTO IT `============

      if (senderEmail === userEmail) {
        const emailDiv = document.createElement("div");
        emailDiv.className = "user__email__checkbox__container";
        emailDiv.dataset.chatId = chat._id;
        emailDiv.innerHTML = `
     
        <p class="user__email__contacts">
          ${receiverEmail}                          
        </p>

        <input
          type="checkbox"
          name="userEmail"
          id="userEmailSelect"
          value="${receiverEmail}"
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
      } else if (receiverEmail === userEmail) {
        const emailDiv = document.createElement("div");
        emailDiv.className = "user__email__checkbox__container";
        emailDiv.dataset.chatId = chat._id;
        emailDiv.innerHTML = `
     
        <p class="user__email__contacts">
          ${senderEmail}                          
        </p>

        <input
          type="checkbox"
          name="userEmail"
          id="userEmailSelect"
          value="${senderEmail}"
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

// ===================== RETRIEVE FILE FOR DISPLAY =====================
document.addEventListener("DOMContentLoaded", () => {
  // Get the form
  const uploadFileForm = document.getElementById("upload-file-form");

  if (uploadFileForm) {
    uploadFileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const file = uploadFileForm.querySelector('input[type="file"]').files[0];

      if (!file) {
        alert("Please select a file to upload");
        return;
      }

      const formData = new FormData(uploadFileForm);

      const username = localStorage.getItem("username");
      formData.append("username", username);

      // Assuming userEmail is the email of the user
      const userEmail = localStorage.getItem("userEmail");
      formData.append("userEmail", userEmail);

      formData.append("currentCourseId", currentCourseId);

      const response = await fetch("http://localhost:5001/client/file-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        pollForFile(data.file, 1000, 10).then(async (fileResponse) => {
          // Create a blob URL from the file response
          const fileBlob = await fileResponse.blob();
          console.log(fileBlob);
          const fileUrl = URL.createObjectURL(fileBlob);

          // uploadFile.addEventListener("click", (event) => {
          //   event.preventDefault();
          //   event.stopPropagation();
          //   uploadFileForm.style.display = "none";
          //   uploadInput.value = "";
          // });
        });
      } else {
        const data = await response.json();
        console.error(data);
      }
    });
  }
});

async function pollForFile(file, interval, maxAttempts) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Retrieve the file from the backend
    const fileResponse = await fetch(`http://localhost:5001/file/${file}`);

    if (fileResponse.ok) {
      console.log(fileResponse);
      return fileResponse;
    }

    // File not found, wait for the interval then try again
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("File not found after maximum attempts");
}
