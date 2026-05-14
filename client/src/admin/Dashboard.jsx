import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/api/purchaseApi";

/* ---------------- COMPONENT ---------------- */
const Dashboard = () => {
  const { data, isLoading, isError } = useGetPurchasedCoursesQuery();

  const purchasedCourse = data?.purchasedCourse || [];

  /* ---------------- FIX: useMemo ALWAYS TOP ---------------- */
  const { courseData, totalRevenue, totalSales } = useMemo(() => {

    if (!purchasedCourse.length) {
      return {
        courseData: [],
        totalRevenue: 0,
        totalSales: 0,
      };
    }

    const validCourses = purchasedCourse.filter(
      (item) => item?.courseId
    );

    const chartData = validCourses.map((item) => ({
      name: item.courseId.courseTitle,
      price: item.courseId.coursePrice || 0,
    }));

    const revenue = purchasedCourse.reduce(
      (acc, item) => acc + (item.amount || 0),
      0
    );

    return {
      courseData: chartData,
      totalRevenue: revenue,
      totalSales: purchasedCourse.length,
    };
  }, [purchasedCourse]);

  /* ---------------- NOW SAFE RETURNS ---------------- */

  if (isLoading) {
    return <p className="text-gray-500">Loading analytics...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-500">
        Failed to load dashboard data.
      </p>
    );
  }

  if (!purchasedCourse.length) {
    return (
      <p className="text-gray-500">
        No sales data available yet 📊
      </p>
    );
  }

  if (!courseData.length) {
    return (
      <p className="text-gray-500">
        No valid course data available.
      </p>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

      {/* TOTAL SALES */}
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            {totalSales}
          </p>
        </CardContent>
      </Card>

      {/* TOTAL REVENUE */}
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            ₹{totalRevenue}
          </p>
        </CardContent>
      </Card>

      {/* CHART */}
      <Card className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle>Course Prices</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={80}
              />

              <YAxis />

              <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
