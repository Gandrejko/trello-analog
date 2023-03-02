import {useContext} from "react";
import {SocketContext} from "../context/socket";
import {CardEvent, ListEvent} from "../common/enums";

export const useList = () => {
  const socket = useContext(SocketContext);

  const removeList = (listName: string) => {
    socket.emit(ListEvent.CREATE, listName);
  }

  return {removeList};
}
