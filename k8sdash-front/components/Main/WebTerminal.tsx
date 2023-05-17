import { useEffect } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import "xterm/css/xterm.css";

// Refer: https://juejin.cn/post/6918911964009725959

const socketURL = "ws://127.0.0.1:11223/term";
export default function WebTerminal() {
  useEffect(() => {
    var term = new Terminal({
      fontFamily: 'MesloLGS NF',
      fontWeight: 400,
      fontSize: 14,
      rows: 200,
    });
    //@ts-ignore
    term.open(document.getElementById("terminal"));
    term.focus();
    const ws = new WebSocket(socketURL);
    const attachAddon = new AttachAddon(ws);
    term.loadAddon(attachAddon);
    return () => {
      //组件卸载，清除 Terminal 实例
      term.dispose();
    };
  }, []);
  return <div id="terminal"></div>;
}

