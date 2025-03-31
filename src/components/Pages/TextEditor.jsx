import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function TextEditor() {
  const [content, setContent] = useState(""); // Ensure it's an empty string, not undefined
  const [savedItems, setSavedItems] = useState([]); // Store saved content

  const handleChange = (value) => {
    setContent(value || ""); // Ensure value is never undefined
  };

  const handleSave = () => {
    if (content.trim() !== "") {
      setSavedItems([...savedItems, content]);
      setContent(""); // Reset editor
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Rich Text Editor</h2>
      <ReactQuill value={content} onChange={handleChange} />

      <button
        onClick={handleSave}
        style={{
          marginTop: "10px",
          padding: "10px 15px",
          background: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Save
      </button>

      <h3>Saved Items:</h3>
      <ul style={{ padding: "10px", border: "1px solid #ccc", marginTop: "10px" }}>
        {savedItems.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px", listStyleType: "none" }}>
            <div dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TextEditor;
