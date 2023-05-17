import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";

import { ChevronLeft, HomeRepairService } from "@mui/icons-material";

interface ToolbarProps {
  menuWidth: number
  openMenu: boolean;
  openMenuDrawerHandler: Function;
  closeMenuDrawerHandler: Function;
  openTerminal: boolean;
  openTerminalDrawerHandler: Function;
  closeTerminalDrawerHandler: Function;
}

export default function DashboardToolbar({
  menuWidth,
  openMenu,
  openMenuDrawerHandler,
  closeMenuDrawerHandler,
  openTerminal,
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
          ...(openMenu && {
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
              if (!openMenu) {
                openMenuDrawerHandler();
              } else {
                closeMenuDrawerHandler();
              }
            }}
          >
            {openMenu ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Kubernetes DashBoard
          </Typography>
          <IconButton
            color="inherit"
            size="large"
            onClick={() => {
              if (!openTerminal) {
                openTerminalDrawerHandler();
              } else {
                closeTerminalDrawerHandler();
              }
            }}
          >
          <HomeRepairService/>
          </IconButton>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}
