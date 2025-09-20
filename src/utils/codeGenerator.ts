import type { ProjectConfig, ComponentConfig, CodeGenOptions, PageConfig } from '../types';

export class CodeGenerator {
  private options: CodeGenOptions;

  constructor(options: CodeGenOptions) {
    this.options = options;
  }

  generateProject(project: ProjectConfig): string {
    const { framework, typescript } = this.options;

    if (framework === 'react') {
      return this.generateReactProject(project, typescript);
    }

    return '不支持的框架类型';
  }

  private generateReactProject(project: ProjectConfig, typescript: boolean): string {
    const ext = typescript ? 'tsx' : 'jsx';

    let code = '';

    // 生成主应用文件
    code += this.generateReactApp(project, ext);
    code += '\n\n';

    // 生成页面组件
    project.pages.forEach((page, index) => {
      code += this.generateReactPage(page, ext, index);
      code += '\n\n';
    });

    // 生成组件文件
    code += this.generateReactComponents();

    return code;
  }

  private generateReactApp(project: ProjectConfig, ext: string): string {
    const { typescript } = this.options;

    return `// App.${ext}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
${typescript ? "import './App.css';" : "import './App.css';"}

${typescript ? 'interface AppProps {}' : ''}

const App${typescript ? ': React.FC<AppProps>' : ''} = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          ${project.pages.map((page, index) =>
    `<Route path="${index === 0 ? '/' : `/${page.id}`}" element={<Page${index} />} />`,
  ).join('\n          ')}
        </Routes>
      </div>
    </Router>
  );
};

export default App;`;
  }

  private generateReactPage(page: PageConfig, ext: string, index: number): string {
    const { typescript } = this.options;

    return `// Page${index}.${ext}
import React from 'react';
${typescript ? "import './Page" + index + ".css';" : "import './Page" + index + ".css';"}

${typescript ? 'interface Page' + index + 'Props {}' : ''}

const Page${index}${typescript ? ': React.FC<Page' + index + 'Props>' : ''} = () => {
  return (
    <div className="page-${index}">
      ${this.generateComponentJSX(page.components, 0)}
    </div>
  );
};

export default Page${index};`;
  }

  private generateComponentJSX(components: ComponentConfig[], depth: number = 0): string {
    const indent = '  '.repeat(depth + 2);

    return components.map(component => {
      const props = this.generateProps(component.props);
      const children = component.children && component.children.length > 0
        ? `\n${this.generateComponentJSX(component.children, depth + 1)}\n${indent}`
        : '';

      switch (component.type) {
        case 'button':
          return `${indent}<button${props}>${component.props.text || '按钮'}</button>`;
        case 'input':
          return `${indent}<input${props} />`;
        case 'text':
          return `${indent}<span${props}>${component.props.content || '文本'}</span>`;
        case 'title': {
          const level = component.props.level || 1;
          return `${indent}<h${level}${props}>${component.props.content || '标题'}</h${level}>`;
        }
        case 'paragraph':
          return `${indent}<p${props}>${component.props.content || '段落'}</p>`;
        case 'card':
          return `${indent}<div className="card"${props}>
${indent}  <div className="card-header">${component.props.title || '卡片标题'}</div>
${indent}  <div className="card-body">${children || component.props.content || '卡片内容'}</div>
${indent}</div>`;
        case 'space':
          return `${indent}<div className="space"${props}>${children}</div>`;
        case 'image':
          return `${indent}<img${props} alt="${component.props.alt || '图片'}" />`;
        case 'container':
          return `${indent}<div className="container"${props}>${children}</div>`;
        default:
          return `${indent}<div${props}>${children || '未知组件'}</div>`;
      }
    }).join('\n');
  }

  private generateProps(props: Record<string, any>): string {
    const propStrings: string[] = [];

    Object.entries(props).forEach(([key, value]) => {
      if (key === 'text' || key === 'content' || key === 'title') {return;} // 这些属性已经在JSX中处理

      if (typeof value === 'string') {
        propStrings.push(`${key}="${value}"`);
      } else if (typeof value === 'boolean') {
        if (value) {propStrings.push(key);}
      } else if (typeof value === 'number') {
        propStrings.push(`${key}={${value}}`);
      } else if (typeof value === 'object') {
        propStrings.push(`${key}={${JSON.stringify(value)}}`);
      }
    });

    return propStrings.length > 0 ? ' ' + propStrings.join(' ') : '';
  }

  private generateReactComponents(): string {
    // 这里可以生成可复用的组件
    return `// 可复用组件可以在这里定义
// 例如：Button, Input, Card 等通用组件`;
  }

  generateCSS(): string {
    const { style } = this.options;

    if (style === 'tailwind') {
      return this.generateTailwindCSS();
    }

    if (style === 'scss') {
      return this.generateSCSS();
    }

    return this.generateRegularCSS();
  }

  private generateRegularCSS(): string {
    return `/* 全局样式 */
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* 页面样式 */
.page-0 {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 组件样式 */
.card {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
}

.card-body {
  padding: 16px 24px;
}

.space {
  display: flex;
  gap: 8px;
}

.space.vertical {
  flex-direction: column;
}

.container {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}`;
  }

  private generateSCSS(): string {
    return `// SCSS 样式文件
// 变量定义
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$text-color: #262626;
$text-color-secondary: #595959;
$border-color: #d9d9d9;
$border-color-light: #f0f0f0;
$background-color: #fafafa;
$background-color-light: #ffffff;
$border-radius: 6px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin card-base {
  background: $background-color-light;
  border: 1px solid $border-color-light;
  border-radius: $border-radius;
  box-shadow: $shadow-sm;
  transition: all 0.2s ease;
}

// 全局样式
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: $background-color;
  color: $text-color;
}

// 页面样式
.page-0 {
  padding: $spacing-lg;
  max-width: 1200px;
  margin: 0 auto;
}

// 组件样式
.card {
  @include card-base;
  
  &-header {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color-light;
    font-weight: 500;
  }
  
  &-body {
    padding: $spacing-md $spacing-lg;
  }
}

.space {
  display: flex;
  gap: $spacing-sm;
  
  &.vertical {
    flex-direction: column;
  }
}

.container {
  padding: $spacing-md;
  background: $background-color;
  border-radius: 4px;
}

// 按钮样式
button {
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background: $background-color-light;
  color: $text-color;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: $primary-color;
    color: $primary-color;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

// 输入框样式
input {
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background: $background-color-light;
  color: $text-color;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-0 {
    padding: $spacing-md;
  }
  
  .card {
    &-header,
    &-body {
      padding: $spacing-sm $spacing-md;
    }
  }
}`;
  }

  private generateTailwindCSS(): string {
    return `/* Tailwind CSS 配置 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义组件样式 */
@layer components {
  .card {
    @apply border border-gray-200 rounded-lg bg-white shadow-sm;
  }
  
  .card-header {
    @apply px-6 py-4 border-b border-gray-100 font-medium;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
  
  .space {
    @apply flex gap-2;
  }
  
  .space.vertical {
    @apply flex-col;
  }
  
  .container {
    @apply p-4 bg-gray-50 rounded;
  }
}`;
  }
}
