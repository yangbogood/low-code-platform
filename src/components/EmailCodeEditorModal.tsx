import React, { useState, useRef, useCallback } from 'react';
import { Modal, Tabs, Button, Space, Typography, message, Row, Col } from 'antd';
import { DownloadOutlined, CopyOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Editor } from '@monaco-editor/react';
import { useEditor } from '../context/EditorContext';
import { useTheme } from '../context/ThemeContext';
import type { ComponentConfig } from '../types';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface EmailCodeEditorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EmailCodeEditorModal: React.FC<EmailCodeEditorModalProps> = ({
  visible,
  onClose,
}) => {
  const { state } = useEditor();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editorHeight, setEditorHeight] = useState(500);
  const editorRef = useRef<unknown>(null);

  // 生成初始HTML代码
  const generateInitialHTML = useCallback((): string => {
    if (!state.currentPage) {return '';}

    const components = state.currentPage.components;
    const componentsHTML = components.map(component => {
      return generateComponentHTML(component);
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.currentPage.name}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        /* 邮件客户端兼容性样式 */
        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        /* 响应式设计 */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            .mobile-hide {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${componentsHTML}
    </div>
</body>
</html>`;
  }, [state.currentPage]);

  // 生成组件HTML
  const generateComponentHTML = (component: ComponentConfig): string => {
    switch (component.type) {
      case 'email-header':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#ffffff'}; padding: ${component.props.padding || '20px'}; text-align: center; border-bottom: 1px solid #e9ecef;">
            ${component.props.logo ? `<img src="${component.props.logo}" alt="${component.props.companyName}" style="max-height: 60px; margin-bottom: 10px;" />` : ''}
            <h1 style="margin: 0 0 5px 0; font-size: 24px; color: #333333;">${component.props.companyName || '公司名称'}</h1>
            ${component.props.tagline ? `<p style="margin: 0; font-size: 14px; color: #666666;">${component.props.tagline}</p>` : ''}
        </div>`;

      case 'email-title':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#f8f9fa'}; padding: ${component.props.padding || '30px 20px'}; text-align: ${component.props.textAlign || 'center'};">
            <h2 style="margin: 0 0 10px 0; font-size: ${component.props.fontSize || '24px'}; color: ${component.props.color || '#333333'}; font-weight: bold;">${component.props.title || '邮件标题'}</h2>
            ${component.props.subtitle ? `<p style="margin: 0; font-size: 16px; color: #666666;">${component.props.subtitle}</p>` : ''}
        </div>`;

      case 'email-content':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#ffffff'}; padding: ${component.props.padding || '30px 20px'}; text-align: ${component.props.textAlign || 'left'}; line-height: ${component.props.lineHeight || '1.6'}; color: ${component.props.color || '#333333'};">
            ${component.props.content || '邮件内容'}
        </div>`;

      case 'email-button':
        return `
        <div style="text-align: ${component.props.textAlign || 'center'}; padding: 20px;">
            <a href="${component.props.url || '#'}" style="display: inline-block; background-color: ${component.props.backgroundColor || '#007bff'}; color: ${component.props.textColor || '#ffffff'}; padding: ${component.props.padding || '12px 24px'}; border-radius: ${component.props.borderRadius || '4px'}; font-size: ${component.props.fontSize || '16px'}; text-decoration: none; font-weight: bold; border: none; cursor: pointer;">${component.props.text || '点击按钮'}</a>
        </div>`;

      case 'email-image':
        return `
        <div style="text-align: ${component.props.textAlign || 'center'}; padding: ${component.props.padding || '20px'};">
            <img src="${component.props.src || 'https://via.placeholder.com/600x300'}" alt="${component.props.alt || '图片描述'}" style="width: ${component.props.width || '100%'}; max-width: ${component.props.maxWidth || '600px'}; height: ${component.props.height || 'auto'}; display: block; margin: 0 auto;" />
        </div>`;

      case 'email-banner':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#ff6b6b'}; color: ${component.props.textColor || '#ffffff'}; padding: ${component.props.padding || '40px 20px'}; text-align: ${component.props.textAlign || 'center'};">
            <h2 style="margin: 0 0 10px 0; font-size: ${component.props.fontSize || '20px'}; font-weight: bold;">${component.props.title || '限时优惠'}</h2>
            ${component.props.subtitle ? `<p style="margin: 0; font-size: 16px;">${component.props.subtitle}</p>` : ''}
        </div>`;

      case 'email-product':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#ffffff'}; padding: ${component.props.padding || '20px'}; border: ${component.props.border || '1px solid #e9ecef'}; border-radius: ${component.props.borderRadius || '8px'}; text-align: center;">
            ${component.props.productImage ? `<img src="${component.props.productImage}" alt="${component.props.productName}" style="width: 100%; max-width: 200px; height: auto; margin-bottom: 15px;" />` : ''}
            <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #333333;">${component.props.productName || '产品名称'}</h3>
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #666666; line-height: 1.5;">${component.props.productDescription || '产品描述'}</p>
            <div style="font-size: 20px; font-weight: bold; color: #007bff;">${component.props.productPrice || '¥99.00'}</div>
        </div>`;

      case 'email-footer':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#f8f9fa'}; padding: ${component.props.padding || '20px'}; text-align: ${component.props.textAlign || 'center'}; font-size: ${component.props.fontSize || '12px'}; color: ${component.props.color || '#6c757d'}; border-top: 1px solid #e9ecef;">
            ${component.props.content || '© 2024 公司名称. 保留所有权利.'}
        </div>`;

      case 'email-divider':
        return `
        <div style="width: ${component.props.width || '100%'}; height: ${component.props.height || '1px'}; background-color: ${component.props.color || '#e9ecef'}; margin: ${component.props.margin || '20px 0'};"></div>`;

      case 'email-two-column':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#ffffff'}; padding: ${component.props.padding || '20px'};">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 50%; padding-right: ${component.props.columnGap || '20px'}; vertical-align: top;">
                        ${component.props.leftContent || '左侧内容'}
                    </td>
                    <td style="width: 50%; padding-left: ${component.props.columnGap || '20px'}; vertical-align: top;">
                        ${component.props.rightContent || '右侧内容'}
                    </td>
                </tr>
            </table>
        </div>`;

      case 'email-three-column':
        return `
        <div style="background-color: ${component.props.backgroundColor || '#ffffff'}; padding: ${component.props.padding || '20px'};">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 33.33%; padding-right: ${component.props.columnGap || '15px'}; vertical-align: top;">
                        ${component.props.leftContent || '左侧内容'}
                    </td>
                    <td style="width: 33.33%; padding-left: ${component.props.columnGap || '15px'}; padding-right: ${component.props.columnGap || '15px'}; vertical-align: top;">
                        ${component.props.centerContent || '中间内容'}
                    </td>
                    <td style="width: 33.33%; padding-left: ${component.props.columnGap || '15px'}; vertical-align: top;">
                        ${component.props.rightContent || '右侧内容'}
                    </td>
                </tr>
            </table>
        </div>`;

      case 'email-social': {
        const socialLinks = [
          { name: 'Facebook', url: component.props.facebook, icon: '📘' },
          { name: 'Twitter', url: component.props.twitter, icon: '🐦' },
          { name: 'Instagram', url: component.props.instagram, icon: '📷' },
          { name: 'LinkedIn', url: component.props.linkedin, icon: '💼' },
        ].filter(link => link.url && link.url !== '#');

        const socialHTML = socialLinks.map(link =>
          `<a href="${link.url}" style="display: inline-block; margin: 0 10px; font-size: 24px; text-decoration: none;" title="${link.name}">${link.icon}</a>`,
        ).join('');

        return `
        <div style="background-color: ${component.props.backgroundColor || '#f8f9fa'}; padding: ${component.props.padding || '20px'}; text-align: ${component.props.textAlign || 'center'};">
            ${socialHTML}
        </div>`;
      }

      default:
        return `<div>未知组件类型: ${component.type}</div>`;
    }
  };

  // 初始化代码
  React.useEffect(() => {
    if (visible && !isEditing) {
      const initialHTML = generateInitialHTML();
      setHtmlCode(initialHTML);
      setCssCode(extractCSS(initialHTML));
    }
  }, [visible, state.currentPage, isEditing, generateInitialHTML]);

  // 计算编辑器高度
  React.useEffect(() => {
    if (visible) {
      // 计算可用高度：模态框高度 - 标题 - 标签栏 - 底部工具栏
      const availableHeight = window.innerHeight * 0.85 - 120 - 50 - 60;
      setEditorHeight(Math.max(400, availableHeight));
    }
  }, [visible]);

  // 提取CSS代码
  const extractCSS = (html: string): string => {
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    return styleMatch ? styleMatch[1].trim() : '';
  };

  // 复制代码
  const handleCopyCode = () => {
    const codeToCopy = activeTab === 'html' ? htmlCode : cssCode;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      message.success('代码已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 下载代码
  const handleDownloadCode = () => {
    const codeToDownload = activeTab === 'html' ? htmlCode : cssCode;
    const fileName = activeTab === 'html' ? 'email-template.html' : 'email-styles.css';
    const blob = new Blob([codeToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(`已下载 ${fileName}`);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    setIsEditing(false);
    message.success('编辑已保存');
  };

  // 撤销编辑
  const handleUndoEdit = () => {
    const initialHTML = generateInitialHTML();
    setHtmlCode(initialHTML);
    setCssCode(extractCSS(initialHTML));
    setIsEditing(false);
    message.info('已撤销编辑');
  };

  // 开始编辑
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // 编辑器配置
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: !isEditing,
    cursorStyle: 'line' as const,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    wordWrap: 'on' as const,
    scrollBeyondLastLine: false,
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>
            邮件代码编辑器
          </Title>
          <Space>
            {!isEditing ? (
              <Button icon={<SaveOutlined />} onClick={handleStartEdit}>
                开始编辑
              </Button>
            ) : (
              <>
                <Button icon={<UndoOutlined />} onClick={handleUndoEdit}>
                  撤销
                </Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveEdit}>
                  保存
                </Button>
              </>
            )}
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width="95%"
      style={{ top: 10 }}
      footer={null}
      bodyStyle={{ padding: 0, height: '85vh' }}
    >
      <Row style={{ height: '100%', margin: 0 }}>
        <Col span={16} style={{ height: '100%', padding: 0 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            tabBarStyle={{ margin: 0, padding: '0 16px', flexShrink: 0 }}
          >
            <TabPane tab="HTML代码" key="html" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, border: '1px solid #d9d9d9', minHeight: 0, position: 'relative' }}>
                <Editor
                  height={`${editorHeight}px`}
                  language="html"
                  value={htmlCode}
                  onChange={(value) => setHtmlCode(value || '')}
                  options={editorOptions}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                />
              </div>
            </TabPane>
            <TabPane tab="CSS代码" key="css" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, border: '1px solid #d9d9d9', minHeight: 0, position: 'relative' }}>
                <Editor
                  height={`${editorHeight}px`}
                  language="css"
                  value={cssCode}
                  onChange={(value) => setCssCode(value || '')}
                  options={editorOptions}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                />
              </div>
            </TabPane>
          </Tabs>

          {/* 底部工具栏 */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #d9d9d9',
            backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Space>
              <Button icon={<CopyOutlined />} onClick={handleCopyCode}>
                复制代码
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownloadCode}>
                下载文件
              </Button>
            </Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {isEditing ? '编辑模式' : '只读模式'} | 行数: {htmlCode.split('\n').length}
            </Text>
          </div>
        </Col>

        <Col span={8} style={{ height: '100%', borderLeft: '1px solid #d9d9d9', padding: 0 }}>
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Title level={5} style={{ margin: '0 0 16px 0', flexShrink: 0 }}>邮件预览</Title>
            <div style={{
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              overflow: 'auto',
              flex: 1,
              backgroundColor: '#f4f4f4',
              minHeight: 0,
            }}>
              <iframe
                srcDoc={htmlCode}
                style={{
                  width: '125%',
                  height: '125%',
                  border: 'none',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top left',
                }}
                title="邮件预览"
              />
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};
