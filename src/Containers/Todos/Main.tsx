import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from '@lokibai/react-store';
import { API, graphqlOperation } from 'aws-amplify';

import {
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  ENTER_KEY,
} from './constants';
import { AppState, Todo, Action } from '../../store';
import { updateTodo, deleteTodo } from '../../graphql/mutations';

const updateTodoMutation = (todoDetails: any) =>
  API.graphql(graphqlOperation(updateTodo, todoDetails));

const deleteTodoMutation = (todoDetails: any) =>
  API.graphql(graphqlOperation(deleteTodo, todoDetails));

const identity = (x: any) => x;

const Main: React.FunctionComponent<any> = ({
  readOnly,
  todosItemsResolver,
  itemClassnamesResolver,
  groupName,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadTodos() {
      const items: any = await todosItemsResolver();

      dispatch({
        type: 'load',
        payload: { todos: items, groupName },
      });
    }

    loadTodos();
  }, [dispatch, todosItemsResolver, groupName]);

  const { nowShowing = ALL_TODOS, todos = [] } = useSelector(
    (state: AppState): AppState => state[groupName] ?? {}
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
      payload: { done: checked, groupName },
    });
  };

  return (
    <div className="main">
      {!readOnly && (
        <input
          className="toggle-all"
          type="checkbox"
          onChange={onToggleAll}
          checked={activeTodoCount === 0}
        />
      )}

      <ul className="todo-list">
        {showTodos.map((todo) => (
          <TodoItem
            groupName={groupName}
            key={todo.id}
            todo={todo}
            readOnly={readOnly}
            itemClassnamesResolver={itemClassnamesResolver}
          />
        ))}
      </ul>
    </div>
  );
};

const TodoItem: React.FunctionComponent<{
  todo: Todo;
  readOnly: boolean;
  itemClassnamesResolver: Function;
  groupName: string;
}> = ({ todo, readOnly, itemClassnamesResolver = () => ({}), groupName }) => {
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

    dispatch({
      type: 'toggle',
      payload: { id: updatedTodo.id, groupName },
    } as Action);
  };

  const onDestroy = async (): Promise<void> => {
    const {
      data: { deleteTodo: deletedTodo },
    }: any = await deleteTodoMutation({ input: { id: todo.id } });

    dispatch({
      type: 'destroy',
      payload: { id: deletedTodo.id, groupName },
    } as Action);
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
          groupName,
        },
      });
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
        ...itemClassnamesResolver(todo),
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.done}
          onChange={readOnly ? identity : onToggle}
        />
        <label onDoubleClick={readOnly ? identity : onEdit}>{todo.title}</label>
        {!readOnly && <button className="destroy" onClick={onDestroy} />}
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
