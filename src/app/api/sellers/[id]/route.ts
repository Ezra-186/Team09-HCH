import { NextResponse } from 'next/server';
import { getSellerById } from '@/lib/data';
import { Seller } from '@/lib/types';

type Params = {
  params: {
    id: string;
  };
};

export async function GET({ params }: Params): Promise<NextResponse<Seller | { message: string }>> {
  const seller = getSellerById(params.id);

  if (!seller) {
    return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
  }

  return NextResponse.json(seller);
}
