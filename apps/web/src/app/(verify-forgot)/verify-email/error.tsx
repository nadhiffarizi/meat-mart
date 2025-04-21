'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto p-4 text-center text-red-600">
      <h2 className="text-xl font-bold">Verification Error</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Try Again
      </button>
    </div>
  );
}
