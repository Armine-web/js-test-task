import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Title } from "./Components/Title/Title";
import { Summary } from "./Components/Summary/Summary";

const AppContainer = styled.div`
  width: 400px;
  height: auto;
  max-height: 500px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  overflow-y: auto;
  color: #111827;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 8px;
`;

const Button = styled.button`
  margin-top: 8px;
  padding: 8px 12px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #4338ca;
  }
`;

const Message = styled.div`
  margin-top: 10px;
  color: green;
`;

const LoadingText = styled.div`
  margin-top: 10px;
  color: #4f46e5;
  font-weight: 600;
`;

export const App = ({ summary, loading, setLoading }) => {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (key.trim()) {
      localStorage.setItem("gemini_api_key", key.trim());
      setSaved(true);
    }
  };

  return (
    <AppContainer>
      <Title />
      {!saved ? (
        <>
          <div>Введите Gemini ключ:</div>

          <Input
            type="password"
            placeholder="sk-..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Button onClick={handleSave}>Сохранить</Button>
        </>
      ) : (
        <Message>✅ API ключ сохранён</Message>
      )}

      {loading && <LoadingText>⏳ Загрузка...</LoadingText>}

      <Summary summary={summary} />
    </AppContainer>
  );
};
