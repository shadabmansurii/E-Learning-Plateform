import { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/api/courseApi";

const MEDIA_API = "http://localhost:8000/api/v1/media";

const LectureTab = () => {
  const { id: courseId, lectureId } = useParams();
  const navigate = useNavigate();

  /* ---------------- FETCH ---------------- */
  const { data } = useGetLectureByIdQuery(lectureId);
  const lecture = data?.lecture;

  /* ---------------- STATE ---------------- */
  const [title, setTitle] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);

  const [notesFile, setNotesFile] = useState(null);
  const [notesTitle, setNotesTitle] = useState("");

  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!lecture) return;

    setTitle(lecture.lectureTitle || "");
    setIsFree(lecture.isPreviewFree || false);

    if (lecture.videoUrl) {
      setVideoInfo({
        videoUrl: lecture.videoUrl,
        publicId: lecture.publicId,
      });
    }
  }, [lecture]);

  /* ---------------- API ---------------- */
  const [editLecture, { isLoading }] = useEditLectureMutation();
  const [removeLecture, { isLoading: removing }] = useRemoveLectureMutation();

  /* ---------------- VIDEO UPLOAD ---------------- */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Invalid file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(0);

    try {
      const res = await axios.post(
        `${MEDIA_API}/upload-video`,
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.floor(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      const data = res?.data?.data || res?.data;

      setVideoInfo({
        videoUrl: data.url,
        publicId: data.public_id,
      });

      toast.success("Video uploaded");

    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }

    if (!videoInfo) {
      toast.error("Upload video first");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("lectureTitle", title);
      formData.append("isPreviewFree", isFree);

      formData.append("videoUrl", videoInfo.videoUrl);
      formData.append("publicId", videoInfo.publicId);

      // NOTES
      if (notesFile) {
        formData.append("notes", notesFile);
        formData.append("notesTitle", notesTitle);
      }

      // ASSIGNMENT
      if (assignmentFile) {
        formData.append("assignment", assignmentFile);
        formData.append("assignmentTitle", assignmentTitle);
        formData.append("assignmentDesc", assignmentDesc);
      }

      const res = await editLecture({
        courseId,
        lectureId,
        data: formData,
      }).unwrap();

      toast.success(res?.message || "Lecture updated");

    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete lecture?")) return;

    try {
      await removeLecture(lectureId).unwrap();
      toast.success("Lecture deleted");

      navigate(`/admin/course/${courseId}/lecture`);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Update lecture details
          </CardDescription>
        </div>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={removing}
        >
          {removing ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent>

        {/* TITLE */}
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* VIDEO */}
        <div className="my-5">
          <Label>Video Upload</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleUpload}
          />
        </div>

        {/* NOTES */}
        <div className="my-5">
          <Label>Notes (PDF)</Label>
          <Input
            type="file"
            onChange={(e) => setNotesFile(e.target.files[0])}
          />
          <Input
            placeholder="Notes Title"
            value={notesTitle}
            onChange={(e) => setNotesTitle(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* ASSIGNMENT */}
        <div className="my-5">
          <Label>Assignment</Label>
          <Input
            type="file"
            onChange={(e) =>
              setAssignmentFile(e.target.files[0])
            }
          />

          <Input
            placeholder="Assignment Title"
            value={assignmentTitle}
            onChange={(e) =>
              setAssignmentTitle(e.target.value)
            }
            className="mt-2"
          />

          <Input
            placeholder="Assignment Description"
            value={assignmentDesc}
            onChange={(e) =>
              setAssignmentDesc(e.target.value)
            }
            className="mt-2"
          />
        </div>

        {/* FREE */}
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} />
          <Label>Free Preview</Label>
        </div>

        {/* PROGRESS */}
        {uploading && (
          <div className="my-4">
            <Progress value={progress} />
            <p>{progress}% uploading...</p>
          </div>
        )}

        {/* VIDEO PREVIEW */}
        {videoInfo?.videoUrl && (
          <video
            src={videoInfo.videoUrl}
            controls
            className="w-64 mt-3"
          />
        )}

        {/* BUTTON */}
        <Button
          className="mt-5"
          onClick={handleUpdate}
          disabled={isLoading || uploading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Update Lecture"
          )}
        </Button>

      </CardContent>
    </Card>
  );
};

export default LectureTab;
