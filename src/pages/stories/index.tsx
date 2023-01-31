import { useEffect, useState } from "react";
import { ApiResponse, Pagination, Story } from "@/common/types";
import Link from "next/link";

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/stories/top`);
      const responseJson: ApiResponse<{
        stories: Story[];
        pagination: Pagination;
      }> = await response.json();
      setStories(responseJson.data.stories);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <ul>
        {stories.map(({ id, title, time }) => (
          <li key={id}>
            <Link href={`/stories/${id}`} target="_blank">
              <div>{title}</div>
              <span>{new Date(time).toLocaleDateString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Stories;
