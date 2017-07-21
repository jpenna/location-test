/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import { render } from 'enzyme';

import Title from 'src/components/title';

describe('Title', () => {
  it('should have H1 title', () => {
    const component = render(<Title />);
    expect(component.find('h1').text()).toEqual('GeoLocation Test');
  });
});
