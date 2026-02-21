import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Search, FileText, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateRequirementModal from './create-requirement-modal';

const RequirementsList = ({ 
  requirements, 
  selectedRequirement, 
  onSelectRequirement,
  projectId,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredRequirements = requirements.filter((requirement) =>
    requirement.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card className="p-0 max-w-[25%] flex-1">
        <CardHeader className="p-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t('projects.requirements.list')}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="h-8 px-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('projects.requirements.searchPlaceholder')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-[calc(100vh-250px)]">
            {filteredRequirements && filteredRequirements.length > 0 ? (
              filteredRequirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className={
                    cn(
                      "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-muted cursor-pointer mb-2",
                      selectedRequirement?.id === requirement.id && "bg-muted"
                    )
                  }
                  onClick={() => onSelectRequirement(requirement)}
                >
                  <div className={cn("mt-0.5 rounded-md p-1", "bg-blue-50")}>
                    <FileText
                      className={cn("h-4 w-4", "text-blue-500")}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium leading-none">{requirement.name}</p>
                      <Badge variant="outline" className="ml-2 text-xs">
                        v{requirement.version || '1.0'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>
                        {t('projects.requirements.lastUpdated')} {format(new Date(requirement.updatedAt || new Date()), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {t('projects.requirements.noRequirements')}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create Requirement Modal */}
      <CreateRequirementModal
        projectId={projectId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
};

export default RequirementsList;
