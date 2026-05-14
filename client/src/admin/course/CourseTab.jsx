import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SelectValue } from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "../RichTextEditor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "@/api/courseApi";



/* ---------------- CONSTANTS ---------------- */
const CATEGORY_OPTIONS = [
  "Next JS",
  "Data Science",
  "Frontend Development",
  "Fullstack Development",
  "MERN Stack Development",
  "Backend Development",
  "Javascript",
  "Python",
  "Docker",
  "MongoDB",
  "HTML",
];

const LEVEL_OPTIONS = ["Beginner", "Medium", "Advance"];

const INITIAL_STATE = {
  courseTitle: "",
  subTitle: "",
  description: "",
  category: "",
  courseLevel: "",
  coursePrice: "",
  courseThumbnail: "",
};
const BasicCourseTab = ({ courseId }) => {
  const [fileName, setFileName] = useState("");

  const navigate = useNavigate();

  /* ---------------- API ---------------- */
  const { data: courseData, refetch } = useGetCourseByIdQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });

  const [editCourse, { isLoading }] = useEditCourseMutation();
  const [publishCourse] = usePublishCourseMutation();
  const [removeCourse, { isLoading: isRemoving }] = useRemoveCourseMutation();

  /* ---------------- STATE ---------------- */
  const [input, setInput] = useState(INITIAL_STATE);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  const course = courseData?.course;

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    if (!course) return;

    setInput({
      courseTitle: course.courseTitle || "",
      subTitle: course.subTitle || "",
      description: course.description || "",
      category: course.category || "",
      courseLevel: course.courseLevel || "",
      coursePrice: course.coursePrice || "",
      courseThumbnail: "",
    });

    setPreviewThumbnail(course.courseThumbnail);
  }, [course]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelect = (field) => (value) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleThumbnail = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setInput((prev) => ({ ...prev, courseThumbnail: file }));
  setFileName(file.name); // 👈 ye add karo

  const reader = new FileReader();
  reader.onloadend = () => setPreviewThumbnail(reader.result);
  reader.readAsDataURL(file);
};


  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.entries(input).forEach(([key, value]) => {
        if (!value) return;

        if (key === "coursePrice") {
          formData.append(key, Number(value));
        } else {
          formData.append(key, value);
        }
      });

      const res = await editCourse({
        id: courseId,
        formData,
      }).unwrap();

      toast.success(res?.message || "Course updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

const handlePublishToggle = async () => {
  try {
    const res = await publishCourse({
      courseId,
      isPublished: !course?.isPublished, // ✅ FIX
    }).unwrap();

    toast.success(res?.message);
    refetch();
  } catch {
    toast.error("Failed to update publish status");
  }
};


  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await removeCourse(courseId).unwrap();
      toast.success(res?.message || "Course deleted");
      navigate("/admin/course");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your course details here.</CardDescription>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePublishToggle}
            disabled={!course?.lectures?.length}
          >
            {course?.isPublished ? "Unpublish" : "Publish"}
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Remove Course"
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 mt-5">
        {/* TITLE */}
        <div>
          <Label>Title</Label>
          <Input
            name="courseTitle"
            value={input.courseTitle}
            onChange={handleChange}
          />
        </div>

        {/* SUBTITLE */}
        <div>
          <Label>Subtitle</Label>
          <Input
            name="subTitle"
            value={input.subTitle}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <Label>Description</Label>
          <RichTextEditor
            value={input.description}
            onChange={(val) =>
              setInput((prev) => ({ ...prev, description: val }))
            }
          />
        </div>

        {/* CATEGORY + LEVEL + PRICE */}
        <div className="flex gap-5">
          <div>
            <Label>Category</Label>
            <Select
              value={input.category}
              onValueChange={handleSelect("category")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>

                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Course Level</Label>

            <Select
              value={input.courseLevel}
              onValueChange={handleSelect("courseLevel")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Level</SelectLabel>

                  {LEVEL_OPTIONS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price (INR)</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* THUMBNAIL */}
        <div>
  <Label>Course Thumbnail</Label>

  <Input type="file" onChange={handleThumbnail} />

  {/* 👇 filename show */}
  {fileName && (
    <p className="text-sm mt-1 text-gray-600">{fileName}</p>
  )}

  {/* 👇 preview */}
  {previewThumbnail && (
    <img src={previewThumbnail} className="w-64 mt-2" />
  )}
</div>


        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin/course")}>Cancel</Button>

          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicCourseTab;
