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
export type AppState = any;
// {
//   nowShowing: NowShowing;
//   todos: Todo[];
//   matchedTodos: Todo[];
// };

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
  matchedTodos: [],
};

export const reducer = produce(
  (state: AppState, action: Action): AppState => {
    const { payload } = action;

    switch (action.type) {
      case 'load':
        state[payload.groupName] = {
          ...state[payload.groupName],
          todos: payload.todos,
        };
        return state;
      case 'create':
        state[payload.groupName].todos.push(payload.todo);
        return state;
      case 'update':
        state[payload.groupName].todos.forEach((todo: any) => {
          if (todo.id === payload.id) {
            todo.title = payload.title;
          }
        });
        return state;
      case 'toggle':
        state[payload.groupName].todos.forEach((todo: any) => {
          if (todo.id === payload.id) {
            todo.done = !todo.done;
          }
        });
        return state;
      case 'toggleAll':
        state[payload.groupName].todos.forEach((todo: any) => {
          todo.done = payload.done;
        });
        return state;
      case 'destroy':
        state[payload.groupName].todos = state[payload.groupName].todos.filter(
          (todo: any) => todo.id !== payload.id
        );
        return state;
      case 'clearCompleted':
        state[payload.groupName].todos = state[payload.groupName].todos.filter(
          (todo: any) => !todo.done
        );
        return state;
      case 'toggleShowing':
        state[payload.groupName].nowShowing = payload.nowShowing;
        return state;
      default:
        return state;
    }
  }
);
