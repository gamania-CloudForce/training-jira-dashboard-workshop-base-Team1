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
