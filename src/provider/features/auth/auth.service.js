import api from '@/common/utils/api';
import { removeUser } from '@/common/utils/users.util';

// Login user
const login = async (userData) => {
  const response = await api().post('/auth/login', userData);
  if (response.data.Succeeded) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('isOtpVerify', false);
  }
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await api().get('/user/logout');
  if (response.data.Succeeded) {
    removeUser();
  }
  return response.data;
};

const signUp = async (userData) => {
  const response = await api().post('/user/register', userData);
  return response.data;
};

const loginAndSignUpWithOAuth = async ({ loginType, email, accessToken }) => {
  const response = await api().post('/auth/login-and-sign-up-with-oauth', {
    loginType,
    email,
    accessToken
  });
  if (response.data.Succeeded) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('isOtpVerify', false);
  }
  return response.data;
};

const loginAndSignUpWithLinkedin = async (payload) => {
  const response = await api().post('/auth/login-and-sign-up-with-linkedin', payload);
  if (response.data.Succeeded) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('isOtpVerify', false);
  }
  return response.data;
};

const authService = {
  logout,
  login,
  signUp,
  loginAndSignUpWithOAuth,
  loginAndSignUpWithLinkedin
};

export default authService;
