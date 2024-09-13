import { useContext } from "react";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

import { AZURE_ENDPOINT, GITHUB_TOKEN, MODELS } from "../constants";
import { AppState } from "../../Hooks/utils";
import { createSseStream } from "@azure/core-sse";

const Footer = () => {
  const client = new ModelClient(
    AZURE_ENDPOINT,
    new AzureKeyCredential(GITHUB_TOKEN)
  );
  const {
    selectedModel,
    chatboxMessages,
    clientMessage: message,
    isLoading,
  } = useContext(AppState);

  const scrollChatBoxToBottom = () => {
    const chatboxElement = document.querySelector(".chatbox");
    chatboxElement.scrollTop = chatboxElement.scrollHeight;
  };

  const messageGithubModel = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    chatboxMessages.push({
      message: message.value,
      initiator: "client",
      time: new Date().toLocaleTimeString(),
    });
    setTimeout(() => scrollChatBoxToBottom(), 100);

    try {
      const response = await client
        .path("/chat/completions")
        .post({
          body: {
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: message.value },
            ],
            model: MODELS.find(
              ({ friendlyName }) => friendlyName === selectedModel.value
            ).originalName,
            stream: true,
          },
        })
        .asNodeStream();
      message.value = "";

      const stream = response.body;
      if (!stream) {
        throw new Error("The response stream is undefined");
      }

      if (response.status !== "200") {
        stream.destroy();
        throw response.body.error;
      }

      const sseStream = createSseStream(stream);

      chatboxMessages.push({
        message: "",
        initiator: "model",
        modelName: selectedModel.value,
        time: new Date().toLocaleTimeString(),
      });

      for await (const event of sseStream) {
        if (event.data === "[DONE]") {
          return;
        }
        for (const choice of JSON.parse(event.data).choices) {
          chatboxMessages[chatboxMessages.length - 1].message +=
            choice.delta?.content ?? "";
          setTimeout(() => scrollChatBoxToBottom(), 100);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const textAreaKeyDownEvent = (event) => {
    if (event.shiftKey && event.keyCode === 13) {
      () => {};
    } else if (event.keyCode === 13) {
      event.preventDefault();
      if (message.value.length) {
        messageGithubModel();
      }
    }
  };

  return (
    <div className="flex flex-col items-center py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700 space-y-2">
      <div className="w-1/2 relative gap-x-2">
        <textarea
          rows="1"
          className="textarea w-full textarea-bordered rounded-lg"
          placeholder={`Message ${selectedModel.value}`}
          value={message.value}
          onChange={(e) => (message.value = e.target.value)}
          onKeyDown={textAreaKeyDownEvent}
          disabled={isLoading.value}
        ></textarea>
        <button
          className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-full cursor-pointer text-blue-600"
          disabled={isLoading.value}
          onClick={messageGithubModel}
        >
          <svg
            className="w-6 h-6 rotate-90"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </div>
      <a href="https://www.flaticon.com/free-icons/phone" title="phone icons">
        Phone icons created by Freepik - Flaticon
      </a>
    </div>
  );
};

export default Footer;
