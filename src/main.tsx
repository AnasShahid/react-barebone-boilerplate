import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App";
import { ClerkProvider } from '@clerk/clerk-react';
import { env } from "@/config/env";
import { ConfigurationError } from "@/components/configuration-error";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {!env.isValid ? (
      <ConfigurationError missingVars={env.missingVars} />
    ) : (
      <ClerkProvider
        publishableKey={env.CLERK_PUBLISHABLE_KEY}
        afterSignOutUrl="/auth/login"
        signInFallbackRedirectUrl="/auth/login"
        signUpFallbackRedirectUrl="/auth/signup"
      >
        <App />
      </ClerkProvider>
    )}
  </StrictMode>,
)
