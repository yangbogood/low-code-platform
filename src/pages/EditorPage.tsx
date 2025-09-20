import React, { useEffect } from 'react';
import { Layout, Button, Space, Typography, message, ConfigProvider, theme } from 'antd';
import { SaveOutlined, UndoOutlined, RedoOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EditorProvider, useEditor } from '../context/EditorContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ComponentLibrary } from '../components/ComponentLibrary';
import { Canvas } from '../components/Canvas';
import { PropertyPanel } from '../components/PropertyPanel';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { getComponentLibraries } from '../data/componentLibraryI18n';
import { getInitialProject } from '../data/initialProject';
import type { ProjectConfig, ComponentConfig } from '../types';
import '../styles/components.scss';
import '../styles/themes.scss';
import '../styles/antd-overrides.scss';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// 主编辑器组件
const Editor: React.FC = () => {
  const { state, dispatch } = useEditor();
  const { theme: _currentTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Ant Design 主题配置（始终保持正常模式）
  const antdTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#f5222d',
      colorInfo: '#1890ff',
      colorBgBase: '#ffffff',
      colorTextBase: '#262626',
      colorBorder: '#d9d9d9',
      borderRadius: 6,
    },
  };

  // 初始化项目数据
  useEffect(() => {
    const initialProject = getInitialProject(t);
    dispatch({
      type: 'SET_PROJECT',
      payload: initialProject,
    });
  }, [dispatch, t]);

  // 从本地存储加载项目
  useEffect(() => {
    const savedProject = localStorage.getItem('low-code-project');
    if (savedProject) {
      try {
        const project: ProjectConfig = JSON.parse(savedProject);

        // 检查是否是旧的简单ID格式，如果是则清除并重新生成
        const hasOldFormat = project.pages.some(page =>
          page.id === 'page-1' ||
          page.id === 'page_1' ||
          page.id === 'page_1' ||
          /^page_1$/.test(page.id) ||
          /^page-1$/.test(page.id),
        );

        if (hasOldFormat) {
          console.log('检测到旧的页面ID格式，清除本地存储并重新生成...');
          localStorage.removeItem('low-code-project');
          // 重新初始化项目
          const initialProject = getInitialProject(t);
          dispatch({
            type: 'SET_PROJECT',
            payload: initialProject,
          });
        } else {
          dispatch({
            type: 'SET_PROJECT',
            payload: project,
          });
        }
      } catch {
        // 静默处理错误
      }
    }
  }, [dispatch, t]);

  const handleDragStart = (_component: unknown) => {
    // 拖拽开始时的处理
    // 组件拖拽开始
  };

  const handlePreview = (selectedComponent?: ComponentConfig | null) => {
    if (state.currentPage) {
      // 如果有选中的组件，将组件信息编码到URL中
      if (selectedComponent) {
        const componentData = encodeURIComponent(JSON.stringify(selectedComponent));
        navigate(`/preview/${state.currentPage.id}?component=${componentData}`);
      } else {
        navigate(`/preview/${state.currentPage.id}`);
      }
    } else {
      navigate('/preview');
    }
  };

  // 移除handleGenerateCode，现在由Canvas组件内部处理

  const handleSave = () => {
    // 保存项目到本地存储
    if (state.project) {
      localStorage.setItem('low-code-project', JSON.stringify(state.project));
      message.success(t('messages.projectSaved'));
    }
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const componentLibraries = getComponentLibraries(t);

  return (
    <ConfigProvider theme={antdTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        {/* 顶部工具栏 */}
        <Header className="toolbar">
          <div className="toolbar-content">
            <Title className="toolbar-title" level={3}>
              {t('app.title')}
            </Title>
            <Space className="toolbar-actions">
              <Button icon={<UndoOutlined />} onClick={handleUndo}>
                {t('common.undo')}
              </Button>
              <Button icon={<RedoOutlined />} onClick={handleRedo}>
                {t('common.redo')}
              </Button>
              <Button icon={<SaveOutlined />} onClick={handleSave}>
                {t('common.save')}
              </Button>
              <Button
                type="primary"
                icon={<MailOutlined />}
                onClick={() => navigate('/email-template')}
              >
                邮件模板编辑器
              </Button>
              <LanguageSwitch />
              <ThemeSwitch />
            </Space>
          </div>
        </Header>

        <Layout>
          {/* 左侧组件库 */}
          <Sider className="sidebar sidebar--left" width={300}>
            <ComponentLibrary
              libraries={componentLibraries}
              onDragStart={handleDragStart}
            />
          </Sider>

          {/* 中间画布区域 */}
          <Content style={{ background: 'var(--canvas-bg)' }}>
            <Canvas
              onPreview={handlePreview}
            />
          </Content>

          {/* 右侧属性面板 */}
          <Sider className="sidebar sidebar--right" width={300}>
            <PropertyPanel component={state.selectedComponent} />
          </Sider>
        </Layout>

      </Layout>
    </ConfigProvider>
  );
};

export const EditorPage: React.FC = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </ThemeProvider>
  );
};
