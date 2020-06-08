import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from '@lokibai/react-store';
import { API, Auth, graphqlOperation } from 'aws-amplify';

import { ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { AppState, Todo, Action } from '../../store';
import { listTodos } from '../../graphql/queries';
import { updateTodo, deleteTodo } from '../../graphql/mutations';

const listQuery = (query?: any) =>
  API.graphql(graphqlOperation(listTodos, query));

const updateTodoMutation = (todoDetails: any) =>
  API.graphql(graphqlOperation(updateTodo, todoDetails));

const deleteTodoMutation = (todoDetails: any) =>
  API.graphql(graphqlOperation(deleteTodo, todoDetails));

const Main: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadUserTodos() {
      const {
        accessToken: {
          payload: { sub: userId },
        },
      }: any = await Auth.currentSession();

      const {
        data: {
          listTodos: { items },
        },
      }: any = await listQuery({ filter: { owner: { eq: userId } } });

      dispatch({
        type: 'load',
        payload: items,
      } as Action);
    }

    loadUserTodos();
  }, [dispatch]);

  const { nowShowing, todos } = useSelector(
    (state: AppState): AppState => state
  );

  const activeTodoCount: number = todos.reduce(
    (total: number, todo: Todo) => (todo.done ? total : total + 1),
    0
  );

  const showTodos: Todo[] = todos.filter((todo: Todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.done;
      case COMPLETED_TODOS:
        return todo.done;
      default:
        return true;
    }
  });

  // TODO: Configure batch update todos Mutation
  const onToggleAll = (e: { target: { checked: boolean } }): void => {
    const checked = e.target.checked;

    dispatch({
      type: 'toggleAll',
      payload: { done: checked },
    } as Action);
  };

  return (
    <div className="main">
      <input
        className="toggle-all"
        type="checkbox"
        onChange={onToggleAll}
        checked={activeTodoCount === 0}
      />

      <ul className="todo-list">
        {showTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

const TodoItem: React.FunctionComponent<{ todo: Todo }> = ({ todo }) => {
  const editingInput = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [editingText, setEditingText] = useState<string>(todo.title);
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    if (editing && editingInput && editingInput.current) {
      editingInput.current.focus();
    }
  }, [editing]);

  const onToggle = async (): Promise<void> => {
    const {
      data: { updateTodo: updatedTodo },
    }: any = await updateTodoMutation({ input: { ...todo, done: !todo.done } });

    dispatch({ type: 'toggle', payload: { id: updatedTodo.id } } as Action);
  };

  const onDestroy = async (): Promise<void> => {
    const {
      data: { deleteTodo: deletedTodo },
    }: any = await deleteTodoMutation({ input: { id: todo.id } });

    dispatch({ type: 'destroy', payload: { id: deletedTodo.id } } as Action);
  };

  const onEdit = (): void => {
    setEditing(true);
  };

  const onChange = (e: { target: { value: string } }): void => {
    setEditingText(e.target.value);
  };

  const onBlur = async (): Promise<void> => {
    const text: string = editingText.trim();

    if (!text) {
      onDestroy();
    } else if (text !== todo.title) {
      const {
        data: { updateTodo: updatedTodo },
      }: any = await updateTodoMutation({ input: { ...todo, title: text } });

      dispatch({
        type: 'update',
        payload: {
          id: updatedTodo.id,
          title: text,
        },
      } as Action);
      setEditing(false);
    }
  };

  const onKeyDown = (e: { which: number }): void => {
    if (e.which === ENTER_KEY) {
      onBlur();
    }
  };

  return (
    <li
      className={classNames({
        done: todo.done,
        editing: editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.done}
          onChange={onToggle}
        />
        <label onDoubleClick={onEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>

      <input
        ref={editingInput}
        className="edit"
        value={editingText}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </li>
  );
};

export default Main;
