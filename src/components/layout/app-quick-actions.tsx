import { QuickActionStock } from "./app-quick-action-stock";
import { AppQuickActionNewOrder } from "./app-quick-action-new-order";
import { QuickActionNewBudget } from "./app-quick-action-new-budget";
import { QuickActionMla } from "./app-quick-action-mla";

export const AppQuickActions = () => {
  return (
    <div className="border-l ml-2 flex items-center gap-x-2 px-4">
      <QuickActionStock />
      <AppQuickActionNewOrder />
      <QuickActionNewBudget />
      <QuickActionMla />
    </div>
  );
};
