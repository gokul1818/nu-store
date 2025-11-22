import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export const showSuccess = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      <FaCheckCircle size={20} />
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
      <MdCancel size={20} />
      <span>{message}</span>
    </div>
  ));
};
