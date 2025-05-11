'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestSwapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [note, setNote] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/swap-requests', {
      method: 'POST',
      body: JSON.stringify({
        shiftId: selectedShift,
        note,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('Swap request submitted');
      setSelectedShift('');
      setNote('');
    } else {
      alert('Failed to submit swap request');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Request a Shift Swap</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Your Shift:
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.date} | {shift.startTime}-{shift.endTime} | {shift.role}
              </option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Note:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            required
          />
        </label>
        <br /><br />
        <button type="submit">Submit Swap Request</button>
      </form>
    </div>
  );
}
