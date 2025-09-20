import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { EyeOutlined, CodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEditor } from '../context/EditorContext';
import { RenderComponent } from './RenderComponent';
import { CodeGenerator } from '../utils/codeGenerator';
import { useTheme } from '../context/ThemeContext';

const { Title } = Typography;

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ visible, onClose }) => {
  const { state } = useEditor();
  const { theme } = useTheme();

  const handleGenerateCode = () => {
    if (!state.project) {return;}

    const codeGenerator = new CodeGenerator({
      framework: 'react',
      style: 'scss',
      typescript: true,
      exportType: 'project',
    });

    const code = codeGenerator.generateProject(state.project);
    const css = codeGenerator.generateCSS();

    // 创建下载链接
    const downloadCode = () => {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.project?.name || 'project'}.tsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const downloadCSS = () => {
      const blob = new Blob([css], { type: 'text/scss' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.project?.name || 'project'}.scss`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    // 显示代码预览
    Modal.info({
      title: '生成的代码',
      width: 800,
      content: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Button icon={<DownloadOutlined />} onClick={downloadCode}>
              下载 TSX 文件
            </Button>
            <Button icon={<DownloadOutlined />} onClick={downloadCSS}>
              下载 SCSS 文件
            </Button>
          </Space>
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            maxHeight: '400px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
          }}>
            {code}
          </div>
        </div>
      ),
    });
  };

  if (!state.currentPage) {
    return null;
  }

  return (
    <Modal
      title={
        <Space>
          <EyeOutlined />
          <span>页面预览</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ top: 20 }}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="code" type="primary" icon={<CodeOutlined />} onClick={handleGenerateCode}>
          生成代码
        </Button>,
      ]}
    >
      <div
        className={`canvas-area canvas-theme-${theme}`}
        style={{
          minHeight: '600px',
          padding: '20px',
          backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
        }}
      >
        <Title level={3} style={{ marginBottom: '20px' }}>
          {state.currentPage.name}
        </Title>

        {state.currentPage.components.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#999',
            fontSize: '16px',
          }}>
            暂无组件
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.currentPage.components.map((component) => (
              <RenderComponent
                key={component.id}
                component={component}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
