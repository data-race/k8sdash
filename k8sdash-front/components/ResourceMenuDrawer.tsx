import { Drawer } from "antd";

interface ResourceMenuDrawerProps {
  openMenu: boolean;
}

export const menuWidth = 350;

export default function ResourceMenuDrawer({
  openMenu,
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
      
    </Drawer>
  );
}
