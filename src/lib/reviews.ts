import { sql } from './db';

export type ReviewRecord = {
  id: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string;
  authorName: string;
  createdAt: string;
};

type CreateReviewInput = {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  authorName: string;
};

type ReviewStats = Map<
  string,
  {
    count: number;
    average: number;
  }
>;

export async function fetchReviewsByProductId(productId: string): Promise<ReviewRecord[]> {
  const { rows } = await sql<ReviewRecord>`
    SELECT
      id,
      product_id AS "productId",
      rating,
      title,
      comment,
      author_name AS "authorName",
      created_at AS "createdAt"
    FROM reviews
    WHERE product_id = ${productId}
    ORDER BY created_at ASC, id ASC;
  `;

  return rows;
}

type ReviewStatRow = {
  product_id: string;
  count: number;
  average: number | null;
};

export async function getReviewStatsForProducts(productIds: string[]) {
  const stats: ReviewStats = new Map();

  if (productIds.length === 0) return stats;

  const { rows } = await sql.query<ReviewStatRow>(
    `
      SELECT
        product_id,
        COUNT(*)::int AS count,
        AVG(rating)::float AS average
      FROM reviews
      WHERE product_id = ANY($1::text[])
      GROUP BY product_id;
    `,
    [productIds],
  );

  rows.forEach((row) => {
    const average = row.average ? Number(Number(row.average).toFixed(1)) : 0;
    stats.set(row.product_id, { count: Number(row.count), average });
  });

  return stats;
}

export async function createReview(input: CreateReviewInput): Promise<void> {
  await sql`
    INSERT INTO reviews (product_id, rating, title, comment, author_name, created_at)
    VALUES (
      ${input.productId},
      ${input.rating},
      ${input.title?.trim() ? input.title.trim() : null},
      ${input.comment},
      ${input.authorName},
      now()
    );
  `;
}
