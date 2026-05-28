# Amazon Ads Center - 亚马逊广告执行中枢

> 运营端 EXE + 管理员在线后台 + 数据源审计 + 广告规则引擎 + LLM总结层

## 项目结构

```
amazon_ads_center/
├── desktop_client/        # Python PySide6 运营端 EXE
│   ├── main.py            # 入口
│   ├── app/
│   │   ├── ui_main.py     # 主窗口 UI
│   │   ├── login_dialog.py
│   │   ├── upload_panel.py
│   │   ├── parser_engine.py    # CSV/XLSX解析 + 编码检测
│   │   ├── report_classifier.py # 14种报表识别
│   │   ├── field_mapper.py     # 字段标准化映射
│   │   ├── metrics_engine.py   # 指标计算
│   │   ├── rule_engine.py      # 10大规则引擎
│   │   ├── llm_client.py       # LLM调用 + 防套取
│   │   ├── excel_writer.py     # 14 Sheet 美化导出
│   │   ├── api_client.py       # 后端同步
│   │   ├── config_manager.py
│   │   ├── security.py
│   │   └── utils.py
│   ├── requirements.txt
│   └── build_exe.bat
│
├── backend/               # FastAPI + PostgreSQL
│   ├── main.py
│   ├── app/
│   │   ├── database.py
│   │   ├── models.py      # 9张数据表
│   │   ├── auth.py        # JWT认证
│   │   └── routers/       # auth/uploads/analysis/reports/admin/users
│   └── requirements.txt
│
├── admin_web/             # React + Vite 管理员后台
│   ├── src/
│   │   ├── pages/         # Login/Dashboard/Uploads/Analysis/Missing/Tasks/Reports/Users
│   │   ├── components/Layout.tsx
│   │   └── api/client.ts
│   └── package.json
│
└── README.md
```

## 快速开始

### 1. 桌面端 (运营 EXE)

```bash
cd desktop_client
pip install -r requirements.txt
python main.py
```

打包为 EXE:
```bash
build_exe.bat
```

### 2. 后端 API

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

默认使用 SQLite，设置 `USE_SQLITE=false` 使用 PostgreSQL。

### 3. 管理员后台

```bash
cd admin_web
npm install
npm run dev
```

## 部署

- **后端**: 部署到 Cloudflare Workers (`npx wrangler deploy`)
- **前端**: 部署到 Cloudflare Pages (`npx wrangler pages deploy dist`)
- **管理员后台**: 同上或部署到 Vercel

## 支持的报表类型 (14种)

| 类型 | 说明 |
|------|------|
| SP_Campaign_Report | 商品推广广告活动 |
| SP_Search_Term_Report | 商品推广搜索词 |
| SP_Targeting_Report | 商品推广投放 |
| SB_Campaign_Report | 品牌推广广告活动 |
| SB_Keyword_Report | 品牌推广关键词 |
| SB_Keyword_Placement_Report | 品牌推广关键词广告位 |
| SB_Search_Term_Report | 品牌推广搜索词 |
| ERP_Search_Term_Summary_Report | ERP广告搜索词汇总 |
| ABA_Search_Query_Performance_Report | ABA搜索查询绩效 |
| ABA_Top_Search_Terms_Report | ABA热门搜索词 |
| Business_Report_Child_30D | 业务报告30天子体 |
| Business_Report_Child_7D | 业务报告7天子体 |
| Business_Report_Parent_30D | 业务报告30天父体 |
| Business_Report_Parent_7D | 业务报告7天父体 |

## 规则引擎 (10大模块)

1. 否词规则
2. 预算规则
3. 竞价规则
4. 预算模式规则
5. 拆精准规则
6. 页面优先规则
7. 广告位规则
8. 企业购规则
9. AMC规则
10. SBV视频规则 + 3C意图分类
