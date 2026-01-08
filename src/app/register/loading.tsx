import { Container, Paper, Skeleton } from "@mantine/core";
import classes from "./index.module.css";

export default function Loading() {
  return (
    <Container size={420} my={40}>
      <div className={classes.logo}>
        <Skeleton height={100} width={100} mx="auto" />
      </div>

      <Skeleton height={40} width={200} mx="auto" mt={20} />
      <Skeleton height={20} width={250} mx="auto" mt={5} />
      <Skeleton height={40} width={300} mx="auto" mt={10} />

      <Paper withBorder p={30} mt={24} radius="md">
        <Skeleton height={50} mb={15} />
        <Skeleton height={50} mb={15} />
        <Skeleton height={50} mb={15} />
        <Skeleton height={50} mb={15} />
        <Skeleton height={40} mt={30} />
        <Skeleton height={36} mt="xl" />
      </Paper>
    </Container>
  );
}
