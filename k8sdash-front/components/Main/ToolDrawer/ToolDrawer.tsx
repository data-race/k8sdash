import { Chat, Terminal } from "@mui/icons-material";
import { Drawer } from "antd";
import ChatGPT from "./ChatGPT/ChatGPT";
import WebTerminal from "./WebTerminal";

interface ToolDrawerProps {
  menuWidth: number;
  openTool: boolean;
  openMenu: boolean;
  closeToolDrawerHandler: () => void;
}

const terminalHeight = 468;

export default function ToolDrawer({
  menuWidth,
  openTool,
  openMenu,
  closeToolDrawerHandler,
}: ToolDrawerProps) {
  return (
    <Drawer
      title=<div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "calc(48%)" }}>
          <Terminal />
          Terminal
        </div>
        <div style={{ width: "calc(50%)" }}>
          <Chat />
          ChatGPT
        </div>
      </div>
      placement="bottom"
      open={openTool}
      closable={true}
      onClose={() => closeToolDrawerHandler()}
      mask={false}
      maskClosable={false}
      key="bottom"
      height={terminalHeight}
      getContainer={false}
      style={{
        ...(openMenu && {
          width: `calc(100% - ${menuWidth}px)`,
          marginLeft: `${menuWidth}px`,
          transition: `margin ease-out .3s, width ease-out .3s`,
        }),
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <WebTerminal style={{width: "calc(50%)"}} />
        <ChatGPT style={{ width: "calc(52%)", height: "360px",}}/>
      </div>
    </Drawer>
  );
}
