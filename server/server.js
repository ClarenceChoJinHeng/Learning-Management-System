/* =========================== MODULES =========================== */

/* ========== CONNECTION MODULE ========== */
import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

/* ========== SECURITY MODULE ========== */
import bcrypt from "bcryptjs";

/* ========== ENVIRONMENT VARIABLES ========== */
dotenv.config();

/* ========== CONNECT EXPRESS, CORS ========== */
/* ========== MIDDLEWARE ========== */

const app = express(); // Initialize express
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Your multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "client/Image"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const validImagesTypes = ["Images/gif", "Images/jpeg", "Images/png"];
    if (validImagesTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only GIF, JPEG, and PNG are allowed."));
    }
  },
});
/* ========== EXTRACT KEYS FROM ENV FILE ========== */
const uri = process.env.MONGODB_KEY;

/* ========== CONNECT TO MONGODB ========== */
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function initializeMongoClient() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error Connecting To MongoDB: ", error);
  }
}

initializeMongoClient().catch(console.dir);

/* ========== GLOBAL VARIABLES FOR MONGODB DATABASE, COLLECTION  ========== */
const database = client.db("lms-management-system");
const userCollection = database.collection("Users");
const courseCollection = database.collection("Courses");
const Chat = database.collection("Chat");
const groupChat = database.collection("GroupChat");

/* ========== EXPRESS SIGNUP CONFIGURATION ========== */
app.post("/client/signup", async (req, res) => {
  try {
    // GET THE VALUES FROM THE CLIENT (JSON.stringify)
    const { username, email, password, role } = req.body;

    // VALIDATE FORM DATA
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Invalid form data" });
    } else if (role !== "user") {
      return res.status(400).json({ message: "Invalid role" });
    }
    // HASH THE PASSWORD BEFORE SAVING TO DATABASE
    const hashedPasword = await bcrypt.hash(password, 10);

    // CREATE UNIQUE INDEXES ON USERNAME AND EMAIL
    await userCollection.createIndex({ email: 1 }, { unique: true });

    // INSERT THE USER INTO THE DATABASE
    const insert = await userCollection.insertOne({
      username,
      email,
      password: hashedPasword,
      role,
    });

    // CHECK IF THE USER WAS INSERTED SUCCESSFULLY
    if (insert.acknowledged === true) {
      return res.status(200).json({ message: "User created successfully" });
    } else {
      res.status(500).json({ error: "Failed to insert data" });
    }
  } catch (error) {
    console.error("Error handling form submission:", error);

    // CHECK IF THE ERROR IS A DUPLICATE KEY ERROR IN OTHER TERMS TO CHECK IF THE USER ALREADY EXISTS
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      console.error("Error handling form submission:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
});

// ================ LOGIN VALIDATION ==================

app.post("/client/login", async (req, res) => {
  try {
    // RETRIEVE THE DATA FROM THE DATABASE
    const user = await client
      .db("lms-management-system")
      .collection("Users")
      .findOne({ email: req.body.email });

    if (user) {
      // COMPARE THE PASSWORD WITH STORED PASSWORD BY DECRYPTING THE STORED PASSWORD
      const passwordMatches = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (passwordMatches) {
        // EXTRACT THE USERNAME FROM THE DATABASE
        const username = user.username;

        // PASSWORD IS CORRECT
        return res
          .status(200)
          .json({ message: "Password Match", username: username });
      } else {
        // PASSWORD IS INCORRECT
        res.status(401).json({ error: "Failed to insert data" });
      }
    } else {
      // User not found
      res.status(404).send("User does not exist");
    }
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// ================ CREATE CLASS VALIDATION ==================

app.post("/client/lms-home", async (req, res) => {
  try {
    // GET THE VALUES FROM THE CLIENT (JSON.stringify)
    const { className, lecturerName, classSubject, classRoom, userEmail } =
      req.body;

    if (
      !className ||
      !lecturerName ||
      !classSubject ||
      !classRoom ||
      !userEmail
    ) {
      return res.status(400).json({ message: "Invalid form data" });
    }

    // INSERT DATA INTO THE DATABASE
    const insert = await courseCollection.insertOne({
      className,
      lecturerName,
      classSubject,
      classRoom,
      userEmail,
    });

    if (insert.acknowledged === true) {
      return res.status(200).json({ message: "Class Created Succesfully" });
    } else {
      res.status(500).json({ error: "Failed to insert data" });
    }
  } catch (error) {
    console.error("Error handling form submission:", error);

    // CHECK IF THE ERROR IS A DUPLICATE KEY ERROR IN OTHER TERMS TO CHECK IF THE USER ALREADY EXISTS
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      console.error("Error handling form submission:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
});

// ================ RETRIEVE CLASS VALIDATION ==================
app.get("/client/lms-home", async (req, res) => {
  try {
    const userEmail = req.query.userEmail; // Get the userEmail from the query parameters
    if (!userEmail) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const courses = await courseCollection.find({ userEmail }).toArray(); // Filter courses by userEmail
    return res.status(200).json({ courses });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// ================ DELETE CLASS VALIDATION ==================

app.delete("/client/lms/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await courseCollection.deleteOne({
      _id: new ObjectId(courseId),
    });
    if (result.deletedCount === 1) {
      res.json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================ CREATE CHAT VALIDATION ==================
app.post("/client/group-study", async (req, res) => {
  try {
    const {
      senderName,
      senderUserEmail,
      receiverNameInput,
      receiverEmailInput,
    } = req.body;

    if (
      !senderName ||
      !senderUserEmail ||
      !receiverNameInput ||
      !receiverEmailInput
    ) {
      return res.status(400).json({ message: "Invalid form data" });
    }

    // Check if userEmailInput exists in the userCollection
    const user = await userCollection.findOne({ email: receiverEmailInput });

    if (!user) {
      return res
        .status(400)
        .json({ message: `User ${receiverEmailInput} does not exist` });
    }

    // Check if userEmailInput already exists in the Chat collection
    const chatUser = await Chat.findOne({
      senderUserEmail,
      receiverEmailInput,
    });

    if (chatUser) {
      return res.status(400).json({
        message: `User with email ${receiverEmailInput} already exists in the chat`,
      });
    }

    const insert = await Chat.insertOne({
      senderName,
      senderUserEmail,
      receiverNameInput,
      receiverEmailInput,
      messages: [], // Initialize messages as an empty array
    });

    if (insert.acknowledged === true) {
      return res
        .status(200)
        .json({ message: `Succesfully Added ${receiverEmailInput}` });
    } else {
      res.status(500).json({ error: `Failed to add ${receiverEmailInput}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================ RETRIEVE THE CHAT ACCOUNT FROM DATABASE ================
app.get("/client/group-study", async (req, res) => {
  try {
    const { userEmail } = req.query;

    // FILTER COURSE BASE ON EMAIL
    const userChat = await client
      .db("lms-management-system")
      .collection("Chat")
      .find({
        $or: [
          { senderUserEmail: userEmail },
          { receiverEmailInput: userEmail },
        ],
      })
      .toArray();

    if (!userChat || userChat.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    return res.status(200).json({ userChat: userChat });
  } catch (error) {
    console.error("Error retrieving user account:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// ================= SEND MESSAGES =================

app.put("/client/group-study", async (req, res) => {
  try {
    const { message, currentChatId } = req.body;

    if (!currentChatId || !message) {
      return res.status(400).json({ message: "Invalid request" });
    }

    let objectId;
    try {
      objectId = new ObjectId(currentChatId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const insert = await Chat.updateOne(
      { _id: objectId },
      {
        $push: {
          messages: message,
        },
      },
      { upsert: true }
    );

    console.log("Update result:", insert);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
});
// ================ RETRIEVE THE MESSAGES FROM A SPECIFIC CHAT ================
app.get("/client/group-study/api/chats/:chatId/messages", async (req, res) => {
  try {
    const { chatId } = req.params;

    // Fetch the chat from the database
    const chat = await client
      .db("lms-management-system")
      .collection("Chat")
      .findOne({ _id: new ObjectId(chatId) });

    // If the chat doesn't exist, return a 404 error
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // If the chat exists, return the messages
    return res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// ================ CREATE THE GROUP CHAT AND INSERT INTO DATABASE ================

app.post("/client/group-study/group-chat", async (req, res) => {
  try {
    const { userGroupNameInput, users } = req.body;

    if (!userGroupNameInput || !users) {
      return res.status(400).json({ message: "Invalid form data" });
    }

    // Loop through selectedUserEmail array and check if each user exists
    for (let user of users) {
      const { email } = user;
      const userInDb = await userCollection.findOne({ email: email });

      if (!userInDb) {
        return res
          .status(400)
          .json({ message: `User ${email} does not exist` });
      }
    }

    const insert = await Chat.insertOne({
      groupName: userGroupNameInput,
      emails: users,
      messages: [], // Initialize messages as an empty array
    });

    if (insert) {
      return res
        .status(200)
        .json({ message: "Group Chat Created Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to create group chat" });
  }
});

// ================ RETRIEVE THE GROUP CHAT AND DISPLAY ================

app.get("/client/group-study/group-chat-retrieval", async (req, res) => {
  try {
    const { userEmail } = req.query;

    // FILTER COURSE BASE ON EMAIL
    const userChat = await client
      .db("lms-management-system")
      .collection("Chat")
      .find({ emails: { $elemMatch: { email: userEmail } } })
      .toArray();

    if (!userChat || userChat.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    return res.status(200).json({ userChat: userChat });
  } catch (error) {
    console.error("Error retrieving user account:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// ================ UPLOAD PROFILE PICTURE ================
app.put(
  "/client/profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const profilePicture = req.file;
      const userEmail = req.body.userEmail;

      console.log(req.file);

      if (!profilePicture) {
        return res.status(400).json({ message: "Invalid form data" });
      }

      const update = await userCollection.updateOne(
        { email: userEmail },
        {
          $set: {
            profilePicture: profilePicture.path,
            profilePictureType: profilePicture.mimetype,
          },
        } // Use $set instead of $push
      );

      console.log(update);

      if (update.result.nModified === 1) {
        // Check nModified instead of n
        return res.status(200).json({ message: "Profile Picture Uploaded" });
      } else {
        return res
          .status(400)
          .json({ message: "Failed to update profile picture" });
      }
    } catch (error) {
      console.error(error); // Log the error
      return res.status(500).json({ error: error.message }); // Send a response in case of error
    }
  }
);
// ================ SERVER LISTENING PORT ==================
app.listen(5001, () => console.log("Server started on http://localhost:5001"));

app.use((req, res) => {
  res.status(404).send({ error: `Not found: ${req.method} ${req.url}` });
});
// METHODS TO SEND BACK TO CLIENT
// res.json({ message: "Signup route" });
// res.status(200).json({ message: "Signup route" });
// res.send("Signup route");
