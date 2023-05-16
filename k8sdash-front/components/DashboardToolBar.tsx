import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";

import { ChevronLeft, Terminal } from "@mui/icons-material";
import { menuWidth } from "./ResourceMenuDrawer";

interface ToolbarProps {
  menuStatus: boolean;
  openMenuDrawerHandler: Function;
  closeMenuDrawerHandler: Function;
  terminalStatus: boolean;
  openTerminalDrawerHandler: Function;
  closeTerminalDrawerHandler: Function;
}

export default function DashboardToolbar({
  menuStatus,
  openMenuDrawerHandler,
  closeMenuDrawerHandler,
  terminalStatus,
  openTerminalDrawerHandler,
  closeTerminalDrawerHandler,
}: ToolbarProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <MuiAppBar
        position="fixed"
        className="bg-blue-950"
        style={{
          ...(menuStatus && {
            width: `calc(100% - ${menuWidth}px)`,
            transition: `width ease-out .3s`,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              if (!menuStatus) {
                openMenuDrawerHandler();
              } else {
                closeMenuDrawerHandler();
              }
            }}
          >
            {menuStatus ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Kubernetes DashBoard
          </Typography>
          <IconButton
            color="inherit"
            size="large"
            onClick={() => {
              if (!terminalStatus) {
                openTerminalDrawerHandler();
              } else {
                closeTerminalDrawerHandler();
              }
            }}
          >
            <Terminal />
          </IconButton>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}
