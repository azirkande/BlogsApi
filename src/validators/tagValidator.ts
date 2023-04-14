import { parseTags } from '../utitlity/tagsParser';

export const validateTags = (tags: string): boolean => {
    const allTags = parseTags(tags);
    return allTags.length > 0;
}
