import { useState, useEffect, useCallback } from "react";
import { ApiResponse, Pagination, Story } from "@/common/types";

const useFetchStories = (page: number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (page === 1) {
      setStories([]);
    }
  }, [page]);

  const fetchData = useCallback(
    async (url: URL) => {
      const response = await fetch(url);
      const responseJson: ApiResponse<{
        stories: Story[];
        pagination: Pagination;
      }> = await response.json();
      console.log(page);

      if (page === 1) {
        setStories(responseJson.data.stories);
      } else {
        setStories((prev: Story[]) => [...prev, ...responseJson.data.stories]);
      }
      setHasMore(responseJson.data.stories.length > 0);
      setLoading(false);
    },
    [page]
  );

  useEffect(() => {
    try {
      setLoading(true);
      setError(false);
      let url = new URL("http://localhost:3000/api/stories/top");
      url.searchParams.set("page", page.toString());

      fetchData(url);

    } catch (err: unknown) {
      setError(!!err);
    }
  }, [fetchData, page]);

  return { loading, error, hasMore, stories };
};

export default useFetchStories;
