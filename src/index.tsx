import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";
import { ThemeProvider } from "@material-tailwind/react";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </>
);
reportWebVitals();
