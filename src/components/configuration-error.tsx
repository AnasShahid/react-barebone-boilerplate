import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ConfigurationErrorProps {
  missingVars: string[];
}

export function ConfigurationError({ missingVars }: ConfigurationErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Configuration Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Missing environment variables</AlertTitle>
            <AlertDescription>
              The application cannot start because the following required environment variables are
              not set. Please check your <code className="font-mono text-xs">.env</code> file.
            </AlertDescription>
          </Alert>
          <ul className="space-y-1 rounded-md border bg-muted p-3">
            {missingVars.map((varName) => (
              <li key={varName} className="font-mono text-sm text-destructive">
                {varName}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Copy <code className="font-mono text-xs">.env.example</code> to{' '}
            <code className="font-mono text-xs">.env</code> and fill in the required values, then
            restart the development server.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
