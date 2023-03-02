import {useContext} from "react";
import {SocketContext} from "../context/socket";
import {CardEvent} from "../common/enums";

export const useCard = () => {
  const socket = useContext(SocketContext);

  const addCard = (listId: string, cardName: string) => {
    socket.emit(CardEvent.CREATE, listId, cardName);
  }

  const removeCard = (listId: string, cardId: string) => {
    socket.emit(CardEvent.DELETE, listId, cardId);
  }

  const renameCard = (listId: string, cardId: string, name: string) => {
    socket.emit(CardEvent.RENAME, listId, cardId, name);
  }

  return { addCard, removeCard, renameCard };
}
