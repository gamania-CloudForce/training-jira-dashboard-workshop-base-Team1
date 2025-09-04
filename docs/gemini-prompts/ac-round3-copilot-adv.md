# Round 3: 透過 Github Copilot 寫 Acceptance Criteria - 參考更多上下文，並強調要符合目前技術架構

--
[chat 1]

我們正在開發一個 Jira 看板資料的視覺化儀表板。請根據以下 User Story 生成詳細的驗收標準：

使用者痛點
# User Story: 任務詳細資訊查看功能

## User Story

**US-004**: 作為任務實際執行者，我希望在儀表板上點擊任務卡片時能查看詳細的執行條件和驗收標準，以便能準確理解需求並高效完成指派的任務。

## 品質檢查 (INVEST 原則)

| 原則 | 檢查結果 | 說明 |
|------|---------|------|
| **V - Valuable** | ✓ | 幫助執行者減少溝通成本，提升任務完成度 |
| **T - Testable** | ✓ | 可驗證是否能正確顯示執行條件和驗收標準 |
| **S - Small** | ✓ | 可在一個 Sprint 內完成 |
| **I - Independent** | ✓ | 可獨立開發和測試 |

## 價值說明

- **解決痛點**: 避免因需求不明確導致的重工和溝通成本
- **提升效率**: 讓執行者能一次性獲取完整的任務資訊
- **降低風險**: 減少因理解偏差造成的交付品質問題

User Story:
[在此輸入您的 User Story]
or
請閱讀 #file:spec01-us01-sprintprogress.md

我想先針對痛點跟 User Story 發想 Acceptance Criteria，可以發散但必須也符合目前產品技術架構，請閱讀 #tech-overview.md 確認技術限制與 #table-schema.md 目前資料來源。

並依照 #file:acceptance-criteria-guide.md 的格式每個 Story 生成 1~3 條 AC 跟我討論

--
[chat 2]

生成在 ./docs/mvp-v1/practice/team-1/ac-copilot-adv.md