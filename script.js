// 導入 google-spreadsheet 套件
const { GoogleSpreadsheet } = require('google-spreadsheet');

// 設定試算表 ID
const spreadsheetId = '15ov6YOQw0NJywCCWYd6dTxV7EgFydpj0jQO8M-GYzFI'; // 請將這裡替換為你的試算表 ID

// Google 服務帳戶的憑證 JSON 檔案路徑
const CREDENTIALS = require('./recipe-app-436609-91795b95b133.json'); // 替換為你的憑證檔案路徑

async function accessSpreadsheet() {
    // 建立 Google 試算表物件
    const doc = new GoogleSpreadsheet(spreadsheetId);

    // 使用服務帳戶進行驗證
    await doc.useServiceAccountAuth(CREDENTIALS);

    // 加載試算表資訊
    await doc.loadInfo();
    console.log(`試算表名稱: ${doc.title}`);

    // 讀取指定範圍的資料 (例如 A2:D)
    const sheet = doc.sheetsByIndex[0]; // 獲取第一個工作表
    const rows = await sheet.getRows({ offset: 1, limit: 50 }); // 假設要讀取 A2 到 D 的資料
    const list = document.getElementById('recipe-list');
    list.innerHTML = '';
    rows.forEach(row => {
        const li = document.createElement('li');
        li.textContent = `材料: ${row.材料}, 數量: ${row.數量}, 單價: ${row.單價}, 總成本: ${row.總成本}`;
        list.appendChild(li);
    });
}

// 新增資料到試算表
async function addRecipe() {
    const ingredient = document.getElementById('ingredient').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const totalCost = quantity * price;

    if (!ingredient || !quantity || !price) {
        alert('請填寫所有欄位');
        return;
    }

    const values = [{ 材料: ingredient, 數量: quantity, 單價: price, 總成本: totalCost }];
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useServiceAccountAuth(CREDENTIALS);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRows(values);
    alert('資料已新增');
    accessSpreadsheet(); // 重新讀取試算表資料
}

// 當頁面加載完成時，自動讀取試算表資料
document.addEventListener('DOMContentLoaded', accessSpreadsheet);
