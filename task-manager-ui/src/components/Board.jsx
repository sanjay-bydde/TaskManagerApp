import api from "../api";
import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useNavigate } from "react-router-dom";
import { mapColumnNameToId, mapIdToColumnName } from "./utils";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  result.splice(endIndex, 0, result.splice(startIndex, 1)[0]);
  return result;
};

const updateCardOrder = (cards) => {
  return cards.map((card, index) => ({
    ...card,
    order: index + 1,
  }));
};

const Board = () => {
  useAuthCheck();
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  const fetchCards = async () => {
    try {
      const response = await api.get("/cards");
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const cardIndex = cards.findIndex((c) => c.id.toString() === draggableId);
    if (cardIndex === -1) return;
    const card = cards[cardIndex];

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    if (sourceColumnId === destColumnId) {
      const columnCards = cards
        .filter((c) => mapColumnNameToId(c.column) === sourceColumnId)
        .sort((a, b) => a.order - b.order);
      const reordered = reorder(columnCards, source.index, destination.index);
      const updatedCardsInColumn = updateCardOrder(reordered);
      const newCards = cards
        .filter((c) => mapColumnNameToId(c.column) !== sourceColumnId)
        .concat(updatedCardsInColumn);
      setCards(newCards);
      try {
        await Promise.all(
          updatedCardsInColumn.map((c) =>
            api.put(`/cards/${c.id}`, {
              ...c,
              column: mapIdToColumnName(sourceColumnId),
              order: c.order,
            })
          )
        );
      } catch (error) {
        console.error("Error updating card orders:", error);
      }
    } else {
      const sourceCards = cards
        .filter(
          (c) =>
            mapColumnNameToId(c.column) === sourceColumnId &&
            c.id.toString() !== draggableId
        )
        .sort((a, b) => a.order - b.order);
      const destCards = cards
        .filter((c) => mapColumnNameToId(c.column) === destColumnId)
        .sort((a, b) => a.order - b.order);
      const newSourceCards = updateCardOrder(sourceCards);
      const newDestCards = Array.from(destCards);
      const insertIndex =
        destination.index > newDestCards.length
          ? newDestCards.length
          : destination.index;
      newDestCards.splice(insertIndex, 0, {
        ...card,
        column: mapIdToColumnName(destColumnId),
      });
      const updatedDestCards = updateCardOrder(newDestCards);
      const newCards = cards
        .filter(
          (c) =>
            mapColumnNameToId(c.column) !== sourceColumnId &&
            mapColumnNameToId(c.column) !== destColumnId
        )
        .concat(newSourceCards)
        .concat(updatedDestCards);
      setCards(newCards);
      try {
        await Promise.all([
          ...newSourceCards.map((c) =>
            api.put(`/cards/${c.id}`, {
              ...c,
              column: mapIdToColumnName(sourceColumnId),
              order: c.order,
            })
          ),
          ...updatedDestCards.map((c) =>
            api.put(`/cards/${c.id}`, {
              ...c,
              column: mapIdToColumnName(destColumnId),
              order: c.order,
            })
          ),
        ]);
      } catch (error) {
        console.error("Error updating cards after move:", error);
      }
    }
  };

  const addCard = async (columnId, title) => {
    const newCard = {
      title,
      description: "",
      column: mapIdToColumnName(columnId),
      order:
        cards.filter((c) => mapColumnNameToId(c.column) === columnId).length +
        1,
    };
    try {
      const response = await api.post("/cards", newCard);
      setCards((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };
  const handleEditCard = async (columnId, updatedCard) => {
    try {
      await api.put(`/cards/${updatedCard.id}`, updatedCard);
      setCards((prev) =>
        prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
      );
    } catch (error) {
      console.error("Error editing card:", error);
    }
  };

  const handleDeleteCard = async (columnId, cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <div className="board-container">
      <div className="board-header">
        <h1 className="board-title">Task Manager App</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="board-columns">
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "2rem",
            }}
          >
            {columns.map((col) => (
              <div className="column" key={col.id}>
                <Column
                  column={col.id}
                  title={col.title}
                  cards={cards.filter(
                    (card) => mapColumnNameToId(card.column) === col.id
                  )}
                  onAddCard={addCard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Board;
