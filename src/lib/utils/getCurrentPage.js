export const getCurrentPage = (page) => {
  return (page === undefined || page === null) ? 1 : page;
}