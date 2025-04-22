'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Auth/context/auth-context';

export function useRoleGuard(allowedRoles: string[]) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(user.role)) {
      router.replace('/unauthorized'); // or dashboard, or 403 page
    }
  }, [user, loading]);
}
