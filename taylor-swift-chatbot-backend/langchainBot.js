import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { articles } from "./data/data.js";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

// initialising API key
const articlesArray = Object.values(articles);
function configDotenv() {
  if (typeof process !== "undefined") {
    config();
  }
}
configDotenv();

// setting up chat model and initialising Cheerio with articles about Taylor Swift
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.VUE_APP_OPENAI_API_KEY,
});

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

import { HumanMessage, AIMessage } from "@langchain/core/messages";

const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

const historyAwareCombineDocsChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt: historyAwareRetrievalPrompt,
});

const conversationalRetrievalChain = await createRetrievalChain({
  retriever: historyAwareRetrieverChain,
  combineDocsChain: historyAwareCombineDocsChain,
});

// handling asking a question
export async function invokeRetrievalChain(input) {
  const result = await retrievalChain.invoke({
    input: input,
  });
  return result;
}

// handling asking a follow up question
export async function invokeConversationalRetrievalChain(
  question,
  messageContext,
  newQuestion
) {
  console.log({ messageContext, newQuestion });
  const conversationalResult = await conversationalRetrievalChain.invoke({
    chat_history: [new HumanMessage(question), new AIMessage(messageContext)],
    input: newQuestion,
  });
  return conversationalResult;
}

// questions
// const mood = "angry";
// const question = `I am in a ${mood} mood. Which Taylor Swift album should I listen to?`;
// const question = "Who is Taylor Swift?";
const question = "Who is Harry Styles?";
// const question = "Which is Taylor Swift's best album?";
// const question = "How many songs has Taylor Swift re-recorded in total?";

const result = await invokeRetrievalChain(question);
console.log(result.answer);

// asking a follow up question
// const newQuestion = "How many songs are on her album Red?";
// const newQuestion = "Tell me about her love life?";
// const newQuestion = "When did it come out?";

const conversationalResult = await invokeConversationalRetrievalChain(
  question,
  result.answer,
  newQuestion
);
console.log(conversationalResult.answer);

// const inputs = {};
