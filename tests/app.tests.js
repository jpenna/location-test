/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import App from 'src/app';
import Title from 'src/components/title';

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
    expect(shallowed.find('LocationData').length).toEqual(2);
  });

  it('should have <InputUrl /> component', () => {
    expect(shallowed.find('InputUrl').length).toEqual(1);
  });

  it('should set locationData when setLocationData() is called with params', () => {
    const type = 'user';
    const data = { data: 'location' };
    jest.spyOn(App.prototype, 'setState');
    shallowed.instance().setLocationData(type, data);
    expect(App.prototype.setState).toHaveBeenCalledWith({ locations: { [type]: data, web: {} } });
    App.prototype.setState.mockRestore();
  });

  it('should set URL on input component submit', () => {
    const url = 'myurl.com';
    shallowed.instance().handleUrlSubmit(url);
    expect(shallowed.state('url')).toEqual(url);
  });

  it('should render correctly', () => {
    const rendered = renderer.create(<App />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
