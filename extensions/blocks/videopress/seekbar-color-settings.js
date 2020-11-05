/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { PanelColorSettings, ContrastChecker } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';

const SeekbarColorSettings = ( { attributes, setAttributes } ) => {
	const handleChangeSeekbarColor = seekbarColor => setAttributes( { seekbarColor } );

	const handleChangeSeekbarLoadedColor = seekbarLoadedColor =>
		setAttributes( { seekbarLoadedColor } );

	const handleChangeSeekbarPlayedColor = seekbarPlayedColor =>
		setAttributes( { seekbarPlayedColor } );

	return (
		<PanelColorSettings
			title={ __( 'Seekbar colors' ) }
			initialOpen={ false }
			colorSettings={ [
				{
					value: attributes.seekbarColor,
					onChange: handleChangeSeekbarColor,
					label: __( 'Main' ),
				},
				{
					value: attributes.seekbarLoadedColor,
					onChange: handleChangeSeekbarLoadedColor,
					label: __( 'Loaded' ),
				},
				{
					value: attributes.seekbarPlayedColor,
					onChange: handleChangeSeekbarPlayedColor,
					label: __( 'Progress' ),
				},
			] }
		></PanelColorSettings>
	);
};

export default SeekbarColorSettings;
