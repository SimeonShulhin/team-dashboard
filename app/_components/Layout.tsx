import Link from 'next/link';
import { ReactNode } from 'react';
import { Users, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Дашборд команди' }: LayoutProps) {
  return (
    <div className='min-h-full flex flex-col bg-gray-50'>
      {/* Header */}
      <header className='flex-shrink-0 bg-white border-b border-gray-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <Link
                href='/team'
                className='flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors'>
                <Users className='h-6 w-6' />
                <span>Team Dashboard</span>
              </Link>
            </div>

            <nav className='flex space-x-4'>
              <Link
                href='/team'
                className='flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors'>
                <Home className='h-4 w-4' />
                <span>Команда</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className='flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full'>
        {title && (
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className='flex-shrink-0 bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <p className='text-center text-sm text-gray-500'>
            © {new Date().getFullYear()} Team Dashboard.
          </p>
        </div>
      </footer>
    </div>
  );
}
