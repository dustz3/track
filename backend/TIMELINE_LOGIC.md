# Timeline 時間軸運作邏輯文件

## 一、快速開始

### 如何運作

1. **查詢訂單**：輸入 Job No. 和 Tracking No.
2. **系統判斷**：根據 Airtable 資料自動判斷每個步驟的狀態
3. **顯示結果**：顯示訂單資訊和 Timeline 進度

### 狀態類型

- **Completed（已完成）**：該步驟有日期時間資料
- **Processing（處理中）**：最後一個已完成步驟的下一個步驟
- **Pending（待處理）**：Processing 之後的所有步驟
- **Order Completed（訂單完成）**：所有步驟都有資料，且 Shipment Delivered 有資料

---

## 二、步驟定義與順序

Timeline 包含 **7 個步驟**和 **2 個事件**，按照以下順序排列：

### 步驟列表

1. **Order Created** - 訂單建立
2. **Shipment Collected** - 貨件收取
3. **Origin Customs Process** - 起運地海關處理
4. **In Transit** - 運輸中
5. **Destination Customs Process** - 目的地海關處理
6. **Out for Delivery** - 配送中
7. **Shipment Delivered** - 貨件已送達

### 事件列表

- **Dry Ice Refilled(Terminal)** - 乾冰補充（航站）- 位於 In Transit 之後
- **Dry Ice Refilled** - 乾冰補充 - 位於 Destination Customs Process 之後

---

## 三、步驟狀態判斷邏輯

### 3.1 基本規則

1. **有資料 → Completed**

   - 如果步驟欄位有日期時間資料，狀態為 `completed`

2. **最後一個已完成步驟的下一個 → Processing**

   - 找出最後一個有資料的步驟
   - 該步驟的下一個步驟（跳過事件），如果沒有資料，狀態為 `processing`

3. **Processing 之後的步驟 → Pending**
   - Processing 之後的所有步驟，無論是否有資料，狀態都強制為 `pending`

### 3.2 判斷流程

```
1. 找出所有有資料的步驟（排除事件）
2. 找出最後一個有資料的步驟索引
3. 對每個步驟判斷：
   - 如果有資料 → completed
   - 如果沒有資料，且是最後一個有資料步驟的下一個 → processing
   - 如果沒有資料，且不是下一個 → pending
   - 如果在 processing 步驟之後 → 強制 pending（即使有資料）
```

### 3.3 範例

假設資料如下：

- Order Created: 有資料
- Shipment Collected: 有資料
- Origin Customs Process: 有資料
- In Transit: 有資料
- Destination Customs Process: 沒有資料
- Out for Delivery: 沒有資料
- Shipment Delivered: 沒有資料

**結果**：

- Order Created: `completed`
- Shipment Collected: `completed`
- Origin Customs Process: `completed`
- In Transit: `completed`
- Destination Customs Process: `processing`（最後一個有資料步驟的下一個）
- Out for Delivery: `pending`（Processing 之後）
- Shipment Delivered: `pending`（Processing 之後）

---

## 四、訂單完成狀態判斷邏輯

### 4.1 判斷條件

訂單完成需要滿足以下兩個條件：

1. **所有步驟都有日期時間資料**

   - 檢查所有 7 個步驟（排除事件）
   - 每個步驟的欄位都必須有有效的日期時間資料

2. **最後一個步驟「Shipment Delivered」有資料**
   - 特別檢查最後一個步驟是否有資料

### 4.2 邏輯流程

```
1. 檢查所有步驟是否有資料
   └─ 使用 timelineConfig.every() 檢查所有非事件步驟

2. 檢查 Shipment Delivered 是否有資料
   └─ 特別檢查最後一個步驟

3. 如果兩個條件都滿足
   └─ isOrderCompleted = true
   └─ 將所有步驟的 status 設為 'completed'
   └─ 將所有步驟的 isOrderCompleted 設為 true
```

### 4.3 範例

對於已完成訂單：

- Order Created: 有資料
- Shipment Collected: 有資料
- Origin Customs Process: 有資料
- In Transit: 有資料
- Destination Customs Process: 有資料
- Out for Delivery: 有資料
- Shipment Delivered: 有資料

**結果**：所有步驟都標記為 `isOrderCompleted: true`，顯示為訂單完成狀態

---

## 五、事件顯示規則

### 5.1 基本條件

1. **Checkbox 必須被打勾**

   - 只有當 Airtable 中的 checkbox 欄位為 `true` 時，事件才會被考慮顯示

2. **前置步驟必須為 Completed 狀態**
   - 必須檢查前置步驟的**最終狀態**是否為 `completed`
   - 即使欄位有資料，但狀態為 `pending`，事件也不會顯示

### 5.2 事件規則

#### Dry Ice Refilled(Terminal)

- **前置條件**：In Transit 的狀態必須為 `completed`
- **邏輯**：
  - 如果 In Transit 沒有資料 → 不顯示
  - 如果 In Transit 狀態為 `processing` → 不顯示
  - 如果 In Transit 狀態為 `pending` → 不顯示
  - 只有當 In Transit 狀態為 `completed` 時才顯示

#### Dry Ice Refilled

- **前置條件**：Destination Customs Process 的狀態必須為 `completed`
- **邏輯**：
  - 如果 Destination Customs Process 沒有資料 → 不顯示
  - 如果 Destination Customs Process 狀態為 `processing` → 不顯示
  - 如果 Destination Customs Process 狀態為 `pending`（即使欄位有資料）→ 不顯示
  - 只有當 Destination Customs Process 狀態為 `completed` 時才顯示

### 5.3 範例

假設資料如下：

- In Transit: 有資料（狀態：`completed`）
- Dry Ice Refilled(Terminal): checkbox = `true`

**結果**：Dry Ice Refilled(Terminal) 會顯示

但如果：

- In Transit: 沒有資料（狀態：`processing`）
- Dry Ice Refilled(Terminal): checkbox = `true`

**結果**：Dry Ice Refilled(Terminal) 不會顯示（因為 In Transit 狀態不是 `completed`）

---

## 六、Status 欄位顯示邏輯

### 6.1 顯示規則

- **優先順序**：查找 Timeline 中狀態為 `processing` 的**前一個步驟**標題
- 如果找到 Processing 狀態的步驟，Status 顯示該步驟的前一個步驟標題（排除事件）
- 如果沒有 Processing 狀態的步驟，Status 顯示原來的 `shipmentData.status` 值

### 6.2 邏輯流程

```
1. 找到狀態為 processing 的步驟索引
2. 如果找到且索引 > 0
   └─ 從 processing 索引往前找第一個非事件的步驟
   └─ 使用該步驟的標題作為 Status 顯示
3. 如果沒有找到 processing 步驟
   └─ 使用 shipmentData.status 作為 Status 顯示
```

### 6.3 範例

如果 Timeline 是：

- Order Created: `completed`
- Shipment Collected: `completed`
- Origin Customs Process: `completed`
- In Transit: `completed`
- Destination Customs Process: `processing`

**結果**：Status 會顯示「In Transit」（Destination Customs Process 的前一個步驟）

---

## 七、處理流程

### 完整流程圖

```
開始
  ↓
第一輪：找出所有有資料的步驟索引
  ↓
第二輪：處理所有步驟（非事件）
  ├─ 判斷每個步驟的最終狀態
  │  ├─ 有資料 → completed
  │  ├─ 沒有資料 + 是最後一個有資料步驟的下一個 → processing
  │  └─ 其他 → pending
  │
  └─ 記錄步驟狀態到 stepStatusMap
  ↓
第三輪：建立 Timeline 項目
  ├─ 處理步驟
  │  └─ 從 stepStatusMap 取得最終狀態
  │
  └─ 處理事件
     ├─ 檢查 checkbox 是否打勾
     ├─ 檢查前置步驟狀態是否為 completed
     └─ 如果都滿足，顯示事件
  ↓
第四輪：檢查訂單完成狀態
  ├─ 檢查所有步驟是否有資料
  ├─ 檢查 Shipment Delivered 是否有資料
  └─ 如果都滿足，標記所有步驟為訂單完成狀態
  ↓
返回 Timeline 陣列
```

### 步驟狀態判斷詳細流程

```
1. 第一輪：找出所有有資料的步驟
   └─ 記錄 completedStepIndices
   └─ 設定 lastCompletedStepIndex

2. 第二輪：處理所有步驟（非事件）
   For each 步驟:
     a. 檢查欄位是否有資料
     b. 判斷是否為最後一個有資料步驟的下一個
     c. 判斷是否在 Processing 步驟之後
     d. 決定最終狀態 (completed/processing/pending)
     e. 記錄到 stepStatusMap

3. 第三輪：建立 Timeline 項目
   For each 配置項目:
     a. 如果是事件:
        - 檢查 checkbox
        - 檢查前置步驟狀態（從 stepStatusMap）
        - 如果都滿足，顯示事件
     b. 如果是步驟:
        - 從 stepStatusMap 取得最終狀態
        - 建立 Timeline 項目

4. 第四輪：檢查訂單完成狀態
   a. 檢查所有步驟是否有資料
   b. 檢查 Shipment Delivered 是否有資料
   c. 如果都滿足:
      - 將所有步驟的 status 設為 'completed'
      - 將所有步驟的 isOrderCompleted 設為 true
```

---

## 八、特殊情況處理

### 8.1 Processing 之後的步驟

- **規則**：如果當前步驟在 Processing 步驟之後，無論是否有資料，都強制為 `pending`
- **原因**：Processing 節點正在處理中，理論上後續都未發生
- **範例**：
  - In Transit 為 `processing`
  - Destination Customs Process 即使欄位有資料，也強制為 `pending`

### 8.2 事件不影響步驟順序

- 事件（Dry Ice Refilled）不影響下一個步驟的 Processing 狀態判斷
- 例如：In Transit 為 `processing`，即使中間有 Dry Ice Refilled(Terminal) 事件，Destination Customs Process 仍會正確判斷為 `pending`

### 8.3 狀態判斷的優先順序

1. 先判斷是否有資料 → `completed`
2. 再判斷是否為 Processing 之後 → 強制 `pending`
3. 最後判斷是否為下一個待處理步驟 → `processing`

---

## 九、前端顯示差異

### 9.1 Basic 版本

- **只顯示 4 個基本步驟**（排除事件）
- **步驟列表**：
  1. Order Created
  2. Shipment Collected
  3. In Transit
  4. Shipment Delivered
- **不顯示事件**：所有事件（Dry Ice Refilled(Terminal)、Dry Ice Refilled）都不會在 Basic 版本中顯示
- **過濾邏輯**：只顯示定義在 `basicSteps` 陣列中的步驟
- **用途**：簡化版，適合只需要基本追蹤資訊的客戶

### 9.2 Standard 版本

Standard 版本根據 **Transport Type** 欄位來決定顯示的 Timeline 內容：

#### 9.2.1 Transport Type = Domestic

- **只顯示 4 個步驟**（排除事件）
- **步驟列表**：
  1. Order Created
  2. Shipment Collected
  3. In Transit
  4. Shipment Delivered
- **不顯示事件**：所有事件（Dry Ice Refilled(Terminal)、Dry Ice Refilled）都不會顯示
- **過濾邏輯**：只顯示定義在 `domesticSteps` 陣列中的步驟，排除所有事件

##### Domestic 特殊邏輯

**欄位檢查範圍**：

- 在 Domestic 情況下，系統**只檢查**以下 4 個欄位：
  1. Order Created
  2. Shipment Collected
  3. In Transit
  4. Shipment Delivered
- **不檢查其他欄位**：系統不會檢查以下欄位（即使 Airtable 中有資料）：
  - Origin Customs Process
  - Destination Customs Process
  - Out for Delivery
  - 所有事件欄位（Dry Ice Refilled(Terminal)、Dry Ice Refilled）

**狀態判斷邏輯**：

- 與 Standard 版本相同，但**只針對上述 4 個步驟**進行判斷
- 狀態判斷順序：
  1. 有資料的步驟 → `completed`
  2. 最後一個有資料步驟的下一個步驟（無資料）→ `processing`
  3. Processing 之後的所有步驟 → `pending`（即使有資料也強制為 `pending`）

**訂單完成判斷**：

- 只檢查上述 4 個步驟是否有資料
- 特別檢查 `Shipment Delivered` 是否有資料
- 如果所有 4 個步驟都有資料，且 `Shipment Delivered` 有資料，則訂單完成
- **不檢查**其他欄位（Origin Customs Process、Destination Customs Process、Out for Delivery）

**範例**：
假設 Domestic 資料如下：

- Order Created: 有資料（2025-10-16 21:51）
- Shipment Collected: 有資料（2025-11-02 13:59）
- In Transit: 無資料
- Shipment Delivered: 無資料

**結果**：

- Order Created: `completed`
- Shipment Collected: `completed`
- In Transit: `processing`（最後一個有資料步驟的下一個）
- Shipment Delivered: `pending`（Processing 之後）

**注意**：即使 Airtable 中其他欄位（如 Origin Customs Process、Destination Customs Process）有資料，系統也不會檢查這些欄位，因為它們不屬於 Domestic 的 4 個步驟範圍。

#### 9.2.2 Transport Type = Export / Import / Cross

- **顯示所有項目**（包括事件和步驟）
- **步驟列表**：7 個步驟
  1. Order Created
  2. Shipment Collected
  3. Origin Customs Process
  4. In Transit
  5. Destination Customs Process
  6. Out for Delivery
  7. Shipment Delivered
- **事件列表**：2 個事件
  - Dry Ice Refilled(Terminal) - 位於 In Transit 之後
  - Dry Ice Refilled - 位於 Destination Customs Process 之後
- **事件顯示**：事件顯示為圓點（●）
- **步驟顯示**：步驟顯示為數字編號

### 9.3 Transport Type 判斷邏輯

#### 後端邏輯（`airtable.js`）

```
1. 讀取 shipmentFields 中的 Transport Type 欄位
2. 判斷是否為 "Domestic"
   └─ 如果是 Domestic:
      ├─ timelineConfig 只包含 4 個步驟（Order Created, Shipment Collected, In Transit, Shipment Delivered）
      ├─ 不包含任何事件配置
      ├─ 狀態判斷只針對這 4 個步驟
      └─ 訂單完成判斷只檢查這 4 個步驟

   └─ 如果是 Export/Import/Cross:
      ├─ timelineConfig 包含 7 個步驟 + 2 個事件
      ├─ 狀態判斷針對所有步驟
      └─ 訂單完成判斷檢查所有步驟（排除事件）
3. 根據 timelineConfig 生成 Timeline
```

#### 前端邏輯（`standard.pug`）

```
1. 讀取 shipmentData.transportType 欄位
2. 判斷是否為 "Domestic"
   └─ 如果是 Domestic:
      ├─ 過濾 timeline，只保留 4 個步驟（Order Created, Shipment Collected, In Transit, Shipment Delivered）
      ├─ 排除所有事件
      └─ 顯示過濾後的 Timeline

   └─ 如果是 Export/Import/Cross:
      └─ 顯示所有項目（包括事件和步驟）
3. 根據過濾結果顯示 Timeline
```

---

## 十、資料來源

### 10.1 Airtable 表格

- **表格名稱**：由環境變數 `AIRTABLE_SHIPMENTS_TABLE` 指定（預設：`Tracking`）
- **欄位對應**：
  - `Job No.` / `Job No` / `JobNo` → orderNo
  - `Tracking No.` / `Tracking No` / `TrackingNo` → trackingNo
  - 步驟名稱直接對應欄位名稱（例如：`In Transit` → `In Transit`）

### 10.2 查詢邏輯

- 使用 `filterByFormula` 查詢符合 `orderNo` 和 `trackingNo` 的記錄
- 如果找到記錄，從該記錄的欄位生成 Timeline
- 如果找不到記錄，返回 "No record found"

---

## 十一、API 端點

### 11.1 本地測試

- **URL**: `http://localhost:3001/api/tracking`
- **參數**:
  - `orderNo`: Job No.（例如：TM111695）
  - `trackingNo`: Tracking No.（例如：X73K1UN6）
  - `apiKey`: 可選的 API Key（用於增強速率限制）

### 11.2 生產環境

- **URL**: `/api/tracking`
- 使用 Netlify Functions 處理請求

---

## 十二、測試資料

### 12.1 預設測試資料

- **Job No.**: TM111695
- **Tracking No.**: X73K1UN6

### 12.2 測試結果範例

對於 `TM111695/X73K1UN6`：

- Order Created: `completed` (2025-09-19 11:22)
- Shipment Collected: `completed` (2025-10-07 13:04)
- Origin Customs Process: `completed` (2025-10-08 12:00)
- In Transit: `processing` (Processing...)
- Destination Customs Process: `pending` (Pending...，即使欄位有資料)
- Out for Delivery: `pending` (Pending...)
- Shipment Delivered: `pending` (Pending...)

---

## 十三、Domestic 情況特殊處理

### 13.1 欄位檢查範圍

在 Domestic 情況下，系統只檢查以下 4 個欄位，不檢查其他欄位：

**檢查的欄位**：

1. Order Created
2. Shipment Collected
3. In Transit
4. Shipment Delivered

**不檢查的欄位**（即使 Airtable 中有資料）：

- Origin Customs Process
- Destination Customs Process
- Out for Delivery
- Dry Ice Refilled(Terminal)
- Dry Ice Refilled

### 13.2 狀態判斷邏輯（Domestic）

Domestic 情況下的狀態判斷邏輯與 Standard 相同，但只針對 4 個步驟：

1. **有資料 → Completed**

   - 如果 4 個步驟中的任何一個有日期時間資料，狀態為 `completed`

2. **最後一個有資料步驟的下一個 → Processing**

   - 找出最後一個有資料的步驟（在 4 個步驟中）
   - 該步驟的下一個步驟（無資料），狀態為 `processing`

3. **Processing 之後的步驟 → Pending**
   - Processing 之後的所有步驟，無論是否有資料，狀態都強制為 `pending`

### 13.3 訂單完成判斷（Domestic）

Domestic 情況下的訂單完成判斷：

- 只檢查上述 4 個步驟是否有資料
- 特別檢查 `Shipment Delivered` 是否有資料
- 如果所有 4 個步驟都有資料，且 `Shipment Delivered` 有資料，則訂單完成
- **不檢查**其他欄位（Origin Customs Process、Destination Customs Process、Out for Delivery）

### 13.4 範例（Domestic）

**情況 1**：部分步驟有資料

- Order Created: 有資料（2025-10-16 21:51）→ `completed`
- Shipment Collected: 有資料（2025-11-02 13:59）→ `completed`
- In Transit: 無資料 → `processing`（最後一個有資料步驟的下一個）
- Shipment Delivered: 無資料 → `pending`（Processing 之後）

**情況 2**：所有步驟都有資料

- Order Created: 有資料 → `completed`
- Shipment Collected: 有資料 → `completed`
- In Transit: 有資料 → `completed`
- Shipment Delivered: 有資料 → `completed` + `isOrderCompleted: true`（訂單完成）

**注意**：即使 Airtable 中其他欄位（如 Origin Customs Process、Destination Customs Process）有資料，系統也不會檢查這些欄位，因為它們不屬於 Domestic 的 4 個步驟範圍。

---

## 十四、版本資訊

- **建立日期**: 2025-11-04
- **最後更新**: 2025-11-04
- **版本**: 2.2
- **更新內容**:
  - 簡化文件結構，專注於邏輯說明
  - 移除詳細的樣式說明
  - 新增快速開始指南
  - 新增訂單完成狀態判斷邏輯
  - 新增 Status 欄位顯示邏輯
  - 新增前端顯示差異說明（Basic 版本只顯示 4 個步驟）
  - **新增 Domestic 情況特殊處理邏輯**（只檢查 4 個欄位，不檢查其他欄位）
  - **新增 Domestic 狀態判斷和訂單完成判斷邏輯**

---

## 附錄：完整邏輯流程

### 事件顯示完整流程

```
1. 檢查 checkbox 是否打勾
   └─ 如果沒有打勾 → 跳過

2. 檢查前置步驟狀態
   ├─ Dry Ice Refilled(Terminal)
   │  └─ 檢查 In Transit 狀態（從 stepStatusMap）
   │     └─ 必須為 'completed'
   │
   └─ Dry Ice Refilled
      └─ 檢查 Destination Customs Process 狀態（從 stepStatusMap）
         └─ 必須為 'completed'

3. 如果前置條件滿足
   ├─ 取得事件時間（優先順序：日期欄位 > Last Modified > 當前時間）
   └─ 顯示事件
```

---

此文件記錄了 Timeline 時間軸的完整運作邏輯，專注於邏輯說明，讓客戶能夠理解系統如何運作。
