import produce from 'immer';
import { ALL_TODOS } from './Containers/Todos/constants';

export type NowShowing = string;
export type Todo = {
  id: number;
  title: string;
  done?: boolean;
  description?: string;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type AppState = {
  nowShowing: NowShowing;
  todos: Todo[];
};

export type Action =
  | { type: 'load'; payload: [Todo] }
  | { type: 'create'; payload: Todo }
  | { type: 'update'; payload: any } // why error
  | { type: 'toggle'; payload: { id: Todo['id'] } }
  | { type: 'toggleAll'; payload: { done: Todo['done'] } }
  | { type: 'destroy'; payload: { id: Todo['id'] } }
  | { type: 'clearCompleted'; payload: null }
  | {
      type: 'toggleShowing';
      payload: { nowShowing: AppState['nowShowing'] };
    };

export const initialState: AppState = {
  nowShowing: ALL_TODOS,
  todos: [],
};

export const reducer = produce(
  (state: AppState, action: Action): AppState => {
    const { payload } = action;

    switch (action.type) {
      case 'load':
        state.todos = payload;
        return state;
      case 'create':
        state.todos.push(payload);
        return state;
      case 'update':
        state.todos.forEach((todo) => {
          if (todo.id === payload.id) {
            todo.title = payload.title;
          }
        });
        return state;
      case 'toggle':
        state.todos.forEach((todo) => {
          if (todo.id === payload.id) {
            todo.done = !todo.done;
          }
        });
        return state;
      case 'toggleAll':
        state.todos.forEach((todo) => {
          todo.done = payload.done;
        });
        return state;
      case 'destroy':
        state.todos = state.todos.filter((todo) => todo.id !== payload.id);
        return state;
      case 'clearCompleted':
        state.todos = state.todos.filter((todo) => !todo.done);
        return state;
      case 'toggleShowing':
        state.nowShowing = payload.nowShowing;
        return state;
      default:
        return state;
    }
  }
);
