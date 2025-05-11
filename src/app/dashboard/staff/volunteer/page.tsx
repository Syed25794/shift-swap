'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VolunteerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
    else if (session.user.role !== 'STAFF') router.push('/unauthorized');
  }, [status, session]);

  useEffect(() => {
    fetch('/api/swap-requests/open')
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  const handleVolunteer = async (requestId: string) => {
    const res = await fetch(`/api/swap-requests/volunteer`, {
      method: 'POST',
      body: JSON.stringify({ requestId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('You volunteered successfully!');
    } else {
      alert('Failed to volunteer. Maybe someone already did?');
    }

    // Reload open requests
    const updated = await fetch('/api/swap-requests/open').then(r => r.json());
    setRequests(updated);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Open Swap Requests</h2>
      {requests.length === 0 ? (
        <p>No open requests available.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id} style={{ marginBottom: '20px' }}>
              <strong>{req.shift.date} | {req.shift.startTime}-{req.shift.endTime}</strong><br />
              Role: {req.shift.role} <br />
              Requested by: {req.requester.name} <br />
              Note: {req.note} <br />
              {req.volunteerId ? (
                <em>Already has a volunteer</em>
              ) : (
                <button onClick={() => handleVolunteer(req.id)}>Volunteer</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
