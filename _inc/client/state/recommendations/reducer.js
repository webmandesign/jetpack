/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { assign, get } from 'lodash';

import {
	JETPACK_RECOMMENDATIONS_DATA_FETCH_RECEIVE,
	JETPACK_RECOMMENDATIONS_DATA_UPDATE,
	JETPACK_RECOMMENDATIONS_STEP_FETCH_RECEIVE,
	JETPACK_RECOMMENDATIONS_STEP_UPDATE,
} from 'state/action-types';
import { getInitialRecommendationsStep } from '../initial-state/reducer';

const data = ( state = {}, action ) => {
	switch ( action.type ) {
		case JETPACK_RECOMMENDATIONS_DATA_FETCH_RECEIVE:
		case JETPACK_RECOMMENDATIONS_DATA_UPDATE:
			return assign( {}, state, action.data );
		default:
			return state;
	}
};

const step = ( state = '', action ) => {
	switch ( action.type ) {
		case JETPACK_RECOMMENDATIONS_STEP_FETCH_RECEIVE:
		case JETPACK_RECOMMENDATIONS_STEP_UPDATE:
			return action.step;
		default:
			return state;
	}
};

export const reducer = combineReducers( { data, step } );

export const getDataByKey = ( state, key ) => {
	return get( state.jetpack, [ 'recommendations', 'data', key ], '' );
};

export const getStep = state => {
	return '' === get( state.jetpack, [ 'recommendations', 'step' ], '' )
		? getInitialRecommendationsStep( state )
		: state.jetpack.recommendations.step;
};
