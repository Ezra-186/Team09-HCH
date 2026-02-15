import { NextRequest, NextResponse } from 'next/server';
import { getSellerByIdFromDb } from '@/lib/sellers';
import { Seller } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<Seller | { message: string }>> {
  const { id } = await params;
  const seller = await getSellerByIdFromDb(id);

  if (!seller) {
    return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
  }

  return NextResponse.json(seller);
}
