import * as React from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { RouteComponentProps, useHistory } from 'react-router';
import { useAsync } from 'react-use';
import { Layout, Menu, notification, Row, Col } from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { listTodos, getMatchingTodos } from '../../graphql/queries';

import Todos from '../Todos';

/** App Theme */
import { colors } from '../../Themes/Colors';

/** App Constatns */
import { AUTH_USER_TOKEN_KEY } from '../../Utils/constants';
import { ClickParam } from 'antd/lib/menu';

const listQuery: any = (query?: any) =>
  API.graphql(graphqlOperation(listTodos, query));

const getMatchingTodosQuery: any = (query?: any) =>
  API.graphql(graphqlOperation(getMatchingTodos, query));

const DashBoardContainer: React.SFC<RouteComponentProps> = (props) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const history = useHistory();

  const { value: loggedUserId } = useAsync(() =>
    Auth.currentSession().then((data: any) => data.accessToken.payload.sub)
  );

  const handleLogout = async (event: ClickParam) => {
    try {
      await Auth.signOut({ global: true });

      localStorage.removeItem(AUTH_USER_TOKEN_KEY);
      history.push('/login');
    } catch (err) {
      notification.error({ message: err.message });
    }
  };

  const toggleColloapse = React.useCallback(() => {
    setCollapsed((on) => !on);
  }, []);

  const getUserTodos = React.useCallback(
    () =>
      listQuery({
        filter: { owner: { eq: loggedUserId } },
      }).then((res: any) => res.data.listTodos.items),
    [loggedUserId]
  );

  const getMatchedTodos = React.useCallback(
    () =>
      getMatchingTodosQuery({
        owner: loggedUserId,
      }).then((res: any) => res.data.getMatchingTodos),
    [loggedUserId]
  );

  return (
    <Layout className="cover" id="app-header">
      <Layout.Sider
        className="cover"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <HomeOutlined />
            <span>Home</span>
          </Menu.Item>
          <Menu.Item key="2">
            <SettingOutlined />
            <span>Settings</span>
          </Menu.Item>
          <Menu.Item key="3" onClick={handleLogout}>
            <LogoutOutlined />
            <span>Logout</span>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ background: colors.white, padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={toggleColloapse} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={toggleColloapse} />
          )}
        </Layout.Header>
        <Layout.Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colors.white,
            minHeight: 280,
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Todos
                name="userTodos"
                headerTitle="Your todos"
                todosItemsResolver={getUserTodos}
              />
            </Col>
            <Col span={12}>
              <Todos
                name="matchedTodos"
                headerTitle="Matched todos"
                itemClassnamesResolver={(todo: any) => ({
                  'shiny-green-background': todo.owner !== loggedUserId,
                })}
                todosItemsResolver={getMatchedTodos}
                readOnly
              />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DashBoardContainer;
