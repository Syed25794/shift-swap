export default function ShiftCard({ shift }) {
    return (
      <div style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
        <p><strong>{shift.date}</strong> - {shift.timeSlot}</p>
        <p>Role: {shift.role}</p>
      </div>
    );
  }