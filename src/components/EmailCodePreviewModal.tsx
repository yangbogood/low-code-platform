import React, { useState } from 'react';
import { Modal, Tabs, Button, Space, Typography, message } from 'antd';
import { DownloadOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons';
import { useEditor } from '../context/EditorContext';
import { useTheme } from '../context/ThemeContext';
// import { renderEmailComponent } from './EmailComponents';
import type { ComponentConfig } from '../types';

const { TabPane } = Tabs;
const { Title } = Typography;

interface EmailCodePreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EmailCodePreviewModal: React.FC<EmailCodePreviewModalProps> = ({
  visible,
  onClose,
}) => {
  const { state } = useEditor();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('html');

  const generateEmailHTML = (): string => {
    if (!state.currentPage) {
      return '';
    }

    const components = state.currentPage.components;
    const componentsHTML = components
      .map(component => {
        // 这里需要将React元素转换为HTML字符串
        // 为了简化，我们直接生成HTML
        return generateComponentHTML(component);
      })
      .join('\n');

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
  };

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

        return `
        <div style="background-color: ${component.props.backgroundColor || '#f8f9fa'}; padding: ${component.props.padding || '20px'}; text-align: ${component.props.textAlign || 'center'};">
            ${socialLinks.map(link => `<a href="${link.url}" style="display: inline-block; margin: 0 10px; font-size: 24px; text-decoration: none;" title="${link.name}">${link.icon}</a>`).join('')}
        </div>`;
      }

      default:
        return `<div>未知组件: ${component.type}</div>`;
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        message.success('代码已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败');
      });
  };

  const handleDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('文件已下载');
  };

  const generatedHTML = generateEmailHTML();

  return (
    <Modal
      title="邮件代码预览"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button
          key="preview"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            const newWindow = window.open('', '_blank');
            if (newWindow) {
              newWindow.document.write(generatedHTML);
              newWindow.document.close();
            }
          }}
        >
          预览邮件
        </Button>,
      ]}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="HTML 邮件代码" key="html">
          <div style={{ marginBottom: '16px' }}>
            <Space>
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleCopy(generatedHTML)}
              >
                复制代码
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  handleDownload(
                    generatedHTML,
                    `${state.currentPage?.name || 'email'}.html`,
                    'text/html'
                  )
                }
              >
                下载 HTML
              </Button>
            </Space>
          </div>
          <pre
            style={{
              backgroundColor: theme === 'dark' ? '#1f1f1f' : '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '500px',
              fontSize: '12px',
              lineHeight: '1.4',
            }}
          >
            <code>{generatedHTML}</code>
          </pre>
        </TabPane>

        <TabPane tab="邮件预览" key="preview">
          <div
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              overflow: 'hidden',
              maxHeight: '600px',
              overflowY: 'auto',
            }}
          >
            <iframe
              srcDoc={generatedHTML}
              style={{
                width: '100%',
                height: '600px',
                border: 'none',
              }}
              title="邮件预览"
            />
          </div>
        </TabPane>

        <TabPane tab="使用说明" key="instructions">
          <div style={{ padding: '20px' }}>
            <Title level={4}>邮件模板使用说明</Title>
            <div style={{ lineHeight: '1.6' }}>
              <h5>1. 邮件客户端兼容性</h5>
              <ul>
                <li>生成的HTML代码已针对主流邮件客户端进行优化</li>
                <li>支持 Outlook、Gmail、Apple Mail 等客户端</li>
                <li>使用表格布局确保跨客户端兼容性</li>
              </ul>

              <h5>2. 响应式设计</h5>
              <ul>
                <li>邮件模板支持移动设备查看</li>
                <li>在小屏幕设备上自动调整布局</li>
                <li>图片和文字大小自适应</li>
              </ul>

              <h5>3. 导出和使用</h5>
              <ul>
                <li>下载HTML文件可直接用于邮件发送</li>
                <li>复制代码可粘贴到邮件营销平台</li>
                <li>建议在发送前进行测试预览</li>
              </ul>

              <h5>4. 注意事项</h5>
              <ul>
                <li>图片链接需要是公开可访问的URL</li>
                <li>避免使用过于复杂的CSS样式</li>
                <li>建议使用Web安全字体</li>
                <li>测试不同邮件客户端的显示效果</li>
              </ul>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};
