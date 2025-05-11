'use client';

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut()} style={{ marginLeft: '10px' }}>
      Sign Out
    </button>
  );
}
