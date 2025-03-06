import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useLogin = () => {
  const { email, password, setEmail, setError, setIsLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    },
    onSuccess: (users: User[]) => {
      const userExists = users.find((u: User) => u.email === email);
      if (!userExists) {
        setError('이메일이 올바르지 않습니다. 다시 확인해주세요.');
        return;
      }

      const user = users.find(
        (u: User) => u.email === email && u.password === password
      );

      if (user) {
        setIsLoggedIn(true);
        setEmail(email);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        setError(
          !error.response
            ? '네트워크 연결을 확인해주세요.'
            : '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
      }
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력하세요.');
      return;
    }
    setError(null);
    loginMutation.mutate();
  };

  return { handleLogin, isLoading: loginMutation.isPending };
};
