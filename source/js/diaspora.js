var Home = location.href,
  Pages = 4,
  xhr,
  xhrUrl = ""

var Diaspora = {
  L: function () {
  },
  P: function () {
  },
  PS: function () {
  },
  HS: function (tag, flag) {
    var id = tag.data("id") || 0,
      url = tag.attr("href"),
      title = tag.attr("title") + " - " + $("#config-title").text()

    Diaspora.loading()
    var state = {
      d: id,
      t: title,
      u: url
    }
    Diaspora.L(url, function (data) {
      if (!$(data).filter("#single").length) {
        return
      }
      switch (flag) {
        case "push":
          history.pushState(state, title, url)
          break
        case "replace":
          history.replaceState(state, title, url)
          break
      }
      document.title = title
      $("#preview").html($(data).filter("#single"))
      switch (flag) {
        case "push":
          Diaspora.preview()
          break
      }
      setTimeout(function () {
        Diaspora.player()
        $("#top").show()
      }, 0)
    })
  },
  preview: function () {
    // preview toggle
    $("#preview").one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
      var previewVisible = $("#preview").hasClass("show")
      if (previewVisible) {
        $("#container").hide()
      } else {
        $("#container").show()
      }
      Diaspora.loaded()
    })
    setTimeout(function () {
      $("#preview").addClass("show")
      $("#container").data("scroll", window.scrollY)
      setTimeout(function () {
        $("#preview").css({
          "position": "static",
          "overflow-y": "auto"
        })
      }, 500)
    }, 0)
  },
  player: function () {
    var p = $("#audio")
    if (!p.length) {
      $(".icon-play").css({
        "color": "#dedede",
        "cursor": "not-allowed"
      })
      return
    }
    var sourceSrc = $("#audio source").eq(0).attr("src")
    if (sourceSrc == "" && p[0].src == "") {
      let audiolist = $("#audio-list li"),
      mp3 = audiolist.eq([Math.floor(Math.random() * audiolist.size())])
      p[0].src = mp3.data("url")
    }

    if (p.eq(0).data("autoplay") == true) {
      p[0].play()
    }

    p.on({
      "timeupdate": function () {
        var progress = p[0].currentTime / p[0].duration * 100
        $(".bar").css("width", progress + "%")
        if (progress / 5 <= 1) {
          p[0].volume = progress / 5
        } else {
          p[0].volume = 1
        }
      },
      "ended": function () {
        $(".icon-pause").removeClass("icon-pause").addClass("icon-play")
      },
      "playing": function () {
        $(".icon-play").removeClass("icon-play").addClass("icon-pause")
      }
    })
  },
  loading: function () {
    var w = window.innerWidth
    var css = "<style class=\"loaderstyle\" id=\"loaderstyle" + w + "\">" +
      "@-moz-keyframes loader" + w + "{100%{background-position:" + w + "px 0}}" +
      "@-webkit-keyframes loader" + w + "{100%{background-position:" + w + "px 0}}" +
      ".loader" + w + "{-webkit-animation:loader" + w + " 3s linear infinite;-moz-animation:loader" + w + " 3s linear infinite;}" +
      "</style>"
    $(".loaderstyle").remove()
    $("head").append(css)
    $("#loader").removeClass().addClass("loader" + w).show()
  },
  loaded: function () {
    $("#loader").removeClass().hide()
  },
  F: function (id, w, h) {
    var _height = $(id).parent().height(),
      _width = $(id).parent().width(),
      ratio = h / w
    if (_height / _width > ratio) {
      id.style.height = _height + "px"
      id.style.width = _height / ratio + "px"
    } else {
      id.style.width = _width + "px"
      id.style.height = _width * ratio + "px"
    }
    id.style.left = (_width - parseInt(id.style.width)) / 2 + "px"
    id.style.top = (_height - parseInt(id.style.height)) / 2 + "px"
  }
}

$(function () {
  if ($("#screen").length) {
    $("#top").addClass("hide")
    $(window).scroll(function () {
      $("#top")[scrollY < screen.availHeight ? "addClass" :"removeClass"]("hide")
    })
  }
  if (Diaspora.P()) {
    $("body").addClass("touch")
  }
  if ($("#preview").length) {
    var cover = {}
    cover.t = $("#cover")
    cover.w = cover.t.attr("width")
    cover.h = cover.t.attr("height");
    (cover.o = function () {
      $("#mark").height(window.innerHeight)
    })()
    if (cover.t.prop("complete")) {
      // why setTimeout ?
      setTimeout(function () {
        cover.t.load()
      }, 0)
    }
    cover.t.on("load", function () {

      (cover.f = function () {
        var _w = $("#mark").width(),
          _h = $("#mark").height(),
          x, y, i, e
        e = (_w >= 1000 || _h >= 1000) ? 1000 : 500
        if (_w >= _h) {
          i = _w / e * 50
          y = i
          x = i * _w / _h
        } else {
          i = _h / e * 50
          x = i
          y = i * _h / _w
        }
        $(".layer").css({
          "width": _w + x,
          "height": _h + y,
          "marginLeft": -0.5 * x,
          "marginTop": -0.5 * y
        })
        if (!cover.w) {
          cover.w = cover.t.width()
          cover.h = cover.t.height()
        }
        Diaspora.F($("#cover")[0], cover.w, cover.h)
      })()
      setTimeout(function () {
        $("html, body").removeClass("loading")
      }, 1000)
      $("#mark").parallax()
      var vibrant = new Vibrant(cover.t[0])
      var swatches = vibrant.swatches()
      if (swatches["DarkVibrant"]) {
        $("#vibrant polygon").css("fill", swatches["DarkVibrant"].getHex())
        $("#vibrant div").css("background-color", swatches["DarkVibrant"].getHex())
      }
      if (swatches["Vibrant"]) {
        $(".icon-menu").css("color", swatches["Vibrant"].getHex())
      }
    })
    if (!cover.t.attr("src")) {
      alert("Please set the post thumbnail")
    }
    $("#preview").css("min-height", window.innerHeight)
    Diaspora.PS()
    $(".pview a").addClass("pviewa")
    var T
    $(window).on("resize", function () {
      clearTimeout(T)
      T = setTimeout(function () {
        if (!Diaspora.P() && location.href == Home) {
          cover.o()
          cover.f()
        }
        if ($("#loader").attr("class")) {
          Diaspora.loading()
        }
      }, 500)
    })
  } else {
    $("#single").css("min-height", window.innerHeight)
    setTimeout(function () {
      $("html, body").removeClass("loading")
    }, 1000)
    Diaspora.player()
    // $(".icon-icon, .image-icon").attr("href", "/")
    $("#top").show()
  }
  $(window).on("scroll", function () {
    let logohide
    if ($("#screen").length)  {
      logohide = screen.availHeight;
    }
    $("#header .image-logo")[scrollY > (logohide||10)? "addClass" : "removeClass"]("hide")
    if ($(".scrollbar").length && !Diaspora.P() && !$(".icon-images").hasClass("active")) {
      var wt = $(window).scrollTop(),
        tw = $("#top").width(),
        dh = document.body.scrollHeight,
        wh = document.body.clientHeight
      var width = (1 - wt / (dh - wh)) * tw
      $(".scrollbar-mask").width(width)
      if (wt > 80 && window.innerWidth > 800) {
        $(".subtitle").fadeIn()
      } else {
        $(".subtitle").fadeOut()
      }
    }
  })
  $(window).on("touchmove", function (e) {
    if ($("body").hasClass("mu")) {
      e.preventDefault()
    }
  })
  $("body").on("click", function (e) {
    let tag = $(e.target).attr("class") || "",
      rel = $(e.target).attr("rel") || "",
      to = "",
      hash = ""
    // .content > p > img
    if (e.target.nodeName == "IMG" && $(e.target).parent().get(0).nodeName == "P") {
      tag = "pimg"
    }
    if (!tag && !rel) return
    switch (true) {
      // nav menu
      case (tag.indexOf("switchmenu") != -1):
        $("html, body").toggleClass("mu")
        return false
        break
        // next page
      case (tag.indexOf("more") != -1):
        tag = $(".more")
        if (tag.data("status") == "loading") {
          return false
        }
        var num = parseInt(tag.data("page")) || 1
        if (num == 1) {
          tag.data("page", 1)
        }
        if (num >= Pages) {
          return
        }
        tag.html("加载中...").data("status", "loading")
        Diaspora.loading()
        Diaspora.L(tag.attr("href"), function (data) {
          var link = $(data).find(".more").attr("href")
          if (link != undefined) {
            tag.attr("href", link).html("加载更多").data("status", "loaded")
            tag.data("page", parseInt(tag.data("page")) + 1)
          } else {
            $("#pager").remove()
          }
          var tempScrollTop = $(window).scrollTop()
          $("#primary").append($(data).find(".post"))
          $(window).scrollTop(tempScrollTop + 100)
          Diaspora.loaded()
          $("html,body").animate({
            scrollTop: tempScrollTop + 400
          }, 500)
        }, function () {
          tag.html("加载更多").data("status", "loaded")
        })
        return false
        break
        // home
      case (tag.indexOf("icon-home") != -1):
        $(".toc").fadeOut(100)

        break
        // qrcode
      case (tag.indexOf("icon-scan") != -1):
        if ($(".icon-scan").hasClass("tg")) {
          $("#qr").toggle()
        } else {
          $(".icon-scan").addClass("tg")
          $("#qr").qrcode({
            width: 128,
            height: 128,
            text: location.href
          }).toggle()
        }
        return false
        break
        // audio play
      case (tag.indexOf("icon-play") != -1):
        $("#audio")[0].play()
        $(".icon-play").removeClass("icon-play").addClass("icon-pause")
        return false
        break
        // audio pause
      case (tag.indexOf("icon-pause") != -1):
        $("#audio")[0].pause()
        $(".icon-pause").removeClass("icon-pause").addClass("icon-play")
        return false
        break
        // history state

        // history state

        // prev, next post

        // toc
      case (tag.indexOf("toc-text") != -1 || tag.indexOf("toc-link") != -1 ||
        tag.indexOf("toc-number") != -1):
        hash = ""
        if (e.target.nodeName == "SPAN") {
          hash = $(e.target).parent().attr("href")
        } else {
          hash = $(e.target).attr("href")
        }
        to = $("a.headerlink[href='" + hash + "']")
        $("html,body").animate({
          scrollTop: to.offset().top - 50
        }, 300)
        return false
        break
        // quick view

        // photoswipe
      case (tag.indexOf("pimg") != -1):
        var pswpElement = $(".pswp").get(0)
        if (pswpElement) {
          var items = []
          var index = 0
          var imgs = []
          $(".content img").each(function (i, v) {
            // get index
            if (e.target.src == v.src) {
              index = i
            }
            var item = {
              src: v.src,
              w: v.naturalWidth,
              h: v.naturalHeight
            }
            imgs.push(v)
            items.push(item)
          })
          var options = {
            index: index,
            shareEl: false,
            zoomEl: false,
            allowRotationOnUserZoom: true,
            history: false,
            getThumbBoundsFn: function (index) {
              // See Options -> getThumbBoundsFn section of documentation for more info
              var thumbnail = imgs[index],
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect()

              return {
                x: rect.left,
                y: rect.top + pageYScroll,
                w: rect.width
              }
            }
          }
          var lightBox = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
          lightBox.init()
        }
        return false
        break
      default:
        return true
        break
    }
  })

  console.log("%c Github %c", "background:#24272A; color:#ffffff", "", "https://github.com/leitingx762/air-diaspora")
})