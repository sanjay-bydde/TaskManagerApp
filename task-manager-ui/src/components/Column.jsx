// Column.js
import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card";
import "../App.css";

const AddCard = ({ onAdd, onCancel }) => {
  const [content, setContent] = useState("");
  const handleAdd = () => {
    if (content.trim()) {
      onAdd(content.trim());
      setContent("");
      onCancel();
    }
  };
  return (
    <div className="add-card">
      <input
        type="text"
        placeholder="Add card..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        className="add-card-input"
      />
      <button onClick={handleAdd} className="add-card-button">
        Add Card
      </button>
    </div>
  );
};

const Column = ({
  column,
  title,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  return (
    <div className="column">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 className="column-title">{title}</h3>
        <button
          onClick={() => setShowAddCard(!showAddCard)}
          style={{
            background: "none",
            border: "none",
            color: "#90caf9",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
          title={showAddCard ? "Close" : "Add Card"}
        >
          {showAddCard ? "−" : "+"} {/* Toggle icon */}
          {/* Or use Lucide icon: */}
          {/* <Plus size={20} /> */}
        </button>
      </div>

      {showAddCard && (
        <AddCard
          onAdd={(content) => onAddCard(column, content)}
          onCancel={() => setShowAddCard(false)}
        />
      )}

      <Droppable droppableId={String(column)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`card-list ${
              snapshot.isDraggingOver ? "drag-over" : ""
            }`}
          >
            {cards
              .filter((card) => card && card.id)
              .sort((a, b) => a.order - b.order)
              .map((card, index) => (
                <Card
                  key={String(card.id)}
                  card={card}
                  index={index}
                  onEdit={(updatedCard) => onEditCard(column, updatedCard)}
                  onDelete={(cardId) => onDeleteCard(column, cardId)}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
