import React, { useState } from 'react';
import { Card, Collapse, Typography, Button, Space, Tag, Tooltip } from 'antd';
import { MailOutlined, PlusOutlined } from '@ant-design/icons';
import { emailComponents, emailTemplates } from '../data/emailComponents';
import type { ComponentConfig } from '../types';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface EmailComponentLibraryProps {
  onDragStart: (component: ComponentConfig) => void;
  onTemplateSelect: (template: (typeof emailTemplates)[0]) => void;
}

export const EmailComponentLibrary: React.FC<EmailComponentLibraryProps> = ({
  onDragStart,
  onTemplateSelect,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, component: ComponentConfig) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'component',
        componentType: component.type,
        data: component,
      })
    );
    onDragStart(component);
  };

  const handleTemplateSelect = (template: (typeof emailTemplates)[0]) => {
    setSelectedTemplate(template.id);
    onTemplateSelect(template);
  };

  // 按类别分组组件
  const componentCategories = {
    布局组件: emailComponents.filter(
      comp => comp.type.includes('column') || comp.type === 'email-divider'
    ),
    内容组件: emailComponents.filter(comp =>
      ['email-header', 'email-title', 'email-content', 'email-footer'].includes(
        comp.type
      )
    ),
    交互组件: emailComponents.filter(comp =>
      ['email-button', 'email-social'].includes(comp.type)
    ),
    媒体组件: emailComponents.filter(comp =>
      ['email-image', 'email-product'].includes(comp.type)
    ),
    营销组件: emailComponents.filter(comp =>
      ['email-banner'].includes(comp.type)
    ),
  };

  return (
    <div style={{ padding: '16px' }}>
      <Title
        level={4}
        style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}
      >
        <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
        邮件模板组件
      </Title>

      {/* 邮件模板预设 */}
      <Card
        title="邮件模板预设"
        size="small"
        style={{ marginBottom: '16px' }}
        extra={
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {emailTemplates.length} 个模板
          </Text>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {emailTemplates.map(template => (
            <Card
              key={template.id}
              size="small"
              hoverable
              style={{
                border:
                  selectedTemplate === template.id
                    ? '2px solid #1890ff'
                    : '1px solid #d9d9d9',
                cursor: 'pointer',
              }}
              onClick={() => handleTemplateSelect(template)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: '0 0 4px 0' }}>
                    {template.name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {template.description}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Tag color="blue" style={{ fontSize: '10px' }}>
                      {template.components.length} 个组件
                    </Tag>
                  </div>
                </div>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={e => {
                    e.stopPropagation();
                    handleTemplateSelect(template);
                  }}
                >
                  使用
                </Button>
              </div>
            </Card>
          ))}
        </Space>
      </Card>

      {/* 邮件组件库 */}
      <Collapse defaultActiveKey={['layout', 'content']} ghost>
        {Object.entries(componentCategories).map(
          ([categoryName, components]) => (
            <Panel
              key={categoryName.toLowerCase().replace('组件', '')}
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text strong>{categoryName}</Text>
                  <Tag
                    color="default"
                    style={{ marginLeft: '8px', fontSize: '10px' }}
                  >
                    {components.length}
                  </Tag>
                </div>
              }
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '8px',
                }}
              >
                {components.map(component => (
                  <Tooltip key={component.id} title={component.name}>
                    <Card
                      size="small"
                      hoverable
                      draggable
                      onDragStart={e => handleDragStart(e, component)}
                      style={{
                        cursor: 'grab',
                        textAlign: 'center',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                      bodyStyle={{ padding: '8px' }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                        {getComponentIcon(component.type)}
                      </div>
                      <Text style={{ fontSize: '11px', lineHeight: '1.2' }}>
                        {component.name}
                      </Text>
                    </Card>
                  </Tooltip>
                ))}
              </div>
            </Panel>
          )
        )}
      </Collapse>

      {/* 使用说明 */}
      <Card title="使用说明" size="small" style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <p>
            <strong>1. 选择模板：</strong>点击预设模板快速开始
          </p>
          <p>
            <strong>2. 拖拽组件：</strong>从组件库拖拽到画布
          </p>
          <p>
            <strong>3. 编辑属性：</strong>选中组件后在右侧编辑属性
          </p>
          <p>
            <strong>4. 预览邮件：</strong>点击预览查看邮件效果
          </p>
        </div>
      </Card>
    </div>
  );
};

// 获取组件图标
const getComponentIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    'email-header': '📧',
    'email-title': '📝',
    'email-content': '📄',
    'email-button': '🔘',
    'email-image': '🖼️',
    'email-divider': '➖',
    'email-footer': '📋',
    'email-two-column': '📊',
    'email-three-column': '📈',
    'email-banner': '🎯',
    'email-product': '🛍️',
    'email-social': '📱',
  };
  return iconMap[type] || '📦';
};
