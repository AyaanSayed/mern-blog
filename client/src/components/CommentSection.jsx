import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { set } from "mongoose";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentInput.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentInput,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentInput("");
        setComments([data, ...comments]);
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    async function getComments() {
      const res = await fetch(`/api/comment/getPostComments/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    }
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    const res = await fetch(`/api/comment/likeComment/${commentId}`, {
      method: "PUT",
    });
    if (res.ok) {
      const data = await res.json();
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
            : comment
        )
      );
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) => (c._id === comment._id ? { ...c, content: editedContent } : c))
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-3 w-full">
      {/* Rest of your code before the form remains unchanged */}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 p-3 rounded-md"
        >
          <Textarea
            placeholder="Leave a comment..."
            maxLength="200"
            rows="3"
            value={commentInput}
            onChange={(e) => {
              setCommentInput(e.target.value);
            }}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - commentInput.length} characters left
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-500 rounded-sm px-2 py-1">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit}/>
          ))}
        </>
      )}
    </div>
  );
}
