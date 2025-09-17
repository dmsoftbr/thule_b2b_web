import type { SearchComboItem } from "@/components/ui/search-combo";

export function convertArrayToSearchComboItem(
  array: any[],
  valueProp: string,
  labelProp: string,
  includeValueInLabel: boolean = false
) {
  const list: SearchComboItem[] = [];

  if (!array) return list;

  array.map((item) => {
    const value = `${item[valueProp]}`;
    const label = includeValueInLabel
      ? `${item[valueProp]} - ${item[labelProp]}`
      : `${item[labelProp]}`;

    list.push({
      value,
      label,
      keyworks: [value, label],
      extra: item,
    });
  });

  return list;
}
