import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const TopProducts = () => {
  return (
    <div>
      <div className="flex flex-col flex-1 space-y-1">
        <Label>AWK</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={50} className="text-blue-600" />
          <span>50%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>AWK2</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={30} />
          <span>30%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>AWK3</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={20} />
          <span>10%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>AWK4</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={20} />
          <span>20%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-1">
        <Label>Outras</Label>
        <div className="flex gap-x-2 items-center">
          <Progress value={10} />
          <span>10%</span>
        </div>
      </div>
    </div>
  );
};
