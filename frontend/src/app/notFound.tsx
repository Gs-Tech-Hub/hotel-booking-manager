import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          Oops! The page you are looking for does not exist.
        </p>
        <Image src="/images/not-found.png" alt="Not Found" width={500} height={300} />
        <Link href="/">
          <div className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Go Home
          </div>
        </Link>
      </div>
    );
  }
  