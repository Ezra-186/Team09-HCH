import { NextResponse } from 'next/server';
import { getSellersFromDb } from '@/lib/sellers';
import { Seller } from '@/lib/types';

export async function GET(): Promise<NextResponse<Seller[]>> {
  const sellers = await getSellersFromDb();
  return NextResponse.json(sellers);
}
