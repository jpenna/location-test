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
        expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ error: '', infoDate: expect.any(String) }));
      });
  });

  it('getLocation() should reset locationData on exception', () => {
    const urlError = 'error';
    axiosMock.onGet(`http://freegeoip.net/json/${urlError}`)
      .reply(404);
    const context = {
      setState: jest.fn(),
      props: { url: urlError, setLocationData: () => {} },
      clearLocationData: jest.fn(),
    };
    return LocationData.prototype.getLocation.call(context)
      .then(() => {
        expect(context.clearLocationData).toHaveBeenCalledTimes(1);
      });
  });

  it('getLocation() should set error on Network Error', () => {
    const urlError = 'error';
    axiosMock.onGet(`http://freegeoip.net/json/${urlError}`)
      .networkError();
    const context = {
      setState: jest.fn(),
      props: { url: urlError, setLocationData: () => {} },
      clearLocationData: () => {},
    };
    return LocationData.prototype.getLocation.call(context)
      .then(() => {
        expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ error: 'Check your internet connection.' }));
      });
  });

  it('getLocation() should set error on exception', () => {
    const urlError = 'error';
    axiosMock.onGet(`http://freegeoip.net/json/${urlError}`)
      .reply(500);
    const context = {
      setState: jest.fn(),
      props: { url: urlError, setLocationData: () => {} },
      clearLocationData: () => {},
    };
    return LocationData.prototype.getLocation.call(context)
      .then(() => {
        expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ error: 'Sorry, couldn\'t fecth data.\nPlease try again.' }));
      });
  });

  it('getLocation() should set error on 404', () => {
    const urlError = 'error';
    axiosMock.onGet(`http://freegeoip.net/json/${urlError}`)
      .reply(404);
    const context = {
      setState: jest.fn(),
      props: { url: urlError, setLocationData: () => {} },
      clearLocationData: () => {},
    };
    return LocationData.prototype.getLocation.call(context)
      .then(() => {
        expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ error: `${urlError}\ndoesn't exist.` }));
      });
  });

  it('getLocation() should setState fetching to TRUE on start and FALSE on RESOLVE', () => {
    const context = {
      setState: jest.fn(),
      props: { url, setLocationData: () => {} },
    };
    return LocationData.prototype.getLocation.call(context)
      .then(() => {
        expect(context.setState).toHaveBeenCalledTimes(2);
        expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ fetching: true }));
        expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ fetching: false }));
      });
  });

  it('getLocation() should setState fetching to TRUE on start and FALSE on REJECT', () => {
    const urlError = 'error';
    axiosMock.onGet(`http://freegeoip.net/json/${urlError}`)
      .reply(404);
    const context = {
      setState: jest.fn(),
      props: { url: urlError, setLocationData: () => {} },
      clearLocationData: () => {},
    };
    return LocationData.prototype.getLocation.call(context)
    .then(() => {
      expect(context.setState).toHaveBeenCalledTimes(2);
      expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ fetching: true }));
      expect(context.setState).toHaveBeenCalledWith(expect.objectContaining({ fetching: false }));
    });
  });

  it('should reset location data when RESET button is clicked', () => {
    const shallowed = shallow(<LocationData {...props} />);
    shallowed.find('button.reset-button').simulate('click');
    expect(props.setLocationData).toHaveBeenCalledTimes(1);
  });

  it('should hide GET DATA button if props says so', () => {
    const renderedHidden = render(<LocationData {...props} hideButtons />);
    expect(renderedHidden.find('button.get-location-button').parent().attr('hidden')).toEqual('hidden');
  });

  it('should hide RESET button if props says so', () => {
    const renderedHidden = render(<LocationData {...props} hideButtons />);
    expect(renderedHidden.find('button.reset-button').parent().attr('hidden')).toEqual('hidden');
  });

  it('should hide info-sign if there is no locationData', () => {
    expect(rendered.find('.info-sign').hasClass('is-hidden')).toBeTruthy();
  });

  it('should not show info-balloon on Click if there is no locationData', () => {
    expect(rendered.find('.js-showInfo').attr('disabled')).toBeTruthy();
  });

  it('should show info-balloon on Click title', () => {
    const shallowed = shallow(<LocationData {...props} />);
    shallowed.setState({ infoDate: '23/12' });
    shallowed.find('.js-showInfo').simulate('click');
    expect(shallowed.render().find('.js-showInfo').attr('disabled')).toBeFalsy();
    expect(shallowed.state('showBalloon')).toBeTruthy();
  });

  it('should hide info-balloon on Click title again', () => {
    const shallowed = shallow(<LocationData {...props} />);
    shallowed.find('.js-showInfo').simulate('click');
    expect(shallowed.find('.info-balloon').hasClass('is-hidden')).toBeFalsy();
    shallowed.find('.js-showInfo').simulate('click');
    expect(shallowed.find('.info-balloon').hasClass('is-hidden')).toBeTruthy();
  });

  it('should hide info-balloon on Click close button in balloon', () => {
    const shallowed = shallow(<LocationData {...props} />);
    shallowed.setState({ showBalloon: true });
    expect(shallowed.find('.info-balloon').hasClass('is-hidden')).toBeFalsy();
    shallowed.find('.info-balloon').find('button').simulate('click');
    expect(shallowed.find('.info-balloon').hasClass('is-hidden')).toBeTruthy();
  });

  it('should have the right TypeProps', () => {
    const propTypes = {
      url: PropTypes.string,
      hideButtons: PropTypes.bool,
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
      hideButtons: false,
      locationData: {},
    };
    expect(LocationData.defaultProps).toEqual(defaultProps);
  });

  it('should render correctly', () => {
    const renderedJSON = renderer.create(<LocationData {...props} />).toJSON();
    expect(renderedJSON).toMatchSnapshot();
  });
});
