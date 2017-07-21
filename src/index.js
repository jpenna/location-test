import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return (
      <div className="test">
        Hello
      </div>
    );
  }
}

export default ReactDOM.render(
  <App />,
  document.querySelector('#container'));
