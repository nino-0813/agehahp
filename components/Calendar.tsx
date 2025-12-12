import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['月', '火', '水', '木', '金', '土', '日'];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday. We want 0 = Monday.
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
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
      days.push({
        date: i,
        // Mock logic for closed days (Wed/Thu)
        isClosed: [2, 3].includes((new Date(year, month, i).getDay() + 6) % 7) // Tue is index 1 in our 0-Mon array? No, simpler: 0=Mon, 2=Wed, 3=Thu.
      });
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
    <div className="bg-white p-6 md:p-10 rounded-sm shadow-sm max-w-4xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div className="flex items-baseline gap-4 font-serif">
          <span className="text-4xl md:text-5xl font-medium tracking-widest text-dark">
            {currentDate.getFullYear()}
          </span>
          <span className="text-3xl md:text-4xl text-primary font-medium">
            {currentDate.getMonth() + 1}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-secondary">
            <ChevronLeft />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-secondary">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-4">
        {DAYS.map((day, i) => (
          <div key={day} className={`text-center py-2 font-medium ${i >= 5 ? 'text-red-400' : 'text-gray-500'}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 border-t border-l border-gray-100">
        {calendarDays.map((day, idx) => (
          <div key={idx} className="bg-white min-h-[80px] md:min-h-[100px] p-2 relative border-b border-r border-gray-100">
            {day && (
              <>
                <span className={`text-lg font-serif ${
                  (idx % 7) >= 5 ? 'text-red-400' : 'text-gray-700'
                }`}>
                  {day.date}
                </span>
                {day.isClosed && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      休業日
                    </span>
                  </div>
                )}
                {/* Randomly add "Full" status for demo */}
                {!day.isClosed && Math.random() > 0.8 && (
                   <div className="mt-1">
                   <span className="inline-block text-red-400 text-xs">
                     貸切
                   </span>
                 </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row gap-8 text-sm text-gray-600 font-sans leading-relaxed">
         <div className="flex-1">
            <h4 className="font-bold mb-2 text-dark">営業時間</h4>
            <div className="space-y-1">
              <p>月曜日: 8時00分 ～ 17時00分</p>
              <p>火曜日: 8時00分 ～ 17時00分</p>
              <p>水曜日: 8時00分 ～ 17時00分</p>
              <p>木曜日: 8時00分 ～ 17時00分</p>
              <p>金曜日: 8時00分 ～ 21時00分</p>
              <p>土曜日: 8時00分 ～ 21時00分</p>
            </div>
         </div>
         <div className="flex-1">
            <h4 className="font-bold mb-2 text-dark">定休日</h4>
            <p>日曜日</p>
            <p className="text-xs mt-1 text-gray-400">※貸切やイベント開催により変更がございます。</p>
         </div>
      </div>
    </div>
  );
};

export default Calendar;