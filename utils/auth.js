export const isUserLoggedIn = () => {
  const user = localStorage?.getItem("user");
  return !!user;
};
