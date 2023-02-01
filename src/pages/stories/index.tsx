import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import styles from "../../styles/StoryList.module.css";
import useFetchStories from "@/common/useFetchStories";
import Image from "next/image";

const Stories = () => {
  const [page, setPage] = useState(1);
  const { loading, error, hasMore, stories } = useFetchStories(page);

  const observer = useRef<IntersectionObserver | null>();
  const lastStoryElRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const getLinkElement = useCallback(
    ({
      title,
      text,
      time,
      url,
    }: {
      title: string;
      text?: string;
      time: number;
      url: string;
    }) => (
      <Link href={url} target="_blank" className={styles.link}>
        <div className={styles.titleContainer}>
          <h2 className={styles.storyTitle}>{title}</h2>
          <span>{new Date(time).toLocaleDateString()}</span>
        </div>
        {text && <p className={styles.storyContent}>{text}</p>}
      </Link>
    ),
    []
  );

  return (
    <main className={styles.main}>
      <h1 data-testid="heading">Hacker News | Top Stories</h1>
      <ul data-testid="list-container" className={styles.list}>
        {stories.map(({ id, title, text, time, url = "" }, index) => {
          const isLastElement = stories.length === index + 1;
          if (isLastElement) {
            return (
              <li
                key={id}
                className={styles.listItem}
                data-testid="story-item"
                ref={lastStoryElRef}
              >
                {getLinkElement({ title, text, time, url })}
              </li>
            );
          } else {
            return (
              <li key={id} className={styles.listItem} data-testid="story-item">
                {getLinkElement({ title, text, time, url })}
              </li>
            );
          }
        })}
      </ul>
      {loading && (
        <div
          data-testid="spinner-container"
          className={styles.spinnerContainer}
        >
          Loading
          <span className={styles.spinner}>
            <Image src="/spinner.gif" alt="spinner" width={30} height={30} />
          </span>
        </div>
      )}
      {error && <div>Error...</div>}
    </main>
  );
};

export default Stories;
