
import { PostSortBy, SortDirection } from "../types/aliasTypes";
import { PostResultStatus } from "../types/enums";
import { isSortByOptionValid, isSortDirectionOptionValid } from "../types/guards/customGuards";
import { Post, PostResponse } from "../types/interfaces";
import { parseTags } from "../utitlity/tagsParser";
import { getPostsByTags as getPostsByTagsService} from '../services/postService';

const validateInputs = (tags: string, sortBy: PostSortBy, sortDirection: SortDirection): PostResultStatus => {
    if(!tags || tags?.length === 0)
        return  PostResultStatus.TAGS_REQUIRED; 
    if(!sortBy || !isSortByOptionValid(sortBy))
        return PostResultStatus.INVALID_SORTBY_VALUE;
    if(!sortDirection || !isSortDirectionOptionValid(sortDirection))
        return PostResultStatus.INVALID_SORTDIRECTION_VALUE;
    return PostResultStatus.VALID_INPUTS;
}

const getPostsByTags = async (tags: string, sortBy: PostSortBy ="id", sortDirection: SortDirection="asc"): Promise<PostResponse> => {
  
    const result = validateInputs(tags, sortBy, sortDirection);

    try{
        if(result === PostResultStatus.VALID_INPUTS)
        {
            const inputTags = parseTags(tags);
            const posts = await getPostsByTagsService(inputTags,sortBy,sortDirection);
            return {
                status : PostResultStatus.SUCCESS,
                posts 
            };
        }
         
    }catch(err){
        console.log(err);
        return {
            status: PostResultStatus.INTERNAL_SERVER_ERROR
        } 
    }
    
   return {
       status : result
   };
}

export { getPostsByTags };