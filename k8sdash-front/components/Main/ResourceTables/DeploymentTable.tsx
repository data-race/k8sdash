import { Table, TableProps, Tag } from "antd";
import {
    ColumnsType,
    FilterValue,
    SorterResult,
} from "antd/es/table/interface";
import { CSSProperties, useState } from "react";
import { mockData } from "./mock_data";
import getNamespaceFilters from "./utils";

interface DeploymentTableItemType {
  key: string | number;
  name: string;
  namespace: string;
  desired: number;
  available: number;
  healthy: boolean;
}

interface DeploymentTableProps {
  style: CSSProperties;
}

export default function DeploymentTable(props: DeploymentTableProps) {
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<
    SorterResult<DeploymentTableItemType>
  >({});

  const handleChange: TableProps<DeploymentTableItemType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<DeploymentTableItemType>);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const columns: ColumnsType<DeploymentTableItemType> = [
    {
      title: "Namespace",
      dataIndex: "namespace",
      key: "namespace",
      filters: getNamespaceFilters(mockData.deployments),
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
      title: "Desired",
      dataIndex: "desired",
      key: "desired",
      ellipsis: true,
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      ellipsis: true,
    },
    {
      title: "Healthy",
      dataIndex: "healthy",
      key: "healthy",
      ellipsis: true,
      render: (_, { healthy }) => {
        return (
          <Tag color={healthy ? "green" : "red"}>
            {healthy ? "Healthy" : "Unhealthy"}
          </Tag>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={mockData.deployments}
      onChange={handleChange}
      style={props.style}
      pagination={{ pageSize: 8 }}
    />
  );
}
