export type WishlistIdea = {
  title: string;
  url: string;
  upvotes: number;
  comments: number;
  createdAt: string;
};

export type WishlistState = 'no-token' | 'empty' | 'ideas';

export type WishlistResult = {
  state: WishlistState;
  ideas: WishlistIdea[];
};

const OWNER = 'FormaMindPro';
const REPO = 'vibeforma';
const CATEGORY_SLUG = 'ideas';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

async function graphql<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'doc-vibeforma-build',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? 'GitHub API error');
  }
  if (!payload.data) {
    throw new Error('GitHub API returned no data');
  }
  return payload.data;
}

/**
 * Reads the public "Ideas" discussions from the product repository.
 *
 * Three honest states:
 * - no token in the build environment - the board is not connected yet;
 * - a token but no "Ideas" category or no discussions - the empty board;
 * - a token and ideas - the list, sorted by upvotes.
 *
 * With a token, an API error fails the build: a silent empty list would look
 * like an empty community instead of a broken fetch.
 */
export async function getWishlist(): Promise<WishlistResult> {
  const env = import.meta.env as unknown as Record<string, string | undefined>;
  const token = env.COMMUNITY_GITHUB_TOKEN ?? process.env.COMMUNITY_GITHUB_TOKEN;
  if (!token) return { state: 'no-token', ideas: [] };

  const category = await graphql<{
    repository: { discussionCategory: { id: string } | null } | null;
  }>(
    `query($owner: String!, $name: String!, $slug: String!) {
      repository(owner: $owner, name: $name) {
        discussionCategory(slug: $slug) { id }
      }
    }`,
    { owner: OWNER, name: REPO, slug: CATEGORY_SLUG },
    token
  );

  const categoryId = category.repository?.discussionCategory?.id;
  if (!categoryId) return { state: 'empty', ideas: [] };

  const data = await graphql<{
    repository: {
      discussions: {
        nodes: Array<{
          title: string;
          url: string;
          upvoteCount: number;
          createdAt: string;
          comments: { totalCount: number };
        }>;
      };
    } | null;
  }>(
    `query($owner: String!, $name: String!, $categoryId: ID!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 50, categoryId: $categoryId) {
          nodes {
            title
            url
            upvoteCount
            createdAt
            comments { totalCount }
          }
        }
      }
    }`,
    { owner: OWNER, name: REPO, categoryId },
    token
  );

  const nodes = data.repository?.discussions.nodes ?? [];
  if (nodes.length === 0) return { state: 'empty', ideas: [] };

  const ideas = nodes
    .map((node) => ({
      title: node.title,
      url: node.url,
      upvotes: node.upvoteCount,
      comments: node.comments.totalCount,
      createdAt: node.createdAt,
    }))
    .sort((a, b) => b.upvotes - a.upvotes || a.title.localeCompare(b.title));

  return { state: 'ideas', ideas };
}
