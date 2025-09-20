import React, { useState, useRef } from 'react';
import { Button, Input, Card, Typography, Space, Image, Select, Switch, Divider, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, HolderOutlined, PlusOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor } from '../context/EditorContext';
import type { ComponentConfig } from '../types';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

interface FlexContainerProps {
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
      data-dragging={isDragging}
    >
      <div className="component-wrapper">
        {/* 拖拽手柄 */}
        <div className="drag-handle" {...attributes} {...listeners}>
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
            danger
          />
        </Popconfirm>

        {/* 组件内容 */}
        <div onClick={onClick} style={{ flex: 1 }}>
          <RenderComponentContent
            component={component}
            onClick={onClick}
            isSelected={isSelected}
          />
        </div>
      </div>
    </div>
  );
};

// 渲染单个组件内容
const RenderComponentContent: React.FC<{
  component: ComponentConfig;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ component: comp, onClick, isSelected }) => {
  const { dispatch } = useEditor();

  const renderComponent = (comp: ComponentConfig) => {
    const baseStyle: React.CSSProperties = {
      ...comp.style,
      borderRadius: '4px',
      padding: '8px',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
              color: comp.props.color || 'inherit',
            }}
            onClick={onClick}
          >
            {comp.props.content || '文本内容'}
          </Text>
        );

      case 'title': {
        const level = comp.props.level || 1;
        const TitleComponent = Title as any;
        return (
          <TitleComponent
            level={level}
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={{
              ...baseStyle,
              color: comp.props.color || 'inherit',
            }}
            onClick={onClick}
          >
            {comp.props.content || '标题'}
          </TitleComponent>
        );
      }

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
            size="small"
          >
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
            direction={comp.props.direction || 'horizontal'}
          >
            {comp.children?.map((child) => (
              <RenderComponentContent
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
            src={comp.props.src || 'https://via.placeholder.com/200x100'}
            alt={comp.props.alt || '图片'}
            width={comp.props.width || 200}
            height={comp.props.height || 100}
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
            options={comp.props.options || [
              { label: '选项1', value: 'option1' },
              { label: '选项2', value: 'option2' },
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
          />
        );

      case 'badge':
        return (
          <Badge
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
            count={comp.props.count || 0}
            showZero={comp.props.showZero || false}
          >
            {comp.props.children || <span>徽章</span>}
          </Badge>
        );

      case 'container':
        return (
          <div
            {...comp.props}
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
          >
            {comp.children?.map((child) => (
              <RenderComponentContent
                key={child.id}
                component={child}
                onClick={onClick}
                isSelected={isSelected}
              />
            ))}
          </div>
        );

      default:
        return (
          <div
            className={`rendered-component ${isSelected ? 'selected' : ''}`}
            style={baseStyle}
            onClick={onClick}
          >
            未知组件: {comp.type}
          </div>
        );
    }
  };

  return renderComponent(comp);
};

// 弹性布局容器组件
export const FlexContainer: React.FC<FlexContainerProps> = ({ component, onClick, isSelected }) => {
  const { dispatch } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (dragData.type === 'component') {
        const newComponent: ComponentConfig = {
          id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: dragData.componentType,
          name: dragData.componentType,
          props: dragData.defaultProps || {},
        };

        dispatch({
          type: 'ADD_COMPONENT',
          payload: {
            component: newComponent,
            parentId: component.id,
          },
        });
      }
    } catch (error) {
      // 静默处理错误
    }
  };

  const flexDirection = component.props.direction || 'row';
  const flexWrap = component.props.wrap || 'wrap';
  const justifyContent = component.props.justify || 'flex-start';
  const alignItems = component.props.align || 'stretch';
  const gap = component.props.gap || 8;

  return (
    <div
      ref={containerRef}
      className={`flex-container ${isSelected ? 'selected' : ''} ${isDragOver ? 'drag-over' : ''}`}
      style={{
        display: 'flex',
        flexDirection,
        flexWrap,
        justifyContent,
        alignItems,
        gap: `${gap}px`,
        minHeight: '60px',
        padding: '12px',
        border: isSelected ? '2px dashed #1890ff' : '2px dashed transparent',
        borderRadius: '6px',
        backgroundColor: isDragOver ? '#f0f8ff' : 'transparent',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
    >
      {/* 容器标题 */}
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          left: '8px',
          backgroundColor: '#1890ff',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        弹性布局
      </div>

      {/* 子组件 */}
      {component.children && component.children.length > 0 ? (
        component.children.map((child) => (
          <SortableComponent
            key={child.id}
            component={child}
            onClick={onClick}
            isSelected={isSelected}
          />
        ))
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '60px',
            color: '#999',
            fontSize: '14px',
            border: '1px dashed #d9d9d9',
            borderRadius: '4px',
            backgroundColor: '#fafafa',
          }}
        >
          <Space>
            <PlusOutlined />
            <span>拖拽组件到这里</span>
          </Space>
        </div>
      )}
    </div>
  );
};
