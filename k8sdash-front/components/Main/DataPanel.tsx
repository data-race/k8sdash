import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Paragraph from "antd/es/typography/Paragraph";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "4",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "5",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "6",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "7",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

interface DataPanelProps {
  openMenu: boolean;
  menuWidth: number;
}

export default function DataPanel(props: DataPanelProps) {
  return (
    // 
    <main
      style={{
        paddingLeft:"30px",
        paddingRight: "30px",
        paddingTop: "30px",
        ...(props.openMenu && {
          width: `calc(100% - ${props.menuWidth}px)`,
          marginLeft: `${props.menuWidth}px`,
          transition: `margin ease-out .3s, width ease-out .3s`,
        }),
      }}
    >
      <Paragraph>
        - error ReferenceError: self is not defined at __webpack_require__
        (/Volumes/WD-SN570/Workspace/k8sdash/k8sdash-front/.next/server/webpack-runtime.js:33:43)
        at eval (./components/Main/WebTerminal.tsx:10:63) at
        (sc_client)/./components/Main/WebTerminal.tsx
        (/Volumes/WD-SN570/Workspace/k8sdash/k8sdash-front/.next/server/app/page.js:151159:1)
        at __webpack_require__
        (/Volumes/WD-SN570/Workspace/k8sdash/k8sdash-front/.next/server/webpack-runtime.js:33:43)
        at eval (./components/Main/TerminalDrawer.tsx:8:70) at
        (sc_client)/./components/Main/TerminalDrawer.tsx
        (/Volumes/WD-SN570/Workspace/k8sdash/k8sdash-front/.next/server/app/page.js:151148:1)
        at __webpack_require__
        (/Volumes/WD-SN570/Workspace/k8sdash/k8sdash-front/.next/server/webpack-runtime.js:33:43)
        at eval (./components/Main/Main.tsx:10:73) at
        (sc_client)/./components/Main/Main.tsx
        (/Volumes/WD-SN570/Workspace/k8sdash/k8sdash-front/.next/server/app/page.js:151137:1)
      </Paragraph>
      <Table columns={columns} dataSource={data} />
    </main>
  );
}
