import { ColumnFilterItem } from "antd/es/table/interface";
import { PodTableItemType } from "./PodTable";

export default function getNamespaceFilters(data: PodTableItemType[]) {
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

export function ageRender(age: number): string {
  if (age < 60) {
    return `${age} sec`;
  } else if (age < 3600) {
    return `${Math.floor(age / 60)} min ` + ageRender(age % 60);
  } else if (age < 86400) {
    return `${Math.floor(age / 3600)} hr ` + ageRender(age % 3600);
  } else {
    return `${Math.floor(age / 86400)} d ` + ageRender(age % 86400);
  } 
}