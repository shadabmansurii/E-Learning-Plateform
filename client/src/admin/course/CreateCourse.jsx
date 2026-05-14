import { useCreateCourseMutation } from "@/api/courseApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import   { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const INITIAL_STATE = {
  title: "",
  category: "",
};

const Create = () => {
  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const [input, setInput] = useState(INITIAL_STATE);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategory = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  const validateForm = () => {
    if (!input.title.trim()) {
      toast.error("Course title is required");
      return false;
    }
    if (!input.category) {
      toast.error("Please select a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await createCourse(input).unwrap();
      toast.success(res?.message || "Course created successfully");

      // redirect after success
      navigate("/admin/course");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create course");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course, add some basic details for your new course
        </h1>
        <p className="text-sm">
          Fill in the details to get started 🚀
        </p>
      </div>

      <div className="space-y-4">
        {/* TITLE */}
        <div>
          <Label>Title</Label>
          <Input
            name="title"
            value={input.title}
            onChange={handleChange}
            placeholder="Your Course Name"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <Label>Category</Label>
          <Select
            value={input.category}
            onValueChange={handleCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
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

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/course")}
          >
            Cancel
          </Button>

          <Button
            disabled={isLoading || !input.title || !input.category}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
