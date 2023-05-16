"use client";

import { useState } from "react";
import DashboardToolbar from "./DashboardToolBar";
import ResourceMenuDrawer from "./ResourceMenuDrawer";
import TerminalDrawer from "./TerminalDrawer";

export default function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openTerminal, setOpenTerminal] = useState(true);

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleTerminalOpen = () => {
    setOpenTerminal(true);
  };

  const handleTerminalClose = () => {
    setOpenTerminal(false);
  };

  return (
    <div className="flex flex-col items-center justify-between py-20">
      <DashboardToolbar
        menuStatus={openMenu}
        openMenuDrawerHandler={handleMenuOpen}
        closeMenuDrawerHandler={handleMenuClose}
        terminalStatus={openTerminal}
        openTerminalDrawerHandler={handleTerminalOpen}
        closeTerminalDrawerHandler={handleTerminalClose}
      />
      <ResourceMenuDrawer openMenu={openMenu} />
      <TerminalDrawer openTerminal={openTerminal} openMenu={openMenu} closeTerminalDrawerHandler={handleTerminalClose}/>
    </div>
  );
}
