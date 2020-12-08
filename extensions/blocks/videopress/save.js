/**
 * External dependencies
 */
import classnames from 'classnames';
import { createHigherOrderComponent } from '@wordpress/compose';
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getVideoPressUrl } from './url';

const VideoPressSave = CoreVideoSave => props => {
	const {
		attributes: {
			autoplay,
			caption,
			controls,
			guid,
			loop,
			muted,
			poster,
			preload,
			classNames,
			align,
		} = {},
	} = props;

	if ( ! guid ) {
		/**
		 * We return the element produced by the render so Gutenberg can add the block class when cloning the element.
		 * This is due to the fact that `React.cloneElement` ignores the class name when we clone a component to be
		 * rendered (i.e. `React.cloneElement( <CoreVideoSave { ...props } />, { className: 'wp-block-video' } )`).
		 *
		 * @see https://github.com/WordPress/gutenberg/blob/3f1324b53cc8bb45d08d12d5321d6f88510bed09/packages/blocks/src/api/serializer.js#L78-L96
		 * @see https://github.com/WordPress/gutenberg/blob/c5f9bd88125282a0c35f887cc8d835f065893112/packages/editor/src/hooks/generated-class-name.js#L42
		 * @see https://github.com/Automattic/wp-calypso/pull/30546#issuecomment-463637946
		 */
		return CoreVideoSave( props );
	}

	const url = getVideoPressUrl( guid, {
		autoplay,
		controls,
		loop,
		muted,
		poster,
		preload,
	} );

	const blockProps = useBlockProps
		? useBlockProps.save()
		: {
				className: classnames( classNames, { [ `align${ align }` ]: align } ),
		  };

	return (
		<figure { ...blockProps }>
			<div className="wp-block-embed__wrapper">
				{ `\n${ url }\n` /* URL needs to be on its own line. */ }
			</div>
			{ ! RichText.isEmpty( caption ) && (
				<RichText.Content tagName="figcaption" value={ caption } />
			) }
		</figure>
	);
};

export default createHigherOrderComponent( VideoPressSave, 'withVideoPressSave' );
