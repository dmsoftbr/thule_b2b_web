import type { SearchComboItem } from "@/components/ui/search-combo";

export function convertArrayToSearchComboItem(
  array: any[],
  valueProp: string,
  labelProp: string | ((item: any) => string),
  includeValueInLabel: boolean = false
) {
  const list: SearchComboItem[] = [];

  if (!array) return list;

  const getLabel = (item: any) => {
    if (typeof labelProp == "string") {
      return includeValueInLabel
        ? `${item[valueProp]} - ${item[labelProp]}`
        : `${item[labelProp]}`;
    }
    return labelProp(item);
  };

  array.map((item) => {
    const value = `${item[valueProp]}`;
    const label = getLabel(item);
    list.push({
      value,
      label,
      keyworks: [value, label],
      extra: item,
    });
  });

  return list;
}
