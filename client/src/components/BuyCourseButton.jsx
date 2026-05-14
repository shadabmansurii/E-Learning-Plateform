import React from "react";
import { Button } from "./ui/button";
import { usePurchaseCourseMutation } from "@/api/purchaseApi";
import { Loader2 } from "lucide-react";

const BuyCourseButton = ({ courseId }) => {
  const [purchaseCourse, { isLoading }] =
    usePurchaseCourseMutation();

  const handleBuy = async () => {
    try {
      const res = await purchaseCourse({ courseId }).unwrap();

      // 🔥 REDIRECT TO STRIPE
      window.location.href = res.url;

    } catch (err) {
      console.log("❌ Error:", err);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleBuy}
      className="bg-purple-500 w-full text-white hover:bg-purple-600"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        "Buy Course Now"
      )}
    </Button>
  );
};

export default BuyCourseButton;
