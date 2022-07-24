export enum ThemeType {
  DARK = "dark",
  LIGHT = "light",
}

let theme = localStorage.getItem("theme") as ThemeType;

export async function loadTheme(type:ThemeType=theme ?? ThemeType.LIGHT) {
  // 获取主题
  if (type === ThemeType.LIGHT) {
    import('./light/index.less');
    localStorage.setItem('theme',ThemeType.LIGHT)
    document.documentElement.classList.add(ThemeType.LIGHT)
  }
  if (type === ThemeType.DARK) {
    import('./dark/index.less');
    localStorage.setItem('theme',ThemeType.DARK)
    document.documentElement.classList.add(ThemeType.DARK)
  }
}
