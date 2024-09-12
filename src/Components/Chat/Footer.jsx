import { useState } from "react";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import PropTypes from "prop-types";
import { AZURE_ENDPOINT, GITHUB_TOKEN, MODELS } from "../constants";

const Footer = ({ setChatboxMessages, selectedModel }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const client = new ModelClient(AZURE_ENDPOINT, new AzureKeyCredential(GITHUB_TOKEN));

  const scrollChatBoxToBottom = () => {
    const chatboxElement = document.querySelector(".chatbox");
    chatboxElement.scrollTop = chatboxElement.scrollHeight;
  };

  const messageGithubModel = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setChatboxMessages((clientMessages) => [
      ...clientMessages,
      {
        message: message,
        initiator: "client",
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setMessage("");

    setTimeout(() => scrollChatBoxToBottom(), 100);

    try {
      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
          ],
          model: MODELS.find(
            ({ friendlyName }) => friendlyName === selectedModel
          ).originalName,
          temperature: 1,
          max_tokens: 1000,
          top_p: 1,
        },
      });

      if (response.status !== "200") {
        throw response.body.error;
      }

      setChatboxMessages((chatbotMessages) => [
        ...chatbotMessages,
        {
          message: response.body.choices[0].message.content,
          initiator: "model",
          modelName: selectedModel,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setTimeout(() => scrollChatBoxToBottom(), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const textAreaKeyDownEvent = (event) => {
    if (event.shiftKey && event.keyCode === 13) {
      () => {};
    } else if (event.keyCode === 13) {
      event.preventDefault();
      if (message.length) {
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
          placeholder={`Message ${selectedModel}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={textAreaKeyDownEvent}
          disabled={isLoading}
        ></textarea>
        <button
          className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-full cursor-pointer text-blue-600"
          disabled={isLoading}
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
    </div>
  );
};

Footer.propTypes = {
  setChatboxMessages: PropTypes.func.isRequired,
  selectedModel: PropTypes.string.isRequired,
};

export default Footer;
