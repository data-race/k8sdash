import { Drawer } from "antd";
import { menuWidth } from "./ResourceMenuDrawer";

interface TerminalDrawerProps {
  openTerminal: boolean;
  openMenu: boolean;
  closeTerminalDrawerHandler: Function;
}

const terminalHeight = 350;

export default function TerminalDrawer({
  openTerminal,
  openMenu,
  closeTerminalDrawerHandler,
}: TerminalDrawerProps) {
  return (
    <Drawer
      title="Terminal"
      placement="bottom"
      open={openTerminal}
      closable={true}
      onClose={()=>closeTerminalDrawerHandler()}
      mask={false}
      maskClosable={false}
      key="bottom"
      height={terminalHeight}
      style={{
        ...(openMenu && {
          width: `calc(100% - ${menuWidth}px)`,
          marginLeft: `${menuWidth}px`,
          transition: `margin ease-out .3s, width ease-out .3s`,
        })
      }}
    >
      <p >
        There will be a embeded terminal.
      </p>
    </Drawer>
  );
}
