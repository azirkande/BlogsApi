import { Post } from "./interfaces";

export type PostSortBy =  keyof Omit<Post, 'tags'> ;
export type SortDirection = 'asc' | 'desc';