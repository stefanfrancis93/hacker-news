/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse as Response } from "next";
import getStoryById from "@/pages/api/stories/[id]";
import { ApiResponse } from "@/common/types";

interface NextApiResponse extends Response {
  _getJSONData: () => ApiResponse;
}

describe("/api/stories/[id] API Endpoint", () => {
  function mockRequestResponse(method: RequestMethod = "GET") {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } = createMocks({
      method,
    });
    req.query = { id: "34592525" };
    return { req, res };
  }

  it("should return a successful response", async () => {
    const { req, res } = mockRequestResponse();
    await getStoryById(req, res);

    const data = res._getJSONData().data;

    expect(data).toEqual(
      expect.objectContaining({
        id: 34592525,
      })
    );

    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 404 if story id is invalid", async () => {
    const { req, res } = mockRequestResponse();
    req.query = { id: "345925kjnkjn25" }; // invalid story ID

    await getStoryById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData().error).toEqual(
      expect.objectContaining({
        message: "Story with id: 345925kjnkjn25 not found",
      })
    );
  });

  it("should return a 400 if story id is missing", async () => {
    const { req, res } = mockRequestResponse();
    req.query = {}; // Equivalent to a empty query object

    await getStoryById(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().error).toEqual(
      expect.objectContaining({
        message: "Missing id in the query",
      })
    );
  });

  it("should return a 405 if HTTP method is not GET", async () => {
    const { req, res } = mockRequestResponse("POST"); // Invalid HTTP call

    await getStoryById(req, res);

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData().error).toEqual({
      message: "Method not allowed",
    });
  });
});
