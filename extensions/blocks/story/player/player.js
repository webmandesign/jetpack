/**
 * External dependencies
 */
import classNames from 'classnames';
import { some } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	createElement,
	useRef,
	useState,
	useEffect,
	useLayoutEffect,
	useCallback,
} from '@wordpress/element';
import { isBlobURL } from '@wordpress/blob';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Slide from './slide';
import icon from '../icon';
import ProgressBar from './progress-bar';
import { Background, Controls, Header, Overlay } from './components';
import useResizeObserver from './use-resize-observer';

export const Player = ( { id, slides, fullscreen, setFullscreen, disabled, ...settings } ) => {
	const { setPlaying, setMuted, showSlide } = useDispatch( 'jetpack/story/player' );

	const { playing, muted, currentSlideIndex, currentSlideEnded } = useSelect( select => {
		const { isPlaying, isMuted, getCurrentSlideIndex, hasCurrentSlideEnded } = select(
			'jetpack/story/player'
		);
		return {
			playing: isPlaying( id ),
			muted: isMuted( id ),
			currentSlideIndex: getCurrentSlideIndex( id ),
			currentSlideEnded: hasCurrentSlideEnded( id ),
		};
	}, [] );

	const wrapperRef = useRef();
	const [ maxSlideWidth, setMaxSlideWidth ] = useState( null );
	const [ resizeListener, { width, height } ] = useResizeObserver();
	const [ targetAspectRatio, setTargetAspectRatio ] = useState( settings.defaultAspectRatio );

	const ended = currentSlideEnded && currentSlideIndex === slides.length - 1;
	const uploading = some( slides, media => isBlobURL( media.url ) );
	const showProgressBar = fullscreen || ! settings.showSlideCount;
	const isVideo = slideIndex => {
		const media = slideIndex < slides.length ? slides[ slideIndex ] : null;
		if ( ! media ) {
			return false;
		}
		return 'video' === media.type || ( media.mime || '' ).startsWith( 'video/' );
	};

	const playSlide = ( slideIndex, play = settings.playOnNextSlide ) => {
		showSlide( id, slideIndex );

		if ( play ) {
			setPlaying( id, play );
		}
	};

	const onPress = useCallback( () => {
		if ( disabled ) {
			return;
		}
		if ( ended && ! playing ) {
			playSlide( 0 );
		}
		if ( ! fullscreen && ! playing && settings.playInFullscreen ) {
			setFullscreen( true );
			setPlaying( id, true );
		}
	}, [ playing, ended, fullscreen, disabled ] );

	const tryPreviousSlide = useCallback( () => {
		if ( currentSlideIndex > 0 ) {
			playSlide( currentSlideIndex - 1 );
		}
	}, [ currentSlideIndex ] );

	const tryNextSlide = useCallback( () => {
		if ( currentSlideIndex < slides.length - 1 ) {
			playSlide( currentSlideIndex + 1 );
		} else {
			setPlaying( id, false );
			if ( settings.exitFullscreenOnEnd ) {
				setFullscreen( false );
			}
		}
	}, [ currentSlideIndex, slides ] );

	const onExitFullscreen = useCallback( () => {
		setFullscreen( false );
		if ( settings.playInFullscreen ) {
			setPlaying( id, false );
		}
	}, [ fullscreen ] );

	// pause player when disabled
	useEffect( () => {
		if ( disabled && playing ) {
			setPlaying( id, false );
		}
	}, [ disabled, playing ] );

	useEffect( () => {
		if ( settings.loadInFullscreen ) {
			setFullscreen( true );
		}
		if ( settings.playOnLoad ) {
			setPlaying( id, true );
		}
	}, [] );

	// try next slide
	useEffect( () => {
		if ( playing && currentSlideEnded ) {
			tryNextSlide();
		}
	}, [ playing, currentSlideEnded ] );

	useLayoutEffect( () => {
		const wrapperHeight = ( wrapperRef.current && wrapperRef.current.offsetHeight ) || height;
		const ratioBasedWidth = Math.round( settings.defaultAspectRatio * wrapperHeight );
		if ( ! fullscreen ) {
			setMaxSlideWidth( ratioBasedWidth );
		} else {
			const newMaxSlideWidth =
				Math.abs( 1 - ratioBasedWidth / width ) < settings.cropUpTo ? width : ratioBasedWidth;
			setMaxSlideWidth( newMaxSlideWidth );
		}
	}, [ width, height, fullscreen ] );

	useLayoutEffect( () => {
		if ( wrapperRef.current && wrapperRef.current.offsetHeight > 0 ) {
			setTargetAspectRatio( wrapperRef.current.offsetWidth / wrapperRef.current.offsetHeight );
		}
	}, [ width, height ] );

	return (
		/* eslint-disable jsx-a11y/click-events-have-key-events */
		<>
			{ resizeListener }
			<div
				role={ disabled ? 'presentation' : 'button' }
				className={ classNames( 'wp-story-container', {
					'wp-story-with-controls': ! disabled && ! fullscreen && ! settings.playInFullscreen,
					'wp-story-fullscreen': fullscreen,
					'wp-story-ended': ended,
					'wp-story-disabled': disabled,
					'wp-story-clickable': ! disabled && ! fullscreen,
				} ) }
				style={ { maxWidth: `${ maxSlideWidth }px` } }
				onClick={ onPress }
			>
				<Header
					{ ...settings.metadata }
					fullscreen={ fullscreen }
					onExitFullscreen={ onExitFullscreen }
				/>
				<div className="wp-story-wrapper" ref={ wrapperRef }>
					{ slides.map( ( media, index ) => (
						<Slide
							playerId={ id }
							key={ index }
							media={ media }
							index={ index }
							playing={ playing }
							uploading={ uploading }
							settings={ settings }
							targetAspectRatio={ targetAspectRatio }
						/>
					) ) }
				</div>
				<Overlay
					icon={ settings.showSlideCount && icon }
					slideCount={ slides.length }
					ended={ ended }
					hasPrevious={ currentSlideIndex > 0 }
					hasNext={ currentSlideIndex < slides.length - 1 }
					disabled={ disabled }
					onPreviousSlide={ tryPreviousSlide }
					onNextSlide={ tryNextSlide }
				/>
				{ showProgressBar && (
					<ProgressBar
						playerId={ id }
						slides={ slides }
						fullscreen={ fullscreen }
						onSlideSeek={ playSlide }
					/>
				) }
				<Controls
					playing={ playing }
					muted={ muted }
					onPlayPressed={ () => setPlaying( id, ! playing ) }
					onMutePressed={ () => setMuted( id, ! muted ) }
					showMute={ isVideo( currentSlideIndex ) }
				/>
			</div>
			{ fullscreen && (
				<Background
					currentMedia={
						settings.blurredBackground &&
						slides.length > currentSlideIndex &&
						slides[ currentSlideIndex ]
					}
				/>
			) }
		</>
	);
};
