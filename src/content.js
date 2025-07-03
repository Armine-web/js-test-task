import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

function parseMessagesFromChat(limit = 30) {
  const messageNodes = document.querySelectorAll('[class*="message"]');
  const messages = Array.from(messageNodes)
    .map((node) => node.innerText.trim())
    .filter(Boolean)
    .slice(-limit); 

  return messages.join("\n");
}

async function generateSummary(chatText) {
  const apiKey = localStorage.getItem("openai_api_key");

  if (!apiKey) {
    return "❗️API ключ не задан. Укажите его в настройках расширения.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Сделай краткое резюме следующего чата:\n\n${chatText}`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "❗️Ошибка генерации ответа";
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI:", error);
    return "❗️Ошибка при обращении к OpenAI API";
  }
}

async function injectExtension() {
  if (document.getElementById("telegram-extension-root")) {
    return;
  }

  const extensionContainer = document.createElement("div");
  extensionContainer.id = "telegram-extension-root";
  extensionContainer.style.position = "fixed";
  extensionContainer.style.top = "20px";
  extensionContainer.style.right = "20px";
  extensionContainer.style.zIndex = "10000";
  extensionContainer.style.fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  document.body.appendChild(extensionContainer);

  const root = ReactDOM.createRoot(extensionContainer);
  root.render(React.createElement(App, { summary: "⏳ Генерация резюме..." }));

  const chatText = parseMessagesFromChat();

  const summary = await generateSummary(chatText);

  root.render(React.createElement(App, { summary }));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectExtension);
} else {
  injectExtension();
}
