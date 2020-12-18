/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { PanelColorSettings } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';

const SeekbarColorSettings = ( { attributes, setAttributes } ) => {
	const handleChangeSeekbarColor = seekbarColor => setAttributes( { seekbarColor } );

	const handleChangeSeekbarLoadingColor = seekbarLoadingColor =>
		setAttributes( { seekbarLoadingColor } );

	const handleChangeSeekbarPlayedColor = seekbarPlayedColor =>
		setAttributes( { seekbarPlayedColor } );

	return (
		<PanelColorSettings
			title={ __( 'Seekbar Colors' ) }
			initialOpen={ false }
			colorSettings={ [
				{
					value: attributes.seekbarColor,
					onChange: handleChangeSeekbarColor,
					label: __( 'Main' ),
				},
				{
					value: attributes.seekbarLoadingColor,
					onChange: handleChangeSeekbarLoadingColor,
					label: __( 'Loaded' ),
				},
				{
					value: attributes.seekbarPlayedColor,
					onChange: handleChangeSeekbarPlayedColor,
					label: __( 'Progress' ),
				},
			] }
		/>
	);
};

export default SeekbarColorSettings;
