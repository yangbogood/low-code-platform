import React from 'react';
import { Button, Dropdown, Space, type MenuProps } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const LanguageSwitch: React.FC<{
  type?: 'button' | 'icon';
  size?: 'small' | 'middle' | 'large';
}> = ({ type = 'button', size = 'middle' }) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguageLabel = () => {
    switch (i18n.language) {
      case 'zh-CN':
        return t('language.chinese');
      case 'en-US':
        return t('language.english');
      default:
        return t('language.chinese');
    }
  };

  const getCurrentLanguageIcon = () => {
    switch (i18n.language) {
      case 'zh-CN':
        return '🇨🇳';
      case 'en-US':
        return '🇺🇸';
      default:
        return '🇨🇳';
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'zh-CN',
      label: (
        <Space>
          <span>🇨🇳</span>
          <span>{t('language.chinese')}</span>
        </Space>
      ),
      onClick: () => handleLanguageChange('zh-CN'),
    },
    {
      key: 'en-US',
      label: (
        <Space>
          <span>🇺🇸</span>
          <span>{t('language.english')}</span>
        </Space>
      ),
      onClick: () => handleLanguageChange('en-US'),
    },
  ];

  if (type === 'icon') {
    return (
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button
          type="text"
          size={size}
          icon={<GlobalOutlined style={{
            fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
          }} />}
          title={t('language.switchLanguage')}
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
      </Dropdown>
    );
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button size={size}>
        <Space>
          <span>{getCurrentLanguageIcon()}</span>
          <span>{getCurrentLanguageLabel()}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

// 语言指示器组件
export const LanguageIndicator: React.FC = () => {
  const { i18n, t } = useTranslation();

  const getCurrentLanguageLabel = () => {
    switch (i18n.language) {
      case 'zh-CN':
        return t('language.chinese');
      case 'en-US':
        return t('language.english');
      default:
        return t('language.chinese');
    }
  };

  const getCurrentLanguageIcon = () => {
    switch (i18n.language) {
      case 'zh-CN':
        return '🇨🇳';
      case 'en-US':
        return '🇺🇸';
      default:
        return '🇨🇳';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '16px' }}>
        {getCurrentLanguageIcon()}
      </span>
      <span>
        {getCurrentLanguageLabel()}
      </span>
    </div>
  );
};
