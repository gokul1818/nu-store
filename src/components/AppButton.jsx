export default function AppButton({
  children,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`relative flex items-center justify-center px-4 py-2 rounded 
        bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed 
        transition-all ${className}`}
    >
      {loading && (
        <span className="absolute w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </span>
    </button>
  );
}
