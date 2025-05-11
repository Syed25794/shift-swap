// 'use client';

// import { useSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function ApprovalsPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [pending, setPending] = useState([]);

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session) router.push('/auth/signin');
//     else if (session.user.role !== 'MANAGER') router.push('/unauthorized');
//   }, [status, session]);

//   useEffect(() => {
//     fetch('/api/swap-requests/pending')
//       .then(res => res.json())
//       .then(data => setPending(data));
//   }, []);

//   const takeAction = async (id: string, action: 'approve' | 'reject') => {
//     const res = await fetch(`/api/swap-requests/approval`, {
//       method: 'POST',
//       body: JSON.stringify({ id, action }),
//       headers: { 'Content-Type': 'application/json' },
//     });

//     const updated = await fetch('/api/swap-requests/pending').then(r => r.json());
//     setPending(updated);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Pending Swap Approvals</h2>
//       {pending.length === 0 ? (
//         <p>No pending requests.</p>
//       ) : (
//         <ul>
//           {pending.map(req => (
//             <li key={req.id} style={{ marginBottom: '20px' }}>
//               <strong>{req.shift.date} | {req.shift.startTime}-{req.shift.endTime}</strong><br />
//               From: {req.requester.name} → To: {req.volunteer.name}<br />
//               Note: {req.note}<br />
//               <button onClick={() => takeAction(req.id, 'approve')}>Approve</button>{' '}
//               <button onClick={() => takeAction(req.id, 'reject')}>Reject</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "MANAGER") return <p>Access Denied</p>;

  const pending = await prisma.swapRequest.findMany({
    where: { status: "PENDING" },
    include: { shift: true, user: true, volunteer: true }
  });

  return (
    <div>
      <h2>Pending Approvals</h2>
      <ul>
        {pending.map(req => (
          <li key={req.id}>{req.shift.date} - {req.shift.role} → Volunteer: {req.volunteer?.name}</li>
        ))}
      </ul>
    </div>
  );
}