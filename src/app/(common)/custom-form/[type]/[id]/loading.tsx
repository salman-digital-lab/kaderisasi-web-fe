import { Container, Paper } from "@mantine/core";
import { FormSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <Container size="md" component="main" py={{ base: "md", sm: "xl" }} px={{ base: "xs", sm: "md" }}>
      <Paper
        radius="md"
        withBorder
        p={{ base: "md", sm: "xl" }}
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <FormSkeleton fields={6} />
      </Paper>
    </Container>
  );
}

