import * as postService from "../../../src/services/postService";
import { Post } from "../../../src/types/interfaces";
import { mockPostsWithDuplicates } from '../mockData/mockdata';
import axios, { AxiosRequestConfig } from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../../src/config/config", () => ({
    getApiConfigurations: () => {
    return {
      assessmentApiBaseUrl: "http://dummyUrl",
    };
  },
}));

afterEach(() => {
    jest.clearAllMocks();
  });


describe("get distinct sorted posts by sort criteria", () => {

test("should not return posts when no tags specified", async () => {
    const posts = await postService.getPostsByTags([],"id","asc");
    expect(posts).toHaveLength(0);
    });

test("should execute blogs api with valid url and queryparams", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockPostsWithDuplicates,
      });
    const posts = await postService.getPostsByTags(["tech"],"id","asc");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(1,"http://dummyUrl/blog/posts?tag=tech");
    });

test("should return distinct posts for multiple matching tags ", async () => {
    const tags = ["tech","science"];
    mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockPostsWithDuplicates,
      });
    const posts = await postService.getPostsByTags(tags,"id","asc");
    expect(posts).toHaveLength(4);
    expect(mockedAxios.get).toHaveBeenNthCalledWith(1,"http://dummyUrl/blog/posts?tag=tech");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(2,"http://dummyUrl/blog/posts?tag=science");
});
  test("should return distinct post in ascending order of postid", async () => {
    const tags = ["tech"];
    mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockPostsWithDuplicates,
      });
    const posts = await postService.getPostsByTags(tags,"id","asc");
    expect(posts).toHaveLength(4);
    expect(posts[0].id).toBe(1);
    expect (posts[3].id).toBe(4);
  });

  test("should return distinct post in descending order of authorId", async () => {
    const tags = ["tech"];
    mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockPostsWithDuplicates,
      });
    const posts = await postService.getPostsByTags(tags,"authorId","desc");
    expect(posts).toHaveLength(4);
    expect(posts[3].authorId).toBe(6);
    expect (posts[0].authorId).toBe(12);
  });

  test("should return distinct post in descending order of author name", async () => {
    const tags = ["tech"];
    mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockPostsWithDuplicates,
      });
    const posts = await postService.getPostsByTags(tags,"author","desc");
    expect(posts).toHaveLength(4);
    expect(posts[3].author).toBe("Amrita");
    expect (posts[0].author).toBe("Prashant");
  });

});
