import React from "react";
import { Link } from "react-router-dom";
import "../style/footer.css";
import logo from "../image/logo.png";

export const Footer = () => {
  return (
    <div className="container-fluid mt-5 ">
      <div className=" bg-white mx-5">
        <div className="row mb-4">
          <div className="col-md-4 col-sm-4 col-xs-4">
            <div className="footer-text pull-left">
              <Link
                to="/"
                className="navbar-brand d-flex"
                style={{ display: "block" }}
              >
                <h6
                  className="font-weight-bold mr-2 px-3 p-1 navlogo1 text-white"
                  style={{ backgroundColor: "#957bda" }}
                >
                  UzDeV
                </h6>
                <h6 className="p-1 navlogo">community</h6>{" "}
                <img
                  src={logo}
                  className="header__img"
                  alt="logo"
                  width="60"
                  height="30"
                />
              </Link>
              <p className="card-text">
                The purpose of creating this community is to increase the
                knowledge of our programmers by finding answers to their
                questions.
              </p>
              <div className="social mt-2 mb-3">
                {" "}
                <i className="fa-brands fa-facebook"></i>{" "}
                <i className="fa-brands fa-instagram-square"></i>{" "}
                <i className="fa-brands fa-linkedin"></i>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-2"></div>
          <div className="col-md-2 col-sm-2 col-xs-2">
            <h5 className="heading">Services</h5>
            <ul>
              <li>IT Consulting</li>
              <li>Development</li>
              <li>Cloud</li>
              <li>Support</li>
            </ul>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-2">
            <h5 className="heading">Industries</h5>
            <ul className="card-text">
              <li>Finance</li>
              <li>Public Sector</li>
              <li>Smart Office</li>
              <li>Retail</li>
            </ul>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-2">
            <h5 className="heading">Company</h5>
            <ul className="card-text">
              <li>About Us</li>
              <li>Blog</li>
              <li>Contact</li>
              <li>Join Us</li>
            </ul>
          </div>
        </div>
        <div className="divider mb-4"> </div>
        <div className="row" style={{ fontSize: "10px" }}>
          <div className="col-md-6 col-sm-6 col-xs-6">
            <div className="pull-left">
              <p>
                <i className="fa-solid fa-copyright"></i> {new Date().getDate()}{" "}
                {new Date().getMonth()} {new Date().getFullYear()} Carparation
              </p>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-6">
            <div className="pull-right mr-4 d-flex policy">
              <div>Terms of Use</div>
              <div>Privacy Policy</div>
              <div>Cookie Policy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
