'use client';

import { useEffect, useRef } from 'react';

// Fire-and-forget visit ping. Render once per portal page:
//   <VisitPing siteId="commercial-cbe" />
export function VisitPing({ siteId }: { siteId: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, page: 'visit' })
    }).catch(() => {});
  }, [siteId]);
  return null;
}
