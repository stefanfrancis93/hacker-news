import { ApiResponse, Pagination, Story } from "@/common/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<
    ApiResponse<{
      stories: Story[];
      pagination: Pagination;
    } | null>
  >
) {
  const { query, method } = _req;

  // Only allow GET requests
  if (method !== "GET") {
    res.status(405).json({
      error: { message: "Method not allowed" },
      status: 405,
      data: null,
    });
    return;
  }

  try {
    const page = parseInt(query.page as string, 10) || 0;
    const limit = parseInt(query.limit as string, 10) | 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const { BASE_URL, HACKER_NEWS_API_BASE_URL } = process.env;

    const API_URL = `${HACKER_NEWS_API_BASE_URL}/topstories.json?print=pretty`;
    const response = await fetch(API_URL);
    const responseJson: number[] = await response.json();
    let ids = responseJson.slice(startIndex, endIndex);
    const stories = await Promise.all(
      ids.map(async (id: number) => {
        const ITEM_URL = `${BASE_URL}/api/stories/${id}`;
        const itemResponse = await fetch(ITEM_URL);
        const itemResponseJson: ApiResponse<Story | null> =
          await itemResponse.json();
        return itemResponseJson.data;
      })
    );

    res.status(200).json({
      data: {
        stories: stories.filter((story) => !!story) as Story[],
        pagination: {
          page,
          limit,
        },
      },
      status: 200,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: { message: "Failed to load data" },
      status: 500,
      data: null,
    });
  }
}
