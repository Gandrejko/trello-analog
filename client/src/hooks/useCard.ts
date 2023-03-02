import {useContext} from "react";
import {SocketContext} from "../context/socket";
import {CardEvent} from "../common/enums";

export const useCard = () => {
  const socket = useContext(SocketContext);

  const addCard = (listId: string, cardName: string): void => {
    socket.emit(CardEvent.CREATE, listId, cardName);
  }

  const removeCard = (listId: string, cardId: string): void => {
    socket.emit(CardEvent.DELETE, listId, cardId);
  }

  const renameCard = (listId: string, cardId: string, name: string): void => {
    socket.emit(CardEvent.RENAME, listId, cardId, name);
  }

  const changeDescriptionCard = (listId: string, cardId: string, description: string): void => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, listId, cardId, description);
  }

  const duplicateCard = (listId: string, cardId: string): void => {
    socket.emit(CardEvent.DUPLICATE, listId, cardId);
  }

  return { addCard, removeCard, renameCard, changeDescriptionCard, duplicateCard };
}
