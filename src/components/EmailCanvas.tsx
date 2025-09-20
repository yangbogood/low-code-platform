import React, { useRef, useState } from 'react';
import { Button, Space, Typography, message } from 'antd';
import { PlusOutlined, EyeOutlined, CodeOutlined, MailOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ComponentConfig } from '../types';
import { useEditor } from '../context/EditorContext';
import { useTheme } from '../context/ThemeContext';
import { renderEmailComponent } from './EmailComponents';
import { EmailCodeEditorModal } from './EmailCodeEditorModal';
import { generatePageId, generateComponentId } from '../utils/idGenerator';

const { Title } = Typography;

interface EmailCanvasProps {
  onPreview: (selectedComponent?: ComponentConfig | null) => void;
}

export const EmailCanvas: React.FC<EmailCanvasProps> = ({ onPreview }) => {
  const { state, dispatch } = useEditor();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [_codePreviewVisible, setCodePreviewVisible] = useState(false);

  // 拖拽传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));

      if (data.type === 'component') {
        const newComponent: ComponentConfig = {
          id: generateComponentId(data.componentType),
          type: data.componentType,
          name: data.data.name,
          props: { ...data.data.props },
          children: [],
        };

        dispatch({
          type: 'ADD_COMPONENT',
          payload: { component: newComponent },
        });

        message.success(`已添加 ${newComponent.name} 组件`);
      }
    } catch {
      message.error('拖拽数据解析失败');
    }
  };

  const handleComponentClick = (component: ComponentConfig) => {
    dispatch({
      type: 'SELECT_COMPONENT',
      payload: component,
    });
  };

  // 处理拖拽开始
  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(String(event.active.id));
  };

  // 处理拖拽排序结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      dispatch({
        type: 'MOVE_COMPONENT',
        payload: {
          activeId: active.id as string,
          overId: over.id as string,
        },
      });
    }
  };

  const handleAddPage = () => {
    if (!state.project) {
      return;
    }

    const newPage = {
      id: generatePageId(),
      name: `邮件模板 ${state.project.pages.length + 1}`,
      title: `新邮件模板 ${state.project.pages.length + 1}`,
      components: [],
    };

    const updatedProject = {
      ...state.project,
      pages: [...state.project.pages, newPage],
    };

    dispatch({
      type: 'SET_PROJECT',
      payload: updatedProject,
    });
  };

  if (!state.currentPage) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme === 'dark' ? '#141414' : '#f5f5f5',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <MailOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={3}>开始创建邮件模板</Title>
          <p style={{ color: theme === 'dark' ? '#999' : '#666' }}>
            从左侧组件库拖拽组件到画布，或选择预设模板快速开始
          </p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleAddPage}>
          创建新邮件模板
        </Button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
      }}>
        <Title level={4} style={{ margin: 0, color: theme === 'dark' ? '#ffffff' : '#262626' }}>
          {state.currentPage.name}
        </Title>
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => onPreview(state.selectedComponent)}
            disabled={!state.selectedComponent}
          >
            预览选中组件
          </Button>
          <Button icon={<CodeOutlined />} onClick={() => setCodePreviewVisible(true)}>
            代码编辑器
          </Button>
        </Space>
      </div>

      {/* 画布区域 */}
      <div
        ref={canvasRef}
        style={{
          flex: 1,
          padding: '20px',
          backgroundColor: theme === 'dark' ? '#141414' : '#f5f5f5',
          overflow: 'auto',
          position: 'relative',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            minHeight: '400px',
            border: dragOver ? '2px dashed #1890ff' : '1px solid #e9ecef',
            borderRadius: '8px',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            {state.currentPage.components.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                color: '#999',
                textAlign: 'center',
                padding: '40px',
              }}>
                <MailOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999', marginBottom: '8px' }}>
                  邮件模板画布
                </Title>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  从左侧组件库拖拽邮件组件到这里开始构建您的邮件模板
                </p>
              </div>
            ) : (
              <SortableContext
                items={state.currentPage.components.map(comp => comp.id)}
                strategy={verticalListSortingStrategy}
              >
                {state.currentPage.components.map((component) => (
                  <div
                    key={component.id}
                    onClick={() => handleComponentClick(component)}
                    style={{
                      cursor: 'pointer',
                      border: state.selectedComponent?.id === component.id
                        ? '2px solid #1890ff'
                        : '2px solid transparent',
                      borderRadius: '4px',
                      margin: '2px',
                      width: '100%',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                  >
                    {renderEmailComponent(component)}
                  </div>
                ))}
              </SortableContext>
            )}
          </div>

          <DragOverlay>
            {activeId ? (
              <div style={{
                opacity: 0.8,
                transform: 'rotate(5deg)',
              }}>
                {(() => {
                  const component = state.currentPage.components.find(comp => comp.id === activeId);
                  return component ? renderEmailComponent(component) : null;
                })()}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* 邮件代码编辑器模态框 */}
      <EmailCodeEditorModal
        visible={_codePreviewVisible}
        onClose={() => setCodePreviewVisible(false)}
      />
    </div>
  );
};
