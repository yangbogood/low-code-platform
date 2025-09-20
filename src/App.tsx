import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, message, ConfigProvider, theme } from 'antd';
import { SaveOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { EditorProvider, useEditor } from './context/EditorContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ComponentLibrary } from './components/ComponentLibrary';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { PreviewModal } from './components/PreviewModal';
import { ThemeSwitch } from './components/ThemeSwitch';
import { LanguageSwitch } from './components/LanguageSwitch';
import { getComponentLibraries } from './data/componentLibraryI18n';
import type { ProjectConfig } from './types';
import './styles/components.scss';
import './styles/themes.scss';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// 主编辑器组件
const Editor: React.FC = () => {
  const { state, dispatch } = useEditor();
  const { theme: currentTheme } = useTheme();
  const { t } = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);

  // Ant Design 主题配置
  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: currentTheme === 'dark' ? '#177ddc' : '#1890ff',
      colorBgBase: currentTheme === 'dark' ? '#141414' : '#ffffff',
      colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#262626' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#434343' : '#d9d9d9',
      colorBorderSecondary: currentTheme === 'dark' ? '#303030' : '#f0f0f0',
      colorText: currentTheme === 'dark' ? '#ffffff' : '#262626',
      colorTextSecondary: currentTheme === 'dark' ? '#a6a6a6' : '#595959',
      colorTextTertiary: currentTheme === 'dark' ? '#595959' : '#bfbfbf',
      colorTextQuaternary: currentTheme === 'dark' ? '#434343' : '#d9d9d9',
      colorFill: currentTheme === 'dark' ? '#262626' : '#f5f5f5',
      colorFillSecondary: currentTheme === 'dark' ? '#1f1f1f' : '#fafafa',
      colorFillTertiary: currentTheme === 'dark' ? '#141414' : '#f0f0f0',
      colorFillQuaternary: currentTheme === 'dark' ? '#0f0f0f' : '#e6f7ff',
      borderRadius: 6,
      wireframe: false,
    },
    components: {
      Layout: {
        bodyBg: currentTheme === 'dark' ? '#141414' : '#f5f5f5',
        headerBg: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        siderBg: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      Card: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBorderSecondary: currentTheme === 'dark' ? '#303030' : '#f0f0f0',
      },
      Button: {
        colorPrimary: currentTheme === 'dark' ? '#177ddc' : '#1890ff',
        colorPrimaryHover: currentTheme === 'dark' ? '#3c9be8' : '#40a9ff',
        colorPrimaryActive: currentTheme === 'dark' ? '#0958d9' : '#096dd9',
      },
      Input: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBorder: currentTheme === 'dark' ? '#434343' : '#d9d9d9',
        colorText: currentTheme === 'dark' ? '#ffffff' : '#262626',
        colorTextPlaceholder: currentTheme === 'dark' ? '#595959' : '#bfbfbf',
      },
      Select: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBorder: currentTheme === 'dark' ? '#434343' : '#d9d9d9',
        colorText: currentTheme === 'dark' ? '#ffffff' : '#262626',
        colorTextPlaceholder: currentTheme === 'dark' ? '#595959' : '#bfbfbf',
      },
      Form: {
        labelColor: currentTheme === 'dark' ? '#ffffff' : '#262626',
      },
      Typography: {
        colorText: currentTheme === 'dark' ? '#ffffff' : '#262626',
        colorTextSecondary: currentTheme === 'dark' ? '#a6a6a6' : '#595959',
      },
      Modal: {
        contentBg: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        headerBg: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      Drawer: {
        colorBgElevated: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      Popover: {
        colorBgElevated: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      Tooltip: {
        colorBgSpotlight: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      Dropdown: {
        colorBgElevated: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      Menu: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorItemBg: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorItemBgSelected: currentTheme === 'dark' ? '#111b26' : '#e6f7ff',
        colorItemBgHover: currentTheme === 'dark' ? '#111b26' : '#f5f5f5',
        colorItemText: currentTheme === 'dark' ? '#a6a6a6' : '#595959',
        colorItemTextSelected: currentTheme === 'dark' ? '#177ddc' : '#1890ff',
        colorItemTextHover: currentTheme === 'dark' ? '#177ddc' : '#1890ff',
      },
      Table: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBorderSecondary: currentTheme === 'dark' ? '#303030' : '#f0f0f0',
        colorText: currentTheme === 'dark' ? '#ffffff' : '#262626',
        colorTextHeading: currentTheme === 'dark' ? '#ffffff' : '#262626',
        headerBg: currentTheme === 'dark' ? '#141414' : '#fafafa',
        rowHoverBg: currentTheme === 'dark' ? '#111b26' : '#f5f5f5',
      },
      Divider: {
        colorSplit: currentTheme === 'dark' ? '#303030' : '#f0f0f0',
      },
      Switch: {
        colorPrimary: currentTheme === 'dark' ? '#177ddc' : '#1890ff',
        colorPrimaryHover: currentTheme === 'dark' ? '#3c9be8' : '#40a9ff',
      },
      ColorPicker: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBorder: currentTheme === 'dark' ? '#434343' : '#d9d9d9',
      },
    },
  };

  // 初始化项目
  useEffect(() => {
    if (!state.project) {
      const initialProject: ProjectConfig = {
        id: 'project_1',
        name: t('app.projectName'),
        description: t('app.description'),
        pages: [
          {
            id: 'page_1',
            name: t('app.homePage'),
            title: t('app.welcomePage'),
            components: [],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({
        type: 'SET_PROJECT',
        payload: initialProject,
      });
    }
  }, [state.project, dispatch]);

  const handleDragStart = (component: any) => {
    // 拖拽开始时的处理
    console.log(t('messages.dragStart'), component);
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleGenerateCode = () => {
    message.success(t('messages.codeGenerated'));
    setPreviewVisible(true);
  };

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

  return (
    <ConfigProvider theme={antdTheme}>
      <Layout className={`low-code-platform theme-${currentTheme}`} style={{ height: '100vh' }}>
        {/* 顶部工具栏 */}
        <Header className="toolbar">
          <Title className="toolbar-title" level={3} style={{ margin: 0 }}>
            🚀 {t('toolbar.title')}
          </Title>
          <Space className="toolbar-actions">
            <Button
              icon={<UndoOutlined />}
              onClick={handleUndo}
              disabled={state.history.past.length === 0}
            >
              {t('toolbar.undo')}
            </Button>
            <Button
              icon={<RedoOutlined />}
              onClick={handleRedo}
              disabled={state.history.future.length === 0}
            >
              {t('toolbar.redo')}
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              type="primary"
            >
              {t('toolbar.save')}
            </Button>
            <ThemeSwitch type="icon" size="middle" />
            <LanguageSwitch type="icon" size="middle" />
          </Space>
        </Header>

        <Layout className="layout-container">
          {/* 左侧组件库 */}
          <Sider className="sidebar sidebar--left" width={280}>
            <ComponentLibrary
              libraries={getComponentLibraries(t)}
              onDragStart={handleDragStart}
            />
          </Sider>

          {/* 中间画布区域 */}
          <Content style={{ background: 'var(--canvas-bg)' }}>
            <Canvas
              onPreview={handlePreview}
              onGenerateCode={handleGenerateCode}
            />
          </Content>

          {/* 右侧属性面板 */}
          <Sider className="sidebar sidebar--right" width={300}>
            <PropertyPanel component={state.selectedComponent} />
          </Sider>
        </Layout>

        {/* 预览模态框 */}
        <PreviewModal
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
        />
      </Layout>
    </ConfigProvider>
  );
};

// 主应用组件
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </ThemeProvider>
  );
};

export default App;
