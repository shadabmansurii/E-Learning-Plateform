import { useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

const MODULES = { toolbar: TOOLBAR_OPTIONS };

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write something...",
}) => {
  const modules = useMemo(() => MODULES, []);
  const formats = useMemo(() => FORMATS, []);

  const handleChange = useCallback(
    (content) => {
      onChange(content);
    },
    [onChange]
  );

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;
