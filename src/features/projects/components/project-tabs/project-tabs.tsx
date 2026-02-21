import { useTranslation } from 'react-i18next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectRequirements, AllRequirements } from '../project-requirements';

export const ProjectTabs = ({ projectId }) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-5 h-auto bg-transparent border-b py-0.5 px-0.5 mb-2 rounded-md">
        <TabsTrigger className="custom-tabs-trigger" value="overview">
          {t('projects.tabs.overview')}
        </TabsTrigger>
        <TabsTrigger className="custom-tabs-trigger" value="requirements">
          {t('projects.tabs.requirements')}
        </TabsTrigger>
        <TabsTrigger className="custom-tabs-trigger" value="qa">
          {t('projects.tabs.qa')} <Badge variant="default" className="ml-2 text-xs w-5 h-5 flex items-center justify-center">3</Badge>
        </TabsTrigger>
        <TabsTrigger className="custom-tabs-trigger" value="functional-specifications">
          {t('projects.tabs.functionalSpecifications')}
        </TabsTrigger>
        <TabsTrigger className="custom-tabs-trigger" value="work-breakdown">
          {t('projects.tabs.workBreakdown')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>{t('projects.overview.title')}</CardTitle>
            <CardDescription>
              {t('projects.overview.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <h1></h1>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="requirements">
        <AllRequirements 
          projectId={projectId}
        />
      </TabsContent>
      
      <TabsContent value="qa">
        <Card>
          <CardHeader>
            <CardTitle>{t('projects.qa.title')}</CardTitle>
            <CardDescription>
              {t('projects.qa.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Q&A content will go here */}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="functional-specifications">
        <Card>
          <CardHeader>
            <CardTitle>{t('projects.functionalSpecifications.title')}</CardTitle>
            <CardDescription>
              {t('projects.functionalSpecifications.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Functional specifications content will go here */}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="work-breakdown">
        <Card>
          <CardHeader>
            <CardTitle>{t('projects.workBreakdown.title')}</CardTitle>
            <CardDescription>
              {t('projects.workBreakdown.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Work breakdown content will go here */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
