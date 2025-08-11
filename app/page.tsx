'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to team page
    router.replace('/team');
  }, [router]);

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-500 mx-auto mb-4' />
        <p className='text-gray-600'>Перенаправлення до дашборду команди...</p>
      </div>
    </div>
  );
}
