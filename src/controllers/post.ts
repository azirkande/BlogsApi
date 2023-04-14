import { NextFunction, Request, Response } from 'express';
import { PostSortBy, SortDirection } from '../types/aliasTypes';
import * as postHandler from '../handlers/postHandler';
import { Post, PostResponse } from '../types/interfaces';
import { PostResultStatus } from '../types/enums';

export const getPostsByTags = async (req: Request, res: Response, next: NextFunction) => {
    let tags = req.query["tags"] as string;
    let sortBy = req.query["sortby"] as PostSortBy;
    let direction = req.query["direction"] as SortDirection;

    const result = await postHandler.getPostsByTags(tags,sortBy,direction);

    const response = mapApiResponse(result);
    return res.status(response.httpStatus).send(response.body);
   
};

const mapApiResponse = (result: PostResponse): {httpStatus: number, body: {error?: string, posts?: Post[]}} => {
    switch(result.status){
        case PostResultStatus.SUCCESS: {
            return {
                httpStatus: 200,
                body: {
                    posts: result.posts
                }
            };
        }
        case PostResultStatus.INVALID_SORTBY_VALUE: {
            return {
                httpStatus: 400,
                body: {
                    error : "sortby parameter is invalid"
                }
            };
        }
        case PostResultStatus.INVALID_SORTDIRECTION_VALUE: {
            return {
                httpStatus: 400,
                body: {
                    error : "direction parameter is invalid"
                }
            };
        }
        case PostResultStatus.TAGS_REQUIRED: {
            return {
                httpStatus: 400,
                body:{
                    error : "tags parameter is required"
                }
            };
        }
        default: {
            return {
                httpStatus: 500,
                body: {
                    error : "Unexpected server error occurred"
                }
            };
        }
    }
}


