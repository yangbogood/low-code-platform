import React from 'react';
import { Card } from 'antd';
import type { ComponentMeta } from '../types';

interface ComponentItemProps {
  component: ComponentMeta;
  onDragStart: (component: ComponentMeta) => void;
}

export const ComponentItem: React.FC<ComponentItemProps> = ({
  component,
  onDragStart,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'component',
      componentType: component.type,
      data: component,
    }));
    onDragStart(component);
  };

  return (
    <Card
      size="small"
      draggable
      onDragStart={handleDragStart}
      className="component-item"
      bodyStyle={{ padding: '8px 12px' }}
      hoverable
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="component-item-icon" style={{ fontSize: '16px' }}>{component.icon}</span>
        <div className="component-item-content">
          <div className="component-item-content-name">
            {component.name}
          </div>
          <div className="component-item-content-description">
            {component.description}
          </div>
        </div>
      </div>
    </Card>
  );
};
