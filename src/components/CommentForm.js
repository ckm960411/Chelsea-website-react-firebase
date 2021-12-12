import { dbService } from "fireBase";
import { useEffect, useState } from "react";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { Menu, Dropdown } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import anonymous from "images/anonymous2.png";

function CommentForm({ userObj, comment, CommentInput }) {
  const [userInfo, setUserInfo] = useState({});
  const [timeAgo, setTimeAgo] = useState(0);
  const [editing, setEditing] = useState(false);
  const [newComment, setNewComment] = useState(comment.comment);
  const [likeCount, setLikeCount] = useState(comment.likes.length);
  const [liked, setLiked] = useState(comment.likes.includes(userObj.uid))
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    searchCommentUser();
    setTimeAgo(formatDistanceToNowStrict(date));
    if (comment.creatorId === userObj.uid) setIsOwner(true)
    return () => {
      setUserInfo({})
      setIsOwner(false)
    }
  }, []);

  useEffect(() => {
    setLikeCount(comment.likes.length)
  })

  const searchCommentUser = async () => {
    const userCollectDocRef = collection(dbService, "users");
    const q = query(
      userCollectDocRef,
      where("userUid", "==", comment.creatorId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      const userDocRef = doc(dbService, "users", document.id);
      getDoc(userDocRef).then((docSnap) => setUserInfo({ ...docSnap.data() }));
    });
  };
  const date = new Date(comment.createdAt);

  const onChange = (event) => {
    setNewComment(event.target.value);
  };
  const onLike = async () => {
    if (comment.creatorId === userObj.uid) return // 댓글 작성자가 로그인한 본인일 경우 리턴
    const commentRef = doc(dbService, "comments", comment.id)
    if (comment.likes.includes(userObj.uid)) { // 이미 '좋아요'한 경우 좋취
      let filtered = comment.likes.filter(value => value !== userObj.uid)
      await updateDoc(commentRef, {
        likes: filtered,
      })
      setLiked(false)
    } else { // 아직 '좋아요' 안했으면 좋아요!
      await updateDoc(commentRef, {
        likes: [...comment.likes, userObj.uid]
      })
      setLiked(true)
    }
  };
  
  const onToggleEditing = (event) => {
    setEditing((prev) => !prev);
    if (newComment !== comment.comment) setNewComment(comment.comment);
  };
  const onDeleteComment = async () => {
    const ok = window.confirm("이 댓글을 삭제하시겠습니까?");
    if (ok === false) return;
    await deleteDoc(doc(dbService, "comments", comment.id));
  };
  const onEditComment = async (event) => {
    event.preventDefault();
    const commentRef = doc(dbService, "comments", comment.id);
    await updateDoc(commentRef, {
      comment: newComment,
    });
    setEditing(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={onToggleEditing}>
        <div className="moreBtn__etc">
          <EditOutlined /> Edit Comment
        </div>
      </Menu.Item>
      <Menu.Item key="1" onClick={onDeleteComment}>
        <div>
          <DeleteOutlined className="moreBtn__etc" /> Delete Comment
        </div>
      </Menu.Item>
    </Menu>
  );
  const notOwnerMenu = (
    <Menu>
      <Menu.Item key="0" onClick={() => alert('신고가 완료되었습니다.')}>
        신고하기
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <div className="commentForm__container">
        <img
          src={userInfo.userPhotoURL ? userInfo.userPhotoURL : anonymous}
          alt="user-img"
          className="commentForm__profileImg"
        />
        <div className="commentForm__description">
          <h6 className="commentForm__displayName">
            {userInfo.userDisplayName}
          </h6>
          <>
            {editing ? (
              <form onSubmit={onEditComment}>
                <CommentInput
                  value={newComment}
                  onChange={onChange}
                  autoSize={{ minRows: 1, maxRows: 6 }}
                />
                <div className="editBtns">
                  <button onClick={onToggleEditing} className="edit__cancelBtn">
                    Cancel
                  </button>
                  <button className="edit__editBtn">Edit</button>
                </div>
              </form>
            ) : (
              <>
                <h6 className="commentForm__date">
                  {format(date, "yyyy.MM.dd kk:mm")} ({timeAgo} ago)
                </h6>
                <h6 className="commentForm__comment">{comment.comment}</h6>
                <div className="commentForm__like">
                  <LikeOutlined className={liked ? "like__icon liked" : "like__icon" } onClick={onLike} /> {likeCount} like
                </div>
              </>
            )}
          </>
        </div>
        <>
          {editing ? null : (
            // <button className="moreBtn"><MoreOutlined /></button>
            <Dropdown overlay={isOwner ? menu : notOwnerMenu } trigger={["click"]}>
              <button className="moreBtn" onClick={(e) => e.preventDefault()}>
                <MoreOutlined />
              </button>
            </Dropdown>
          )}
        </>
      </div>
      <hr />
    </>
  );
}

export default CommentForm;
