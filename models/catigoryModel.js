const { model, Schema } = require("mongoose");

const subcatigorySchema = new Schema(
  {
    subCatigorytitle: {
      type: String,
    },
    subCatigoryDescription: {
      type: String,
    },
    subCatigoryKeywords:Array,
    subCatigoryIsActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
    keywords: [
      {
        type: String,
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    subcatigory: [subcatigorySchema],
  },
  {
    timestamps: true,
  }
);
model("Catigorys", categorySchema);

