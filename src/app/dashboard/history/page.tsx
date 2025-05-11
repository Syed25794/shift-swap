// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// export default function HistoryPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session) router.push('/auth/signin');
//   }, [status, session]);

//   useEffect(() => {
//     fetch('/api/swap-requests/history')
//       .then(res => res.json())
//       .then(data => setHistory(data));
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Swap Request History</h2>
//       {history.length === 0 ? (
//         <p>No past records available.</p>
//       ) : (
//         <ul>
//           {history.map((item) => (
//             <li key={item.id} style={{ marginBottom: '15px' }}>
//               <strong>{item.shift.date} | {item.shift.startTime}-{item.shift.endTime}</strong><br />
//               From: {item.requester.name} → To: {item.volunteer?.name || 'N/A'}<br />
//               Status: <span style={{ color: getColor(item.status) }}>{item.status}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// function getColor(status: string) {
//   switch (status) {
//     case 'APPROVED': return 'green';
//     case 'REJECTED': return 'red';
//     case 'CANCELLED': return 'orange';
//     default: return 'gray';
//   }
// }


import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  const isManager = session?.user.role === "MANAGER";

  const history = await prisma.swapRequest.findMany({
    where: isManager ? {} : { userId: session?.user.id },
    include: { shift: true, user: true, volunteer: true }
  });

  return (
    <div>
      <h2>Swap History</h2>
      <ul>
        {history.map(entry => (
          <li key={entry.id}>
            {entry.shift.date} - {entry.status} - {entry.volunteer?.name || "No volunteer"}
          </li>
        ))}
      </ul>
    </div>
  );
}