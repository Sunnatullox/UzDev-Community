import React, { useEffect, useState, useContext } from "react";
import "../../style/Profile.scss";
import { UserContext } from "../../App";
import Loader from "../Loader";
import NodFound from "./NodFound";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import dayjs from "dayjs";
import Avatart from "../../image/user-circle.svg";
import { toast, ToastContainer } from "react-toastify";
import ProfileSistems from "./ProfileSistems";
import { Helmet } from 'react-helmet-async';

function Profile() {
  const [myposts, setMyPosts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [image, setImage] = useState();
  const [UserImage, setuserImage] = useState("");
  const [userId, setUserId] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [profileSistems, setProfileSistems] = useState(false);
  const [myInfo, setMyInfo] = useState(false);
  const [Photo, setPhot] = useState(false);
  const [allGroups, setAllGroups] = useState();

  useEffect(() => {
    fetch("/mypost", {
      headers: { Authorization: "Sunna " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => {
        setMyPosts(result.mypost);
      });
    ProfileInfo();
  }, [userId]);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "uzdev_overflow");
      data.append("cloud_name", "defsmhgn9");
      fetch(`https://api.cloudinary.com/v1_1/defsmhgn9/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPhot(true);
          setuserImage(data.secure_url);
        })
        .catch((err) => console.log(err));
    }
    AllGroups()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const updateFile = (files) => {
    setImage(files);
  };

/* console.log(allGroups) */
  const AllGroups = async () => {
    try {
      await fetch("/AllGroups", {
        headers: { Authorization: "Sunna " + localStorage.getItem("jwt") },
      })
        .then((res) => res.json())
        .then((result) => {
          result.map(item => {
            return setAllGroups(item)
          })

        });
    } catch (err) {
      console.log(err);
    }
  };

  const uploadUserImage = async (id) => {
    await fetch("/userPhotoUpload", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        image: UserImage,
        userId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, userPhoto: data.userPhoto })
          );
          dispatch({ type: "EDITPROFILE", payload: data.userPhoto });
          setPhot(false);
          toast.success("User avatar o'rnatildi ");
        }
      });
  };

  const hendelCheckbox = (e) => {
    const { checked } = e.target;
    setMyInfo(checked);
  };

  const ProfileInfo = async () => {
    await fetch("/userInfo", {
      headers: { Authorization: "Sunna " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => {
        setUserId(result);
        setAnswers(Object.entries(result.answers));
      });
  };

  return (
    <>
    <Helmet>
    <title>UzDev-Community</title>
    <meta  name="description"
    content={userId.name}/>
     <link rel="canonical" href="/profile"/>
    </Helmet>

      {myposts.length || state ? (
        <>
          <div className="profileMobile">
            <div className="mobile-profile mobile-con d-block d-sm-none px-2">
              <div className="text-center">
                <div className="pic-holder">
                  {userId.userPhoto ? (
                    <img
                      id="profilePic"
                      className="pic"
                      src={userId.userPhoto}
                      alt="..."
                    />
                  ) : (
                    <img
                      id="profilePic"
                      className="pic"
                      src={Avatart}
                      alt="..."
                    />
                  )}
                 

                  <label
                    htmlFor="newProfilePhoto"
                    className="upload-file-block"
                  >
                    <div className="text-center">
                      <div>
                        <i className="fa fa-camera fa-sm"></i>
                      </div>
                      <div>
                        Update <br /> Profile Photo
                      </div>
                    </div>
                  </label>
                  <input
                    id="newProfilePhoto"
                    type="file"
                    onChange={(e) => updateFile(e.target.files[0])}
                    accept=".jpg,.png,.jpeg"
                    style={{ display: "none" }}
                  />
                  {Photo && (
                    <button
                      className="btn"
                      onClick={() => uploadUserImage(userId._id)}
                    >
                      <i className="fa-solid fa-upload"></i>
                    </button>
                  )}
                </div>
                <br />
                <div className="user-name">
                  {userId ? <b>{userId.name}</b> : "Loading..."}
                </div>
              </div>
              <div className="row d-flex text-center align-items-center">
                <div className="col-3 ml-1 pb-3">
                  <a
                    href="!#"
                    className="btn btn-link btn-sm text-dark"
                    role="button"
                    aria-pressed="true"
                  >
                    <i className="fa-solid fa-phone fa-xl"></i>
                  </a>
                  {userId._id === state._id && (
                    <div className="user-mail" style={{ marginLeft: "1em" }}>
                      {userId.telNumber ? (
                        <p>
                          <b>Tel:</b> +{userId.telNumber}
                        </p>
                      ) : (
                        <p>Null</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="col-4 pb-3">
                  <span
                    className="btn btn-link btn-sm text-dark"
                    aria-pressed="true"
                  >
                    <i className="fa-solid fa-at fa-xl"></i>
                  </span>
                  <div className="user-mail" style={{ marginLeft: "1em" }}>
                    {userId._id === state._id && <p>{userId.email}</p>}
                  </div>
                </div>
                <div className="col-4 pb-3">
                  <span
                    className="btn btn-link btn-sm text-dark"
                    aria-pressed="true"
                  >
                    <i className="fa-solid fa-calendar-plus fa-xl"></i>
                  </span>
                  <div className="user-mail" style={{ marginLeft: "1em" }}>
                  {userId._id === state._id && (
                      <p>
                        {dayjs(userId.createdAt).format(
                          "DD MMMM YYYY, hh:mm:ss"
                        )}
                      </p>
                  )}
                  </div>
                </div>
              </div>
              <div className="row border-top p-1">
                <div className="col mobile-profile-text">
                  <span>
                    {/* ${member.profile_text} */}{" "}
                    <span
                      onClick={() => setProfileSistems(!profileSistems)}
                      className="text-dark p-2"
                    >
                      <i className="fas fa-pen fa-sm"></i>
                    </span>
                  </span>
                </div>
              </div>

              <div className="row d-flex text-center align-items-center font-weight-bold pt-1">
                <div className="col">My posts</div>
                <div className="col">Correct Answers</div>
                <div className="col">My Answers</div>
              </div>
              <div className="row text-center font-weight-light">
                <div className="col">{myposts.length}</div>
                <div className="col">{userId.answerTrue && userId.answerTrue}</div>
                <div className="col">{answers && answers.length}</div>
              </div>
            </div>

            <div className="container-fluid con plansheid-profile">
              <div>
                <div rowSpan="3" className="align-middle pt-5">
                  <div className="pic-holder">
                    {userId.userPhoto ? (
                      <img
                        id="profilePic"
                        className="pic"
                        src={userId.userPhoto}
                        alt="..."
                      />
                    ) : (
                      <img
                        id="profilePic"
                        className="pic"
                        src={Avatart}
                        alt="..."
                      />
                    )}

                    <label
                      htmlFor="newProfilePhoto"
                      className="upload-file-block"
                    >
                      <div className="text-center">
                        <div>
                          <i className="fa fa-camera fa-sm"></i>
                        </div>
                        <div>
                          Update <br /> Profile Photo
                        </div>
                      </div>
                    </label>
                    <input
                      id="newProfilePhoto"
                      type="file"
                      onChange={(e) => updateFile(e.target.files[0])}
                      accept=".jpg,.png,.jpeg"
                      style={{ display: "none" }}
                    />
                  </div>
                  <br/>
                  <div className="d-flex justify-content-center">
                  {userId ? <b className="">{userId.name}</b> : "Loading..."}
                  </div>
                </div>
              </div>
              <table className="table text-center table-borderless">
                <tbody>
                  <tr>
                   
                    <td colSpan="" className="align-bottom">
                      <span
                        className="btn btn-link btn-sm text-dark"
                        role="button"
                        aria-pressed="true"
                      >
                        <i className="fa-solid fa-phone fa-xl"></i>
                      </span>
                      {userId.telNumber ? (
                        <p>
                          <b>Tel:</b> +{userId.telNumber}
                        </p>
                      ) : (
                        <p>Null</p>
                      )}
                    </td>
                    <td colSpan="" className="align-bottom">
                      <span
                        className="btn btn-link btn-sm text-dark"
                        role="button"
                        aria-pressed="true"
                      >
                        <i className="fa-solid fa-at fa-xl"></i>
                      </span>
                      {userId._id === state._id && <p>{userId.email}</p>}
                    </td>
                    <td colSpan="" className="align-bottom">
                      <span
                        className="btn btn-link btn-sm text-dark"
                        role="button"
                        aria-pressed="true"
                      >
                        <i className="fa-solid fa-calendar-plus fa-xl"></i>
                      </span>
                      {userId._id === state._id && (
                      <p>
                        {dayjs(userId.createdAt).format(
                          "DD MMMM YYYY, hh:mm:ss"
                        )}
                      </p>
                  )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="" className="align-middle">
                      My posts
                    </td>
                    <td colSpan="" className="align-middle">
                      Correct Answers
                    </td>
                    <td colSpan="" className="align-middle">
                      My Answers
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="" className="align-top pt-1">
                    {myposts.length}
                    </td>
                    <td colSpan="" className="align-top pt-1">
                    {userId.answerTrue && userId.answerTrue}
                    </td>
                    <td colSpan="" className="align-top pt-1">
                      {answers && answers.length}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="12" className="text-left border-top">
                      <span>
                        <span
                          className="text-dark p-2"
                          onClick={() => setProfileSistems(!profileSistems)}
                        >
                          <i className="fas fa-pen fa-sm"></i>
                        </span>
                      </span>
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
            <ToastContainer />
            <div className="user-profile-area bg-white">
              <div className="task-manager">My Profile</div>
              <div className="side-wrapper">
                <div className="user-profile">
                  <div className="pic-holder">
                    {userId.userPhoto ? (
                      <img
                        id="profilePic"
                        className="pic"
                        src={userId.userPhoto}
                        alt="..."
                      />
                    ) : (
                      <img
                        id="profilePic"
                        className="pic"
                        src={Avatart}
                        alt="..."
                      />
                    )}

                    <label
                      htmlFor="newProfilePhoto"
                      className="upload-file-block"
                    >
                      <div className="text-center">
                        <div>
                          <i className="fa fa-camera fa-sm"></i>
                        </div>
                        <div>
                          Update <br /> Profile Photo
                        </div>
                      </div>
                    </label>
                    <input
                      id="newProfilePhoto"
                      type="file"
                      onChange={(e) => updateFile(e.target.files[0])}
                      accept=".jpg,.png,.jpeg"
                      style={{ display: "none" }}
                    />
                  </div>
                  {Photo && (
                    <button
                      className="btn"
                      onClick={() => uploadUserImage(userId._id)}
                    >
                      <i className="fa-solid fa-upload"></i>
                    </button>
                  )}
                  <div className="user-name">
                    {userId ? <b>{userId.name}</b> : "Loading..."}
                  </div>
                  {userId._id === state._id && (
                    <div className="user-mail" style={{ marginLeft: "1em" }}>
                      <p>
                        <b>Email:</b> {userId.email}
                      </p>
                      {userId.telNumber && (
                        <p>
                          <b>Tel:</b> +{userId.telNumber}
                        </p>
                      )}
                      <p>
                        <b>Created-At: </b>
                        {dayjs(userId.createdAt).format(
                          "DD MMMM YYYY, hh:mm:ss"
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="user-notification">
                  <div className="notify" style={{ marginTop: "-0.8rem" }}>
                    {userId._id === state._id ? (
                      <svg
                        onClick={() => setProfileSistems(!profileSistems)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                        fill="currentColor"
                      >
                        <path d="M13.533 5.6h-.961a.894.894 0 01-.834-.57.906.906 0 01.197-.985l.675-.675a.466.466 0 000-.66l-1.32-1.32a.466.466 0 00-.66 0l-.676.677a.9.9 0 01-.994.191.906.906 0 01-.56-.837V.467A.467.467 0 007.933 0H6.067A.467.467 0 005.6.467v.961c0 .35-.199.68-.57.834a.902.902 0 01-.983-.195L3.37 1.39a.466.466 0 00-.66 0L1.39 2.71a.466.466 0 000 .66l.675.675c.25.25.343.63.193.995a.902.902 0 01-.834.56H.467A.467.467 0 000 6.067v1.866c0 .258.21.467.467.467h.961c.35 0 .683.202.834.57a.904.904 0 01-.197.984l-.675.676a.466.466 0 000 .66l1.32 1.32a.466.466 0 00.66 0l.68-.68a.894.894 0 01.994-.187.897.897 0 01.556.829v.961c0 .258.21.467.467.467h1.866c.258 0 .467-.21.467-.467v-.961c0-.35.202-.683.57-.834a.904.904 0 01.984.197l.676.675a.466.466 0 00.66 0l1.32-1.32a.466.466 0 000-.66l-.68-.68a.894.894 0 01-.187-.994.897.897 0 01.829-.556h.961c.258 0 .467-.21.467-.467V6.067a.467.467 0 00-.467-.467zM7 9.333C5.713 9.333 4.667 8.287 4.667 7S5.713 4.667 7 4.667 9.333 5.713 9.333 7 8.287 9.333 7 9.333z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                        fill="currentColor"
                      >
                        <path d="M13.533 5.6h-.961a.894.894 0 01-.834-.57.906.906 0 01.197-.985l.675-.675a.466.466 0 000-.66l-1.32-1.32a.466.466 0 00-.66 0l-.676.677a.9.9 0 01-.994.191.906.906 0 01-.56-.837V.467A.467.467 0 007.933 0H6.067A.467.467 0 005.6.467v.961c0 .35-.199.68-.57.834a.902.902 0 01-.983-.195L3.37 1.39a.466.466 0 00-.66 0L1.39 2.71a.466.466 0 000 .66l.675.675c.25.25.343.63.193.995a.902.902 0 01-.834.56H.467A.467.467 0 000 6.067v1.866c0 .258.21.467.467.467h.961c.35 0 .683.202.834.57a.904.904 0 01-.197.984l-.675.676a.466.466 0 000 .66l1.32 1.32a.466.466 0 00.66 0l.68-.68a.894.894 0 01.994-.187.897.897 0 01.556.829v.961c0 .258.21.467.467.467h1.866c.258 0 .467-.21.467-.467v-.961c0-.35.202-.683.57-.834a.904.904 0 01.984.197l.676.675a.466.466 0 00.66 0l1.32-1.32a.466.466 0 000-.66l-.68-.68a.894.894 0 01-.187-.994.897.897 0 01.829-.556h.961c.258 0 .467-.21.467-.467V6.067a.467.467 0 00-.467-.467zM7 9.333C5.713 9.333 4.667 8.287 4.667 7S5.713 4.667 7 4.667 9.333 5.713 9.333 7 8.287 9.333 7 9.333z" />
                      </svg>
                    )}
                  </div>
                 {/*  <div className="notify alert">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                    >
                      <path d="M10.688 95.156C80.958 154.667 204.26 259.365 240.5 292.01c4.865 4.406 10.083 6.646 15.5 6.646 5.406 0 10.615-2.219 15.469-6.604 36.271-32.677 159.573-137.385 229.844-196.896 4.375-3.698 5.042-10.198 1.5-14.719C494.625 69.99 482.417 64 469.333 64H42.667c-13.083 0-25.292 5.99-33.479 16.438-3.542 4.52-2.875 11.02 1.5 14.718z" />
                      <path d="M505.813 127.406a10.618 10.618 0 00-11.375 1.542C416.51 195.01 317.052 279.688 285.76 307.885c-17.563 15.854-41.938 15.854-59.542-.021-33.354-30.052-145.042-125-208.656-178.917a10.674 10.674 0 00-11.375-1.542A10.674 10.674 0 000 137.083v268.25C0 428.865 19.135 448 42.667 448h426.667C492.865 448 512 428.865 512 405.333v-268.25a10.66 10.66 0 00-6.187-9.677z" />
                    </svg>
                  </div>
                  <div className="notify alert">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                    >
                      <path d="M467.812 431.851l-36.629-61.056a181.363 181.363 0 01-25.856-93.312V224c0-67.52-45.056-124.629-106.667-143.04V42.667C298.66 19.136 279.524 0 255.993 0s-42.667 19.136-42.667 42.667V80.96C151.716 99.371 106.66 156.48 106.66 224v53.483c0 32.853-8.939 65.109-25.835 93.291L44.196 431.83a10.653 10.653 0 00-.128 10.752c1.899 3.349 5.419 5.419 9.259 5.419H458.66c3.84 0 7.381-2.069 9.28-5.397 1.899-3.329 1.835-7.468-.128-10.753zM188.815 469.333C200.847 494.464 226.319 512 255.993 512s55.147-17.536 67.179-42.667H188.815z" />
                    </svg>
                  </div> */}
                </div>
                <div className="progress-status">12/34</div>
                <div className="progress">
                  <div className="progress-bar bg-primary"></div>
                </div>
                <div className="task-status">
                  <div className="task-stat">
                    <div className="task-number">{myposts.length}</div>
                    <div className="task-condition">All</div>
                    <div className="task-tasks">My posts</div>
                  </div>
                  <div className="task-stat">
                    <div className="task-number">
                      {userId.answerTrue && userId.answerTrue}
                    </div>
                    <div className="task-condition">All</div>
                    <div className="task-tasks">Correct Answers</div>
                  </div>
                  <div className="task-stat">
                    <div className="task-number">
                      {answers && answers.length}
                    </div>
                    <div className="task-condition">All</div>
                    <div className="task-tasks">My Answers</div>
                  </div>
                </div>
              </div>
              <div className="side-wrapper">
                <div className="project-title">Specialty</div>
                <div className="project-name">
                  {userId.specilization?.length ? (
                    userId.specilization.map((s, i) => {
                      return (
                        <div key={i} className="project-department">
                          {s}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center">enter your specialty</p>
                  )}
                </div>
              </div>
            {/*   <div className="side-wrapper">
                <div className="project-title">Team</div>
                <div className="team-member">
                  {allGroups.map(item => {
                    const myGroup = item?.users.map(i => i === state?._id)
                    return console.log(myGroup);
                  })}
                  <img
                    src="https://images.unsplash.com/flagged/photo-1574282893982-ff1675ba4900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
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
                    {profileSistems && (
                      <ProfileSistems
                        setProfileSistems={setProfileSistems}
                        userId={userId}
                      />
                    )}
                    <div className={profileSistems ? "d-none" : ""}>
                      {myposts.length ? (
                        <div>
                          {myposts.map((post) => {
                            const resultBodyHtml = (
                              <div
                                className="book-by"
                                key={post._id}
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    post.body
                                      .slice(0, post.body?.indexOf(6))
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
                                      {}

                                      {post.postedBy.userPhoto ? (
                                        <img
                                          className=""
                                          style={{
                                            marginLeft: "20rem",
                                            maxHeight: "25px",
                                            minHeight: "25px",
                                            borderRadius: "50%",
                                            margin: "10px",
                                          }}
                                          src={post.postedBy.userPhoto}
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
                                    {post.postTrue.length ? (
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
                                          <span key={i}>
                                            <img
                                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsIlzGp1laQheiAAjrbJJ3pasHLjMBnIUEZg&usqp=CAU"
                                              alt=""
                                              className="like-img reaction"
                                            />
                                          </span>
                                        );
                                      })}
                                      <p className="ml-2 mt-1">
                                        {" "}
                                        Answers {post.commentId.length}
                                      </p>
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
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Profile;
