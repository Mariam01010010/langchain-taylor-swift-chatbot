import express from "express";
import cors from "cors";
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

app.post("/message", async (req, res) => {
  try {
    const messageHistory = req.body.messageHistory;

    console.log("input messageHistory", messageHistory);
    const result = await submitUserInput(messageHistory);
    res.status(200).json({ botMessage: result.answer });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
