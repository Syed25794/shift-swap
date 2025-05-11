'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
    else if (session.user.role !== 'STAFF') router.push('/unauthorized');
  }, [status, session]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/shifts/user/${session.user.id}`)
        .then(res => res.json())
        .then(data => setShifts(data));
    }
  }, [session]);

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>👋 Welcome, {session?.user?.name}</h1>
      <h2>Your Assigned Shifts</h2>
      <ul>
        {shifts.map(shift => (
          <li key={shift.id}>
            📅 {shift.date} | 🕒 {shift.startTime} - {shift.endTime} | 📍 {shift.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
