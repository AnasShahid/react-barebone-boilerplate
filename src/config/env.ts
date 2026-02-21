interface EnvConfig {
  APP_ENV: string;
  API_URL: string;
  APP_TITLE: string;
  CLERK_PUBLISHABLE_KEY: string;
  APP_NAME: string;
  missingVars: string[];
  isValid: boolean;
}

interface RequiredVar {
  key: string;
  label: string;
}

const REQUIRED_VARS: RequiredVar[] = [
  { key: 'VITE_APP_ENV', label: 'VITE_APP_ENV' },
  { key: 'VITE_API_URL', label: 'VITE_API_URL' },
  { key: 'VITE_APP_TITLE', label: 'VITE_APP_TITLE' },
  { key: 'VITE_CLERK_PUBLISHABLE_KEY', label: 'VITE_CLERK_PUBLISHABLE_KEY' },
];

function getEnvironmentVariables(): EnvConfig {
  const rawEnv = import.meta.env;

  const missingVars = REQUIRED_VARS
    .filter(({ key }) => !rawEnv[key])
    .map(({ label }) => label);

  return {
    APP_ENV: rawEnv.VITE_APP_ENV ?? '',
    API_URL: rawEnv.VITE_API_URL ?? '',
    APP_TITLE: rawEnv.VITE_APP_TITLE ?? '',
    CLERK_PUBLISHABLE_KEY: rawEnv.VITE_CLERK_PUBLISHABLE_KEY ?? '',
    APP_NAME: 'React-boilerplate AI',
    missingVars,
    isValid: missingVars.length === 0,
  };
}

const envConfig = getEnvironmentVariables();

Object.freeze(envConfig);

export const env: EnvConfig = envConfig;
