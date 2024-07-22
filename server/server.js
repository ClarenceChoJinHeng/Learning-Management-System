/* =========================== MODULES =========================== */

/* ========== CONNECTION MODULE ========== */
import express from "express";
import { GridFSBucket, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import formidable from "formidable";

/* ========== SECURITY MODULE ========== */
import bcrypt from "bcryptjs";

/* ========== ENVIRONMENT VARIABLES ========== */
dotenv.config();

/* ========== CONNECT EXPRESS, CORS ========== */
/* ========== MIDDLEWARE ========== */

const app = express(); // Initialize express
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

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

let db, bucket;

async function initializeMongoClient() {
  try {
    await client.connect();
    db = client.db("lms-management-system");
    bucket = new GridFSBucket(db, { bucketName: "uploads" });
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
const calendarCollection = database.collection("Calendar");
const uploadFiles = database.collection("uploads.files");
const uploadChunks = database.collection("uploads.chunks");

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
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE UNIQUE INDEXES ON USERNAME AND EMAIL
    await userCollection.createIndex({ email: 1 }, { unique: true });

    // INSERT THE USER INTO THE DATABASE
    const insert = await userCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      role,
      profilePicture: "",
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
    const {
      className,
      lecturerName,
      classSubject,
      classRoom,
      userEmail,
      students,
      courseNotes,
      courseFolder,
    } = req.body;

    if (
      !className ||
      !lecturerName ||
      !classSubject ||
      !classRoom ||
      !userEmail ||
      !students ||
      !courseNotes ||
      !courseFolder
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
      students: " ",
      courseNotes,
      courseFolder,
      git,
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

// ================ CREATE SINGLE CHAT VALIDATION ==================
app.post("/client/single-chat-creation", async (req, res) => {
  try {
    const { senderName, receiverName, emails, receiverEmail, senderEmail } =
      req.body;

    if (
      !senderName ||
      !receiverName ||
      !emails ||
      !receiverEmail ||
      !senderEmail
    ) {
      return res.status(400).json({ message: "Invalid form data" });
    }

    let errors = [];

    for (let emailObject of emails) {
      const { email } = emailObject;
      const user = await userCollection.findOne({ email: email });

      // ============== CHECK FOR USER'S EXISTENCE IN THE DATABASE ==============

      if (!user) {
        return res
          .status(400)
          .json({ message: `User ${email} does not exist` });
        continue;
      }

      // ============== CHECK FOR USER'S EXISTENCE IN THE CHAT ==============
      const chatUser = await Chat.findOne({
        "emails.email": receiverEmail,
      });

      if (chatUser) {
        errors.push(`User with email ${email} already exists in the chat`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const insert = await Chat.insertOne({
      senderName,
      receiverName,
      emails,
      messages: [], // Initialize messages as an empty array
    });

    if (insert.acknowledged === true) {
      return res
        .status(200)
        .json({ message: `Succesfully Added ${receiverEmail}` });
    } else {
      res.status(500).json({ error: `Failed to add ${receiverEmail}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================ RETRIEVE THE CHAT ACCOUNT FROM DATABASE ================
app.get("/client/chat-retrieval", async (req, res) => {
  try {
    const { userEmail } = req.query;

    // FILTER COURSE BASE ON EMAIL
    const userChat = await Chat.find({
      "emails.email": userEmail,
    }).toArray();

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

app.put("/client/single-chat-send-message", async (req, res) => {
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
app.get(
  "/client/single-chat-message-retrieval/api/chats/:chatId/messages",
  async (req, res) => {
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
  }
);

// ================ CREATE THE GROUP CHAT AND INSERT INTO DATABASE ================

app.post("/client/group-study/group-chat-creation", async (req, res) => {
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

// app.get("/client/group-chat-retrieval", async (req, res) => {
//   try {
//     const { userEmail } = req.query;

//     // FILTER CHAT BASE ON //     const chats = await client
//       .db("lms-management-system")
//       .collection("Chat")
//       .find({
//         $or: [
//           { emails: { $elemMatch: { email: userEmail } } },
//           { senderUserEmail: userEmail },
//           { receiverEmailInput: userEmail },
//         ],
//       })
//       .toArray();

//     if (!chats || chats.length === 0) {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     return res.status(200).json({ chats: chats });
//   } catch (error) {
//     console.error("Error retrieving user account:", error);
//     return res.status(500).send({ error: "Internal Server Error" });
//   }
// });

// ================ UPLOAD PROFILE PICTURE ================
app.post("/client/profile-picture", async (req, res) => {
  try {
    const form = formidable({});

    // PARSE THE FORM DATA
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // EXTRACT THE USERNAME AND THE IMAGE FROM THE FORM DATA
      const imageFilePath = files.image[0].filepath;
      const username = fields.username[0];
      const imageFileName = files.image[0].originalFilename;
      const imageFileType = files.image[0].mimetype;

      // CHECKS IF THE FILE IS AN IMAGE
      if (!imageFileType.startsWith("image")) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      // FIND THE USER IN THE DATABASE
      const user = await userCollection.findOne({ username });

      // IF THE USER IS NOT FOUND
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // UPLOAD THE IMAGE TO THE DATABASE
      const writestream = bucket.openUploadStream(imageFileName, {
        chunkSizeBytes: 1048576,
        contentType: imageFileType,
      });

      // READSTREAM
      const readstream = fs.createReadStream(imageFilePath);

      readstream.pipe(writestream);

      writestream.on("error", (error) => {
        console.error("Error uploading image:", error);
        return res.status(500).json({ message: error.message });
      });

      writestream.on("finish", async () => {
        // UPDATE THE USER COLLECTION WITH NEW IMAGE
        if (user) {
          await userCollection.updateOne(
            { _id: user._id },
            { $set: { profilePicture: imageFileName } }
          );
        }
      });

      // EXTRACT THE profilePicture FIELD FROM USER COLLECTION
      const profilePictureFromUsersCollection = user.profilePicture;

      if (profilePictureFromUsersCollection) {
        // EXTRACT THE FILENAME FROM THE UPLOAD.FILES COLLECTION
        const imageFileNameFromDB = await uploadFiles.findOne({
          filename: profilePictureFromUsersCollection,
        });

        // EXTRACT THE profilePicture FIELD FROM UPLOAD.FILES COLLECTION
        if (imageFileNameFromDB) {
          const profilePictureFromUploadCollection =
            imageFileNameFromDB.filename;

          // COMPARE THE BOTH COLLECTIONS
          if (
            profilePictureFromUsersCollection ===
            profilePictureFromUploadCollection
          ) {
            // EXTRACT THE _ID FROM THE UPLOAD.FILES COLLECTION
            const id = imageFileNameFromDB._id;

            // FIND ALL THE CHUNKS USING THE ID ABOVE
            await uploadChunks.find({ files_id: id }).toArray();

            // DELETE ALL THE CHUNKS THAT MATCHES THE ID
            await uploadFiles.deleteOne({ _id: id });
            await uploadChunks.deleteMany({ files_id: id });
          }
        }
      }

      res.status(200).json({
        message: "Image uploaded successfully",
        file: imageFileName,
      });
    });
  } catch (error) {
    console.error(error); // Log the error
    return res.status(500).json({ error: error.message }); // Send a response in case of error
  }
});

app.get("/image/:file", async (req, res) => {
  try {
    const file = req.params.file;
    const files = await bucket.find({ filename: file }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    if (
      files[0].contentType === "image/jpeg" ||
      files[0].contentType === "image/png"
    ) {
      res.set("Content-Type", files[0].contentType);
      const readstream = bucket.openDownloadStreamByName(file);

      readstream.pipe(res);
    } else {
      console.error("Not an image:", files[0].contentType);
      res.status(404).json({ error: "Not an image" });
    }
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).send("Error retrieving image");
  }
});

// ================ RETRIEVE PROFILE PICTURE ================ //
app.post("/client/retrieveProfilePicture", async (req, res) => {
  try {
    const username = req.body.username;

    const user = await userCollection.findOne({ username });
    const profilePicture = user.profilePicture;

    if (profilePicture) {
      const findImage = await uploadFiles.findOne({
        filename: profilePicture,
      });
      const imageFileName = findImage.filename;

      if (profilePicture === imageFileName) {
        const files = await bucket.find({ filename: imageFileName }).toArray();

        if (!files || files.length === 0) {
          return res.status(404).json({ error: "File not found" });
        }

        if (
          files[0].contentType === "image/jpeg" ||
          files[0].contentType === "image/png"
        ) {
          res.set("Content-Type", files[0].contentType);
          const readstream = bucket.openDownloadStreamByName(imageFileName);
          readstream.pipe(res);
        } else {
          res.status(404).json({ error: "Not an image" });
        }
      }
    }
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).send("Error retrieving image");
  }
});

// ================== CREATING NOTES FOR COURSES ==================

app.put("/client/lms-notes", async (req, res) => {
  try {
    const { currentCourseId, courseNotes } = req.body;

    let objectId;
    try {
      // @ts-expect-error
      objectId = new ObjectId(currentCourseId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const update = await courseCollection.findOneAndUpdate(
      { _id: objectId },
      { $push: { courseNotes: { _id: new ObjectId(), ...courseNotes } } },
      { returnOriginal: false }
    );

    if (update) {
      res.status(200).json({ message: "Course notes updated successfully." });
    } else {
      res.status(404).json({ message: "Course not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err });
  }
});

// ================== RETRIEVE NOTES FOR COURSES ==================
app.get("/client/lms-retrieve-notes", async (req, res) => {
  try {
    const { currentCourseId } = req.query;

    let objectId;
    try {
      // @ts-expect-error
      objectId = new ObjectId(currentCourseId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const course = await courseCollection.findOne({ _id: objectId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Retrieve Folder and File together
    const courseFolder = course.courseFolder; // Array of folders
    const courseNotes = course.courseNotes; // Array of notes

    // Map courseFolder and courseNotes to get the folder and file
    const folder = courseFolder.map((folder) => {
      const notes = courseNotes.filter(
        (note) => note.folderId === folder._id.toString()
      );
      return { ...folder, notes };
    });

    // Find files that are not inside the folder
    const notesWithoutFolder = courseNotes.filter((note) => !note.folderId);

    return res.status(200).json({ courseFolder: folder, notesWithoutFolder });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
});

// ================== CREATING FOLDER FOR COURSES ==================

app.put("/client/lms-notes-folder", async (req, res) => {
  try {
    const { currentCourseId, courseFolder } = req.body;

    let objectId;
    try {
      // @ts-expect-error
      objectId = new ObjectId(currentCourseId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const update = await courseCollection.findOneAndUpdate(
      { _id: objectId },
      { $push: { courseFolder: { _id: new ObjectId(), ...courseFolder } } },
      { returnOriginal: false }
    );

    if (update) {
      res.status(200).json({ message: "Course notes updated successfully." });
    } else {
      res.status(404).json({ message: "Course not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err });
  }
});

// ==================== RETRIEVE COURSE NOTES FOR DISPLAY ====================
app.get("/client/lms-retrieve-notes-folder", async (req, res) => {
  try {
    // Retrieve data from client (id)
    let objectId = req.query.currentCourseId;

    if (
      !objectId ||
      objectId.length !== 24 ||
      !/^[0-9a-fA-F]+$/.test(objectId)
    ) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const course = await courseCollection.findOne({
      _id: new ObjectId(objectId),
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Retrieve Folder and File together
    const courseFolder = course.courseFolder; // Array of folders
    const courseNotes = course.courseNotes; // Array of notes

    // Map courseFolder and courseNotes to get the folder and file
    const folder = courseFolder.map((folder) => {
      const notes = courseNotes.filter(
        (note) => note.folderId === folder._id.toString()
      );
      return { ...folder, notes };
    });

    // Find files that are not inside the folder
    const notesWithoutFolder = courseNotes.filter((note) => !note.folderId);

    return res.status(200).json({ courseFolder: folder, notesWithoutFolder });
  } catch (err) {
    return res.status(500).json({ message: "An error occured", err });
  }
});

// ================= RETRIEVE SPECIFIC NOTES FOR COURSES ==================

app.get("/client/lms-specific-retrieve-notes", async (req, res) => {
  try {
    const { clickedNoteId } = req.query;
    console.log(clickedNoteId); // Add this line

    if (
      !clickedNoteId ||
      clickedNoteId.length !== 24 ||
      !/^[0-9a-fA-F]+$/.test(clickedNoteId)
    ) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    let objectId;
    try {
      // @ts-expect-error
      objectId = new ObjectId(clickedNoteId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const course = await courseCollection.findOne({
      courseNotes: { $elemMatch: { _id: new ObjectId(clickedNoteId) } },
    });
    if (course) {
      return res.status(200).json({ courseNotes: course.courseNotes });
    } else {
      return res.status(404).json({ message: "Course not found." });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
});

// ================== UPDATING THE NOTES TITLE ==================
app.put("/client/lms-update-notes-page-title", async (req, res) => {
  try {
    const { clickedNoteId, notePageTitle } = req.body;

    let objectId;
    try {
      // @ts-expect-error
      objectId = new ObjectId(clickedNoteId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const update = await courseCollection.updateOne(
      { "courseNotes._id": objectId },
      {
        $set: {
          "courseNotes.$.notePageTitle": notePageTitle,
        },
      },
      { upsert: true }
    );

    if (update.matchedCount > 0) {
      res.status(200).json({ message: "Course notes updated successfully." });
    } else {
      res.status(404).json({ message: "Course not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err });
  }
});

// ================== UPDATING THE NOTES DATA ==================

app.put("/client/lms-update-notes", async (req, res) => {
  try {
    const { clickedNoteId, noteContent } = req.body;

    let objectId;
    try {
      // @ts-expect-error
      objectId = new ObjectId(clickedNoteId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const update = await courseCollection.updateOne(
      { "courseNotes._id": objectId },
      {
        $set: {
          "courseNotes.$.noteContent": noteContent,
        },
      },
      { upsert: true }
    );

    if (update.matchedCount > 0) {
      res.status(200).json({ message: "Course notes updated successfully." });
    } else {
      res.status(404).json({ message: "Course not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err });
  }
});

// ================== UPDATING THE NOTES TITLE ==================
app.put("/client/lms-update-notes-title", async (req, res) => {
  try {
    const { clickedNoteId, noteTitleNameSecond } = req.body;

    let objectId;
    try {
      // @ts-expect-error
      objectId = new ObjectId(clickedNoteId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const update = await courseCollection.updateOne(
      { "courseNotes._id": objectId },
      {
        $set: {
          "courseNotes.$.noteTitle": noteTitleNameSecond,
        },
      },
      { upsert: true }
    );

    if (update.matchedCount > 0) {
      res.status(200).json({ message: "Course notes updated successfully." });
    } else {
      res.status(404).json({ message: "Course not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err });
  }
});

// ================== SENDING CALENDAR DATA TO THE DATABASE ==================
app.post("/client/calendar", async (req, res) => {
  try {
    const { userEmail, newEvent } = req.body;

    // VALIDATION
    if (!userEmail || !newEvent) {
      return res.status(400).json({ message: "Invalid form data" });
    }

    // INSERT DATA INTO THE DATABASE
    const insert = await calendarCollection.insertOne({
      userEmail,
      newEvent,
    });

    if (insert.acknowledged === true) {
      return res.status(200).json({ message: "Event Created Successfully" });
    } else {
      res.status(500).json({ error: "Failed to insert data" });
    }
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ================== RETRIEVE CALENDAR DATA FROM THE DATABASE ==================

app.get("/client/retrieve-calendar", async (req, res) => {
  try {
    const { userEmail } = req.query;

    const retrieveCalendar = await calendarCollection
      .find({ userEmail: userEmail })
      .toArray();

    if (retrieveCalendar.length > 0) {
      // Map the array of documents to an array of newEvent objects
      const events = retrieveCalendar.map((doc) => doc.newEvent);
      return res.status(200).json({ retrieveCalendar: events });
    } else {
      return res.status(404).json({ message: "No event found" });
    }
  } catch (error) {
    console.error("Error retrieving calendar:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ================ SERVER LISTENING PORT ==================
app.listen(5001, () => console.log("Server started on http://localhost:5001"));

app.use((req, res) => {
  res.status(404).send({ error: `Not found: ${req.method} ${req.url}` });
});
// METHODS TO SEND BACK TO CLIENT
// res.json({ message: "Signup route" });
// res.status(200).json({ message: "Signup route" });
// res.send("Signup route");
