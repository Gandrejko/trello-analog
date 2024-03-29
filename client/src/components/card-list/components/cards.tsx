import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import {Draggable} from '@hello-pangea/dnd';
import React from 'react';

import {Card} from '../../../common/types';
import {CardItem} from '../../card-item/card-item';
import {useCard} from "../../../hooks/useCard";

type Props = {
  cards: Card[];
  listId: string;
};

const Cards = ({cards, listId}: Props) => {
  return (
    <React.Fragment>
      {cards.map((card: Card, index: number) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(
            dragProvided: DraggableProvided,
            dragSnapshot: DraggableStateSnapshot,
          ) => (
            <CardItem
              listId={listId}
              key={card.id}
              card={card}
              isDragging={dragSnapshot.isDragging}
              provided={dragProvided}
            />
          )}
        </Draggable>
      ))}
    </React.Fragment>
  )
};

export {Cards};
