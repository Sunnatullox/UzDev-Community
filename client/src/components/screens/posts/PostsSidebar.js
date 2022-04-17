import React, { useEffect, useState } from 'react'


export const PostsSidebar = ({setSearchTags}) => {

  const [myposts, setMyPosts] =useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [tags] = useState([
    "javascript",
    "python",
    "java",
    "c#",
    "php",
    "android",
    "html",
    "jquery",
    "c++ ",
    "css",
    "ios",
    "mysql",
    "sql",
    "r",
    "node.js",
    "arrays",
    "c",
    "react.js",
    "asp.net",
    "json",
    "ruby-on-rails",
    ".net",
    "sql-server",
    "swift",
    "python-3"])


    useEffect(() => {
      fetch("/mypost",{
        headers:{Authorization: "Sunna " + localStorage.getItem("jwt"),}
      }).then(res => res.json())
      .then(result => {
        setMyPosts(result.mypost)
      })
      ProfileInfo();
      hendeltags()
    },[])
    const ProfileInfo =()=>{
      fetch("/userInfo", {
        headers: { Authorization: "Sunna " + localStorage.getItem("jwt") }
      })
        .then((res) => res.json())
        .then((result) => {
          setUserInfo(result);
          setAnswers(Object.entries(result.answers))
          
        });
    }

    const hendeltags =() => {
      fetch("/allpost", {
        headers:{Authorization:"Sunna " + localStorage.getItem("jwt")}
      }).then(res => res.json())
      .then(result => {
        /* setTags(result.posts.map(item => {
          return item.tags.map(items => {
            return items
          })
        })) */
      })
    }


  return (
    <div>
        <div className="statistics">
          <h4>My statistics</h4>
          <div className="stat">
            <i className="fas fa-pencil-alt"></i>
            <span>My Posts</span>
            <span>{myposts.length}</span>
          </div>
          <div className="stat">
            <i className="far fa-comments"></i>
            <span>My Answers</span>
            <span>{answers.length}</span>
          </div>
          <div className="stat">
            <i className="fas fa-comments"></i>
            <span>My True Answers</span>
            <span>{userInfo.answerTrue}</span>
          </div>
      {/*     <div className="stat">
            <i className="fas fa-user"></i>
            <span>Members</span>
            <span>31</span>
          </div>
          <div className="stat">
            <i className="fas fa-users"></i>
            <span>Groups</span>
            <span>6</span>
          </div>
          <div className="stat">
            <i className="fas fa-comment"></i>
            <span>Forums</span>
            <span>7</span>
          </div>
          <div className="stat">
            <i className="fas fa-comment"></i>
            <span>Topics</span>
            <span>7</span>
          </div> */}
        </div>
          <br/>
        <div className="online text-center" style={{display:"grid"}}>
          <h4>Search with tags</h4>
          <span onClick={() => setSearchTags("")} className="postTags serchTags">All</span>
          {tags.map((item, i) => {
            return (
            <span key={i} onClick={() => setSearchTags(item)} className="postTags serchTags">{item}</span>
            )
          })}
        </div>

     {/*    <div className="replies">
          <h4>Recent Replies</h4>
          <p>
            Uniquely pontificate standards compliant <span>4 years ago</span>
          </p>
          <p>
            Quickly expedite holistic e-tailers{" "}
            <span>4 years, 7 months ago</span>
          </p>
          <p>
            Intrinsicly parallel task cross-platform{" "}
            <span>4 years, 7 months ago</span>
          </p>
        </div>

        <div className="topics">
          <h4>Recent Topics</h4>
          <p>
            Uniquely pontificate standards compliant <span>by </span>Michellie
            Jones
            <br /> <span>4 years ago</span>
          </p>
          <p>
            Quickly expedite holistic e-tailers
            <br /> <span>by </span>Justin Duchscherer
            <br /> <span>4 years, 7 months ago</span>
          </p>
          <p>
            Dynamically conceptualize<span>by </span>
            <br />
            Justin Duchscherer <br />
            <span>4 years, 7 months ago</span>
          </p>
        </div> */}
      </div>
  )
}
