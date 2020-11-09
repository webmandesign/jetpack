/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { assign, get } from 'lodash';

import {
	JETPACK_RECOMMENDATIONS_DATA_FETCH_RECEIVE,
	JETPACK_RECOMMENDATIONS_STEP_FETCH_RECEIVE,
} from 'state/action-types';
import { getInitialRecommendationsStep } from '../initial-state/reducer';

const data = ( state = {}, action ) => {
	switch ( action.type ) {
		case JETPACK_RECOMMENDATIONS_DATA_FETCH_RECEIVE:
			return assign( {}, state, action.answer );
		default:
			return state;
	}
};

const step = ( state = '', action ) => {
	switch ( action.type ) {
		case JETPACK_RECOMMENDATIONS_STEP_FETCH_RECEIVE:
			return action.step;
		default:
			return state;
	}
};

export const reducer = combineReducers( { data, step } );

export const getData = state => {
	return get( state.jetpack, [ 'recommendations', 'data' ], '' );
};

export const getStep = state => {
	return '' === get( state.jetpack, [ 'recommendations', 'step' ], '' )
		? getInitialRecommendationsStep( state )
		: state.jetpack.recommendations.step;
};
