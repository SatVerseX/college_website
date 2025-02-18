import React from "react";
import MarkLeave from "./MarkLeave";
import PostAnnouncement from "./PostAnnouncement";
import "./modern.css";

const Actions = () => {
  return (
    <section className="actions">
      <MarkLeave />
      <PostAnnouncement />
    </section>
  );
};

export default Actions;
