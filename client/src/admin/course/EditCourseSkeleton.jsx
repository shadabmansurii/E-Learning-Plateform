/* ---------------- REUSABLE BLOCKS ---------------- */
const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-300 rounded ${className}`} />
);

const SkeletonField = () => (
  <div className="space-y-2">
    <SkeletonBox className="h-5 w-1/6" />
    <SkeletonBox className="h-10 w-full" />
  </div>
);

/* ---------------- MAIN SKELETON ---------------- */
const EditCourseSkeleton = () => {
  return (
    <div className="flex-1 mx-10 animate-pulse">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-2">
        <SkeletonBox className="h-6 w-1/4" />
        <div className="flex gap-2">
          <SkeletonBox className="h-8 w-20" />
          <SkeletonBox className="h-8 w-20" />
        </div>
      </div>

      {/* TABS */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2 w-[400px]">
          <SkeletonBox className="h-8" />
          <SkeletonBox className="h-8" />
        </div>
      </div>

      {/* BASIC INFO CARD */}
      <div className="p-4 bg-gray-100 rounded-lg space-y-4">
        <SkeletonBox className="h-6 w-1/3" />
        <SkeletonBox className="h-4 w-2/3" />

        <div className="mt-5 space-y-4">
          <SkeletonField />
          <SkeletonField />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <SkeletonBox className="h-5 w-1/6" />
            <SkeletonBox className="h-32 w-full" />
          </div>

          {/* ROW FIELDS */}
          <div className="flex items-center gap-5">
            <div className="space-y-2">
              <SkeletonBox className="h-5 w-1/6" />
              <SkeletonBox className="h-10 w-[180px]" />
            </div>

            <div className="space-y-2">
              <SkeletonBox className="h-5 w-1/6" />
              <SkeletonBox className="h-10 w-[180px]" />
            </div>

            <div className="space-y-2">
              <SkeletonBox className="h-5 w-1/6" />
              <SkeletonBox className="h-10 w-[100px]" />
            </div>
          </div>

          {/* THUMBNAIL */}
          <div className="space-y-2">
            <SkeletonBox className="h-5 w-1/6" />
            <SkeletonBox className="h-10 w-[180px]" />
            <SkeletonBox className="h-32 w-64" />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <SkeletonBox className="h-10 w-20" />
            <SkeletonBox className="h-10 w-20" />
          </div>
        </div>
      </div>

      {/* LECTURE CARD */}
      <div className="p-4 bg-gray-100 rounded-lg space-y-4 mt-4">
        <SkeletonBox className="h-6 w-1/3" />
        <SkeletonBox className="h-4 w-2/3" />

        <div className="space-y-2">
          <SkeletonBox className="h-5 w-1/6" />
          <SkeletonBox className="h-10 w-full" />
        </div>

        <div className="flex gap-2 mt-4">
          <SkeletonBox className="h-10 w-20" />
          <SkeletonBox className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
};

export default EditCourseSkeleton;
