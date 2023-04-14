import { AxiosRequestConfig } from "axios";
import request from "supertest";
import app from "../../../src/app";
import { Post } from "../../../src/types/interfaces";
import { mockPostsWithDuplicates } from "../mockData/mockdata";

jest.mock("axios", () => ({
  get: (url: string, config?: AxiosRequestConfig) => {
    if (url.indexOf("NO_MATCH") > 0) {
      return Promise.resolve({
        status: 200,
        data: { posts: [] },
      });
    }
    if (url.indexOf("ERROR_CONDITION") > 0) {
      return Promise.reject({
        status: 500,
        data: { error: "random error" },
      });
    }
    return Promise.resolve({
      status: 200,
      data: mockPostsWithDuplicates,
    });
  },
}));

describe("Get posts by tags", function () {
  test("when matching tag is given with no sortby and direction values then posts are sorted in ascending order of post id", async () => {
    const res = await request(app).get("/api/posts?tags=tech");
    const {
      status,
      body: { posts },
      headers,
    } = res;
    expect(status).toBe(200);
    expect(headers["content-type"]).toContain("application/json");
    expect(posts).toHaveLength(4);
  });

  test("when not matching tag is give then no posts found", async () => {
    const res = await request(app).get("/api/posts?tags=NO_MATCH");
    const {
      status,
      body: { posts },
      headers,
    } = res;
    expect(status).toBe(200);
    expect(headers["content-type"]).toContain("application/json");
    expect(posts).toHaveLength(0);
  });

  test("when tag parameter is not given then no posts found with valid error", async () => {
    const res = await request(app).get("/api/posts");
    const {
      status,
      body: { error },
      headers,
    } = res;
    expect(status).toBe(400);
    expect(headers["content-type"]).toContain("application/json");
    expect(error).toContain("tags parameter is required");
  });

  test("when invalid sortby parameter is  given then no posts found with valid error", async () => {
    const res = await request(app).get("/api/posts?tags=tech&sortby=ssdddd");
    const {
      status,
      body: { error },
      headers,
    } = res;
    expect(status).toBe(400);
    expect(headers["content-type"]).toContain("application/json");
    expect(error).toContain("sortby parameter is invalid");
  });

  test("when invalid direction parameter is given then no posts found with valid error", async () => {
    const res = await request(app).get(
      "/api/posts?tags=tech&sortby=author&direction=dfffff"
    );
    const {
      status,
      body: { error },
      headers,
    } = res;
    expect(status).toBe(400);
    expect(headers["content-type"]).toContain("application/json");
    expect(error).toContain("direction parameter is invalid");
  });

  test("when matching tag is given with implicit sortby and direction values  are given then posts are sorted descending order of author ", async () => {
    const res = await request(app).get(
      "/api/posts?tags=tech&sortby=author&direction=desc"
    );
    const {
      status,
      body: { posts },
      headers,
    } = res;
    expect(status).toBe(200);
    expect(headers["content-type"]).toContain("application/json");
    expect(posts).toHaveLength(4);
    if (!posts) {
      const sortedPosts = posts as Post[];
      expect(sortedPosts[0].author).toBe("Prashant");
      expect(sortedPosts[4].author).toBe("Amrita");
    }
  });
});
