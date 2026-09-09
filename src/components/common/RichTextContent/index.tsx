import type { ReactElement } from "react";
import { Typography } from "@mantine/core";
import classes from "./index.module.css";

type RichTextContentProps = {
  html: string;
};

function normalizeEditorHeadings(html: string): string {
  return html.replace(/<(\/?)h[12](?=[\s>])/gi, "<$1h3");
}

export default function RichTextContent({
  html,
}: RichTextContentProps): ReactElement {
  return (
    <Typography className={classes.root}>
      <div
        dangerouslySetInnerHTML={{ __html: normalizeEditorHeadings(html) }}
      />
    </Typography>
  );
}
