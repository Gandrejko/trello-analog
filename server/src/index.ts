import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { lists } from './assets/mockData';
import { Database } from './data/database';
import { CardHandler } from './handlers/card.handler';
import { ListHandler } from './handlers/list.handler';
import { ReorderService } from './services/reorder.service';
import {LoggerService} from "./services/logger.service";

const PORT = 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const db = Database.Instance;
const reorderService = new ReorderService();

if (process.env.NODE_ENV !== 'production') {
  db.setData(lists);
}

const onConnection = (socket: Socket): void => {
  new ListHandler(io, db, reorderService, new LoggerService('ListService')).handleConnection(socket);
  new CardHandler(io, db, reorderService, new LoggerService('CardService')).handleConnection(socket);
};

io.on('connection', onConnection);

httpServer.listen(PORT, () => console.log('listening on port: ' + PORT));

export { httpServer };
