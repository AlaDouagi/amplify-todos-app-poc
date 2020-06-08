// https://github.com/uniquexiaobai/todos-react-ts
import * as React from 'react';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const Todos: React.SFC<any> = ({
  headerTitle,
  readOnly = false,
  todosItemsResolver,
  itemClassnamesResolver,
  name,
}) => (
  <div className="todoapp">
    <Header groupName={name} title={headerTitle} readOnly={readOnly} />
    <Main
      groupName={name}
      readOnly={readOnly}
      todosItemsResolver={todosItemsResolver}
      itemClassnamesResolver={itemClassnamesResolver}
    />
    <Footer groupName={name} readOnly={readOnly} />
  </div>
);

export default Todos;
