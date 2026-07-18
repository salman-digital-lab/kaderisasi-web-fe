import { Button, Group, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import LinkButton from "@/components/common/LinkButton";
import {
  buildClubsHref,
  getPaginationItems,
  type ClubListQuery,
} from "@/features/clubs/list-query";

type ClubPaginationProps = ClubListQuery & {
  totalPages: number;
};

export default function ClubPagination({
  search,
  clubType,
  page,
  totalPages,
}: ClubPaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages);

  return (
    <nav aria-label="Navigasi halaman daftar klub">
      <Group justify="center" gap="xs" wrap="wrap">
        {page > 1 ? (
          <LinkButton
            href={buildClubsHref({ search, clubType, page: page - 1 })}
            variant="default"
            size="md"
            mih={44}
            leftSection={<IconChevronLeft size={16} aria-hidden="true" />}
            aria-label="Halaman sebelumnya"
          >
            Sebelumnya
          </LinkButton>
        ) : (
          <Button
            variant="default"
            size="md"
            mih={44}
            leftSection={<IconChevronLeft size={16} aria-hidden="true" />}
            disabled
          >
            Sebelumnya
          </Button>
        )}

        <Group
          gap={4}
          visibleFrom="sm"
          aria-label={`Halaman ${page} dari ${totalPages}`}
        >
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <Text key={`ellipsis-${index}`} px="xs" aria-hidden="true">
                …
              </Text>
            ) : (
              <LinkButton
                key={item}
                href={buildClubsHref({ search, clubType, page: item })}
                variant={item === page ? "filled" : "subtle"}
                size="md"
                mih={44}
                px="sm"
                aria-label={`Halaman ${item}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </LinkButton>
            ),
          )}
        </Group>

        <Text hiddenFrom="sm" size="md" aria-live="polite">
          {page} / {totalPages}
        </Text>

        {page < totalPages ? (
          <LinkButton
            href={buildClubsHref({ search, clubType, page: page + 1 })}
            variant="default"
            size="md"
            mih={44}
            rightSection={<IconChevronRight size={16} aria-hidden="true" />}
            aria-label="Halaman berikutnya"
          >
            Berikutnya
          </LinkButton>
        ) : (
          <Button
            variant="default"
            size="md"
            mih={44}
            rightSection={<IconChevronRight size={16} aria-hidden="true" />}
            disabled
          >
            Berikutnya
          </Button>
        )}
      </Group>
    </nav>
  );
}
