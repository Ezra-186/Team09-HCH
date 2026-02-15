import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';

const rounds = 10;

function getSeedPassword() {
  const pw = process.env.SELLER_DEMO_PASSWORD;
  if (!pw) throw new Error('Missing SELLER_DEMO_PASSWORD in .env.local for seeding.');
  const trimmed = pw.trim();
  if (!trimmed) throw new Error('SELLER_DEMO_PASSWORD is empty.');
  return trimmed;
}

async function main() {
  const seedPassword = getSeedPassword();

  await sql`ALTER TABLE sellers ADD COLUMN IF NOT EXISTS password_hash TEXT;`;

  const hash = await bcrypt.hash(seedPassword, rounds);

  const result = await sql`
    UPDATE sellers
    SET password_hash = ${hash}
    WHERE password_hash IS NULL OR password_hash = ''
  `;

  const count = result.rowCount ?? 0;
  console.log(`Seeded password_hash for ${count} seller(s).`);
  console.log('Done. You can now log in using the same password you set in SELLER_DEMO_PASSWORD.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
