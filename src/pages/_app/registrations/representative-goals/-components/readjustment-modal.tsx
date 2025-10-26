import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import type { ProductGroupModel } from "@/models/registrations/product-group.model";
import type { ProductCommercialFamilyModel } from "@/models/registrations/product-commercial-family.model";
import type { RepresentativeModel } from "@/models/representative.model";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { CustomerGroupModel } from "@/models/registrations/customer-group.model";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}

const DEFAULT_MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const DEFAULT_MONTHS_NAME = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const ReadjustmentModal = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [managersData, setManagersData] = useState<string[]>([]);
  const [representativesData, setRepresentativesData] = useState<
    RepresentativeModel[]
  >([]);
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<
    number[]
  >([]);

  const [familiesData, setFamiliesData] = useState<
    ProductCommercialFamilyModel[]
  >([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);

  const [productGroupsData, setProductGroupsData] = useState<
    ProductGroupModel[]
  >([]);
  const [selectedProductGroups, setSelectedProductGroups] = useState<number[]>(
    []
  );

  const [customerGroupsData, setCustomerGroupsData] = useState<
    CustomerGroupModel[]
  >([]);
  const [selectedCustomerGroups, setSelectedCustomerGroups] = useState<
    number[]
  >([]);

  const [percent, setPercent] = useState<number>(0);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const params = {
        year,
        months: selectedMonths,
        managers: selectedManagers,
        representatives: selectedRepresentatives,
        productCommercialFamilies: selectedFamilies,
        productGroups: selectedProductGroups,
        customerGroups: selectedCustomerGroups,
        percent,
      };
      await api.post(`/registrations/representative-goals/readjust`, params);
      toast.success("Reajuste aplicado!");
      onClose(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMonths = () => {
    if (selectedMonths.length > 0) setSelectedMonths([]);
    else setSelectedMonths([...DEFAULT_MONTHS]);
  };

  const getMonthIsSelected = (month: number) => {
    return selectedMonths.findIndex((f) => f == month) > -1;
  };

  const handleSelectMonth = (month: number) => {
    if (getMonthIsSelected(month)) {
      const newMonths = selectedMonths.filter((f) => f != month);
      setSelectedMonths(newMonths);
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  //************* managers  */
  const handleSelectManagers = () => {
    if (selectedManagers.length > 0) setSelectedManagers([]);
    else setSelectedManagers([...managersData]);
  };

  const getManagerIsSelected = (manager: string) => {
    return selectedManagers.findIndex((f) => f == manager) > -1;
  };

  const handleSelectManager = (manager: string) => {
    if (getManagerIsSelected(manager)) {
      const newManagers = selectedManagers.filter((f) => f != manager);
      setSelectedManagers(newManagers);
    } else {
      setSelectedManagers([...selectedManagers, manager]);
    }
  };

  const getManagers = async () => {
    const { data } = await api.get(
      "/registrations/representative-goals/get-managers"
    );
    setManagersData(data);
  };

  //************* reps  */
  const handleSelectRepresentatives = () => {
    if (selectedRepresentatives.length > 0) setSelectedRepresentatives([]);
    else {
      const allReps = representativesData.map((rep) => rep.id);
      setSelectedRepresentatives(allReps);
    }
  };

  const getRepresentativeIsSelected = (representativeId: number) => {
    return selectedRepresentatives.findIndex((f) => f == representativeId) > -1;
  };

  const handleSelectRepresentative = (representativeId: number) => {
    if (getRepresentativeIsSelected(representativeId)) {
      const newReps = selectedRepresentatives.filter(
        (f) => f != representativeId
      );
      setSelectedRepresentatives(newReps);
    } else {
      setSelectedRepresentatives([
        ...selectedRepresentatives,
        representativeId,
      ]);
    }
  };

  const getRepresentatives = async () => {
    const { data } = await api.get<RepresentativeModel[]>(
      "/registrations/representatives/all"
    );
    setRepresentativesData(data);
  };

  //************* commercial Families  */
  const handleSelectFamilies = () => {
    if (selectedFamilies.length > 0) setSelectedFamilies([]);
    else {
      const allFamilies = familiesData.map((family) => family.id);
      setSelectedFamilies(allFamilies);
    }
  };

  const getFamilyIsSelected = (familyId: string) => {
    return selectedFamilies.findIndex((f) => f == familyId) > -1;
  };

  const handleSelectFamily = (familyId: string) => {
    if (getFamilyIsSelected(familyId)) {
      const newReps = selectedFamilies.filter((f) => f != familyId);
      setSelectedFamilies(newReps);
    } else {
      setSelectedFamilies([...selectedFamilies, familyId]);
    }
  };

  const getFamilies = async () => {
    const { data } = await api.get<ProductCommercialFamilyModel[]>(
      "/registrations/product-commercial-families/all"
    );
    setFamiliesData(data);
  };

  //************* product groups  */
  const handleSelectProductGroups = () => {
    if (selectedProductGroups.length > 0) setSelectedProductGroups([]);
    else {
      const allGroups = productGroupsData.map((group) => group.id);
      setSelectedProductGroups(allGroups);
    }
  };

  const getProductGroupIsSelected = (groupId: number) => {
    return selectedProductGroups.findIndex((f) => f == groupId) > -1;
  };

  const handleSelectProductGroup = (groupId: number) => {
    if (getProductGroupIsSelected(groupId)) {
      const newGroups = selectedProductGroups.filter((f) => f != groupId);
      setSelectedProductGroups(newGroups);
    } else {
      setSelectedProductGroups([...selectedProductGroups, groupId]);
    }
  };

  const getProductGroups = async () => {
    const { data } = await api.get<ProductGroupModel[]>(
      "/registrations/product-groups/all"
    );
    setProductGroupsData(data);
  };

  //************* customer groups  */
  const handleSelectCustomerGroups = () => {
    if (selectedCustomerGroups.length > 0) setSelectedCustomerGroups([]);
    else {
      const allGroups = customerGroupsData.map((group) => group.id);
      setSelectedCustomerGroups(allGroups);
    }
  };

  const getCustomerGroupIsSelected = (groupId: number) => {
    return selectedCustomerGroups.findIndex((f) => f == groupId) > -1;
  };

  const handleSelectCustomerGroup = (groupId: number) => {
    if (getCustomerGroupIsSelected(groupId)) {
      const newGroups = selectedCustomerGroups.filter((f) => f != groupId);
      setSelectedCustomerGroups(newGroups);
    } else {
      setSelectedCustomerGroups([...selectedCustomerGroups, groupId]);
    }
  };

  const getCustomerGroups = async () => {
    const { data } = await api.get<ProductGroupModel[]>(
      "/registrations/customer-groups/all"
    );
    setCustomerGroupsData(data);
  };

  // ********************
  useEffect(() => {
    if (!isOpen) return;
    getManagers();
    getRepresentatives();
    getFamilies();
    getProductGroups();
    getCustomerGroups();
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isLoading) return false;
        onClose(false);
      }}
    >
      <DialogContent
        className="min-w-[90%] w-[90%]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Reajuste de Metas</DialogTitle>
          <DialogDescription>
            Utilize esta janela para realizar alterações nos valores das metas
            de forma mais abrangente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-6 gap-2">
          <div className="flex flex-col gap-y-2">
            <div className="form-group">
              <Label>Ano</Label>
              <Input
                disabled={isLoading}
                type="number"
                min={2020}
                max={2072}
                step={1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2 border p-2 rounded-md ">
              <h3 className="text-xs text-muted-foreground font-semibold flex items-center gap-x-2">
                Para os Meses
              </h3>
              {DEFAULT_MONTHS_NAME.map((month, index) => (
                <Label key={index}>
                  <Checkbox
                    checked={getMonthIsSelected(index)}
                    onCheckedChange={() => handleSelectMonth(index)}
                    disabled={isLoading}
                  />{" "}
                  {month}
                </Label>
              ))}
              <Button
                type="button"
                onClick={() => handleSelectMonths()}
                size="sm"
                className="text-xs px-1.5 py-0 h-7"
                disabled={isLoading}
              >
                Marca/Desmarca
              </Button>
            </div>
          </div>
          <div className="space-y-2 border p-2 rounded-md ">
            <h3 className="text-xs text-muted-foreground font-semibold flex items-center gap-x-2">
              Para os Gerentes Comerciais
            </h3>
            {managersData.map((manager, index) => (
              <Label key={index}>
                <Checkbox
                  disabled={isLoading}
                  checked={getManagerIsSelected(manager)}
                  onCheckedChange={() => handleSelectManager(manager)}
                />{" "}
                {manager}
              </Label>
            ))}
            <Button
              type="button"
              onClick={() => handleSelectManagers()}
              size="sm"
              disabled={isLoading}
              className="text-xs px-1.5 py-0 h-7"
            >
              Marca/Desmarca
            </Button>
          </div>

          <div className="space-y-2 border p-2 rounded-md ">
            <h3 className="text-xs text-muted-foreground font-semibold flex items-center gap-x-2">
              Para os Representantes
            </h3>
            <ScrollArea className="h-[400px]">
              {representativesData.map((rep, index) => (
                <Label key={index} className="mb-2">
                  <Checkbox
                    disabled={isLoading}
                    checked={getRepresentativeIsSelected(rep.id)}
                    onCheckedChange={() => handleSelectRepresentative(rep.id)}
                  />{" "}
                  {rep.id} - {rep.abbreviation}
                </Label>
              ))}
            </ScrollArea>
            <Button
              type="button"
              onClick={() => handleSelectRepresentatives()}
              size="sm"
              disabled={isLoading}
              className="text-xs px-1.5 py-0 h-7"
            >
              Marca/Desmarca
            </Button>
          </div>

          <div className="space-y-2 border p-2 rounded-md ">
            <h3 className="text-xs text-muted-foreground font-semibold flex items-center gap-x-2">
              Para as Famílias Comerciais
            </h3>
            <ScrollArea className="h-[400px]">
              {familiesData.map((family, index) => (
                <Label key={index} className="mb-2">
                  <Checkbox
                    disabled={isLoading}
                    checked={getFamilyIsSelected(family.id)}
                    onCheckedChange={() => handleSelectFamily(family.id)}
                  />{" "}
                  {family.id} - {family.name}
                </Label>
              ))}
            </ScrollArea>
            <Button
              type="button"
              onClick={() => handleSelectFamilies()}
              size="sm"
              className="text-xs px-1.5 py-0 h-7"
              disabled={isLoading}
            >
              Marca/Desmarca
            </Button>
          </div>

          <div className="space-y-2 border p-2 rounded-md ">
            <h3 className="text-xs text-muted-foreground font-semibold flex items-center gap-x-2">
              Para os Grupos de Estoque
            </h3>
            <ScrollArea className="h-[400px]">
              {productGroupsData.map((group, index) => (
                <Label key={index} className="mb-2">
                  <Checkbox
                    disabled={isLoading}
                    checked={getProductGroupIsSelected(group.id)}
                    onCheckedChange={() => handleSelectProductGroup(group.id)}
                  />{" "}
                  {group.id} - {group.name}
                </Label>
              ))}
            </ScrollArea>
            <Button
              type="button"
              onClick={() => handleSelectProductGroups()}
              size="sm"
              disabled={isLoading}
              className="text-xs px-1.5 py-0 h-7"
            >
              Marca/Desmarca
            </Button>
          </div>

          <div className="space-y-2 border p-2 rounded-md ">
            <h3 className="text-xs text-muted-foreground font-semibold flex items-center gap-x-2">
              Para os Grupos de Clientes
            </h3>
            <ScrollArea className="h-[400px]">
              {customerGroupsData.map((group, index) => (
                <Label key={index} className="mb-2">
                  <Checkbox
                    disabled={isLoading}
                    checked={getCustomerGroupIsSelected(group.id)}
                    onCheckedChange={() => handleSelectCustomerGroup(group.id)}
                  />{" "}
                  {group.id} - {group.name}
                </Label>
              ))}
            </ScrollArea>
            <Button
              type="button"
              onClick={() => handleSelectCustomerGroups()}
              size="sm"
              className="text-xs px-1.5 py-0 h-7"
              disabled={isLoading}
            >
              Marca/Desmarca
            </Button>
          </div>
        </div>
        <div className="max-w-xs">
          <div className="form-group">
            <Label>Percentual</Label>
            <NumericFormat
              value={percent}
              onValueChange={(e) => setPercent(e.floatValue ?? 0)}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={false}
              valueIsNumericString
              max={999999}
              min={0}
              suffix="%"
              placeholder="Digite o Percentual"
              className="form-input"
            />
          </div>
        </div>
        <div className="flex justify-between w-full flex-1">
          <div className="flex gap-x-2">
            <Button
              variant="blue"
              onClick={() => handleSave()}
              disabled={isLoading}
            >
              {isLoading && (
                <div className="flex gap-x-2">
                  <Loader2Icon className="animate-spin" />
                  Aguarde...
                </div>
              )}
              {!isLoading && <span>Gravar</span>}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onClose(false)}
              disabled={isLoading}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
