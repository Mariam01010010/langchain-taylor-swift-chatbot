/* CONVERSATIONAL RETRIEVAL Chain
For chat bots, need to be able to answer follow-up qs.
Can still use the createRetrievalChain function, but we need to change two things:

1.  The retrieval method should now not just work on the most recent input, 
    but rather should take the whole history into account.
2.  The final LLM chain should likewise take the whole history into account.
*/

// Conversational Retrieval Chain: Part 1
/*  updating retrieval: create a new chain. 
    this chain will take in the most recent input (input) 
    and the conversation history (chat_history) 
    and use an LLM to generate a search query.
*/

import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder } from "@langchain/core/prompts";

config();

const chatModel = new ChatOpenAI({});

const loader = new CheerioWebBaseLoader(
  "https://docs.smith.langchain.com/user_guide"
);
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter();
const splitDocs = await splitter.splitDocuments(docs);

const embeddings = new OpenAIEmbeddings();

const vectorstore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);
const retriever = vectorstore.asRetriever();

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

// Conversational Retrieval Chain: Part 2
/*  Testing out this "history aware retriever"
    out by creating a situation where the 
    user is asking a follow up question. 
    The LLM generates a new query, 
    combining the chat history with the follow up question
*/
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const chatHistory = [
  new HumanMessage("Can LangSmith help test my LLM applications?"),
  new AIMessage("Yes!"),
];

const historyAwareResponse = await historyAwareRetrieverChain.invoke({
  chat_history: chatHistory,
  input: "Tell me how!",
});

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

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const historyAwareCombineDocsChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt: historyAwareRetrievalPrompt,
});

import { createRetrievalChain } from "langchain/chains/retrieval";

const conversationalRetrievalChain = await createRetrievalChain({
  retriever: historyAwareRetrieverChain,
  combineDocsChain: historyAwareCombineDocsChain,
});

const result2 = await conversationalRetrievalChain.invoke({
  chat_history: [
    new HumanMessage("Can LangSmith help test my LLM applications?"),
    new AIMessage("Yes!"),
  ],
  input: "tell me how",
});

// console.log(result2.answer);

// AGENT
/* an agent - where the LLM decides what steps to take 
One of the first things to do when building an agent is to decide what tools it should have access to. 
For this example, we will give the agent access two tools:

1. The retriever we just created. This will let it easily answer questions about LangSmith
2. A search tool. This will let it easily answer questions that require up to date information.

*/

// Set up a tool for the retriever we just created:
import { createRetrieverTool } from "langchain/tools/retriever";

const retrieverTool = await createRetrieverTool(retriever, {
  name: "langsmith_search",
  description:
    "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
});
