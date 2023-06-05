import { Table, TableProps, Tag } from "antd";
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
import { CSSProperties, useState } from "react";
import { mockData } from "./mock_data";
import getNamespaceFilters from "./utils";

interface PodTableItemType {
  key: string|number;
  name: string;
  namespace: string;
  status: string;
  image: string;
  age: string;
  restarts: number;
}

interface PodTableProps {
  style: CSSProperties;
}

export default function PodTable(props: PodTableProps) {
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<PodTableItemType>>(
    {}
  );

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
        {text: 'Running', value: 'Running'},
        {text: 'Pending', value: 'Pending'},
        {text: 'Succeeded', value: 'Succeeded'},
        {text: 'Failed', value: 'Failed'},
        {text: 'Unknown', value: 'Unknown'},
      ],
      filteredValue:filteredInfo.status || null,
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
        title: "Image",
        dataIndex: 'image',
        key: 'image',
        sorter: (a, b) => a.image.localeCompare(b.image),
        sortOrder: sortedInfo.columnKey === "image" ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        ellipsis: true,
    }
  ];

  return (
    <Table
        columns={columns}
        dataSource={mockData.pods}
        onChange={handleChange}
        style={props.style}
        pagination={{pageSize:8}}
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
