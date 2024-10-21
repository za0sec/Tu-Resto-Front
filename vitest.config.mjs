import { defineConfig } from "vite"; // Asegúrate de que solo hay una importación de defineConfig
import { defineConfig as defineVitestConfig } from "vitest/config"; // Puedes cambiar el nombre al import para evitar conflictos
import react from "@vitejs/plugin-react"; // Asegúrate de que este import también esté presente

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Configuración de vitest para usar jsdom
    css: false,
  },
});
  