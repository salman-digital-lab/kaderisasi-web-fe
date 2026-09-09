import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MantineProvider } from "@mantine/core";
import type { CustomFormField } from "@/types/api/customForm";
import Renderer from "./index";
import { validateCustomFormFields } from "./validation";
const field: CustomFormField = {
  key: "answer",
  label: "Jawaban",
  type: "text",
  required: true,
};
describe("custom registration fields", () => {
  it("accepts required numeric zero", () =>
    expect(
      validateCustomFormFields([{ ...field, type: "number" }], { answer: 0 }),
    ).toEqual({}));
  it("ignores required hidden and disabled fields", () => {
    for (const flag of ["hidden", "disabled"])
      expect(
        validateCustomFormFields([{ ...field, [flag]: true }], {}),
      ).toEqual({});
  });
  it("rejects whitespace and empty selections", () => {
    for (const answer of ["  ", []])
      expect(validateCustomFormFields([field], { answer })).toHaveProperty(
        "answer",
      );
  });
  it("handles malformed patterns without crashing", () =>
    expect(
      validateCustomFormFields([{ ...field, validation: { pattern: "[" } }], {
        answer: "test",
      }),
    ).toHaveProperty("answer"));
  it("renders a single checkbox with its checked default", () => {
    const markup = renderToStaticMarkup(
      <MantineProvider>
        <Renderer
          section={{
            section_name: "Test",
            fields: [{ ...field, type: "checkbox", defaultValue: true }],
          }}
          formData={{}}
          onSubmit={() => {}}
          isLastSection={false}
        />
      </MantineProvider>,
    );
    expect(markup).toMatch(/type="checkbox"[^>]*checked=""/);
  });
});
