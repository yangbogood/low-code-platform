import React, { useRef, useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { PlusOutlined, EyeOutlined, CodeOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../types';
import { useEditor } from '../context/EditorContext';
import { RenderComponent } from './RenderComponent';

const { Title } = Typography;

interface CanvasProps {
  onPreview: () => void;
  onGenerateCode: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onPreview, onGenerateCode }) => {
  const { state, dispatch } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

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
          id: `component_${Date.now()}`,
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
    } catch (error) {
      console.error('拖拽数据解析失败:', error);
    }
  };

  const handleComponentClick = (component: ComponentConfig) => {
    dispatch({
      type: 'SELECT_COMPONENT',
      payload: component,
    });
  };

  const handleAddPage = () => {
    if (!state.project) {return;}

    const newPage = {
      id: `page_${Date.now()}`,
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
        <Title level={4} style={{ margin: 0 }}>
          {state.currentPage.name}
        </Title>
        <Space>
          <Button icon={<EyeOutlined />} onClick={onPreview}>
            预览
          </Button>
          <Button icon={<CodeOutlined />} onClick={onGenerateCode}>
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
        className={`canvas-area ${dragOver ? 'drag-over' : ''}`}
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
          <div className="canvas-area-content">
            {state.currentPage.components.map((component) => (
              <RenderComponent
                key={component.id}
                component={component}
                onClick={() => handleComponentClick(component)}
                isSelected={state.selectedComponent?.id === component.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
