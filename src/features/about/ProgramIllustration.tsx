import type { ReactElement } from "react";

type Props = { program: "ssc" | "lmd" | "spectra" };

export default function ProgramIllustration({ program }: Props): ReactElement {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true" focusable="false">
      <g
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {program === "ssc" ? (
          <>
            <path
              d="M27 42C45 35 61 36 80 47C99 36 115 35 133 42V94C116 88 97 90 80 101C63 90 44 88 27 94V42Z"
              fill="var(--surface-subtle)"
            />
            <path d="M80 47V101M39 54C50 52 61 55 68 59M39 67C50 65 61 68 68 72M92 59C103 54 114 52 122 54M92 72C103 67 114 65 122 67M80 15V27M57 21L62 31M103 21L98 31" />
          </>
        ) : program === "lmd" ? (
          <>
            <circle cx="80" cy="39" r="13" fill="var(--surface-subtle)" />
            <circle cx="35" cy="61" r="10" />
            <circle cx="125" cy="61" r="10" />
            <path d="M57 91V76C57 55 103 55 103 76V91M16 96V86C16 72 46 71 50 82M144 96V86C144 72 114 71 110 82M61 20L49 29M99 20L111 29M59 105H101" />
          </>
        ) : (
          <>
            <path
              d="M22 105V86H60V64H98V40H137V105"
              fill="var(--surface-subtle)"
            />
            <path d="M113 40V10H143L135 20 143 30H113M31 70L81 20M63 20H81V38" />
          </>
        )}
      </g>
    </svg>
  );
}
