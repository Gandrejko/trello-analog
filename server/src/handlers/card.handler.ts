import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import {LoggerService} from "../services/logger.service";

export class CardHandler extends SocketHandler {
  private readonly logger;

  constructor(io, db, reorderService, logger) {
    super(io, db, reorderService);
    this.logger = logger;
  }

  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescriptionCard.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
  }

  public createCard(listId: string, name: string): void {
    if(name === '') {
      return this.logger.warning('The name of the card cannot be empty');
    }
    const newCard = new Card(name, '');
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);

    if(!list) {
      return this.logger.warning('List is not defined');
    }

    const updatedList = { ...list, cards: list.cards.concat(newCard) };
    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list)),
    );
    this.updateLists();
  }
  public deleteCard(listId: string, cardId: string) {
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);
    const cards = list.cards;
    const index = cards.findIndex((card) => card.id === cardId);
    if(index < 0) {
      return this.logger.warning('Card is not defined');
    }

    const newCards = cards.slice(0, index).concat(cards.slice(index + 1))
    const updatedList = { ...list, cards: newCards };
    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list)),
    );
    this.updateLists();
  }

  private renameCard(listId: string, cardId: string, name: string): void {
    if(name === '') {
      this.logger.warning('The name of the card cannot be empty');
      return;
    }
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);
    const cards = list.cards;
    const index = cards.findIndex((card) => card.id === cardId);
    if(index < 0) {
      return this.logger.warning('Card is not defined');
    }
    const card = cards[index];
    card.name = name;

    const newCards = cards.slice(0, index).concat(card).concat(cards.slice(index + 1));
    const updatedList = { ...list, cards: newCards };
    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list)),
    );
    this.updateLists();
  }

  private changeDescriptionCard(listId: string, cardId: string, description: string): void {
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);
    const cards = list.cards;
    const index = cards.findIndex((card) => card.id === cardId);
    if(index < 0) {
      return this.logger.warning('Card is not defined');
    }
    const card = cards[index];
    card.description = description;

    const newCards = cards.slice(0, index).concat(card).concat(cards.slice(index + 1));
    const updatedList = { ...list, cards: newCards };
    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list)),
    );
    this.updateLists();
  }

  private duplicateCard(listId: string, cardId: string): void {
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);
    const cards = list.cards;
    const index = cards.findIndex((card) => card.id === cardId);
    if(index < 0) {
      return this.logger.warning('Card is not defined');
    }

    const card = cards[index];
    const newCard = card.clone();

    const updatedList = { ...list, cards: list.cards.concat(newCard) };
    this.db.setData(
      lists.map((list) => (list.id === listId ? updatedList : list)),
    );
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }
}
