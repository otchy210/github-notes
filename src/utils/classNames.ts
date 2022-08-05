export const classNames = (classNames: { [className: string]: boolean }) => {
  return Object.entries(classNames)
    .filter((entry) => {
      return entry[1];
    })
    .map(([className]) => className)
    .join(' ');
};
