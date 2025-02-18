import React from "react";

const ScheduleComponent = ({ schedule, user, currday }) => {
  let day = 0;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 bg-gradient-to-r from-blue-600 via--500 to-green-400">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-white text-center">Your Schedule</h2>
      <ul className="divide-y divide-gray-200">
        {schedule.map((cls, index) => {
          if (currday === cls.day && user.semester === cls.semester) {
            day += 1;
            return (
              <li
                key={cls._id || index}
                className={`py-4 flex flex-col ${
                  cls.cancelled ? "bg-red-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  {day === 1 && (
                    <span className="text-lg font-medium text-gray-700">
                      {cls.day}
                    </span>
                  )}
                  {cls.cancelled && (
                    <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                      Cancelled
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex space-x-2 text-gray-600">
                    <span className="font-medium">{cls.startTime}</span>
                    <span className="text-gray-500">-</span>
                    <span className="font-medium">{cls.endTime}</span>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="text-lg text-gray-800">{cls.className}</span>
                  </div>
                </div>
              </li>
            );
          }
          return null;
        })}
      </ul>
      <div className="mt-4 text-center text-gray-500">No classes on Sunday</div>
    </div>
  );
};

export default ScheduleComponent;
