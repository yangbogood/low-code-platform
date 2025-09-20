# 🚀 低代码平台

基于 Vite + React + TypeScript 构建的现代化低代码平台，支持拖拽式组件编辑、实时预览和代码生成。

## ✨ 功能特性

### 🎨 可视化编辑
- **拖拽式组件编辑** - 从组件库拖拽组件到画布进行设计
- **实时预览** - 所见即所得的编辑体验
- **属性配置** - 右侧属性面板实时配置组件属性
- **组件选择** - 点击组件进行选择和编辑

### 🧩 丰富的组件库
- **基础组件** - 按钮、输入框、文本、标题、段落
- **布局组件** - 容器、卡片、间距
- **媒体组件** - 图片
- **可扩展** - 支持自定义组件扩展

### 💻 代码生成
- **React 代码生成** - 生成完整的 React + TypeScript 代码
- **CSS 样式生成** - 支持普通 CSS 和 Tailwind CSS
- **文件下载** - 一键下载生成的代码文件

### 🔧 编辑器功能
- **撤销/重做** - 支持操作历史管理
- **项目保存** - 本地存储项目数据
- **多页面支持** - 支持创建和管理多个页面
- **主题切换** - 支持正常模式和暗黑模式一键切换

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design
- **状态管理**: React Context + useReducer
- **拖拽功能**: HTML5 Drag & Drop API
- **代码生成**: 自定义代码生成器
- **样式系统**: SCSS + CSS 变量
- **主题系统**: 支持正常/暗黑模式切换

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── Canvas.tsx      # 画布组件
│   ├── ComponentLibrary.tsx  # 组件库
│   ├── ComponentItem.tsx     # 组件项
│   ├── PropertyPanel.tsx     # 属性面板
│   ├── RenderComponent.tsx   # 组件渲染器
│   ├── PreviewModal.tsx      # 预览模态框
│   └── ThemeSwitch.tsx       # 主题切换组件
├── context/            # React Context
│   ├── EditorContext.tsx     # 编辑器状态管理
│   └── ThemeContext.tsx      # 主题状态管理
├── data/               # 静态数据
│   └── componentLibrary.ts   # 组件库配置
├── styles/             # SCSS 样式文件
│   ├── variables.scss  # SCSS 变量
│   ├── mixins.scss     # SCSS Mixins
│   ├── themes.scss     # 主题样式
│   ├── components.scss # 组件样式
│   └── animations.scss # 动画效果
├── types/              # TypeScript 类型定义
│   └── index.ts        # 核心类型
├── utils/              # 工具函数
│   └── codeGenerator.ts      # 代码生成器
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 🎯 核心概念

### 组件配置 (ComponentConfig)
```typescript
interface ComponentConfig {
  id: string;                    // 组件唯一标识
  type: string;                  // 组件类型
  name: string;                  // 组件名称
  props: Record<string, any>;    // 组件属性
  children?: ComponentConfig[];  // 子组件
  style?: React.CSSProperties;   // 自定义样式
}
```

### 项目配置 (ProjectConfig)
```typescript
interface ProjectConfig {
  id: string;           // 项目唯一标识
  name: string;         // 项目名称
  description: string;  // 项目描述
  pages: PageConfig[];  // 页面列表
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
}
```

## 🔧 自定义组件

### 1. 定义组件元数据
```typescript
const customComponent: ComponentMeta = {
  type: 'custom-button',
  name: '自定义按钮',
  icon: '🎯',
  category: '自定义组件',
  description: '自定义按钮组件',
  defaultProps: {
    text: '自定义按钮',
    color: '#1890ff'
  },
  propTypes: [
    { name: 'text', type: 'string', label: '按钮文本', required: true },
    { name: 'color', type: 'color', label: '按钮颜色' }
  ]
};
```

### 2. 在 RenderComponent 中添加渲染逻辑
```typescript
case 'custom-button':
  return (
    <button
      style={{ ...baseStyle, backgroundColor: comp.props.color }}
      onClick={onClick}
    >
      {comp.props.text}
    </button>
  );
```

### 3. 注册到组件库
```typescript
// 在 componentLibrary.ts 中添加
{
  category: '自定义组件',
  components: [customComponent]
}
```

## 🎨 样式定制

### SCSS 样式系统
项目使用 SCSS 模块化样式系统：

- `variables.scss` - 全局变量定义
- `mixins.scss` - 可复用的 Mixins
- `themes.scss` - 主题样式系统
- `components.scss` - 组件样式
- `animations.scss` - 动画效果

### 主题定制
支持正常模式和暗黑模式的主题切换：

```typescript
import { ThemeProvider } from './context/ThemeContext';

// 使用主题提供者
<ThemeProvider>
  <App />
</ThemeProvider>

// 在组件中使用主题
const { theme, toggleTheme } = useTheme();
```

### CSS 变量系统
使用 CSS 自定义属性实现主题切换：

```scss
:root {
  --primary-color: #1890ff;
  --text-color: #262626;
  --background-color: #fafafa;
}

[data-theme='dark'] {
  --primary-color: #177ddc;
  --text-color: #ffffff;
  --background-color: #141414;
}
```

## 📱 响应式设计

项目支持响应式设计，在不同屏幕尺寸下自动调整布局：

- **桌面端** (> 768px): 完整的三栏布局
- **平板端** (≤ 768px): 侧边栏宽度自适应
- **移动端** (≤ 480px): 可考虑折叠侧边栏

## 🔄 状态管理

使用 React Context + useReducer 进行状态管理：

- **EditorContext**: 编辑器全局状态
- **EditorProvider**: 状态提供者
- **useEditor**: 状态访问 Hook

### 主要状态
- `project`: 当前项目配置
- `currentPage`: 当前编辑页面
- `selectedComponent`: 选中的组件
- `isPreview`: 预览模式状态
- `history`: 操作历史记录

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

### 部署到静态服务器
将 `dist` 目录下的文件部署到任何静态文件服务器即可。

### 部署到 Vercel
```bash
npm install -g vercel
vercel --prod
```

### 部署到 Netlify
```bash
npm run build
# 将 dist 目录拖拽到 Netlify 部署界面
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request



## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 构建工具
- [Ant Design](https://ant.design/) - UI 组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

