import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 主题类型定义
export type ThemeMode = 'light' | 'dark';

// 主题上下文接口
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 从本地存储获取主题，默认为正常模式
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('low-code-theme') as ThemeMode;
    return savedTheme || 'light';
  });

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // 设置主题
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('low-code-theme', newTheme);
  };

  // 应用主题到DOM
  useEffect(() => {
    const root = document.documentElement;

    // 移除之前的主题类
    root.classList.remove('theme-light', 'theme-dark');

    // 添加新的主题类
    root.classList.add(`theme-${theme}`);

    // 设置data-theme属性
    root.setAttribute('data-theme', theme);

    // 更新CSS变量
    updateCSSVariables(theme);
  }, [theme]);

  // 更新CSS变量的函数
  const updateCSSVariables = (currentTheme: ThemeMode) => {
    const root = document.documentElement;

    if (currentTheme === 'dark') {
      // 暗黑模式变量
      root.style.setProperty('--primary-color', '#177ddc');
      root.style.setProperty('--success-color', '#49aa19');
      root.style.setProperty('--warning-color', '#d89614');
      root.style.setProperty('--error-color', '#dc4446');
      root.style.setProperty('--info-color', '#177ddc');

      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--text-color-secondary', '#a6a6a6');
      root.style.setProperty('--text-color-disabled', '#595959');
      root.style.setProperty('--border-color', '#434343');
      root.style.setProperty('--border-color-light', '#303030');
      root.style.setProperty('--background-color', '#141414');
      root.style.setProperty('--background-color-light', '#1f1f1f');

      root.style.setProperty('--component-bg', '#1f1f1f');
      root.style.setProperty('--sidebar-bg', '#1f1f1f');
      root.style.setProperty('--toolbar-bg', '#1f1f1f');
      root.style.setProperty('--canvas-bg', '#141414');
      root.style.setProperty('--modal-bg', '#1f1f1f');

      root.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--shadow-md', '0 2px 8px rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--shadow-lg', '0 4px 16px rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--shadow-xl', '0 8px 32px rgba(0, 0, 0, 0.6)');
    } else {
      // 正常模式变量
      root.style.setProperty('--primary-color', '#1890ff');
      root.style.setProperty('--success-color', '#52c41a');
      root.style.setProperty('--warning-color', '#faad14');
      root.style.setProperty('--error-color', '#f5222d');
      root.style.setProperty('--info-color', '#1890ff');

      root.style.setProperty('--text-color', '#262626');
      root.style.setProperty('--text-color-secondary', '#595959');
      root.style.setProperty('--text-color-disabled', '#bfbfbf');
      root.style.setProperty('--border-color', '#d9d9d9');
      root.style.setProperty('--border-color-light', '#f0f0f0');
      root.style.setProperty('--background-color', '#fafafa');
      root.style.setProperty('--background-color-light', '#ffffff');

      root.style.setProperty('--component-bg', '#ffffff');
      root.style.setProperty('--sidebar-bg', '#ffffff');
      root.style.setProperty('--toolbar-bg', '#ffffff');
      root.style.setProperty('--canvas-bg', '#fafafa');
      root.style.setProperty('--modal-bg', '#ffffff');

      root.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.05)');
      root.style.setProperty('--shadow-md', '0 2px 8px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-lg', '0 4px 16px rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--shadow-xl', '0 8px 32px rgba(0, 0, 0, 0.2)');
    }
  };

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 如果用户没有手动设置过主题，则跟随系统主题
      const savedTheme = localStorage.getItem('low-code-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
