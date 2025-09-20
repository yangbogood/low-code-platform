# ESLint 和 Vite 配置说明

## 项目分析总结

### 组件结构特点
- 使用 React 19.1.1 + TypeScript
- 采用函数式组件和 Hooks
- 使用 Ant Design 作为 UI 组件库
- 代码风格相对规范，但需要更严格的 ESLint 规则

### 当前配置问题
- ESLint 配置过于简单，缺少 React 和 TypeScript 的严格规则
- 没有配置多行空格检查
- Vite 配置过于基础，缺少优化选项

## ESLint 配置

### 主要特性
1. **多行空格控制**
   - `no-multiple-empty-lines`: 最多允许1个空行
   - `no-trailing-spaces`: 禁止行尾空格
   - `eol-last`: 文件末尾必须有换行符

2. **TypeScript 严格规则**
   - `@typescript-eslint/no-unused-vars`: 检查未使用变量
   - `@typescript-eslint/no-explicit-any`: 警告使用 any 类型
   - `@typescript-eslint/no-var-requires`: 禁止使用 require

3. **React 特定规则**
   - `react/prop-types`: 关闭（TypeScript 项目中不需要）
   - `react/react-in-jsx-scope`: 关闭（React 17+ 不需要）
   - `react/jsx-key`: 检查列表中的 key 属性
   - `react/self-closing-comp`: 强制自闭合标签

4. **代码风格规则**
   - `indent`: 2个空格缩进
   - `quotes`: 单引号
   - `semi`: 必须分号
   - `comma-dangle`: 多行时必须有尾随逗号
   - `object-curly-spacing`: 对象大括号内必须有空格
   - `space-before-function-paren`: 函数括号前空格规则

### 安装的依赖
```bash
npm install --save-dev eslint-plugin-react prettier terser @types/node
```

## Vite 配置

### 主要特性
1. **路径别名**
   - `@`: src 目录
   - `@components`: src/components
   - `@context`: src/context
   - `@data`: src/data
   - `@styles`: src/styles
   - `@types`: src/types
   - `@utils`: src/utils

2. **开发服务器**
   - 端口: 3000
   - 自动打开浏览器
   - 允许外部访问
   - 启用 CORS

3. **构建优化**
   - 使用 Terser 压缩
   - 移除 console 和 debugger
   - 分包策略（React、Ant Design、拖拽库等）
   - 资源文件命名优化

4. **CSS 配置**
   - SCSS 支持
   - 全局变量导入
   - CSS 模块化配置

5. **依赖优化**
   - 预构建常用依赖
   - 排除不需要的依赖

## 新增的 npm 脚本

```json
{
  "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
  "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
  "lint:check": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0",
  "type-check": "tsc --noEmit",
  "clean": "rm -rf dist node_modules/.vite",
  "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,scss,md}\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,scss,md}\""
}
```

## VS Code 配置

### 推荐扩展
- `esbenp.prettier-vscode`: Prettier 格式化
- `dbaeumer.vscode-eslint`: ESLint 支持
- `ms-vscode.vscode-typescript-next`: TypeScript 支持
- `formulahendry.auto-rename-tag`: 自动重命名标签
- `christian-kohler.path-intellisense`: 路径智能提示

### 工作区设置
- 保存时自动格式化
- 保存时自动修复 ESLint 错误
- 自动整理导入
- 启用 TypeScript 自动导入
- 配置代码标尺（80, 120字符）

## Prettier 配置

### 主要设置
- 分号: 必须
- 尾随逗号: ES5 兼容
- 引号: 单引号
- 行宽: 80字符
- 缩进: 2个空格
- 行尾: LF
- JSX 引号: 单引号

## 使用建议

1. **开发时**
   ```bash
   npm run dev          # 启动开发服务器
   npm run lint         # 检查代码规范
   npm run lint:fix     # 自动修复代码规范问题
   ```

2. **构建前**
   ```bash
   npm run type-check   # TypeScript 类型检查
   npm run lint:check   # 严格检查（0警告）
   npm run format:check # 检查代码格式
   ```

3. **构建时**
   ```bash
   npm run build        # 生产构建
   npm run preview      # 预览构建结果
   ```

## 当前状态

✅ 所有 ESLint 错误已修复  
⚠️ 剩余 17 个警告（主要是 any 类型和 console 语句）  
✅ 代码风格已统一  
✅ 多行空格已禁用  
✅ Vite 配置已优化  

这些警告可以根据项目需要逐步修复，不会影响项目的正常运行。
