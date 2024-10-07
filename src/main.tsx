import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import {  store } from "./store/store.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./provider/theme-provider.tsx";
import { Toast, ToastProvider } from "./components/ui/toast.tsx";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <ToastProvider>
        <App />
        </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
