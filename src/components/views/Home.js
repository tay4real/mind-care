import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Agreement from "./MentalCondition/Agreement";

export class Home extends Component {
  state = {
    showModal: false,
  };
  closeModal = () => {
    this.setState({ showModal: false });
  };
  ModalToggle = () => {
    this.setState((prevState) => {
      return { showModal: !prevState.showModal };
    });
  };
  openModal = () => {
    this.setState({ showModal: true });
  };
  render() {
    return (
      <>
        <Helmet>
          <title>MindCare | Mental Health</title>
        </Helmet>

        <header id="home">
          <section className="text-white">
            <h1>Know Your Mental Health Status</h1>

            <div className="take-test-container">
              <Agreement close={this.ModalToggle} show={this.state.showModal} />
              <p>
                <Link to="/" onClick={this.openModal} className="text-button">
                  Take a Test
                </Link>
              </p>
              <p>
                <Link to="/learn" className="learn-button">
                  Learn
                </Link>
              </p>
            </div>
          </section>
        </header>
      </>
    );
  }
}

export default Home;
