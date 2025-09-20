// 低代码平台核心类型定义

export interface ComponentConfig {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children?: ComponentConfig[];
  style?: React.CSSProperties;
}

export interface ComponentMeta {
  type: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  defaultProps: Record<string, any>;
  propTypes: PropType[];
}

export interface PropType {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'object';
  label: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  required?: boolean;
}

export interface PageConfig {
  id: string;
  name: string;
  title: string;
  components: ComponentConfig[];
  globalStyle?: React.CSSProperties;
}

export interface ProjectConfig {
  id: string;
  name: string;
  description: string;
  pages: PageConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface DragItem {
  type: string;
  componentType: string;
  data?: any;
}

export interface DropResult {
  component: ComponentConfig;
  position: { x: number; y: number };
  parentId?: string;
}

// 组件库类型
export interface ComponentLibrary {
  category: string;
  components: ComponentMeta[];
}

// 代码生成选项
export interface CodeGenOptions {
  framework: 'react' | 'vue' | 'angular';
  style: 'css' | 'scss' | 'styled-components' | 'tailwind';
  typescript: boolean;
  exportType: 'component' | 'page' | 'project';
}
