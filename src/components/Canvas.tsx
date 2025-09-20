import React, { useRef, useState } from 'react';
import { Button, Space, Typography, Input } from 'antd';
import { PlusOutlined, EyeOutlined, CodeOutlined } from '@ant-design/icons';
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
import { SortableComponent } from './RenderComponent';
import { CodePreviewModal } from './CodePreviewModal';
import { generatePageId, generateComponentId } from '../utils/idGenerator';

const { Title } = Typography;

interface CanvasProps {
  onPreview: (selectedComponent?: ComponentConfig | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onPreview }) => {
  const { state, dispatch } = useEditor();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [codePreviewVisible, setCodePreviewVisible] = useState(false);
  const [isEditingPageName, setIsEditingPageName] = useState(false);
  const [editingPageName, setEditingPageName] = useState('');

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

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
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
          props: { ...data.data.defaultProps },
          children: [],
        };

        dispatch({
          type: 'ADD_COMPONENT',
          payload: { component: newComponent },
        });
      }
    } catch {
      // 拖拽数据解析失败，忽略错误
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
    if (!state.project) {return;}

    const newPage = {
      id: generatePageId(),
      name: `页面 ${state.project.pages.length + 1}`,
      title: `新页面 ${state.project.pages.length + 1}`,
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

  const handleStartEditPageName = () => {
    if (state.currentPage) {
      setEditingPageName(state.currentPage.name);
      setIsEditingPageName(true);
    }
  };

  const handleSavePageName = () => {
    if (!state.currentPage || !state.project) {
      return;
    }

    const updatedPage = {
      ...state.currentPage,
      name: editingPageName.trim() || state.currentPage.name,
    };

    const updatedProject = {
      ...state.project,
      pages: state.project.pages.map(page =>
        page.id === updatedPage.id ? updatedPage : page,
      ),
    };

    dispatch({
      type: 'SET_PROJECT',
      payload: updatedProject,
    });

    dispatch({
      type: 'SET_CURRENT_PAGE',
      payload: updatedPage,
    });

    setIsEditingPageName(false);
  };

  const handleCancelEditPageName = () => {
    setIsEditingPageName(false);
    setEditingPageName('');
  };

  if (!state.currentPage) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <Title level={3}>欢迎使用低代码平台</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPage}>
            创建新页面
          </Button>
        </Space>
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
      }}>
        {isEditingPageName ? (
          <Input
            value={editingPageName}
            onChange={(e) => setEditingPageName(e.target.value)}
            onPressEnter={handleSavePageName}
            onBlur={handleSavePageName}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancelEditPageName();
              }
            }}
            autoFocus
            style={{ width: 200 }}
            placeholder="输入页面名称"
          />
        ) : (
          <Title
            level={4}
            style={{ margin: 0, cursor: 'pointer' }}
            onClick={handleStartEditPageName}
            title="点击编辑页面名称"
          >
            {state.currentPage.name}
          </Title>
        )}
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => onPreview(state.selectedComponent)}
            disabled={!state.selectedComponent}
          >
            预览选中组件
          </Button>
          <Button icon={<CodeOutlined />} onClick={() => setCodePreviewVisible(true)}>
            生成代码
          </Button>
        </Space>
      </div>

      {/* 画布区域 */}
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`canvas-area canvas-theme-${theme} ${dragOver ? 'drag-over' : ''}`}
        style={{
          flex: 1,
          padding: '20px',
          margin: '16px',
          minHeight: '400px',
          overflow: 'auto',
        }}
      >
        {state.currentPage.components.length === 0 ? (
          <div className="canvas-area-placeholder">
            拖拽组件到这里开始设计
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={state.currentPage.components.map(comp => comp.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="canvas-area-content">
                {state.currentPage.components.map((component) => (
                  <SortableComponent
                    key={component.id}
                    component={component}
                    onClick={() => handleComponentClick(component)}
                    isSelected={state.selectedComponent?.id === component.id}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="drag-overlay">
                  {(() => {
                    const activeComponent = state.currentPage.components.find(comp => comp.id === activeId);
                    return activeComponent ? (
                      <SortableComponent
                        component={activeComponent}
                        onClick={() => {}}
                        isSelected={false}
                      />
                    ) : null;
                  })()}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* 代码预览模态框 */}
      <CodePreviewModal
        visible={codePreviewVisible}
        onClose={() => setCodePreviewVisible(false)}
      />
    </div>
  );
};
