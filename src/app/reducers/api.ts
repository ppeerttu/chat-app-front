import { AppState, INITIAL_STATE } from '../store/store';
import { ChatAction } from '../actions/action';
import { RoomActions } from '../actions/room';

const types = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

export function apiReducer(state: AppState = INITIAL_STATE, action: ChatAction): AppState {

  if (action.type.includes(types.REQUEST)) {
    return Object.assign({}, state, {
      waiting: true
    });
  }
  if (action.type.includes(types.SUCCESS)) {
    return Object.assign({}, state, {
      waiting: false
    });
  }
  if (action.type.includes(types.FAILED)) {
    return Object.assign({}, state, {
      waiting: false
    });
  }

  return Object.assign({}, state);
}
