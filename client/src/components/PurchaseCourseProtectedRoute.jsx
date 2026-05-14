import { useGetCourseDetailsWithStatusQuery } from "@/api/purchaseApi";
import { Navigate, useParams } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();

  const { data, isLoading } =
    useGetCourseDetailsWithStatusQuery(courseId);

  if (isLoading) return <p>Loading...</p>;

  console.log("🔐 Access Check:", data);

  // ✅ FIX HERE
  return data?.purchased
    ? children
    : <Navigate to={`/course-details/${courseId}`} />;
};

export default PurchaseCourseProtectedRoute;
