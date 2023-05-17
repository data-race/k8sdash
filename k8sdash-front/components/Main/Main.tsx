import { useState } from "react";
import DashboardToolbar from "./DashboardToolBar";
import DataPanel from "./DataPanel";
import ToolDrawer from "./ToolDrawer/ToolDrawer";

interface MainProps {
  openMenu: boolean;
  menuWidth: number;
  selectedResource: string;
  openMenuHandler: () => void;
  closeMenuHandler: () => void;
}

export default function Main(props: MainProps) {
  const [openTool, setOpenTool] = useState(false);

  const handleOpenTool = () => {
    setOpenTool(true);
  };
  const handleCloseTool = () => {
    setOpenTool(false);
  };
  return (
    <main>
      <DashboardToolbar
        menuWidth={props.menuWidth}
        openMenu={props.openMenu}
        openMenuDrawerHandler={props.openMenuHandler}
        closeMenuDrawerHandler={props.closeMenuHandler}
        openTerminal={openTool}
        openTerminalDrawerHandler={handleOpenTool}
        closeTerminalDrawerHandler={handleCloseTool}
      />
      <DataPanel openMenu={props.openMenu} menuWidth={props.menuWidth} />
      <ToolDrawer
        menuWidth={props.menuWidth}
        openTool={openTool}
        openMenu={props.openMenu}
        closeToolDrawerHandler={handleCloseTool}
      />
    </main>
  );
}
