import { useAuthStore } from '../../stores/authStore';
import { InputField } from '../../components/common/InputField/InputField';
import { useState, useEffect, CSSProperties, useRef } from 'react';
import styles from './LoginPage.module.scss';
import { Checkbox } from '../../components/common/Checkbox/Checkbox';
import { useLogin } from '../../hooks/useLogin';
import { ArrowIcon } from '../../components/common/Icons/ArrowIcon';
import SocialLoginList from '../../components/common/List/SocialLoginList';
import Header from '../../layouts/Header';

const style: CSSProperties = {
  maskType: 'luminance',
};

// TODO: SVG 요소에 애니메이션 적용
const LogoIcon = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.classList.add('active');
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      width="200"
      height="204"
      viewBox="0 0 200 204"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_108_795)">
        <path
          d="M55.8333 21.249C36.7335 21.249 21.25 36.7168 21.25 55.7972V125.726C21.25 144.807 36.7335 160.274 55.8333 160.274H61.2232L66.0413 160.482C74.9588 160.865 83.3134 164.941 89.0977 171.733L94.5816 178.171C97.8307 181.986 103.766 181.861 106.851 177.913L110.892 172.743C116.674 165.343 125.413 160.849 134.802 160.445L138.777 160.274H144.167C163.267 160.274 178.75 144.807 178.75 125.726V55.7972C178.75 36.7168 163.267 21.249 144.167 21.249H55.8333Z"
          stroke="url(#paint0_radial_108_795)"
          strokeWidth="3"
          className="svg-elem-1"
        ></path>
        <mask
          id="mask0_108_795"
          style={style}
          maskUnits="userSpaceOnUse"
          x="22"
          y="22"
          width="156"
          height="158"
        >
          <path
            d="M177.5 22.4971H22.5V179.837H177.5V22.4971Z"
            fill="white"
            className="svg-elem-2"
          ></path>
        </mask>
        <g mask="url(#mask0_108_795)">
          <g filter="url(#filter0_i_108_795)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.5 55.7966C22.5 37.4058 37.4238 22.4971 55.8333 22.4971H144.167C162.576 22.4971 177.5 37.4058 177.5 55.7966V125.725C177.5 142.128 165.628 155.761 150 158.517V101.583C150 101.124 149.627 100.751 149.167 100.751H137.5H109.167C108.707 100.751 108.333 101.124 108.333 101.583V173.986L106.667 176.119V101.101C106.667 100.681 106.507 100.276 106.222 99.9685L79.5466 71.2548C78.8903 70.5483 77.7723 70.5445 77.1112 71.2464L50.4528 99.549C50.162 99.8579 50 100.266 50 100.69V158.517C34.3718 155.761 22.5 142.128 22.5 125.725V55.7966ZM105 101.101V178.061C102.271 180.455 97.9903 180.245 95.5337 177.361L90.0497 170.923C87.8553 168.346 85.3049 166.146 82.5 164.371V156.944C82.5 156.484 82.8731 156.111 83.3333 156.111C83.7936 156.111 84.1667 155.738 84.1667 155.279V154.863C84.1667 154.403 83.7936 154.03 83.3333 154.03H73.3333C72.8731 154.03 72.5 154.403 72.5 154.863V155.279C72.5 155.738 72.8731 156.111 73.3333 156.111C73.7936 156.111 74.1667 156.484 74.1667 156.944V160.584C71.5648 159.811 68.8559 159.352 66.095 159.233L61.25 159.025H55.8333C54.4222 159.025 53.0317 158.938 51.6667 158.768V100.69L78.3249 72.3874L105 101.101ZM82.7644 69.9488C82.0337 69.9488 81.6568 70.8214 82.1581 71.3524L108.087 98.8245C108.244 98.9913 108.463 99.0859 108.693 99.0859H148.069C148.8 99.0859 149.177 98.2134 148.675 97.6823L122.747 70.2102C122.589 70.0434 122.37 69.9488 122.14 69.9488H82.7644ZM72.5 110.741C70.1988 110.741 68.3333 112.605 68.3333 114.903V118.669C68.3333 118.888 68.511 119.066 68.7302 119.066H76.2698C76.489 119.066 76.6667 118.888 76.6667 118.669V114.903C76.6667 112.605 74.8012 110.741 72.5 110.741ZM68.3333 126.558C68.3333 124.259 70.1988 122.396 72.5 122.396C74.8012 122.396 76.6667 124.259 76.6667 126.558V130.324C76.6667 130.543 76.489 130.72 76.2698 130.72H68.7302C68.511 130.72 68.3333 130.543 68.3333 130.324V126.558ZM84.1667 110.741C81.8655 110.741 80 112.605 80 114.903V118.669C80 118.888 80.1777 119.066 80.3968 119.066H87.9365C88.1557 119.066 88.3333 118.888 88.3333 118.669V114.903C88.3333 112.605 86.4678 110.741 84.1667 110.741ZM80 126.558C80 124.259 81.8655 122.396 84.1667 122.396C86.4678 122.396 88.3333 124.259 88.3333 126.558V130.324C88.3333 130.543 88.1557 130.72 87.9365 130.72H80.3968C80.1777 130.72 80 130.543 80 130.324V126.558Z"
              fill="#97BBFF"
              className="svg-elem-3"
            ></path>
          </g>
          <g filter="url(#filter1_ii_108_795)">
            <path
              d="M65.7859 47.8914C65.6731 45.3967 65.6167 42.6526 65.6167 39.6589C65.6167 38.661 65.6328 37.2287 65.665 35.3616C67.9367 35.2329 70.0714 35.1685 72.0692 35.1685C74.0509 35.1685 76.1775 35.2329 78.4492 35.3616V39.5382H70.6192C70.6031 39.9406 70.595 40.5924 70.595 41.4937C70.595 42.4111 70.6031 43.0711 70.6192 43.4734L79.005 43.2803V47.6017C75.9439 47.8271 72.6814 47.9397 69.2175 47.9397C67.6548 47.9397 66.5109 47.9236 65.7859 47.8914ZM67.9367 57.2586C67.8561 55.81 67.8159 54.5063 67.8159 53.3475C67.8159 52.1887 67.8561 50.885 67.9367 49.4365H73.0359V52.8164H86.0859C86.1342 53.5407 86.1584 54.281 86.1584 55.0375C86.1584 55.7778 86.1342 56.5182 86.0859 57.2586C82.7348 57.3391 79.7139 57.3793 77.0234 57.3793C74.3167 57.3793 71.2878 57.3391 67.9367 57.2586ZM79.6817 35.7479C79.7139 35.3777 80.0603 35.1283 80.7209 34.9995C81.3975 34.8547 82.3078 34.7822 83.4517 34.7822C84.0317 34.7822 84.8373 34.7983 85.8684 34.8305C85.9006 35.6836 85.9328 37.2447 85.965 39.5141H88.1159L88.0917 43.8838H85.965C85.965 47.0866 85.9328 49.4606 85.8684 51.0057L80.7692 51.4886V35.9169H80.6725C80.5759 35.9169 80.4631 35.933 80.3342 35.9652C80.2053 35.9813 80.1167 36.0135 80.0684 36.0618L79.6817 35.7479ZM89.0825 52.575C89.6625 51.9956 90.3069 51.1989 91.0159 50.1849C91.7409 49.1709 92.3773 48.0845 92.925 46.9257C93.4728 45.7508 93.7789 44.6724 93.8434 43.6907C93.8917 42.7733 93.9319 41.6467 93.9642 40.3108H90.0492C89.9525 39.5543 89.9042 38.814 89.9042 38.0897C89.9042 37.3332 89.9525 36.5929 90.0492 35.8686C91.8859 35.7238 94.1011 35.6513 96.695 35.6513C99.2728 35.6513 101.48 35.7238 103.317 35.8686V40.3108H99.2567C99.2406 41.7754 99.1923 43.1032 99.1117 44.2942C100.094 45.437 101.109 46.8694 102.157 48.5915C103.204 50.3137 103.937 51.73 104.356 52.8405L100.417 55.1099C99.6917 53.5165 98.5881 51.6254 97.1059 49.4365C96.2519 50.9333 95.4706 52.1887 94.7617 53.2027C94.3428 53.7981 93.8836 54.2408 93.3842 54.5305C92.9009 54.8363 92.2644 55.1501 91.475 55.472L89.0825 52.575ZM104.211 35.8686C104.243 35.4984 104.606 35.249 105.298 35.1202C105.991 34.9754 106.918 34.9029 108.078 34.9029C108.673 34.9029 109.488 34.919 110.518 34.9512C110.615 38.5725 110.663 42.2019 110.663 45.8393C110.663 49.4606 110.615 53.098 110.518 56.7516L105.298 57.2344V36.0376H105.202C105.105 36.0376 104.993 36.0537 104.863 36.0859C104.734 36.102 104.646 36.1342 104.598 36.1825L104.211 35.8686ZM113.829 46.5394H121.998V45.7186H115.328C115.134 43.6907 115.038 41.7029 115.038 39.7555C115.038 38.5001 115.094 36.9469 115.207 35.0961C118.526 34.9673 121.643 34.9029 124.559 34.9029C127.475 34.9029 130.593 34.9673 133.912 35.0961C133.96 35.595 133.984 36.1261 133.984 36.6895C133.984 37.2366 133.96 37.7759 133.912 38.307H120.306L120.258 39.0071H133.67C133.718 39.4094 133.743 39.8601 133.743 40.3591C133.743 40.8258 133.718 41.2765 133.67 41.711H120.258L120.306 42.4353H134.153C134.202 42.9664 134.226 43.5136 134.226 44.0769C134.226 44.6403 134.202 45.1875 134.153 45.7186H127.193V46.5394H135.338V49.9918C130.568 50.024 126.984 50.0401 124.583 50.0401C122.215 50.0401 118.63 50.024 113.829 49.9918V46.5394ZM114.772 54.3856C114.723 53.8062 114.699 53.2187 114.699 52.6233C114.699 52.0116 114.723 51.4322 114.772 50.885H134.443C134.524 51.8346 134.564 52.9371 134.564 54.1925C134.564 55.4318 134.524 56.5343 134.443 57.5H129.344V54.3856H114.772Z"
              fill="white"
              className="svg-elem-4"
            ></path>
          </g>
          <g filter="url(#filter2_i_108_795)">
            <path
              d="M140.833 35.8171C142.674 35.8171 144.167 34.3263 144.167 32.4872C144.167 30.6481 142.674 29.1572 140.833 29.1572C138.992 29.1572 137.5 30.6481 137.5 32.4872C137.5 34.3263 138.992 35.8171 140.833 35.8171Z"
              fill="#97BBFF"
              className="svg-elem-5"
            ></path>
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_i_108_795"
          x="22.5"
          y="22.4971"
          width="155"
          height="157.208"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          ></feComposite>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
          ></feColorMatrix>
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_108_795"
          ></feBlend>
        </filter>
        <filter
          id="filter1_ii_108_795"
          x="64.6167"
          y="33.7822"
          width="71.7207"
          height="24.7178"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset dx="1" dy="1"></feOffset>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          ></feComposite>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.279708 0 0 0 0 0.44469 0 0 0 0 0.898389 0 0 0 0.2 0"
          ></feColorMatrix>
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_108_795"
          ></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset dx="-1" dy="-1"></feOffset>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          ></feComposite>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.279708 0 0 0 0 0.44469 0 0 0 0 0.898389 0 0 0 0.2 0"
          ></feColorMatrix>
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_108_795"
            result="effect2_innerShadow_108_795"
          ></feBlend>
        </filter>
        <filter
          id="filter2_i_108_795"
          x="137.5"
          y="29.1572"
          width="6.6665"
          height="6.66016"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          ></feComposite>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"
          ></feColorMatrix>
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_108_795"
          ></feBlend>
        </filter>
        <radialGradient
          id="paint0_radial_108_795"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(102.5 74.9445) rotate(91.3182) scale(108.668 159.111)"
        >
          <stop offset="0.948411" stopColor="#A5C4FF"></stop>
          <stop offset="1" stopColor="#97BBFF"></stop>
        </radialGradient>
        <clipPath id="clip0_108_795">
          <rect
            width="160"
            height="164"
            fill="white"
            transform="translate(20 20)"
            className="svg-elem-6"
          ></rect>
        </clipPath>
      </defs>
    </svg>
  );
};

const LoginForm = ({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}) => {
  const { email, password, setEmail, setPassword } = useAuthStore();
  const [saveId, setSaveId] = useState(false);
  const [errorMessage, setError] = useState<string | null>(error);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveId(true);
    }
  }, [setEmail]);

  useEffect(() => {
    if (saveId) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }
  }, [saveId, email]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <form className={styles['login-form']} onSubmit={onSubmit}>
      <InputField
        label="이메일"
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => {
          const newEmail = e.target.value.trim();
          setEmail(newEmail);
          if (newEmail && !isValidEmail(newEmail)) {
            setError('이메일 형식이 올바르지 않습니다. 예: example@domain.com');
          } else {
            setError(null);
          }
        }}
        placeholder="이메일을 입력하세요"
        required
        autoComplete="email"
        aria-invalid={errorMessage ? "true" : "false"}
        aria-describedby={errorMessage ? "email-error" : undefined}
        error={errorMessage || undefined}
      />
      <InputField
        label="비밀번호"
        id="password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        required
        autoComplete="current-password"
        aria-invalid={error === '비밀번호가 올바르지 않습니다.' ? "true" : "false"}
        aria-describedby={error === '비밀번호가 올바르지 않습니다.' ? "password-error" : undefined}
        showPasswordToggle
        error={error === '비밀번호가 올바르지 않습니다.' ? error : undefined}
      />
      <LoginOptions saveId={saveId} onSaveIdChange={setSaveId} />
      <LoginButton isLoading={isLoading} />
      <SignupPrompt />
    </form>
  );
};

const LoginOptions = ({
  saveId,
  onSaveIdChange,
}: {
  saveId: boolean;
  onSaveIdChange: (checked: boolean) => void;
}) => (
  <div className={styles['login-options']}>
    <Checkbox
      label="이메일 저장"
      checked={saveId}
      onChange={(e) => onSaveIdChange(e.target.checked)}
      className={styles['login-options__save-id-label']}
      size="small"
    />
    <div className={styles['login-options__find-links']}>
      <a href="/find-account">
        이메일/비밀번호 찾기 <ArrowIcon />
      </a>
    </div>
  </div>
);

const LoginButton = ({ isLoading }: { isLoading: boolean }) => (
  <button
    type="submit"
    className={styles['login-form__submit-button']}
    disabled={isLoading}
  >
    {isLoading ? '로그인 중...' : '로그인'}
  </button>
);

const SignupPrompt = () => (
  <p className={styles['signup-link']}>
    아직 회원이 아니신가요? <a href="/register">회원가입</a>
  </p>
);

const Divider = () => (
  <div className={styles['divider']}>
    <div className={styles['divider__line']}></div>
    <span className={styles['divider__text']}>Or</span>
    <div className={styles['divider__line']}></div>
  </div>
);

export const LoginPage = () => {
  const { error } = useAuthStore();
  const { handleLogin, isLoading } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
      <Header title="로그인" type="sub" hasBackButton={true} />
      <main className={styles['login-container']}>
        <div className={styles['login-form-wrapper']}>
          <div className={styles['logo-wrapper']}>{LogoIcon()}</div>
          <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
        <Divider />
          <SocialLoginList />
        </div>
      </main>
    </>
  );
};
