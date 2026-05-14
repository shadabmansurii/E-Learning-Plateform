import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseTab from "./CourseTab";
import { useEffect } from "react";

/* ---------------- COMPONENT ---------------- */
const EditCourse = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  /* ---------------- GUARD ---------------- */
  useEffect(() => {
    if (!courseId) {
      navigate("/admin/course");
    }
  }, [courseId, navigate]);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex-1">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>

        <Link to={`/admin/course/${courseId}/lecture`}>
          <Button
            variant="link"
            className="hover:text-blue-600"
          >
            Go to lectures page →
          </Button>
        </Link>
      </div>

      {/* TABS (LMS READY STRUCTURE) */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="advanced" disabled>
            Advanced (Coming Soon)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <CourseTab courseId={courseId} />
        </TabsContent>

        {/* Future LMS Features */}
        <TabsContent value="advanced">
          <div className="text-sm text-gray-500">
            Advanced settings like SEO, visibility, and pricing tiers will go here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCourse;
