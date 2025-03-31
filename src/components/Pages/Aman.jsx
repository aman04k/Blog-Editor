import React, { useRef, useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; 

const Aman = () => {
  const [savedContent, setSavedContent] = useState([]);
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);

  useEffect(() => {
    if (editorContainerRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorContainerRef.current, {
        theme: "snow",
        placeholder: "Write something awesome...",
        modules: {
          toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "code-block"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  const handleSave = () => {
    if (quillRef.current) {
      const htmlContent = quillRef.current.root.innerHTML;
      setSavedContent((prev) => [...prev, htmlContent]);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-4">Rich Text Editor</h2>

      {/* Editor */}
      <div className="w-full max-w-3xl mx-auto bg-white shadow-md border p-4 rounded-md">
        <div ref={editorContainerRef} className="h-48 border rounded-md"></div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {/* Saved Content Display */}
      <div className="w-full max-w-3xl mx-auto mt-6">
        <h3 className="text-lg font-semibold mb-2">Saved Content:</h3>
        {savedContent.length === 0 ? (
          <p className="text-gray-500">No content saved yet.</p>
        ) : (
          savedContent.map((content, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded-md border mt-2">
              {/* ✅ FIXED: Apply Quill styles here */}
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Aman;
