import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/number-utils";
import type { RepresentativeModel } from "@/models/representative.model";

interface Props {
  data: any[];
  representatives?: RepresentativeModel[];
}
export const TopRepresentatives = ({ data, representatives = [] }: Props) => {
  const abbrevById = new Map(
    representatives.map((r) => [r.id, r.abbreviation]),
  );
  return (
    <div className="flex items-center justify-center h-full">
      <ul className="space-y-1 flex flex-col w-full -mt-10">
        {data.map((item) => (
          <li className="flex items-center gap-x-2">
            <span className="flex-1 text-right">
              {item.representative}
              {abbrevById.get(Number(item.representative))
                ? ` - ${abbrevById.get(Number(item.representative))}`
                : ""}
            </span>
            <Progress value={item.representativePerc} className="flex-1" />
            <div className="flex-1">
              <span className="text-xs rounded bg-blue-300 p-1 mr-1">
                {formatNumber(item.representativePerc, 2)}%
              </span>
              =
              <span className="text-xs rounded bg-red-300 p-1 ml-1">
                {formatNumber(item.representativeValue, 2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
