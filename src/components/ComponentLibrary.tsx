import React from 'react';
import { Typography, Space, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ComponentMeta, ComponentLibrary as ComponentLibraryType } from '../types';
import { ComponentItem } from './ComponentItem';

const { Title } = Typography;

interface ComponentLibraryProps {
  libraries: ComponentLibraryType[];
  onDragStart: (component: ComponentMeta) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  libraries,
  onDragStart,
}) => {
  const { t } = useTranslation();

  return (
    <div className="component-library">
      <Title className="component-library-title" level={4}>{t('sidebar.componentLibrary')}</Title>
      <Divider />

      {libraries.map((library) => (
        <div key={library.category} className="component-library-category">
          <Title className="component-library-category-title" level={5}>
            {library.category}
          </Title>

          <Space direction="vertical" size="small" className="component-library-category-items">
            {library.components.map((component) => (
              <ComponentItem
                key={component.type}
                component={component}
                onDragStart={onDragStart}
              />
            ))}
          </Space>
        </div>
      ))}
    </div>
  );
};
