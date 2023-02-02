export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  error?: Error;
}

export interface Error {
  message?: string;
}

export enum Type {
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
  text?: string;
  type: Type;
  url?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface StoriesListSuccessResponse {
  stories: Story[];
  pagination: Pagination;
}
