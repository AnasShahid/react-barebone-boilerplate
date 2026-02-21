import { TableIcon, Grid2X2Icon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from "react-i18next";

interface LayoutSwitcherProps {
  layout: string;
  setLayout: (value: string) => void;
}

export const LayoutSwitcher = ({ layout, setLayout }: LayoutSwitcherProps) => {
  const { t } = useTranslation();

  return (
    <ToggleGroup size="sm" type="single" value={layout} onValueChange={(value) => value && setLayout(value)}>
      <ToggleGroupItem size="sm" value="grid" aria-label={t("customers.layoutSwitcher.gridLayout")}>
        <Grid2X2Icon className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">{t("customers.layoutSwitcher.cards")}</span>
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="table" aria-label={t("customers.layoutSwitcher.tableLayout")}>
        <TableIcon className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">{t("customers.layoutSwitcher.table")}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
