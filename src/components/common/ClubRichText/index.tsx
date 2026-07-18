import { Typography } from "@mantine/core";
import classes from "./index.module.css";

type ClubRichTextProps = {
  html: string;
};

function normalizeEditorHeadings(html: string): string {
  return html.replace(/<(\/?)h[12](?=[\s>])/gi, "<$1h3");
}

export default function ClubRichText({ html }: ClubRichTextProps) {
  return (
    <Typography className={classes.root}>
      <div
        dangerouslySetInnerHTML={{ __html: normalizeEditorHeadings(html) }}
      />
    </Typography>
  );
}
