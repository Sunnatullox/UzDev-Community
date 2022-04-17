import React, { useContext, useEffect, useState } from "react";
import Avatart from "../../../image/user-circle.svg";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import memberIcon from "../../../image/left to line.svg";
import { toast } from "react-toastify";

function MemberGroup({ userId, convertatsionId, adminId }) {
  const [users, setUsers] = useState([]);
  const [SearchUsers, setSearchUsers] = useState("");
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    hendelUser();
  }, [users]);
/* 
  console.log(); */

  const membersGroup = async (id) => {
    try{

      await fetch("/memberUser",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          Authorization:"Sunna " + localStorage.getItem("jwt")
        },
        body:JSON.stringify(
          {convertatsionId, userId:id})
      }).then(res => res.json())
      .then(user => {
        if(user.error){
          toast.error("User gruppaga qo'shilmadi")
        }
        console.log(user);
      })

    }catch(err){
      console.log(err);
    }

  };

  const hendelUser = () => {
    fetch("/AllUser", {
      headers: {
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  };

  return (
    <div>
      {" "}
      <div className="members" style={{ display: "table", width: "initial" }}>
        <input
          type="search"
          className="border w-100  mt-5 m-1 form-control"
          placeholder="User Search"
          onChange={(e) => setSearchUsers(e.target.value)}
        />
        <br />
        <div className="users_Serach_Result">
          {users
            .filter((val) => {
              if (SearchUsers === "") {
                return val;
              } else if (
                val.name.toLowerCase().includes(SearchUsers.toLowerCase())
              ) {
                return val;
              } else if (
                val.email.toLowerCase().includes(SearchUsers.toLowerCase())
              ) {
                return val;
              }

              /* sort bu reyting bilan chiqarish uchuna userlarni  */
              // eslint-disable-next-line array-callback-return
            })
            .sort((a, b) => (a.timeM > b.timeM ? 1 : -1))
            .map((item, i) => {
              if (item.name === SearchUsers) {
                return (
                  <>
                  <div key={i} className="person">
                    <Link
                      to={
                        item._id !== state._id
                          ? `/profile/${item._id}`
                          : "/profile"
                      }
                    >
                      <div className="image">
                        {item.userPhoto ? (
                          <img src={item.userPhoto} alt={item.name} />
                        ) : (
                          <img src={Avatart} alt={item.name} />
                        )}
                      </div>
                    </Link>
                    <div className="info">
                      <Link
                        to={
                          item._id !== state._id
                            ? `/profile/${item._id}`
                            : "/profile"
                        }
                      >
                        <h5>{item.name}</h5>
                      </Link>
                      <p>{item.email}</p>
                      <div className="d-flex">
                        <span>{item.answerTrue} Correct answers</span>
                        {item?._id !== adminId?._id || item?._id !== userId?._id  ?(
                         <span onClick={() => membersGroup(item?._id)} className="d-flex jounUser  ">
                         Join{" "}
                         <img className="memberIcon" src={memberIcon} alt="" />
                       </span>
                        ):(
                      <p></p>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr/>
                  </>
                );
              }
            })
            .reverse()}
        </div>
      </div>
    </div>
  );
}

export default MemberGroup;
