var UI = (function () {
  var fullPageScroll = {
    initialize: function () {
      this.offsetArray = []
      this.isFalse = false

      var navigation = arguments[0].navigation,
        selector = arguments[0].selector,
        distance = !!arguments[0].distance && typeof arguments[0].distance !== 'undefined' ? arguments[0].distance : 0,
        activation = arguments[0].activation,
        delay = !!arguments[0].delay && typeof arguments[0].delay !== 'undefined' ? arguments[0].delay : 0,
        reverse = !!arguments[0].reverse && typeof arguments[0].reverse !== 'undefined' ? arguments[0].reverse : false,
        startScreen = arguments[0].startScreen,
        nextContentWrapper = null,
        nextContentButton = null,
        nextContentDuration = null,
        _clearTimeout = null,
        _scrollTop = -1, // 0
        _tempScrollTop = -1, // 0
        that = this,
        _index = -1
      _length = -1

      if (typeof sideNavigation === 'undefined' && !!arguments[0].nextContent && typeof arguments[0].nextContent !== 'undefined') {
        ;(nextContentWrapper = !!arguments[0].nextContent.wrapper && typeof arguments[0].nextContent.wrapper !== 'undefined' ? arguments[0].nextContent.wrapper : false),
          // console.log("nextContentWrapper: ", nextContentWrapper);

          (nextContentButton = !!arguments[0].nextContent.button && typeof arguments[0].nextContent.button !== 'undefined' ? arguments[0].nextContent.button : false),
          // console.log("nextContentButton: ", nextContentButton);

          (nextContentDuration = !!arguments[0].nextContent.duration && typeof arguments[0].nextContent.duration !== 'undefined' ? arguments[0].nextContent.duration : false)
        // console.log("nextContentDuration: ", nextContentDuration);
      }

      function _move() {
        var _index = arguments[0].index,
          _offset = arguments[0].offset

        if (that.isFalse) {
          // console.log("_move()가 실행 중입니다. 중복 실행을 허용하지 않습니다.");

          return
        }

        that.isFalse = true
        // console.log("that.isFalse: ", that.isFalse);

        if (that.offsetArray[_index] !== 0 && _index === 0) {
          // console.log("that.offsetArray[" + _index + "]의 값 " + that.offsetArray[_index] + "을 " + _index + "으로 수정합니다.");

          _offset = 0
        }

        $('html, body')
          .stop()
          .animate(
            {
              scrollTop: _offset - $(that.navigation).outerHeight()
            },
            nextContentDuration,
            function () {
              // console.log("animate callback");

              setTimeout(function () {
                that.isFalse = false
                // console.log("[animate callback setTimeout()] that.isFalse: ", that.isFalse, ", !that.isFalse: ", !that.isFalse);
              }, 400)
            }
          )
      } // _move()

      function _activate() {
        $(startScreen)
          .find(selector)
          .each(function (index, element) {
            if ($(window).height() > $(element).offset().top) {
              // console.log("[fullPageScroll{} initialize() _activate()] "+ element.className + "이 노출됩니다.");

              $(element).addClass(activation)
            }
          })
      } // _activate()

      function _initialize() {
        if (!!startScreen && typeof startScreen !== 'undefined') {
          // console.log("[fullPageScroll{} initialize() _initialize()] startScreen을 설정합니다.");

          _activate({ strategy: 'startScreen' })
        }

        if (typeof sideNavigation === 'undefined' && nextContentButton) {
          // console.log("[fullPageScroll{} initialize() _initialize()] nextContent를 설정합니다.");

          _length = $(nextContentWrapper).length
          // console.log("_length: ", _length);

          for (i = 0; i < _length; i++) {
            that.offsetArray.push($(nextContentWrapper).eq(i).offset().top)
          }

          // console.log("nextContentButton: ", nextContentButton);
          $(nextContentButton)
            .off('click')
            .on('click', function (event) {
              event.preventDefault()

              _index = $(this).closest(nextContentWrapper).index() + 1
              // console.log("_index: ", _index);

              _move({ selector: nextContentButton, index: _index, offset: that.offsetArray[_index] })
            })
        }
      } // _initialize()

      _initialize()

      $(window).on('scroll', function () {
        // console.log("[fullPageScroll{} initialize()] scroll에서 스크롤이 감지되었습니다.");

        clearTimeout(_clearTimeout)

        _clearTimeout = setTimeout(function () {
          _scrollTop = $(this).scrollTop()
          // console.log("[fullPageScroll{} initialize()] _scrollTop: ", _scrollTop);

          if (typeof sideNavigation !== 'undefined') {
            // console.log("[fullPageScroll{} initialize()] sideNavigation 컴포넌트의 scrollAnimation 메서드를 호출합니다.");

            sideNavigation.scrollAnimation({ scrollTop: _scrollTop }) // sideNavigation 컴포넌트의 scrollAnimation 메서드를 호출합니다.
          }

          function _mouseWheelUp() {
            var index = arguments[0].index,
              element = arguments[0].element

            // if (reverse && $(element).offset().top + $(element).height() > _scrollTop - distance) { // element의 하단 부분이 보일 때..
            if (reverse && $(element).offset().top - distance > _scrollTop) {
              // element의 상단 부분이 보일 때..
              // console.log("[fullPageScroll{} initialize() _mouseWheelUp()] " + element.className + "이 노출됩니다.");

              $(element).addClass(activation)
            }

            if (reverse && $(element).offset().top > _scrollTop + $(window).height() + distance) {
              // console.log("[fullPageScroll{} initialize() _mouseWheelUp()] " + element.className + "이 비노출됩니다.");

              $(element).removeClass(activation)
            }
          }

          function _mouseWheelDown() {
            var index = arguments[0].index,
              element = arguments[0].element

            if (_scrollTop + $(window).height() - distance > $(element).offset().top) {
              // console.log("[fullPageScroll{} initialize() _mouseWheelDown()] " + element.className + "이 노출됩니다.");

              $(element).addClass(activation)
            }

            if (reverse && _scrollTop - distance > $(element).offset().top + $(element).height()) {
              // console.log("[fullPageScroll{} initialize() _mouseWheelDown()] " + element.className + "이 비노출됩니다.");

              $(element).removeClass(activation)
            }
          }

          $(selector).each(function (index, element) {
            _scrollTop > _tempScrollTop ? _mouseWheelDown({ index: index, element: element }) : _mouseWheelUp({ index: index, element: element })
          })

          _tempScrollTop = _scrollTop
          // console.log("[fullPageScroll{} initialize()] _tempScrollTop: ", _tempScrollTop);
        }, delay)
      }) // $(window).on('scroll', function () { .. })
    } // initialize()
  } // fullPageScroll

  var sideNavigation = {
    paginate: function () {
      var that = this,
        _index = arguments[0].index

      _index = 0 > _index ? 0 : _index

      $(that.selector).removeClass(that.activation).eq(_index).addClass(that.activation)
    }, // paginate()
    buttonAnimation: function () {
      var _wrapper = arguments[0].wrapper,
        _selector = this.selector,
        _index = arguments[0].index,
        _nextContentButton = !!arguments[0].nextContentButton && typeof arguments[0].nextContentButton !== 'undefined' ? arguments[0].nextContentButton : '',
        _offset = arguments[0].offset,
        _move = arguments[0].move,
        _button = null,
        _that = this

      if (_nextContentButton) {
        // $(_nextContentButton).eq($(_nextContentButton).length - 1).remove(); // 마지막 { selector: .. }에 다음 화면으로 이동하는 버튼이 있을 경우 제합니다.

        _button = _selector + ', ' + _nextContentButton
      }

      // console.log("[sideNavigation{} buttonAnimation()] _button: ", _button);

      $(_button)
        .off('click')
        .on('click', function (event) {
          event.preventDefault()

          !$(this).is(_nextContentButton) ? (_index = $(this).parent().index()) : (_index = $(this).closest(_wrapper).index()) // { selector: .. }를 눌렀을 경우와  { nextContentButton: .. }을 눌렀을 경우를 처리합니다.

          _that.temp = _index
          // console.log("[sideNavigation{} buttonAnimation()] that.temp: ", _that.temp);

          _move({ selector: _button, index: _index, offset: _offset[_index] })
        })
    }, // buttonAnimation()
    scrollAnimation: function () {
      var _scrollTop = arguments[0].scrollTop,
        i,
        _index = -1 // 0
      // console.log("[sideNavigation{} scrollAnimation()] _scrollTop: ", _scrollTop);

      // if ( (!this.isFalse && !this.isResize) && ($(window).height() >= this.tempScreenHeight) ) {
      if ($(window).height() >= this.tempScreenHeight && !this.isFalse && !this.isResize) {
        for (i = 0; i < _length; i++) {
          if (_scrollTop + $(this.parent).outerHeight() >= this.offsetArray[i] && _scrollTop - $(this.parent).outerHeight() <= this.offsetArray[i + 1]) {
            // 2020-10-05 수정
            /* 2020-10-05 수정 시작 */
            if (_scrollTop + $(this.parent).outerHeight() === $(document).height() - $(window).height()) {
              _index = _length - 1
              // console.log('[sideNavigation{} scrollAnimation()] 마지막 화면입니다. _index: ', _index)
            } else {
              _index = i
              // console.log('[sideNavigation{} scrollAnimation()] 첫 번째 화면입니다. _index: ', _index)
            }
            /* 2020-10-05 수정 끝 */

            // _index = i;
            // console.log("[sideNavigation{} scrollAnimation()] 첫 번째 화면입니다. _index: ", _index);
          }

          // console.log("_scrollTop: ", _scrollTop);
          // console.log("this.offsetArray[" + i + "]: ", this.offsetArray[i]);
          // console.log("this.offsetArray[_length - 1]: ", this.offsetArray[_length - 1]);

          if (_scrollTop + $(this.parent).outerHeight() > this.offsetArray[_length - 1]) {
            _index = _length - 1
            // console.log("[sideNavigation{} scrollAnimation()] 마지막 화면입니다. _index: ", _index);
          }

          this.paginate({ index: _index })

          this.tempScreenHeight = $(window).height()
          // console.log("[sideNavigation{} scrollAnimation()] this.tempScreenHeight: ", this.tempScreenHeight);
        }
      }
    }, // scrollAnimation()
    initialize: function () {
      if (typeof fullPageScroll === 'undefined') {
        // console.log("[sideNavigation{} initialize()] fullPageScroll 컴포넌트가 존재하지 않습니다.");

        return
      }

      ;(this.wrapper = arguments[0].wrapper), (this.parent = arguments[0].parent), (this.selector = arguments[0].selector), (this.activation = arguments[0].activation), (this.duration = !!arguments[0].duration && typeof arguments[0].duration !== 'undefined' ? arguments[0].duration : 400), (this.nextContentButton = !!arguments[0].nextContentButton && typeof arguments[0].nextContentButton !== 'undefined' ? arguments[0].nextContentButton : false), (this.offsetArray = []), (this.isFalse = false), (this.isResize = false)

      this.temp = -1
      this.tempScreenHeight = -1

      var that = this,
        _index = -1
      _length = $(this.selector).length

      function _move() {
        var _index = arguments[0].index,
          _offset = arguments[0].offset

        if (that.isFalse) {
          // console.log("[sideNavigation{} initialize() _move()] _move()가 실행 중입니다. 중복 실행을 허용하지 않습니다.");

          return
        }

        that.isFalse = true
        // console.log("[sideNavigation{} initialize() _move()] that.isFalse: ", that.isFalse);

        if (that.offsetArray[_index] !== 0 && _index === 0) {
          // console.log("[sideNavigation{} initialize() _move()] that.offsetArray[" + _index + "]의 값 " + that.offsetArray[_index] + "을 " + _index + "으로 수정합니다.");

          _offset = 0
        }

        // console.log("[sideNavigation{} initialize() _move()] that.paginate()를 실행합니다.");
        that.paginate({ selector: that.selector, activation: that.activation, index: _index })

        $('html, body')
          .stop()
          .animate(
            {
              scrollTop: _offset - $(that.parent).outerHeight()
            },
            that.duration,
            function () {
              // console.log("animate callback");

              setTimeout(function () {
                that.isFalse = false
                // console.log("[sideNavigation{} initialize() _move() animate callback setTimeout()] that.isFalse: ", that.isFalse, ", !that.isFalse: ", !that.isFalse);
              }, 400)
            }
          )
      } // _move()

      function resizing() {
        // console.log("[sideNavigation{} initialize() resizing()] resizing()을 실행합니다.");

        var _index = -1

        that.offsetArray = [] // offsetArray 값을 모두 삭제합니다.

        _initialize()

        if (that.isFalse) {
          // console.log("[sideNavigation{} initialize() resizing()] resizing()이 실행 중입니다. 중복 실행을 허용하지 않습니다.");

          return
        }

        /* that.isFalse = true
        that.isResize = true */

        _index = $(that.selector)
          .filter('.' + that.activation)
          .parent()
          .index()

        /* $('html, body')
          .stop()
          .animate(
            {
              scrollTop: that.offsetArray[_index]
            },
            that.duration,
            function () {
              setTimeout(function () {
                that.isFalse = false
                // console.log("[sideNavigation{} initialize() resizing() animate callback setTimeout()] that.isFalse: ", that.isFalse, ", !that.isFalse: ", !that.isFalse);

                that.isResize = false
                // console.log("[sideNavigation{} initialize() resizing() animate callback setTimeout()] that.isResize: ", that.isResize, ", !that.isResize: ", !that.isResize);

                that.tempScreenHeight = $(window).height()
                // console.log("[sideNavigation{} initialize() resizing() animate callback setTimeout()] that.tempScreenHeight: ", that.tempScreenHeight);
              }, 400)
            }
          ) */
      } // resizing()

      function _initialize() {
        var i

        for (i = 0; i < _length; i++) {
          that.offsetArray.push($(that.wrapper).eq(i).offset().top)
          // console.log("sideNavigation{} initialize() _initialize() for loop "+ i + " class=\"" + $('.section').eq(i).attr('class') + "\" that.offsetArray: ", that.offsetArray);
        }

        that.buttonAnimation({ wrapper: that.wrapper, index: _index, nextContentButton: that.nextContentButton, offset: that.offsetArray, move: _move })

        that.tempScreenHeight = $(window).height()
        // console.log("[sideNavigation{} initialize() _initialize() animate callback setTimeout()] that.tempScreenHeight: ", that.tempScreenHeight);
      } // _initialize();

      _initialize()

      $(window).on('resize', function () {
        if (this.resizeTO) {
          clearTimeout(this.resizeTO)
        }

        this.resizeTO = setTimeout(function () {
          $(this).trigger('resizeEnd')
        }, 400)
      })

      $(window).on('resizeEnd', function () {
        // console.log("resizeEnd를 감지하였습니다.");

        resizing()
      })
    } // initialize()
  } // sideNavigation

  return {
    setFullPageScroll: {
      initialize: function () {
        return fullPageScroll.initialize(arguments[0])
      }
    },
    setSideNavigation: {
      initialize: function () {
        return sideNavigation.initialize(arguments[0])
      }
    }
  }
})()

UI.setFullPageScroll.initialize({
  navigation: '.navigation',
  selector: '[class ^= "effect"]', // 효과를 넣을 요소의 공통된 HTML 클래스명을 넣습니다. (필수)
  distance: 0, // 간격을 설정합니다. 기본 값은 0입니다.
  activation: 'activate', // { selector: .. }를 활성화시킬 HTML 클래스명을 넣습니다. (필수)
  delay: 1, // 스크롤 이벤트의 setTimeout 실행 시간을 설정합니다. 기본 값은 0입니다.
  reverse: true, // 화면에서 벗어난 { selector: .. }를 다시 화면에 진입했을 때 효과를 재실행합니다. 기본 값은 false입니다.
  startScreen: '.one', // 앱이 최초로 열릴 때 첫 번째 영역을 활성화시킬 경우 사용합니다.
  nextContent: {
    wrapper: '.section', // 콘텐츠 영역을 설정합니다.
    button: '.button', // 콘텐츠 영역에 다음 화면으로 이동.. 버튼이 있을 경우 버튼의 HTML 클래스명을 넣습니다. 기본 값 false
    duration: 800 // 스크롤 이동 속도입니다. 기본 값은 400입니다.
  }
})

/* setSideNavigation (sideNavigation)만 사용할 수 없습니다. setFullPageScroll (fullPageScroll)과 함께 사용합니다. */
UI.setSideNavigation.initialize({
  wrapper: '.section',
  parent: '.navigation',
  selector: '.navigation > li > a', // 기능을 넣을 요소의 HTML 클래스명을 넣습니다. (필수)
  activation: 'current', // { selector: .. }를 활성화시킬 HTML 클래스명을 넣습니다. (필수)
  duration: 800, // 스크롤 이동 속도입니다. 기본 값은 400입니다.
  nextContentButton: '.button' // 콘텐츠 영역에 다음 화면으로 이동.. 버튼이 있을 경우 버튼의 HTML 클래스명을 넣습니다. 기본 값 false
})
