import { refreshPodCache } from "@/lib/api/pod";
import { SyncOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@mui/icons-material";
import { Breadcrumb, Spin } from "antd";
import { useState } from "react";
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
};

export default function DataPanel(props: DataPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const completeRefresh = () => {
    setIsRefreshing(false);
  };

  const startRefresh = () => {
    switch (props.selectedResource) {
      case "Pod":
        refreshPodCache(props.currentContext);
        break;
      default:
        refreshPodCache(props.currentContext);
        break;
    }
    setIsRefreshing(true);
    setTriggerRefresh(!triggerRefresh);
  };

  const resourceTable = (): JSX.Element => {
    switch (props.selectedResource) {
      case "Pod":
        return (
          <PodTable
            style={tableStyle}
            currentContext={props.currentContext}
            completeRefresh={completeRefresh}
            triggerRefresh={triggerRefresh}
          />
        );
      case "Deployment":
        return <DeploymentTable style={tableStyle} />;
      default:
        return (
          <PodTable
            style={tableStyle}
            currentContext={props.currentContext}
            completeRefresh={completeRefresh}
            triggerRefresh={triggerRefresh}
          />
        );
    }
  };

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
      <div className="flex">
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
        {isRefreshing ? (
          <Spin
            style={{
              marginLeft: "30px",
              marginTop: "3px",
              color: "#0960c3",
              fontSize: 20,
            }}
          />
        ) : (
          <SyncOutlined
            style={{
              marginLeft: "30px",
              marginTop: "7px",
              color: "#0960c3",
              fontSize: 24,
            }}
            onClick={() => {
              startRefresh();
            }}
          />
        )}
      </div>
      {resourceTable()}
    </main>
  );
}
