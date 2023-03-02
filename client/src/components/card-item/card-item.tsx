import type { DraggableProvided } from "@hello-pangea/dnd";
import React, {useContext} from "react";

import type { Card } from "../../common/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import {SocketContext} from "../../context/socket";
import {useCard} from "../../hooks/useCard";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string;
};

export const CardItem = ({ card, isDragging, provided, listId }: Props) => {
const {renameCard, removeCard} = useCard();
  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={(value) => renameCard(listId, card.id, value)}
          title={card.name}
          fontSize="large"
          bold={true}
        />
        <Text text={card.description} onChange={() => {}} />
        <Footer>
          <DeleteButton onClick={() => removeCard(listId, card.id)} />
          <Splitter />
          <CopyButton onClick={() => {}} />
        </Footer>
      </Content>
    </Container>
  );
};
