import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: "./src/index.ts",
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
});
