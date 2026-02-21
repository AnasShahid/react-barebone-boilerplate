import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteServiceRoleMutation, useGetAllServiceRolesQuery } from "../services";
import { EditServiceRoleSheet } from "./edit-service-role";

interface ServiceRole {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export function ServiceRoleCard({ serviceRole }: { serviceRole: ServiceRole }) {
  const { t } = useTranslation();
  const [deleteServiceRole, { isLoading: isDeleting }] = useDeleteServiceRoleMutation();
  const { refetch } = useGetAllServiceRolesQuery();

  const handleDelete = async () => {
    try {
      await deleteServiceRole(serviceRole.id).unwrap();
      toast.success("Service role deleted successfully");
      refetch();
    } catch (error) {
      console.error("Failed to delete service role:", error);
      toast.error("Failed to delete service role");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold tracking-tight">{serviceRole?.name || "Unnamed Role"}</h3>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${serviceRole?.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {serviceRole?.is_active ? "Active" : "Inactive"}
            </div>
          </div>
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
                {serviceRole?.description || "No description"}
              </CardDescription>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs"><p>{serviceRole?.description || "No description"}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Projects Using This Role</span>
            <span className="text-sm font-medium">N/A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Created Date</span>
            <span className="text-sm font-medium">
              {serviceRole?.createdAt ? new Date(serviceRole.createdAt).toLocaleDateString() : "N/A"}
            </span>
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
              <AlertDialogTitle>{t("service-roles.deleteConfirmTitle", "Are you absolutely sure?")}</AlertDialogTitle>
              <AlertDialogDescription>{t("service-roles.deleteConfirmDescription", "This action cannot be undone.")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {isDeleting ? t("service-roles.deleting", "Deleting...") : t("service-roles.delete", "Delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <EditServiceRoleSheet
          triggerButton={<Button>Update</Button>}
          serviceRoleId={serviceRole?.id}
          onServiceRoleUpdated={() => { refetch(); }}
        />
      </CardFooter>
    </Card>
  );
}
