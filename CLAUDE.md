# react-stocker

台灣股票分析平台前端，React + React Bootstrap + Chart.js。

## Commands

```bash
yarn start        # 開發伺服器
yarn build        # 生產版本建置
yarn lint         # ESLint 檢查（push 前必跑）
```

## Architecture

- `src/pages/` - 頁面元件
- `src/components/` - 共用元件（NaviBar、StockerChart 等）
- `src/utils/StockerAPI.js` - 所有後端 API 呼叫
- `src/utils/StockerTool.js` - 資料格式化工具

## Key Patterns

- 圖表使用 `StockerChart`（封裝 chart.js），資料格式為 Google Charts 二維陣列
- 資料格式轉換用 `StockerTool.formatDataForGoogleChart(data, keysOrder)`
- 個股頁面路由：`/financial-stat/<page>/:stockNum`、`/valuation/<page>/:stockNum`
- 大盤頁面路由：`/taiwan-stock/<page>`
- 後端 API base URL：`/api/v0`

## Gotchas

- NaviBar 每個父選單的 `href` 必須唯一，否則 active 狀態會互相干擾
- 新增個股頁面需同時更新：`App.js`（路由）、`NaviBar.js`（導覽）
