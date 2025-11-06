import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const TopCustomers = () => {
  return (
    <div>
      <div className="flex flex-col flex-1 space-y-1">
        <Label>91</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={50} indicatorClassNames="!bg-emerald-600" />
          <span>50%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>99</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={30} />
          <span>30%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>48</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={20} />
          <span>10%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>10</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={20} />
          <span>20%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>Outros</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={10} />
          <span>10%</span>
        </div>
      </div>
    </div>
  );
};
