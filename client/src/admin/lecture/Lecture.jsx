import { EditIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */
const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  /* ---------------- HANDLERS ---------------- */
  const handleEdit = () => {
    navigate(
      `/admin/course/${courseId}/lecture/${lecture?._id}`,
      {
        state: { lecture }, // pass data (optional optimization)
      }
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
        Lecture - {index + 1}:{" "}
        <span>{lecture?.lectureTitle || "Untitled Lecture"}</span>
      </h1>

      {/* ACTION BUTTON (better than raw icon) */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        aria-label="Edit Lecture"
      >
        <EditIcon
          size={20}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        />
      </button>
    </div>
  );
};

export default Lecture;
