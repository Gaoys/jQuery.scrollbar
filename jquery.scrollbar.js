/**
 * Copyright (c) 2009 Miguel Guerreiro (miguel.guerreiro@gmail.com)
 * Licensed under the GPL (http://www.opensource.org/licenses/gpl-license.php) license.
 *
 * @author: Miguel Guerreiro
 * @revision: 0080
 * @version: 0.8
 * @requires: jQuery 1.3+
 */

;(function($) {
	$.event.mousewheel = {
		giveFocus: function(el, up, down, preventDefault) {
			if (el._handleMousewheel) jQuery(el).unmousewheel();
			if (preventDefault==window.undefined && down && down.constructor!=Function) {
				preventDefault=down;
				down=null;
			}
			el._handleMousewheel=function(event) {
				if (!event) event=window.event;
				if (preventDefault) {
					if (event.preventDefault) {
						event.preventDefault();
					} else {
						event.returnValue=false;
					}
				}
				var delta=0;
				if (event.wheelDelta) {
					delta=event.wheelDelta/120;
				} else {
					if (event.detail) delta=-event.detail/3;
				}
				if (up && (delta > 0 || !down)) {
					up.apply(el, [event, delta]);
				} else {
					if (down && delta < 0) down.apply(el, [event, delta]);
				}
			};
			if (window.addEventListener) window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
			window.onmousewheel=document.onmousewheel=el._handleMousewheel;
		},
		removeFocus: function(el) {
			if (!el._handleMousewheel) return;
			if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
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
				width: 26,
				height: 25,
				imageUp: '',
				imageDown: ''
			},
			scroller: {
				width: 16,
				height: 16,
				image: ''
			},
			scrollbar: {
				width: 26,
				height: $parentElem.height(),
				step: 20
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
				'overflow': 'hidden'})
			.appendTo($parentElem),
		$containerHtml = $('<div/>')
			.attr('id', parentID+'_scrollbar_html')
			.css({'display': 'block',
				'float': 'left',
				'width': (settings.width-settings.scrollbar.width-20)+'px',
				'padding': '0 10px'})
			.html(originalHTML)
			.appendTo($container),
		$scrollbar = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll')
			.css({'display': 'block',
				'float': 'left',
				'width': settings.scrollbar.width+'px',
				'height': settings.scrollbar.height+'px'})
			.appendTo($container),
		$scrollbarUp = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll_up')
			.css({'display': 'block',
				'float': 'left',
				'width': settings.arrow.width+'px',
				'height': '25px',
				'background': 'transparent url(\''+settings.url+'/'+settings.arrow.imageUp+'\') scroll no-repeat -'+settings.arrow.width+'px 0px',
				'cursor': 'pointer',
				'overflow': 'hidden'})
			.appendTo($scrollbar),
		$scrollbarTrack = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll_track')
			.css({'display': 'block',
				'float': 'left',
				'width': settings.scrollbar.width+'px',
				'height': (settings.height-(settings.arrow.height*2))+'px',
				'background': 'transparent url(\''+settings.url+'/'+settings.background+'\') scroll repeat-y 0px 0px'})
			.appendTo($scrollbar),
		$scrollbarDown = $('<div/>')
			.attr('id', parentID+'_scrollbar_scroll_dn')
			.css({'display': 'block',
				'float': 'left',
				'width': settings.arrow.width+'px',
				'height': '25px',
				'background': 'transparent url(\''+settings.url+'/'+settings.arrow.imageDown+'\') scroll no-repeat 0px 0px',
				'cursor': 'pointer',
				'overflow': 'hidden'})
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
				'cursor': 'pointer'})
			.appendTo($scrollbarTrack);
		var m_height=($containerHtml.height()-settings.height);
		var m_scroll=settings.height-(settings.arrow.height*2)-settings.scroller.height;
		var m_step=Math.ceil(m_height/settings.scrollbar.step);
		var n_step=0;
		var scroll_pos=0;
		var min_offset=$scrollbarTrack.offset().top+(settings.scroller.height/2);
		var max_offset=min_offset+m_scroll;
		var getPos=function(event, c) {
			var p=c=='X'?'Left':'Top';
			return event['page'+c]||
				(event['client'+c]+(document.documentElement['scroll'+p]||
				document.body['scroll'+p]))||0;
		},
		scrollUp=function() {
			if (n_step>0) {
				n_step--;
				var d_percent=n_step/m_step;
				$containerHtml.css({'margin-top':'-'+(d_percent*m_height)+'px'});
				$scrollbarPos.css({'top':(d_percent*m_scroll)+'px'});
				$scrollbarDown.css({'background-position': '0 0'});
				if (n_step>0) {
					$scrollbarUp.css({'background-position': '0 0'});
				} else {
					$scrollbarUp.css({'background-position': '-'+settings.arrow.width+'px 0'});
				}
			}
		},
		scrollDown=function() {
			if (n_step<m_step) {
				n_step++;
				var d_percent = n_step/m_step;
				$containerHtml.css({'margin-top':'-'+(d_percent*m_height)+'px'});
				$scrollbarPos.css({'top':(d_percent*m_scroll)+'px'});
				$scrollbarUp.css({'background-position': '0 0'});
				if (n_step < m_step) {
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
			var to_pos=getPos(e, 'Y');
			if (to_pos>=min_offset&&to_pos<=max_offset) {
				if (to_pos<(min_offset+10)) {
					$scrollbarUp.css({'background-position': '-'+settings.arrow.width+'px 0'});
					to_pos = min_offset; // make it snap
				} else {
					$scrollbarUp.css({'background-position': '0 0'});
				}
				if (to_pos>(max_offset-10)) {
					$scrollbarDown.css({'background-position': '-'+settings.arrow.width+'px 0'});
					to_pos = max_offset; // make it snap
				} else {
					$scrollbarDown.css({'background-position': '0 0'});
				}
				scroll_pos = (to_pos-min_offset);
				d_percent = scroll_pos/(max_offset-min_offset);
				n_step = Math.round(d_percent*m_step);
				$containerHtml.css({'margin-top': '-'+(d_percent*m_height)+'px'});
				$scrollbarPos.css({'top': (d_percent*m_scroll)+'px'});
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
		if (m_height<=0) {
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
			$scrollbarDown.click(scrollDown);
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
