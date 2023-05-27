import { HomeOutlined } from "@mui/icons-material";
import { Breadcrumb } from "antd";
import PodTable from "./ResourceTables/PodTable";

interface DataPanelProps {
  openMenu: boolean;
  menuWidth: number;
  selectedResource: string;
}

export default function DataPanel(props: DataPanelProps) {
  return (
    //
    <main
      style={{
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingTop: "30px",
        ...(props.openMenu && {
          width: `calc(100% - ${props.menuWidth}px)`,
          marginLeft: `${props.menuWidth}px`,
          transition: `margin ease-out .3s, width ease-out .3s`,
        }),
      }}
    >
      <Breadcrumb
        items={[
          {
            title: <HomeOutlined />,
          },
          {
            title: (
              <>
                <span>Resources</span>
              </>
            ),
          },
          {
            title: props.selectedResource,
          },
        ]}
        style={{ fontSize: 20 }}
      />

      <PodTable
        style={{
          width: "calc(90%)",
          paddingLeft: "calc(5%)",
          paddingTop: "20px",
        }}
      />
    </main>
  );
}
