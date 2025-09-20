# 🎨 主题切换功能指南

## 功能概述

低代码平台现在支持完整的主题切换功能，包括正常模式和暗黑模式的一键切换。

## ✨ 主要特性

### 🌞 正常模式 (Light Mode)
- 明亮的背景色和文字颜色
- 适合日间使用
- 清晰的视觉层次
- 舒适的阅读体验

### 🌙 暗黑模式 (Dark Mode)
- 深色背景和浅色文字
- 适合夜间使用
- 减少眼部疲劳
- 现代化的视觉效果

## 🚀 使用方法

### 1. 主题切换按钮
在顶部工具栏右侧有一个主题切换按钮：
- **正常模式**: 显示 ☀️ 图标
- **暗黑模式**: 显示 🌙 图标
- 点击即可切换主题

### 2. 自动保存
- 主题选择会自动保存到本地存储
- 下次打开应用时会记住您的选择
- 支持跟随系统主题设置

### 3. 实时切换
- 主题切换是实时的，无需刷新页面
- 所有组件都会平滑过渡到新主题
- 包括组件库、画布、属性面板等

## 🎯 技术实现

### 主题系统架构
```
src/
├── context/
│   └── ThemeContext.tsx      # 主题状态管理
├── components/
│   └── ThemeSwitch.tsx       # 主题切换组件
└── styles/
    ├── variables.scss        # SCSS 变量定义
    ├── mixins.scss          # SCSS Mixins
    ├── themes.scss          # 主题样式系统
    ├── components.scss      # 组件样式
    └── animations.scss      # 动画效果
```

### CSS 变量系统
使用 CSS 自定义属性实现主题切换：

```scss
:root {
  --primary-color: #1890ff;
  --text-color: #262626;
  --background-color: #fafafa;
  --background-color-light: #ffffff;
  // ... 更多变量
}

[data-theme='dark'] {
  --primary-color: #177ddc;
  --text-color: #ffffff;
  --background-color: #141414;
  --background-color-light: #1f1f1f;
  // ... 暗黑模式变量
}
```

### 主题上下文
```typescript
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}
```

## 🎨 样式特性

### 1. 响应式设计
- 支持移动端、平板端、桌面端
- 在不同屏幕尺寸下自动调整
- 保持一致的视觉体验

### 2. 动画效果
- 主题切换时的平滑过渡
- 组件悬停和点击效果
- 拖拽时的视觉反馈

### 3. 组件适配
所有组件都支持主题切换：
- **按钮**: 不同主题下的颜色和阴影
- **输入框**: 边框和背景色适配
- **卡片**: 背景和边框颜色
- **模态框**: 背景和文字颜色
- **工具提示**: 背景和文字颜色

## 🔧 自定义主题

### 1. 添加新主题
在 `themes.scss` 中添加新的主题变量：

```scss
[data-theme='custom'] {
  --primary-color: #your-color;
  --text-color: #your-text-color;
  // ... 其他变量
}
```

### 2. 扩展主题切换组件
在 `ThemeSwitch.tsx` 中添加新主题选项：

```typescript
const themes = [
  { key: 'light', label: '正常模式', icon: '☀️' },
  { key: 'dark', label: '暗黑模式', icon: '🌙' },
  { key: 'custom', label: '自定义主题', icon: '🎨' }
];
```

### 3. 更新类型定义
在 `ThemeContext.tsx` 中更新类型：

```typescript
export type ThemeMode = 'light' | 'dark' | 'custom';
```

## 📱 移动端适配

### 响应式断点
```scss
@include mobile {
  .theme-switch {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}
```

### 触摸优化
- 增大点击区域
- 优化触摸反馈
- 适配不同屏幕密度

## 🎯 最佳实践

### 1. 颜色对比度
- 确保文字和背景有足够的对比度
- 遵循 WCAG 2.1 AA 标准
- 在两种主题下都保持良好的可读性

### 2. 一致性
- 保持组件在不同主题下的一致性
- 使用统一的颜色变量
- 避免硬编码颜色值

### 3. 性能优化
- 使用 CSS 变量减少重复代码
- 避免不必要的重绘和重排
- 优化动画性能

## 🐛 故障排除

### 常见问题

1. **主题切换不生效**
   - 检查 CSS 变量是否正确设置
   - 确认 `data-theme` 属性是否正确应用

2. **样式不一致**
   - 检查是否有硬编码的颜色值
   - 确认所有组件都使用了 CSS 变量

3. **动画卡顿**
   - 检查动画属性是否使用了 GPU 加速
   - 优化动画时长和缓动函数

### 调试技巧

1. **使用浏览器开发者工具**
   - 检查 CSS 变量值
   - 查看元素的计算样式

2. **控制台调试**
   ```javascript
   // 检查当前主题
   console.log(document.documentElement.getAttribute('data-theme'));
   
   // 检查 CSS 变量
   console.log(getComputedStyle(document.documentElement).getPropertyValue('--primary-color'));
   ```

## 🚀 未来计划

### 即将推出的功能
- [ ] 更多预设主题（如蓝色主题、绿色主题）
- [ ] 自定义主题编辑器
- [ ] 主题导入/导出功能
- [ ] 主题预览功能
- [ ] 主题分享功能

### 技术改进
- [ ] 支持 CSS-in-JS 主题系统
- [ ] 主题切换性能优化
- [ ] 支持主题动画配置
- [ ] 主题切换音效

## 📞 支持

如果您在使用主题切换功能时遇到任何问题，请：

1. 检查浏览器控制台是否有错误信息
2. 确认浏览器支持 CSS 自定义属性
3. 尝试清除浏览器缓存
4. 提交 Issue 或联系开发团队

---

🎉 享受您的主题切换体验！
