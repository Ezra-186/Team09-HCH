import { redirect } from 'next/navigation';
import { getAuthenticatedSellerId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sellerId = await getAuthenticatedSellerId();

  if (!sellerId) {
    redirect('/login');
  }

  return children;
}
