export interface IPaginationResponse<T> {
  results: T[];
  pagination: {
    total: number;
  };
}
