import { Drawer } from "antd";


interface TerminalDrawerProps {
  menuWidth: number,
  openTerminal: boolean;
  openMenu: boolean;
  closeTerminalDrawerHandler: ()=>void;
}

const terminalHeight = 380;

export default function TerminalDrawer({
  menuWidth,
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
      getContainer={false}
      style={{
        ...(openMenu && {
          width: `calc(100% - ${menuWidth}px)`,
          marginLeft: `${menuWidth}px`,
          transition: `margin ease-out .3s, width ease-out .3s`,
        })
      }}
    >
      {/* <WebTerminal/> */}
    </Drawer>
  );
}
