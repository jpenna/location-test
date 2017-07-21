/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import { shallow } from 'enzyme';

import App from 'src/app';
import Title from 'src/components/title';

describe('<App />', () => {
  let shallowed;

  beforeEach(() => {
    shallowed = shallow(<App />);
  });

  it('should have <Title /> component', () => {
    // console.log(shallowed.html());
    expect(shallowed.contains(<Title />)).toBeTruthy();
  });

  it('should have <LocationData /> component', () => {
    expect(shallowed.find('LocationData').length).toEqual(2);
  });

  it('should have <InputUrl /> component', () => {
    expect(shallowed.find('InputUrl').length).toEqual(1);
  });

  it('should set URL on input component submit', () => {
    const url = 'myurl.com';
    shallowed.instance().handleUrlSubmit(url);
    expect(shallowed.state('url')).toEqual(url);
  });
});
