import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add startup diagnostic information
console.log("Application starting...");
console.log("Environment:", import.meta.env.MODE);
console.log("Supabase URL configured:", Boolean(import.meta.env.VITE_SUPABASE_URL));
console.log("Supabase key configured:", Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY));

// Log any unexpected errors during initialization
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
    console.log("Application rendered successfully");
  } else {
    console.error("Root element not found");
  }
} catch (error) {
  console.error("Error during application initialization:", error);
}
