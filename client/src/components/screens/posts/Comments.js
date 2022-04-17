/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../App";
import Highlight from "react-highlight";
import JoditEditor from "jodit-react";
import "../../../style/PostComment.scss";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import Loader from "../../Loader";

const config = {
  buttons: ["bold","|","italic","|","image","|","link","|","left","|","center","|","right",],
  height:"200",
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  toolbarAdaptive: false,
};

function comments(props) {
  const { postComment, postUser, postId } = props;
  const configRef = useRef(null)

  const { state, dispatch } = useContext(UserContext);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [postCom, setPostCom] = useState([]);
  const [postComments, setPostComments] = useState([]);
  useEffect(() => {
    fetch(`/comments/${postId}`, {
      headers: {
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPostCom(result.posts);
      })
      .catch((err) => {
        console.log(err);
      });
    if (postUser._id === state._id) {
      setPostComments(
        postCom.map((item) => ({
          _id: item._id,
          text: item.text,
          code: item.code,
          commentLike: item.commentLike,
          postedBy: item.postedBy,
          showLike: true,
          createdAt: item.createdAt,
        }))
      );
    } else {
      setPostComments(
        postCom.map((item) => ({
          _id: item._id,
          text: item.text,
          code: item.code,
          commentLike: item.commentLike,
          postedBy: item.postedBy,
          showLike: false,
          createdAt: item.createdAt,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postCom]);

  const deleteComment = async (id, postedBy) => {
    await fetch(`/deletComment/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        commentIds: id,
        deletcomId: postComment._id,
        delUserId: postedBy._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result);
        }
      })
      .catch((error) => console.log(error));
  };

  const likeComment = async (id) => {
    await fetch("/commentLike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        commentId: id,
        postId: postComment._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const Likes = postComments.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPostComments(Likes);
      })
      .catch((err) => console.log(err));
  };

  const unLikeComment = async (_id) => {
    await fetch("/comments/unCommentLike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        commentId: _id,
        postId: postComment._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        let newDate = postComments.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPostComments(newDate);
      })
      .catch((err) => console.log(err));
  };

  const CreateComments = async (id) => {
    await fetch("/comments", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        code,
        postCommentId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log();
        if (result) {
          toast.success("you wrote your opinion");
          setText("");
          setCode("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {postComments ? (
        <div className="features">
          <ToastContainer />
          <h4>Comments</h4>
          {postComments.map((item) => {
            return (
              <div
                className="latest"
                key={item._id}
                style={{ padding: "1rem" }}
              >
                <div className="row">
                  <div className="image col">
                    {item.postedBy.userPhoto ? (
                      <img
                        style={{
                          borderRadius: "50%",
                          maxHeight: "60px",
                          minHeight: "70px",
                          margin: "10px",
                        }}
                        src={item.postedBy.userPhoto}
                        alt="vector"
                      />
                    ) : (
                      <img
                      id="profilePic"
                      className="pic"
                        src="https://i.postimg.cc/fT7jkmk8/17.png"
                        alt="vector"
                      />
                    )}
                    <Link to={state._id !== item.postedBy._id ? `/profile/${item.postedBy._id}` : '/profile'}>
                    <strong>{item.postedBy.name}</strong>
                    </Link>
                  </div>
                  <div
                    className="f-left col d-flex"
                    style={{ placeContent: "end" }}
                  >
                    {item.showLike && (
                      <div style={{ marginLeft: "auto" }}>
                        {!item.commentLike.length ? (
                          <button
                            className="PostUserLike"
                            type="button"
                            id="post-like"
                            onClick={() => likeComment(item._id)}
                          >
                            <i className="fa-solid fa-check text-success"></i>
                          </button>
                        ) : (
                          <button
                            className="PostUserUnLike"
                            type="button"
                            id="post-like"
                            onClick={() => unLikeComment(item._id)}
                          >
                            <i className="fa-solid fa-check text-white"></i>
                          </button>
                        )}
                      </div>
                    )}
                    {!item.showLike && (
                      <div style={{ placeContent: "end" }}>
                        {item.commentLike.length ? (
                          <button
                            className="ClientLike "
                            type="button"
                            id="post-like"
                          >
                            <i className="fa-solid fa-check text-white"></i>
                          </button>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="info">
                  <div style={{ padding: "1rem" }}>
                    <span className="text-">{item.code}</span>
                  </div>
                  <br />

                  <div style={{ borderRadius: "7px" }}>
                    <Highlight
                      className="language-name-of-snippet"
                      language="javascript"
                      innerHTML={true}
                    >
                      {item.text}
                    </Highlight>
                  </div>
                </div>
                <br />
                {item.postedBy._id === state._id ? (
                  <span>
                    <div className="post-button mt-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => deleteComment(item._id, item.postedBy)}
                        type="button"
                        id="comment-trash"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <div style={{ fontSize: "0.7rem", marginTop: "-1.5rem" }}>
                      <span>
                        <b>Answered</b>{" "}
                        {dayjs(item.createdAt).format("DD MMMM YYYY, hh:mm:ss")}
                      </span>
                    </div>
                  </span>
                ) : (
                  <div style={{ fontSize: "0.7rem" }}>
                    <span>
                      <b>Answered</b>{" "}
                      {dayjs(item.createdAt).format("DD MMMM YYYY, hh:mm:ss")}
                    </span>
                  </div>
                )}
                <hr />
              </div>
            );
          })}
        </div>
      ) : (
        <Loader />
      )}
      <div className="features">
        <form className="contact__form">
          <div className="form-group">
            <label htmlFor="comments" className="form__label">
              Add Comment
            </label>
            <JoditEditor
            ref={configRef}
              value={text}
              config={config}
              onBlur={(newContent) => setText(newContent)}
            />
          </div>

          <span
            type="button"
            onClick={() => CreateComments(postComment._id)}
            className="btn btn-primary"
          >
            Send your feedback
          </span>
        </form>
      </div>
    </div>
  );
}

export default comments;
