# React Stocker 專案改善建議

## 問題摘要

| 類別 | 嚴重性 | 數量 | 狀態 |
|------|--------|------|------|
| 安全性 | 嚴重 | 3 | 需要立即處理 |
| ~~缺少 Import~~ | ~~嚴重~~ | ~~1~~ | ✅ 已修復 |
| 錯誤處理 | 高 | 4 | 應該修復 |
| 程式碼品質 | 中 | 4 | 應該改善 |
| 效能 | 中 | 5 | 應該優化 |
| 測試覆蓋 | 嚴重 | 0/12 元件 | 缺少 |
| PropTypes | 中 | 3 | 應該修復 |
| 重複程式碼 | 中 | 4 | 應該重構 |

---

## 1. 嚴重問題 (Critical)

### ~~1.1 缺少 Import - 會造成執行錯誤~~ ✅ 已修復

### 1.2 Google Client ID 暴露在原始碼中

**檔案:** `src/pages/Login.js` (第 119 行)

```javascript
// 問題：OAuth client ID 直接寫在程式碼中
clientId="622841715235-kifmb8aoh7jvjt1kjpltdtut9tf8j3p5.apps.googleusercontent.com"

// 建議：移至環境變數
clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
```

### 1.3 JWT Token 儲存在 LocalStorage

**檔案:** `src/utils/AuthAPI.js` (第 44 行)

LocalStorage 容易受到 XSS 攻擊，建議改用 httpOnly cookies。

### 1.4 過時的 Google Login 套件

**檔案:** `package.json` (第 26 行)

`react-google-login` 已被 Google 棄用，應遷移至 `@react-oauth/google`。

### ~~1.5 StockContext 缺少方法~~ ✅ 已修復

---

## 2. 安全性問題 (Security)

### 2.1 缺少 CSRF 防護

Axios 設定中沒有看到 CSRF token 的處理。

---

## 3. 程式碼品質問題

### 3.1 Console.log 殘留

以下檔案需要移除 console.log：

| 檔案 | 行數 |
|------|------|
| `src/pages/Revenue.js` | 64 |
| `src/pages/OperatingExpensesAnalysis.js` | 68 |
| `src/pages/taiwan_market/announcement_dismantling_list.jsx` | 42 |
| `src/pages/taiwan_market/AnnouncementDismantling.js` | 42 |
| `src/components/StockInfoAndCommodity.js` | 37 |

### 3.2 註解掉的程式碼

應該刪除，使用 git 歷史記錄來追蹤變更：

| 檔案 | 行數 |
|------|------|
| `src/index.js` | 5-6 |
| `src/utils/StockerTool.js` | 1, 23-31 |
| `src/pages/Revenue.js` | 5, 145 |

### ~~3.3 拼寫錯誤~~ ✅ 已修復

### 3.4 無效的 HTML 語法

**檔案:** `src/pages/taiwan_market/announcement_dismantling_list.jsx` (第 159 行)

```jsx
// 錯誤
</ >

// 正確
</>
```

---

## 4. React 最佳實踐

### 4.1 Class Component 應改為 Functional Component

**檔案:** `src/components/CustomizedTable.js`

```javascript
// 目前：Class Component
class CustomizedTable extends Component {
  componentDidMount() { ... }
  componentDidUpdate() { ... }
}

// 建議：Functional Component with Hooks
const CustomizedTable = ({ ... }) => {
  useEffect(() => { ... }, [])
  // ...
}
```

### 4.2 PropTypes 太過寬鬆

**檔案:** `src/hooks/AuthContext.js` (第 48 行), `src/hooks/StockContext.js` (第 23 行)

```javascript
// 問題
children: PropTypes.object.isRequired

// 建議
children: PropTypes.node.isRequired
```

### 4.3 未使用的 Props 定義

**檔案:** `src/components/NaviBar.js` (第 32 行)

`activeOnlyWhenExact` prop type 被定義但從未使用。

---

## 5. 效能問題

### 5.1 缺少路由 Lazy Loading

**檔案:** `src/App.js`

```javascript
// 目前
import Revenue from './pages/Revenue'
import FollowStockList from './pages/FollowStockList'

// 建議
const Revenue = React.lazy(() => import('./pages/Revenue'))
const FollowStockList = React.lazy(() => import('./pages/FollowStockList'))

// 並在 Routes 中使用 Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    ...
  </Routes>
</Suspense>
```

### 5.2 未使用的 State 變數

**檔案:** `src/pages/Revenue.js` (第 22 行), `src/pages/OperatingExpensesAnalysis.js` (第 24 行)

`activeKey` state 被設定但未實際用於條件渲染。

### 5.3 使用 useLayoutEffect 可能阻塞渲染

**檔案:** `src/pages/StockerLayout.js`

如非必要，應改用 `useEffect`。

---

## 6. 錯誤處理問題

### 6.1 API 呼叫缺少 catch 處理

**檔案:** `src/pages/FollowStockList.js` (第 10-14 行)

```javascript
// 問題
followStockApi.getFollowStockList().then(data => {
  setFollowStocks(data)
})

// 建議
followStockApi.getFollowStockList()
  .then(data => {
    setFollowStocks(data)
  })
  .catch(err => {
    setError('載入失敗，請稍後再試')
  })
```

### 6.2 其他缺少錯誤處理的檔案

- `src/components/PushNotification.jsx` (第 45-48 行)
- `src/components/Header.jsx` (第 29-36 行)

### 6.3 缺少 Error Boundary

建議加入 Error Boundary 元件來處理元件層級的錯誤。

---

## 7. 重複程式碼

### 7.1 重複的元件檔案

以下兩個檔案幾乎相同，應該合併：
- `src/pages/taiwan_market/AnnouncementDismantling.js`
- `src/pages/taiwan_market/announcement_dismantling_list.jsx`

### 7.2 重複的 Axios Interceptor 設定

以下檔案都有類似的 interceptor 設定，應抽取成共用模組：
- `src/utils/AuthAPI.js`
- `src/utils/StockerAPI.js`
- `src/utils/FollowStockAPI.js`

---

## 8. 測試覆蓋率

### 現狀

- 僅有一個測試檔案 `src/App.test.js` (可能是空的 placeholder)
- 12 個元件都沒有對應的測試
- Hook 和工具函數都沒有測試

### 建議測試優先順序

1. **工具函數** - `StockerTool.js` 中的純函數
2. **Context** - `AuthContext.js`, `StockContext.js`
3. **元件** - 從最常用的元件開始

---

## 9. 檔案命名不一致

專案中混用 `.js` 和 `.jsx` 副檔名，且沒有明確的命名規範。

建議：
- 含有 JSX 的檔案使用 `.jsx`
- 純 JavaScript 邏輯使用 `.js`

---

## 優先處理順序

### 立即處理 (Critical)
1. 修復 `AnnouncementDismantlingList` 缺少的 import
2. 修復 `StockContext` 缺少的 `handleStockExist` 方法
3. 將 Google Client ID 移至環境變數

### 短期 (1-2 週)
4. 修復拼寫錯誤和 HTML 語法錯誤
5. 移除所有 console.log
6. 為所有 API 呼叫加入錯誤處理
7. 更新 `react-google-login` 套件

### 中期 (2-4 週)
8. 將 Class Component 改為 Functional Component
9. 實作路由 Lazy Loading
10. 合併重複的元件
11. 抽取共用的 Axios 設定

### 長期
12. 加入測試覆蓋
13. 考慮遷移至 TypeScript
14. 實作更安全的 Token 儲存機制
