export const getAccessTokenLocalStorage = () => {
  return localStorage.getItem("accessToken");
};

export const setAccessTokenLocalStorage = (token) => {
  localStorage.setItem("accessToken", token);
};
