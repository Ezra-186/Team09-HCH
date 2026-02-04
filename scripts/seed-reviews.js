/* eslint-disable @typescript-eslint/no-require-imports */
// Seed the reviews table with the hard-coded review cards used by the UI.
// Safe to run multiple times; skips duplicates based on product_id + author_name + comment.

const { sql } = require('@vercel/postgres');

const sellers = [
  {
    id: 'seller-1',
    name: 'Luna Looms',
    location: 'Portland, OR',
    bio: 'Textile artist weaving modern heirlooms with natural fibers and gentle palettes.',
  },
  {
    id: 'seller-2',
    name: 'Cedar & Clay',
    location: 'Santa Fe, NM',
    bio: 'Small-batch ceramics inspired by desert skies and the calm of slow living.',
  },
  {
    id: 'seller-3',
    name: 'Willow Workshop',
    location: 'Asheville, NC',
    bio: 'Woodworker crafting warm, functional pieces that age beautifully with use.',
  },
];

const products = [
  {
    id: 'product-1',
    sellerId: 'seller-1',
    name: 'Handwoven Wall Hanging',
    description: 'A textured statement piece woven with plant-dyed wool and linen.',
    category: 'Textiles',
    price: 120,
  },
  {
    id: 'product-2',
    sellerId: 'seller-1',
    name: 'Indigo Throw Blanket',
    description: 'Lightweight throw dyed with natural indigo, finished with hand-twisted fringe.',
    category: 'Textiles',
    price: 180,
  },
  {
    id: 'product-3',
    sellerId: 'seller-1',
    name: 'Plant-Dyed Table Runner',
    description: 'Linen runner colored with marigold petals and soft iron modifiers.',
    category: 'Textiles',
    price: 75,
  },
  {
    id: 'product-4',
    sellerId: 'seller-2',
    name: 'Stoneware Mug',
    description: 'Wheel-thrown mug with a satin glaze and carved thumb rest for daily rituals.',
    category: 'Ceramics',
    price: 38,
  },
  {
    id: 'product-5',
    sellerId: 'seller-2',
    name: 'Desert Sunrise Vase',
    description: 'Tall vase with layered glazes reminiscent of warm canyon mornings.',
    category: 'Ceramics',
    price: 95,
  },
  {
    id: 'product-6',
    sellerId: 'seller-2',
    name: 'Carved Incense Holder',
    description: 'Low-profile incense holder with hand-etched geometrics and ash catch.',
    category: 'Ceramics',
    price: 28,
  },
  {
    id: 'product-7',
    sellerId: 'seller-3',
    name: 'Carved Walnut Serving Board',
    description: 'Curved-edge board finished with food-safe oil for gatherings and grazing.',
    category: 'Woodwork',
    price: 110,
  },
  {
    id: 'product-8',
    sellerId: 'seller-3',
    name: 'Copper and Wood Candle Holder',
    description: 'Mixed-material candle holder pairing warm walnut with brushed copper.',
    category: 'Woodwork',
    price: 45,
  },
  {
    id: 'product-9',
    sellerId: 'seller-3',
    name: 'Leather-Bound Sketchbook',
    description: 'Hand-stitched sketchbook with removable cotton pages and wrap closure.',
    category: 'Leatherwork',
    price: 68,
  },
];

const reviews = [
  {
    productId: 'product-1',
    authorName: 'Maya',
    rating: 5,
    comment: 'The weaving is exquisite and the colors are calming in person.',
    createdAt: '2024-02-03',
  },
  {
    productId: 'product-1',
    authorName: 'Theo',
    rating: 4,
    comment: 'Beautiful craftsmanship, shipped with thoughtful packaging.',
    createdAt: '2024-03-12',
  },
  {
    productId: 'product-2',
    authorName: 'Ivy',
    rating: 5,
    comment: 'Soft, breathable, and the indigo tone is just right.',
    createdAt: '2024-01-28',
  },
  {
    productId: 'product-2',
    authorName: 'Sam',
    rating: 4,
    comment: 'Perfect spring layer; would love a larger size option.',
    createdAt: '2024-04-18',
  },
  {
    productId: 'product-3',
    authorName: 'Ana',
    rating: 4,
    comment: 'Adds a soft pop of color to our dining table.',
    createdAt: '2024-02-22',
  },
  {
    productId: 'product-4',
    authorName: 'Jordan',
    rating: 5,
    comment: 'New favorite mug — comfortable handle and great weight.',
    createdAt: '2024-03-02',
  },
  {
    productId: 'product-4',
    authorName: 'Casey',
    rating: 4,
    comment: 'Glaze is gorgeous; would love a matching pitcher.',
    createdAt: '2024-03-19',
  },
  {
    productId: 'product-5',
    authorName: 'Zoe',
    rating: 5,
    comment: 'Statement piece that still feels timeless.',
    createdAt: '2024-04-05',
  },
  {
    productId: 'product-6',
    authorName: 'Omar',
    rating: 3,
    comment: 'Nice design but ash spreads more than expected.',
    createdAt: '2024-01-11',
  },
  {
    productId: 'product-7',
    authorName: 'Riley',
    rating: 5,
    comment: 'Beautiful grain and the shape is comfortable to hold.',
    createdAt: '2024-02-14',
  },
  {
    productId: 'product-8',
    authorName: 'Nina',
    rating: 4,
    comment: 'Warm glow and sturdy base, exactly what I wanted.',
    createdAt: '2024-04-01',
  },
  {
    productId: 'product-9',
    authorName: 'Alex',
    rating: 5,
    comment: 'Paper quality is great for ink and the leather smells amazing.',
    createdAt: '2024-03-30',
  },
];

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS sellers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      bio TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      seller_id TEXT NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      title TEXT,
      author_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
}

async function seed() {
  await ensureTables();

  for (const seller of sellers) {
    await sql`
      INSERT INTO sellers (id, name, location, bio)
      VALUES (${seller.id}, ${seller.name}, ${seller.location}, ${seller.bio})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  for (const product of products) {
    await sql`
      INSERT INTO products (id, seller_id, name, description, category, price)
      VALUES (${product.id}, ${product.sellerId}, ${product.name}, ${product.description}, ${product.category}, ${product.price})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  for (const review of reviews) {
    const existing = await sql`
      SELECT id
      FROM reviews
      WHERE product_id = ${review.productId}
        AND author_name = ${review.authorName}
        AND comment = ${review.comment}
      LIMIT 1;
    `;

    if (existing.rowCount > 0) continue;

    await sql`
      INSERT INTO reviews (product_id, rating, title, comment, author_name, created_at)
      VALUES (${review.productId}, ${review.rating}, NULL, ${review.comment}, ${review.authorName}, ${review.createdAt});
    `;
  }
}

seed()
  .then(() => {
    console.log('Reviews seed completed.');
  })
  .catch((error) => {
    console.error('Failed to seed reviews:', error);
    process.exit(1);
  });
