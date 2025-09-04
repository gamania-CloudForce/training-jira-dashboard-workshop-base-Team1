<<<<<<< HEAD
# Acceptance Criteria - 任務詳細資訊查看功能

## User Story 參考
**US-004**: 作為任務實際執行者，我希望在儀表板上點擊任務卡片時能查看詳細的執行條件和驗收標準，以便能準確理解需求並高效完成指派的任務。

## Acceptance Criteria

### AC01: 任務卡片點擊顯示詳細資訊
```gherkin
場景：用戶點擊任務卡片查看詳細資訊
Given 用戶已在儀表板頁面
And 頁面上顯示了多個任務卡片
When 用戶點擊任何一個任務卡片
Then 系統應顯示任務詳細資訊彈窗或頁面
And 詳細資訊應包含以下欄位：
  - Key（任務編號）
  - Summary（任務摘要）
  - Issue Type（任務類型）
  - Status（當前狀態）
  - Priority（優先級）
  - Due date（到期日）
  - Story Points（故事點數）
  - TaskTags（任務標籤）
```

### AC02: 詳細資訊的完整性和格式化
```gherkin
場景：驗證任務詳細資訊的完整性
Given 用戶已打開任務詳細資訊
When 系統載入任務資料
Then 所有可用的資料欄位應正確顯示
And 日期格式應統一為 YYYY-MM-DD 格式
And 空值欄位應顯示為 "未設定" 或適當的預設值
And Priority 應以顏色或圖示標示緊急程度
And Status 應顯示對應的狀態標籤
```

### AC03: 任務關聯性和階層結構顯示
```gherkin
場景：顯示任務的關聯性資訊
Given 用戶查看任務詳細資訊
And 該任務具有 parent 關聯（非空值）
When 詳細資訊頁面載入完成
Then 應顯示父級任務的 Key 和 Summary
And 點擊父級任務連結時應能導航到父級任務詳情
And 如果該任務沒有父級關聯，則不顯示此區塊
```

## 技術限制考量

### 資料來源限制
- 所有資料來自 Google Sheets rawData 表（23個欄位）
- 資料可能有 5 分鐘快取延遲
- 必須處理空值情況

### 技術架構限制
- 前端：Next.js + React + TypeScript
- 後端：.NET Core Web API
- UI 元件：shadcn/ui 元件庫
- 狀態管理：React hooks

### 效能考量
- 避免為每次點擊都重新載入全部資料
- 考慮在客戶端快取已載入的任務詳細資訊
- 大量任務時需考慮載入效能

## 驗收檢查清單

- [ ] 任務卡片可正常點擊
- [ ] 詳細資訊顯示完整且格式正確
- [ ] 空值處理適當
- [ ] 日期格式統一
- [ ] 優先級和狀態視覺化清楚
- [ ] 父級任務關聯正確顯示
- [ ] 載入效能符合預期（< 2秒）
- [ ] 支援鍵盤導航和無障礙存取
=======
# Acceptance Criteria for MVP v1.0 Dashboard

## US-001: 專案里程碑和任務進度視覺化

### AC-001-1: Dashboard 基本資訊卡片顯示
**Given** 我是專案經理  
**When** 我訪問 Jira Dashboard 頁面  
**Then** 我應該看到 4 個關鍵指標卡片，包含：
- Total Issues 數量
- Total Story Points
- Done Issues 數量
- Done Story Points
**And** 這些數據應每 5 分鐘自動更新一次

### AC-001-2: Sprint 篩選功能
**Given** 我正在查看 Dashboard  
**When** 我使用 Sprint 下拉選單  
**Then** 我應該能看到以下選項：
- "All"
- 所有有效的 Sprint 名稱
- "No Sprints"
**And** 選擇不同的 Sprint 時，所有指標卡片和圖表應同步更新

### AC-001-3: 狀態分布圖表
**Given** 我正在查看 Dashboard  
**When** 任務狀態有更新  
**Then** 我應該能在狀態分布圖表中看到：
- 9 個固定狀態的任務分布
- 每個狀態的任務數量和百分比
- 按照預定義的業務流程順序排列

## US-002: 專案里程碑時間軸

### AC-002-1: Sprint 時間軸顯示
**Given** 我正在查看 Dashboard 的時間軸區域  
**When** 存在多個 Sprint  
**Then** 我應該能看到：
- Sprint 的開始和結束日期
- Sprint 的當前狀態（future/active/closed）
- Sprint 的完成目標（goal）

## US-003: 任務完成進度圖表

### AC-003-1: 任務進度追蹤
**Given** 我正在查看任務進度圖表  
**When** 專案有進行中的任務  
**Then** 系統應顯示：
- 各狀態的任務數量統計
- 使用 Bar Chart 呈現任務分布
- 依照固定的狀態順序排列

### AC-003-2: 進度更新機制
**Given** Google Sheets 資料有更新  
**When** 距離上次讀取超過 5 分鐘  
**Then** 系統應自動更新圖表資料  
**And** 顯示最後更新時間

## US-004: 個人任務關聯性顯示

### AC-004-1: 任務關聯視圖
**Given** 我是團隊成員  
**When** 我查看我負責的任務  
**Then** 我應該能看到：
- 任務在專案中的狀態
- 與整體專案進度的關係
- 任務的 Story Points

---

> 注意事項：
1. 所有數據都來自 Google Sheets API，使用 23 欄位的嚴格架構
2. 資料更新週期為 5 分鐘，以平衡效能和即時性
3. 圖表使用 Recharts 函式庫實現
4. 所有功能都需要遵循 tech-overview.md 中定義的技術限制
>>>>>>> 033d0e5e31bab12af7a28cf591fe2c11807e3024
