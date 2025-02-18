import React from "react";
import "./recentAnnouncements.css";

const RecentAnnouncements = ({ announcements }) => {
  return (
    <div className="recent-announcements-container">
      <h2 className="announcement-heading">Recent Announcements</h2>
      <ul className="announcement-list">
        {announcements.map((announcement, index) => (
          <li key={index} className="announcement-item">
            <div>
              <strong>{announcement.message}</strong>
              <br />
              <small>{announcement.authorName}</small>
              <small>Posted on: {new Date(announcement.createdAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentAnnouncements;
