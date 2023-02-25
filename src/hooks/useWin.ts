export default function useWin() {
  const closeApp = () => {
    window.win.close();
  };
  const minimizeApp = () => {
    window.win.minimize();
  };
  const maximizeApp = () => {
    window.win.maximize();
  };

  return {
    closeApp,
    minimizeApp,
    maximizeApp,
  };
}
