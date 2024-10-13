import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import {  store } from "./store/store.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./provider/theme-provider.tsx";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
