import { createTheme } from "@mantine/core";
import { inter } from "./fonts";

const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  components: {
    Input: {
      defaultProps: {
        size: "md",
      },
      vars: () => ({
        root: { "--input-fz": "16px" },
      }),
    },
    TextInput: {
      defaultProps: {
        size: "md",
      },
    },
    Select: {
      defaultProps: {
        size: "md",
      },
    },
    MultiSelect: {
      defaultProps: {
        size: "md",
      },
    },
    NumberInput: {
      defaultProps: {
        size: "md",
      },
    },
    DateInput: {
      defaultProps: {
        size: "md",
      },
    },
    DatePickerInput: {
      defaultProps: {
        size: "md",
      },
    },
  },
});

export default theme;
