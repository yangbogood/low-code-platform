import React, { useState } from 'react';
import { Modal, Button, Space, Typography, Tabs, message } from 'antd';
import {
  CodeOutlined,
  DownloadOutlined,
  CopyOutlined,
  EyeOutlined,
  FileTextOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useEditor } from '../context/EditorContext';
import { CodeGenerator } from '../utils/codeGenerator';
import type { CodeGenOptions } from '../types';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface CodePreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({ visible, onClose }) => {
  const { state } = useEditor();
  const { theme } = useTheme();
  const [generatedCode, setGeneratedCode] = useState<{
    tsx: string;
    scss: string;
    html: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    if (!state.project || !state.currentPage) {
      message.error('没有可生成的项目或页面');
      return;
    }

    setLoading(true);
    try {
      const options: CodeGenOptions = {
        framework: 'react',
        style: 'scss',
        typescript: true,
        exportType: 'page',
      };

      const codeGenerator = new CodeGenerator(options);

      // 生成TSX代码
      const tsxCode = codeGenerator.generateProject(state.project);

      // 生成SCSS代码
      const scssCode = codeGenerator.generateCSS();

      // 生成HTML预览代码
      const htmlCode = generateHTMLPreview(state.currentPage, theme);

      setGeneratedCode({
        tsx: tsxCode,
        scss: scssCode,
        html: htmlCode,
      });

      message.success('代码生成成功！');
    } catch (error) {
      message.error('代码生成失败');
      console.error('Code generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHTMLPreview = (page: any, currentTheme: string) => {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: ${currentTheme === 'dark' ? '#141414' : '#f5f5f5'};
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
        }
        .preview-container {
            max-width: 1200px;
            margin: 0 auto;
            background: ${currentTheme === 'dark' ? '#1f1f1f' : 'white'};
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, ${currentTheme === 'dark' ? '0.3' : '0.1'});
        }
        .preview-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
        }
        .component {
            margin-bottom: 12px;
        }
        .button {
            padding: 8px 16px;
            border: 1px solid ${currentTheme === 'dark' ? '#434343' : '#d9d9d9'};
            border-radius: 6px;
            background: ${currentTheme === 'dark' ? '#262626' : '#fff'};
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
            cursor: pointer;
        }
        .input {
            padding: 8px 12px;
            border: 1px solid ${currentTheme === 'dark' ? '#434343' : '#d9d9d9'};
            border-radius: 6px;
            background: ${currentTheme === 'dark' ? '#262626' : '#fff'};
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
        }
        .text {
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
            font-size: 14px;
        }
        .title {
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
            font-weight: 600;
            margin: 0 0 8px 0;
        }
        .paragraph {
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
            line-height: 1.6;
            margin: 0 0 12px 0;
        }
        .card {
            border: 1px solid ${currentTheme === 'dark' ? '#434343' : '#d9d9d9'};
            border-radius: 6px;
            background: ${currentTheme === 'dark' ? '#262626' : '#fff'};
            box-shadow: 0 2px 8px rgba(0, 0, 0, ${currentTheme === 'dark' ? '0.3' : '0.1'});
            margin-bottom: 12px;
        }
        .card-header {
            padding: 16px 24px;
            border-bottom: 1px solid ${currentTheme === 'dark' ? '#434343' : '#f0f0f0'};
            font-weight: 500;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
        }
        .card-body {
            padding: 16px 24px;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#262626'};
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <h1 class="preview-title">${page.name}</h1>
        ${generateHTMLComponents(page.components)}
    </div>
</body>
</html>`;
  };

  const generateHTMLComponents = (components: any[]): string => {
    return components.map(component => {
      switch (component.type) {
        case 'button':
          return `<div class="component"><button class="button">${component.props.text || '按钮'}</button></div>`;
        case 'input':
          return `<div class="component"><input class="input" placeholder="${component.props.placeholder || '请输入内容'}" /></div>`;
        case 'text':
          return `<div class="component"><span class="text">${component.props.content || '文本内容'}</span></div>`;
        case 'title': {
          const level = component.props.level || 1;
          return `<div class="component"><h${level} class="title">${component.props.content || '标题'}</h${level}></div>`;
        }
        case 'paragraph':
          return `<div class="component"><p class="paragraph">${component.props.content || '段落内容'}</p></div>`;
        case 'card':
          return `<div class="component">
            <div class="card">
              <div class="card-header">${component.props.title || '卡片标题'}</div>
              <div class="card-body">${component.props.content || '卡片内容'}</div>
            </div>
          </div>`;
        default:
          return `<div class="component"><div>${component.type} 组件</div></div>`;
      }
    }).join('\n');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} 代码已复制到剪贴板`);
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(`${filename} 下载成功`);
  };

  const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '16px',
      borderRadius: '6px',
      maxHeight: '500px',
      overflow: 'auto',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontSize: '13px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
      border: '1px solid #e8e8e8',
    }}>
      {code}
    </div>
  );

  return (
    <Modal
      title={
        <Space>
          <CodeOutlined />
          <span>代码生成与预览</span>
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
        <Button
          key="generate"
          type="primary"
          icon={<CodeOutlined />}
          onClick={generateCode}
          loading={loading}
        >
          生成代码
        </Button>,
      ]}
    >
      {!generatedCode ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          color: '#999',
        }}>
          <CodeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <Title level={4} style={{ color: '#999' }}>点击"生成代码"开始</Title>
          <Text type="secondary">将根据当前页面内容生成对应的代码文件</Text>
        </div>
      ) : (
        <Tabs defaultActiveKey="tsx" size="large">
          <TabPane
            tab={
              <Space>
                <FileTextOutlined />
                <span>React 组件</span>
              </Space>
            }
            key="tsx"
          >
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(generatedCode.tsx, 'TSX')}
                >
                  复制代码
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(generatedCode.tsx, `${state.currentPage?.name || 'page'}.tsx`, 'text/plain')}
                >
                  下载 TSX
                </Button>
              </Space>
            </div>
            <CodeBlock code={generatedCode.tsx} language="tsx" />
          </TabPane>

          <TabPane
            tab={
              <Space>
                <FileImageOutlined />
                <span>样式文件</span>
              </Space>
            }
            key="scss"
          >
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(generatedCode.scss, 'SCSS')}
                >
                  复制代码
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(generatedCode.scss, `${state.currentPage?.name || 'page'}.scss`, 'text/scss')}
                >
                  下载 SCSS
                </Button>
              </Space>
            </div>
            <CodeBlock code={generatedCode.scss} language="scss" />
          </TabPane>

          <TabPane
            tab={
              <Space>
                <EyeOutlined />
                <span>HTML 预览</span>
              </Space>
            }
            key="html"
          >
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(generatedCode.html, 'HTML')}
                >
                  复制代码
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(generatedCode.html, `${state.currentPage?.name || 'page'}.html`, 'text/html')}
                >
                  下载 HTML
                </Button>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    const currentPageId = state.currentPage?.id;
                    const previewUrl = currentPageId ? `/preview/${currentPageId}` : '/preview';
                    window.open(previewUrl, '_blank');
                  }}
                >
                  预览页面
                </Button>
              </Space>
            </div>
            <CodeBlock code={generatedCode.html} language="html" />
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};
