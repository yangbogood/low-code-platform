import React, { useEffect, useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined, CodeOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEditor, EditorProvider } from '../context/EditorContext';
import { useTheme, ThemeProvider } from '../context/ThemeContext';
import { CodePreviewModal } from '../components/CodePreviewModal';
import { getInitialProject } from '../data/initialProject';
import type { ProjectConfig, PageConfig, ComponentConfig } from '../types';

const { Title } = Typography;

export const PreviewPageSimple: React.FC = () => {
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId?: string }>();
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useEditor();
  const { theme } = useTheme();
  const [codePreviewVisible, setCodePreviewVisible] = useState(false);
  const [previewPage, setPreviewPage] = useState<PageConfig | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig | null>(null);
  const [generatedHTML, setGeneratedHTML] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 解析URL中的组件参数
  useEffect(() => {
    const componentParam = searchParams.get('component');
    if (componentParam) {
      try {
        const component = JSON.parse(decodeURIComponent(componentParam));
        setSelectedComponent(component);
      } catch (error) {
        console.error('Error parsing component from URL:', error);
      }
    }
  }, [searchParams]);

  // 加载页面数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // 优先使用当前编辑器状态
        if (state.currentPage && (!pageId || state.currentPage.id === pageId)) {
          console.log('PreviewPage: Using current page from editor state:', state.currentPage);
          setPreviewPage(state.currentPage);
          setIsLoading(false);
          return;
        }

        // 如果编辑器状态中没有匹配的页面，从本地存储加载
        const savedProject = localStorage.getItem('low-code-project');
        if (savedProject) {
          const project: ProjectConfig = JSON.parse(savedProject);

          if (pageId) {
            const targetPage = project.pages.find(page => page.id === pageId);
            if (targetPage) {
              console.log('PreviewPage: Found target page in localStorage:', targetPage);
              setPreviewPage(targetPage);
              // 更新编辑器状态
              dispatch({ type: 'SET_PROJECT', payload: project });
              dispatch({ type: 'SET_CURRENT_PAGE', payload: targetPage });
            } else if (project.pages.length > 0) {
              console.log('PreviewPage: Page not found, using first page from localStorage');
              setPreviewPage(project.pages[0]);
              dispatch({ type: 'SET_PROJECT', payload: project });
              dispatch({ type: 'SET_CURRENT_PAGE', payload: project.pages[0] });
            }
          } else if (project.pages.length > 0) {
            console.log('PreviewPage: No pageId, using first page from localStorage');
            setPreviewPage(project.pages[0]);
            dispatch({ type: 'SET_PROJECT', payload: project });
            dispatch({ type: 'SET_CURRENT_PAGE', payload: project.pages[0] });
          }
        } else {
          // 没有数据，初始化新项目
          console.log('PreviewPage: No saved data, initializing new project');
          const initialProject = getInitialProject((key: string) => key);
          setPreviewPage(initialProject.pages[0]);
          dispatch({ type: 'SET_PROJECT', payload: initialProject });
          dispatch({ type: 'SET_CURRENT_PAGE', payload: initialProject.pages[0] });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // 出错时也初始化新项目
        const initialProject = getInitialProject((key: string) => key);
        setPreviewPage(initialProject.pages[0]);
        dispatch({ type: 'SET_PROJECT', payload: initialProject });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: initialProject.pages[0] });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pageId, dispatch, state.currentPage]); // 重新添加state.currentPage依赖

  // 监听编辑器状态变化，实时更新预览页面
  useEffect(() => {
    if (state.currentPage && (!pageId || state.currentPage.id === pageId)) {
      console.log('PreviewPage: Editor state changed, updating preview page:', state.currentPage);
      setPreviewPage(state.currentPage);
    }
  }, [state.currentPage, pageId]);

  // 监听整个项目状态变化，确保组件变化能同步到预览页面
  useEffect(() => {
    if (state.project && state.currentPage) {
      // 从项目中找到当前页面，确保获取最新的组件数据
      const updatedPage = state.project.pages.find(page => page.id === state.currentPage?.id);
      if (updatedPage && (!pageId || updatedPage.id === pageId)) {
        console.log('PreviewPage: Project state changed, updating preview page with latest components:', updatedPage);
        setPreviewPage(updatedPage);
      }
    }
  }, [state.project, state.currentPage, pageId]);

  // 生成HTML内容
  useEffect(() => {
    if (selectedComponent) {
      const htmlContent = generateComponentHTML(selectedComponent, theme);
      setGeneratedHTML(htmlContent);
    } else if (previewPage) {
      const htmlContent = generateHTMLPreview(previewPage, theme);
      setGeneratedHTML(htmlContent);
    }
  }, [previewPage, selectedComponent, theme]);

  const handleBack = () => {
    navigate('/');
  };

  const handleGenerateCode = () => {
    setCodePreviewVisible(true);
  };

  const handleInitializeProject = () => {
    const initialProject = getInitialProject((key: string) => key);
    setPreviewPage(initialProject.pages[0]);
    dispatch({ type: 'SET_PROJECT', payload: initialProject });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: initialProject.pages[0] });
  };

  const handleRefreshPreview = () => {
    console.log('PreviewPage: Manual refresh triggered');
    if (state.currentPage && (!pageId || state.currentPage.id === pageId)) {
      console.log('PreviewPage: Refreshing with current page:', state.currentPage);
      setPreviewPage(state.currentPage);
    } else if (state.project && state.project.pages.length > 0) {
      const targetPage = pageId
        ? state.project.pages.find(page => page.id === pageId)
        : state.project.pages[0];
      if (targetPage) {
        console.log('PreviewPage: Refreshing with project page:', targetPage);
        setPreviewPage(targetPage);
      }
    }
  };

  // 生成HTML预览内容
  const generateHTMLPreview = (page: PageConfig, currentTheme: string) => {
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

  // 生成单个组件的HTML
  const generateComponentHTML = (component: ComponentConfig, currentTheme: string) => {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${component.name} 预览</title>
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
        <h1 class="preview-title">${component.name} 预览</h1>
        ${generateHTMLComponents([component])}
    </div>
</body>
</html>`;
  };

  // 生成HTML组件
  const generateHTMLComponents = (components: ComponentConfig[]): string => {
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

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: theme === 'dark' ? '#141414' : '#f5f5f5',
      }}>
        <Title level={2}>加载中...</Title>
      </div>
    );
  }

  if (!previewPage && !selectedComponent) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: theme === 'dark' ? '#141414' : '#f5f5f5',
      }}>
        <Title level={2}>没有可预览的页面</Title>
        <div style={{ marginBottom: '16px', color: theme === 'dark' ? '#999' : '#666' }}>
          <p>页面ID: {pageId || '未指定'}</p>
          <p>当前状态页面: {state.currentPage ? state.currentPage.name : '无'}</p>
          <p>本地存储项目: {localStorage.getItem('low-code-project') ? '存在' : '不存在'}</p>
        </div>
        <Space>
          <Button type="primary" onClick={handleBack}>
            返回编辑器
          </Button>
          <Button type="default" onClick={handleInitializeProject}>
            初始化项目
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#141414' : '#f5f5f5',
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
        borderBottom: `1px solid ${theme === 'dark' ? '#434343' : '#f0f0f0'}`,
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
            >
              返回编辑器
            </Button>
            <Title level={4} style={{ margin: 0, color: theme === 'dark' ? '#ffffff' : '#262626' }}>
              {selectedComponent
                ? `${selectedComponent.name} 组件预览`
                : previewPage ? `${previewPage.name} (组件数量: ${previewPage.components.length})` : '预览页面'
              }
            </Title>
          </Space>

          <Space>
            <Button
              icon={<CodeOutlined />}
              onClick={handleRefreshPreview}
            >
              刷新预览
            </Button>
            <Button
              type="primary"
              icon={<CodeOutlined />}
              onClick={handleGenerateCode}
            >
              生成代码
            </Button>
          </Space>
        </div>
      </div>

      {/* 预览内容区域 */}
      <div
        style={{
          padding: '24px',
          backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {selectedComponent ? (
            <div
              style={{
                border: `1px solid ${theme === 'dark' ? '#434343' : '#d9d9d9'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
              }}
            >
              <iframe
                srcDoc={generatedHTML}
                style={{
                  width: '100%',
                  height: '400px',
                  border: 'none',
                  backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
                }}
                title={`${selectedComponent.name} 组件预览`}
              />
            </div>
          ) : previewPage && previewPage.components.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: theme === 'dark' ? '#999' : '#666',
              fontSize: '16px',
              border: `2px dashed ${theme === 'dark' ? '#434343' : '#d9d9d9'}`,
              borderRadius: '8px',
            }}>
              暂无组件内容
            </div>
          ) : (
            <div
              style={{
                border: `1px solid ${theme === 'dark' ? '#434343' : '#d9d9d9'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
              }}
            >
              <iframe
                srcDoc={generatedHTML}
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                  backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
                }}
                title={previewPage ? `${previewPage.name} 预览` : '页面预览'}
              />
            </div>
          )}
        </div>
      </div>

      {/* 代码预览模态框 */}
      <CodePreviewModal
        visible={codePreviewVisible}
        onClose={() => setCodePreviewVisible(false)}
      />
    </div>
  );
};

// PreviewPage包装器，提供必要的Context
export const PreviewPageWrapper: React.FC = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <PreviewPageSimple />
      </EditorProvider>
    </ThemeProvider>
  );
};
