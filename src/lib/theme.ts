import { createTheme } from "@mantine/core";
import { inter } from "./fonts";

const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  defaultRadius: "sm",
  headings: {
    sizes: {
      h1: {
        fontSize: "clamp(2.125rem, 4vw, 3rem)",
        lineHeight: "1.15",
      },
      h2: {
        fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
        lineHeight: "1.2",
      },
      h3: {
        fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
        lineHeight: "1.25",
      },
      h4: {
        fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
        lineHeight: "1.3",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
    },
    ActionIcon: {
      defaultProps: {
        size: "lg",
      },
    },
    Badge: {
      defaultProps: {
        size: "md",
      },
    },
    Burger: {
      defaultProps: {
        size: "md",
      },
    },
    Menu: {
      defaultProps: {
        width: 220,
      },
    },
    Title: {
      defaultProps: {
        order: 2,
      },
    },
    Container: {
      defaultProps: {
        px: "md",
      },
    },
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
    Textarea: {
      defaultProps: {
        size: "md",
      },
    },
    PasswordInput: {
      defaultProps: {
        size: "md",
      },
    },
    NativeSelect: {
      defaultProps: {
        size: "md",
      },
    },
  },
});

export default theme;
