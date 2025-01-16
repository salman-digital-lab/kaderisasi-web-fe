export type Pagination = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string;
  previous_page_url?: string;
};

export type APIResponse<T> = {
  message: string;
  data: T;
};

export type APIPagiResponse<T> = APIResponse<{
  meta: Pagination;
  data: T[];
}>;
