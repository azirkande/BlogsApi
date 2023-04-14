import { PostResultStatus } from "./enums";

export interface ApiConfig  {
    assessmentApiBaseUrl: string;
}

export interface serverConfig {
    port: number | string;
        hostName: string;
}

export interface Post {
    id: number;
    author: string;
    authorId: number;
    likes: number;
    popularity: number;
    reads: number;
    tags: string[];

}

export interface PostResponse {
    posts? : Post[]
    error? : {
        error: string;
    }
    status: PostResultStatus;
}

