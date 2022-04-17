/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from "react";
import { PostsSidebar } from "./PostsSidebar";
import Highlight from "react-highlight";
import "../../../style/Posts.scss";
import Loader from "../../Loader";
import Comment from "./Comments";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import Members from "./Members";
import Group from "../Group/Group";
import ActiveMember from "./ActiveMember";
import Calendar from "./Calendar";
import { Helmet } from "react-helmet-async";

function PostComments(props) {
  const [postComment, setPostComment] = useState([]);
  const [postUser, setPostUser] = useState([]);
  const [PostTag, setPostTag] = useState([]);
  const [updated, setUpdated] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [Share, setShare] = useState('');
  const [post, setPost] = useState();
  const [phoneSidebar, setPhoneSidebar] = useState(false);

  const PostId = props.match.params.id;

  const dates = dayjs(updated).format("DD MMMM YYYY, hh:mm:ss");
  useEffect(() => {
    const getPost = async() => {
      try{
      await fetch(`/post/${PostId}`, {
             headers: {
               Authorization: "Sunna " + localStorage.getItem("jwt"),
             },
           })
             .then((res) => {
              return (
                setShare(res.url),
                res.json()
                )})
             .then((result) => {
               setPost(result);
               setPostComment(result.posts);
               setPostUser(result.posts.postedBy);
               setPostTag(Object.entries(result.posts.tags));
               setUpdated([result.posts.createdAt]);
             })
             .catch((err) => {
               console.log(err);
             });
      }catch(err){
        console.log(err);
      }
    }
    getPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <Helmet>
        <title>UzDev-Community</title>
        <meta name="description" content={postComment.title} />
        <link rel="canonical" href={`/postComments/${postComment?._id}`} />
      </Helmet>
      {postComment.body ? (
        <div>
          <div className="PostsList">
            <div className="part1">
            <div className={phoneSidebar ? "mobileSidebar py-5" :"mobileSidebar py-3 noActive"}>
              <header>
                {phoneSidebar ?(
                  <i onClick={() =>setPhoneSidebar(!phoneSidebar)} className="fa-solid fa-angles-left togleLeft"></i>
                  ):(
                  <i onClick={() =>setPhoneSidebar(!phoneSidebar)} className="fa-solid fa-angles-right togleLeft"></i>
                )}
              </header>
              <div className="menu_bar">
                <div className="menu_Users">
                <Members />
                </div>
                <hr/>
                <div className="menu_Users">
                {/* <Group /> */}
                </div>
                <hr/>
                <div className="menu_Users">
                <Calendar />
                </div>
              </div>
            </div>
              <div className="sidebarDecktop">
              <Members />
             {/*  <Group />
              <ActiveMember /> */}
              <Calendar />
              </div>
            </div>
            <div className="part2 postCom">
              <div className="posts">
                <div>
                  <div className="conteudo " style={{ padding: "1rem" }}>
                    <div className="post-info"></div>
                    {postComment.photo ? (
                      <img src={postComment.photo} alt="" />
                    ) : (
                      <p></p>
                    )}
                    <h1>{postComment.title}</h1>
                    <hr />
                    <Highlight
                      className="language-name-of-snippet"
                      language="javascript"
                      innerHTML={true}
                    >
                      {postComment.body}
                    </Highlight>
                  </div>
                  <hr />
                  <div>
                    {PostTag.length ? (
                      <div className="mt-2">
                        {PostTag.map((tag, i) => {
                          return (
                            <span key={i} className="postTags">
                              {tag.slice(1)}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p></p>
                    )}
                    <div>
                      <div
                        className="postTags"
                        style={{ float: "right", padding: "0 0.5rem" }}
                      >
                        {postComment.postedBy.userPhoto ? (
                          <img
                            className=""
                            style={{
                              marginLeft: "20rem",
                              maxHeight: "25px",
                              minHeight: "25px",
                              borderRadius: "50%",
                              margin: "10px",
                            }}
                            src={postComment.postedBy.userPhoto}
                            alt=" User Avatar"
                          />
                        ) : (
                          <img
                            className=""
                            style={{
                              marginLeft: "20rem",
                              maxHeight: "25px",
                              minHeight: "25px",
                              borderRadius: "50%",
                              margin: "10px",
                            }}
                            src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png"
                            alt=" User Avatar"
                          />
                        )}
                        <Link
                          style={{ fontSize: "1rem" }}
                          className="ml-1 text-white"
                          to={
                            postUser._id !== state._id
                              ? `/profile/${postUser._id}`
                              : "/profile"
                          }
                        >
                          {postUser.name}{" "}
                        </Link>
                        <br />
                        <span className="" style={{ fontSize: "0.5rem" }}>
                          <b>Asked </b>
                          {dates}
                        </span>
                      </div>
                      {postComment.postTrue.length ? (
                        <div className="d-inline" style={{"float":"right"}}>
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
                        ) : (
                          <p></p>
                        )}
                      
                    </div>
                  </div>
                </div>
              </div>
              <Comment
                postId={PostId}
                postComment={postComment}
                postUser={postUser}
              />
            </div>
            <div className="part3">
              <PostsSidebar />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default PostComments;
