export interface ApiResponse<T> {
  data: T;
  status: number;
  error?: Error;
}

export interface Error {
  message?: string;
}

enum Type {
  STORY = "story",
}

export interface Story {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: Type;
  url: string;
}

export interface Pagination {
  page: number;
  limit: number;
}
