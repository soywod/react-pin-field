import { resolve } from "path";
import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default {
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "PinField",
      fileName: "react-pin-field",
    },
    sourcemap: true,
    minify: true,
    emptyOutDir: true,
    rollupOptions: {
      external: ["react"],
      output: {
        exports: "named",
        globals: {
          react: "React",
        },
      },
    },
  },
} satisfies UserConfig;
