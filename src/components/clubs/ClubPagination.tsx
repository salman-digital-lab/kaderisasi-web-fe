import type { ReactElement } from "react";
import CataloguePagination from "@/components/common/Catalogue/CataloguePagination";
import {
  buildClubsHref,
  type ClubListQuery,
} from "@/features/clubs/list-query";

type ClubPaginationProps = ClubListQuery & { totalPages: number };

export default function ClubPagination({
  search,
  clubType,
  page,
  totalPages,
}: ClubPaginationProps): ReactElement {
  return (
    <CataloguePagination
      label="Navigasi halaman daftar klub"
      page={page}
      totalPages={totalPages}
      hrefForPage={(nextPage) =>
        buildClubsHref({ search, clubType, page: nextPage })
      }
    />
  );
}
