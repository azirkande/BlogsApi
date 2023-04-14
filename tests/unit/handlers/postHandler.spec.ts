import * as postHandler from "../../../src/handlers/postHandler";
import { PostSortBy, SortDirection } from "../../../src/types/aliasTypes";
import { PostResultStatus } from "../../../src/types/enums";
import { mockPostsWithDuplicates, mockValidPosts } from "../mockData/mockdata";
import { Post } from "../../../src/types/interfaces";

jest.mock("../../../src/services/postService", () => ({
  getPostsByTags: (
    tags: string[],
    axiosPostHelper: (tag: string) => Promise<{ posts: Post[] }>,
    sortBy: PostSortBy,
    sortDirection: SortDirection
  ) => {
    if (tags.includes("error")) throw new Error("Unexpected error");
    return Promise.resolve(mockValidPosts.posts);
  },
}));



afterEach(() => {
  jest.clearAllMocks();
});

describe("validate inputs provided to api", () => {
  test("should validate tags when empty tags provided", async () => {
    const result = await postHandler.getPostsByTags("", "id", "asc");
    const { status, posts } = result;
    expect(status).toBe(PostResultStatus.TAGS_REQUIRED);
    expect(posts).toBeUndefined();
  });

  test("should validate sortby field when invalid option provided", async () => {
    const result = await postHandler.getPostsByTags(
      "science,tech",
      "invalid" as PostSortBy,
      "asc"
    );
    const { status, posts } = result;
    expect(status).toBe(PostResultStatus.INVALID_SORTBY_VALUE);
    expect(posts).toBeUndefined();
  });

  test("should validate sort direction field when invalid option provided", async () => {
    const result = await postHandler.getPostsByTags(
      "science,tech",
      "author",
      "wwwwwww" as SortDirection
    );
    const { status, posts } = result;
    expect(status).toBe(PostResultStatus.INVALID_SORTDIRECTION_VALUE);
    expect(posts).toBeUndefined();
  });
});

describe("Execute post service with valid inputs", () => {
  test("should return posts with all valid inputs", async () => {
    const result = await postHandler.getPostsByTags(
      "science,tech",
      "author",
      "desc"
    );
    const { status, posts } = result;
    expect(status).toBe(PostResultStatus.SUCCESS);
    expect(posts).toHaveLength(4);
  });

  test("should report server error if service fails to return data", async () => {
    const result = await postHandler.getPostsByTags("error", "author", "desc");
    const { status, posts } = result;
    expect(status).toBe(PostResultStatus.INTERNAL_SERVER_ERROR);
    expect(posts).toBeUndefined();
  });

  test("should return posts with default sortby and direction values", async () => {
    const result = await postHandler.getPostsByTags("science,tech");
    const { status, posts } = result;

    expect(status).toBe(PostResultStatus.SUCCESS);
    expect(posts).toHaveLength(4);
    if (posts) {
      expect(posts[0].id as number).toBe(1);
      expect(posts[3].id as number).toBe(4);
    }
  });
});
