export const formatTime = (time: number): string => {
  const date = new Date(time);
  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');
  const hh = `${date.getHours()}`.padStart(2, '0');
  const mi = `${date.getHours()}`.padStart(2, '0');
  const ss = `${date.getSeconds()}`.padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
};
