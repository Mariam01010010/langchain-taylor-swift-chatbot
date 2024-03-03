import express from "express";
import cors from "cors";
// import { messageTaylorBot } from "./langchainBot.js";
import {
  invokeRetrievalChain,
  invokeConversationalRetrievalChain,
} from "./langchainBot.js";

const app = express();
const port = 3000; // You can change this port number if needed

app.use(cors());
app.use(express.json());

// Define your API routes here
app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

// app.post("/message", async (req, res) => {
//   try {
//     console.log("req.body", req.body);
//     const input = req.body.message;
//     console.log("input", input);
//     const result = await submitUserInput(input);
//     console.log("result.answer", result.answer);
//     res
//       .status(200)
//       //   .json({ message: `Message received successfully ${result.answer}` });
//       .json({ botMessage: result.answer });
//   } catch (error) {
//     console.error("Error processing message:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/message", async (req, res) => {
  try {
    // console.log("req.body", req.body);
    /* works
    const input = req.body.message;
    const result = await submitUserInput(input);
    */
    const messageHistory = req.body.messageHistory;

    console.log("input messageHistory", messageHistory);
    const result = await submitUserInput(messageHistory);
    // console.log("result.answer", result.answer);
    res
      .status(200)
      //   .json({ message: `Message received successfully ${result.answer}` });
      //   .json({ botMessage: result.answer });
      .json({ botMessage: result.answer });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// async function submitUserInput(messageHistory) {
//   // input is messageHistory = []
//   let result = "";
//   if (messageHistory.lengeth === 0) {
//     result = "Ask me a question";
//   } else if (messageHistory.length === 1) {
//     result = await messageTaylorBot(messageHistory[0].text);
//   } else {
//     if (messageHistory.length % 2 === 1) {
//       const responseIndex = messageHistory.length - 2;
//       const messageIndex = messageHistory.length - 1;

//       const contextMessage = messageHistory[responseIndex].text;
//       const userMessage = messageHistory[messageIndex].text;
//       //   if(messageIndex < 0 || responseIndex)
//       result = await messageTaylorBot(contextMessage, userMessage);
//     }
//   }
//   //   const result = await invokeRetrievalChain(input);
//   console.log("result.answer in submitUserInput", result);
//   return result;
// }

async function submitUserInput(messageHistory) {
  // asking and logging the question
  let result = "";
  if (messageHistory.lengeth === 0) {
    result = "Ask me a question";
  } else if (messageHistory.length === 1) {
    result = await invokeRetrievalChain(messageHistory[0].text);
  } else {
    if (messageHistory.length % 2 === 1) {
      const questionIndex = messageHistory.length - 3;
      const responseIndex = messageHistory.length - 2;
      const followUpQuestionIndex = messageHistory.length - 1;

      const initialQuestion = messageHistory[questionIndex].text;
      const contextMessage = messageHistory[responseIndex].text;
      const followUpQuestion = messageHistory[followUpQuestionIndex].text;

      console.log({ initialQuestion, contextMessage, followUpQuestion });
      //   if(messageIndex < 0 || responseIndex)
      result = await invokeConversationalRetrievalChain(
        initialQuestion,
        contextMessage,
        followUpQuestion
      );
    }
  }

  return result;
}

// works
// async function submitUserInput(input) {
//   console.log("running");
//   const result = await invokeRetrievalChain(input);
//   console.log("result.answer in submitUserInput", result.answer);
//   return result;
// }

// Example API endpoint to handle POST requests
// app.post("/api/data", (req, res) => {
//   const data = req.body;
//   console.log("Received data from frontend:", data);
//   // You can process the received data here and send back a response if needed
//   res.json({ message: "Data received successfully!" });
// });

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
