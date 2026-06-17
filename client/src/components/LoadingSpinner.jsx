export default function LoadingSpinner({ size = 'md' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeMap[size]} border-[3px] border-apple-surface-tile-2 border-t-apple-primary rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
