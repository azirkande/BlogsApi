import { sort } from  'fast-sort';
import { Post } from '../types/interfaces';
import { PostSortBy, SortDirection } from '../types/aliasTypes';
import { getApiConfigurations } from '../config/config';
import axios from 'axios';

const filterDuplicatePosts = (allPosts: Post[]): Post[] => {

    if(!allPosts || allPosts === null ) return [];
    return allPosts.reduce(function (distinctPosts: Post[], post: Post) {
        if(distinctPosts.findIndex(newPost=> newPost.id === post.id) === -1){
            distinctPosts.push(post);
        }
         return distinctPosts;
       }, []);
    
}

const sortPosts = (posts: Post[], sortBy: PostSortBy, sortDirection: SortDirection ): Post[]=> {
   if(sortDirection === 'desc'){
       return sort(posts).desc(p=> p[sortBy]);
   }

   return sort(posts).asc(p=> p[sortBy]);
}

const getPostsByTagAxiosHelper = async (resourceUrl: string): Promise<{ posts: Post[]; }> => {
    
    const result = await axios.get(resourceUrl);
    if(result && result.status === 200){
        return result.data as {posts: Post[]};
    }
    return  {posts: []};
}


const getPostsByTags = async (tags: string[],sortBy: PostSortBy, sortDirection: SortDirection, 
            ): Promise<Post[]> => {
            
            if(!tags || tags === null || tags.length === 0)
                return [];
            
            const {  assessmentApiBaseUrl } = getApiConfigurations(); 
            let allPosts:Post[] = [];
             for(let tag of tags){
                const apiUrl = `${assessmentApiBaseUrl}/blog/posts?tag=${tag}`
                const response =  await getPostsByTagAxiosHelper(apiUrl);
                allPosts.push(...response.posts);
             }
     
             const distinctPosts = filterDuplicatePosts(allPosts)
             const sortedPosts =  sortPosts(distinctPosts,sortBy,sortDirection);
     
            return sortedPosts;
    
}

export { getPostsByTags }