import { Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import type { ReactElement, ReactNode } from "react";
import PageContainer from "./PageContainer";

type PageStateProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export default function PageState({
  title,
  description,
  children,
}: PageStateProps): ReactElement {
  return (
    <PageContainer size="sm">
      <Paper withBorder radius="md" p={{ base: "lg", sm: "xl" }}>
        <Stack align="center" gap="lg" ta="center">
          <ThemeIcon size={56} radius="xl" variant="light">
            <IconInfoCircle size={28} aria-hidden />
          </ThemeIcon>
          <Title order={1} size="h2">
            {title}
          </Title>
          <Text c="dimmed" maw="55ch" style={{ overflowWrap: "anywhere" }}>
            {description}
          </Text>
          {children}
        </Stack>
      </Paper>
    </PageContainer>
  );
}
