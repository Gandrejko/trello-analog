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
import {useCardSocket} from "../../hooks/useCardSocket";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  onClick: () => void;
};

export const CardItem = ({ card, isDragging, provided, onClick }: Props) => {
const {removeCard} = useCardSocket()
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
          onChange={() => {}}
          title={card.name}
          fontSize="large"
          bold={true}
        />
        <Text text={card.description} onChange={() => {}} />
        <Footer>
          <DeleteButton onClick={onClick} />
          <Splitter />
          <CopyButton onClick={() => {}} />
        </Footer>
      </Content>
    </Container>
  );
};
