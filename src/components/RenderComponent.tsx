import React from 'react';
import type { ComponentConfig } from '../types';
import { Button, Input, Card, Typography, Space, Image, Select, Switch, Divider, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor } from '../context/EditorContext';
import { ResizableInput } from './ResizableInput';
import { FlexContainer } from './FlexContainer';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

interface RenderComponentProps {
  component: ComponentConfig;
  onClick?: () => void;
  isSelected?: boolean;
}

// 可排序的组件包装器
const SortableComponent: React.FC<{
  component: ComponentConfig;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ component, onClick, isSelected }) => {
  const { dispatch } = useEditor();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_COMPONENT',
      payload: component.id,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-component ${isSelected ? 'selected' : ''}`}
    >
      {/* 拖拽手柄 */}
      <div
        {...attributes}
        {...listeners}
        className="drag-handle"
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          zIndex: 10,
          cursor: 'grab',
          color: 'var(--text-color-secondary)',
          fontSize: '12px',
          padding: '2px',
          borderRadius: '2px',
          backgroundColor: 'var(--background-color)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="拖拽排序"
      >
        <HolderOutlined />
      </div>

      {/* 删除按钮 */}
      <Popconfirm
        title="确定要删除这个组件吗？"
        onConfirm={handleDelete}
        okText="确定"
        cancelText="取消"
      >
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          className="delete-button"
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 10,
            color: '#ff4d4f',
            fontSize: '12px',
            padding: '2px',
            minWidth: 'auto',
            height: 'auto',
            backgroundColor: 'var(--background-color)',
            border: '1px solid var(--border-color)',
          }}
          title="删除组件"
        />
      </Popconfirm>

      {/* 组件内容 */}
      <div onClick={onClick} style={{ paddingTop: '24px' }}>
        <RenderComponentContent
          component={component}
          isSelected={isSelected}
        />
      </div>
    </div>
  );
};

// 组件内容渲染器
const RenderComponentContent: React.FC<{
  component: ComponentConfig;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({
  component,
  onClick,
  isSelected = false,
}) => {
  const { dispatch } = useEditor();
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
          <ResizableInput
            value={comp.props.value || ''}
            placeholder={comp.props.placeholder || '请输入内容'}
            width={comp.props.width || 200}
            height={comp.props.height || 32}
            disabled={false}
            showResizeHandles={isSelected}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onResize={(width, height) => {
              if (isSelected) {
                dispatch({
                  type: 'UPDATE_COMPONENT',
                  payload: {
                    id: comp.id,
                    props: {
                      ...comp.props,
                      width,
                      height,
                    },
                  },
                });
              }
            }}
            onValueChange={(value) => {
              if (isSelected) {
                dispatch({
                  type: 'UPDATE_COMPONENT',
                  payload: {
                    id: comp.id,
                    props: {
                      ...comp.props,
                      value,
                    },
                  },
                });
              }
            }}
          />
        );

      case 'text':
        return (
          <Text
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={{
              ...baseStyle,
              color: comp.props.color || 'inherit',
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
              color: comp.props.color || 'inherit',
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
              color: comp.props.color || 'inherit',
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

      case 'flex-container':
        return (
          <FlexContainer
            component={comp}
            onClick={onClick}
            isSelected={isSelected}
          />
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
          <div
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
          >
            <Divider
              {...comp.props}
              type={comp.props.type || 'horizontal'}
              orientation={comp.props.orientation || 'center'}
            >
              {comp.props.children || '分割线'}
            </Divider>
          </div>
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

// 主导出组件
export const RenderComponent: React.FC<RenderComponentProps> = (props) => {
  return <RenderComponentContent {...props} />;
};

// 导出可排序组件供Canvas使用
export { SortableComponent };
