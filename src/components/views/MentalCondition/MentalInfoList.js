import React, { Component } from "react";
import MentalInfo from "./MentalInfo";
import { getMedicalExpert } from "../../Utils/Common";

class MentalInfoList extends Component {
  constructor() {
    super();
    this.state = {
      conditions: [],
      state: "",
      states: [],
    };

    this.onChange = this.onChange.bind(this);
  }

  getMentalInfo = (value) => {
    console.log(value);
    getMedicalExpert(value)
      .then((res) => {
        this.setState({
          experts: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async componentDidMount() {
    this._isMounted = true;

    const url = "https://evening-mesa-59655.herokuapp.com/api/states";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
      states: data.data,
    });

    this.getExperts(this.state.state);
  }

  onChange(e) {
    e.preventDefault();

    const { name, value } = e.target;

    this.setState({ [name]: value });
    this.getExperts(value);
  }

  render() {
    const { states } = this.state;
    let stateList;
    if (states !== undefined) {
      stateList = states.map((state) => {
        const { id, name } = state;
        return (
          <option key={id} value={id}>
            {name}
          </option>
        );
      });
    }
    return (
      <div>
        {this.state.experts ? (
          <div>
            <div className="form-group">
              <label htmlFor="state">Search by State</label>
              <select
                className="custom-select"
                onChange={this.onChange}
                name="state"
              >
                <option value={""}>Show All States</option>
                {stateList}
              </select>
            </div>

            <div className="grid-container">
              {this.state.experts.map((currentExpert) => (
                <div
                  className="card"
                  style={{ margin: 0, padding: 0 }}
                  key={currentExpert.phone_number}
                >
                  <MentalInfo expert={currentExpert} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          "No experts found"
        )}
      </div>
    );
  }
}
export default MentalInfoList;
