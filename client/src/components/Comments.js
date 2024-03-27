import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

function Comments({ comments, loanApplicationId }) {
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(comments);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/comments?loanId=${loanApplicationId}`)
      .then((response) => response.json())
      .then((data) => setAllComments(data));
  }, [loanApplicationId]);

  const userId = localStorage.getItem("userId");

  const handleAddComment = (loanApplicationId) => {
    fetch("http://127.0.0.1:5555/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: newComment,
        loan_application_id: loanApplicationId,
        user_id: userId, // Include the user_id in the request body
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newCommentWithDate = {
          ...data,
          date: new Date().toLocaleString(),
        };
        setAllComments([...allComments, newCommentWithDate]);
        setNewComment("");
      });
  };
  const startEditing = (id, currentText) => {
    setEditingCommentId(id);
    setEditedCommentText(currentText);
  };

  const submitEdit = (id) => {
    fetch(`http://127.0.0.1:5555/comments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: editedCommentText,
        editedAt: new Date().toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedComments = allComments.map((comment) =>
          comment.id === id ? data : comment
        );
        setAllComments(updatedComments);
        setEditingCommentId(null);
        setEditedCommentText("");
      });
  };

  const startDeleting = (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      fetch(`http://127.0.0.1:5555/comments/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedComments = allComments.filter(
            (comment) => comment.id !== id
          );
          setAllComments(updatedComments);
        });
    }
  };

  return (
    <div className="comments-container py-8 w-full">
      {allComments.map((comment, index) => {
        return (
          <div
            key={index}
            className="comment bg-gray-800 p-4 rounded shadow mt-4"
          >
            {editingCommentId === comment.id ? (
              <>
                <input
                  type="text"
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                  className="border p-2 rounded"
                />
                <Button
                  onClick={() => submitEdit(comment.id)}
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Submit Edit
                </Button>
              </>
            ) : (
              <>
                <p>{comment.comment}</p>
                <p>
                  Posted by: {comment.user ? comment.user.username : "Unknown"}
                </p>
                <p>Date: {new Date(comment.date).toLocaleString()}</p>
                {comment.editedAt && (
                  <p>
                    Edited at: {new Date(comment.editedAt).toLocaleString()}
                  </p>
                )}
                <Button
                  onClick={() => startEditing(comment.id, comment.comment)}
                  className="bg-blue-500 text-white p-2 rounded mt-2 mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => startDeleting(comment.id)}
                  className="bg-red-500 text-white p-2 rounded mt-2"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        );
      })}
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="border bg-gray-800 p-2 rounded mt-4"
      />
      <button
        onClick={() => handleAddComment(loanApplicationId)}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Add Comment
      </button>
    </div>
  );
}

export default Comments;
