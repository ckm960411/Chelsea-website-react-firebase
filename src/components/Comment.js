import CommentForm from "./CommentForm";
import { useEffect, useState } from "react";
import { Input } from "antd";
import styled from "styled-components";
import "styles/Comment.scss";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { dbService } from "fireBase";
import { useNavigate } from "react-router";

const { TextArea } = Input;

const CommentInput = styled(TextArea)`
  display: block;
  width: 100%;
  padding: 4px 10px 4px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 16px;
  &::placeholder {
    font-size: 16px;
  }
`;
function Comment({ userObj, playerObj }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const onChange = (event) => {
    setComment(event.target.value);
  };

  // 댓글을 추가하는 핸들러
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName === null) {
      const ok = window.confirm(
        "닉네임을 먼저 Profile 에서 설정하세요. Profile 설정 페이지로 이동하시겠습니까?"
      );
      if (ok) {
        navigate("/profile");
      }
      setComment("");
      return;
    }
    if (comment === "") return;
    const commentObj = {
      playerName: playerObj.playerName,
      comment,
      creatorId: userObj.uid,
      createdAt: Date.now(),
      reply: [],
      likes: [],
    };
    await addDoc(collection(dbService, "comments"), commentObj)
      .then()
      .catch((err) => console.log(err.resultMessage));
    setComment("");
  };

  const searchComments = async () => {
    const commentsRef = collection(dbService, "comments");
    const queryInstance = query(
      commentsRef,
      where("playerName", "==", playerObj.playerName),
      orderBy("createdAt", "asc")
    );
    onSnapshot(queryInstance, (snapshot) => {
      const commentsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsArray);
    });
  };

  const onClearComment = () => setComment("");

  useEffect(() => {
    searchComments();
    return () => setComments([]);
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <CommentInput
          value={comment}
          onChange={onChange}
          placeholder="How do you think about this player?"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
        <div className="comment__btns">
          <button className="comment__btn" onClick={onClearComment}>
            Clear
          </button>
          <button className="comment__btn">Add Comment</button>
        </div>
      </form>
      <div className="comment__container">
        {comments.map((comment, i) => (
          <CommentForm
            userObj={userObj}
            CommentInput={CommentInput}
            comment={comment}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

export default Comment;
