import React from "react";


const LeaveStatusComponent = ({ leaveStatus }) => {
  return (
    <div className="card bg-gradient-to-r from-red-400 to-pink-400">
      <h2 className="text-white text-center">Professor Leave Status</h2>
      <ul className="leave-status-list15 ">
        {leaveStatus.length > 0 ? (
          leaveStatus.map((leave, index) => (
            <li key={leave._id || index} className="bg-gradient-to-r from-red-400 to-pink-400 text-white text-center border rounded-sm p-2 mr-7 grid gap-2" >
              <span className="">
                {new Date(leave.startDate).toLocaleDateString()} - {" "}
                {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "Ongoing"}
              </span>
              <span className="leave-status15">
                {leave.professorName} is on leave
              </span>
            </li>
          ))
        ) : (
          <p>No professors on leave currently.</p>
        )}
      </ul>
    </div>
  );
};

export default LeaveStatusComponent;