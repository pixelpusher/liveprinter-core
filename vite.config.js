import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./js/liveprinter.js"),
      name: "liveprinter-core",
      // the proper extensions will be added
      fileName: "liveprinter"
    },

    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // external: ["LivePrinter", "spiral_printer"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        // globals: "Printer",
      },
    },
  },
});
