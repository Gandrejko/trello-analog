import type { Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { LoggerService } from "../services/logger.service";

export class ListHandler extends SocketHandler {
  private readonly logger: LoggerService;
  constructor(io, db, reorderService, logger: LoggerService) {
    super(io, db, reorderService);
    this.logger = logger;
  }
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex,
    );
    this.db.setData(reorderedLists);
    this.updateLists();
  }

  private createList(name: string): void {
    if(name === '') {
      return this.logger.warning('The name of the list cannot be empty');
    }
    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    this.updateLists();
  }

  private deleteList(id: string): void {
    const lists = this.db.getData();
    const index = lists.findIndex((list) => list.id === id);
    if(index < 0) {
      return this.logger.warning('List is not defined');
    }

    const newLists = lists.slice(0, index).concat(lists.slice(index + 1));
    this.db.setData(newLists);
    this.updateLists();
  }

  private renameList(id: string, name: string): void {
    if(name === '') {
      return this.logger.warning('The name of the list cannot be empty');
    }
    const lists = this.db.getData();
    const index = lists.findIndex((list) => list.id === id);
    if(index < 0) {
      return this.logger.warning('List is not defined');
    }
    const list = lists[index];
    list.name = name;

    const updatedList = lists.slice(0, index).concat(list).concat(lists.slice(index + 1));
    this.db.setData(updatedList);
    this.updateLists();
  }
}
