import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Form, Input, Button, notification, Popover, Row, Col } from 'antd';
import { LockOutlined } from '@ant-design/icons';

/** App theme */
import { colors } from '../../Themes/Colors';
import FormWrapper from '../../Components/Styled/FormWrapper';

type Props = RouteComponentProps;

type State = {
  confirmDirty: boolean;
  redirect: boolean;
  loading: boolean;
};

class PasswordResetContainer extends React.Component<Props, State> {
  private formRef = React.createRef<any>();

  state = {
    confirmDirty: false,
    redirect: false,
    loading: false,
  };

  handleBlur = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (
    rule: object,
    value: string,
    callback: (message?: string) => void
  ) => {
    const form = this.formRef.current;

    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (
    rule: object,
    value: string,
    callback: (message?: string) => void
  ) => {
    const form = this.formRef.current;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = async (values: any) => {
    const { password, code } = values;
    const username = this.props.location.search.split('=')[1];

    try {
      await Auth.forgotPasswordSubmit(
        username.trim(),
        code.trim(),
        password.trim()
      );

      notification.success({
        message: 'Success!',
        description: 'Password reset successful, Redirecting you in a few!',
        placement: 'topRight',
        duration: 1.5,
        onClose: () => {
          this.setState({ redirect: true });
        },
      });
    } catch (err) {
      notification['error']({
        message: 'Error reseting password',
        description: err.message,
        placement: 'topRight',
        duration: 1.5,
      });

      this.setState({ loading: false });
    }

    // show loader
    this.setState({ loading: true });
  };

  render() {
    const { redirect, loading } = this.state;

    const title = 'Password Policy';
    const passwordPolicyContent = (
      <React.Fragment>
        <h4>Your password should contain: </h4>
        <ul>
          <li>Minimum length of 8 characters</li>
          <li>Numerical characters (0-9)</li>
          <li>Special characters</li>
          <li>Uppercase letter</li>
          <li>Lowercase letter</li>
        </ul>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <FormWrapper onFinish={this.handleSubmit}>
          <div className="text-center">
            <p>Check your email for the confirmation code</p>
          </div>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: 'Please input your confirmation code!',
              },
            ]}
          >
            <Row>
              <Col lg={24}>
                <Input
                  prefix={
                    <LockOutlined style={{ color: colors.transparentBlack }} />
                  }
                  placeholder="Enter your verification code"
                />
              </Col>
            </Row>
          </Form.Item>

          <Popover
            placement="right"
            title={title}
            content={passwordPolicyContent}
            trigger="focus"
          >
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
                prefix={
                  <LockOutlined style={{ color: colors.transparentBlack }} />
                }
                type="password"
                placeholder="New Password"
              />
            </Form.Item>
          </Popover>

          <Form.Item
            name="confirm"
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
            ]}
          >
            <Row>
              <Col lg={24}>
                <Input
                  prefix={
                    <LockOutlined style={{ color: colors.transparentBlack }} />
                  }
                  type="password"
                  placeholder="Confirm Password"
                  onBlur={this.handleBlur}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item className="text-center">
            <Row>
              <Col lg={24}>
                <Button
                  style={{ width: '100%' }}
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Confirm username
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </FormWrapper>
        {redirect && <Redirect to={{ pathname: '/login' }} />}
      </React.Fragment>
    );
  }
}

export default PasswordResetContainer;
