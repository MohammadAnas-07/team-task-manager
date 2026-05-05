export default function LoadingSpinner({ size = 'md' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeMap[size]} border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
