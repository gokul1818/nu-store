export default function AppSelect({ label, error, className = "", children, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block mb-1 font-medium">{label}</label>}

      <select
        {...props}
        className={`
          p-3 w-full rounded-lg outline-none transition-all 
          border 
          ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-black"
          } 
          focus:ring-2
          ${className}
        `}
      >
        {children}
      </select>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
