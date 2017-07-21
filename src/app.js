import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Title from 'components/title';

class App extends Component {
  render() {
    return (
      <div>
        <Title />
      </div>
    );
  }
}

export default ReactDOM.render(
  <App />,
  document.querySelector('#container'));
