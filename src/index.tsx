import * as React from "react";
import { Component, ClassAttributes } from "react";
import { createRoot } from 'react-dom/client';

// is defined to format seconds into a minute:seconds format
const formattedSeconds = (sec: number) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

// An interface is declared to define the properties the "Stopwatch" class component should expect
interface StopwatchProps {
  initialSeconds: number;
}

interface StopwatchState {
  incrementer: number | null;
  secondsElapsed: number;
  laps: number[];
}

class Stopwatch extends Component<StopwatchProps, StopwatchState> {

  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      incrementer: null,
      secondsElapsed: props.initialSeconds,
      laps: [],
    }
  }

  //Starts a timer that increments the secondsElapsed state every second
  handleStartClick = () => {
    this.setState({
      incrementer: window.setInterval(() =>
        this.setState({
          secondsElapsed: this.state.secondsElapsed + 1,
        }), 1000),
    });
  }

  // Stops the timer and stores the last cleared incrementer
  handleStopClick = () => {
    if (!this.state.incrementer) return;
    clearInterval(this.state.incrementer);
    this.setState({
      incrementer: null,
    });
  }

  // Resets the timer and clears the laps
  handleResetClick = () => {
    this.setState({
      secondsElapsed: 0,
      laps: [],
    });
  }

  // Stores the current elapsed time as a lap
  handleLapClick = () => {
    this.setState({
      laps: this.state.laps.concat([this.state.secondsElapsed]),
    });
  }

  // Deletes a lap based on its index
  handleDeleteClick = (index: number): void => {
    this.setState({
      laps: this.state.laps.filter((lap: any, i: number) => i !== index),
    })
  }

  // The TSX to render the stopwatch with the start/stop/reset/lap buttons and laps.
  render() {
    const {
      secondsElapsed,
      laps,
      incrementer,
    } = this.state;
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {(!incrementer
          ? <button type="button" className="start-btn"
            onClick={this.handleStartClick}>start</button>
          : <button type="button" className="stop-btn"
            onClick={this.handleStopClick}>stop</button>
        )}
        {(incrementer
          ? <button type="button" onClick={this.handleLapClick}>lap</button>
          : null
        )}
        {(secondsElapsed !== 0 && !incrementer
          ? <button type="button" onClick={this.handleResetClick}>reset</button>
          : null
        )}
        <div className="stopwatch-laps">
          {laps.map((lap, i) =>
            <Lap key={i} index={i + 1} lap={lap} onDelete={() => this.handleDeleteClick(i)} />)}
        </div>
      </div>
    );
  }
}

// A functional component to render each lap
const Lap = (props: { index: number, lap: number, onDelete: () => void }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)} <button
      onClick={props.onDelete} > X </button>
  </div>
);

//the ReactDOM.render method is used to render the Stopwatch component into an HTML element with the id "content"
const container = document.getElementById('content') as HTMLElement;
const root = createRoot(container);
root.render(
  <Stopwatch initialSeconds={0} />
);