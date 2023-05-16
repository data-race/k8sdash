import { Drawer, Menu } from "antd";
import { ResourceGroup } from "./App";

import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

interface ResourceMenuDrawerProps {
  openMenu: boolean;
  resourceGroups: ResourceGroup[];
  handleClickItem: (item:string)=>void;
}

export const menuWidth = 350;

export default function ResourceMenuDrawer({
  openMenu,
  resourceGroups,
  handleClickItem,
}: ResourceMenuDrawerProps) {
  return (
    <Drawer
      title="Resource Menu"
      placement="left"
      open={openMenu}
      closable={false}
      maskClosable={false}
      mask={false}
      key="left"
      width={menuWidth}
    >
      <Menu
        theme="light"
        defaultSelectedKeys={["Pod"]}
        defaultOpenKeys={["Computation", "Network", "Storage", "Configuration"]}
        mode="inline"
        onClick={({key, keyPath, domEvent })=>{
          handleClickItem(key)
        }}
        items={
          resourceGroups.map((group)=>getItem(
            group.category,
            group.category,
            group.icon(),
            group.resources.map((resource)=>getItem(
              resource.kind,
              resource.kind,
              null,
            )),
          ))
        }
      ></Menu>
    </Drawer>
  );
}
