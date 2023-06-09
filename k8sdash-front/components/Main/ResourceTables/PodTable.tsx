import fetchPod from "@/lib/api/pod";
import { Table, TableProps, Tag } from "antd";
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
import { CSSProperties, useEffect, useState } from "react";
import { mockData } from "./mock_data";
import getNamespaceFilters from "./utils";

interface PodTableItemType {
  key: string | number;
  name: string;
  namespace: string;
  status: string;
  ready: string;
  age: number;
  restarts: number;
}

interface PodTableProps {
  style: CSSProperties;
  currentContext: string;
}

export default function PodTable(props: PodTableProps) {
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<PodTableItemType>>(
    {}
  );

  const [podTableItems, setPodTableItems] = useState<PodTableItemType[]>([]);

  useEffect(()=>{
    async function fetchPodAsync() {
      const podItems = await fetchPod(props.currentContext)
      const pods: PodTableItemType[] = podItems.map((p)=>{
        return {
          name: p.name,
          namespace: p.namespace,
          key: p.namespace+ "/" + p.name,
          status: p.status,
          ready: `${p.readycontainers}/${p.containers}`,
          age: p.age,
          restarts: p.restarts,
        }
      })
      setPodTableItems(pods)
    }
    fetchPodAsync()
  })

  const handleChange: TableProps<PodTableItemType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<PodTableItemType>);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const columns: ColumnsType<PodTableItemType> = [
    {
      title: "Namespace",
      dataIndex: "namespace",
      key: "namespace",
      filters: getNamespaceFilters(mockData.pods),
      filteredValue: filteredInfo.namespace || null,
      onFilter: (value: string | number | boolean, record) =>
        record.namespace === value.toString(),
      sorter: (a, b) => a.namespace.localeCompare(b.namespace),
      sortOrder: sortedInfo.columnKey === "namespace" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Running", value: "Running" },
        { text: "Pending", value: "Pending" },
        { text: "Succeeded", value: "Succeeded" },
        { text: "Failed", value: "Failed" },
        { text: "Unknown", value: "Unknown" },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value: string | number | boolean, record) =>
        record.status === value.toString(),
      render: (_, { status }) => {
        return (
          <Tag key={status} color={getColor(status)}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Ready",
      dataIndex: "ready",
      key: "ready",
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => {return a.age - b.age;},
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
      // TODO: add render for age
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={podTableItems}
      onChange={handleChange}
      style={props.style}
      pagination={{ pageSize: 8 }}
    />
  );
}

function getColor(status: string): string {
  var color = "green";
  switch (status) {
    case "Running":
      break;
    case "Pending":
      color = "yellow";
      break;
    case "Succeeded":
      color = "blue";
      break;
    case "Failed":
      color = "red";
      break;
    case "Unknown":
      color = "gray";
      break;
  }
  return color;
}
