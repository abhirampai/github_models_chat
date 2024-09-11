import { useState } from "react";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import PropTypes from "prop-types";

const token = import.meta.env.VITE_GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "meta-llama-3-8b-instruct";

const Footer = ({ setChatboxMessages }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const client = new ModelClient(endpoint, new AzureKeyCredential(token));

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
          model: modelName,
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
      <div className="w-full flex gap-x-2">
        <textarea
          rows="1"
          className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={`Message ${modelName}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={textAreaKeyDownEvent}
          disabled={isLoading}
        ></textarea>
        <button
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
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
};

export default Footer;
