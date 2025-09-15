import { createRoot } from "react-dom/client";
import App from "./components/App";
import React from "react";
import "../styles/tailwind.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render((<App />));
