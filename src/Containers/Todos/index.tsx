// https://github.com/uniquexiaobai/todos-react-ts
import * as React from 'react';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const Todos: React.SFC<any> = ({ headerTitle }) => (
  <div className="todoapp">
    <Header title={headerTitle} />
    <Main />
    <Footer />
  </div>
);

export default Todos;
