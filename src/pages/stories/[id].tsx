import { useEffect, useState } from "react";
import { ApiResponse, Story } from "@/common/types";
import { useRouter } from "next/router";

const StoryDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return; // Skips API call if id is not present
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/stories/${id}`);
      const responseJson: ApiResponse<Story> = await response.json();
      setStory(responseJson.data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <>Loading...</>;
  }

  return <>{story?.title}</>;
};

export default StoryDetails;
