# 🚀 部署说明

## GitHub Pages 自动部署

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "更新代码"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入 GitHub 仓库的 Settings
   - 找到 Pages 设置
   - Source 选择 "GitHub Actions"

3. **等待部署完成**
   - 在 Actions 标签页查看部署进度
   - 部署成功后，访问 `https://你的用户名.github.io/仓库名`

### 访问地址

部署成功后，你的低代码平台将在以下地址可访问：
- `https://你的用户名.github.io/low-code-platform`

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 注意事项

- 每次推送到 `main` 或 `master` 分支都会自动触发部署
- 部署过程大约需要 2-3 分钟
- 如果部署失败，请检查 Actions 日志
