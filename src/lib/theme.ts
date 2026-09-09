import { createTheme, defaultVariantColorsResolver } from "@mantine/core";
import { inter } from "./fonts";
import classes from "./theme.module.css";

const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  defaultRadius: "md",
  primaryShade: { light: 8, dark: 6 },
  respectReducedMotion: true,
  autoContrast: true,
  variantColorResolver: (input) => {
    const colors = defaultVariantColorsResolver(input);
    if (input.variant !== "light") return colors;
    return {
      ...colors,
      color: `light-dark(color-mix(in srgb, ${colors.color} 80%, black), ${colors.color})`,
    };
  },
  headings: {
    fontWeight: "800",
    sizes: {
      h1: {
        fontSize: "clamp(2rem, 4vw, 2.75rem)",
        lineHeight: "1.2",
      },
      h2: {
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        lineHeight: "1.2",
      },
      h3: {
        fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
        lineHeight: "1.25",
      },
      h4: {
        fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
        lineHeight: "1.3",
      },
    },
  },
  components: {
    Pagination: {
      defaultProps: {
        size: 44,
        hideWithOnePage: true,
        getControlProps: (
          control: "first" | "previous" | "next" | "last",
        ): { "aria-label": string } => ({
          "aria-label": {
            first: "Halaman pertama",
            previous: "Halaman sebelumnya",
            next: "Halaman berikutnya",
            last: "Halaman terakhir",
          }[control],
        }),
      },
    },
    Button: {
      classNames: { root: classes.button, label: classes.buttonLabel },
      defaultProps: {
        size: "md",
      },
    },
    ActionIcon: {
      defaultProps: {
        size: 44,
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
        size: "lg",
        px: { base: "md", sm: "xl" },
      },
    },
    Input: {
      classNames: { input: classes.input },
      defaultProps: {
        size: "md",
      },
      vars: () => ({
        root: { "--input-fz": "16px" },
      }),
    },
    InputWrapper: { classNames: { label: classes.inputLabel } },
    Tabs: { classNames: { tab: classes.tab } },
    Chip: {
      defaultProps: { size: "md" },
      classNames: { label: classes.chipLabel },
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
