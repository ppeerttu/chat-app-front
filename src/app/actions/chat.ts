import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { User, AppState } from '../models';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl;


@Injectable()
export class ChatActions {
  @select() user$: Observable<User>;

  private user: User;
  private io: any;
  private id: number;

  static SOCKET_CONNECTED = 'SOCKET_CONNECTED';
  static SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';

  static SEND_MESSAGE = 'SEND_MESSAGE';
  static RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

  static PUBLISH_ROOM_JOIN = 'PUBLISH_ROOM_JOIN';
  static RECEIVE_ROOM_JOIN = 'RECEIVE_ROOM_JOIN';

  static RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
  static PUBLISH_USER_INFO = 'PUBLISH_USER_INFO';

  static PUBLISH_ROOM_LEAVE = 'PUBLISH_ROOM_LEAVE';
  static RECEIVE_ROOM_LEAVE = 'RECEIVE_ROOM_LEAVE';

  /*
  EMIT: message, join, leave, userInfo
  RECEIVE: message, userJoin, userInfo, leave
  */
  constructor(private ngRedux: NgRedux<AppState>) {
    this.io = io(API_URL, {
      path: '/api/socket',
      autoConnect: false
    });

    this.user$.subscribe(user => {
      this.user = user;
    });

  }


  openSocket() {
    return new Promise((resolve, reject) => {
      this.io.connect();
      this.io.on('connect', () => {
        this.received(ChatActions.SOCKET_CONNECTED, {});
        resolve();
      });
      this.io.on('userInfo', payload => {
        this.received(ChatActions.RECEIVE_USER_INFO, payload);
      });
      this.io.on('message', payload => {
        this.received(ChatActions.RECEIVE_MESSAGE, payload);
      });
      this.io.on('userJoin', payload => {
        this.received(ChatActions.RECEIVE_ROOM_JOIN, payload);
        payload = Object.assign({}, payload, {
          user: this.user
        });
        if (payload.socketId && payload.roomId) {
          this.sendUserInfo(payload.socketId, this.user, payload.roomId);
        } else {
          throw new Error('userJoin received but payload did not contain socketId or roomId!');
        }
      });
      this.io.on('userLeave', payload => {
        this.received(ChatActions.RECEIVE_ROOM_LEAVE, payload);
      });
      this.io.on('disconnect', reason => {
        this.received(ChatActions.SOCKET_DISCONNECTED, reason);
        reject();
      });
      this.io.on('error', err => {
        reject(err);
      });
    });
  }

  isSocketConnected(): boolean {
    return this.io && this.io.connected;
  }

  sendMessage(roomId: number, userId: number, userName: string, message: string):void {
    if (!this.isSocketConnected()) {
      throw new Error('Socket not connected!');
    } else if (roomId === null) {
      throw new Error('Room not selected!');
    } else {
      const time = Date.now();
      const payload = {roomId, userId, userName, message, time};
      this.ngRedux.dispatch({ type: ChatActions.SEND_MESSAGE, payload});
      this.io.emit('message', {roomId, userId, message, userName, time});
    }
  }

  joinRoom(roomId: number, user: User): void {
    const payload = {roomId, user};
    if (!this.isSocketConnected()) {
      throw new Error('Socket not connected!');
    } else {
      this.ngRedux.dispatch({ type: ChatActions.PUBLISH_ROOM_JOIN, payload });
      this.io.emit('join', { roomId, user });
    }
  }

  sendUserInfo(socketId: string, user: User, roomId: number) {
    const payload = {socketId, user, roomId};
    if (!this.isSocketConnected()) {
      throw new Error('Socket not connected!');
    } else {
      this.ngRedux.dispatch({ type: ChatActions.PUBLISH_USER_INFO, payload });
      this.io.emit('userInfo', { socketId, user, roomId });
    }
  }

  leaveRoom(roomId: number, user: User) {
    const payload = {roomId, user};
    if (!this.isSocketConnected()) {
      throw new Error('Socket not connected!');
    } else {
      this.ngRedux.dispatch({ type: ChatActions.PUBLISH_ROOM_LEAVE, payload });
      this.io.emit('leave', {roomId, user});
    }
  }

  received(type: string, payload: any):void {
    this.ngRedux.dispatch({ type, payload });
  }

  closeSocket(): void {
    if (this.isSocketConnected()) {
      this.io.close(true);
      this.ngRedux.dispatch({ type: ChatActions.SOCKET_DISCONNECTED });
    } else {
      throw new Error('Tried to disconnect the socket even though socket was not connected!');
    }
  }

}
