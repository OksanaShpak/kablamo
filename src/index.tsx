import * as React from "react";
import { Component, ClassAttributes } from "react";
import { createRoot } from 'react-dom/client';

// is defined to format seconds into a minute:seconds format
const formattedSeconds = (sec: number) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

// An interface is declared to define the properties the "Stopwatch" class component should expect
interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

class Stopwatch extends Component<StopwatchProps, any> {
  incrementer: any
  laps: any[]
  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      lastClearedIncrementer: null,
    }
    this.laps = [];
  }

  //Starts a timer that increments the secondsElapsed state every second
  handleStartClick = () => {
    this.incrementer = setInterval(() =>
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1,
      }), 1000);
  }

  // Stops the timer and stores the last cleared incrementer
  handleStopClick = () => {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer,
    });
  }

  // Resets the timer and clears the laps
  handleResetClick = () => {
    clearInterval(this.incrementer);
    this.laps = [];
    this.setState({
      secondsElapsed: 0,
    });
  }

  // Stores the current elapsed time as a lap
  handleLabClick = () => {
    this.laps = this.laps.concat([this.state.secondsElapsed]);
    this.forceUpdate();
  }

  // Deletes a lap based on its index
  handleDeleteClick(index: number) {
    return () => this.laps.splice(index, 1);
  }

  // The TSX to render the stopwatch with the start/stop/reset/lap buttons and laps.
  render() {
    const {
      secondsElapsed,
      lastClearedIncrementer,
    } = this.state;
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {(secondsElapsed === 0 || this.incrementer === lastClearedIncrementer
          ? <button type="button" className="start-btn"
            onClick={this.handleStartClick}>start</button>
          : <button type="button" className="stop-btn"
            onClick={this.handleStopClick}>stop</button>
        )}
        {(secondsElapsed !== 0 && this.incrementer !== lastClearedIncrementer
          ? <button type="button" onClick={this.handleLabClick}>lap</button>
          : null
        )}
        {(secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer
          ? <button type="button" onClick={this.handleResetClick}>reset</button>
          : null
        )}
        <div className="stopwatch-laps">
          {this.laps && this.laps.map((lap, i) =>
            <Lap key={i} index={i + 1} lap={lap} onDelete={this.handleDeleteClick(i)} />)}
        </div>
      </div>
    );
  }
}

// A functional component to render each lap
const Lap = (props: { index: number, lap: number, onDelete: () => {} }) => (
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