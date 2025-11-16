import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      <span className="font-semibold">✔</span>
      <span>{message}</span>
    </div>
  ));
};

export const showError = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      <span className="font-semibold">⚠</span>
      <span>{message}</span>
    </div>
  ));
};
