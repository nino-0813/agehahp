import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const DAYS = ['月', '火', '水', '木', '金', '土', '日'];

interface CalendarEvent {
  date: string; // YYYY-MM-DD形式
  type: '特別メニュー' | 'イベント' | '休業' | '貸切' | 'お知らせ' | '';
  title: string;
  description?: string;
  imageUrl?: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday. We want 0 = Monday.
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  // 日付をYYYY-MM-DD形式に変換（様々な形式に対応）
  const formatDateFromISO = (dateValue: string | Date): string => {
    if (!dateValue) return '';
    
    try {
      // 既にYYYY-MM-DD形式の文字列の場合
      if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
      }
      
      // YYYY/MM/DD形式の文字列の場合（例: "2025/12/17"）
      if (typeof dateValue === 'string' && /^\d{4}\/\d{2}\/\d{2}$/.test(dateValue)) {
        return dateValue.replace(/\//g, '-');
      }
      
      // ISO形式の文字列の場合（例: "2025-12-17T15:00:00.000Z"）
      if (typeof dateValue === 'string' && dateValue.includes('T')) {
        // UTC時間として解釈されるため、日本時間（JST = UTC+9）に変換
        const date = new Date(dateValue);
        // UTC時間を取得して、日本時間に変換（UTC+9時間）
        const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
        const year = jstDate.getUTCFullYear();
        const month = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(jstDate.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      // Dateオブジェクトの場合
      if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      // その他の文字列形式の場合
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          // 日本時間として解釈（ローカル時間を使用）
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
      }
      
      return String(dateValue);
    } catch (error) {
      console.error('日付変換エラー:', error, dateValue);
      return String(dateValue);
    }
  };

  // スプレッドシートからデータを取得
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        // Google Apps ScriptのWebアプリURL
        const apiUrl = 'https://script.google.com/macros/s/AKfycbyIumjypDi86ZVdnCqjDQlfk5nyeRSuosofbRNPNvSpr7pXmkhIipqtnqf5iEckHWMBuw/exec';
        
        // 直接アクセス（Google Apps Scriptが「誰でもアクセス可能」に設定されている場合）
        const response = await fetch(apiUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('APIレスポンス:', data);
        
        // データ形式: [{"日付":"2025-12-14T15:00:00.000Z","タイプ":"特別メニュー",...}, ...]
        if (Array.isArray(data)) {
          const parsedEvents: CalendarEvent[] = data
            .filter((item: any) => item && item['日付']) // 空のデータを除外
            .map((item: any) => {
              const formattedDate = formatDateFromISO(item['日付'] || '');
              console.log('日付変換:', item['日付'], '->', formattedDate);
              return {
                date: formattedDate,
                type: (item['タイプ'] || '') as CalendarEvent['type'],
                title: item['タイトル'] || '',
                description: item['説明'] || '',
                imageUrl: item['画像URL'] || undefined,
              };
            });
          
          console.log('パースされたイベント:', parsedEvents);
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error('カレンダーデータの取得エラー:', error);
        // エラー時は空の配列を設定
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCalendarData();
  }, []);
  
  // モーダルが開いている時はbodyのスクロールを無効化
  useEffect(() => {
    if (selectedEvent) {
      // 現在のスクロール位置を保存
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // スクロール位置を復元
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      // クリーンアップ
      if (!selectedEvent) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };
  }, [selectedEvent]);
  
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEvent) {
        setSelectedEvent(null);
      }
    };
    
    if (selectedEvent) {
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [selectedEvent]);

  // 日付文字列をYYYY-MM-DD形式に変換
  const formatDate = (year: number, month: number, day: number): string => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  // Google DriveのURLを画像表示用に変換
  const convertImageUrl = (url: string): string => {
    if (!url) return '';
    
    // Google DriveのURLの場合、画像表示用に変換
    if (url.includes('drive.google.com')) {
      let fileId = '';
      
      // uc?id= 形式からIDを抽出（優先）
      if (url.includes('uc?id=') || url.includes('uc?&id=')) {
        const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      }
      // /d/FILE_ID 形式からIDを抽出
      else if (url.includes('/d/')) {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      }
      // その他の id= パラメータからIDを抽出
      else {
        const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      }
      
      // ファイルIDが見つかった場合、複数の方法を試す
      if (fileId) {
        // 方法1: thumbnail APIを使用（推奨）
        // サイズを指定してサムネイルを取得（sz=w1000 で最大幅1000px）
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }
    }
    
    return url;
  };

  // 特定の日付のイベントを取得
  const getEventForDate = (year: number, month: number, day: number): CalendarEvent | undefined => {
    const dateStr = formatDate(year, month, day);
    const event = events.find(event => event.date === dateStr);
    if (event) {
      console.log(`日付 ${dateStr} のイベント:`, event);
    }
    return event;
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const event = getEventForDate(year, month, i);
      const dayOfWeek = (new Date(year, month, i).getDay() + 6) % 7; // 0=月曜日, 6=日曜日
      
      days.push({
        date: i,
        // 日曜日は休業日（デフォルト）
        isClosed: !event && dayOfWeek === 6, // 6=日曜日
        event: event,
      } as { date: number; isClosed: boolean; event?: CalendarEvent });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-sm shadow-sm max-w-4xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 border-b border-gray-200 pb-3 sm:pb-4">
        <div className="flex items-baseline gap-2 sm:gap-4 font-serif">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-widest text-dark">
            {currentDate.getFullYear()}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-medium">
            {currentDate.getMonth() + 1}
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button onClick={handlePrevMonth} className="p-2 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-secondary touch-manipulation">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={handleNextMonth} className="p-2 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-secondary touch-manipulation">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2 sm:mb-4">
        {DAYS.map((day, i) => (
          <div key={day} className={`text-center py-1 sm:py-2 text-xs sm:text-sm font-medium ${i >= 5 ? 'text-red-400' : 'text-gray-500'}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 border-t border-l border-gray-100">
        {calendarDays.map((day, idx) => {
          const dayOfWeek = idx % 7;
          const isWeekend = dayOfWeek >= 5;
          
          return (
            <div 
              key={idx} 
              className={`bg-white min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[100px] p-1 sm:p-2 relative border-b border-r border-gray-100 ${
                day?.event ? 'hover:bg-gray-50 cursor-pointer' : ''
              }`}
              onClick={() => {
                if (day?.event) {
                  setSelectedEvent(day.event);
                }
              }}
            >
              {day && (
                <>
                  <span className={`text-sm sm:text-base md:text-lg font-serif ${
                    isWeekend ? 'text-red-400' : 'text-gray-700'
                  }`}>
                    {day.date}
                  </span>
                  
                  {/* スプレッドシートからのイベント情報を表示 */}
                  {day.event && (
                    <div className="mt-1 sm:mt-2 space-y-0.5">
                      {day.event.type === '休業' && (
                        <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-500 text-[10px] sm:text-xs rounded">
                          休業日
                        </span>
                      )}
                      {day.event.type === '貸切' && (
                        <span className="inline-block text-red-400 text-[10px] sm:text-xs">
                          貸切
                        </span>
                      )}
                      {(day.event.type === '特別メニュー' || day.event.type === '') && (
                        <div className="space-y-0.5">
                          <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary text-[10px] sm:text-xs rounded">
                            {day.event.title || '特別メニュー'}
                          </span>
                          {day.event.description && (
                            <p className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-1">
                              {day.event.description}
                            </p>
                          )}
                        </div>
                      )}
                      {day.event.type === 'イベント' && (
                        <div className="space-y-0.5">
                          <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-600 text-[10px] sm:text-xs rounded">
                            {day.event.title || 'イベント'}
                          </span>
                          {day.event.description && (
                            <p className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-1">
                              {day.event.description}
                            </p>
                          )}
                        </div>
                      )}
                      {day.event.type === 'お知らせ' && (
                        <div className="space-y-0.5">
                          <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-50 text-yellow-700 text-[10px] sm:text-xs rounded">
                            {day.event.title || 'お知らせ'}
                          </span>
                          {day.event.description && (
                            <p className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-1">
                              {day.event.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* イベントがない場合のデフォルト表示（水・木は休業日） */}
                  {!day.event && day.isClosed && (
                    <div className="mt-1 sm:mt-2">
                      <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-500 text-[10px] sm:text-xs rounded">
                        休業日
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {loading && (
        <div className="text-center py-4 text-sm text-gray-500">
          データを読み込み中...
        </div>
      )}
      
      <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
         <div className="flex-1">
            <h4 className="font-bold mb-2 sm:mb-3 text-dark text-sm sm:text-base">営業時間</h4>
            <div className="space-y-0.5 sm:space-y-1">
              <p>月曜日: 8時00分 ～ 17時00分</p>
              <p>火曜日: 8時00分 ～ 17時00分</p>
              <p>水曜日: 8時00分 ～ 17時00分</p>
              <p>木曜日: 8時00分 ～ 17時00分</p>
              <p>金曜日: 8時00分 ～ 21時00分</p>
              <p>土曜日: 8時00分 ～ 21時00分</p>
            </div>
         </div>
         <div className="flex-1">
            <h4 className="font-bold mb-2 sm:mb-3 text-dark text-sm sm:text-base">定休日</h4>
            <p>日曜日</p>
            <p className="text-[10px] sm:text-xs mt-1 text-gray-400">※貸切やイベント開催により変更がございます。</p>
         </div>
      </div>
      
      {/* イベント詳細モーダル */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
          onClick={() => {
            setSelectedEvent(null);
          }}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-sm overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-serif">
                {selectedEvent.type && selectedEvent.type !== '' ? selectedEvent.type : 'イベント詳細'}
              </h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedEvent(null);
                }}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors touch-manipulation z-10"
                aria-label="閉じる"
                type="button"
              >
                <X className="w-6 h-6 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {selectedEvent.imageUrl && selectedEvent.imageUrl.trim() !== '' && (
                <div className="mb-4 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center">
                  {(() => {
                    const imageUrl = convertImageUrl(selectedEvent.imageUrl);
                    console.log('元のURL:', selectedEvent.imageUrl);
                    console.log('変換後のURL:', imageUrl);
                    return (
                      <img 
                        src={imageUrl} 
                        alt={selectedEvent.title}
                        className="max-w-full h-auto max-h-[300px] object-contain rounded-sm"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          console.error('画像の読み込みエラー');
                          console.error('元のURL:', selectedEvent.imageUrl);
                          console.error('変換後のURL:', imageUrl);
                          
                          // フォールバック: export=view を試す
                          const fileIdMatch = selectedEvent.imageUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                          if (fileIdMatch && fileIdMatch[1]) {
                            const fallbackUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
                            console.log('フォールバックURLを試行:', fallbackUrl);
                            e.currentTarget.src = fallbackUrl;
                            return;
                          }
                          
                          // それでも失敗した場合
                          const img = e.currentTarget;
                          img.style.display = 'none';
                          const parent = img.parentElement;
                          if (parent && !parent.querySelector('.error-message')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-message text-center py-4 text-sm text-gray-500';
                            errorDiv.textContent = '画像を読み込めませんでした。Google Driveの共有設定を確認してください。';
                            parent.appendChild(errorDiv);
                          }
                        }}
                        onLoad={() => {
                          console.log('画像の読み込み成功');
                        }}
                      />
                    );
                  })()}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl sm:text-2xl font-serif mb-2 text-primary">
                    {selectedEvent.title}
                  </h4>
                  {selectedEvent.description && (
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500">
                    日付: {selectedEvent.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;