import React, { useContext, useEffect, useState } from "react";
import Avatart from "../../../image/user-circle.svg";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";

function Members() {
  const [users, setUsers] = useState([]);
  const [SearchUsers, setSearchUsers] = useState("");
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    hendelUser();
  }, [users]);

  const hendelUser = async() => {
    try{
      fetch("/AllUser", {
        headers: {
          Authorization: "Sunna " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
        }).catch(err => {
          console.log(err);
        });
    }catch(err){
      console.log(err)
    }
  };

  return (
    <div>
      {" "}
      <div className="members" style={{ display: "table", width: "initial" }}>
        <input
          type="search"
          className="border w-100  m-1 form-control"
          placeholder="Search users"
          onChange={(e) => setSearchUsers(e.target.value)}
        />
        {/*       <div className="span-mem">
          <span>Newest</span>
          <span>Active</span>
          <span>Popular</span>
        </div> */}
        <br />
        <div className="users_Serach_Result">
          {users
            .filter((val) => {
              if (SearchUsers === "") {
                return val;
              } else if (
                val.name.toLowerCase().includes(SearchUsers.toLowerCase())
              ){
                return val;
              }else  if(val.email.toLowerCase().includes(SearchUsers.toLowerCase())) {
                return val;
              }

              /* sort bu reyting bilan chiqarish uchuna userlarni  */
              // eslint-disable-next-line array-callback-return
            }).sort((a, b) => a.timeM > b.timeM ? 1:-1)
            .map((item, i) => {
              if (item.name === SearchUsers) {
                return (
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
                      <div className="info">
                        <h5>{item.name}</h5>
                        <p>{item.email}</p>
                        <div className="d-flex">
                          <span>{item.answerTrue} Correct answers</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              }



              const InsortionSort = (arr) => {
                for (let i = 1; i < arr.length; i++) {
                  let key = arr[i];
              
                  let j = i - 1;
                  while (j >= 0 && arr[j] > key) {
                    arr[j + 1] = arr[j];
                    j = j - 1
                  }
              
                  arr[j + 1] = key;
                }
                        
                return arr;
              };

            const array = [item.answerTrue]
            
            if (InsortionSort(item.answerTrue) ) {
                return (
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
                      <div className="info">
                        <h5>{item.name}</h5>
                        <div className="d-flex">
                          <span>{item.answerTrue} Correct answers</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              }
            }).reverse()}
        </div>
      </div>
    </div>
  );
}

export default Members;
