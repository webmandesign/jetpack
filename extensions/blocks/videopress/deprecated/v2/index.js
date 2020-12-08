/**
 * Internal dependencies
 */
import save from './save';

// This deprecation is a result of switching to useBlockProps in save to allow
// Gutenberg align hook to inject CSS alignment class e.g. `alignwide`.
export default {
	attributes: {
		autoplay: {
			type: 'boolean',
		},
		caption: {
			type: 'string',
			source: 'html',
			selector: 'figcaption',
		},
		controls: {
			type: 'boolean',
			default: true,
		},
		guid: {
			type: 'string',
		},
		id: {
			type: 'number',
		},
		loop: {
			type: 'boolean',
		},
		muted: {
			type: 'boolean',
		},
		playsInline: {
			type: 'boolean',
		},
		poster: {
			type: 'string',
		},
		preload: {
			type: 'string',
			default: 'metadata',
		},
		src: {
			type: 'string',
		},
	},
	support: {
		reusable: false,
	},
	isEligible: ( { align, classNames } ) => {
		return align && classNames.indexOf( `align${ align }` ) === -1;
	},
	save,
	isDeprecation: true,
};
