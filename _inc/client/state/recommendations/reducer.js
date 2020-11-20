/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { combineReducers } from 'redux';
import { assign, difference, get, mergeWith, remove, union } from 'lodash';

/**
 * Internal dependencies
 */
import { getInitialRecommendationsStep } from '../initial-state/reducer';
import {
	JETPACK_RECOMMENDATIONS_DATA_ADD_SELECTED_RECOMMENDATION,
	JETPACK_RECOMMENDATIONS_DATA_ADD_SKIPPED_RECOMMENDATION,
	JETPACK_RECOMMENDATIONS_DATA_FETCH,
	JETPACK_RECOMMENDATIONS_DATA_FETCH_RECEIVE,
	JETPACK_RECOMMENDATIONS_DATA_FETCH_FAIL,
	JETPACK_RECOMMENDATIONS_DATA_UPDATE,
	JETPACK_RECOMMENDATIONS_STEP_FETCH_RECEIVE,
	JETPACK_RECOMMENDATIONS_STEP_UPDATE,
} from 'state/action-types';
import { getSetting } from 'state/settings';
import { isPluginActive } from 'state/site/plugins';

const mergeArrays = ( obj, src ) => {
	if ( Array.isArray( obj ) && Array.isArray( src ) ) {
		return union( obj, src );
	}
};

const data = ( state = {}, action ) => {
	switch ( action.type ) {
		case JETPACK_RECOMMENDATIONS_DATA_FETCH_RECEIVE:
		case JETPACK_RECOMMENDATIONS_DATA_UPDATE:
			return assign( {}, state, action.data );
		case JETPACK_RECOMMENDATIONS_DATA_ADD_SELECTED_RECOMMENDATION:
			const selectedState = mergeWith(
				{},
				state,
				{
					selectedRecommendations: [ action.slug ],
					skippedRecommendations: [],
				},
				mergeArrays
			);
			selectedState.skippedRecommendations = difference( state.skippedRecommendations, [
				action.slug,
			] );
			return selectedState;
		case JETPACK_RECOMMENDATIONS_DATA_ADD_SKIPPED_RECOMMENDATION:
			const skippedState = mergeWith(
				{},
				state,
				{
					selectedRecommendations: [],
					skippedRecommendations: [ action.slug ],
				},
				mergeArrays
			);
			skippedState.selectedRecommendations = difference( state.selectedRecommendations, [
				action.slug,
			] );
			return skippedState;
		default:
			return state;
	}
};

const requests = ( state = {}, action ) => {
	switch ( action ) {
		case JETPACK_RECOMMENDATIONS_DATA_FETCH:
			return assign( {}, state, { isFetchingRecommendationsData: true } );
		case JETPACK_RECOMMENDATIONS_DATA_FETCH_RECEIVE:
		case JETPACK_RECOMMENDATIONS_DATA_FETCH_FAIL:
			return assign( {}, state, { isFetchingRecommendationsData: false } );
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

export const reducer = combineReducers( { data, requests, step: stepReducer } );

export const isFetchingRecommendationsData = state => {
	return !! state.jetpack.recommendations.requests.isFetchingRecommendationsData;
};

export const getDataByKey = ( state, key ) => {
	return get( state.jetpack, [ 'recommendations', 'data', key ], false );
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

const isStepEligibleToShow = ( state, step ) => {
	// TODO
	return true;
};

const getNextEligibleStep = ( state, step ) => {
	let nextStep = stepToNextStep[ step ];
	while ( ! isStepEligibleToShow( state, nextStep ) ) {
		nextStep = stepToNextStep[ nextStep ];
	}
	return nextStep;
};

export const getNextRoute = state => {
	const currentStep = getStep( state );
	const nextStep = getNextEligibleStep( state, currentStep );
	return stepToRoute[ nextStep ];
};

export const getSiteTypeDisplayName = state => {
	const siteTypeKeysInPreferenceOrder = [
		'site-type-store',
		'site-type-business',
		'site-type-personal',
		'site-type-other',
	];

	const siteTypeDisplayNamesByKey = {
		/* translators: A name for a website that sells things */
		'site-type-store': __( 'store', 'jetpack' ),
		/* translators: A name for a website for a business */
		'site-type-business': __( 'business site', 'jetpack' ),
		/* translators: A name for a website for personal use */
		'site-type-personal': __( 'personal site', 'jetpack' ),
		/* translators: A generic name for a website */
		'site-type-other': __( 'site', 'jetpack' ),
	};

	for ( const key of siteTypeKeysInPreferenceOrder ) {
		if ( true === getDataByKey( state, key ) ) {
			return siteTypeDisplayNamesByKey[ key ];
		}
	}

	return siteTypeDisplayNamesByKey[ 'site-type-other' ];
};

const sortFeatureSlugArray = featureSlugArray => {
	const sortOrder = [
		'woocommerce',
		'monitor',
		'related-posts',
		'creative-mail',
		'site-accelerator',
	];

	// This is here to help ensure when new recommendations are added the sort order is updated as well.
	const unknownSlugs = difference( featureSlugArray, sortOrder );
	if ( unknownSlugs.length > 0 ) {
		throw `Unknown feature slugs in sortFeatureSlugArray() in recommendations/reducer.js: ${ unknownSlugs }`;
	}

	return featureSlugArray.sort( ( a, b ) => sortOrder.indexOf( a ) - sortOrder.indexOf( b ) );
};

export const isFeatureActive = ( state, featureSlug ) => {
	switch ( featureSlug ) {
		case 'creative-mail':
			return !! isPluginActive(
				state,
				'creative-mail-by-constant-contact/creative-mail-plugin.php'
			);
		case 'monitor':
			return !! getSetting( state, 'monitor' );
		case 'related-posts':
			return !! getSetting( state, 'related-posts' );
		case 'site-accelerator':
			return !! getSetting( state, 'photon' ) && getSetting( state, 'photon-cdn' );
		case 'woocommerce':
			return !! isPluginActive( state, 'woocommerce/woocommerce.php' );
		default:
			throw `Unknown featureSlug in isFeatureEnabled() in recommendations/reducer.js: ${ featureSlug }`;
	}
};

export const getSummaryFeatureSlugs = state => {
	const featureSlugsInPreferenceOrder = [
		'woocommerce',
		'monitor',
		'related-posts',
		'creative-mail',
		'site-accelerator',
	];

	const selected = [];
	const skipped = [];

	for ( const slug of featureSlugsInPreferenceOrder ) {
		if ( isFeatureActive( state, slug ) ) {
			selected.push( slug );
		} else {
			skipped.push( slug );
		}
	}

	return {
		selected,
		skipped,
	};
};
