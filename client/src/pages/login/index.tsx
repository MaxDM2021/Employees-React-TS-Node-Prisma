import { Row, Card, Form, Space, Typography } from "antd";
import { useState, useEffect } from "react";

import { Layout } from "../../components/layout";
import { CustomInput } from "../../components/custom-input";
import { PasswordInput } from "../../components/password-input";
import { CustomButton } from "../../components/custom-button";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../path";
import { UserData, useLoginMutation } from "../../app/services/auth";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { ErrorMessage } from "../../components/error-message";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const user = useSelector(selectUser);
  const [loginUser, loginUserResult] = useLoginMutation();


useEffect(() => { if (user) {
  navigate('/');
}}, [user, navigate])


  const login = async (data: UserData) => {

    try {
      await loginUser(data).unwrap();

      navigate("/");
  
    } catch (err) {
      const maybeError = isErrorWithMessage(err);

      if (maybeError) {
        setError(err.data.message);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  return (
    <Layout>
      <Row align="middle" justify="center">
        <Card title="Login" style={{ width: "30rem" }}>
          <Form onFinish={login}>
            <CustomInput type="email" name="email" placeholder="Email" />
            <PasswordInput name="password" placeholder="Password" />
            <CustomButton
              type="primary"
              htmlType="submit"
              loading={loginUserResult.isLoading}
            >
              Login
            </CustomButton>
          </Form>
          <Space direction="vertical" size="large">
            <Typography.Text>
              Don't have an account?<Link to={Paths.register}> Register</Link>
            </Typography.Text>
            <ErrorMessage message={error} />
          </Space>
        </Card>
      </Row>
    </Layout>
  );
};
