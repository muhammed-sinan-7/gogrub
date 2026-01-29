let logoutHandler = null;

export const registerLogout = (fn) => {
  logoutHandler = fn;
};

export const triggerLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  } else {
    localStorage.clear();
    window.location.href = "/";
  }
};
