/**
 * Copyright (c) 2009 Miguel Guerreiro (miguel.guerreiro@gmail.com)
 * Licensed under the GPL (http://www.opensource.org/licenses/gpl-license.php) license.
 *
 * @author: Miguel Guerreiro
 * @revision: 0090
 * @version: 0.9
 * @requires: jQuery 1.3+
 */

;(function($) {
	$.event.mousewheel = {
		giveFocus: function(el, up, down, preventDefault) {
			if (el._handleMousewheel) {
				$(el).unmousewheel();
			}
			if (preventDefault==window.undefined && down && down.constructor!=Function) {
				preventDefault=down;
				down=null;
			}
			el._handleMousewheel=function(ev) {
				if (!ev) {
					ev = window.event;
				}
				if (preventDefault) {
					if (ev.preventDefault) {
						ev.preventDefault();
					} else {
						ev.returnValue=false;
					}
				}
				var delta=0;
				if (ev.wheelDelta) {
					delta=ev.wheelDelta/120;
				} else {
					if (ev.detail) {
						delta=-ev.detail/3;
					}
				}
				if (up && (delta > 0 || !down)) {
					up.apply(el, [ev, delta]);
				} else {
					if (down && delta < 0) {
						down.apply(el, [ev, delta]);
					}
				}
			};
			if (window.addEventListener) {
				window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
			}
			window.onmousewheel=document.onmousewheel=el._handleMousewheel;
		},
		removeFocus: function(el) {
			if (!el._handleMousewheel) {
				return;
			}
			if (window.removeEventListener) {
				window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
			}
			window.onmousewheel=document.onmousewheel=null;
			el._handleMousewheel=null;
		}
	},
	$.fn.scrollbar = function(options) {
		$parentElem = this,
		originalHTML = $parentElem.html(),
		$parentElem.html('');
		var defaultSettings = {
			width: $parentElem.width(),
			height: $parentElem.height(),
			url: '',
			background: '',
			arrow: {
				width: 0,
				height: 0,
				imageUp: '',
				imageDown: ''
			},
			scroller: {
				width: 0,
				height: 0,
				image: ''
			},
			scrollbar: {
				width: 0,
				height: $parentElem.height(),
				step: 0
			}
		},
		settings = $.extend({}, defaultSettings, options),
		parentID = $parentElem.attr('id'),
		$container = $('<div/>')
			.attr('id', parentID+'_scrollbar_wrap')
			.css({
				'display': 'block',
				'float': 'left',
				'width': settings.width + 'px',
				'height': settings.height + 'px',
				'overflow': 'hidden'
			})
			.appendTo($parentElem),
		$containerHtml = $('<div/>')
			.attr('id', parentID+'_scrollbar_html')
			.css({
				'display': 'block',
				'float': 'left',
				'width': (settings.width-settings.scrollbar.width-20)+'px',
				'padding': '0 10px'
			})
			.html(originalHTML)
			.appendTo($container),
		$scrollbar = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll')
			.css({
				'display': 'block',
				'float': 'left',
				'width': settings.scrollbar.width+'px',
				'height': settings.scrollbar.height+'px'})
			.appendTo($container),
		$scrollbarUp = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll_up')
			.css({
				'display': 'block',
				'float': 'left',
				'width': settings.arrow.width+'px',
				'height': settings.arrow.height+'px',
				'background': 'transparent url(\''+settings.url+'/'+settings.arrow.imageUp+'\') scroll no-repeat -'+settings.arrow.width+'px 0px',
				'cursor': 'pointer',
				'overflow': 'hidden'
			})
			.appendTo($scrollbar),
		$scrollbarTrack = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll_track')
			.css({
				'display': 'block',
				'float': 'left',
				'width': settings.scrollbar.width+'px',
				'height': (settings.height-(settings.arrow.height*2))+'px',
				'background': 'transparent url(\''+settings.url+'/'+settings.background+'\') scroll repeat-y 0px 0px'
			})
			.appendTo($scrollbar),
		$scrollbarDown = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll_dn')
			.css({
				'display': 'block',
				'float': 'left',
				'width': settings.arrow.width+'px',
				'height': settings.arrow.height+'px',
				'background': 'transparent url(\''+settings.url+'/'+settings.arrow.imageDown+'\') scroll no-repeat 0px 0px',
				'cursor': 'pointer',
				'overflow': 'hidden'
			})
			.appendTo($scrollbar),
		$scrollbarPos = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll_pos')
			.css({'display': 'block',
				'float': 'left',
				'width': settings.scroller.width+'px',
				'height': settings.scroller.height+'px',
				'position': 'relative',
				'top': '0',
				'left': ((settings.scrollbar.width-settings.scroller.width)/2)+'px',
				'background': 'transparent url(\''+settings.url+'/'+settings.scroller.image+'\') scroll no-repeat 0px 0px',
				'cursor': 'pointer'
			})
			.appendTo($scrollbarTrack);
		var mHeight=($containerHtml.height()-settings.height);
		var mScroll=settings.height-(settings.arrow.height*2)-settings.scroller.height;
		var mStep=Math.ceil(mHeight/settings.scrollbar.step);
		var nStep=0;
		var scrollPos=0;
		var minOffset=$scrollbarTrack.offset().top+(settings.scroller.height/2);
		var maxOffset=minOffset+mScroll;
		var mouseEvent;
		var getPos=function(event, c) {
			var p=c=='X'?'Left':'Top';
			return event['page'+c]||
				(event['client'+c]+(document.documentElement['scroll'+p]||
				document.body['scroll'+p]))||0;
		},
		scrollUp=function() {
			if (nStep>0) {
				nStep--;
				var dPercent=nStep/mStep;
				$containerHtml.css({'margin-top':'-'+(dPercent*mHeight)+'px'});
				$scrollbarPos.css({'top':(dPercent*mScroll)+'px'});
				$scrollbarDown.css({'background-position': '0 0'});
				if (n_step>0) {
					$scrollbarUp.css({'background-position': '0 0'});
				} else {
					$scrollbarUp.css({'background-position': '-'+settings.arrow.width+'px 0'});
				}
			}
		},
		scrollDown=function() {
			if (nStep<mStep) {
				nStep++;
				var dPercent = nStep/mStep;
				$containerHtml.css({'margin-top':'-'+(dPercent*m_height)+'px'});
				$scrollbarPos.css({'top':(dPercent*mScroll)+'px'});
				$scrollbarUp.css({'background-position': '0 0'});
				if (nStep < mStep) {
					$scrollbarDown.css({'background-position': '0 0'});
				} else {
					$scrollbarDown.css({'background-position': '-'+settings.arrow.width+'px 0'});
				}
			}
		},
		dragMeNot=function() {
			return false;
		},
		dragUpdate=function(e) {
			var toPos=getPos(e, 'Y');
			if (toPos>=minOffset&&toPos<=maxOffset) {
				if (toPos<(minOffset+10)) {
					$scrollbarUp.css({'background-position': '-'+settings.arrow.width+'px 0'});
					toPos = minOffset;
				} else {
					$scrollbarUp.css({'background-position': '0 0'});
				}
				if (toPos>(maxOffset-10)) {
					$scrollbarDown.css({'background-position': '-'+settings.arrow.width+'px 0'});
					toPos = maxOffset;
				} else {
					$scrollbarDown.css({'background-position': '0 0'});
				}
				scrollPos = (toPos-minOffset);
				dPercent = scrollPos/(maxOffset-minOffset);
				nStep = Math.round(dPercent*mStep);
				$containerHtml.css({'margin-top': '-'+(d_percent*mHeight)+'px'});
				$scrollbarPos.css({'top': (dPercent*mScroll)+'px'});
			}
		},
		dragStart=function(e) {
			$('html').bind('mouseup', dragStop).bind('mousemove', dragUpdate);
			if ($.browser.msie) {
				$('html').bind('dragstart', dragMeNot).bind('selectstart', dragMeNot);
			}
			dragUpdate(e);
			return false;
		},
		dragStop=function() {
			$('html').unbind('mouseup', dragStop).unbind('mousemove', dragUpdate);
			if ($.browser.msie) {
				$('html').bind('dragstart', dragMeNot).bind('selectstart', dragMeNot);
			}
			return false;
		};
		if (mHeight<=0) {
			$scrollbarUp.css({
				'background-position': '-'+(settings.arrow.width*2)+'px 0',
				'cursor': 'default'
			});
			$scrollbarDown.css({
				'background-position': '-'+(settings.arrow.width*2)+'px 0',
				'cursor': 'default'
			});
			$scrollbarPos.remove();
		} else {
			$scrollbarUp.click(scrollUp);
			$scrollbarUp.mousedown(function() {
				mouseEvent = setInterval(scrollUp,100);
			}).mouseup(function() {
				mouseEvent = clearInterval(mouseEvent);
			});
			$scrollbarDown.click(scrollDown);
			$scrollbarDown.mousedown(function() {
				mouseEvent = setInterval(scrollDown,100);
			}).mouseup(function() {
				mouseEvent = clearInterval(mouseEvent);
			});
			$scrollbarTrack.bind('mousedown', dragStart);
			$container.hover(function() {
				$.event.mousewheel.giveFocus(this, scrollUp, scrollDown, true);
			},function() {
				$.event.mousewheel.removeFocus(this);
			});
		};
		return this;
	}
})(jQuery);
