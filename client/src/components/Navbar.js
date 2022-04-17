import React from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../image/logo.png";
import { useContext } from "react";
import { UserContext } from "../App";

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory()

  const renderNav = () => {
    if (state) {
      return [
        <>
          <li className="header__el">
            <Link to="/createpost" className="header__link">
            Write question
            </Link>
          </li>
          <li className="header__el">
            <Link to="/posts" className="header__link">
              Posts
            </Link>
          </li>
          <li className="header__el">
            <Link to="/profile" className="header__link">
              Profile
            </Link>
          </li>
          <li className="header__el header__el--blue">
          <Link to="#" className="btn btn-width" onClick={() => {
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push("/signin")
            }}>
            Log Out →
          </Link>
        </li>
        </>
      ];
    } else {
      return [
        <li className="header__el header__el--blue">
          <Link to="/signup"  className="btn btn-width">
            Sign Up →
          </Link>
        </li>
      ];
    }
  };

  return (
    <>
      <header style={{"boxShadow":"4px 10px 7px rgb(0 0 0 / 40%)"}} className="header headrShadow sticky-top navbar navbar-expand-lg navbar-light container-fluid bg-white">
        <div className="container-fluid header__container">
          <div className="header__logo">
            <Link to="/" className="navbar-brand d-flex" style={{ display: "block" }}>
              <h3 className="font-weight-bold mr-2 px-3 p-1 navlogo1 text-white" style={{"backgroundColor":"#957bda"}}>UzDeV</h3>
              <h3 className="p-1 navlogo">
              community
              </h3>{" "}
              <img
                src={logo}
                className="header__img ml-2 mt-1"
                alt="logo"
                width="60"
                height="35"
                
              />
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="header__menu bg-white">
            <nav id="navbarNavAltMarkup" className="header__nav collapse bg-">
              <ul className="header__elenco">
                {renderNav() }
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
