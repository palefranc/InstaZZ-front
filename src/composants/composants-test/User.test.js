import React from 'react';
import {shallow} from 'enzyme';
import User from '../User';

test('User', () => {
	
	
	const user = shallow( <User /> );
	expect(user).not.toBeUndefined();
});