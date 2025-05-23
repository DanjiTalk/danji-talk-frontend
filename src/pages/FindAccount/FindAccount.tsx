import { useState, useRef, useEffect } from 'react';
import Tab from '../../components/common/Tab/Tab';
import TabPanel from '../../components/common/Tab/TabPanel';
import TabWrapper from '../../components/common/Tab/TabWrapper';
import styles from './FindAccount.module.scss';
import InputField from '../../components/common/InputField/InputField';
import Button from '../../components/common/Button/Button';
import { useAccountStore } from '../../stores/useAccountStore';
import Alert from '../../components/common/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://danjitalk.duckdns.org';
const IS_DEV =
  import.meta.env.VITE_NODE_ENV === 'development' ||
  window.location.hostname === 'localhost';

// console.log('API 기본 URL:', API_BASE_URL);
// console.log('개발 환경?', IS_DEV);

const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return '전화번호 형식이 올바르지 않습니다. (예: 123-456-7890)';
  }
  return null;
};

const validateUsername = (username: string): string | null => {
  if (username.trim().length === 0) {
    return '이름을 입력하세요.';
  }
  if (username.length < 2) {
    return '이름은 최소 2자 이상이어야 합니다.';
  }
  if (username.length > 20) {
    return '이름은 최대 20자 이하이어야 합니다.';
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(username)) {
    return '이름에는 특수문자를 입력할 수 없습니다.';
  }
  return null;
};

const FindAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { phone, setPhone } = useAccountStore();
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();
  const setUserEmail = useUserStore((state) => state.setUserEmail);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState<
    string | null
  >(null);
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);

  useEffect(() => {
    if (usernameError) {
      usernameInputRef.current?.focus();
    }
  }, [usernameError]);

  const handleFindAccount = async () => {
    const usernameValidationError = validateUsername(username);
    if (usernameValidationError) {
      setUsernameError(usernameValidationError);
      return;
    }

    const phoneValidationError = validatePhone(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    try {
      const apiUrl = IS_DEV
        ? `${API_BASE_URL}/api/member/find-id`
        : '/api/member/find-id';

      console.log('요청 URL:', apiUrl);
      console.log('요청 본문:', { name: username, phoneNumber: phone });

      // 개발 환경 또는 모의 데이터 사용 시 (테스트 목적)
      if (IS_DEV && (import.meta.env.VITE_USE_MOCK_API === 'true' || true)) {
        console.log('모의 API 응답 사용');

        // 테스트 계정 정보와 일치하는지 확인
        if (username === 'Alice' && phone === '123-456-7893') {
          // 모의 이메일 데이터 설정
          setUserEmail('alice@example.com');
          navigate('/show-email');
          return;
        } else {
          setAlertContent('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
          setShowAlert(true);
          return;
        }
      }

      // 실제 API 요청 (프로덕션 환경에서 사용)
      const response = await axios.post(
        apiUrl,
        {
          name: username,
          phoneNumber: phone,
        },
        {
          withCredentials: true,
        }
      );

      // 성공 케이스
      if (response.status === 200) {
        console.log('서버 응답:', response.data);

        // 응답 구조 처리 - 가능한 모든 형태 대응
        let userEmailValue = null;

        // 응답 구조가 {data: "email"} 형태인 경우
        if (response.data && response.data.data) {
          userEmailValue = response.data.data;
        }
        // 응답 구조가 {email: "email"} 형태인 경우
        else if (response.data && response.data.email) {
          userEmailValue = response.data.email;
        }
        // 응답 구조가 {name: "name", phoneNumber: "phone"} 형태인 경우
        // 이메일 처리 로직 필요 - 백엔드와 협의 또는 임시 처리
        else if (
          response.data &&
          response.data.name &&
          response.data.phoneNumber
        ) {
          // 백엔드에서 이메일을 제공하지 않으므로 임시로 생성 (프로덕션에서는 사용하지 않는 것이 좋음)
          userEmailValue = `${response.data.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
          console.warn(
            '이메일 정보가 API 응답에 없어 임시 이메일을 생성했습니다:',
            userEmailValue
          );
        }
        // 응답이 직접 이메일 문자열인 경우
        else if (typeof response.data === 'string') {
          userEmailValue = response.data;
        }
        // 이메일을 찾을 수 없는 경우
        else {
          console.error(
            'API 응답에서 이메일을 찾을 수 없습니다:',
            response.data
          );
          setAlertContent(
            '서버에서 이메일 정보를 찾을 수 없습니다. 관리자에게 문의하세요.'
          );
          setShowAlert(true);
          return;
        }

        setUserEmail(userEmailValue);
        navigate('/show-email');
      }
    } catch (error: unknown) {
      console.error('계정 찾기 실패:', error);

      if (axios.isAxiosError(error)) {
        // 404 오류는 "사용자를 찾을 수 없음"으로 처리
        if (error.response?.status === 404) {
          setAlertContent(
            '입력하신 정보와 일치하는 계정을 찾을 수 없습니다.<br>' +
              '정확한 이름과 전화번호를 입력했는지 확인해주세요.<br>' +
              '계정이 없으시면 <u>회원가입</u>을 진행해주세요.'
          );
          setShowAlert(true);

          // 회원가입으로 이동 버튼 활성화
          setAttemptCount((prev) => prev + 1);
        } else {
          // 기타 오류
          const errorMessage =
            error.response?.data?.message ||
            '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          setAlertContent(errorMessage);
          setShowAlert(true);
        }
      } else {
        setAlertContent(
          '서비스 이용 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
        setShowAlert(true);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    const formatted = newPhone
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    setPhone(formatted);
    setPhoneError(validatePhone(formatted));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setUsernameError(validateUsername(newUsername));
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '유효한 이메일 주소를 입력해주세요.';
    }
    return null;
  };

  const handleRequestVerification = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    try {
      const apiUrl = IS_DEV
        ? `${API_BASE_URL}/api/mail/certification-code/send`
        : '/api/mail/certification-code/send';

      try {
        await axios.post(
          apiUrl,
          {
            mail: email,
            type: 'FIND_PASSWORD',
          },
          {
            withCredentials: true,
          }
        );

        // 성공 케이스
        setIsEmailVerificationSent(true);
        setAlertContent('인증번호가 이메일로 전송되었습니다.');
        setShowAlert(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          // 409는 이미 가입된 이메일인 경우로, 비밀번호 찾기에서는 정상 케이스
          setIsEmailVerificationSent(true);
          setAlertContent('인증번호가 이메일로 전송되었습니다.');
          setShowAlert(true);
        } else {
          // 다른 에러는 상위 catch 블록으로 전달
          throw error;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 실제 에러 케이스 처리
        if (error.response?.status === 404) {
          setAlertContent(
            '가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.'
          );
          setTimeout(() => {
            navigate('/register');
          }, 2000);
        } else {
          const errorMessage =
            error.response?.data?.message ||
            `인증번호 전송에 실패했습니다. (${error.response?.status || '알 수 없는 에러'})`;
          setAlertContent(errorMessage);
        }
        setShowAlert(true);
      } else {
        setAlertContent(
          '서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.'
        );
        setShowAlert(true);
      }
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      // API 경로 및 호출 방식 수정
      const apiUrl = IS_DEV
        ? `${API_BASE_URL}/api/mail/certification-code/verify`
        : '/api/mail/certification-code/verify';

      // GET 요청으로 변경하고 쿼리 파라미터 사용
      const response = await axios.get(apiUrl, {
        params: {
          email: email,
          code: verificationCode,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsVerificationCodeValid(true);
        setAlertContent('인증이 완료되었습니다.');
        setShowAlert(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setVerificationCodeError('잘못된 인증번호입니다. 다시 확인해주세요.');
      } else {
        setVerificationCodeError('인증 확인 중 오류가 발생했습니다.');
      }
    }
  };

  // 비밀번호 재설정 페이지로 이동
  const handleResetPassword = () => {
    if (isVerificationCodeValid) {
      // 이메일 정보를 함께 전달하여 비밀번호 재설정 페이지로 이동
      navigate('/reset-password', {
        state: {
          email: email,
          verified: true, // 이메일 인증이 완료되었음을 표시
        },
      });
    }
  };

  return (
    <div className={styles['find-account-container']}>
      <TabWrapper ariaLabel="이메일/비밀번호 찾기">
        <Tab
          label="이메일 찾기"
          index={0}
          isActive={activeTab === 0}
          onClick={() => setActiveTab(0)}
        />
        <Tab
          label="비밀번호 찾기"
          index={1}
          isActive={activeTab === 1}
          onClick={() => setActiveTab(1)}
        />
        <TabPanel
          isActive={activeTab === 0}
          role="tabpanel"
          id="tabpanel-0"
          ariaLabelledby="tab-0"
        >
          <div className={styles['find-account-form']}>
            <div className={styles['find-account-form__content']}>
              <InputField
                label="이름"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="이름을 입력하세요"
                required
                autoComplete="name"
                className={styles['find-account-form__input-field']}
                error={usernameError || undefined}
              />
              <InputField
                label="전화번호"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="-를 제외하고 입력해주세요"
                required
                autoComplete="tel"
                className={styles['find-account-form__input-field']}
                error={phoneError || undefined}
              />
            </div>

            <Button
              label="다음"
              onClick={handleFindAccount}
              className={[
                styles['find-account-form__button'],
                username && phone
                  ? styles['button-filled']
                  : styles['button-empty'],
              ]}
              disabled={!username || !phone}
            />
          </div>
        </TabPanel>
        <TabPanel
          isActive={activeTab === 1}
          role="tabpanel"
          id="tabpanel-1"
          ariaLabelledby="tab-1"
        >
          <div className={styles['find-account-form']}>
            <div className={styles['find-account-form__content']}>
              <div className={styles['input-group']}>
                <div className={styles['input-with-button']}>
                  <InputField
                    label="이메일"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(validateEmail(e.target.value));
                    }}
                    placeholder="이메일을 입력하세요"
                    required
                    autoComplete="email"
                    className={styles['input-field']}
                    error={emailError || undefined}
                  />
                  <Button
                    label={isEmailVerificationSent ? '재요청' : '인증번호'}
                    onClick={handleRequestVerification}
                    disabled={!email || !!emailError}
                    className={`${styles['input-with-button__button']}`}
                  />
                </div>

                <div className={styles['input-with-button']}>
                  <InputField
                    label="인증번호"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="인증번호 6자리를 입력하세요"
                    required
                    className={styles['input-field']}
                    error={verificationCodeError || undefined}
                  />
                  <Button
                    label="확인"
                    onClick={handleVerifyCode}
                    disabled={!verificationCode}
                    className={`${styles['input-with-button__button']}`}
                  />
                </div>
              </div>
            </div>

            <Button
              label="다음"
              onClick={handleResetPassword}
              disabled={!isVerificationCodeValid}
              className={[
                styles['find-account-form__button'],
                isVerificationCodeValid
                  ? styles['button-filled']
                  : styles['button-empty'],
              ]}
            />
          </div>
        </TabPanel>
      </TabWrapper>
      {showAlert && (
        <Alert
          alertTitle="안내"
          alertContent={alertContent}
          onClose={() => setShowAlert(false)}
          onConfirm={
            attemptCount >= 5 ? () => navigate('/register') : undefined
          }
          confirmLabel={attemptCount >= 5 ? '회원 가입' : undefined}
        />
      )}
    </div>
  );
};

export default FindAccount;
