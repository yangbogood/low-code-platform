# 国际化 (i18n) 使用指南

## 概述

本项目已集成完整的国际化功能，支持中文和英文双语切换。使用 `react-i18next` 作为国际化解决方案。

## 功能特性

- ✅ **双语支持**: 中文 (zh-CN) 和英文 (en-US)
- ✅ **自动语言检测**: 基于浏览器语言设置
- ✅ **本地存储**: 记住用户选择的语言
- ✅ **动态切换**: 实时切换语言，无需刷新页面
- ✅ **完整覆盖**: 所有UI文案都已国际化

## 文件结构

```
src/
├── i18n/
│   ├── index.ts                 # i18n 配置文件
│   └── locales/
│       ├── zh-CN.json          # 中文语言包
│       └── en-US.json          # 英文语言包
├── components/
│   └── LanguageSwitch.tsx      # 语言切换组件
└── data/
    └── componentLibraryI18n.ts # 组件库国际化数据
```

## 使用方法

### 1. 在组件中使用翻译

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
    </div>
  );
};
```

### 2. 带参数的翻译

```tsx
const { t } = useTranslation();

// 使用参数
t('placeholders.enterText', { label: '用户名' })
// 中文: "请输入用户名"
// 英文: "Please enter 用户名"
```

### 3. 语言切换

```tsx
import { LanguageSwitch } from './components/LanguageSwitch';

// 按钮式切换
<LanguageSwitch type="button" size="middle" />

// 图标式切换
<LanguageSwitch type="icon" size="middle" />
```

## 语言包结构

### 主要分类

- **common**: 通用词汇 (保存、取消、确认等)
- **app**: 应用相关 (标题、描述等)
- **toolbar**: 工具栏文案
- **sidebar**: 侧边栏文案
- **components**: 组件相关文案
- **categories**: 组件分类
- **theme**: 主题相关
- **language**: 语言相关
- **messages**: 提示消息
- **placeholders**: 占位符文案
- **codeGenerator**: 代码生成器文案

### 示例语言包

```json
{
  "common": {
    "save": "保存",
    "cancel": "取消",
    "confirm": "确认"
  },
  "components": {
    "button": {
      "name": "按钮",
      "description": "可点击的按钮组件",
      "text": "按钮文本",
      "types": {
        "default": "默认",
        "primary": "主要"
      }
    }
  }
}
```

## 已国际化的组件

### 1. 主应用 (App.tsx)
- 应用标题
- 工具栏按钮 (撤销、重做、保存)
- 项目初始化文案

### 2. 组件库 (ComponentLibrary.tsx)
- 组件库标题
- 组件分类名称
- 组件名称和描述

### 3. 属性面板 (PropertyPanel.tsx)
- 属性面板标题
- 表单标签和占位符
- 空状态提示

### 4. 主题切换 (ThemeSwitch.tsx)
- 主题模式名称
- 切换提示文案

### 5. 语言切换 (LanguageSwitch.tsx)
- 语言名称
- 切换提示

## 添加新的翻译

### 1. 在语言包中添加键值

**zh-CN.json**
```json
{
  "newSection": {
    "newKey": "新的中文文案"
  }
}
```

**en-US.json**
```json
{
  "newSection": {
    "newKey": "New English text"
  }
}
```

### 2. 在组件中使用

```tsx
const { t } = useTranslation();
return <div>{t('newSection.newKey')}</div>;
```

## 语言检测和存储

### 自动检测顺序
1. 本地存储 (`localStorage`)
2. 浏览器语言设置
3. HTML 标签语言属性
4. 默认语言 (zh-CN)

### 本地存储
- 键名: `i18nextLng`
- 值: `zh-CN` 或 `en-US`

## 配置选项

### i18n 配置 (src/i18n/index.ts)

```typescript
{
  fallbackLng: 'zh-CN',        // 默认语言
  debug: process.env.NODE_ENV === 'development', // 开发模式调试
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
  },
  interpolation: {
    escapeValue: false,         // React 已处理 XSS
  },
}
```

## 最佳实践

### 1. 键名命名规范
- 使用点分隔的层级结构
- 使用小写字母和连字符
- 保持语义化命名

```json
{
  "components.button.name": "按钮",
  "components.button.types.primary": "主要"
}
```

### 2. 文案组织
- 按功能模块分组
- 保持中英文结构一致
- 避免深层嵌套 (建议不超过3层)

### 3. 参数使用
- 使用插值语法 `{{variable}}`
- 提供默认值
- 保持参数名称一致

```json
{
  "placeholders.enterText": "请输入{{label}}"
}
```

## 测试和验证

### 1. 语言切换测试
- 点击语言切换按钮
- 验证所有文案是否正确切换
- 检查本地存储是否保存

### 2. 页面刷新测试
- 切换语言后刷新页面
- 验证语言设置是否保持

### 3. 浏览器语言测试
- 清除本地存储
- 设置浏览器语言
- 验证是否自动选择对应语言

## 故障排除

### 1. 翻译不显示
- 检查键名是否正确
- 确认语言包中是否存在该键
- 查看控制台是否有错误

### 2. 语言切换不生效
- 检查 i18n 是否正确初始化
- 确认 useTranslation hook 是否正确使用
- 验证语言包是否正确加载

### 3. 参数插值问题
- 检查参数名称是否匹配
- 确认插值语法是否正确
- 验证参数值是否传递

## 扩展支持

### 添加新语言
1. 创建新的语言包文件 (如 `ja-JP.json`)
2. 在 `i18n/index.ts` 中添加资源
3. 更新 `LanguageSwitch` 组件
4. 添加语言检测逻辑

### 动态加载语言包
```typescript
// 可以配置动态导入语言包
const resources = {
  'zh-CN': { translation: () => import('./locales/zh-CN.json') },
  'en-US': { translation: () => import('./locales/en-US.json') },
};
```

## 总结

国际化功能已完全集成到项目中，提供了：

- 🎯 **完整的双语支持**
- 🔄 **实时语言切换**
- 💾 **持久化语言设置**
- 🎨 **统一的UI体验**
- 📱 **响应式语言切换组件**

现在用户可以在中文和英文之间自由切换，享受本地化的使用体验！
