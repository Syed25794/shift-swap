export default function SwapRequestCard({ request }) {
    return (
      <div style={{ border: '1px solid #aaa', padding: '10px', marginBottom: '10px' }}>
        <p>{request.shift.date} - {request.shift.role}</p>
        <p>Posted by: {request.user.name}</p>
        <p>Status: {request.status}</p>
      </div>
    );
  }