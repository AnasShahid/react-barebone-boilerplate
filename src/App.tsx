import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { Toaster } from "@/components/ui/sonner"
import { PersistGate } from 'redux-persist/integration/react';
import { ClerkTokenSync } from "@/components/clerk-token-sync";

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute="class">
          <ClerkTokenSync />
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
