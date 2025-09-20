import React from 'react';
import { Button, Tooltip, Space, Typography } from 'antd';
import { SunOutlined, MoonOutlined, BulbOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const { Text } = Typography;

interface ThemeSwitchProps {
  showLabel?: boolean;
  size?: 'small' | 'middle' | 'large';
  type?: 'button' | 'icon' | 'text';
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  showLabel = false,
  size = 'middle',
  type = 'button',
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <SunOutlined />;
      case 'dark':
        return <MoonOutlined />;
      default:
        return <BulbOutlined />;
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return t('theme.switchToDark');
      case 'dark':
        return t('theme.switchToLight');
      default:
        return t('theme.switchTheme');
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return t('theme.light');
      case 'dark':
        return t('theme.dark');
      default:
        return t('theme.switchTheme');
    }
  };

  if (type === 'icon') {
    return (
      <Tooltip title={getThemeText()}>
        <Button
          type="text"
          icon={getThemeIcon()}
          onClick={toggleTheme}
          size={size}
          style={{
            borderRadius: '50%',
            width: size === 'small' ? 32 : size === 'large' ? 48 : 40,
            height: size === 'small' ? 32 : size === 'large' ? 48 : 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        />
      </Tooltip>
    );
  }

  if (type === 'text') {
    return (
      <Space
        style={{ cursor: 'pointer' }}
        onClick={toggleTheme}
      >
        {getThemeIcon()}
        {showLabel && <Text>{getThemeLabel()}</Text>}
      </Space>
    );
  }

  return (
    <Tooltip title={getThemeText()}>
      <Button
        type="default"
        icon={getThemeIcon()}
        onClick={toggleTheme}
        size={size}
        style={{
          transition: 'all 0.3s ease',
        }}
      >
        {showLabel && getThemeLabel()}
      </Button>
    </Tooltip>
  );
};

// 主题状态指示器组件
export const ThemeIndicator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
      }}
    >
      <span style={{ fontSize: '14px' }}>
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
      <span>
        {theme === 'light' ? '正常模式' : '暗黑模式'}
      </span>
    </div>
  );
};

// 主题选择器组件
export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light', label: '正常模式', icon: '☀️' },
    { key: 'dark', label: '暗黑模式', icon: '🌙' },
  ] as const;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '8px',
        borderRadius: '8px',
      }}
    >
      {themes.map(({ key, label, icon }) => (
        <Button
          key={key}
          type={theme === key ? 'primary' : 'default'}
          size="small"
          onClick={() => setTheme(key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            minWidth: '80px',
            justifyContent: 'center',
          }}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
};
