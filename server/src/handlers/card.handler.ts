import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));

  }

  public createCard(listId: string, cardName: string): void {
    if(!cardName) return;
    const newCard = new Card(cardName, '');
    const lists = this.db.getData();
    const list = lists.find((list) => list.id === listId);

    if (!list) return;

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
    if(index < 0) return;

    const newCards = cards.slice(0, index).concat(cards.slice(index + 1))
    const updatedList = { ...list, cards: newCards };
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
