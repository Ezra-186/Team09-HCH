import { NextResponse } from 'next/server';
import { getSellers } from '@/lib/data';
import { Seller } from '@/lib/types';

export async function GET(): Promise<NextResponse<Seller[]>> {
  const sellers = getSellers();
  return NextResponse.json(sellers);
}
