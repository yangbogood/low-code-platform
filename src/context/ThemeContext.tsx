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

  // 应用主题到DOM（只影响画布区域）
  useEffect(() => {
    // 不再全局应用主题，只保存主题状态
    // 画布区域的主题将通过CSS类名单独控制
  }, [theme]);

  // 注意：不再需要全局CSS变量更新，因为暗色模式只影响画布区域

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
