import React, { useState } from "react";
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

async function generateSummary(chatText, apiKey) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Привет, сделай краткое резюме следующего текста:\n\n${chatText}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Ошибка Gemini API:", data);
      return `❗️Ошибка: ${data?.error?.message || "Неизвестная"}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "❗️Ответ пустой от Gemini";
  } catch (error) {
    console.error("Ошибка при обращении к Gemini API:", error);
    return "❗️Ошибка при обращении к Gemini API";
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

 
  function Wrapper() {
    const [summary, setSummary] = React.useState("⏳ Генерация резюме...");
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      async function fetchSummary() {
        const chatText = parseMessagesFromChat();
        const apiKey = localStorage.getItem("gemini_api_key");

        if (!apiKey) {
          setSummary("❗️Gemini API ключ не задан.");
          setLoading(false);
          return;
        }

        setLoading(true);
        const result = await generateSummary(chatText, apiKey);
        setSummary(result);
        setLoading(false);
      }

      fetchSummary();
    }, []);

    return <App summary={summary} loading={loading} setLoading={setLoading} />;
  }

  root.render(React.createElement(Wrapper));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectExtension);
} else {
  injectExtension();
}
