/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse as Response } from "next";
import getTopStories from "@/pages/api/stories/top";
import { ApiResponse, StoriesListSuccessResponse } from "@/common/types";

interface NextApiResponse extends Response {
  _getJSONData: () => ApiResponse<StoriesListSuccessResponse>;
}

describe("/api/stories/top API Endpoint", () => {
  function mockRequestResponse(
    method: RequestMethod = "GET",
    page = "1",
    limit?: string
  ) {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({ method });
    req.query = { page, limit };
    return { req, res };
  }

  it("should return 10 stories for ?page=1 without limit", async () => {
    const { req, res } = mockRequestResponse();
    await getTopStories(req, res);

    const data = res._getJSONData().data;

    expect(data.stories).toHaveLength(10);

    expect(data.pagination).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 10,
      })
    );

    expect(res.statusCode).toBe(200);
  });

  it("should return 30 stories for ?page=2&limit=30", async () => {
    const { req, res } = mockRequestResponse("GET", "2", "30");
    await getTopStories(req, res);

    const data = res._getJSONData().data;

    expect(data.stories).toHaveLength(30);

    expect(data.pagination).toEqual(
      expect.objectContaining({
        page: 2,
        limit: 30,
      })
    );

    expect(res.statusCode).toBe(200);
  });

  it("should return a 405 if HTTP method is not GET", async () => {
    const { req, res } = mockRequestResponse("POST"); // Invalid HTTP call

    await getTopStories(req, res);

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData().error).toEqual({
      message: "Method not allowed",
    });
  });
});
