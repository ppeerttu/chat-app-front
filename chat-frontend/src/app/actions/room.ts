import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../store/store';
import { ApiCall } from '../models/apicall';

@Injectable()
export class RoomActions {
  static CREATE_ROOM_REQUEST = 'CREATE_ROOM_REQUEST';
  static CREATE_ROOM_SUCCESS = 'CREATER_ROOM_SUCCESS';
  static CREATE_ROOM_FAILED = 'CREATE_ROOM_FAILED';

  static FETCH_ROOMS_REQUEST = 'FETCH_ROOMS_REQUEST';
  static FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
  static FETCH_ROOMS_FAILED = 'FETCH_ROOMS_FAILED';

  static JOIN_ROOM_REQUEST = 'JOIN_ROOM_REQUEST';
  static JOIN_ROOM_SUCCESS = 'JOIN_ROOM_SUCCESS';
  static JOIN_ROOM_FAILED = 'JOIN_ROOM_FAILED';

  static USERS_ROOMS_REQUEST = 'USERS_ROOMS_REQUEST';
  static USERS_ROOMS_SUCCESS = 'USERS_ROOMS_SUCCESS';
  static USERS_ROOMS_FAILED = 'USERS_ROOMS_FAILED';

  constructor(private ngRedux: NgRedux<AppState>) {}

  createRoom(roomName: string, password = null, userId: number) {
    const apiCall = new ApiCall(
      'post',
      'rooms/new',
      [RoomActions.CREATE_ROOM_REQUEST, RoomActions.CREATE_ROOM_SUCCESS, RoomActions.CREATE_ROOM_FAILED],
      {roomName, password, userId}
    );
    this.ngRedux.dispatch({ type: RoomActions.CREATE_ROOM_REQUEST, apiCall });
  }

  fetchAll() {
    const apiCall = new ApiCall(
      'get',
      'rooms/all',
      [RoomActions.FETCH_ROOMS_REQUEST, RoomActions.FETCH_ROOMS_SUCCESS, RoomActions.FETCH_ROOMS_FAILED]
    );
    this.ngRedux.dispatch({ type: RoomActions.FETCH_ROOMS_REQUEST, apiCall });
    console.log(this.ngRedux);
  }

  joinRoom(roomId: number, userId: number, password: string) {
    const apiCall = new ApiCall(
      'post',
      'rooms/join/' + roomId,
      [RoomActions.JOIN_ROOM_REQUEST, RoomActions.JOIN_ROOM_SUCCESS, RoomActions.JOIN_ROOM_FAILED],
      {userId, password}
    );
    this.ngRedux.dispatch({ type: RoomActions.JOIN_ROOM_REQUEST, apiCall });
  }

  getUsersRooms(userId: number) {
    const apiCall = new ApiCall(
      'get',
      'rooms/in/' + userId,
      [RoomActions.USERS_ROOMS_REQUEST, RoomActions.USERS_ROOMS_SUCCESS, RoomActions.USERS_ROOMS_FAILED]
    );
    this.ngRedux.dispatch({ type: RoomActions.USERS_ROOMS_REQUEST, apiCall });
  }
}
