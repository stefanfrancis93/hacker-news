import { Story, ApiResponse } from "@/common/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Story | null>>
) {
  const { query, method } = _req;
  const { id } = query;

  // Only allow GET requests
  if (method !== "GET") {
    res.status(405).json({
      error: { message: "Method not allowed" },
      status: 405,
      data: null,
    });
    return;
  }

  // id must be present
  if (!id) {
    res.status(400).json({
      error: { message: "Missing id in the query" },
      status: 400,
      data: null,
    });
    return;
  }

  try {
    const { HACKER_NEWS_API_BASE_URL } = process.env;

    const API_URL = `${HACKER_NEWS_API_BASE_URL}/item/${id}.json?print=pretty`;
    const response = await fetch(API_URL);
    const data: Story | null = await response.json();

    if (data) {
      res.status(200).json({ data, status: 200 });
    } else {
      res.status(404).json({
        error: { message: `Story with id: ${id} not found` },
        status: 404,
        data: null,
      });
    }
  } catch (e) {
    res.status(500).json({
      error: { message: "Failed to load data" },
      status: 500,
      data: null,
    });
  }
}
