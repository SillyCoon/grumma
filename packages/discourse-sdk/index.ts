type TopicsResponse = {
  topic_list: {
    per_page: number;
    topics: {
      id: number;
      title: string;
      created_at: string;
      excerpt: string;
      slug: string;
    }[];
  };
};

const getOne = async (page: number): Promise<TopicsResponse> => {
  const response = await fetch(
    `https://grumma.discourse.group/c/general/announcements/6.json?page=${page}`,
  );
  return response.json();
};

export const getTopics = async ({ after }: { after: Date }) => {
  const fromPage = 0;
  const {
    topic_list: { per_page, topics },
  } = await getOne(fromPage);

  let shouldFetchMore = topics.length >= per_page;

  while (shouldFetchMore) {
    const nextPage = fromPage + 1;
    const nextPageData = await getOne(nextPage);
    topics.push(...nextPageData.topic_list.topics);

    shouldFetchMore = nextPageData.topic_list.topics.length >= per_page;
  }
  return topics
    .map((topic) => ({
      id: topic.id,
      title: topic.title,
      createdAt: new Date(topic.created_at),
      excerpt: topic.excerpt,
      link: `https://grumma.discourse.group/t/${topic.slug}/${topic.id}`,
    }))
    .filter((topic) => topic.createdAt > after);
};
