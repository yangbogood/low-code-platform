import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, message } from 'antd';
import { ArrowLeftOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorProvider } from '../context/EditorContext';
import { useTheme, ThemeProvider } from '../context/ThemeContext';
import { EmailComponentLibrary } from '../components/EmailComponentLibrary';
import { EmailCanvas } from '../components/EmailCanvas';
import { EmailPropertyPanel } from '../components/EmailPropertyPanel';
import { emailTemplates, emailComponents } from '../data/emailComponents';
import type { ComponentConfig } from '../types';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const EmailTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useEditor();
  const { theme } = useTheme();
  const [_selectedComponent, setSelectedComponent] = useState<ComponentConfig | null>(null);

  // 确保项目已初始化
  useEffect(() => {
    if (!state.project) {
      // 创建一个基本的邮件模板项目
      const initialProject = {
        id: 'email-project',
        name: '邮件模板项目',
        description: '邮件模板编辑器项目',
        pages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({
        type: 'SET_PROJECT',
        payload: initialProject,
      });
    }
  }, [state.project, dispatch]);

  const handleDragStart = (component: ComponentConfig) => {
    setSelectedComponent(component);
  };

  const handleTemplateSelect = (template: typeof emailTemplates[0]) => {
    if (!state.project) {
      message.error('请先创建项目');
      return;
    }

    // 创建基于模板的新页面
    const templateComponents: ComponentConfig[] = template.components.map((componentType, index) => {
      // 从emailComponents中找到对应的组件配置
      const baseComponent = emailComponents.find(comp => comp.type === componentType);

      if (baseComponent) {
        // 使用基础组件的配置，但生成新的ID
        return {
          ...baseComponent,
          id: `component_${Date.now()}_${index}`,
        };
      } else {
        // 如果找不到对应的组件，创建一个基本的组件结构
        return {
          id: `component_${Date.now()}_${index}`,
          type: componentType,
          name: `模板组件 ${index + 1}`,
          props: {},
          children: [],
        };
      }
    });

    const newPage = {
      id: `page_${Date.now()}`,
      name: template.name,
      title: template.name,
      components: templateComponents,
    };

    const updatedProject = {
      ...state.project,
      pages: [...state.project.pages, newPage],
    };

    dispatch({
      type: 'SET_PROJECT',
      payload: updatedProject,
    });

    dispatch({
      type: 'SET_CURRENT_PAGE',
      payload: newPage,
    });

    message.success(`已应用 ${template.name} 模板`);
  };

  const handlePreview = (selectedComponent?: ComponentConfig | null) => {
    if (selectedComponent) {
      // 预览选中的组件
      const componentData = encodeURIComponent(JSON.stringify(selectedComponent));
      navigate(`/preview/email-component?component=${componentData}`);
    } else if (state.currentPage) {
      // 预览整个邮件模板
      navigate(`/preview/email-template/${state.currentPage.id}`);
    } else {
      navigate('/preview/email-template');
    }
  };

  const handleUpdateComponent = (id: string, props: Record<string, any>) => {
    if (!state.currentPage || !state.project) {return;}

    const updatedComponents = state.currentPage.components.map(comp =>
      comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp,
    );

    const updatedPage = {
      ...state.currentPage,
      components: updatedComponents,
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

    message.success('组件属性已更新');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{  display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 */}
      <Header style={{
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
        borderBottom: `1px solid ${theme === 'dark' ? '#434343' : '#f0f0f0'}`,
        padding: '0 24px',
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
            <MailOutlined style={{ marginRight: '8px' }} />
            邮件模板编辑器
          </Title>
        </Space>

        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              // 创建新的邮件模板页面
              if (state.project) {
                const newPage = {
                  id: `page_${Date.now()}`,
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

                dispatch({
                  type: 'SET_CURRENT_PAGE',
                  payload: newPage,
                });

                message.success('已创建新的邮件模板');
              }
            }}
          >
            新建模板
          </Button>
        </Space>
      </Header>

      {/* 主要内容区域 */}
      <Layout style={{ flex: 1 }}>
        {/* 左侧组件库 */}
        <Sider
          width={300}
          style={{
            backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
            borderRight: `1px solid ${theme === 'dark' ? '#434343' : '#f0f0f0'}`,
          }}
        >
          <EmailComponentLibrary
            onDragStart={handleDragStart}
            onTemplateSelect={handleTemplateSelect}
          />
        </Sider>

        {/* 中间画布区域 */}
        <Content style={{ backgroundColor: theme === 'dark' ? '#141414' : '#f5f5f5' }}>
          <EmailCanvas onPreview={handlePreview} />
        </Content>

        {/* 右侧属性面板 */}
        <Sider
          width={300}
          style={{
            backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
            borderLeft: `1px solid ${theme === 'dark' ? '#434343' : '#f0f0f0'}`,
          }}
        >
          <EmailPropertyPanel
            selectedComponent={state.selectedComponent}
            onUpdateComponent={handleUpdateComponent}
          />
        </Sider>
      </Layout>
    </div>
  );
};

// 邮件模板页面包装器
export const EmailTemplatePageWrapper: React.FC = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <EmailTemplatePage />
      </EditorProvider>
    </ThemeProvider>
  );
};
