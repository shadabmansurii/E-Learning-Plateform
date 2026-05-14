import { useGetCreatorCoursesQuery } from "@/api/courseApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

/* ---------------- HELPERS ---------------- */
const formatPrice = (price) => {
  if (!price) return "NA";
  return `₹${price}`;
};

const StatusBadge = ({ isPublished }) => {
  return (
    <Badge
      className={
        isPublished
          ? "bg-green-200 text-green-800 hover:bg-green-200"
          : "bg-gray-200 text-gray-700"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </Badge>
  );
};

/* ---------------- COMPONENT ---------------- */
const CourseTable = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetCreatorCoursesQuery();

  const courses = data?.courses || [];

  /* ---------------- STATES ---------------- */

  if (isLoading || isFetching) {
    return (
      <div className="flex-1 mx-10">
        <Table className="mt-5">
          <CourseTableSkeleton />
        </Table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 mx-10 text-red-500">
        Failed to load courses. Please refresh.
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="flex-1 mx-10">
      <div className="flex justify-between items-center">
        <Button onClick={() => navigate("/admin/course/create")}>
          Create New Course
        </Button>
      </div>

      <Table className="mt-5">
        <TableCaption>Your created courses</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Title</TableHead>
            <TableHead className="w-1/4">Price</TableHead>
            <TableHead className="w-1/4">Status</TableHead>
            <TableHead className="w-1/4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.length === 0 ? (
            <EmptyState />
          ) : (
            courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">
                  {course.courseTitle}
                </TableCell>

                <TableCell>
                  {formatPrice(course.coursePrice)}
                </TableCell>

                <TableCell>
                  <StatusBadge isPublished={course.isPublished} />
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/course/${course._id}`)
                    }
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;

/* ---------------- EMPTY STATE ---------------- */
const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={4} className="text-center text-gray-500">
      No courses found. Start by creating one 🚀
    </TableCell>
  </TableRow>
);

/* ---------------- SKELETON ---------------- */
const CourseTableSkeleton = () => {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          <TableCell className="h-6 bg-gray-200 rounded" />
          <TableCell className="h-6 bg-gray-200 rounded" />
          <TableCell className="h-6 bg-gray-200 rounded" />
          <TableCell className="text-right">
            <span className="h-6 w-20 bg-gray-200 rounded inline-block" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
