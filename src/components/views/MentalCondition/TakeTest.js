import React, { Component } from "react";
import { Helmet } from "react-helmet";
import isEmpty from "../../../utils/is-empty";

import axios from "axios";
import { getToken } from "../../Utils/Common";

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
      numberOfQuestions: 0,
      totalAssignedScore: 0,
      score: 0,
      numberOfAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      loggedIn: false,
    };
  }

  async componentDidMount() {
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

  computeScore = (question_id, option_id, option_mark) => {
    console.log(this.state.mark);
    this.setState(
      (prevState) => ({
        score: prevState.score + option_mark,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
        totalAssignedScore:
          prevState.totalAssignedScore + prevState.currentOptions.length,
        answers: [
          ...prevState.answers,
          {
            question: question_id.toString(),
            option: option_id.toString(),
          },
        ],
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
    console.log(this.state.mark);
  };

  displayResults = () => {
    alert("You have come to the end of the test. Click OK to view your result");
    if (this.state.loggedIn) {
      var { slug } = this.props.location.category;
      const { answers } = this.state;
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const api =
        `https://evening-mesa-59655.herokuapp.com/api/mental-conditions/` +
        slug.slug +
        `/answers`;

      axios
        .post(
          api,
          {
            answers: answers,
          },
          config
        )
        .then((response) => {
          var userStats = {
            result: response.data.data,
            loggedIn: this.props.loggedIn,
          };
          setTimeout(() => {
            this.props.history.push("/result", userStats);
          }, 1000);
        })
        .catch((err) => {
          if (err.response) {
            this.setState({
              errors: err.response.data,
              displayErrors: true,
              success: "",
            });
          }
        });
    } else {
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
          "You need urgent medical attention and could be Suicidal at this point";
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
        this.props.history.push("/resultunauth", userStats);
      }, 1000);
    }
  };

  render() {
    const {
      currentQuestion,
      condition,
      numberOfQuestions,
      currentQuestionIndex,
    } = this.state;
    const { id, question, options } = currentQuestion;

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
                        Question{" "}
                        {currentQuestionIndex !== numberOfQuestions
                          ? currentQuestionIndex + 1
                          : numberOfQuestions}{" "}
                        of {numberOfQuestions}
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
                                id,
                                option.id,
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
      }
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
