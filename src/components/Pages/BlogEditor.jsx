import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function BlogEditor() {
  const [openModal, setOpenModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [savedContent, setSavedContent] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [isSidebarMounted, setIsSidebarMounted] = useState(false);

  useEffect(() => {
    setIsSidebarMounted(true);
  }, []);

  const initializeQuill = () => {
    if (editorContainerRef.current) {
      editorContainerRef.current.innerHTML = "";
      quillRef.current = new Quill(editorContainerRef.current, {
        theme: "snow",
        placeholder: "Start writing your blog...",
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
  };

  const handleSelectOption = (type) => {
    setSelectedType(type);
    setDropdownOpen(false);
    setOpenModal(true);
    if (type === "paragraph") {
      setTimeout(() => initializeQuill(), 0);
    }
  };

  const handleSelect = (type) => {
    setSelectedType(type);
    setDropdownOpen(false);
    setOpenModal(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = () => {
    let newItem;
    const newId = `item-${Date.now()}`;
    if (selectedType === "heading") {
      newItem = { id: newId, content: `<h2>${inputValue}</h2>`, type: "Heading" };
      setInputValue("");
    } else if (selectedType === "image" && selectedFile) {
      newItem = {
        id: newId,
        content: `<img src="${URL.createObjectURL(selectedFile)}" alt="Uploaded" class="w-full h-auto" />`,
        type: "Image",
      };
      setSelectedFile(null);
    } else if (quillRef.current) {
      const htmlContent = quillRef.current.root.innerHTML;
      newItem = { id: newId, content: htmlContent, type: "Paragraph" };
    }

    if (newItem) {
      setSavedContent((prev) => [...prev, newItem]);
    }
    setOpenModal(false);
    setSelectedType(null);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(savedContent);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSavedContent(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] gap-6 min-h-screen bg-gray-100 py-6 px-4">
        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Blog Content</h3>
          <Droppable droppableId="savedContentList">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {savedContent.length === 0 ? (
                  <div className="text-gray-500 italic py-4">Drag content from the right sidebar here.</div>
                ) : (
                  savedContent.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className="bg-gray-50 shadow-sm rounded-md border border-gray-200 p-4 my-2 cursor-grab"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
          <button
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            ➕ Add Content Block
          </button>

          {dropdownOpen && (
            <div className="mt-2 bg-gray-100 rounded-md p-2">
              <div
                className="p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                onClick={() => handleSelect("heading")}
              >
                Heading
              </div>
              <div
                className="p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                onClick={() => handleSelectOption("paragraph")}
              >
                Paragraph
              </div>
              <div
                className="p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                onClick={() => handleSelect("image")}
              >+
                Image
              </div>
            </div>
          )}

          {/* Sidebar Content List */}
          <h4 className="mt-6 font-semibold">Content Types</h4>
          {isSidebarMounted && (
            <Droppable droppableId="sidebarContentList">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {savedContent.length === 0 ? (
                    <p className="text-gray-500 mt-4 italic">No content added yet.</p>
                  ) : (
                    <ul className="mt-4">
                      {savedContent.map((item, index) => (
                        <Draggable key={`sidebar-item-${item.id}`} draggableId={`sidebar-item-${item.id}`} index={index}>
                          {(dragProvided) => (
                            <li
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className="mb-2 p-3 bg-gray-50 shadow-sm rounded-md border border-gray-200 font-semibold cursor-grab"
                            >
                              {item.type}
                            </li>
                          )}
                        </Draggable>
                      ))}
                    </ul>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>

        {/* Modal for Adding Content */}
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl max-h-[90%] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add {selectedType}</h2>
              {selectedType === "image" ? (
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-md" />
              ) : selectedType === "paragraph" ? (
                <div ref={editorContainerRef} className="border p-2 w-full rounded-md" />
              ) : (
                <input
                  type="text"
                  className="border p-2 w-full rounded-md"
                  placeholder={`Enter ${selectedType}...`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}

export default BlogEditor;