/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import { render, mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
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
      locationData: { local: 'local' },
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

  it('should have H3 title', () => {
    expect(rendered.find('h3').length).toEqual(1);
  });

  it('should have a button to fetch user location', () => {
    expect(rendered.find('button.get-location-button').length).toEqual(1);
  });

  it('should have a button to reset user location', () => {
    expect(rendered.find('button.reset-button').length).toEqual(1);
  });

  it('should return formatted list of location data', () => {
    const data = { ip: 'me', notshow: 'not', country_name: '', city: 'city' };
    const list = LocationData.renderLocationData(data);
    const listRendered = render(<div>{list}</div>);
    expect(listRendered.find('div').first().children()).toHaveLength(3);
    expect(listRendered.html().search('IP') > 0).toBeTruthy();
    expect(listRendered.html().search('city') > 0).toBeTruthy();
    expect(listRendered.html().search('-') > 0).toBeTruthy();
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
    shallowed.find('button.reset-button').simulate('click');
    expect(props.setLocationData).toHaveBeenCalledTimes(1);
  });

  it('should hide GET DATA button if props says so', () => {
    const renderedHidden = render(<LocationData {...props} hideButton />);
    expect(renderedHidden.find('button.get-location-button').parent().attr('hidden')).toEqual('hidden');
  });

  it('should hide RESET button if props says so', () => {
    const renderedHidden = render(<LocationData {...props} hideButton />);
    expect(renderedHidden.find('button.reset-button').parent().attr('hidden')).toEqual('hidden');
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

  it('should render correctly', () => {
    const renderedJSON = renderer.create(<LocationData {...props} />).toJSON();
    expect(renderedJSON).toMatchSnapshot();
  });
});
