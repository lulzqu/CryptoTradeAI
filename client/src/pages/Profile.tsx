import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Upload, message, Tabs, Switch, Select } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { RootState } from '../store';
import { updateProfile } from '../store/slices/profileSlice';
import Loading from '../components/Loading';
import { showSuccess, showError } from '../components/Toast';
import { showUpdateConfirm } from '../components/ConfirmDialog';
import { InfoTooltip } from '../components/Tooltip';
import './Profile.css';

const { TabPane } = Tabs;
const { Option } = Select;

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const [form] = Form.useForm();

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile, form]);

  const handleSubmit = async (values: any) => {
    showUpdateConfirm(async () => {
      try {
        await dispatch(updateProfile(values)).unwrap();
        showSuccess('Profile updated successfully');
      } catch (error) {
        showError('Failed to update profile');
      }
    });
  };

  const handlePreferencesChange = async (values: any) => {
    showUpdateConfirm(async () => {
      try {
        await dispatch(updateProfile({ preferences: values })).unwrap();
        showSuccess('Preferences updated successfully');
      } catch (error) {
        showError('Failed to update preferences');
      }
    });
  };

  const handleSocialLinksChange = async (values: any) => {
    showUpdateConfirm(async () => {
      try {
        await dispatch(updateProfile({ socialLinks: values })).unwrap();
        showSuccess('Social links updated successfully');
      } catch (error) {
        showError('Failed to update social links');
      }
    });
  };

  if (loading) {
    return <Loading rows={5} />;
  }

  return (
    <div className="profile-container">
      <h1>Profile Settings</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Personal Information" key="1">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={profile}
          >
            <Form.Item
              name="firstName"
              label={
                <>
                  First Name
                  <InfoTooltip title="Enter your first name" />
                </>
              }
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={
                <>
                  Last Name
                  <InfoTooltip title="Enter your last name" />
                </>
              }
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>

            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>

            <Form.Item name="country" label="Country">
              <Input />
            </Form.Item>

            <Form.Item name="bio" label="Bio">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Preferences" key="2">
          <Form
            layout="vertical"
            onFinish={handlePreferencesChange}
            initialValues={profile?.preferences}
          >
            <Form.Item name="theme" label="Theme">
              <Select>
                <Option value="light">Light</Option>
                <Option value="dark">Dark</Option>
              </Select>
            </Form.Item>

            <Form.Item name="language" label="Language">
              <Select>
                <Option value="en">English</Option>
                <Option value="vi">Vietnamese</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notifications" label="Notifications" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name="emailNotifications" label="Email Notifications" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Preferences
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Social Links" key="3">
          <Form
            layout="vertical"
            onFinish={handleSocialLinksChange}
            initialValues={profile?.socialLinks}
          >
            <Form.Item name="twitter" label="Twitter">
              <Input />
            </Form.Item>

            <Form.Item name="facebook" label="Facebook">
              <Input />
            </Form.Item>

            <Form.Item name="linkedin" label="LinkedIn">
              <Input />
            </Form.Item>

            <Form.Item name="github" label="GitHub">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Social Links
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Profile; 