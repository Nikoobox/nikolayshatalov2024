export const getNavItemColor = (
  scrollPosition: number,
  isPastTarget: boolean
): string => {
  if (isPastTarget) {
    return "white";
  }

  if (scrollPosition > window.innerHeight) {
    return "black";
  }

  return "white";
};
