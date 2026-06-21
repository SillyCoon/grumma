import logger from "libs/logger";

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

const host = "https://grumma.discourse.group";

const discourseUrl = (path: string) => new URL(path, host);
const topicLink = (topicId: number, topicSlug: string) =>
  `https://grumma.discourse.group/t/${topicSlug}/${topicId}`;

const getOne = async (page: number): Promise<TopicsResponse> => {
  const response = await fetch(
    discourseUrl(`/c/general/announcements/6.json?page=${page}`),
  );
  if (response.ok) {
    return response.json();
  }
  throw new Error(
    `Failed to fetch topics: ${response.statusText}, status: ${response.status}, page: ${page}`,
  );
};

export const getTopics = async ({ after }: { after: Date }) => {
  let fromPage = 0;
  const {
    topic_list: { per_page, topics },
  } = await getOne(fromPage);

  let shouldFetchMore = topics.length >= per_page;

  while (shouldFetchMore) {
    fromPage += 1;
    const nextPageData = await getOne(fromPage);
    topics.push(...nextPageData.topic_list.topics);

    shouldFetchMore = nextPageData.topic_list.topics.length >= per_page;
  }
  return topics
    .map((topic) => ({
      id: topic.id,
      title: topic.title,
      createdAt: new Date(topic.created_at),
      excerpt: topic.excerpt,
      link: topicLink(topic.id, topic.slug),
    }))
    .filter((topic) => topic.createdAt > after);
};

type LatestTopicsResponse = {
  topic_list: {
    topics: [
      {
        id: number;
        created_at: string;
        last_posted_at: string;
        unicode_title: string;
        title: string;
        category_id: number;
        slug: string;
      },
    ];
  };
};

export type LatestTopic = {
  id: number;
  title: string;
  createdAt: Date;
  lastPostedAt: Date;
  categoryName?: string;
  link: string;
};

type SiteInfo = {
  categories: [
    {
      id: number;
      name: string;
    },
  ];
};

const fetchJson = async <T>(url: URL): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

export const getLatestTopics = async (): Promise<LatestTopic[]> => {
  try {
    const topics = await fetchJson<LatestTopicsResponse>(
      discourseUrl("/latest.json"),
    );

    const siteInfo = (await fetchJson<SiteInfo>(
      discourseUrl("/site.json"),
    )) as SiteInfo;

    const categoryMap = new Map(
      siteInfo.categories.map((category) => [category.id, category.name]),
    );

    return topics.topic_list.topics.map((topic) => ({
      id: topic.id,
      title: topic.unicode_title ?? topic.title,
      createdAt: new Date(topic.created_at),
      lastPostedAt: new Date(topic.last_posted_at),
      categoryName: categoryMap.get(topic.category_id),
      link: topicLink(topic.id, topic.slug),
    }));
  } catch (error) {
    logger.error(error, "Failed to fetch latest topics");
    throw new Error("Failed to fetch latest topics");
  }
};
