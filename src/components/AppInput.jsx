import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AppInput({
  label,
  error,
  className = "",
  type = "text",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full relative">
      {label && <label className="block mb-1 font-medium">{label}</label>}

      {type === "textarea" ? (
        <textarea
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
        />
      ) : (
        <input
          {...props}
          type={inputType}
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
            ${isPassword ? "pr-10" : ""}
          `}
        />
      )}

      {isPassword && (
        <span
          className="absolute right-3 top-[54px] -translate-y-1/2 cursor-pointer text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
