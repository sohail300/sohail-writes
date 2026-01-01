// Type definitions for the Blog model

export interface BlogType {
  _id: string;
  title: string;
  excerpt: string;
  platform: string;
  url: string;
  image: string;
  publishedAt: Date | string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  formattedDate?: string;
}

export interface CreateBlogInput {
  title: string;
  excerpt: string;
  platform: "Medium" | "Dev.to" | "Hashnode" | "Personal Blog" | "Other";
  url: string;
  image: string;
  publishedAt: Date | string;
  tags?: string[];
  isPublished?: boolean;
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {}

export interface BlogApiResponse {
  success: boolean;
  data?: BlogType | BlogType[];
  count?: number;
  error?: string;
  details?: any;
  message?: string;
}

export type PlatformType =
  | "Medium"
  | "Dev.to"
  | "Hashnode"
  | "Personal Blog"
  | "Other";

export interface BlogFilters {
  platform?: PlatformType | PlatformType[];
  tag?: string | string[];
  search?: string;
  limit?: number;
  page?: number;
  isPublished?: boolean;
  sort?: "asc" | "desc";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogType[];
  pagination: PaginationMeta;
  error?: string;
}

