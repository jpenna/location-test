/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import { render, mount, shallow } from 'enzyme';

import LocationData from 'src/components/locationData';

describe('<LocationData />', () => {
  let rendered;

  beforeAll(() => {
    rendered = render(<LocationData title="title" />);
  });

  it('should have H2 title', () => {
    expect(rendered.find('h2').text()).toEqual('title');
  });

  it('should have a button to fetch user location', () => {
    expect(rendered.find('button.get-data').length).toEqual(1);
  });

  it('should have a button to reset user location', () => {
    expect(rendered.find('button.reset').length).toEqual(1);
  });

  it('should return formatted list of location data', () => {
    const data = { user: 'me', null: '', how: 'what' };
    const list = LocationData.renderLocationData(data);
    const listRendered = render(<span>{list}</span>);
    expect(listRendered.find('div')).toHaveLength(2);
    expect(listRendered.html().search('user') > 0).toBeTruthy();
    expect(listRendered.html().search('what') > 0).toBeTruthy();
  });

  it('should get location automatically if URL is defined', () => {
    const fetcher = jest.spyOn(LocationData.prototype, 'getLocation');
    const mounted = mount(<LocationData title="title" />);
    mounted.setProps({ url: 'ok.com' });
    expect(fetcher).toHaveBeenCalledTimes(1);
    fetcher.mockRestore();
  });

  it('should reset location data when RESET button is clicked', () => {
    const locationData = { one: 1, two: 2, three: 3 };
    const shallowed = shallow(<LocationData title="title" />);
    shallowed.setState({ locationData });
    expect(shallowed.state('locationData')).toEqual(locationData);
    shallowed.find('button.reset').simulate('click');
    expect(shallowed.state('locationData')).toEqual({});
  });
});
