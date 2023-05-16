import { useState } from "react";
import DashboardToolbar from "./DashboardToolBar";
import DataPanel from "./DataPanel";
import TerminalDrawer from "./TerminalDrawer";

interface MainProps {
  openMenu: boolean;
  menuWidth: number;
  selectedResource: string;
  openMenuHandler: () => void;
  closeMenuHandler: () => void;
}

export default function Main(props: MainProps) {
  const [openTerminal, setOpenTerminal] = useState(false);

  const handleOpenTerminal = () => {
    setOpenTerminal(true);
  };
  const handleCloseTerminal = () => {
    setOpenTerminal(false);
  };
  return (
    <main>
      <DashboardToolbar
        menuWidth={props.menuWidth}
        openMenu={props.openMenu}
        openMenuDrawerHandler={props.openMenuHandler}
        closeMenuDrawerHandler={props.closeMenuHandler}
        openTerminal={openTerminal}
        openTerminalDrawerHandler={handleOpenTerminal}
        closeTerminalDrawerHandler={handleCloseTerminal}
      />
      <DataPanel openMenu={props.openMenu} menuWidth={props.menuWidth} />
      <TerminalDrawer
        menuWidth={props.menuWidth}
        openTerminal={openTerminal}
        openMenu={props.openMenu}
        closeTerminalDrawerHandler={handleCloseTerminal}
      />
    </main>
  );
}
