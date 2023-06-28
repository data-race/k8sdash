import { HomeOutlined } from "@mui/icons-material";
import { Breadcrumb } from "antd";
import DeploymentTable from "./ResourceTables/DeploymentTable";
import PodTable from "./ResourceTables/PodTable";

interface DataPanelProps {
  openMenu: boolean;
  menuWidth: number;
  selectedResource: string;
  currentContext: string;
}

const tableStyle = {
  width: "calc(90%)",
  paddingLeft: "calc(5%)",
  paddingTop: "20px",
}

export default function DataPanel(props: DataPanelProps) {

  const resourceTable = ():JSX.Element => {
    switch(props.selectedResource) {
      case 'Pod':
        return <PodTable style={tableStyle} currentContext={props.currentContext}/>
      case 'Deployment':
        return <DeploymentTable style={tableStyle}/>
      default:
        return <PodTable style={tableStyle} currentContext={props.currentContext}/>
    }
  }

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
      {resourceTable()}
    </main>
  );
}

