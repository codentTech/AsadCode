"use client";

export const IMAGE_FILE_TYPES = Object.freeze(["image/jpeg", "image/png", "image/webp"]);

export const STYLE_GUIDE_FILE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/quicktime",
]);

export const MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_STYLE_GUIDE_UPLOAD_SIZE = 20 * 1024 * 1024; // 20MB
