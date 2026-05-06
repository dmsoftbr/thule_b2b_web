import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/number-utils";

interface CustomerGroupItem {
  groupId: number;
  groupName: string;
  groupValue: number;
  groupPerc: number;
}

interface Props {
  data: CustomerGroupItem[];
}

export const TopCustomers = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Sem informações para o período.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {data.map((item) => (
        <div
          key={item.groupId}
          className="flex flex-col flex-1 space-y-1"
        >
          <Label>
            {item.groupId} - {item.groupName}
          </Label>
          <div className="flex gap-x-2 items-center">
            <Progress
              value={item.groupPerc}
              indicatorClassNames="!bg-emerald-600"
            />
            <span className="text-xs w-14 text-right">
              {formatNumber(item.groupPerc, 2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
