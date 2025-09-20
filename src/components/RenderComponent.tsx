import React from 'react';
import type { ComponentConfig } from '../types';
import { Button, Input, Card, Typography, Space, Image, Select, Switch, Divider, Badge } from 'antd';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

interface RenderComponentProps {
  component: ComponentConfig;
  onClick?: () => void;
  isSelected?: boolean;
}

export const RenderComponent: React.FC<RenderComponentProps> = ({
  component,
  onClick,
  isSelected = false,
}) => {
  const renderComponent = (comp: ComponentConfig) => {
    const baseStyle: React.CSSProperties = {
      ...comp.style,
      borderRadius: '4px',
      padding: '8px',
      cursor: 'pointer',
      position: 'relative',
    };

    switch (comp.type) {
      case 'button':
        return (
          <Button
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
          >
            {comp.props.text || '按钮'}
          </Button>
        );

      case 'input':
        return (
          <Input
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            placeholder={comp.props.placeholder || '请输入内容'}
          />
        );

      case 'text':
        return (
          <Text
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={{
              ...baseStyle,
              color: comp.props.color || 'var(--text-color)',
              fontSize: comp.props.fontSize || 14,
            }}
            onClick={onClick}
          >
            {comp.props.content || '文本内容'}
          </Text>
        );

      case 'title':
        return (
          <Title
            level={comp.props.level || 1}
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={{
              ...baseStyle,
              color: comp.props.color || 'var(--text-color)',
            }}
            onClick={onClick}
          >
            {comp.props.content || '标题'}
          </Title>
        );

      case 'paragraph':
        return (
          <Paragraph
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={{
              ...baseStyle,
              color: comp.props.color || 'var(--text-color)',
            }}
            onClick={onClick}
          >
            {comp.props.content || '段落内容'}
          </Paragraph>
        );

      case 'card':
        return (
          <Card
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            title={comp.props.title || '卡片标题'}
          >
            {comp.children?.map((child) => (
              <RenderComponent
                key={child.id}
                component={child}
                onClick={onClick}
                isSelected={isSelected}
              />
            ))}
            {comp.props.content || '卡片内容'}
          </Card>
        );

      case 'space':
        return (
          <Space
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
          >
            {comp.children?.map((child) => (
              <RenderComponent
                key={child.id}
                component={child}
                onClick={onClick}
                isSelected={isSelected}
              />
            ))}
          </Space>
        );

      case 'image':
        return (
          <Image
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            src={comp.props.src || 'https://via.placeholder.com/200x150'}
            alt={comp.props.alt || '图片'}
            width={comp.props.width || 200}
            height={comp.props.height || 150}
          />
        );

      case 'container':
        return (
          <div
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={{
              ...baseStyle,
              backgroundColor: comp.props.backgroundColor || 'var(--background-color)',
              padding: comp.props.padding || 16,
              margin: comp.props.margin || 0,
            }}
            onClick={onClick}
          >
            {comp.children?.map((child) => (
              <RenderComponent
                key={child.id}
                component={child}
                onClick={onClick}
                isSelected={isSelected}
              />
            ))}
          </div>
        );

      case 'textarea':
        return (
          <TextArea
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            placeholder={comp.props.placeholder || '请输入内容'}
            rows={comp.props.rows || 4}
          />
        );

      case 'select':
        return (
          <Select
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            placeholder={comp.props.placeholder || '请选择'}
            options={[
              { label: '选项1', value: 'option1' },
              { label: '选项2', value: 'option2' },
              { label: '选项3', value: 'option3' },
            ]}
          />
        );

      case 'switch':
        return (
          <Switch
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            checked={comp.props.checked || false}
          />
        );

      case 'divider':
        return (
          <Divider
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            type={comp.props.type || 'horizontal'}
            orientation={comp.props.orientation || 'center'}
          >
            {comp.props.children || '分割线'}
          </Divider>
        );

      case 'badge':
        return (
          <Badge
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            count={comp.props.count || 5}
            showZero={comp.props.showZero || false}
          >
            <div style={{
              width: 40,
              height: 40,
              background: 'var(--background-color)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-color)',
            }}>
              徽标
            </div>
          </Badge>
        );

      default:
        return (
          <div
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={{
              ...baseStyle,
              backgroundColor: 'var(--background-color)',
              border: '1px dashed var(--border-color)',
              padding: '20px',
              textAlign: 'center',
              color: 'var(--text-color-secondary)',
            }}
            onClick={onClick}
          >
            未知组件: {comp.type}
          </div>
        );
    }
  };

  return renderComponent(component);
};
