// Import the Express module
import express from "express";
import cors from "cors";
// import { invokeRetrievalChain } from "./langchainBot.js";

// Create an instance of Express
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: "POST,GET",
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Accept",
      "Origin",
      "User-Agent",
    ],
    credentials: true,
    // origin: /^.+localhost:(3000)$/,
  })
);

app.post("/message", async (req, res) => {
  try {
    const input = req.body.message;
    console.log("input", input);
    // const result = await submitUserInput(input);
    // console.log("result.answer", result.answer);
    res.status(200).json({ message: "Message received successfully" });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// async function submitUserInput(input) {
//   console.log("running");
//   const result = await invokeRetrievalChain(input);
//   console.log("result.answer", result.answer);
//   return result;
// }

// Start the server
const PORT = process.env.PORT || 3000; // Use the provided port or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
