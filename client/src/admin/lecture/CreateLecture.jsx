import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  useCreateLectureMutation,
  useGetLecturesByCourseIdQuery,
} from "@/api/courseApi";
import { toast } from "sonner";
import Lecture from "./Lecture";
import { useDispatch } from "react-redux";
import { addLecture } from "@/features/courseSlice";

/* ---------------- COMPONENT ---------------- */
const CreateLecture = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [lectureTitle, setLectureTitle] = useState("");

  /* ---------------- API ---------------- */
  const {
    data: lecturesData,
    isLoading: lectureLoading,
    isError: lectureError,
  } = useGetLecturesByCourseIdQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });

  const [createLecture, { isLoading }] = useCreateLectureMutation();

  /* ---------------- HANDLERS ---------------- */

  const handleCreateLecture = async () => {
    const title = lectureTitle.trim();

    if (!title) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    try {
      const res = await createLecture({
        courseId,
        lectureTitle: title,
      }).unwrap();

      toast.success(res?.message || "Lecture created");

      // Optimistic UI update
      dispatch(addLecture(res.lecture));

      setLectureTitle("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create lecture");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleCreateLecture();
    }
  };

  /* ---------------- RENDER STATES ---------------- */

  const renderLectures = () => {
    if (lectureLoading) {
      return <p className="text-gray-500">Loading lectures...</p>;
    }

    if (lectureError) {
      return <p className="text-red-500">Failed to load lectures.</p>;
    }

    if (!lecturesData?.lectures?.length) {
      return (
        <p className="text-gray-500">
          No lectures yet. Start by adding one 🎥
        </p>
      );
    }

    return lecturesData.lectures.map((lecture, index) => (
      <Lecture
        key={lecture._id}
        lecture={lecture}
        courseId={courseId}
        index={index}
      />
    ));
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Add lectures to your course
        </h1>
        <p className="text-sm text-gray-500">
          Organize your content into structured lessons
        </p>
      </div>

      {/* INPUT */}
      <div>
        <Label>Lecture Title</Label>
        <Input
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter lecture title"
          disabled={isLoading}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 my-5">
        <Link to={`/admin/course/${courseId}`}>
          <Button variant="outline" disabled={isLoading}>
            Back to course
          </Button>
        </Link>

        <Button
          disabled={isLoading || !lectureTitle.trim()}
          onClick={handleCreateLecture}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Lecture"
          )}
        </Button>
      </div>

      {/* LECTURE LIST */}
      <div className="mt-10 space-y-4">
        {renderLectures()}
      </div>
    </div>
  );
};

export default CreateLecture;
