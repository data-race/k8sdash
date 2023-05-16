"use client";

import { Computer, Hub, Key, Storage } from "@mui/icons-material";
import { useState } from "react";
import Main from "./Main/Main";
import ResourceMenuDrawer, { menuWidth } from "./ResourceMenuDrawer";

export interface ResourceGroup {
  category: string;
  icon: () => React.ReactNode;
  resources: {
    kind: string;
  }[];
}

const ResourceGroups: ResourceGroup[] = [
  {
    category: "Computation",
    icon: () => <Computer />,
    resources: [
      { kind: "Pod" },
      { kind: "Deployment" },
      { kind: "StatefulSet" },
    ],
  },
  {
    category: "Network",
    icon: () => <Hub />,
    resources: [{ kind: "Service" }, { kind: "Ingress" }],
  },
  {
    category: "Storage",
    icon: () => <Storage />,
    resources: [
      { kind: "StorageClass" },
      { kind: "PersistentVolume" },
      { kind: "PersistentVolumeClaim" },
    ],
  },
  {
    category: "Configuration",
    icon: () => <Key />,
    resources: [{ kind: "Secret" }, { kind: "ConfigMap" }],
  },
];

export default function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedResource, setSelectResource] = useState("Pod");

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  return (
    <div className="flex flex-col items-center justify-between py-20">
      <ResourceMenuDrawer
        openMenu={openMenu}
        resourceGroups={ResourceGroups}
        handleClickItem={(item: string) => {
          setSelectResource(item);
        }}
      />
      <Main
        openMenu={openMenu}
        menuWidth={menuWidth}
        selectedResource={selectedResource}
        openMenuHandler={handleMenuOpen}
        closeMenuHandler={handleMenuClose}
      />
    </div>
  );
}
