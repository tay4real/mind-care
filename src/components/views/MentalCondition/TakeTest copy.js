import React, { Component } from "react";
import { Helmet } from "react-helmet";
import isEmpty from "../../../utils/is-empty";
import { Link } from "react-router-dom";

export default class TakeTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      condition: "",
      id: "",
      questions: [],
      answers: [],
      currentOptions: {},
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      score: 0,
      numberOfQuestions: 0,
      totalAssignedScore: 0,
      numberOfAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      loggedIn: false,
    };
  }

  async componentDidMount() {
    this.fetchAnswers();
    if (!isEmpty(this.props.location.category)) {
      var { slug } = this.props.location.category;
      this.setState({
        condition: this.props.location.category.condition.condition,
        loggedIn: this.props.loggedIn,
      });

      const url =
        `https://evening-mesa-59655.herokuapp.com/api/mental-conditions/` +
        slug.slug +
        `/questions`;

      const response = await fetch(url);
      const data = await response.json();

      this.setState({
        questions: data.data,
      });
    }

    console.log(this.state.answers);
    let {
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion,
    } = this.state;
    this.displayQuestions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );
  }

  displayQuestions = (
    questions = this.state.questions,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    currentOptions,
    numberOfQuestions
  ) => {
    let { currentQuestionIndex } = this.state;
    if (!isEmpty(this.state.questions)) {
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];
      currentOptions = currentQuestion.options;
      numberOfQuestions = questions.length;

      this.setState({
        currentQuestion,
        nextQuestion,
        previousQuestion,
        currentOptions,
        numberOfQuestions,
      });
    }
  };

  async fetchAnswers() {
    if (!isEmpty(this.props.location.category)) {
      var { slug } = this.props.location.category;
      const url2 =
        `https://evening-mesa-59655.herokuapp.com/api/mental-conditions/` +
        slug.slug +
        `/answers`;
      
      const response2 = await fetch(url2);
      const data2 = await response2.json();
      console.log(data2);
      this.setState({
        answers: data2.data,
      });
    }
  }

  computeScore = (mark) => {
    this.setState(
      (prevState) => ({
        score: prevState.score + mark,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
        totalAssignedScore:
          prevState.totalAssignedScore + prevState.currentOptions.length,
      }),
      () => {
        if (this.state.nextQuestion === undefined) {
          this.displayResults();
        } else {
          this.displayQuestions(
            this.state.question,
            this.state.currentOptions,
            this.state.nextQuestion,
            this.state.previousQuestion,
            this.state.currentOptions,
            this.state.numberOfQuestions
          );
        }
      }
    );
  };

  displayResults = () => {
    alert("You have come to the end of the test. Click OK to view your result");
    const { state } = this;
    const percentage_level =
      (this.state.score / this.state.totalAssignedScore) * 100;
    var recommendation = "";
    var level;
    if (percentage_level < 50) {
      level = "Low Level";
      recommendation =
        "You may not necessarily need medical attention but you are advised to talk to someone close and look up more about the mental illness";
    } else if (percentage_level > 50 && level < 80) {
      level = "High Level";
      recommendation =
        "You may be currently experiencing symptoms of moderate illness. The results doesn’t mean that you are sick but this symptoms could be causing difficulties managing relationships and even everyday task";
    } else {
      level = "High Level";
      recommendation =
        "The user need urgent medical attention and could be Suicidal at this point";
    }
    const userStats = {
      condition: state.condition,
      score: state.score,
      numberOfQuestions: state.numberOfQuestions,
      totalAssignedScore: state.totalAssignedScore,
      percentageScore: percentage_level,
      level: level,
      recommendation: recommendation,
      loggedIn: this.props.loggedIn,
    };

    setTimeout(() => {
      this.props.history.push("/result", userStats);
    }, 1000);
  };

  render() {
    const {
      currentQuestion,
      condition,
      numberOfQuestions,
      currentQuestionIndex,
    } = this.state;
    const { question, options } = currentQuestion;

    let displayTest;
    if (condition) {
      if (question) {
        displayTest = (
          <>
            <section className="col-md-9 mt-3 mb-3 mx-auto">
              <h1 className="h3  text-center font-weight-normal">
                {condition} Test
              </h1>
              {
                <div className="questions">
                  <div className="text-center">
                    <p>
                      <span>
                        Question {currentQuestionIndex + 1} of{" "}
                        {numberOfQuestions}
                      </span>
                    </p>
                  </div>
                  <h5>{question}</h5>
                  <div className=" grid-container">
                    {options && options.length > 0
                      ? options.map((option) => {
                          return (
                            <div
                              id={option.id}
                              onClick={this.computeScore.bind(
                                this,
                                option.mark
                              )}
                              className="option"
                              key={option.id}
                            >
                              {option.option}
                            </div>
                          );
                        })
                      : "Loading..."}
                  </div>
                </div>
              }
            </section>
          </>
        );
      } else if (numberOfQuestions === 0) {
        displayTest = (
          <>
            <section className="col-md-9 mt-3 mb-3 mx-auto">
              <h1 className="h3  text-center font-weight-normal">
                Sorry, {condition} Test is not Available Now
              </h1>

              <div className="take-test-container">
                <p>
                  <Link to="/categories" className="text-button">
                    Take another Test
                  </Link>
                </p>
              </div>
            </section>
          </>
        );
      }
    } else {
      displayTest = (
        <>
          <section className="col-md-9 mt-3 mb-3 mx-auto">
            <h1 className="h3  text-center font-weight-normal">
              No Test Available
            </h1>

            <div className="take-test-container">
              <p>
                <Link to="/categories" className="text-button">
                  Take a Test
                </Link>
              </p>
            </div>
          </section>
        </>
      );
    }

    return (
      <>
        <Helmet>
          <title>Mind Care | Mental Test</title>
        </Helmet>
        <div id="mentaltest">{displayTest}</div>
      </>
    );
  }
}
