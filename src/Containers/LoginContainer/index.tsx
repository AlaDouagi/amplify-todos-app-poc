import * as React from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { Auth } from 'aws-amplify';
import { Form, Input, Button, notification, Col, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

/** Presentational */
import FormWrapper from '../../Components/Styled/FormWrapper';

/** App theme */
import { colors } from '../../Themes/Colors';

/** App constants */
import { AUTH_USER_TOKEN_KEY } from '../../Utils/constants';
import { validateToken } from '../../Utils/Helpers';

const LoginContainer: React.SFC<any> = () => {
  const formRef = React.useRef<any>();

  const [tokenIsSet, setTokenIsSet] = React.useState(
    validateToken(localStorage.getItem(AUTH_USER_TOKEN_KEY))
  );

  const location = useLocation();

  const { from } = (location.state as any) || {
    from: {
      pathname: '/dashboard',
    },
  };

  const submit = React.useCallback(
    async (values: { username: string; password: string }) => {
      const { username, password } = values;

      try {
        const user = await Auth.signIn(username, password);

        localStorage.setItem(
          AUTH_USER_TOKEN_KEY,
          user.signInUserSession.accessToken.jwtToken
        );

        notification.success({
          message: 'Succesfully logged in!',
          description: 'Logged in successfully, Redirecting you in a few!',
          placement: 'topRight',
          duration: 1.5,
        });

        setTokenIsSet(true);
      } catch (err) {
        notification.error({
          message: 'Error',
          description: err.message,
          placement: 'topRight',
        });

        console.log(err);
      }
    },
    []
  );

  const [{ loading }, handleSubmit] = useAsyncFn(submit);

  return (
    <>
      <FormWrapper ref={formRef} onFinish={handleSubmit} className="login-form">
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: colors.transparentBlack }} />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined style={{ color: colors.transparentBlack }} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item className="text-center">
          <Row gutter={16}>
            <Col lg={24}>
              <Link
                style={{ float: 'right' }}
                className="login-form-forgot"
                to="/forgot-password"
              >
                Forgot password
              </Link>
            </Col>
            <Col lg={24}>
              <Button
                style={{ width: '100%' }}
                type="primary"
                loading={loading}
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Col>
            <Col lg={24}>
              Or <Link to="/signup">register now!</Link>
            </Col>
          </Row>
        </Form.Item>
      </FormWrapper>

      {tokenIsSet && <Redirect to={from.pathname} />}
    </>
  );
};

export default LoginContainer;
