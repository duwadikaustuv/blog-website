"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import to avoid SSR issues with Quill
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .ql-toolbar {
          background-color: white;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: #e5e7eb !important;
        }
        .dark .ql-toolbar {
          background-color: #1f2937;
          border-color: #374151 !important;
        }
        .dark .ql-stroke {
          stroke: #9ca3af !important;
        }
        .dark .ql-fill {
          fill: #9ca3af !important;
        }
        .dark .ql-picker {
          color: #9ca3af !important;
        }
        .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: #e5e7eb !important;
          font-size: 1rem !important;
          min-height: 300px;
        }
        .dark .ql-container {
          border-color: #374151 !important;
          background-color: #111827;
          color: white;
        }
        .ql-editor {
          min-height: 300px;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          cursor: pointer;
          display: block;
          margin: 1rem auto;
        }
        .ql-editor p {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: none;
        }
        .ql-editor img[width] {
          width: auto !important;
          max-width: 100% !important;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
}
