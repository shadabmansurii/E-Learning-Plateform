import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ReactPlayer from "react-player/lazy";
import { Separator } from "../components/ui/separator";
import BuyCourseButton from "@/components/BuyCourseButton";
import { useGetCourseDetailsWithStatusQuery } from "@/api/purchaseApi";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } =
    useGetCourseDetailsWithStatusQuery(courseId);

  const [localPurchased, setLocalPurchased] = useState(false);

  useEffect(() => {
    if (data?.purchased) {
      setLocalPurchased(true);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details.</p>;

  const course = data?.course;

  const handleContinueCourse = () => {
    navigate(`/course-progress/${courseId}`);
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>

          <p>{course?.subTitle}</p>

          <p>
            Created By{" "}
            <span className="underline italic">
              {course?.creator?.name}
            </span>
          </p>

          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>{course?.createdAt?.split("T")[0]}</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

        {/* LEFT */}
        <div className="w-full lg:w-1/2">
          <h2 className="font-bold text-xl mb-2">Description</h2>

          <p
            dangerouslySetInnerHTML={{
              __html: course?.description,
            }}
          />

          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course?.lectures?.length} lectures
              </CardDescription>
            </CardHeader>

            <CardContent>
              {course?.lectures?.map((lecture) => (
                <div key={lecture._id} className="flex gap-2">
                  {lecture.isPreviewFree ? (
                    <PlayCircle size={14} />
                  ) : (
                    <Lock size={14} />
                  )}
                  {lecture.lectureTitle}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4">

              {/* THUMBNAIL */}
              <img
                src={`http://localhost:8000/${course?.courseThumbnail}`}
                className="w-full h-36 object-cover rounded mb-3"
              />

              {/* VIDEO */}
              <div className="w-full h-40 mb-3">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={
                    course?.lectures?.[0]?.videoInfo?.videoUrl ||
                    course?.lectures?.[0]?.videoUrl
                  }
                  controls
                />
              </div>

              <h2>{course?.lectures?.[0]?.lectureTitle}</h2>

              <Separator className="my-2" />

              <h2 className="font-bold">₹{course?.coursePrice}</h2>
            </CardContent>

            <CardFooter>
              {localPurchased ? (
                <button
                  onClick={handleContinueCourse}
                  className="bg-green-500 text-white w-full py-2 rounded"
                >
                  Continue Course
                </button>
              ) : (
                <BuyCourseButton
                  courseId={courseId}
                  onSuccess={() => setLocalPurchased(true)}
                />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
