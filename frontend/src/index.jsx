import axios from "axios"
import { createRoot } from "react-dom/client";

import { App } from "./App";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

createRoot(document.getElementById("root")).render(<App />);
