import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMS backend (PurchaseEntryController / ReportsController) is annotated with
// @CrossOrigin(origins = "http://localhost:3001"), so the dev server must run on port 3001.
// (Port 3000 is reserved for Gitea on this machine.)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true
  },
  preview: {
    port: 3001,
    strictPort: true
  }
});
