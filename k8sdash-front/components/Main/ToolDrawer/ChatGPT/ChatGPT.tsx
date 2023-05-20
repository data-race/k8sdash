import { CSSProperties } from "react";

interface ChatGPTPros {
  style: CSSProperties;
}

export default function ChatGPT({ style }: ChatGPTPros) {
  return (
    <iframe src="https://bettergpt.chat/" style={style} />
    );
}
