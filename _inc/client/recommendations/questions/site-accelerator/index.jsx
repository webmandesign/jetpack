/**
 * External dependencies
 */
import { ProgressBar } from '@automattic/components';
import { __ } from '@wordpress/i18n';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { QuestionLayout } from '../layout';
import { jetpackCreateInterpolateElement } from 'components/create-interpolate-element';
import ExternalLink from 'components/external-link';
import InstallButton from 'components/install-button';
import { getNextRoute, updateRecommendationsStep } from 'state/recommendations';

const SiteAcceleratorQuestionComponent = props => {
	// TODO: skip if site accelerator is already enabled
	const { nextRoute } = props;

	useEffect( () => {
		props.updateRecommendationsStep( 'site-accelerator' );
	} );

	// TODO: set the href link on "Decide later"
	// TODO: actually enable site accelerator

	return (
		<QuestionLayout
			progressBar={ <ProgressBar color={ '#00A32A' } value={ '99' } /> }
			question={ __( 'Would you like Site Accelerator to help your site load faster?', 'jetpack' ) }
			description={ jetpackCreateInterpolateElement(
				__(
					'Faster sites get better ranking in search engines and help keep visitors on your site longer. <strong>Site Accerator</strong> will automatically optimize your image and files. <ExternalLink>Learn more</ExternalLink>',
					'jetpack'
				),
				{
					strong: <strong />,
					ExternalLink: (
						<ExternalLink
							href="https://jetpack.com/support/site-accelerator/"
							target="_blank"
							icon={ true }
							iconSize={ 16 }
						/>
					),
				}
			) }
			answer={
				<div className="jp-recommendations-question__install-section">
					<InstallButton primary href={ nextRoute }>
						{ __( 'Enable Site Accelerator' ) }
					</InstallButton>
					<a href={ nextRoute }>{ __( 'Decide later' ) }</a>
				</div>
			}
			illustrationPath="/recommendations/site-accelerator-illustration.svg"
		/>
	);
};

const SiteAcceleratorQuestion = connect(
	state => ( { nextRoute: getNextRoute( state ) } ),
	dispatch => ( {
		updateRecommendationsStep: step => dispatch( updateRecommendationsStep( step ) ),
	} )
)( SiteAcceleratorQuestionComponent );

export { SiteAcceleratorQuestion };
