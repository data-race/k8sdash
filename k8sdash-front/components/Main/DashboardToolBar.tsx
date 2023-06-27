import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";

import fetchContext from "@/lib/api/context";
import { ChevronLeft, HomeRepairService } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface ToolbarProps {
  menuWidth: number;
  openMenu: boolean;
  openMenuDrawerHandler: Function;
  closeMenuDrawerHandler: Function;
  openTerminal: boolean;
  openTerminalDrawerHandler: Function;
  closeTerminalDrawerHandler: Function;
  handleContextChange: (newContext: string) => void;
}

export default function DashboardToolbar({
  menuWidth,
  openMenu,
  openMenuDrawerHandler,
  closeMenuDrawerHandler,
  openTerminal,
  openTerminalDrawerHandler,
  closeTerminalDrawerHandler,
  handleContextChange,
}: ToolbarProps) {
  const [contexts, setContexts] = useState([""]);
  const [currentContext, setCurrentContext] = useState(contexts[0])

  useEffect(()=>{
    async function fetchContextAsync() {
      const contextItems = await fetchContext()
      const contexts = contextItems.map((c)=>c.cluster)
      setContexts(contexts)
      setCurrentContext(contexts[0])
    }
    fetchContextAsync()
  }, [])

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
          <div style={{ gap: "20px" }}>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                sx={{
                  boxShadow: "none",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  color: "white",
                }}
                labelId="k8s-context-select-label"
                id="k8s-context-select"
                value={currentContext}
                label="k8s-context"
                onChange={(e) => {
                  setCurrentContext(e.target.value);
                  handleContextChange(e.target.value);
                }}
              >
                {contexts.map((ctx) => (
                  <MenuItem value={ctx}>{ctx}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
              <HomeRepairService />
            </IconButton>
          </div>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}
