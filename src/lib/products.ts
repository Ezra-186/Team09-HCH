import { sql } from './db';
import { Product } from './types';

export const PRODUCT_CATEGORIES = ['General', 'Textiles', 'Ceramics', 'Woodwork', 'Leatherwork'] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function isValidProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export function normalizeProductCategory(value: unknown): ProductCategory {
  if (typeof value !== 'string' || !value.trim()) {
    return 'General';
  }

  const trimmed = value.trim();
  return isValidProductCategory(trimmed) ? trimmed : 'General';
}

type ProductColumnSupport = {
  name: boolean;
  title: boolean;
  category: boolean;
  imageUrl: boolean;
  imageSourceUrl: boolean;
  status: boolean;
};

type ProductRow = {
  id: string;
  sellerId: string;
  name: string;
  description: string | null;
  category: string | null;
  price: string | number;
  imageUrl: string | null;
  imageSourceUrl: string | null;
  status: string | null;
};

type ProductRecordRow = {
  id: string;
  sellerId: string;
  description: string | null;
  category?: string | null;
  price: string | number;
  imageUrl?: string | null;
  imageSourceUrl?: string | null;
  status?: string | null;
  name?: string | null;
  title?: string | null;
};

type ProductCreateInput = {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: ProductCategory;
};

type ProductUpdateInput = {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: ProductCategory;
};

let productColumnSupportPromise: Promise<ProductColumnSupport> | null = null;

async function getProductColumnSupport(): Promise<ProductColumnSupport> {
  if (!productColumnSupportPromise) {
    productColumnSupportPromise = (async () => {
      await sql.query(`
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';
      `);
      await sql.query(`
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS image_url TEXT;
      `);
      await sql.query(`
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS image_source_url TEXT;
      `);

      const { rows } = await sql.query<{ column_name: string }>(
        `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'products';
        `,
      );

      const names = new Set(rows.map((row) => row.column_name));
      return {
        name: names.has('name'),
        title: names.has('title'),
        category: names.has('category'),
        imageUrl: names.has('image_url'),
        imageSourceUrl: names.has('image_source_url'),
        status: names.has('status'),
      };
    })();
  }

  return productColumnSupportPromise;
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    sellerId: row.sellerId,
    name: row.name,
    description: row.description ?? '',
    category: row.category,
    price: Number(row.price),
    imageUrl: row.imageUrl,
    imageSourceUrl: row.imageSourceUrl,
    status: row.status,
  };
}

async function selectProducts(whereSql = '', params: unknown[] = []): Promise<Product[]> {
  const columns = await getProductColumnSupport();
  const nameExpr = columns.name ? 'name' : columns.title ? 'title' : null;

  if (!nameExpr) {
    throw new Error('products table must have either name or title column');
  }

  const categoryExpr = columns.category ? 'category' : 'NULL::text AS category';
  const imageExpr = columns.imageUrl ? 'image_url AS "imageUrl"' : 'NULL::text AS "imageUrl"';
  const imageSourceExpr = columns.imageSourceUrl
    ? 'image_source_url AS "imageSourceUrl"'
    : 'NULL::text AS "imageSourceUrl"';
  const statusExpr = columns.status ? 'status' : 'NULL::text AS status';

  const { rows } = await sql.query<ProductRecordRow>(
    `
      SELECT
        id,
        seller_id AS "sellerId",
        ${nameExpr} AS name,
        description,
        ${categoryExpr},
        price,
        ${imageExpr},
        ${imageSourceExpr},
        ${statusExpr}
      FROM products
      ${whereSql}
      ORDER BY id ASC;
    `,
    params,
  );

  return rows.map((row) =>
    mapProductRow({
      id: row.id,
      sellerId: row.sellerId,
      name: row.name ?? row.title ?? '',
      description: row.description,
      category: row.category ?? null,
      price: row.price,
      imageUrl: row.imageUrl ?? null,
      imageSourceUrl: row.imageSourceUrl ?? null,
      status: row.status ?? null,
    }),
  );
}

export async function getProductsFromDb(): Promise<Product[]> {
  return selectProducts();
}

export async function getProductByIdFromDb(id: string): Promise<Product | null> {
  const products = await selectProducts('WHERE id = $1', [id]);
  return products[0] ?? null;
}

export async function getProductsBySellerIdFromDb(sellerId: string): Promise<Product[]> {
  return selectProducts('WHERE seller_id = $1', [sellerId]);
}

async function getNextProductId(): Promise<string> {
  const { rows } = await sql.query<{ id: string }>(
    `
      SELECT id
      FROM products
      WHERE id LIKE 'product-%';
    `,
  );

  const maxSuffix = rows.reduce((max, row) => {
    const match = /^product-(\d+)$/.exec(row.id);
    if (!match) return max;

    const value = Number(match[1]);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return `product-${maxSuffix + 1}`;
}

export async function createProductForSeller(input: ProductCreateInput): Promise<string> {
  const columns = await getProductColumnSupport();
  const nameColumn = columns.name ? 'name' : columns.title ? 'title' : null;

  if (!nameColumn) {
    throw new Error('products table must have either name or title column');
  }

  const nextId = await getNextProductId();

  const insertColumns: string[] = ['id', 'seller_id', nameColumn, 'description', 'price'];
  const values: unknown[] = [nextId, input.sellerId, input.title, input.description, input.price];

  if (columns.category) {
    insertColumns.push('category');
    values.push(input.category);
  }

  if (columns.imageUrl) {
    insertColumns.push('image_url');
    values.push(input.imageUrl ?? null);
  }

  if (columns.imageSourceUrl) {
    insertColumns.push('image_source_url');
    values.push(input.imageUrl ?? null);
  }

  if (columns.status) {
    insertColumns.push('status');
    values.push('active');
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

  await sql.query(
    `
      INSERT INTO products (${insertColumns.join(', ')})
      VALUES (${placeholders});
    `,
    values,
  );

  return nextId;
}

export async function updateProductForSeller(
  productId: string,
  sellerId: string,
  input: ProductUpdateInput,
): Promise<boolean> {
  const columns = await getProductColumnSupport();
  const nameColumn = columns.name ? 'name' : columns.title ? 'title' : null;

  if (!nameColumn) {
    throw new Error('products table must have either name or title column');
  }

  const updates: string[] = [`${nameColumn} = $1`, 'description = $2', 'price = $3'];
  const values: unknown[] = [input.title, input.description, input.price];

  if (columns.category) {
    updates.push(`category = $${values.length + 1}`);
    values.push(input.category);
  }

  if (columns.imageUrl) {
    updates.push(`image_url = $${values.length + 1}`);
    values.push(input.imageUrl ?? null);
  }

  if (columns.imageSourceUrl) {
    updates.push(`image_source_url = $${values.length + 1}`);
    values.push(input.imageUrl ?? null);
  }

  values.push(productId, sellerId);

  const { rowCount } = await sql.query(
    `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = $${values.length - 1} AND seller_id = $${values.length};
    `,
    values,
  );

  return (rowCount ?? 0) > 0;
}

export async function deleteProductForSeller(productId: string, sellerId: string): Promise<boolean> {
  const { rowCount } = await sql.query(
    `
      DELETE FROM products
      WHERE id = $1 AND seller_id = $2;
    `,
    [productId, sellerId],
  );

  return (rowCount ?? 0) > 0;
}

export function isValidImageSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

type ProductImageSourceRow = {
  name?: string | null;
  title?: string | null;
  imageUrl?: string | null;
  imageSourceUrl?: string | null;
};

export async function getProductImageSourcesFromDb(): Promise<
  Array<{ name: string; imageUrl: string | null; imageSourceUrl: string | null }>
> {
  const columns = await getProductColumnSupport();
  const nameExpr = columns.name ? 'name' : columns.title ? 'title' : null;

  if (!nameExpr) {
    throw new Error('products table must have either name or title column');
  }

  const imageSourceExpr = columns.imageSourceUrl
    ? 'image_source_url AS "imageSourceUrl"'
    : 'NULL::text AS "imageSourceUrl"';
  const imageExpr = columns.imageUrl ? 'image_url AS "imageUrl"' : 'NULL::text AS "imageUrl"';

  const { rows } = await sql.query<ProductImageSourceRow>(
    `
      SELECT
        ${nameExpr} AS name,
        ${imageExpr},
        ${imageSourceExpr}
      FROM products
      ORDER BY ${nameExpr} ASC;
    `,
  );

  return rows.map((row) => ({
    name: row.name ?? row.title ?? '',
    imageUrl: row.imageUrl ?? null,
    imageSourceUrl: row.imageSourceUrl ?? null,
  }));
}
