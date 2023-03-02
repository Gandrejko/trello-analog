import {useContext} from "react";
import {SocketContext} from "../context/socket";
import {ListEvent} from "../common/enums";

export const useList = () => {
  const socket = useContext(SocketContext);

  const addList = (name: string) => {
    socket.emit(ListEvent.CREATE, name);
  }

  const deleteList = (id: string) => {
    socket.emit(ListEvent.DELETE, id);
  }

  const renameList = (id: string, name: string) => {
    socket.emit(ListEvent.RENAME, id, name);
  }

  return {addList, deleteList, renameList};
}
