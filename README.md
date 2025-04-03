# mcp-server-bear

一个 MCP 服务器，对接 Bear 熊掌记的 API，实现在任意 MCP 客户端以对话形式创建笔记的功能。

## 功能特点

- 通过 MCP 客户端（如 Cursor AI、Claude、OpenAI 等）以对话方式创建 Bear 笔记
- 支持打开和搜索现有笔记
- 支持 Markdown 格式的笔记内容
- 支持添加标签

## 系统要求

- macOS（因为 Bear 应用仅支持 macOS 系统）
- 安装了 Bear 应用
- Node.js 14.0.0 或更高版本

## 安装和使用

### 方法 1：使用 npx（推荐）

```bash
npx mcp-server-bear
```

### 方法 2：全局安装

```bash
npm install -g mcp-server-bear
mcp-server-bear
```

### 方法 3：从源码安装

```bash
git clone https://github.com/Ssiswent/mcp-server-bear.git
cd mcp-server-bear
npm install
npm run build
node build/index.js
```

## MCP 客户端配置

在你喜欢的 MCP 客户端中配置此服务器。以下是一些常见客户端的配置示例：

### ChatWise

复制这段代码，打开 ChatWise，选择 从剪切板导入 JSON

```json
{
  "mcpServers": {
    "mcp-server-bear": {
      "command": "npx",
      "args": ["-y", "mcp-server-bear"]
    }
  }
}
```

<img width="867" alt="image" src="https://github.com/user-attachments/assets/2beaabbf-b5dc-4e93-8f1c-408b10f14974" />


### Windsurf

编辑 `~/.codeium/windsurf/mcp_config.jsonn` 文件，添加以下配置：

```json
{
  "mcpServers": {
    "mcp-server-bear": {
      "command": "npx",
      "args": ["-y", "mcp-server-bear"]
    }
  }
}
```

### Claude

在 Claude.app 中，前往设置 > MCP 服务器 > 添加 MCP 服务器，然后添加：

- 名称：Bear MCP 服务器
- 命令：npx
- 参数：-y mcp-server-bear

## 使用示例

在配置好 MCP 客户端后，可以与 AI 对话，请求它记录笔记到 Bear。例如：

1. "帮我记录一下今天的会议笔记"
2. "把这段代码保存到 Bear 笔记中"
3. "总结我们的对话并保存到 Bear 中"
4. "在 Bear 中搜索关于项目计划的笔记"
5. "打开我的最新 Bear 笔记"

AI 会理解你的意图，并使用相应的工具与 Bear 应用交互。

## 工具说明

此 MCP 服务器提供了以下工具：

1. `write_note`：将笔记写入 Bear 应用
   - 参数：
     - `title`：笔记标题（必填）
     - `text`：笔记内容，支持 Markdown 格式（必填）
     - `tags`：标签数组（可选）

2. `open_note`：打开 Bear 中的笔记
   - 参数：
     - `title`：通过标题打开笔记
     - `id`：通过ID打开笔记

3. `search_notes`：搜索 Bear 笔记
   - 参数：
     - `term`：搜索关键词（必填）
     - `tag`：筛选特定标签（可选）

## 开发

```bash
# 克隆项目
git clone https://github.com/Ssiswent/mcp-server-bear.git
cd mcp-server-bear

# 安装依赖
npm install

# 开发模式（监视文件变化并自动编译）
npm run watch

# 使用 Inspector 调试工具
npm run inspector
```

## 发布

```bash
# 登录到 npm
npm login

# 发布到 npm
npm publish --access public
```

## 许可

MIT
