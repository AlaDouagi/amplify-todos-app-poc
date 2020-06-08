import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from '@lokibai/react-store';
import { API, graphqlOperation } from 'aws-amplify';

import { ENTER_KEY } from './constants';
// import { Action } from '../../store';
import { createTodo } from '../../graphql/mutations';

const createTodoMutation = (todoDetails: any) =>
  API.graphql(graphqlOperation(createTodo, todoDetails));

const Header: React.SFC<any> = ({ groupName, title = 'todos', readOnly }) => {
  const input = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (input && input.current) {
      input.current.focus();
    }
  }, []);

  const onChange = (e: {
    target: { value: React.SetStateAction<string> };
  }): void => {
    setText(e.target.value);
  };

  const onKeyDown = async (e: { keyCode: number }) => {
    if (e.keyCode !== ENTER_KEY) return;

    const value = text.trim();

    if (value) {
      const {
        data: { createTodo: todo },
      }: any = await createTodoMutation({
        input: {
          title: value,
          description: '',
          done: false,
        },
      });

      dispatch({ type: 'create', payload: { todo, groupName } });

      setText('');
    }
  };

  return (
    <header
      className="header"
      style={readOnly ? { paddingBottom: '65px' } : undefined}
    >
      <h1>{title}</h1>

      {!readOnly && (
        <input
          ref={input}
          className="new-todo"
          placeholder="What needs to be done?"
          value={text}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      )}
    </header>
  );
};

export default Header;
