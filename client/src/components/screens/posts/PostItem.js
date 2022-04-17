import React, { useContext, useEffect, useState } from "react";
import "../../../style/Posts.scss";
import { Link } from "react-router-dom";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../../App";

function PostItem({item, resultBodyHtml, setShare}) {
    const { state, dispatch } = useContext(UserContext);


    const deletePost = async (postId) => {
        await fetch(`/deletePost/${postId}`, {
          headers: {
            Authorization: "Sunna " + localStorage.getItem("jwt"),
          },
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



  return (
    <div>
        <ToastContainer />
        <div className="post py-3">
                      <Link to={`/postComments/${item._id}`}>
                        <div className="image">
                          {item.photo ? (
                            <img src={item.photo} alt="..." />
                          ) : (
                            <>
                              <p style={{ color: "black", textAlign: "end" }}>
                                Votes {item.postTrue.length}
                              </p>
                              <p style={{ color: "black", textAlign: "end" }}>
                                Answer {item.commentId.length}
                              </p>
                              <p style={{ color: "black", textAlign: "end" }}>
                                Views {item.counter}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="info">
                          <h3 style={{ fontSize: "1.3rem" }}>{item.title}</h3>
                          <div className="d-flex">
                            {resultBodyHtml}
                            <b style={{ fontWeight: "bold", color: "#0008" }}>
                              ...
                            </b>
                          </div>
                        </div>
                      </Link>
                      <div className="post-button mt-2">
                        <div className="d-inline-flex mt-3">
                          <button type="button" id="post-comment">
                            <Link to={`/postComments/${item._id}`}>
                            <i className="far fa-comment-dots text-white"></i>
                            </Link>
                          </button>
                          <button
                            type="button"
                            id="post-share"
                            data-toggle="modal"
                            data-target="#exampleModal"
                            onClick={() => setShare(item._id)}
                          >
                            <i className="fas fa-share-alt"></i>
                          </button>
                          {item.postedBy._id === state._id && (
                            <button
                              onClick={() => deletePost(item._id)}
                              type="button"
                              id="post-trash"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                          {item.tags.length ? (
                            <div className="">
                              {item.tags.map((tag, i) => {
                                return (
                                  <span key={i} className="postTags">
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                          ):(<p className="d-none"></p>)}
                        </div>
                        <div className="d-flex">
                          {item.photo && (
                            <>
                              <p style={{ color: "black", margin: "10px" }}>
                                Votes {item.postTrue.length}
                              </p>
                              <p style={{ color: "black", margin: "10px" }}>
                                Answer {item.commentId.length}
                              </p>
                              <p style={{ color: "black", margin: "10px" }}>
                                Views {item.counter}
                              </p>
                            </>
                          )}
                        </div>
                        <div>
                          <br/>
                        <div
                          className="postTags"
                          style={{
                            float: "right",
                            marginTop: "-1.5rem",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{ gap: "1rem", marginRight: "2.5rem" }}
                            className="d-flex "
                          >
                            {item.postedBy.userPhoto ? (
                              <img
                                src={item.postedBy.userPhoto}
                                alt=" User Avatar"
                                style={{
                                  maxHeight: "30px",
                                  minHeight: "30px",
                                  borderRadius: "50%",
                                  paddingLeft: "0.5em",
                                }}
                              />
                            ) : (
                              <img
                                style={{
                                  maxHeight: "30px",
                                  minHeight: "30px",
                                  borderRadius: "50%",
                                  paddingLeft: "0.5em",
                                }}
                                src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png"
                                alt=" User Avatar"
                              />
                            )}
                            <Link
                              className="mt-1"
                              style={{ fontSize: "0.8rem", color: "#fff" }}
                              to={
                                item.postedBy?._id !== state?._id
                                  ? `/profile/${item.postedBy?._id}`
                                  : "/profile"
                              }
                            >
                              {item.postedBy?.name}
                            </Link>
                          </div>
                          <div className="" style={{ fontSize: "0.7rem" }}>
                            <span>
                              asked{" "}
                              {formatDistanceToNowStrict(
                                new Date(item.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        </div>
                        {item.postTrue.length > 0 && (
                          <div
                            className=""
                            style={{
                              float: "right",
                              padding: "0 0.5rem",
                              marginTop: "-1rem",
                            }}
                          >
                            <img
                              className="mt-2"
                              style={{
                                maxHeight: "30px",
                                minHeight: "30px",
                                borderRadius: "50%",
                                marginLeft: "0.5rem",
                              }}
                              src="https://uxwing.com/wp-content/themes/uxwing/download/48-checkmark-cross/success-green-check-mark.png"
                              alt=" User Avatar"
                            />
                          </div>
                        )}
                      </div>
                      <br />
                      <hr />
                    </div>
    </div>
  )
}

export default PostItem