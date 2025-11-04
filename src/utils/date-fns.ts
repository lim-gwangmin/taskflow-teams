// 년 월 일 날짜 포맷 변경 함수
export const formattedDate = (date: Date): string => {
  const dateFormat = new Date(date);

  const year = dateFormat.getFullYear();
  const month = String(dateFormat.getMonth() + 1).padStart(2, "0");
  const day = String(dateFormat.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};
