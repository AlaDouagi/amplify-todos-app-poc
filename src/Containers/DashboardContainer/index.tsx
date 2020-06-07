import * as React from 'react';
import { Auth } from 'aws-amplify';
import { RouteComponentProps, useHistory } from 'react-router';
import { Layout, Menu, notification, Row, Col } from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import Todos from '../Todos';

/** App Theme */
import { colors } from '../../Themes/Colors';

/** App Constatns */
import { AUTH_USER_TOKEN_KEY } from '../../Utils/constants';
import { ClickParam } from 'antd/lib/menu';

const DashBoardContainer: React.SFC<RouteComponentProps> = (props) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const history = useHistory();

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
          <Row>
            <Col span={12}>
              <Todos headerTitle="Your todos" />
            </Col>
            <Col span={12}>
              <Todos headerTitle="Matched todos" />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DashBoardContainer;
