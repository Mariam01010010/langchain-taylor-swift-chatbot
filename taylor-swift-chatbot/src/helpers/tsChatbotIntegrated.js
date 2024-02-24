import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { articles } from "../data/data.js";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

const articlesArray = Object.values(articles);
function configDotenv() {
  if (typeof process !== "undefined") {
    config();
  }
}
configDotenv();

// const openaiApiKey = process.env.VUE_APP_OPENAI_API_KEY;

// const chatModel = new ChatOpenAI({});
// const openaiApiKey = process.env.VUE_APP_OPENAI_API_KEY;

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.VUE_APP_OPENAI_API_KEY,
});
// openAIApiKey: process.env.VUE_APP_OPENAI_API_KEY,

// const chatModel = new ChatOpenAI({
//   openAIApiKey: process.env.OPENAI_API_KEY,
// });

const loader = new CheerioWebBaseLoader(...articlesArray);
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter();
const splitDocs = await splitter.splitDocuments(docs);

const embeddings = new OpenAIEmbeddings();

const vectorstore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

// set up the chain that takes a q + retrieved docs + generates an answer

const prompt =
  ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {input}`);

const documentChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt,
});

// we want docs to first come from the retriever we set up
// bc for a given q, can use retriever to dynamically select the most relevant documents + pass those in

const retriever = vectorstore.asRetriever();

const retrievalChain = await createRetrievalChain({
  combineDocsChain: documentChain,
  retriever,
});

// can invoke this chain -> returns an object
// const result = await retrievalChain.invoke({
//   input: "who is Taylor Swift?",
// });

// response from the LLM is in the answer key
// console.log(result.answer);

export async function invokeRetrievalChain(input) {
  console.log("input", input);
  const result = await retrievalChain.invoke({
    input: input,
  });
  return result;
}
const result = await invokeRetrievalChain("Who is Taylor Swift?");
console.log(result.answer);

const historyAwarePrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
  ],
]);

const historyAwareRetrieverChain = await createHistoryAwareRetriever({
  llm: chatModel,
  retriever,
  rephrasePrompt: historyAwarePrompt,
});

// console.log("historyAwareRetrieverChain", historyAwareRetrieverChain);

// /// UNCOMMENT BELOW
// // Conversational Retrieval Chain: Part 2
// /*  Testing out this "history aware retriever"
//     out by creating a situation where the
//     user is asking a follow up question.
//     The LLM generates a new query,
//     combining the chat history with the follow up question
// */
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// const chatHistory = [
//   new HumanMessage("Who is Taylor Swift?"),
//   new AIMessage(
//     "Taylor Swift is an American singer-songwriter who is one of the world's best-selling musicians, known for her versatile artistry, songwriting, and entrepreneurship. She has achieved widespread fame and success in the music industry and popular culture."
//   ),
// ];

// const historyAwareResponse = await historyAwareRetrieverChain.invoke({
//   chat_history: chatHistory,
//   input: "What is her best album?",
// });

// console.log("historyAwareResponse", historyAwareResponse);

// Conversational Retrieval Chain: Part 3
/*  with this new retriever, we can create a new chain
    to continue the conversation with these retrieved
    documents in mind
*/
const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const historyAwareCombineDocsChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt: historyAwareRetrievalPrompt,
});

// import { createRetrievalChain } from "langchain/chains/retrieval";

const conversationalRetrievalChain = await createRetrievalChain({
  retriever: historyAwareRetrieverChain,
  combineDocsChain: historyAwareCombineDocsChain,
});

const result2 = await conversationalRetrievalChain.invoke({
  chat_history: [
    new HumanMessage("Who is Taylor Swift?"),
    new AIMessage(
      "Taylor Swift is an American singer-songwriter who is one of the world's best-selling musicians, known for her versatile artistry, songwriting, and entrepreneurship. She has achieved widespread fame and success in the music industry and popular culture."
    ),
  ],
  input: "How many songs are on her album Red?",
});

console.log(result2.answer);
