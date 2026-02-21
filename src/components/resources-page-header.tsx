import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ResourcesPageHeaderProps {
  title: string;
  action?: ReactNode;
  loading?: boolean;
  filters?: ReactNode;
}

export const ResourcesPageHeader = ({ title, action, loading, filters }: ResourcesPageHeaderProps) => {
  return (
    <>
      <div className="flex flex-col space-y-4 mb-6 mt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            {title} {loading && <Loader2 className="animate-spin ml-2" />}
          </h1>
          <div className="flex items-center gap-3">
            {filters && <div className="flex flex-wrap items-center gap-3">{filters}</div>}
            {action}
          </div>
        </div>
      </div>
    </>
  );
};
