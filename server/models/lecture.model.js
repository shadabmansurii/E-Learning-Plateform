import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },

    // 🎥 VIDEO
    videoUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },

    // 📄 NOTES
    notes: {
      title: {
        type: String,
      },
      fileUrl: {
        type: String, // PDF / DOC
      },
    },

    // 📝 ASSIGNMENT
    assignment: {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      fileUrl: {
        type: String, // optional file
      },
    },

    isPreviewFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
