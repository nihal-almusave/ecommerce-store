import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <p className="text-xl text-gray-600 mb-4">Page Not Found</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

