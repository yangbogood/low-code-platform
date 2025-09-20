import type { ProjectConfig, PageConfig } from '../types';
import { generateProjectId, generatePageId, generateComponentId } from '../utils/idGenerator';

export const getInitialProject = (t: (key: string) => string): ProjectConfig => {
  const pageId = generatePageId();
  const projectId = generateProjectId();

  console.log('生成的项目ID:', projectId);
  console.log('生成的页面ID:', pageId);

  const initialPage: PageConfig = {
    id: pageId,
    name: t('pages.defaultPageName') || '首页',
    title: t('pages.defaultPageTitle') || '首页',
    components: [
      {
        id: generateComponentId('button'),
        type: 'button',
        name: '测试按钮',
        props: {
          text: '这是一个测试按钮',
          type: 'primary',
        },
      },
      {
        id: generateComponentId('text'),
        type: 'text',
        name: '测试文本',
        props: {
          content: '这是测试文本内容',
          color: '#1890ff',
        },
      },
    ],
  };

  const initialProject: ProjectConfig = {
    id: projectId,
    name: t('project.defaultName') || '我的项目',
    description: t('project.defaultDescription') || '这是一个低代码平台项目',
    pages: [initialPage],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return initialProject;
};
