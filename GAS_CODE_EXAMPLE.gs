// Google Apps Script のコード例
// スプレッドシートのデータをJSON形式で返す

function doGet(e) {
  try {
    // スプレッドシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // ヘッダー行を取得
    const headers = values[0];
    const dateIndex = headers.indexOf('日付');
    
    // データ行を処理
    const events = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // 空行をスキップ
      if (!row[dateIndex]) continue;
      
      const event = {};
      
      // 各列を処理
      headers.forEach((header, index) => {
        let value = row[index];
        
        // 日付列の処理（重要）
        if (header === '日付') {
          if (value instanceof Date) {
            // Dateオブジェクトの場合、日本時間（JST）で文字列に変換
            // スプレッドシートの日付は既にローカル時間（日本時間）として保存されている
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const day = String(value.getDate()).padStart(2, '0');
            value = `${year}-${month}-${day}`;
          } else if (typeof value === 'string') {
            // 文字列の場合、そのまま使用（既にYYYY-MM-DD形式であることを想定）
            // YYYY/MM/DD形式の場合は変換
            if (value.includes('/')) {
              value = value.replace(/\//g, '-');
            }
          }
        }
        
        event[header] = value || '';
      });
      
      events.push(event);
    }
    
    // JSON形式で返す
    const output = ContentService.createTextOutput(JSON.stringify(events));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    const errorOutput = ContentService.createTextOutput(JSON.stringify({ error: error.toString() }));
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

