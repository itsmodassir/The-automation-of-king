import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@Injectable()
export class InboxGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const tenantId = client.handshake.query.tenantId as string;
        if (tenantId) {
            client.join(`tenant:${tenantId}`);
            console.log(`Client connected to tenant room: tenant:${tenantId}`);
        }
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected');
    }

    notifyNewMessage(tenantId: string, message: any) {
        this.server.to(`tenant:${tenantId}`).emit('message:new', message);
    }
}
