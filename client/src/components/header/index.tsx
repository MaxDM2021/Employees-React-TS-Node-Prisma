import { Layout, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { CustomButton } from "../custom-button";
import { Paths } from "../../path";

import styles from "./index.module.css";
import { useSelector } from "react-redux";
import { logout, selectUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

export const Header = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogoutClick = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout.Header className={styles.header}>
      <Space>
        <TeamOutlined className={styles.teamIcon} />
        <Link to={Paths.home}>
          <CustomButton type="link">
            <Typography.Title level={1}>Employees</Typography.Title>
          </CustomButton>
        </Link>
      </Space>
      {user ? (
        <CustomButton
          type="ghost"
          icon={<LoginOutlined />}
          onClick={onLogoutClick}
        >
          Logout
        </CustomButton>
      ) : (
        <Space>
          <Link to={Paths.register}>
            <CustomButton type="link" icon={<UserOutlined />}>
              Register
            </CustomButton>
          </Link>
          <Link to={Paths.login}>
            <CustomButton type="link" icon={<LoginOutlined />}>
              Login
            </CustomButton>
          </Link>
        </Space>
      )}
    </Layout.Header>
  );
};
