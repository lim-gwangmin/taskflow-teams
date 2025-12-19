// 공통 코멘트
export const COMMON_COMMENTS = {
  AUTH: {
    CURRENT_USER: "사용자 인증이 필요합니다.",
  },
  SERVER: {
    SERVER_ERROR: "서버 오류가 발생했습니다.",
  },
} as const;

// 인증관련 코멘트
export const AUTH_COMMENTS = {
  // 로그인
  LOGIN: {
    SUCCESS_200: "로그인 성공",
    ERROR_401: "비밀번호가 일치하지 않습니다.",
    ERROR_404: "사용자를 찾을 수 없습니다.",
    ERROR_500: "로그인 처리 중 오류가 발생했습니다.",
  },
  // 회원가입
  SIGNUP: {
    SUCCESS_200: "회원가입이 완료되었습니다.",
    ERROR_400: "이메일과 비밀번호는 필수입니다.",
    ERROR_409: "이미 사용 중인 이메일입니다.",
    ERROR_500: "회원가입 처리 중 오류가 발생했습니다.",
    VALIDATE_HAS_NAME: "이름을 입력하세요.",
    VALIDATE_LENGTH: "비밀번호는 6자리 이상이어야 합니다.",
    VALIDATE_HAS_NUMBER: "비밀번호에 숫자가 포함되어야 합니다.",
    VALIDATE_HAS_UPPERCASE: "대문자가 포함되어야 합니다.",
    VALIDATE_HAS_LOWERCASE: "소문자가 포함되어야 합니다.",
    VALIDATE_HAS_SPECIALCHAR: "비밀번호에 특수문자가 포함되어야 합니다.",
    VALIDATE_CONFIRM_PASSWORD: "비밀번호가 일치하지 않습니다.",
    VALIDATE_EMAIL: "유효한 이메일 주소를 입력해주세요.",
    VALIDATE_VERIFICATION: "이메일 인증이 되지 않았습니다.",
  },
  // 로그아웃
  LOGOUT: {
    SUCCESS_200: "로그아웃 되었습니다.",
    ERROR_500: "로그아웃 처리 중 오류가 발생했습니다.",
  },
  // 회원가입 메일 인증코드 발송
  SEND_VERIFICATION: {
    SUCCESS_200: "인증 코드가 이메일로 전송되었습니다.",
    ERROR_409_EMAIL_ALREADY_EXISTS: "이미 가입된 이메일입니다.",
    ERROR_409_CODE_ALREADY_SENT: "이미 인증코드가 전송되었습니다. 메일을 확인해주세요.",
    ERROR_500: "이메일 전송 중 오류가 발생했습니다.",
  },
  // 회원가입 메일 인증코드 인증
  VERIFY_CODE: {
    SUCCESS_200: "이메일 인증이 완료되었습니다.",
    ERROR_400_INVALID_CODE: "인증번호가 올바르지 않습니다.",
    ERROR_400_CODE_EXPIRED: "인증번호가 만료되었습니다.",
    ERROR_500: "이메일 인증처리 중 오류가 발생했습니다.",
    VALIDATE_EMAIL_CODE: "인증번호를 입력해주세요.",
    VALIDATE_EMAIL_CODE_ALERT: "인증번호 6자리를 입력해주세요.",
  },
} as const;

// 그룹관련 코멘트
export const GROUP_COMMENTS = {
  SEARCH: {
    SUCCESS_200: "그룹조회에 성공하였습니다.",
    ERROR_401: "일치하는 그룹이 없습니다.",
    ERROR_402: "권한이 없습니다.",
    // ERROR_409_DUPLICATE_NAME: "이미 생성된 그룹명 입니다.",
    // ERROR_409_ALREADY_MEMBER: "이미 속한 그룹입니다.",
    ERROR_500: "그룹조회 중 오류가 발생했습니다.",
  },
  CREATE: {
    SUCCESS_200: "그룹이 생성되었습니다.",
    ERROR_409_DUPLICATE_NAME: "이미 생성된 그룹명 입니다.",
    ERROR_409_ALREADY_MEMBER: "이미 속한 그룹입니다.",
    ERROR_500: "그룹 생성 중 오류가 발생했습니다.",
  },
  UPDATE: {},
  DELETE: {
    SUCCESS_200: "그룹이 생성되었습니다.",
    ERROR_403: "권한이 없습니다.",
    ERROR_500: "그룹 삭제 중 오류가 발생했습니다.",
  },
} as const;
