"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
} from "lucide-react";
import "./tiptap-editor.css";
import CustomInput from "../custom-input/custom-input.component";
import CustomButton from "../custom-button/custom-button.component";
import Modal from "../modal/modal.component";

const TiptapEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
  className = "",
  minHeight = "200px",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        placeholder: placeholder,
      },
    },
    // Fix SSR hydration issues
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  // Don't render until component is mounted on client
  if (!isMounted || !editor) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap items-center gap-1">
          {/* Placeholder toolbar */}
          <div className="p-2 rounded bg-gray-200">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="p-2 rounded bg-gray-200">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="p-2 rounded bg-gray-200">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="p-4" style={{ minHeight }}>
          <div className="w-full h-full bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const addLink = () => {
    setShowLinkModal(true);
  };

  const insertLink = () => {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
      setLinkUrl("");
      setShowLinkModal(false);
    }
  };

  const addImage = () => {
    setShowImageModal(true);
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setImageUrl("");
      setShowImageModal(false);
    }
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Links and Images */}
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-300" : ""}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={clearFormatting}
          className="p-2 rounded hover:bg-gray-200 text-xs font-medium"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor Content */}
      <div className="p-4 relative" style={{ minHeight }}>
        <EditorContent editor={editor} className="min-h-full focus:outline-none" />
        {!content && (
          <div className="text-gray-400 pointer-events-none absolute top-6 left-4">
            {placeholder}
          </div>
        )}
      </div>

      {/* Link Modal */}
      <Modal
        title="Add Link"
        show={showLinkModal}
        onClose={() => {
          setShowLinkModal(false);
          setLinkUrl("");
        }}
      >
        <div className="mb-4">
          <CustomInput
            label="URL"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                insertLink();
              }
            }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <CustomButton
            text="Cancel"
            onClick={() => {
              setShowLinkModal(false);
              setLinkUrl("");
            }}
            className="btn-cancel"
          />
          <CustomButton text="Insert Link" onClick={insertLink} className="btn-primary" />
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal
        title="Add Image"
        show={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setImageUrl("");
        }}
      >
        <div className="mb-4">
          <CustomInput
            label="Image URL"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                insertImage();
              }
            }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <CustomButton
            text="Cancel"
            onClick={() => {
              setShowImageModal(false);
              setImageUrl("");
            }}
            className="btn-cancel"
          >
            Cancel
          </CustomButton>
          <CustomButton text="Insert Image" onClick={insertImage} className="btn-primary">
            Insert Image
          </CustomButton>
        </div>
      </Modal>
    </div>
  );
};

export default TiptapEditor;
