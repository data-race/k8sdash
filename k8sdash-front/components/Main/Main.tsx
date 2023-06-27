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
      <div>
        <DashboardToolbar
          menuWidth={props.menuWidth}
          openMenu={props.openMenu}
          openMenuDrawerHandler={props.openMenuHandler}
          closeMenuDrawerHandler={props.closeMenuHandler}
          openTerminal={openTool}
          openTerminalDrawerHandler={handleOpenTool}
          closeTerminalDrawerHandler={handleCloseTool}
          // TODO
          handleContextChange={(newContext)=>{}}
        />
        <DataPanel
          openMenu={props.openMenu}
          menuWidth={props.menuWidth}
          selectedResource={props.selectedResource}
        />
      </div>
      <ToolDrawer
        menuWidth={props.menuWidth}
        openTool={openTool}
        openMenu={props.openMenu}
        closeToolDrawerHandler={handleCloseTool}
      />
    </main>
  );
}
