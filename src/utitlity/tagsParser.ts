export const parseTags = (tags: string): string[] => {
    if(!tags || tags?.length === 0)
    return [];
    return tags.split(',');
}