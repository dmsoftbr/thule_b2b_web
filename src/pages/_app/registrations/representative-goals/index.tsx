import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepresentativesService } from "@/services/representatives.service";
import { createFileRoute } from "@tanstack/react-router";
import { FilterIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { UploadModal } from "./-components/upload-modal";
import { GoalsTable } from "./-components/goals-table.tsx";

export const Route = createFileRoute(
  "/_app/registrations/representative-goals/"
)({
  component: RepresentativeGoalsPageComponent,
});

function RepresentativeGoalsPageComponent() {
  const [representativesData, setRepresentativesData] = useState<
    SearchComboItem[]
  >([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  async function getRepresentatives() {
    const data = await new RepresentativesService().getAll();
    const newData: SearchComboItem[] = data.map((rep) => {
      return {
        value: rep.id.toString(),
        label: `${rep.abbreviation}`,
        extra: rep,
        keyworks: [rep.id.toString(), rep.abbreviation, rep.name],
      };
    });
    setRepresentativesData(newData);
  }

  useEffect(() => {
    getRepresentatives();
  }, []);

  return (
    <AppPageHeader titleSlot="Metas de Representates">
      <div className="p-2">
        <div className="mb-2 flex gap-x-4">
          <div className="flex flex-col space-y-1 flex-1">
            <Label>Representante:</Label>
            <SearchCombo
              items={representativesData}
              showValueInSelectedItem
              onChange={() => {}}
              placeholder="Todos"
              key={representativesData.length}
            />
          </div>
          <div className="flex flex-col space-y-1 flex-1">
            <Label>Família Comercial:</Label>
            <SearchCombo
              multipleSelect
              showSelectButtons
              items={representativesData}
              showValueInSelectedItem
              onChange={() => {}}
              placeholder="Todas"
              key={representativesData.length}
            />
          </div>
          <div className="flex flex-col space-y-1 ">
            <Label>Ano:</Label>
            <Input
              type="number"
              value={new Date().getFullYear()}
              step={1}
              min={2020}
              max={2072}
            />
          </div>
          <div className="flex flex-col space-y-1 ">
            <Label>Mês:</Label>
            <Select>
              <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Janeiro</SelectItem>
                <SelectItem value="2">Fevereiro</SelectItem>
                <SelectItem value="3">Março</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Maio</SelectItem>
                <SelectItem value="6">Junho</SelectItem>
                <SelectItem value="7">Julho</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Setembro</SelectItem>
                <SelectItem value="10">Outubro</SelectItem>
                <SelectItem value="11">Novembro</SelectItem>
                <SelectItem value="12">Dezembro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="mt-4">
            <FilterIcon className="size-4" />
          </Button>
          <Button
            className="mt-4"
            variant="blue"
            onClick={() => setShowUploadModal(true)}
          >
            <PlusIcon className="size-4" />
            Novo
          </Button>
        </div>

        <GoalsTable />
        {showUploadModal && (
          <UploadModal
            isOpen={showUploadModal}
            onClose={(_) => {
              setShowUploadModal(false);
            }}
          />
        )}
      </div>
    </AppPageHeader>
  );
}
