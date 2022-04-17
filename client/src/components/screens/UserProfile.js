import React, { useEffect, useState, useContext } from "react";
import "../../style/Profile.scss";
import { UserContext } from "../../App";
import Loader from "../Loader";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import NodFound from "./NodFound";
import DOMPurify from "dompurify";
import Avatar from "../../image/user-circle.svg";
import { Helmet } from "react-helmet-async";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/profile/${id}`, {
      headers: { Authorization: "Sunna " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, [id]);


  return (
    <>
     <Helmet>
    <title>UzDev-Community</title>
    <meta  name="description"
    content={profile?.user?.name}/>
     <link rel="canonical" href={`/profile${profile?.user?._id}`}/>
    </Helmet>
      {profile ? (
        <>
          <div className="profileMobile">
            <div className="mobile-profile mobile-con d-block d-sm-none px-2">
            <div className="mt-5 py-2">
                <div className="user-profile">
                  {profile.user.userPhoto ? (
                    <img
                      src={profile.user.userPhoto}
                      alt=""
                      className="user-photo"
                    />
                    ):(
                    <img
                      src={Avatar}
                      alt=""
                      className="user-photo"
                    />
                  )}
                  <div className="user-name">{profile.user.name}</div>
                </div>
              </div>
                <div className="py-3">
              <div className="row d-flex text-center align-items-center font-weight-bold pt-1">
                <div className="col">User posts</div>
                <div className="col">User Correct Answers</div>
                <div className="col">User Answers</div>
              </div>
              <div className="row text-center font-weight-light">
                <div className="col">{profile.result.length}</div>
                <div className="col">
                {profile.user.answerTrue}
                </div>
                <div className="col">{profile.user.answers.length}</div>
              </div>
                </div>
            </div>

            <div className="container-fluid plansheid-profile con">
              <div className="mt-5 py-2">
                <div className="user-profile">
                {profile.user.userPhoto ? (
                    <img
                      src={profile.user.userPhoto}
                      alt=""
                      className="user-photo"
                    />
                    ):(
                    <img
                      src={Avatar}
                      alt=""
                      className="user-photo"
                    />
                  )}
                  <div className="user-name">{profile.user.name}</div>
                </div>
              </div>

              <table className="table text-center table-borderless">
                <tbody>
                  <tr>
                    <td colSpan="" className="align-middle">
                      User posts
                    </td>
                    <td colSpan="" className="align-middle">
                      User Correct Answers
                    </td>
                    <td colSpan="" className="align-middle">
                      User Answers
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="" className="align-top pt-1">
                      {profile.result.length}
                    </td>
                    <td colSpan="" className="align-top pt-1">
                      {profile.user.answerTrue}
                    </td>
                    <td colSpan="" className="align-top pt-1">
                      {profile.user.answers.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="container-fluid"
            style={{
              backgroundColor: "#e0e0dd",
              display: "flex",
              height: "max-content",
              gap: "0.3rem",
            }}
          >
            <div className="user-profile-area bg-white">
              <div className="task-manager">User Profile</div>
              <div className="side-wrapper">
                <div className="user-profile">
                {profile.user.userPhoto ? (
                    <img
                      src={profile.user.userPhoto}
                      alt=""
                      className="user-photo"
                    />
                    ):(
                    <img
                      src={Avatar}
                      alt=""
                      className="user-photo"
                    />
                  )}
                  <div className="user-name">{profile.user.name}</div>
                </div>
                <div className="progress-status">12/34</div>
                <div className="progress">
                  <div className="progress-bar bg-primary"></div>
                </div>
                <div className="task-status">
                  <div className="task-stat">
                    <div className="task-number">{profile.result.length}</div>
                    <div className="task-condition">All</div>
                    <div className="task-tasks">Posts</div>
                  </div>
                  <div className="task-stat">
                    <div className="task-number">{profile.user.answerTrue}</div>
                    <div className="task-condition">All</div>
                    <div className="task-tasks">Correct Answers</div>
                  </div>
                  <div className="task-stat">
                    <div className="task-number">
                      {profile.user.answers.length}
                    </div>
                    <div className="task-condition">All</div>
                    <div className="task-tasks">My Answers</div>
                  </div>
                </div>
              </div>
              <div className="side-wrapper">
               
                     <div className="project-title">Specialty</div>
                {profile.user.specilization.length ? (
                    <div className="project-name">
                      {profile.user.specilization.map((item, i) => {
                        return (
                          <div key={i} className="project-department">
                            {item}
                          </div>
                        );
                      })}
                    </div>
                
                ) : (
                  <p>Not found Specialty</p>
                )}
              </div>
             {/*  <div className="side-wrapper">
                <div className="project-title">Team</div>
                <div className="team-member">
                  <img
                    src="https://images.unsplash.com/flagged/photo-1574282893982-ff1675ba4900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
                    alt=""
                    className="members"
                  />
                  <img
                    src="https://assets.codepen.io/3364143/Screen+Shot+2020-08-01+at+12.24.16.png"
                    alt=""
                    className="members"
                  />
                  <img
                    src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
                    alt=""
                    className="members"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=998&q=80"
                    alt=""
                    className="members"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
                    alt=""
                    className="members"
                  />
                </div>
              </div> */}
            </div>
            <div className="main-area" style={{ placeSelf: " stretch" }}>
              <div className="main-container">
                <div className="mail-detail">
                  <div className="book-cards">
                    {profile.result.length ? (
                      <div>
                        {profile.result.map((post, i) => {
                          const resultBodyHtml = (
                            <div
                              className="book-by"
                              key={i}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  post.body
                                    .slice(0, post.body.indexOf(6))
                                    .slice(0, 965)
                                ),
                              }}
                            />
                          );
                          return (
                            <div
                              key={post._id}
                              className="card"
                              style={{ margin: "2rem" }}
                            >
                              <Link
                                style={{ textDecoration: "none" }}
                                to={`/postComments/${post._id}`}
                              >
                                <div className="content-wrapper ">
                                  {post.photo ? (
                                    <img
                                      src={post.photo}
                                      alt="...."
                                      title={post.title}
                                      className="book-card-img"
                                    />
                                  ) : (
                                    <img
                                      src="https://cdn.sanity.io/images/0vv8moc6/dermatologytimes/d198c3b708a35d9adcfa0435ee12fe454db49662-640x400.png"
                                      alt="...."
                                      title={post.title}
                                      className="book-card-img"
                                    />
                                  )}
                                  <div className="card-content">
                                    <div className="book-name">
                                      {post.title}
                                    </div>
                                    <>{resultBodyHtml}</>
                                  </div>
                                </div>
                              </Link>
                              <div className="likes">
                                <div className="like-profile">
                                  <div
                                    className="postTags"
                                    style={{
                                      float: "right",
                                      padding: "0 0.5rem",
                                    }}
                                  >
                                    {profile.user.userPhoto ? (
                                      <img
                                        className=""
                                        style={{
                                          marginLeft: "20rem",
                                          maxHeight: "25px",
                                          minHeight: "25px",
                                          borderRadius: "50%",
                                          margin: "10px",
                                        }}
                                        src={profile.user.userPhoto}
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
                                    <span
                                      style={{ fontSize: "1rem" }}
                                      className="ml-1 text-white"
                                    >
                                      {post.postedBy.name}{" "}
                                    </span>
                                    <br />
                                    <span
                                      className=""
                                      style={{ fontSize: "0.5rem" }}
                                    >
                                      <b>Asked </b>
                                      {dayjs(post.updatedAt).format(
                                        "DD MMMM YYYY, hh:mm:ss"
                                      )}
                                    </span>
                                  </div>
                                  {post.postTrue.length > 0 ? (
                                    <div
                                      className=""
                                      style={{
                                        float: "right",
                                        padding: "0 0.5rem",
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
                                  ) : (
                                    <p></p>
                                  )}
                                </div>
                                <div className="like-profile d-flex">
                                  <div
                                    style={{ display: "-webkit-inline-box" }}
                                  >
                                    {post.commentId.map((item, i) => {
                                      return (
                                        <>
                                          {profile.user.userPhoto ? (
                                            <img
                                              key={i}
                                              src={profile.user.userPhoto}
                                              alt=""
                                              className="like-img reaction"
                                            />
                                          ) : (
                                            <img
                                              key={i}
                                              src={Avatar}
                                              alt=""
                                              className="like-img reaction"
                                            />
                                          )}
                                        </>
                                      );
                                    })}
                                    <>
                                      <p className="ml-2 mt-1">
                                        {" "}
                                        Answers {post.commentId.length}
                                      </p>
                                    </>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <NodFound />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default UserProfile;
