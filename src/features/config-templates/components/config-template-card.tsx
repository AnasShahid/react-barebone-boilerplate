import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditConfigTemplateSheet } from "./edit-config-template";
import { useDeleteConfigTemplateMutation, useGetAllConfigTemplatesQuery } from "../services";

interface ConfigTemplate {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
  estimation_mode?: string;
  hours_per_day?: number;
  buffer_percentage?: number;
  mappings?: unknown[];
  [key: string]: unknown;
}

interface ConfigTemplateCardProps {
  configTemplate: ConfigTemplate;
}

export function ConfigTemplateCard({ configTemplate }: ConfigTemplateCardProps) {
  const { t } = useTranslation();
  const [deleteConfigTemplate, { isLoading: isDeleting }] = useDeleteConfigTemplateMutation();
  const { refetch } = useGetAllConfigTemplatesQuery();

  const handleDelete = async () => {
    try {
      await deleteConfigTemplate(configTemplate.id).unwrap();
      toast.success(t("config-templates.deleteSuccess", "Configuration template deleted successfully"));
      refetch();
    } catch (error) {
      console.error("Failed to delete configuration template:", error);
      toast.error(t("config-templates.deleteError", "Failed to delete configuration template"));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-start">
            <div><h3 className="text-xl font-semibold tracking-tight">{configTemplate?.name || "Unnamed Template"}</h3></div>
            <div className="flex items-center space-x-2">
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${configTemplate?.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {configTemplate?.is_active ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
                {configTemplate?.description || "No description"}
              </CardDescription>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs"><p>{configTemplate?.description || "No description"}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Estimation Mode</span>
                <span className="text-sm font-medium">
                  {configTemplate?.estimation_mode
                    ? configTemplate.estimation_mode.charAt(0).toUpperCase() + configTemplate.estimation_mode.slice(1)
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Hours Per Day</span>
                <span className="text-sm font-medium">{configTemplate?.hours_per_day || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Buffer</span>
                <span className="text-sm font-medium">{configTemplate?.buffer_percentage ? `${configTemplate.buffer_percentage}%` : "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Service Roles</span>
                <span className="text-sm font-medium">{(configTemplate?.mappings as unknown[])?.length || 0} attached</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={isDeleting}>Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("config-templates.deleteConfirmTitle", "Are you absolutely sure?")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("config-templates.deleteConfirmDescription", "This action cannot be undone.")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {isDeleting ? t("config-templates.deleting", "Deleting...") : t("config-templates.delete", "Delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <EditConfigTemplateSheet
          triggerButton={<Button>Update</Button>}
          configTemplateId={configTemplate?.id}
          onConfigTemplateUpdated={() => { refetch(); }}
        />
      </CardFooter>
    </Card>
  );
}
