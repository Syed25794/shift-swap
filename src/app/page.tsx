'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    } else if (session.user.role !== 'STAFF') {
      router.push('/unauthorized'); // Optional page
    }
  }, [session, status]);

  if (status === 'loading' || !session) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>This is your staff dashboard.</p>
    </div>
  );
}
