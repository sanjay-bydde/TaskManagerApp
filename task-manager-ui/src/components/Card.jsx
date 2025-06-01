import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons
import { Check, X } from "lucide-react";
import "../App.css";

const Card = ({ card, index, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);

  const handleSave = () => {
    if (editedTitle.trim() !== "" && editedTitle !== card.title) {
      onEdit({ ...card, title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(card.title);
    setIsEditing(false);
  };
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card ${snapshot.isDragging ? "card-dragging" : ""}`}
          style={provided.draggableProps.style}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="card-content">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                />
                <div className="card-actions">
                  <Check size={18} onClick={handleSave} title="Save" />
                  <X size={18} onClick={handleCancel} title="Cancel" />
                </div>
              </>
            ) : (
              <>
                <strong>{card.title}</strong>
                {isHovered && (
                  <div className="card-actions">
                    <FiEdit
                      className="icon-btn edit-icon"
                      onClick={() => setIsEditing(true)}
                      title="Edit"
                    />
                    <FiTrash2
                      className="icon-btn delete-icon"
                      onClick={() => onDelete(card.id)}
                      title="Delete"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
