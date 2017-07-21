/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import { shallow } from 'enzyme';

import App from 'src/app';
import Title from 'src/components/title';
import LocationData from 'src/components/locationData';

describe('<App />', () => {
  let shallowed;

  beforeAll(() => {
    shallowed = shallow(<App />);
  });

  it('should have <Title /> component', () => {
    // console.log(shallowed.html());
    expect(shallowed.contains(<Title />)).toBeTruthy();
  });

  it('should have <LocationData /> component', () => {
    expect(shallowed.contains(<LocationData />)).toBeTruthy();
  });
});
