import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Container, Text, Title } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
import classes from "./PageLayout.module.css";

type PageHeroProps = {
  title: ReactNode;
  description: ReactNode;
  illustration: StaticImageData;
  children?: ReactNode;
};

export default function PageHero({
  title,
  description,
  illustration,
  children,
}: PageHeroProps): ReactElement {
  return (
    <header className={classes.hero}>
      <Container size="lg" className={classes.heroInner}>
        <div className={classes.heroContent}>
          <Title order={1}>{title}</Title>
          <Text c="dimmed" className={classes.description}>
            {description}
          </Text>
          {children}
        </div>
        <Image
          src={illustration}
          width={376}
          height={356}
          alt=""
          priority
          sizes="(max-width: 62em) 0px, 376px"
          className={classes.heroImage}
        />
      </Container>
    </header>
  );
}
