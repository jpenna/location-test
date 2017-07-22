import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class InputUrl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUrlSubmit = this.handleUrlSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ url: event.target.value });
  }

  handleUrlSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.url);
  }

  render() {
    return (
      <div className="content">
        <form className="has-text-centered" onSubmit={this.handleUrlSubmit}>
          <div className="field has-addons has-addons-centered">
            <div className="control">
              <input
                className="input"
                value={this.state.url}
                type="text"
                pattern="^[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)"
                onChange={this.handleChange}
              />
            </div>
            <div className="control">
              <button type="submit" className="button is-primary">Go!</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

InputUrl.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
