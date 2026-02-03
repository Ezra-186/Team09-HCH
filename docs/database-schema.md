# Database Schema

## Tables

### sellers
- **Primary key**: `id` (uuid, generated)
- **Columns**: `name` text not null, `location` text, `bio` text, `created_at` timestamptz default now()

### products
- **Primary key**: `id` (uuid, generated)
- **Foreign key**: `seller_id` references `sellers(id)` on delete cascade
- **Columns**: `name` text not null, `description` text, `category` text not null, `price` numeric(10,2) not null, `created_at` timestamptz default now()

### reviews
- **Primary key**: `id` (uuid, generated)
- **Foreign key**: `product_id` references `products(id)` on delete cascade
- **Columns**: `author` text not null, `rating` integer check (rating between 1 and 5), `comment` text, `reviewed_on` date not null, `created_at` timestamptz default now()

## Suggested indexes
- `products(category)` to speed category filtering
- `products(price)` to support price range queries
- `reviews(product_id)` to quickly fetch reviews for a product

## Notes
- UUIDs are used consistently across all tables for primary and foreign keys.
- `created_at` timestamps capture record creation time; additional audit fields can be added later if needed.
- Numeric price uses two decimal places; adjust scale/precision based on expected values.
