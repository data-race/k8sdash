import getContext from "@/lib/api/context";
import { useEffect, useState } from "react";
import Loader from "../Loader";
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
  const [isLoading, setIsLoading] = useState(true);
  const [contexts, setContexts] = useState<string[]>([]);
  const [currentContext, setCurrentContext] = useState("");

  const handleOpenTool = () => {
    setOpenTool(true);
  };
  const handleCloseTool = () => {
    setOpenTool(false);
  };

  useEffect(() => {
    async function fetchContextAsync() {
      const contextItems = await getContext();
      setContexts(contextItems.map((c) => c.cluster));
      setCurrentContext(contextItems[0].cluster);
      setIsLoading(false);
    }
    fetchContextAsync();
  }, []);

  if(isLoading) {
    return <Loader/>
  }
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
          contexts={contexts}
          currentContext={currentContext}
          handleContextChange={(newContext) => {
            setCurrentContext(newContext);
          }}
        />
        <DataPanel
          openMenu={props.openMenu}
          menuWidth={props.menuWidth}
          selectedResource={props.selectedResource}
          currentContext={currentContext}
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
