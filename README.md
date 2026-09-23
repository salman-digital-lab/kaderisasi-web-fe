This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Mantine core styles

The root layout imports `src/app/mantine.css` instead of the full core stylesheet.
The generated list includes styles for components used in `src`, their internal
dependencies, and components used by Mantine extensions (dates, carousel, modals,
and notifications). It preserves the installed Mantine package's cascade order.

After adding a Mantine component or upgrading Mantine, run `npm run styles:mantine`
and check the affected pages and interactive states. `npm run lint` includes
`check:mantine-css` to detect an outdated list. The generator follows named
imports in the installed ESM packages and fails if their layout cannot be
resolved; review it when upgrading Mantine. Keep dates and carousel styles with
their consuming components, and application overrides after the core imports.

Individual styles in Mantine 9.6.2 use px, while its full bundle uses scalable
rem values. `scripts/postcss-mantine-rem.cjs` applies Mantine's autoRem conversion
only to individual core styles, preserving text zoom and `--mantine-scale`
without converting application or extension CSS. The lint check also tests this
boundary.
