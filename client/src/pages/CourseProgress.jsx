import  { useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useGetCourseDetailsWithStatusQuery } from "@/api/purchaseApi";

const CourseProgress = () => {
  const { courseId } = useParams();

  const { data, isLoading } =
    useGetCourseDetailsWithStatusQuery(courseId);

  const course = data?.course;

  const [currentLecture, setCurrentLecture] = useState(0);

  if (isLoading) return <p>Loading course...</p>;

  const lecture = course?.lectures?.[currentLecture];

  const currentVideo =
    lecture?.videoInfo?.videoUrl || lecture?.videoUrl;

  return (
    <div className="flex flex-col md:flex-row h-screen">

      {/* 🎥 VIDEO PLAYER */}
      <div className="flex-1 bg-black p-4">
        <ReactPlayer
          url={currentVideo}
          controls
          width="100%"
          height="70vh"
        />

        <h2 className="text-white mt-3 text-lg font-semibold">
          {lecture?.lectureTitle}
        </h2>

        {/* ================= NOTES ================= */}
        {lecture?.notes?.fileUrl && (
          <div className="bg-white mt-4 p-3 rounded">
            <h3 className="font-semibold text-lg">
              📄 {lecture?.notes?.title || "Notes"}
            </h3>

            <a
              href={lecture.notes.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Download Notes
            </a>
          </div>
        )}

        {/* ================= ASSIGNMENT ================= */}
        {lecture?.assignment?.fileUrl && (
          <div className="bg-white mt-4 p-3 rounded">
            <h3 className="font-semibold text-lg">
              📝 {lecture?.assignment?.title || "Assignment"}
            </h3>

            <p className="text-gray-600 text-sm mb-2">
              {lecture?.assignment?.description}
            </p>

            <a
              href={lecture.assignment.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Download Assignment
            </a>
          </div>
        )}
      </div>

      {/* 📚 LECTURE LIST */}
      <div className="w-full md:w-80 bg-white border-l p-4 overflow-y-auto">
        <h2 className="font-bold mb-4 text-lg">
          Course Content
        </h2>

        {course?.lectures?.map((lecture, index) => (
          <div
            key={lecture._id}
            onClick={() => setCurrentLecture(index)}
            className={`p-3 mb-2 cursor-pointer rounded transition ${
              currentLecture === index
                ? "bg-blue-100 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {lecture.lectureTitle}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;
