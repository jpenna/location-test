/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import { render, mount, shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import LocationData from 'src/components/locationData';

const axiosMock = new MockAdapter(axios);

describe('<LocationData />', () => {
  let rendered;
  let props;
  let url;
  let axiosResponse;

  beforeAll(() => {
    props = {
      title: 'title',
      locationData: {},
      setLocationData: jest.fn(),
      type: 'user',
    };
    url = 'ok.com';
    axiosResponse = { data: 'data' };

    rendered = render(<LocationData {...props} />);
  });

  beforeEach(() => {
    axiosMock.onGet(`http://freegeoip.net/json/${url}`)
      .reply(200, axiosResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  afterAll(() => {
    axiosMock.restore();
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
    const mounted = mount(<LocationData {...props} />);
    mounted.setProps({ url });
    expect(fetcher).toHaveBeenCalledTimes(1);
    fetcher.mockRestore();
  });

  it('getLocation() should call props.setLocation with type and data', () => {
    const setLocationData = jest.fn();
    const context = {
      props: { url, setLocationData, type: 'ops' },
      setState: jest.fn(),
    };
    return LocationData.prototype.getLocation.call(context)
      .then(() => {
        expect(setLocationData.mock.calls).toEqual([[context.props.type, axiosResponse]]);
        expect(context.setState.mock.calls).toEqual([[{ error: '' }]]);
      });
  });

  it('getLocation() should set error on exception', () => {
    const urlError = 'error';
    axiosMock.onGet(`http://freegeoip.net/json/${urlError}`)
      .networkError();
    const context = {
      setState: jest.fn(),
      props: { url: urlError, setLocationData: () => {} },
    };
    return LocationData.prototype.getLocation.call(context)
      .then(() => {
        expect(context.setState.mock.calls).toEqual([[{ error: 'Sorry, couldn\'t fecth data.' }]]);
      });
  });

  it('should reset location data when RESET button is clicked', () => {
    const shallowed = shallow(<LocationData {...props} />);
    shallowed.find('button.reset').simulate('click');
    expect(props.setLocationData).toHaveBeenCalledTimes(1);
  });

  it('should hide GET DATA button if props says so', () => {
    const renderedHidden = render(<LocationData {...props} hideButton />);
    expect(renderedHidden.find('button.get-data').parent().attr('hidden')).toEqual('hidden');
  });

  it('should hide RESET button if props says so', () => {
    const renderedHidden = render(<LocationData {...props} hideButton />);
    expect(renderedHidden.find('button.reset').attr('hidden')).toEqual('hidden');
  });

  it('should have the right TypeProps', () => {
    const propTypes = {
      url: PropTypes.string,
      hideButton: PropTypes.bool,
      title: PropTypes.string.isRequired,
      setLocationData: PropTypes.func.isRequired,
      locationData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
      type: PropTypes.string.isRequired,
    };
    expect(LocationData.propTypes).toEqual(propTypes);
  });

  it('should have the right DefaultProps', () => {
    const defaultProps = {
      url: '',
      hideButton: false,
      locationData: {},
    };
    expect(LocationData.defaultProps).toEqual(defaultProps);
  });
});
