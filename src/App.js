import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const mockQuiz = [
  {
    question: 'Do you like React?',
    choices: [
      'Yes', 'Of course', 'Most certainly'
    ],
    correctChoice: 0
  }, 
  {
    question: 'Do you like Redux?',
    choices: [
      'Sure', 'Yeah', '...'
    ],
    correctChoice: 1
  },
]

function checkQuestionValidity(question, answer) {
  return question.correctChoice === answer
}

class Question extends Component {
  initialState = {
    selectedQuestion: -1,
    status: 'pending'
  }

  state = this.initialState

  constructor(props) {
    super(props)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleQuestionSelect = this.handleQuestionSelect.bind(this)
  }

  componentWillReceiveProps() {
    this.setState(this.initialState)
  }

  handleFormSubmit(e) {
    e.preventDefault()
    if (this.isLocked()) {
      this.props.onProceed()
    } else {
      const isValid = checkQuestionValidity(this.props, this.state.selectedQuestion)
      const status = isValid ? 'valid' : 'invalid'
      this.setState({ status })
    }
  }

  handleQuestionSelect(event) {
    const question = Number(event.target.value)
    this.setState({ selectedQuestion: question })
  }

  isLocked() {
    return this.state.status !== 'pending'
  }

  renderStatus() {
    if (this.isLocked()) {
      return (
        <div>
          {
            this.state.status === 'valid'
              ? 'Yes, this is a correct answer'
              : 'You made a wrong choice'
          }
        </div>
      )
    }
  }

  renderSubmitButton() {
    if (this.isLocked()) {
      return (
        <button>Next question</button>
      )
    } else {
      return (
        <button>Submit answer</button>
      )
    }
  }

  render() {
    return (
      <div>
        <h2>{this.props.question}</h2>
        {this.renderStatus()}
        <form onSubmit={this.handleFormSubmit}>
          {this.renderChoices()}
          {this.renderSubmitButton()}
        </form>
      </div>
    )
  }

  renderChoices() {
    return this.props.choices.map((choice, i) => (
      <li key={i}>
        {choice}
        <input disabled={this.isLocked()} type="radio" name="choice" value={i} onClick={this.handleQuestionSelect} />
      </li>
    ))
  }
}

class ProgressBar extends Component {
  getFillingPercentage() {
    return (this.props.current / this.props.total) * 100
  }

  render() {
    return (
      <div className="progress-bar">
        <div className="progress-bar--progress" style={this.style()} />
      </div>
    )
  }

  style() {
    return {
      width: `${this.getFillingPercentage()}%`
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.handleProceed = this.handleProceed.bind(this)
  }

  state = {
    currentQuestion: 0
  }

  handleProceed() {
    this.setState({ currentQuestion: this.state.currentQuestion + 1 })
  }

  isFinished() {
    return this.state.currentQuestion === mockQuiz.length
  }

  renderQuiz() {
    return (
      <Question {...mockQuiz[this.state.currentQuestion]} onProceed={this.handleProceed} />
    )
  }

  renderFinishPage() {
    return (
      <div>Good job! You scored ...</div>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Quizz</h2>
        </div>
        <div className="App-intro">
          <ProgressBar total={mockQuiz.length} current={this.state.currentQuestion} />
          {this.isFinished() ? this.renderFinishPage() : this.renderQuiz()}
        </div>
      </div>
    );
  }
}

export default App;
