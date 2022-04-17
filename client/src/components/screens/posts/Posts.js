/* eslint-disable no-lone-blocks */
import React, { useContext, useEffect, useState } from "react";
import "../../../style/Posts.scss";
import Pagination from "./Pagination";
import { PostsSidebar } from "./PostsSidebar";
import { Link, useHistory } from "react-router-dom";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import DOMPurify from "dompurify";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../../App";
import Loader from "../../Loader";
import SearchPosts from "./SearchPosts";
import Members from "./Members";
import Group from "../Group/Group";
import MobileGroupSidebar from "../Group/MobileGroupSidebar";

import ActiveMember from "./ActiveMember";
import Calendar from "./Calendar";
import Features from "./Features";
import PostItem from "./PostItem";
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramIcon,
  TelegramShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { Helmet } from "react-helmet-async";

function Posts() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(10);
  const [searchPost, setSearchPost] = useState("");
  const [Share, setShare] = useState("");
  const [searchTag, setSearchTags] = useState("");
  const [phoneSidebar, setPhoneSidebar] = useState(false);
  const shareUrl = `https://uzdev-community.herokuapp.com/postComments/${Share}`;

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        /* console.log(result); */
        setData(result.posts);
      });
  }, [data]);

  /* pagination post  yasash  */

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  /*pagination post raqamlar bosilganda almashishligi uchun  */
  const PaginatePost = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Helmet>
        <title>UzDev-Community</title>
        <meta name="description" content="All Questions" />
        <link rel="canonical" href="/posts" />
      </Helmet>
      {currentPosts.length ? (
        <div className="PostsList">
          <ToastContainer />
          <div className="part1">
            <div
              className={
                phoneSidebar
                  ? "mobileSidebar py-3"
                  : "mobileSidebar py-3 noActive"
              }
            >
              <header>
                {phoneSidebar ? (
                  <i
                    onClick={() => setPhoneSidebar(!phoneSidebar)}
                    className="fa-solid fa-angles-left togleLeft"
                  ></i>
                ) : (
                  <i
                    onClick={() => setPhoneSidebar(!phoneSidebar)}
                    className="fa-solid fa-angles-right togleLeft"
                  ></i>
                )}
              </header>
              <div className="menu_bar mt-5">
                <div className="menu_search">
                  <SearchPosts setSearchPost={setSearchPost} />
                  <hr />
                  <Members />
                  <hr />
                  {phoneSidebar && <MobileGroupSidebar />}
                  <hr />
                  <Calendar />
                  <hr />
                  <PostsSidebar setSearchTags={setSearchTags} />
                </div>
              </div>
            </div>

            <div className="sidebarDecktop">
              <div className="search d-flex ">
                <SearchPosts setSearchPost={setSearchPost} />
              </div>
              <Members />
              {!phoneSidebar && <Group />}
              <Calendar />
            </div>
          </div>

          <div className="part2">
            <div className="slider">
              <p>Welcome to the Community!</p>
            </div>
            <div className="posts">
              <h4>All Questions</h4>
              {currentPosts
                .filter((val) => {
                  if (searchPost === "" && searchTag === "") {
                    return val;
                  } else if (
                    val?.title
                      .toLowerCase()
                      .includes(searchPost.toLowerCase()) &&
                    val?.tags.some((value) => value.includes(searchTag))
                  ) {
                    return val;
                  }
                })
                .map((item, i) => {
                  const resultBodyHtml = (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          item.body
                            .slice(0, item.body?.indexOf(7))
                            .slice(0, 1500)
                        ),
                      }}
                    />
                  );
                  return (
                    <div>
                      <PostItem
                        key={i}
                        setShare={setShare}
                        item={item}
                        resultBodyHtml={resultBodyHtml}
                      />
                    </div>
                  );
                })
                .reverse()}

              <div className="num">
                <Pagination
                  postPerPage={postPerPage}
                  totalPosts={data.length}
                  paginate={PaginatePost}
                />
              </div>
            </div>

            {/*  <Features /> */}
          </div>
          <div className="part3">
            <PostsSidebar setSearchTags={setSearchTags} />
          </div>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content" style={{ marginTop: "10em" }}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Share Post
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-bodya">
                  <FacebookShareButton url={shareUrl}>
                    <FacebookIcon size={50} round={true} />
                    <div>
                      <span style={{ marginTop: "1em" }}>Facebook</span>
                    </div>
                  </FacebookShareButton>
                  <TelegramShareButton url={shareUrl}>
                    <TelegramIcon size={50} round={true} />
                    <div>
                      <span style={{ marginTop: "1em" }}>Telegram</span>
                    </div>
                  </TelegramShareButton>
                  <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon size={50} round={true} />
                    <div>
                      <span style={{ marginTop: "1em" }}>Linkedin</span>
                    </div>
                  </LinkedinShareButton>
                  <TwitterShareButton url={shareUrl}>
                    <TwitterIcon size={50} round={true} />
                    <div>
                      <span style={{ marginTop: "1em" }}>Twitter</span>
                    </div>
                  </TwitterShareButton>
                  <WhatsappShareButton url={shareUrl}>
                    <WhatsappIcon size={50} round={true} />
                    <div>
                      <span style={{ marginTop: "1em" }}>Whatsapp</span>
                    </div>
                  </WhatsappShareButton>
                  <div className="sharePosts">
                    <span style={{ wordBreak: "break-all" }}>{shareUrl}</span>
                  </div>
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Posts;
