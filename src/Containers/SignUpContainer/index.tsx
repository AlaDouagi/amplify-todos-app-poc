import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Form, Input, Button, notification, Popover, Col, Row } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';

/** Presentational */
import FormWrapper from '../../Components/Styled/FormWrapper';

/** App theme */
import { colors } from '../../Themes/Colors';

type Props = any;

type State = {
  confirmDirty: boolean;
  redirect: boolean;
  loading: boolean;
  email: string;
};

type UserFormData = {
  fname: string;
  lname: string;
  password: string;
  email: string;
  phoneNumber: number;
};

const passwordValidator = require('password-validator');

// create a password schema
const schema = new passwordValidator();

schema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

class SignUpContainer extends React.Component<Props, State> {
  private formRef = React.createRef<any>();

  state = {
    confirmDirty: false,
    redirect: false,
    loading: false,
    email: '',
  };

  /**
   * @param  {string} - type
   * @param  {string} - title
   * @param  {string} - message
   *
   * @returns {void} - no value returned
   */
  handleOpenNotification = (
    type: string,
    title: string,
    message: string
  ): void => {
    switch (type) {
      case 'success':
        notification['success']({
          message: title,
          description: message,
          placement: 'topRight',
          duration: 1.5,
          onClose: () => {
            this.setState({ redirect: true });
          },
        });
        break;

      case 'error':
        notification['error']({
          message: title,
          description: message,
          placement: 'topRight',
          duration: 1.5,
        });
        break;
    }
  };

  handleSubmit = async (values: UserFormData) => {
    const { fname, lname, password, email, phoneNumber } = values;

    // show loader
    this.setState({ loading: true });

    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name: `${fname} ${lname}`,
          phone_number: phoneNumber,
        },
      });

      notification.success({
        message: 'Succesfully signed up user!',
        description: 'Account created successfully, Redirecting you in a few!',
        placement: 'topRight',
        duration: 1.5,
        onClose: () => {
          this.setState({ redirect: true });
        },
      });

      this.setState({ email });
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Error signing up user',
        placement: 'topRight',
        duration: 1.5,
      });

      this.setState({
        loading: false,
      });
    }
  };

  handleConfirmBlur = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = async (
    rule: object,
    value: string
  ): Promise<string | undefined> => {
    const form = this.formRef.current;

    if (value && value !== form.getFieldValue('password')) {
      return 'Two passwords that you enter is inconsistent!';
    }
  };

  // validateToNextPassword = (
  //   rule: object,
  //   value: string,
  //   callback: (message?: string) => void
  // ) => {
  //   const form = this.props.form;
  //   const validationRulesErrors = schema.validate(value, { list: true });

  //   if (value && this.state.confirmDirty) {
  //     form.validateFields(['confirm'], { force: true });
  //   }
  //   if (validationRulesErrors.length > 0) {
  //     callback(this.formatPasswordValidateError(validationRulesErrors));
  //   }
  //   callback();
  // };

  // formatPasswordValidateError = (errors: Array<string>) => {
  //   for (let i = 0; i < errors.length; i++) {
  //     if (errors[i] === 'min') {
  //       return 'password length should be a at least 8 characters';
  //     } else if (errors[i] === 'lowercase') {
  //       return 'password should contain lowercase letters';
  //     } else if (errors[i] === 'uppercase') {
  //       return 'password should contain uppercase letters';
  //     } else if (errors[i] === 'digits') {
  //       return 'password should contain digits';
  //     } else if (errors[i] === 'symbols') {
  //       return 'password should contain symbols';
  //     }
  //   }
  // };

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
        <FormWrapper
          name="signUp"
          onFinish={this.handleSubmit}
          ref={this.formRef}
        >
          <Form.Item
            name="fname"
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: colors.transparentBlack }} />
              }
              placeholder="First Name"
            />
          </Form.Item>
          <Form.Item
            name="lname"
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
              },
            ]}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: colors.transparentBlack }} />
              }
              placeholder="Last Name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input
              prefix={
                <MailOutlined style={{ color: colors.transparentBlack }} />
              }
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: 'Please input your phone number!',
              },
            ]}
          >
            <Input
              prefix={
                <PhoneOutlined style={{ color: colors.transparentBlack }} />
              }
              placeholder="Phone Number"
            />
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
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input
                prefix={
                  <LockOutlined style={{ color: colors.transparentBlack }} />
                }
                type="password"
                placeholder="Password"
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
              {
                validator: this.compareToFirstPassword as any,
              },
            ]}
          >
            <Input
              prefix={
                <LockOutlined style={{ color: colors.transparentBlack }} />
              }
              type="password"
              placeholder="Confirm Password"
              onBlur={this.handleConfirmBlur}
            />
          </Form.Item>

          <Form.Item className="text-center">
            <Row>
              <Col lg={24}>
                <Button
                  loading={loading}
                  style={{ width: '100%' }}
                  type="primary"
                  disabled={loading}
                  htmlType="submit"
                >
                  Register
                </Button>
              </Col>
              <Col lg={24}>
                Or <Link to="/login">login to your account!</Link>
              </Col>
            </Row>
          </Form.Item>
        </FormWrapper>
        {redirect && (
          <Redirect
            to={{
              pathname: '/verify-code',
              search: `?email=${this.state.email}`,
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default SignUpContainer;
