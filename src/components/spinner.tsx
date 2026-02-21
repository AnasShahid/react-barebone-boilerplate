import { Loader2 } from 'lucide-react';

export const Spinner = () => {
  return (
    <div className="flex h-full w-full min-h-[300px] min-w-[300px] items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
};
