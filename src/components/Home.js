import React,{ Fragment } from "react";
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom";

const Home = () => (
       <Fragment>
       <Helmet><title>Quiz App - Home</title></Helmet>
        <div id="home">
            <section>
                <div>
                 <span className="mdi mdi-cube-outline mdi-48px"></span>
                </div>
                <h1>Quiz App</h1>
                <div className="play-button-container">
                    <ul>
                        <Link className="play-button" to="play/instructions">Play</Link>
                    </ul>
                </div>
                <div className="auth-container">
                {/* <Link to="/login" className="auth-buttons" id="login-button">Login</Link>
                <Link to="/register" className="auth-buttons" id="signup-button">Register</Link> */}
                </div>
            </section>
        </div>
        </Fragment>
    );

export default Home;