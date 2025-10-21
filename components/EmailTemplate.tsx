import * as React from 'react';

interface EmailTemplateProps {
  firstName?: string;
  code: string;
}

export function EmailTemplate({ firstName, code }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif', color: '#0f172a' }}>
      <h1 style={{ margin: '0 0 12px', fontSize: 20 }}>Welcome{firstName ? `, ${firstName}` : ''}!</h1>
      <p style={{ margin: '0 0 16px', fontSize: 14 }}>
        Use the verification code below to finish creating your TaskForge account.
      </p>
      <div style={{ display: 'inline-block', padding: '10px 16px', borderRadius: 8, background: '#1d4ed8', color: '#fff', fontWeight: 700, letterSpacing: 2, fontSize: 18 }}>
        {code}
      </div>
      <p style={{ margin: '16px 0 0', fontSize: 12, color: '#475569' }}>This code expires in 15 minutes.</p>
    </div>
  );
}
