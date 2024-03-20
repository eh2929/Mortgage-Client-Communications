import React, { useState } from "react";


function Comments({ comments }) {
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(comments);

  const handleAddComment = () => {
    fetch("http://127.0.0.1:5555/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: newComment }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newCommentWithDate = { ...data, date: new Date().toLocaleString()}
        setAllComments([...allComments, newCommentWithDate]);
        setNewComment("");
      });
  };

  return (
    <div>
      {allComments.map((comment, index) => (
        <div key={index}>
          <p>{comment.comment}</p>
          <p>Date: {comment.date}</p>
        </div>
      ))}
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
}

export default Comments;
