# Reddit检索功能测试指南

## 📋 功能说明

本项目已成功实现Reddit数据检索功能，使用Serper.dev API（Google搜索）来搜索Reddit内容。

## 🚀 快速开始

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问测试页面

打开浏览器访问：
```
http://localhost:3000/reddit-test
```

## 🎯 测试页面功能

### 搜索配置参数

1. **Search Query** (必填)
   - 输入要搜索的关键词
   - 例如：`python tips`, `web development`, `react hooks`

2. **Subreddit** (可选)
   - 指定要搜索的子版块
   - 例如：`python`, `javascript`, `webdev`
   - 可以点击快捷按钮选择热门子版块

3. **Number of Results**
   - 选择返回结果数量：5, 10, 15, 20, 25

4. **Time Range**
   - Any time - 不限时间
   - Past hour - 最近1小时
   - Past 24 hours - 最近24小时
   - Past week - 最近1周
   - Past month - 最近1月
   - Past year - 最近1年

### 搜索模式

#### 模式1：全站搜索
- 只填写 **Search Query**，不填 **Subreddit**
- 示例：搜索 "python tips" 会在所有Reddit搜索

#### 模式2：子版块搜索
- 填写 **Subreddit** 和可选的 **Search Query**
- 示例：Subreddit填 "python"，Query填 "async" 会搜索r/python中关于async的帖子

## 📊 测试结果展示

### 成功响应包含：
- ✅ 搜索统计信息（查询内容、总结果数、API响应时间）
- ✅ 帖子列表，每个帖子包含：
  - 位置编号
  - 子版块标签
  - 发布日期
  - 标题（可点击跳转到Reddit）
  - 内容摘要
  - 帖子链接

### 错误处理：
- ❌ 参数验证错误
- ❌ API调用超时
- ❌ 服务配置错误
- ❌ 网络请求失败

### 调试信息：
- 🛠️ API URL
- 🛠️ HTTP方法
- 🛠️ 请求参数
- 🛠️ 结果数量

## 🧪 测试用例

### 测试用例1：基础搜索
```
Query: python tips
Subreddit: (留空)
Num: 10
Time Range: Any time
```
**预期结果**: 返回10条关于"python tips"的Reddit帖子

### 测试用例2：子版块搜索
```
Query: async programming
Subreddit: python
Num: 15
Time Range: Past week
```
**预期结果**: 返回r/python子版块中最近一周关于"async programming"的15条帖子

### 测试用例3：时间过滤
```
Query: react 19
Subreddit: (留空)
Num: 10
Time Range: Past 24 hours
```
**预期结果**: 返回最近24小时内关于"react 19"的帖子

### 测试用例4：热门子版块浏览
```
Query: (留空)
Subreddit: webdev (点击快捷按钮选择)
Num: 20
Time Range: Any time
```
**预期结果**: 返回r/webdev子版块的20条热门帖子

## 📁 项目文件结构

```
AI-SaaS/
├── lib/
│   └── services/
│       └── serper.service.ts          # Serper API封装
├── app/
│   ├── api/
│   │   └── reddit/
│   │       ├── search/
│   │       │   └── route.ts           # 搜索API端点
│   │       └── subreddit/
│   │           └── [name]/
│   │               └── route.ts       # 子版块搜索API端点
│   └── reddit-test/
│       └── page.tsx                   # 测试页面
├── .env.local                         # 环境变量配置
└── REDDIT_TEST_README.md             # 本文档
```

## 🔑 API密钥配置

API密钥已配置在 `.env.local` 文件中：

```env
SERPER_API_KEY=your-serper-api-key
SERPER_API_URL=https://google.serper.dev/search
SERPER_TIMEOUT=10000
```

**注意**: 
- API密钥已硬编码在 `serper.service.ts` 中作为备用
- 生产环境务必使用环境变量

## 🔍 API端点说明

### 1. POST /api/reddit/search
**功能**: 全站搜索Reddit内容

**请求体**:
```json
{
  "query": "python tips",
  "num": 10,
  "page": 1,
  "tbs": "qdr:d"
}
```

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "title": "帖子标题",
      "link": "https://reddit.com/...",
      "snippet": "内容摘要",
      "date": "2 days ago",
      "subreddit": "python",
      "position": 1,
      "domain": "reddit.com"
    }
  ],
  "total": 1234567,
  "searchTime": 0.35,
  "query": "python tips"
}
```

### 2. GET /api/reddit/subreddit/:name
**功能**: 搜索指定子版块

**URL参数**: 
- `name`: 子版块名称（如 python, webdev）

**查询参数**:
- `query`: 可选，搜索关键词
- `num`: 可选，结果数量（默认25）
- `tbs`: 可选，时间范围过滤

**示例**:
```
GET /api/reddit/subreddit/python?query=async&num=15&tbs=qdr:w
```

**响应**: 同上

## ⚠️ 注意事项

1. **API配额限制**
   - 免费账户：2,500次/月
   - 建议监控使用量

2. **响应时间**
   - 平均响应时间：0.3-0.5秒
   - 设置了10秒超时保护

3. **搜索限制**
   - 单次最多返回25条结果
   - 支持分页（page参数）

4. **时间范围参数**
   - `qdr:h` - 最近1小时
   - `qdr:d` - 最近1天
   - `qdr:w` - 最近1周
   - `qdr:m` - 最近1月
   - `qdr:y` - 最近1年

## 🐛 常见问题

### Q1: 搜索没有返回结果？
**A**: 检查以下几点：
- 确认API密钥正确
- 检查网络连接
- 尝试更通用的关键词
- 查看浏览器控制台错误信息

### Q2: API返回500错误？
**A**: 可能原因：
- API密钥无效或过期
- Serper.dev服务暂时不可用
- 请求超时
- 查看服务器日志获取详细错误

### Q3: 搜索结果不准确？
**A**: 建议：
- 使用更精确的关键词
- 限定子版块范围
- 使用时间范围过滤
- 尝试不同的关键词组合

### Q4: 如何查看API调用日志？
**A**: 
- 打开浏览器开发者工具（F12）
- 查看Console标签
- 所有API请求和响应都有详细日志

## 📝 开发日志

**实现时间**: 2025-12-13

**已完成功能**:
- ✅ Serper.dev API客户端封装
- ✅ 全站搜索API端点
- ✅ 子版块搜索API端点
- ✅ 完整的测试页面UI
- ✅ 错误处理和加载状态
- ✅ 时间范围过滤
- ✅ 调试信息展示
- ✅ 响应式设计
- ✅ 暗黑模式支持

**测试状态**: ✅ 可以开始测试

## 🎉 开始测试

1. 确保开发服务器正在运行
2. 访问 `http://localhost:3000/reddit-test`
3. 输入搜索关键词
4. 点击"Search Reddit"按钮
5. 查看搜索结果

**祝测试顺利！** 🚀
