import { createTheme } from "@mantine/core";
import { inter } from "./fonts";

const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  components: {
    Input: {
      vars: () => ({
        root: { "--input-fz": "max(16px, 1em)" },
      }),
    },
  },
});

export default theme;
