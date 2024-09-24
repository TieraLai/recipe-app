const spreadsheetId = '15ov6YOQw0NJywCCWYd6dTxV7EgFydpj0jQO8M-GYzFI/edit?gid=0#gid=0'; // 請將這裡替換為你的試算表 ID
const apiKey = 'AIzaSyAfv65VHQCrOMmBAsE9vci-X3Hs_ViTpWk'; // 請將這裡替換為你的 API 金鑰

// 初始化 Google API 客戶端
function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
        readSheet();
    });
}

// 讀取試算表資料
function readSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A2:D',
    }).then(response => {
        const data = response.result.values;
        const list = document.getElementById('recipe-list');
        list.innerHTML = '';
        if (data) {
            data.forEach(row => {
                const li = document.createElement('li');
                li.textContent = `材料: ${row[0]}, 數量: ${row[1]}, 單價: ${row[2]}, 總成本: ${row[3]}`;
                list.appendChild(li);
            });
        }
    }).catch(error => {
        console.error('讀取失敗', error);
    });
}

// 新增資料到試算表
function addRecipe() {
    const ingredient = document.getElementById('ingredient').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const totalCost = quantity * price;

    if (!ingredient || !quantity || !price) {
        alert('請填寫所有欄位');
        return;
    }

    const values = [[ingredient, quantity, price, totalCost]];
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
    }).then(response => {
        alert('資料已新增');
        readSheet();
    }).catch(error => {
        console.error('新增失敗', error);
    });
}

// 載入並初始化 Google API
gapi.load('client', initClient);
