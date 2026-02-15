import { sql } from './db';
import { Seller } from './types';

type SellerRow = {
  id: string;
  name: string;
  location: string | null;
  bio: string | null;
};

export type SellerAuthRecord = {
  id: string;
  name: string;
  password_hash: string | null;
};

function mapSellerRow(row: SellerRow): Seller {
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? '',
    bio: row.bio ?? '',
  };
}

export async function getSellersFromDb(): Promise<Seller[]> {
  const { rows } = await sql<SellerRow>`
    SELECT id, name, location, bio
    FROM sellers
    ORDER BY name ASC;
  `;

  return rows.map(mapSellerRow);
}

export async function getSellerByIdFromDb(id: string): Promise<Seller | null> {
  const { rows } = await sql<SellerRow>`
    SELECT id, name, location, bio
    FROM sellers
    WHERE id = ${id}
    LIMIT 1;
  `;

  return rows[0] ? mapSellerRow(rows[0]) : null;
}

export async function getSellerAuthByIdFromDb(id: string): Promise<SellerAuthRecord | null> {
  const { rows } = await sql<SellerAuthRecord>`
    SELECT id, name, password_hash
    FROM sellers
    WHERE id = ${id}
    LIMIT 1;
  `;

  return rows[0] ?? null;
}
