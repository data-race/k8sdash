import { ColumnFilterItem } from "antd/es/table/interface";

export default function getNamespaceFilters(data: [any]) {
  var namespaces = new Set();
  data.forEach((item) => {
    namespaces.add(item.namespace);
  });
  var filters: ColumnFilterItem[] = [];
  namespaces.forEach((ns) => {
    filters.push({
      //@ts-ignore
      text: ns,
      //@ts-ignore
      value: ns,
    });
  });
  return filters;
}
