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

const stepReducer = ( state = '', action ) => {
	switch ( action.type ) {
		case JETPACK_RECOMMENDATIONS_STEP_FETCH_RECEIVE:
		case JETPACK_RECOMMENDATIONS_STEP_UPDATE:
			return action.step;
		default:
			return state;
	}
};

export const reducer = combineReducers( { data, step: stepReducer } );

export const getDataByKey = ( state, key ) => {
	return get( state.jetpack, [ 'recommendations', 'data', key ], '' );
};

export const getStep = state => {
	return '' === get( state.jetpack, [ 'recommendations', 'step' ], '' )
		? getInitialRecommendationsStep( state )
		: state.jetpack.recommendations.step;
};

const stepToNextStep = {
	'not-started': 'site-type-question',
	'site-type-question': 'woocommerce',
	woocommerce: 'monitor',
	monitor: 'related-posts',
	'related-posts': 'creative-mail',
	'creative-mail': 'site-accelerator',
	'site-accelerator': 'summary',
	summary: 'summary',
};

const stepToRoute = {
	'not-started': '#/recommendations/site-type',
	'site-type-question': '#/recommendations/site-type',
	woocommerce: '#/recommendations/woocommerce',
	monitor: '#/recommendations/monitor',
	'related-posts': '#/recommendations/related-posts',
	'creative-mail': '#/recommendations/creative-mail',
	'site-accelerator': '#/recommendations/site-accelerator',
	summary: '#/recommendations/summary',
};

const isStepEligible = ( state, step ) => {
	return true;
};

const getNextEligibleStep = ( state, step ) => {
	let nextStep = stepToNextStep[ step ];
	while ( ! isStepEligible( state, nextStep ) ) {
		nextStep = stepToNextStep[ nextStep ];
	}
	return nextStep;
};

export const getNextRoute = state => {
	const currentStep = getStep( state );
	const nextStep = getNextEligibleStep( state, currentStep );
	return stepToRoute[ nextStep ];
};
