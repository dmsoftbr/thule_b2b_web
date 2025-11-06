export type PagedRequestModel = {
  currentPage?: number;
  pageSize?: number;
  sortField?: string;
  sortAsc?: boolean;
  searchText?: string;
  searchField?: string;
  customWhere?: string;
};
