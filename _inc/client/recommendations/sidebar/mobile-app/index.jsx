/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import React from 'react';

/**
 * Internal dependencies
 */
import { Layout } from '../layout';
import { jetpackCreateInterpolateElement } from 'components/create-interpolate-element';
import Gridicon from 'components/gridicon';
import { imagePath } from 'constants/urls';

const MobileApp = () => {
	// TODO: WordPress.com link

	const features = [
		__( 'Refined post and page editor' ),
		__( 'Manage multiple sites from one dash' ),
		__( 'Multi-site plugin management' ),
		__( 'Free stock photo library' ),
		__( 'Update your site from any device' ),
	];

	return (
		<Layout
			illustrationPath={ imagePath + '/recommendations/mobile-app.svg' }
			content={
				<div>
					<h2>{ __( 'Explore a better editing experience' ) }</h2>
					<p>
						{ jetpackCreateInterpolateElement(
							__(
								'With Jetpack, you have <strong>free access</strong> to managing your site with <a>WordPress.com</a> and the Android and iOS WordPress apps.'
							),
							{
								strong: <strong />,
								a: <a href="https://wordpress.com" target="_blank" rel="noreferrer" />,
							}
						) }
					</p>
					<ul className="jp-recommendations-sidebar-card__features">
						{ features.map( feature => (
							<li>
								<Gridicon icon="checkmark-circle" />
								{ feature }
							</li>
						) ) }
					</ul>
				</div>
			}
		/>
	);
};

export { MobileApp };
