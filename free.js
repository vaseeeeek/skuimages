// При клике на "div" из elements
// делается переход по ссылке атрибута href
// элемента тега "a" внутри этого блока
var editLinkBoxCategory = {
    init() {
        const _this = this;
        // Массив элементов для редактирования 0 - Элемент, 1 - обрабатывать элементы только без класса has-subs
        const elements = [
            [$('#header_menu-nav-mobile .subcat-menu__item'), true],
            [$('#header_menu-nav-mobile .cat-menu__item'), true],
            [$('.Nav__horizontal--item-2'), false],
            [$('.Nav__horizontal--item-3'), false],
            [$('.nav-cat_wrap .cat-menu__item'), false],
            [$('.nav-cat_wrap .cat-menu__item-title'), false],
            [$('.sidebar-cats__link-badge--box'), false]
        ];
        $(document).on('ready', function () {
            for (const element of elements) {
                const item = element[0];
                const needCheckSubs = element[1];
                _this.editLink(item, needCheckSubs);
            }
        })
    },
    editLink(item, needCheckSubs) {
        item.on('click', function (e) {
            if (((needCheckSubs && !$(this).hasClass('has-subs')) || !needCheckSubs) &&
                $(this)[0] == e.target &&
                $(e.target).prop('tagName') != 'A') {
                const href = $(this).find('a').attr('href');
                window.location.assign(href);
            }
        })
    }
}

var fixOrder = {
    init: function () {
        var _this = this;

        _this.close();
    },
    open: function () {
        var wrapfixOrder = $('.js-fixed-cart-outer');

        if (wrapfixOrder.length) {
            var cartUrl = wrapfixOrder.data("cart-url") + "?fixed=1";

            wrapfixOrder.html("");
            $.get(cartUrl, function (html) {
                var cartContent = $("<div>" + html + "</div>");

                if (cartContent.find('.js-fixed-cart').length) {
                    wrapfixOrder.html(html);
                }
            });
        }
    },
    close: function () {
        $('body').on("click", '.js-cart-fixed-close', function () {
            var wrapfixOrder = $('.js-fixed-cart-outer');

            wrapfixOrder.html("");
        });
    }
};

var fixedPanel = {
    init: function () {
        var _this = this;

        var content = $("#main-content"),
            phoneBtnPanel = $('.js-fixed-panel');

        if (content.length && phoneBtnPanel.length) {

            _this.bottomPanel(content, phoneBtnPanel);
        }
    },
    bottomPanel: function (content, phoneBtnPanel) {
        var t = $(document).scrollTop();
        var contentTopX = content.offset().top;
        var viewp = viewport();

        if (t >= contentTopX || viewp.width <= 1000) {
            if (!phoneBtnPanel.is(":visible")) {
                phoneBtnPanel.css("padding", "3px 0");
                phoneBtnPanel.css("bottom", "-50px");
                phoneBtnPanel.addClass("show");
                phoneBtnPanel.animate({ bottom: "0" }, 200);
                phoneBtnPanel.animate({ "padding": "0" }, 300);
            }
        } else {
            phoneBtnPanel.removeClass("show");
        }
    }
};

var phoneSbar = {
    init: function () {
        var btn = $('.js-filter-fixed-btn'),
            form = $('#filter-body');

        btn.click(function (e) {
            e.stopPropagation();
            left = Math.ceil(parseInt(form.css('left')));
            if (left < 0) {
                form.addClass('show');
            } else {
                form.removeClass('show');
            }
        });
    }
};

var freeCallback = {
    init: function () {
        var _this = this;

        _this.showModal();
        _this.triggerCloce();
    },
    showModal: function () {
        var _this = this,
            btn = $('.js-callback-open'),
            box = $('.js-callback-block');

        if (btn.size() && box.size()) {
            btn.magnificPopup({
                items: [
                    {
                        src: '.js-callback-block',
                        type: 'inline'
                    }
                ],
                midClick: true,
                callbacks: {
                    open: function () {
                        _this.closeModal();
                        box.trigger("event-open");
                    },
                    close: function () {
                        box.trigger("event-close");
                    }
                }
            });
        }
    },
    closeModal: function () {
        $(".js-popup").hide();
        $("body").removeClass("_popup-open");
    },
    triggerCloce: function () {
        var _this = this,
            box = $('.js-callback-block');

        $(box).on("run-close", function () {
            $(this).find(".mfp-close").click();
        });
    }
};

var productsSlider = {
    carouseItemsWrap: $('.js-owl-carousel-product'),
    init: function () {
        var _this = this;

        if (!_this.carouseItemsWrap.length) {
            return false;
        }

        _this.prepareListCarousels();
        _this.carouselAction();
        _this.slider($('.js-owl-carousel-product .js-preview-products'));
        $(window).one('resize', _this.carouselsInitialization);
    },
    carouselsInitialization: function () {
        var _this = this;

        productsSlider.carouseItemsWrap.each(function () {
            var $this = $(this);

            productsSlider.slider($this);
        });
    },
    prepareListCarousels: function () {
        var _this = this;

        _this.carouseItemsWrap.each(function () {
            var sliderProducts = $(this).find('.owl-carousel'),
                sliderWidth = sliderProducts.outerWidth(),
                itemSlider = $(this).find(".js-Product-grid"),
                itenLingth = itemSlider.length,
                itemWidth = itemSlider.first().outerWidth(true),
                widthFullListIems = itemWidth * itenLingth,
                isActions = widthFullListIems > sliderWidth;

            if (isActions) {
                var wrapActions = $(this).find(".js-carousel-direction");

                wrapActions.append('<div data-index="prev" class="js-slider-init-action owl-prev disabled"></div>');
                wrapActions.append('<div data-index="next" class="js-slider-init-action owl-next"></div>');
            }

            var sliderOffsetRight = sliderProducts.offset().left + sliderProducts.outerWidth();
            itemSlider.slice(0, 8).each(function () {
                var productOffsetLeft = $(this).offset().left;

                if (productOffsetLeft < sliderOffsetRight) {
                    $(this).find(".owl-lazy").Lazy({
                        afterLoad: function (element) {
                            element.removeClass("owl-lazy");
                            if ($.Retina) {
                                element.retina();
                            }
                        },
                    });
                }
            });
        });
    },
    carouselAction: function () {
        var _this = this,
            sliderNav = $('.js-slider-init-action');

        sliderNav.on("click", function () {
            var slider = $(this).closest('.js-owl-carousel-product');

            _this.slider(slider, $(this).data("index"));
        });

        if (checkTouchDevice()) {
            $('.js-owl-carousel-product .owl-carousel').each(function () {
                var $items = $(this);

                $items.swipe({
                    allowPageScroll: "auto",
                    threshold: 20,
                    swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                        var $itemsSlider = $(this).closest(".js-owl-carousel-product");

                        if (direction == 'left') {
                            _this.slider($itemsSlider, "next");
                        } else if (direction == 'right') {
                            _this.slider($itemsSlider, "prev");
                        }
                    }
                });
            });
        }
    },
    slider: function (homeList, goToSlide) {
        if (homeList.hasClass("carousel-init")) {
            return false;
        }
        var productList = homeList.find('.owl-carousel'),
            navigation = homeList.find('.js-carousel-direction'),
            isMouseSwipe = homeList.data("swipe"),
            isViewMobileMini = productList.data("type-mobile-preview"),
            responsive = {},
            isFullWidthSlider = true;

        if (isViewMobileMini) {
            responsive = { 0: { items: 4 }, 700: { items: 5 }, 1000: { items: 6 }, 1250: { items: 8 } };
        } else {
            responsive = { 0: { items: 3 }, 400: { items: 4 }, 700: { items: 5 }, 1000: { items: 6 }, 1250: { items: 8 } };
        }
        if (productList.closest('.promo-product').length > 0) {
            isFullWidthSlider = false;
            responsive = { 0: { items: 1 }, 400: { items: 1 }, 700: { items: 1 }, 1000: { items: 1 }, 1250: { items: 1 } };
        }

        productList.owlCarousel({
            loop: false,
            nav: true,
            dots: false,
            mouseDrag: isMouseSwipe,
            navText: ['', ''],
            navElement: "div",
            navContainer: navigation,
            responsive: responsive,
            autoWidth: isFullWidthSlider,
            lazyLoad: true,
            onInitialize: function (event) {
                homeList.find(".js-slider-init-action").remove();
            },
            onInitialized: function (event) {
                homeList.addClass("carousel-init");
            },
            onDragged: function (event) {
                if (typeof $.autobadgeFrontend !== 'undefined') {
                    $.autobadgeFrontend.reinit();
                }
            },
            onTranslated: function (event) {
                if (typeof $.autobadgeFrontend !== 'undefined') {
                    $.autobadgeFrontend.reinit();
                }
            },
        });

        if (goToSlide) {
            if (goToSlide == "prev") {
                productList.trigger("prev.owl.carousel");
            } else if (goToSlide == "next") {
                productList.trigger("next.owl.carousel");
            }
        }
    }
};

var listHome = {
    init: function () {
        var _this = this;

        var homeList = $(".js-home-products");

        if (homeList.length) {
            homeList.each(function () {
                _this.slider($(this));
            });
        }
    },
    slider: function (homeList) {
        var _this = this;

        homeList.removeClass("active");
        homeList.parent().find('.js-home-products-more').remove();
        homeList.after('<span class="home-products-more js-home-products-more"></span>');

        var products = homeList.find('.js-Product-grid');
        products.removeClass('hide');
        if (products.length) {
            var firstItem = products.first(),
                firstItemOffsetTop = firstItem.offset().top,
                countLine = homeList.data("count-line") ? parseInt(homeList.data("count-line")) : 1,
                indexLine = 0,
                prevItemOffsetTop = 0,
                countInLine = 0;

            products.each(function () {
                var currentItem = $(this),
                    currentItemOffsetTop = currentItem.offset().top;

                if (currentItemOffsetTop != prevItemOffsetTop) {
                    indexLine++;
                }

                if (indexLine == 1) {
                    countInLine++;
                }

                if (firstItemOffsetTop < currentItemOffsetTop && indexLine <= countLine) {
                    firstItemOffsetTop = currentItemOffsetTop;
                }

                if (firstItemOffsetTop < currentItemOffsetTop && countInLine > 2) {
                    currentItem.addClass("hide");
                    homeList.addClass("active");
                }
                prevItemOffsetTop = currentItemOffsetTop;
            });
            _this.showElements(homeList, countInLine);
        }
    },
    showElements: function (homeList, countInLine) {
        var btnShowMore = homeList.parent().find('.js-home-products-more');

        btnShowMore.on("click", function () {
            var products = homeList.find('.js-Product-grid');
            var itemsHide = homeList.find('.js-Product-grid.hide');

            var index = 0;
            itemsHide.each(function () {
                var currentItem = $(this);

                if (index < countInLine) {
                    currentItem.removeClass("hide");
                    currentItem.find(".js-product-preview-img").removeAttr("height").removeAttr("width");
                }

                index++;
            });

            var currentItemsHide = homeList.find('.js-Product-grid.hide');
            if (currentItemsHide.length) {
                homeList.addClass("active");
            } else {
                homeList.removeClass("active");
            }

            if (typeof $.autobadgeFrontend !== 'undefined') {
                $.autobadgeFrontend.reinit();
            }
        });
    }
};

var catImgs = {
    init: function () {
        var _this = this;

        _this.catList();
    },
    catList: function () {
        var _this = this,
            cats = $('.js-list-categories');

        cats.each(function () {
            var $this = $(this),
                lazy = $this.data('lazy'),
                img = $this.find('.js-cat-item-image');

            if (lazy) {
                _this.lazyLoadImg(img);
            }
        });
    },
    lazyLoadImg: function (images) {
        images.lazy();
    }
};

var slider = {
    sliderBox: $('.js-home-slider'),
    init: function () {
        var _this = this;

        if (_this.sliderBox.length) {
            _this.autoScroll();
            _this.sliderAction();
        }
    },
    autoScroll: function () {
        var _this = this;

        var pauseScroll = parseInt(_this.sliderBox.data("pause")) * 1000;

        if (pauseScroll > 0) {
            setTimeout(function () {
                _this.initializationSlider(null, pauseScroll);
            }, pauseScroll);
        }
    },
    sliderAction: function () {
        var _this = this;

        var sliderNav = $('.js-slider-init-action');
        sliderNav.on("click", function () {
            _this.initializationSlider($(this).data("index"), false);
            _this.sliderBox.trigger('stop.owl.autoplay');
        });

        if (checkTouchDevice()) {
            _this.sliderBox.swipe({
                allowPageScroll: "auto",
                threshold: 20,
                swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if (direction == 'left') {
                        _this.initializationSlider("next", false);
                    } else if (direction == 'right') {
                        _this.initializationSlider("prev", false);
                    }
                    if (_this.sliderBox.hasClass("owl-loaded")) {
                        _this.sliderBox.trigger('stop.owl.autoplay');
                    }
                }
            });
        }
    },
    initializationSlider: function (goToSlid, pause) {
        var _this = this;

        if (_this.sliderBox.hasClass("owl-loaded")) {
            return false;
        }

        var auto = (pause) ? true : false,
            navWrap = _this.sliderBox.closest(".js-slider-outer").find('.js-nav-slider'),
            dotsWrap = _this.sliderBox.closest(".js-slider-outer").find('.js-dots-slider');

        var params = {
            loop: true,
            margin: 0,
            nav: true,
            lazyLoad: true,
            autoHeight: true,
            navContainer: navWrap,
            dotsContainer: dotsWrap,
            items: 1,
            mouseDrag: false,
            navText: ['', ''],
            onInitialize: function () {
                navWrap.html("");
                dotsWrap.html("");
            },
        };

        if (auto) {
            params["autoplay"] = true;
            params["autoplayTimeout"] = pause;
            params["autoplayHoverPause"] = true;
        }

        _this.sliderBox.owlCarousel(params);

        $('.js-home-slider .owl-prev, .js-home-slider .owl-next, .js-home-slider owl-dot').on('click', function (e) {
            _this.sliderBox.trigger('stop.owl.autoplay');
        });


        if (goToSlid) {
            if (goToSlid == "prev") {
                _this.sliderBox.trigger("prev.owl.carousel");
            } else if (goToSlid == "next") {
                _this.sliderBox.trigger("next.owl.carousel");
            } else {
                _this.sliderBox.trigger("to.owl.carousel", [parseInt(goToSlid)]);
            }
        }
    }
};

var lazyLoadImg = {
    init: function () {
        var _this = this;

        $('.js-image-lazy').lazy({ bind: "event" });
    }
};

var formModal = {
    init: function () {
        var _this = this;

        _this.loadForm('a.js-form-login-popupp');
        _this.loadForm('.js-ajax-form a[href="/login/"]');
        _this.loadForm('.js-ajax-form a[href="/forgotpassword/"]');
        _this.btnForm();
    },
    loadForm: function (btnElem) {
        var _this = this;
        var selectorContent = '.js-ajax-form';

        $('body').on("click", btnElem, function (event) {
            event.preventDefault();
            var url = $(this).attr('href') + "?ajax=1";

            $.magnificPopup.close();
            $('body').prepend("<div class='js-loading-bg mfp-bg mfp-ready'><div class='mfp-preloader'></div></div>");

            $.get(url, function (data) {
                $('.js-loading-bg').remove();

                var content = $(data).find(selectorContent);
                _this.showModal(content, url);
            });
        });
    },
    showModal: function (content, url) {
        var _this = this;

        $(content).find('form').attr("action", url);
        $(content).find('input[type="checkbox"], input[type="radio"], .js-select').styler();


        $.magnificPopup.open({
            items: {
                src: "<div class='modal-content'>" + content.outerHTML() + "</div>"
            },
            type: 'inline'
        }, 0);

    },

    btnForm: function () {
        var _this = this;

        $('body').on("submit", '.js-ajax-form form', function (event) {
            var containerForm = $(this).closest('.js-ajax-form');

            if (!containerForm.find('.wa-login-form-wrapper').length && !containerForm.find('.wa-forgotpassword-form-wrapper').length) {
                event.preventDefault();

                var url = $(this).attr("action"),
                    data = $(this).serialize(),
                    btn = $(this).find('input[type="submit"]');

                btn.hide();
                btn.after($('<i class="icon16 loading js-loading"></i>'));

                $.post(url, data, function (data) {
                    var content = $(data).find('.js-ajax-form');
                    if (content.length > 0) {
                        _this.showModal(content, url);
                        btn.show();
                        $(this).find(".js-loading").remove();
                    } else {
                        window.location.reload();
                    }
                });
            }
        });
    }

};

var videoModal = {
    init: function () {
        $("body").on("click", '.js-video-popup', function (e) {
            e.preventDefault();
            var href = $(this).data("href");

            if (href) {
                $.magnificPopup.open({
                    items: {
                        src: href
                    },
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false,
                    iframe: {
                        patterns: {
                            youtube_short: {
                                index: 'youtu.be/',
                                id: 'youtu.be/',
                                src: '//www.youtube.com/embed/%id%?autoplay=1'
                            }
                        }
                    }
                }, 0);
            }
        });
    },
};

var cart = {
    init: function () {
        var _this = this;

        _this.addProductToCart();
        _this.addToCartDialog();
        _this.btnQuantity();
        _this.countQuantity();

    },
    addToCartDialog: function () {
        var _this = this;

        $('body').on("click", ".js-card-dialog", function () {
            $.magnificPopup.open({
                items: {
                    src: $(this).data('href')
                },
                type: 'ajax',
                callbacks: {
                    parseAjax: function (block) {
                        if (typeof block.data === 'string' || block.data instanceof String) {
                            var outer = "<div>" + block.data + "</div>";
                            block.data = $(outer).find(".js-modal-content");
                        } else {
                            block.data = $(block.data);
                        }
                    },
                    ajaxContentAdded: function () {
                        var productCard = this.content.find('#product-cart');
                        if (productCard.length && productCard.data('id')) {
                            productViewListCustom.viewed(productCard.data('id'));
                        }

                        if (!checkTouchDevice()) {
                            itemGallery.productMagnifImg(this.content.find(".js-product_gallery-images-main"));
                        }
                        itemGallery.swipeBigImg(this.content.find('.js-product_gallery-images-main'));
                        itemGallery.previewsWrapSlider = itemGallery.previewsSliderWrap(this.content.find('.js-previews-gallery'));
                    },
                    open: function () {
                        $.magnificPopup.instance._onFocusIn = function (e) {
                            if ($(e.target).closest('#storequickorder')) {
                                return true;
                            }
                            $.magnificPopup.proto._onFocusIn.call(this, e);
                        };
                    }
                }
            }, 0);
        });
    },
    addProductToCart: function () {
        var _this = this;

        $('body').on('submit', '.js-add-to-cart', function (event) {
            event.preventDefault();
            var $this = $(this),
                url = $this.attr('action'),
                data = $this.serialize(),
                previewCartCount = $('.js-cart-preview-count'),
                previewCartTotal = $('.js-cart-price-total-price'),
                addToCartDialog = $('#cart-form-dialog'),
                btn = $this.find(".js-submit-form"),
                previewCartTotalPrice = $('.header-cart-custom-total span');
            if (btn.hasClass('added')) {
                window.location.href = '/order/';
            } else {
                btn.addClass("cart-loading");
                $.post(url + '?html=1', data, function (response) {
                    btn.text(btn.data('added-text'));
                    btn.removeClass("cart-loading");
                    btn.addClass("added");

                    if (response.status == 'ok') {
                        previewCartCount.html(response.data.count);
                        previewCartTotal.html(response.data.total);
                        previewCartTotalPrice.html(response.data.total.replace(' ₽', ''));
                        productViewListCustom.showAddedMsg($('.juniq-header-preview-cart'));
                        if (addToCartDialog.length > 0) {
                            $.magnificPopup.close();
                        }

                        if ($this.data('after-action') == 'popup') {
                            _this.popupAddCart($this);
                        } else if ($this.data('after-action') == 'fixed') {
                            fixOrder.open();
                        } else if ($this.data('after-action') == 'move') {
                            _this.animationMoveToCart($this);
                        }
                    } else {
                        //messages.notifyDanger(response.errors);
                    }
                }, 'json');
            }
        });
    },
    animationMoveToCart: function (form) {
        var productBlock = form.closest('.js-product').find('.js-preview-cart');
        if (productBlock.length == 0) {
            productBlock = form.closest('.js-preview-cart');
        }
        var position = productBlock.data('position');
        var productBlockCopy = $('<div></div>').append(productBlock.html());
        var cart_preview = $('.js-fixed .juniq-header-preview-cart');
        if (!cart_preview.length || !cart_preview.is(':visible')) {
            cart_preview = $('.js-cart-header');
        }
        productBlockCopy.css({
            'z-index': 100,
            top: productBlock.offset().top,
            left: productBlock.offset().left,
            width: productBlock.width() + 'px',
            height: productBlock.height() + 'px',
            position: (position) ? position : 'absolute',
            overflow: 'hidden',
            background: "#FFF"
        }).insertAfter('body').animate({
            top: cart_preview.offset().top,
            left: cart_preview.offset().left,
            width: 0,
            height: 0,
            opacity: 0.7
        }, 650, function () {
            productBlockCopy.remove();

            productViewListCustom.showAddedMsg($('.juniq-header-preview-cart'));
        });
    },
    popupAddCart: function (form) {
        var popup = $('#popup-addcart'),
            productName = form.data("name"),
            price = form.data("price"),
            image = form.data("image"),
            quantity = 1,
            quantityFileld = form.find("input[name='quantity']");


        if (quantityFileld.length) {
            quantity = quantityFileld.val()
        }

        popup.find(".js-popup-addcart-name").html(productName);
        popup.find(".js-popup-addcart-price").html(price);
        popup.find(".js-popup-addcart-count").html("(x" + quantity + ")");
        if (image) {
            popup.find(".js-popup-addcart-image").html("<img src='" + image + "' >");
        } else {
            popup.find(".js-popup-addcart-image").html("");
        }

        $.magnificPopup.open({
            items: {
                src: popup,
                type: 'inline'
            },
            callbacks: {
                afterClose: function () {
                    popup.find(".js-popup-addcart-name").html("");
                    popup.find(".js-popup-addcart-price").html("");
                    popup.find(".js-popup-addcart-count").html("");
                    popup.find(".js-popup-addcart-image").html("");
                }
            }

        });
        $('.js-close-popup-addcart').on("click", function () {
            $.magnificPopup.close();
        });
    },
    btnQuantity: function () {
        var _this = this;

        $('body').on("click", '.js-pr-count-action', function () {
            var $this = $(this),
                action = $this.data('action'),
                wrap = $this.closest('.js-pr-count'),
                inputQuantity = wrap.find('input'),
                quantity = inputQuantity.val();

            if (action == 'add') {
                inputQuantity.val(parseInt(quantity) + 1);
            } else {
                if (quantity > 1) {
                    inputQuantity.val(parseInt(quantity) - 1);
                }
            }
            inputQuantity.change();
        });
    },
    countQuantity: function () {
        $('body').on("click", ".js-qty-button", function () {
            var $this = $(this),
                wrapOut = $this.closest('.js-qty'),
                action = $this.data('type'),
                input = wrapOut.find('input'),
                currentQty = parseInt(input.val());

            if (action == "-") {
                if (currentQty > 1) {
                    currentQty--;
                } else {
                    currentQty = 1;
                }
            } else {
                if (currentQty) {
                    currentQty++;
                } else {
                    currentQty = 1;
                }
            }

            input.val(currentQty);
            input.change();
        });
    }
};

var categoriesMainMenu = {
    init: function () {
        var _this = this;

        _this.ddShow();
        _this.dd();
        _this.showSubInMob();
        _this.hiderSubInMob();
        //_this.outerBg();
        _this.addHoverClass();
        if ($('.js-show-cat').hasClass('-hide')) {
            _this.hideCatList();
        }
    },
    addHoverClass() {
        const item = $(".cat-menu__item");

        item.hover(
            function () {
                const $this = $(this);
                $this.addClass('active');
            },
            function () {
                const $this = $(this);
                $this.removeClass('active');
            }
        );
    },
    ddShow: function () {
        var _this = this;

        var item = $(".js-cat-subs-disclosed"),
            topCatMenu = $('#nav-cat'),
            delayCount = 150,
            ddBox = topCatMenu.find('.dd-wrap');

        item.hover(function () {
            var $this = $(this),
                submenu = $this.find('.js-subcategory-menu').first(),
                subMenuPos = submenu.css("position") == 'absolute',
                catMenuPos = topCatMenu.css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-category-menu-wrap');

            $this.siblings().removeClass('active');
            $this.siblings().each(function () {
                $(this).find('.js-subcategory-menu').first().stop(true).delay(delayCount).fadeOut(0);
            });

            if (subMenuPos) {
                if (submenu.length > 0) {
                    submenu.stop(true).delay(delayCount).fadeIn(1);
                }
            }


            submenu.stop(true).delay(delayCount).fadeIn(0, function () {
                let oneColumnWrap = 0;

                $('#nav-cat .js-category-menu-wrap > .cat-menu__item').each(function () {
                    oneColumnWrap += $(this).height();
                    oneColumnWrap += parseFloat($('#nav-cat .js-category-menu-wrap').css('padding-bottom'));
                });
                const subCatsPaddingTop = parseFloat(submenu.find('.sub-category_cols').css('padding-top'));
                const subCatsPaddingBottom = parseFloat(submenu.find('.sub-category_cols').css('padding-bottom'));
                const subCatsHeight = parseFloat(submenu.find('.sub-category_cols').height());
                let subcategoryMenu = subCatsHeight + subCatsPaddingTop + subCatsPaddingBottom;
                let maxHeightUnderMenu = Math.round(window.innerHeight - $('.Nav__Primary-outer')[0].getBoundingClientRect().top);

                heightArray = [oneColumnWrap, subcategoryMenu];
                let neededHeight = (maxHeightUnderMenu > Math.max.apply(null, heightArray)) ? Math.max.apply(null, heightArray) + 0.41 : maxHeightUnderMenu;

                //назначение высоты обертке
                ddBox.delay(delayCount).removeAttr('style');
                ddBox.delay(delayCount + 20).attr('style', `height:${neededHeight}px;`);
                submenu.find('.sub-category_cols').delay(delayCount + 20).attr('style', `height:${neededHeight}px;`);
            })

        }
        );
    },
    dd: function () {
        var _this = this;

        var item = $(".js-cat-subs-dropdown");

        item.hover(function () {
            var $this = $(this),
                submenu = $this.find('.js-subcategory-menu').first(),
                subMenuPos = submenu.css("position") == 'absolute',
                catMenuPos = $('#nav-cat').css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-category-menu-wrap'),
                catMenuMarginRight = 0;

            if (subMenuPos) {
                if (submenu.length) {
                    catMenuMarginRight += 293;
                    //if (hoverTime) {
                    submenu.stop(true).delay(150).fadeIn(1);
                    //} else {
                    //    submenu.show();
                    //}
                }
                if (!item.hasClass("pos-rel")) {
                    catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                    if (catMenuPos) {
                        _this.calcHeight(catMenuWrap, submenu);
                    }
                }
            }
        }, function () {
            var $this = $(this),
                submenu = $this.find('.js-subcategory-menu'),
                subMenuPos = submenu.css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-category-menu-wrap');

            if (subMenuPos) {
                //if (hoverTime) {
                submenu.stop(true).delay(150).fadeOut(1, function () {
                    catMenuWrap.removeAttr('style');
                });
                //} else {
                //    submenu.hide();
                //    catMenuWrap.removeAttr('style');
                //}
            }
        });

        var itemSub = $('.js-subcatmenu-el');
        itemSub.hover(function () {
            var $this = $(this),
                submenu = $this.find('.js-subcategory-menu').first(),
                subMenuPos = submenu.css("position") == 'absolute',
                catMenuPos = $('#nav-cat').css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-category-menu-wrap'),
                catMenuMarginRight = 518;

            if (subMenuPos) {
                //if (hoverTime) {
                submenu.stop(true).delay(150).fadeIn(1, function () {
                    if (!itemSub.hasClass("pos-rel")) {
                        catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                        if (catMenuPos) {
                            _this.calcHeight(catMenuWrap, submenu);
                        }
                    }
                });
                //} else {
                //    submenu.show();
                //    if (!itemSub.hasClass("pos-rel")) {
                //        catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                //        if (catMenuPos) {
                //            _this.calcHeight(catMenuWrap, submenu);
                //        }
                //    }
                //}
            }
        }, function () {
            var $this = $(this),
                submenu = $this.find('.js-subcategory-menu').first(),
                subMenuPos = submenu.css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-category-menu-wrap'),
                catMenuMarginRight = 293,
                parent = $this.closest('.js-cat-subs-dropdown');


            if (subMenuPos) {
                //if (hoverTime) {
                submenu.stop(true).delay(150).fadeOut(1, function () {
                    if (!itemSub.hasClass("pos-rel")) {
                        catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                    }
                });
                //} else {
                //    submenu.hide();
                //    if (!itemSub.hasClass("pos-rel")) {
                //        catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                //    }
                //}
            }
        });
    },
    calcHeight: function (wrap, submenuWrap) {
        var subHeightWrap = submenuWrap.outerHeight(true),
            wrapHeight = wrap.outerHeight(true);

        if (subHeightWrap > wrapHeight) {
            wrap.css("height", subHeightWrap + 'px');
        }
    },
    showSubInMob: function () {
        var caret = $('.js-cat-item-caret');

        caret.on("click", function () {
            var $this = $(this),
                parent = $this.closest('.js-cat-subs-disclosed, .js-cat-subs-dropdown, .js-subcatmenu-el'),
                submenu = $(parent.find('.js-subcategory-menu').first()),
                isSubmenuStatic = (submenu.css('position') != 'absolute');
            if ($(this).hasClass('lvl-2')) {
                $(this).closest('.MobileMenu_nav-m').addClass('disable-body-scrolling');
            }

            if ($(this).hasClass('lvl-3')) {
                console.log($('.cat-menu__item.active .menu-subcategory'));
                $(this).closest('.menu-subcategory').addClass('disable-body-scrolling');
            }

            if (isSubmenuStatic) {
                if (!submenu.is(':visible')) {
                    submenu.css('left', '-100%');
                    parent.addClass('open');
                    $this.addClass('open');
                } else {
                    submenu.css('left', '0');
                    $this.removeClass('open');
                    parent.removeClass('open');
                }
            }
        });
    },
    hiderSubInMob: function () {
        var caret = $('.js-btn-close-submenu');

        caret.on("click", function () {
            var $this = $(this),
                parent = $this.closest('.js-subcategory-menu'),
                parentMenuItem = $this.closest('.subcat-menu__item');
            parentArrow = $this.closest('.js-cat-item-caret')
            parent.css('left', '-100%');
            parentArrow.removeClass('open');
            parentMenuItem.removeClass('open');

            if ($(this).hasClass('js-btn-close-submenu--lvl2')) {
                $('.MobileMenu_nav-m').removeClass('disable-body-scrolling');
            }
            if ($(this).hasClass('js-btn-close-submenu--lvl3')) {
                $('.lvl-2').each(function () {
                    $(this).siblings('.disable-body-scrolling').removeClass('disable-body-scrolling')
                })
            }
        });
    },
    outerBg: function () {
        const menuWrap = $('#nav-cat'),
            bg = $('#nav-cat > .js-bg'),
            hoverTime = true;


        // bg.attr('style', `background-image: linear-gradient(transparent ${headerHeight}px, #000 ${headerHeight}px)`)
        // hoverTime = $('#nav-cat').data("delay");

        // if (hoverTime) {
        //     menuWrap.hover(function () {
        //         bg.stop(true).delay(150).fadeIn(1);
        //     }, function () {
        //         bg.stop(true).delay(150).fadeOut(1);
        //     });
        // } else {
        //     menuWrap.hover(function () {
        //         bg.show();
        //     }, function () {
        //         bg.hide();
        //     });
        // }
    },
    hideCatList: function () {
        $('.js-show-cat').click(function () {
            $('.-hideList').addClass('open');
        })
        $('.js-btn-hide-fullcatlist').click(function () {
            $(this).closest('.-hideList').removeClass('open');
        })
    }
};

var itemsViewList = {
    init: function () {
        var _this = this,
            itemList = $('.js-preview-products');

        itemList.each(function () {
            _this.images($(this));
        });
    },
    images: function (itemList) {
        var _this = this,
            isLazy = itemList.data('image-lazy'),
            productImage = itemList.find(".js-product-preview-img:not(.owl-lazy)");

        if (isLazy) {
            productImage.lazy({
                afterLoad: function (element) {
                    new productGridGallery();
                },
            });
        }
    },
};

var formSelectList = {
    init: function () {
        $(document).mouseup(function (e) {
            var div = $(".cat-sort");
            if (!div.is(e.target)
                && div.has(e.target).length === 0) {
                div.find('.js-select-items').hide();
            } else {
                let show = true;
                if (($(e.target).attr('href') && $(e.target).attr('href').includes('?sort')) && $('.js-select-items').is(':visible')) {
                    div.find('.js-select-items').hide()
                    show = false;
                }

                if (($(e.target).hasClass('js-checked-toggle')) && $('.js-select-items').is(':visible')) {
                    div.find('.js-select-items').hide()
                    show = false;
                }

                if (($(e.target).hasClass('fi-rr-caret-down') && $(e.target).closest('jq-checked__arrow-trigger')) && $('.js-select-items').is(':visible')) {
                    div.find('.js-select-items').hide()
                    show = false;
                }

                if (show) {
                    div.find('.js-select-items').show()
                }
            }
        });
        $('body').on("click", '.js-checked-toggle a', function (event) {
            event.preventDefault();
        });
    }
};

var mobileMenuBtn = {
    init: function () {
        var _this = this;

        _this.closeOpen();
        _this.openSub();
    },
    closeOpen: function () {
        var _this = this,
            phoneBtnShow = $(".js-nav-button"),
            phoneSubCatHideBtn = $(".menu-close");

        phoneBtnShow.on("click", function () {
            var $this = $(this),
                menu = $('#' + $this.data('id'));

            if (menu.hasClass('show')) {
                menu.removeClass('show');
                $this.removeClass('show');
                phoneSubCatHideBtn.trigger('click');
                $('body').removeClass('disable-body-scrolling');
            } else {
                menu.addClass('show');
                $this.addClass('show');
                $('body').addClass('disable-body-scrolling');
            }
        });
        phoneSubCatHideBtn.on("click", function () {
            var $this = $(this),
                menu = $(this).closest('.MobileMenu_nav-m'),
                catSubsDD = $(this).closest('.js-cat-subs-dropdown'),
                subCat = $('.MobileMenu_nav-m .js-subcategory-menu');
            if (menu.hasClass('show')) {
                menu.removeClass('show');
                $('body').removeClass('disable-body-scrolling');
            }
            subCat.css('left', '-100%');
            if (catSubsDD.hasClass('open')) {
                catSubsDD.removeClass('open');
            }
            if ($(".-hideList").hasClass('open')) {
                $(".-hideList").removeClass('open');
            }
            if ($('.js-show-mobile-search').hasClass('is-show-mobile')) {
                $('.js-show-mobile-search').removeClass('is-show-mobile');
                $('.header__search .juniq-header-search').css('display', 'none');
            }
            $('.js-nav-button').removeClass('show');

            $('.MobileMenu .disable-body-scrolling').each(function () {
                $(this).removeClass('disable-body-scrolling');
            })
        });
    },
    openSub: function () {
        var _this = this,
            btn = $('.js-top-nav-caret');

        btn.on("click", function () {
            var item = $(this).closest('.juniq-header-top-nav-el');

            if (item.hasClass('open')) {
                item.removeClass('open');
                $(this).removeClass('open');
            } else {
                item.addClass('open');
                $(this).addClass('open');
            }
        });
    }
};

var tabsAcc = {
    init: function () {
        var _this = this;

        _this.initactiveTab();
        _this.activeTab();
        _this.activeToTabContent();
    },
    activeTab: function () {
        var button = $('.js-acc-tab');

        button.on("click", function () {
            var $this = $(this),
                wrapId = $this.data('tab-content'),
                selectedContent = button.closest('.js-tabs-acc-wrap').find('#' + wrapId);

            if (selectedContent.is(':visible')) {
                $this.removeClass('selected');
                selectedContent.removeClass('selected');
            } else {
                $this.addClass('selected');
                selectedContent.addClass('selected');
            }
        });
    },
    activeToTabContent: function () {
        var buttonMoveToTab = $('.js-motion-to-tab');

        buttonMoveToTab.on("click", function (event) {
            event.preventDefault();

            var $this = $(this),
                selectedTabContent = $('#' + $this.data('tab-content')),
                tabsOuterWrap = selectedTabContent.closest(".js-tabs-acc-wrap"),
                thisTfb = tabsOuterWrap.find('.js-acc-tab[data-tab-content="' + $this.data('tab-content') + '"]');

            thisTfb.addClass('selected');
            selectedTabContent.addClass('selected');

            var top = selectedTabContent.offset().top - 40;
            $('html,body').animate({
                scrollTop: top
            }, 500);
        });
    },
    initactiveTab: function () {
        var wrap = $('.js-tabs-acc-wrap');

        if (wrap.length) {
            wrap.each(function () {
                var $this = $(this),
                    activeTab = $this.find('.js-acc-tab.selected');

                if (!activeTab.length) {
                    activeTab = $this.find('.js-acc-tab:first');

                    if (activeTab.length) {
                        var tabContent = wrap.find('#' + activeTab.data('tab-content'));

                        if (tabContent.length) {
                            activeTab.addClass('selected');
                            tabContent.addClass('selected');
                        }
                    }
                }
            });
        }
    }
};

var cookieMessage = {
    init: function (box) {
        var _this = this;

        if (!box.length) {
            return false;
        }

        if (_this.messageBox(box)) {
            _this.boxOpen(box);
            _this.onClose(box);
        }
    },
    messageBox: function (box) {
        var _this = this;

        if (!$.cookie("closeCookie")) {
            return true;
        }

        return false;
    },
    boxOpen: function (box) {
        var _this = this;

        box.show();
    },
    onClose: function (box) {
        var _this = this,
            id = box.data('id'),
            close = box.find('.js-cookie-information');

        close.on("click", function () {
            box.detach();
            $.cookie('closeCookie', '1', { expires: 365 * 10 });
        });
    }
};

var attentionMessage = {
    init: function () {
        var _this = this;

        _this.closingBox();
    },
    closingBox: function () {
        $('.js-attention-close').on("click", function () {
            $(this).closest('.Header__Banner').hide();
            $.cookie("closeAttention", true);
        });
    }
};

var formFunc = {
    init: function () {
        var _this = this;

        _this.formAppearance();
        _this.formSend();
    },
    formAppearance: function () {
        $('body').on('change', 'input[type="checkbox"]', function () {
            if ($(this).is(':checked')) {
                $(this).closest('.jq-checkbox, .js-style-check').addClass('checked');
                $(this).closest('label').addClass('checked');
            } else {
                $(this).closest('.jq-checkbox, label, .js-style-check').removeClass('checked');
                $(this).closest('label').removeClass('checked');
            }
        });

        $('body').on('change', 'input[type="radio"]', function () {
            var inputs = $('input[type="radio"][name="' + $(this).attr('name') + '"]');
            inputs.each(function () {
                var input = $(this);
                if (input.is(':checked')) {
                    input.closest('.jq-radio, .js-toggle-styler').addClass('checked');
                    input.closest('label').addClass('checked');
                } else {
                    input.closest('.jq-radio, .js-toggle-styler').removeClass('checked');
                    input.closest('label').removeClass('checked');
                }
            });
        });

        if (!globalThemeSettings.isformAppearanceInit) {
            return false;
        }

        var inputAppearance = $('input[type="checkbox"]:not(.js-style-check-input):not(.js-none-styler):not(.shop-sk-callback__checkbox), input[type="radio"]:not(.js-toggle-styler-input):not(.buy1step-auth__variant):not(.js-none-styler), .js-select');
        if (!inputAppearance.length) {
            return false;
        }
        inputAppearance.styler();
        $('input[type="checkbox"], input[type="radio"], .js-select').styler();
        $('.js-addgifts__cart-el input[type="radio"], .searchpro__page-filters input[type="checkbox"], .searchpro__page-filters input[type="radio"], .searchpro__page-filters .js-select').styler('destroy');
    },
    formSend: function () {
        $('body').on("click", ".js-submit-form", function () {
            const $this = $(this);
            let form;
            if ($this.closest('.search-modal--box').length) {
                form = $this.closest('.search-modal--box').find("form");
            } else {
                form = $this.closest("form");
            }

            if (!$this.hasClass('disabled')) {
                form.submit();
            }
        });
    }
};

var productViewListCustom = {
    init: function () {
        var _this = this;

        _this.compare();
        _this.favorites();
        _this.clear();
        _this.viewed();
    },
    viewed: function ($productId) {
        var _this = this;

        if ($('#product-cart').length && $('#product-cart').data('id')) {
            _this.add('viewed_product_list', $('#product-cart').data('id'), 20);
        }
    },
    compare: function () {
        var _this = this;

        _this.list(
            'shop_compare',
            $(".js-preview-compare"),
            '.js-compare-add'
        );
    },
    favorites: function () {
        var _this = this;

        _this.list(
            'product_favor_arr',
            $(".js-favorites-preview"),
            '.js-favorites-add'
        );
    },
    list: function (productsArrName, arrPrevWrap, itemAddToListButton, cbFunc) {
        var _this = this;

        $("body").on('click', itemAddToListButton, function (event) {
            event.preventDefault();
            var $this = $(this),
                countInList = 0,
                isAdded = true,
                countPreviewView = arrPrevWrap.find('.js-products-count'),
                linPreviewView = arrPrevWrap.find('.js-products-link'),
                productId = $(this).data('product');

            if (!$this.hasClass('active')) {
                countInList = _this.add(productsArrName, productId);
                if ($this.find('.product-action-text').length > 0) {
                    if (productsArrName == 'product_favor_arr') {
                        $this.find('.product-action-text').text('В избранном');
                    }
                    if (productsArrName == 'shop_compare') {
                        $this.find('.product-action-text').text('В сравнении');
                    }
                }
            } else {
                countInList = _this.remove(productsArrName, productId);
                isAdded = false;
                if ($this.find('.product-action-text').length > 0) {
                    if (productsArrName == 'product_favor_arr') {
                        $this.find('.product-action-text').text('В избранное');
                    }
                    if (productsArrName == 'shop_compare') {
                        $this.find('.product-action-text').text('В сравнениe');
                    }
                }
            }
            var url = (countInList > 0) ? linPreviewView.attr('href').replace(/compare\/.*$/, 'compare/' + _this.get(productsArrName) + '/') : '/compare/';

            linPreviewView.attr('href', url);
            countPreviewView.html(countInList);

            if (isAdded) {
                _this.showAddedMsg(arrPrevWrap);
            }

            $(itemAddToListButton + "[data-product='" + productId + "']").toggleClass('active');

            if (cbFunc) {
                cbFunc({ that: $this, url: url, productId: productId, isAdded: isAdded });
            }
            if (itemAddToListButton == ".js-compare-add") {
                if (location.href.includes('/compare/')) {
                    location.href = location.href.replace(/compare\/.*!/, 'compare/');
                }
                ;
            }
        });
    },
    add: function (productsArrName, productId, limit) {
        var _this = this, list = $.cookie(productsArrName), listArr = [];
        if (list && list != "null" && list != "0") {
            list = list.replace(",null", "");
            list = list.replace(",0", "");
            var listArr = list.split(',');

            var i = $.inArray(productId + '', listArr);
            if (i != -1) {
                listArr.splice(i, 1);
            }
        }
        listArr.unshift(productId);

        if (limit) {
            listArr.splice(limit);
        }

        _this.save(listArr, productsArrName);

        return listArr.length;
    },
    remove: function (productsArrName, productId) {
        var _this = this, list = $.cookie(productsArrName);

        if (list) {
            list = list.split(',');
        } else {
            list = [];
        }
        var i = $.inArray(productId + '', list);
        if (i != -1) {
            list.splice(i, 1);
        }

        _this.save(list, productsArrName);

        return list.length;
    },
    get: function (productsArrName) {
        return $.cookie(productsArrName);
    },
    save: function (list, productsArrName) {
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                if (!parseInt(list[i])) {
                    list.splice(i, 1);
                }
            }
        }
        if (list.length > 0) {
            $.cookie(productsArrName, list.join(','), { expires: 30, path: '/' });
        } else {
            $.cookie(productsArrName, null, { path: '/' });
        }
    },
    clear: function () {
        var _this = this, btn = $('.js-clear-pr-list');
        btn.on("click", function () {
            var $this = $(this),
                list = [],
                productsArrName = $this.data("list");
            _this.save(list, productsArrName);
            location.reload();
        });
    },
    showAddedMsg: function (arrPrevWrap) {
        arrPrevWrap.addClass('active');
        setTimeout(function () {
            arrPrevWrap.removeClass('active');
        }, 3000);
    }
};

var ddBox = {
    init: function () {
        var _this = this;

        var ddSelectBtn = '.js-btnDrop-down',
            ddSelectWrap = '.js-dd-wrap',
            ddSelectOuter = '.js-dd-outer',
            container = $('header>.container');

        $(document).click(function (event) {
            if ((!$(event.target).closest(ddSelectWrap).length && !$(event.target).closest(ddSelectOuter).length) || $(event.target).hasClass('js-bg')) {
                $(ddSelectWrap).each(function () {
                    $(this).removeClass('show');
                    container.removeClass('container--z-index');
                    $(ddSelectBtn).removeClass('show');
                });
            }
        });

        $(ddSelectBtn).on("click", function () {
            var $this = $(this),
                wrap = $('#' + $(this).data("id"));

            if (wrap.is(':visible')) {
                container.removeClass('container--z-index');
                $this.removeClass('show');
                wrap.removeClass('show');
            } else {
                $this.addClass('show');
                container.addClass('container--z-index');
                $(ddSelectWrap).each(function () {
                    $(this).removeClass('show');
                });
                _this.open($this, wrap);
            }
        });
    },
    open: function (btn, btnWrap) {
        const _this = this;

        if (btnWrap.is(':visible')) {
            btnWrap.animate({ opacity: 0 }, 200, function () {
                btnWrap.removeClass('show');
            });
            btn.removeClass('active');
        } else {
            btnWrap.css("padding-top", "20px");
            btnWrap.css("opacity", "0");
            btnWrap.addClass('show');
            btnWrap.animate({ paddingTop: "0", opacity: 1 }, 200);
            btn.addClass('active');
        }
        if (btn.hasClass('nav-cat-btn')) {
            $('.js-cat-subs-disclosed.has-subs.cat-menu__item').first().trigger('mouseenter');
            setBG();
            $(window).scroll(function () {
                setBG();
            });
            function setBG() {
                let height = _this.getPositionDDmenu();
                $('#nav-cat > .js-bg').attr('style', `background-image: linear-gradient(transparent ${height}px, #000 ${height}px)`);
            }
        }
    },
    getPositionDDmenu: function () {
        const coords = $('#nav-cat')[0].getBoundingClientRect();
        return coords.top;
    }
};

var itemGallery = {
    previewsWrapSlider: null,
    init: function () {
        var _this = this,
            $ = jQuery;

        itemGallery.previewsWrapSlider = _this.previewsSliderWrap($('.js-previews-gallery'));
        itemGallery.swipeBigImg($('.js-product_gallery-images-main'));
        /* Мобила открытие картинки*/
        itemGallery.popupSwipeImg();
        /* Комп открытие картинки*/
        itemGallery.popupSwipebox();
        /** Досрочный запуск слайдера */
        itemGallery.mainSliderInit($('.js-product_gallery-images-main'), 'right')
        /* Клик по миниатюрам */
        $("body").on("click", ".js-id-preview-gallery a", function (event) {
            event.preventDefault();

            itemGallery.changeBigImg($(this), false);
        });

        if (!checkTouchDevice()) {
            _this.productMagnifImg($('.js-product_gallery-images-main'));
        }
    },
    previewsSliderWrap: function (img) {
        if ($('.product-page').length > 0) {
            let windowWidth = $(window).width();
            let miniatureCount = 5;
            if ($('.js-image-popup-swipebox').height() > 150) {
                if ($('.image-preview--video').length) {
                    miniatureCount = Math.trunc($('.js-image-popup-swipebox').height() / 60 - 2);
                } else {
                    miniatureCount = Math.trunc($('.js-image-popup-swipebox').height() / 60 - 1);
                }
            }
            if (windowWidth >= 1026) {
                if (img.length) {
                    img.bxSlider({
                        mode: 'vertical',
                        minSlides: miniatureCount,
                        slideMargin: 6,
                        pager: false,
                        nextText: '',
                        prevText: '',
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        oneToOneTouch: false,
                        touchEnabled: false
                    });

                    return img;
                } else {
                    return false;
                }
            }
        } else {
            if (img.length) {
                img.bxSlider({
                    mode: 'vertical',
                    minSlides: 5,
                    slideMargin: 6,
                    pager: false,
                    nextText: '',
                    prevText: '',
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    oneToOneTouch: false,
                    touchEnabled: false
                });

                return img;
            } else {
                return false;
            }
        }
    },
    mainSliderInit: function (mainSlider, avtiveSlideBtn) {
        var _this = this,
            position = 0;

        if (mainSlider.length && !mainSlider.hasClass('owl-loaded')) {
            var currentPreview = mainSlider.closest('.js-product').find('.js-id-preview-gallery.selected');
            if (currentPreview.length) {
                if (currentPreview.data("position") != "0") {
                    position = parseInt(currentPreview.data("position"));
                }
            }
            
            mainSlider.owlCarousel({
                loop: false,
                nav: false,
                margin: 0,
                items: 1,
                lazyLoad: true,
                autoHeight: false,
                dots: true,
                startPosition: position,
                mouseDrag: false,
                onInitialized: function () {
                    if (!checkTouchDevice()) {
                        _this.productMagnifImg(mainSlider);
                    }
                    _this.displayImageTitle(mainSlider);
                },
                onChanged: function (e) {
                    var gallery = $(e.currentTarget),
                        currentItemIndex = e.item.index,
                        currentItem = gallery.find('.js-product_gallery-images-main-el[data-position="' + currentItemIndex + '"]'),
                        currentItemId = currentItem.data("id"),
                        is_video = (currentItem.data("id") == "video");

                    if (is_video && !currentItem.find('iframe').length) {
                        var videoUrl = currentItem.data("video-url"),
                            videoWidth = currentItem.data("video-width"),
                            videoHeight = currentItem.data("video-height");

                        currentItem.html('<iframe src="' + videoUrl + '" width="' + videoWidth + '" height="' + videoHeight + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                    }

                    if (currentItemId) {
                        var previews = gallery.closest('.js-product').find('.js-id-preview-gallery');

                        previews.removeClass("selected");
                        var currentPreview = previews.filter("[data-id='" + currentItemId + "']");
                        currentPreview.addClass("selected");
                    }
                },
                onDragged: function (e) {
                    var gallery = $(e.currentTarget);

                    if (gallery.length) {
                        var previews = gallery.closest('.js-product').find('.js-id-preview-gallery'),
                            previousPreview = previews.filter('.selected'),
                            image_id = $(gallery).find(".owl-item.active .js-product_gallery-images-main-el").data("id");


                        if (image_id) {
                            previews.removeClass("selected");

                            var currentPreview = previews.filter("[data-id='" + image_id + "']");
                            currentPreview.addClass("selected");


                            if (currentPreview.attr("aria-hidden") == "true" && _this.previewsWrapSlider.length) {
                                if (parseInt(previousPreview.data('position')) > parseInt(currentPreview.data('position'))) {
                                    _this.previewsWrapSlider.goToPrevSlide();
                                } else if (parseInt(previousPreview.data('position')) < parseInt(currentPreview.data('position'))) {
                                    _this.previewsWrapSlider.goToNextSlide();
                                }
                            }
                            itemGallery.displayImageTitle(gallery);

                        }
                    }
                }
            });

            if (avtiveSlideBtn) {
                if (avtiveSlideBtn == "prev") {
                    mainSlider.trigger("next.owl.carousel");
                } else if (avtiveSlideBtn == "next") {
                    mainSlider.trigger("prev.owl.carousel");
                }
            }
        }
    },
    swipeBigImg: function (mainGallery) {
        if (checkTouchDevice()) {
            mainGallery.swipe({
                allowPageScroll: "auto",
                threshold: 20,
                swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                    var mainGallery = $(event.target).closest('.js-product').find('.js-product_gallery-images-main');

                    if (direction == 'left') {
                        itemGallery.mainSliderInit(mainGallery, "prev");
                    } else if (direction == 'right') {
                        itemGallery.mainSliderInit(mainGallery, "next");
                    }
                }
            });
        }
    },
    changeBigImg: function (prevImg, isPrevSlideActive) {
        var _this = this,
            preview = prevImg.parent(),
            imgId = preview.data("id"),
            sliderMain = prevImg.closest('.js-product').find('.js-product_gallery-images-main'),
            sliderMainItems = sliderMain.find('.js-product_gallery-images-main-el');

        if (!sliderMain.hasClass('owl-loaded')) {
            _this.mainSliderInit(sliderMain);
        }

        if (isPrevSlideActive == undefined) {
            isPrevSlideActive = true;
        }

        preview.addClass('selected').siblings().removeClass('selected');

        if (imgId) {
            var position = sliderMainItems.filter("[data-id='" + imgId + "']").data("position");
            // console.log(sliderMainItems.filter("[data-id='" + imgId + "']"));
            if (typeof position !== "undefined") {
                sliderMain.trigger("to.owl.carousel", [position, 300]);
                itemGallery.displayImageTitle(sliderMain);
            }
        }
    },
    displayImageTitle: function (sliderItems) {
        var title = sliderItems.closest('.js-product').find('.js-product_gallery-images-title'),
            displayedImage = sliderItems.find(".owl-item.active");

        title.text("");
        if (title.length && displayedImage.length) {
            var title = displayedImage.find('img').attr('alt');
            if (title) {
                title.text(title);
            }
        }
    },
    productMagnifImg: function (mainSlider) {
        if (mainSlider.length && mainSlider.closest('.js-product_gallery-images').data("zoom")) {
            var currentImage = mainSlider.find(".js-product_gallery-images-main-el");

            currentImage.each(function () {
                $(this).zoom({
                    url: $(this).attr('href'),
                    onZoomIn: function () {
                        $(this).parent().addClass("zooming");
                    },
                    onZoomOut: function () {
                        $(this).parent().removeClass("zooming");
                    }
                });
            });
        }
    },
    popupSwipebox: function () {
        $('body').on("click", ".js-image-popup-swipebox", function (e) {
            e.preventDefault();

            var imgFalleryProduct = $(this).closest('.js-product').find(".js-product_gallery-images"),
                items = $(this).closest('.js-product').find('.js-id-preview-gallery'),
                imgArrs = [],
                position = 0;

            if (items.length) {
                items.each(function (index) {
                    if ($(this).hasClass('selected')) {
                        position = index;
                    }
                    if ($(this).data('video')) {
                        imgArrs.push({
                            href: $(this).find('a').attr('href'),
                            icon: '<i class="fa fa-video-camera" aria-hidden="true"></i>'
                        });
                    } else {
                        imgArrs.push({ href: $(this).find('a').attr('href'), src: $(this).find('img').attr('src') });
                    }
                });
            } else {
                imgArrs.push({ href: $(this).attr('href'), src: $(this).find('img').attr('src') });
            }

            var thumbs = imgFalleryProduct.data("thumbs");
            var bgOpacity = imgFalleryProduct.data("black-bg");
            var sTop = 0;

            $.swipebox(imgArrs, {
                useSVG: false,
                hideBarsDelay: false,
                thumbs: thumbs,
                initialIndexOnArray: position,
                beforeOpen: function () {
                    sTop = $(document).scrollTop();
                },
                afterClose: function () {
                    $('body').removeClass("hidden-fixed");
                    $(window).scrollTop(sTop);
                },
                afterOpen: function () {
                    $('body').addClass("hidden-fixed");

                    if (bgOpacity === true) {
                        $('#swipebox-overlay').addClass('opacity-black');
                    }
                    if (thumbs === true && imgArrs.length > 1) {
                        var imgArrsThumbsHtml = '',
                            currentIndex = parseInt($('#swipebox-slider .slide.current').data("index"));
                        imgArrs.forEach(function (element, index) {
                            var addClass = "swipebox-thumbs_el js-swipebox-thumbs-el";
                            if (currentIndex === index) {
                                addClass += " active";
                            }
                            if (element.icon) {
                                imgArrsThumbsHtml += '<a class="' + addClass + ' swipebox-thumbs_el--icon" data-index="' + index + '" href="' + element.href + '">' + element.icon + '</a>';
                            } else {
                                imgArrsThumbsHtml += '<a class="' + addClass + '" data-index="' + index + '" href="' + element.href + '"><img src="' + element.src + '" ></a>';
                            }
                        });

                        $('#swipebox-container').append('<div id="swipebox-thumbs" class="swipebox-thumbs">' + imgArrsThumbsHtml + '</div>');
                        $('#swipebox-slider').css("padding-bottom", (parseInt($('#swipebox-thumbs').outerHeight()) + 30) + 'px');
                    }

                    if ((thumbs === true && imgArrs.length) || bgOpacity) {
                        $('#swipebox-bottom-bar').addClass("swipebox-bottom-bar--pos-center");
                        $('#swipebox-arrows').addClass("swipebox-arrows--pos-center");
                    }

                    var closeSwipe = function () {
                        var $closeButton = $("#swipebox-close");
                        if ($closeButton.length) {
                            $closeButton.trigger("click");
                        }
                        $(document).off("scroll", closeSwipe);
                    };

                    $('#swipebox-slider').on("click", closeSwipe);
                },

            });
            return false;
        });
    },
    popupSwipeImg: function () {
        $('body').on("click", ".pswp button", function (event) {
            event.preventDefault();
        });

        $('body').on("click", ".js-image-popup-photoswipe", function (e) {
            e.preventDefault();

            var mainGallery = $(this).closest('.js-product').find('.js-product_gallery-images'),
                items = $(this).closest('.js-product').find('.js-id-preview-gallery'),
                mainPhoto = $(this).closest('.js-product').find('.js-product_gallery-images-main-el'),
                pswpElement = document.querySelectorAll('.pswp')[0],
                position = 0,
                items = [];

            if (items.length) {
                items.each(function () {
                    var image = $(this);
                    if (image.hasClass('selected')) {
                        position = image.data('position');
                    }
                    if (image.data("video")) {
                        var iframeVideo = mainGallery.find('iframe');
                        if (iframeVideo.length) {
                            items.push({ html: '<iframe src="' + iframeVideo.attr("src") + '" width="' + iframeVideo.attr("width") + '" height="' + iframeVideo.attr("height") + '"></iframe>' });
                        }
                    } else {
                        items.push({ src: image.find('a').attr("href"), w: 0, h: 0 });
                    }
                });
            } else if (mainPhoto.length) {
                items.push({ src: mainPhoto.attr("href"), w: 0, h: 0 });
            }

            var options = {
                index: position,
                shareEl: false,
                history: false
            };

            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

            gallery.listen('gettingData', function (index, item) {
                if (item.w < 1 || item.h < 1) { // unknown size
                    var img = new Image();
                    img.onload = function () {
                        item.w = this.width;
                        item.h = this.height;
                        gallery.updateSize(true);
                    };
                    img.src = item.src;
                }
            });
            gallery.init();
        });
    }
};

var productViewGrid = {
    init: function () {
        var product = $('.js-Product-grid'), timeOut;

        product.hover(function () {
            var $this = $(this),
                prevProduct = $this.prev(),
                btn = $this.find('.js-button'),
                dialog = $this.find('.js-dialog');

            btn.css({ marginTop: "15px", opacity: 0 });

            $this.addClass('hover');
            btn.first().show();
            btn.first().animate({ marginTop: "0", opacity: 1 }, 300);
            timeOut = setTimeout(function () {
                btn.last().show();
                btn.last().animate({ marginTop: "0", opacity: 1 }, 150);
            }, 150);

            dialog.fadeIn();

            var img = $this.find('.js-product-preview-img');

        }, function () {
            var $this = $(this),
                prevProduct = $this.prev(),
                btn = $this.find('.js-button'),
                dialog = $this.find('.js-dialog');

            clearTimeout(timeOut);
            prevProduct.removeClass('next-hover');
            $this.removeClass('hover');
            btn.first().stop();
            btn.last().stop();
            btn.hide();
            dialog.hide();

            var img = $this.find('.js-product-preview-img');
            img.stop();
            img.removeAttr("style");

        });
    }
};

var menu = {
    init: function () {
        var _this = this;

        _this.respMenu();
        _this.flexMenu();
        _this.headerMenuHover();
    },
    respMenu: function () {
        var _this = this, items = $(".js-resp-nav-top");

        if (!items.length) {
            return false;
        }

        let headerItems = $('.header-top--links>.container>div');

        let widthMenu = 0;

        headerItems.each(function () {
            if (!$(this).hasClass('header-top_menu')) {
                widthMenu += parseInt($(this).width());
            }
        })

        //let widthMenu = parseInt($('.header-top_region').width()) + parseInt($('.header-top--right').width());

        $('.header-top_menu').width($('.header-top--links .container').width() - widthMenu);

        jQuery.each(items, function () {
            _this.resp($(this));
        });
    },
    flexMenu: function () {
        var _this = this, items = $(".js-resp-nav-top");

        if (!items.length) {
            return false;
        }

        jQuery.each(items, function () {
            _this.resp($(this));
        });

        $(window).resize(function () {
            _this.respMenu();
        });
    },
    resp: function (menu) {
        var _this = this,
            width = menu.width(),
            items = menu.children('.js-resp-nav-top-el'),
            Else = menu.find('.js-resp-nav-top-else'),
            ElseWidth = parseFloat(Else.removeClass('hide').outerWidth(true)),
            ElseSub = Else.find('.js-resp-subnav-else'),
            allItemsWidth = 0;

        Else.addClass('hide');
        ElseSub.html("");
        items.removeClass('hide');

        jQuery.each(items, function () {
            var $this = $(this),
                elWidth = parseFloat($this.outerWidth(true));

            if ((allItemsWidth + elWidth + ElseWidth) > width) {
                Else.removeClass('hide');
                $this.clone().appendTo(ElseSub);
                $this.addClass('hide');
            }
            allItemsWidth += $this.outerWidth(true);
        });
    },
    headerMenuHover: function () {
        var headerMenu = $('#header-nav'),
            mobileBtnShowHideMenu = $('.js-nav-button[data-id="' + headerMenu.attr("id") + '"]'),
            item = $('.juniq-header-top-nav-el');

        if (!mobileBtnShowHideMenu.is(':visible')) {
            item.hover(function () {

                var $this = $(this),
                    subMenuWrap = $this.children('.juniq-header_menu-nav-sub');

                subMenuWrap.css("padding-top", "15px");
                subMenuWrap.css("opacity", "0");
                subMenuWrap.show();
                subMenuWrap.animate({ paddingTop: "0", opacity: 1 }, 300);

            }, function () {
                var $this = $(this),
                    subMenuWrap = $this.children('.juniq-header_menu-nav-sub');

                subMenuWrap.hide();
            });
        }
    }
};

var phoneSearch = {
    init: function () {
        var btn = $('.js-show-Nav-search'),
            form = $('.js-Nav-search');

        btn.on("click", function () {
            if (form.is(":visible")) {
                form.removeClass('show');
                $(this).removeClass('active');
            } else {
                form.addClass('show');
                $(this).addClass('active');
            }
        });
    }
};

var tags = {
    init: function () {
        var _this = this;

        _this.showAll();
    },
    showAll: function () {
        var _this = this,
            btn = $('.js-open-tags');

        btn.on("click", function () {
            var $this = $(this),
                tags = $this.closest('.js-tags').find('.js-tag'),
                link = $this.find('.link-half');

            if ($this.hasClass('open')) {
                $this.removeClass('open');
                tags.addClass("hide");
                link.text('Развернуть');
            } else {
                $this.addClass('open');
                tags.removeClass("hide");
                link.text('Cвернуть');
            }
        });
    }
};

var tabs = {
    init: function () {
        var _this = this;

        _this.initactiveTab();
        _this.activeTab();
        _this.activeToTabContent();
    },
    activeTab: function () {
        var button = $('.js-tab'), tabContent = $('.js-tab-content');

        button.on("click", function () {
            var $this = $(this),
                contentOuterId = $this.data('tab-content');

            button.removeClass('selected');
            tabContent.removeClass('selected');

            $this.addClass('selected');
            $('#' + contentOuterId).addClass('selected');
        });
    },
    activeToTabContent: function () {
        var buttonMoveToTab = $('.js-motion-to-tab'),
            content = $('.js-tab-content');

        buttonMoveToTab.on("click", function (event) {
            event.preventDefault();

            var $this = $(this),
                tab = $('.js-tab'),
                selectedTabContent = $('#' + $this.data('tab-content')),
                thisTfb = $('.js-tab[data-tab-content="' + $this.data('tab-content') + '"]');

            tab.removeClass('selected');
            thisTfb.addClass('selected');
            content.removeClass('selected');
            selectedTabContent.addClass('selected');

            var top = selectedTabContent.offset().top - 50;
            $('html,body').animate({
                scrollTop: top
            }, 500);
        });
    },
    initactiveTab: function () {
        var tabsWrap = $('.js-tabs');

        if (tabsWrap.length) {
            tabsWrap.each(function () {
                var $this = $(this),
                    selectedTab = $this.find('.selected');

                if (!selectedTab.length) {
                    selectedTab = $this.find('.js-tab:first');
                }

                if (selectedTab.length) {
                    var tabContent = $('#' + selectedTab.data('tab-content'));

                    if (tabContent.length) {
                        selectedTab.addClass('selected');
                        tabContent.addClass('selected');
                    }
                }
            });
        }
    }
};

if (!window.productGridGallery) {

    productGridGallery = (function ($) {

        var productGridGallery = function (parameter) {
            this.init(parameter);
        };

        productGridGallery.prototype = {
            _config: {
                images: {}
            },
            init: function (parameter) {
                var that = this;
                if ($("body").hasClass("touch")) {
                    return false;
                }
                that.params = $.extend({}, that._config, parameter);
                that.launchGallery();
            },
            launchGallery: function () {
                var items = $('.js-grid-gallery');
                items.each(function () {
                    var item = $(this),
                        box = item.find(".js-grid-block-gallery"),
                        img = item.find(".js-product-preview-img");

                    if (!img.data("src")) {
                        img.attr("data-src", img.attr("src"))
                    }

                    item.find(".js-grid-gallery-item").on("mouseenter", function () {
                        var src = $(this).data("img");
                        $('<img>').attr('src', src).load(function () {
                            img.attr("src", src);
                        });
                        let _this = $(this);
                        let id = _this.attr('data-id')
                        let wrap = _this.closest('.Product-grid');

                        if (!wrap.length) {
                            wrap = _this.closest('.Product__Item');
                        }
                        wrap.find('.dotted-img__item').each(function () {
                            if ($(this).attr('data-id') == id) {
                                $(this).addClass('-Active');
                            } else {
                                $(this).removeClass('-Active');
                            }
                        });
                    });

                    var src_default = img.data("src");

                    box.on("mouseleave", function () {
                        img.attr("src", src_default);
                    });
                });
            }
        };
        return productGridGallery;
    })(jQuery);
}

var main = {
    init: function () {
        var _this = this;

        _this.scrollToTop();
        _this.languageChange();
        _this.autoSearch();
        _this.inputCount();
        _this.viewFullPlugins();
        // _this.menuDelay();
    },
    scrollToTop: function () {
        var btnScrollToTop = $('#move-to-top'), contentTop = $('.js-moved-content');

        if (contentTop.length && btnScrollToTop.length) {
            $(window).scroll(function () {
                var t = $(document).scrollTop();
                var contentTopX = contentTop.offset().top;
                if (t >= contentTopX) {
                    btnScrollToTop.fadeIn();
                } else {
                    btnScrollToTop.fadeOut();
                }
            });

            btnScrollToTop.click(function (event) {
                event.preventDefault();

                $('html,body').animate({
                    scrollTop: 0
                }, 500);
            });
        }

    },
    languageChange: function () {
        $(".js-language").on("click", function (event) {
            event.preventDefault();

            var url = location.href;
            if (url.indexOf('?') == -1) {
                url += '?';
            } else {
                url += '&';
            }
            location.href = url + 'locale=' + $(this).data("value");
        });
    },
    autoSearch: function () { // баг
        var input = $('.js-ajax-search');

        // $('.js-ajax-search-result').resize(function() {
        //     input.closest('.inp-search').siblings('.inp-search--wrap').height(40 + $('.js-ajax-search-result').height() + 20);
        // });

        input.on("keyup", function () {
            var $this = $(this),
                value = $this.val(),
                form = $this.closest('form'),
                url = form.attr("action"),
                outerBlockResult = form.find('.js-ajax-search-result');

            if (value.length > 3) {
                $.get(url + '?query=' + value + '&ajax=1', function (data) {
                    var content = $(data).find('.js-ajax-search');
                    outerBlockResult.html("");
                    if (content.length) {
                        outerBlockResult.show();
                        outerBlockResult.html(content);
                        $('.Nav-search').css('box-shadow', '0 2px 8px 0 rgb(0 0 0 / 16%)');
                        $('.ajax-search-result').css('box-shadow', 'rgb(0 0 0 / 16%) 0px 8px 8px 0px');
                    } else {
                        $('.Nav-search').css('box-shadow', 'none');
                        $('.ajax-search-result').css('box-shadow', 'none');
                        outerBlockResult.hide();
                    }
                });
            }
        });

        $('body').click(function (e) {
            var popup = $(".js-ajax-search-result");
            if (!$('.js-ajax-search').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
                $('.Nav-search').css('box-shadow', 'none');
                $('.ajax-search-result').css('box-shadow', 'none');
                popup.hide();
            }
        });
    },
    inputCount: function () {
        $('body').on("keyup", ".js-number", function () {
            var reg_number = /[^0-9]/g;

            $(this).val($(this).val().replace(reg_number, ''));
        });
    },
    viewFullPlugins: function () {
        var outer = $('.js-nav-sidebar-wrap');

        outer.each(function () {
            if ($(this).find(".menu-v li:hidden").length) {
                button = $(this).find('.js-nav-sidebar-show');
                button.removeClass('hide');

                button.on("click", function () {
                    var hideElements = $(this).closest('.js-nav-sidebar-wrap').find(".menu-v li:hidden, .menu-v li.show");

                    hideElements.toggleClass("show");
                    $(this).find('.js-icon-plus, .js-icon-minus').toggleClass("hide");
                });
            }
        });
    },
};

var ddFooterCol = {
    init: function () {
        var _this = this;

        if ($('.js-footer-col').length > 0) {
            _this.addIcon();
            _this.toggleDisplay();
        }
    },
    addIcon: function () {
        const titleBox = $('.js-footer-col').find('.footer-col-title');
        const bottomArrow = $('<i class="fi-rr-angle-small-down"></i>')

        titleBox.append(bottomArrow);
    },
    toggleDisplay: function () {
        const titleBox = $('.js-footer-col').find('.footer-col-title');

        titleBox.on('click', function () {
            const col = $(this).closest('.js-footer-col');
            const menu = col.find('.footer-col__list');
            const thisOpened = !$(this).closest('.js-footer-col').hasClass('-list-hide');
            if (thisOpened) {
                $(this).closest('.js-footer-col').find('.rotate180').removeClass('rotate180');
                $(this).closest('.js-footer-col').addClass('-list-hide');
            } else {
                $('.js-footer-col').addClass('-list-hide');
                $('.js-footer-col').find('.rotate180').removeClass('rotate180')

                col.toggleClass('-list-hide');
                col.find('i.fi-rr-angle-small-down').toggleClass('rotate180');
            }
        })
    }
};

var filterSearch = {
    init: function () {
        var _this = this;

        if ($('.filter__search__in-template').length > 0) {
            _this.findFilter();
            _this.addWrapperClass();
        }
    },
    findFilter() {
        var _this = this;

        $('.filter__search__in-template input').on('input', function () {
            // if ($(this).val().length < 1) {
            //     return;
            // }
            const desiredText = $(this).val().toLowerCase();
            const parent = $(this).closest('.filter-el');

            _this.findTitle(desiredText, parent);
        })
    },
    findTitle(text, parent) {
        var _this = this;
        const filtersTitleBox = parent.find('.filter-el_opts-el');

        filtersTitleBox.each(function () {
            titleText = $(this).text().trim().toLowerCase();
            if (titleText.includes(text)) {
                $(this).fadeIn();
            } else {
                $(this).fadeOut();
            }
        })
    },
    addWrapperClass() {
        $('.filter__search__in-template').closest('.js-filter-el').addClass('hasSearch');
    }
}

var navDdPosition = {
    init: function () {
        var _this = this;

        if ($('.Nav__horizontal--item--relative').length > 0) {
            _this.assignPosition();
        }
    },
    assignPosition() {
        var _this = this;
        $('.Nav__horizontal--list li').each(function () {
            const elem = $(this);
            _this.addPositionClass(elem);
        })
    },
    addPositionClass(elem) {
        var _this = this;
        const position = _this.getPosition(elem);
        elem.find('.Nav__horizontal--list-3').addClass(`Nav__horizontal--list-3--${position}`);
    },
    getPosition(elem) {
        const screenWidth = window.outerWidth;
        const xPositionElem = elem[0].getBoundingClientRect().x;
        if (xPositionElem > screenWidth / 2) {
            return 'right';
        } else {
            return 'left';
        }
    }
}

var stickyHeader = {
    init: function () {
        var _this = this;

        if (!isMobileVersion() && $('.stickyOn').length > 0) {
            _this.onScroll();
        }
    },
    onScroll() {
        var _this = this;
        const headerHeight = $('body > header.header').height() + $('body > .header-top--links').height();

        $(window).scroll(function () {
            const sticky = $('body > header.header').hasClass('sticky');

            if (window.pageYOffset > headerHeight && !sticky) {
                $('.header-top--links').css('padding-bottom', `${headerHeight}px`);
                $('body > header.header').addClass('sticky');
                $('body > header.header').attr('style', `top: -${headerHeight}px`)
                setTimeout(() => {
                    $('body > header.header').attr('style', `top: 0px`);
                }, 300)
            }
            if (window.pageYOffset < headerHeight && sticky) {
                $('body > header.header').removeClass('sticky');
                $('body > header.header').removeAttr('style');
                $('.header-top--links').removeAttr('style');
            }
        });
    }
}

var hideDdItemTwo = {
    init: function () {
        _this = this;
        if (!isMobileVersion()) {
            _this.toggleHide();
        }
    },
    toggleHide: function () {
        $('.Nav__horizontal--item').on('mouseenter', function () {
            $('.Nav__horizontal--list-2').attr('style', 'display:flex')
        })
        $('.Nav__horizontal--item').on('mouseleave', function () {
            $('.Nav__horizontal--list-2').attr('style', 'display:none')
        })
    }
}

var showContantBox = {
    init: function () {
        _this = this;
        if (isMobileVersion()) {
            _this.onBtn();
        }
    },
    onBtn() {
        $('.js-show-contact-box').on('click', () => {
            $('#js-contacts-box').toggleClass('contacts--show');
        })
    }
}

var haederBurger = {
    init: function () {
        _this = this;
        if (isMobileVersion()) {
            _this.showMobileMenu();
        }
    },
    showMobileMenu() {
        $('#header-burger').on('click', () => {
            $('.fixed-panel .MobileMenu-btn').click();
        })
    }
}

const isMobileVersion = function () {
    if ($('body').hasClass('mobile')) {
        return true;
    } else {
        return false;
    }
}

const fixedAdd2Cart = {
    init() {
        if ($('.js-fixed-add2cart-panel').length) {
            const _this = this;
            _this.fixedOn();
            _this.buy();
        }
    },
    fixedOn() {
        const _this = this;
        const blockPos = _this.getBottomPointProductActions();
        $(window).on('scroll', function () {
            const wrap = $('.js-fixed-add2cart-panel');
            const classActive = 'fixed-add2cart-panel';
            const scrollPos = $(window).scrollTop();

            if (scrollPos > blockPos) {
                if (!wrap.hasClass(classActive)) {
                    _this.removeContent();
                    _this.appendContent();
                }
            } else {
                if (wrap.hasClass(classActive)) {
                    wrap.removeClass(classActive);
                }
            }
        });
    },
    getBottomPointProductActions() {
        const productActions = document.querySelector('.product-actions');
        const productActionsRect = productActions.getBoundingClientRect();
        const productActionsBottom = productActionsRect.bottom + window.pageYOffset;
        return productActionsBottom;
    },
    removeContent() {
        $('.js-fixed-add2cart-panel').find('.product_prices').remove();
    },
    appendContent() {
        const htmlPrice = $('.product-actions').find('.product_prices').clone();
        $('.js-fixed-add2cart-panel').addClass('fixed-add2cart-panel');
        $('.js-fixed-add2cart-panel').prepend(htmlPrice);
    },
    buy() {
        const _this = this;
        const btnBuy = $('.js-fixed-add2cart-panel').find('.button');
        btnBuy.on('click', function () {
            _this.trackAddedClass()
            $('.product-actions').find('.button').trigger('click');
        })
    },
    trackAddedClass() {
        const element = $('.product-actions').find('.button');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // Проверяем наличие класса 'added'
                    if (element.hasClass('added')) {
                        const btnBuy = $('.js-fixed-add2cart-panel').find('.button');
                        btnBuy.addClass('added');
                        btnBuy.text(element.text());
                        // Останавливаем отслеживание
                        observer.disconnect();
                    }
                }
            });
        });

        // Начинаем отслеживание изменений атрибутов элемента
        observer.observe(element[0], { attributes: true });
    }
}

function Product(form, options, skus = false) {
    this.formWrap = $(form);
    this.add2cart = this.formWrap.find(".js-add2cart");
    this.button = this.add2cart.find(".js-submit-form");
    this.wrapQty = this.formWrap.find('.js-qty');
    this.buyActionsWrap = this.formWrap.find(".button-one-click__wrap");
    this.skFastButton = this.formWrap.find(".js-sk-oneclick-open");
    this.wrapFastButton = this.formWrap.find(".product_one-click__wrap");
    this.discount = this.formWrap.closest('.js-product-page').find(".js-product-discount");
    this.savedWrap = this.formWrap.closest('.js-product-page').find(".js-product-discounts");
    this.isSkuUrl = this.formWrap.data("sku-url");
    for (var k in options) {
        this[k] = options[k];
    }
    var self = this;

    // add to cart block: services

    this.formWrap.find(".services input[type=checkbox]").change(function () {
        var obj = $('select[name="service-option[' + $(this).val() + ']"]');
        if (obj.length) {
            if ($(this).is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
        }
        self.cartButtonVisibility(true);
        self.updatePrice();
    });

    this.formWrap.find(".services .service-option").on('change', function () {
        self.cartButtonVisibility(true);
        self.updatePrice();
    });

    this.formWrap.find('.select-v-inline a').click(function () {
        var d = $(this).closest('.select-v-inline');
        d.find('a.selected').removeClass('selected');
        $(this).addClass('selected');
        d.find('select.js-feature-sku, input.js-feature-sku').val($(this).data('value')).change();
        return false;
    });

    this.formWrap.find(".skus input[type=radio], .skus select").change(function () {
        if ($(this).find('option').length) {
            var sku = $(this).find('option:selected');
        } else {
            var sku = $(this);
        }

        if (sku.data('image-id')) {
            $("#product-image-" + sku.data('image-id')).click();
        }
        if (sku.data('disabled')) {
            self.button.addClass('disabled');
            self.skFastButton.addClass('disabled');
        } else {
            self.button.removeClass('disabled');
            self.skFastButton.removeClass('disabled');
        }

        var sku_id = sku.attr('value');
        self.checkQtyProduct(sku_id, skus);
        self.updateSkuServices(sku_id);
        self.cartButtonVisibility(true);
        self.updatePrice();
        if (self.isSkuUrl) {
            self.updateURLSku(sku_id);
        }

        if (window.skuImagesData) {
            // Обновление изображений при смене артикула
            self.updateImagesForSku(sku_id);
        }
    });

    if ($('.skus input[type=radio]').length) {
        var $initial_cb = this.formWrap.find(".skus input[type=radio]:checked:not(:disabled)");
        if (!$initial_cb.length) {
            $initial_cb = this.formWrap.find(".skus input[type=radio]:not(:disabled):first").prop('checked', true).click();
        }
        $initial_cb.change();
    } else if ($('.skus option').length) {
        var $initial_cb = this.formWrap.find(".skus option:selected:not(:disabled)");
        if (!$initial_cb.length) {
            $initial_cb = this.formWrap.find(".skus option:not(:disabled):first").prop('selected', true).click();
        }
        $initial_cb.change();
    }

    if (typeof $initial_cb !== 'undefined' && $initial_cb.length && $initial_cb.data('image-id')) {
        itemGallery.changeBigImg($("#product-image-" + $initial_cb.data("image-id")));
    }

    this.formWrap.find("select.js-feature-sku, input.js-feature-sku").change(function () {
        var key = "";
        self.formWrap.find("select.js-feature-sku, input.js-feature-sku").each(function () {
            key += $(this).data('feature-id') + ':' + $(this).val() + ';';
        });
        var sku = self.features[key];
        if (sku) {
            self.checkQtyProduct(sku.id, skus);
        }
        if (sku) {
            if (sku.image_id) {
                itemGallery.changeBigImg($("#product-image-" + sku.image_id));
            }
            self.updateSkuServices(sku.id);
            if (sku.available) {
                self.button.removeClass('disabled');
                self.skFastButton.removeClass('disabled');
            } else {
                self.formWrap.find("div.stocks div").hide();
                self.formWrap.find(".sku-no-stock").show();
                self.button.addClass('disabled');
                self.skFastButton.addClass('disabled');
            }
            self.add2cart.find(".price").data('price', sku.price);
            self.updatePrice(sku.price, sku.compare_price);
            if (self.isSkuUrl) {
                self.updateURLSku(sku.id);
            }

            if (window.skuImagesData) {
                self.updateImagesForSku(sku.id);
            }
        } else {
            self.formWrap.find("div.stocks div").hide();
            self.formWrap.find(".sku-no-stock").show();
            self.button.addClass('disabled');
            self.skFastButton.addClass('disabled');
            self.add2cart.find(".js-compare-at-price").hide();
            self.add2cart.find(".price").empty();
        }
        self.cartButtonVisibility(true);
    });

    this.formWrap.find("select.js-feature-sku:first, input.js-feature-sku:first").change();

    if (!this.formWrap.find(".skus input:radio:checked").length) {
        this.formWrap.find(".skus input:radio:enabled:first").attr('checked', 'checked');
    }

    if (!this.formWrap.find(".skus option:selected").length) {
        this.formWrap.find(".skus option:enabled:first").attr('selected', 'selected');
    }
    self.showAllSkus();
    self.removeDivider();
    self.updateArrivedBtn();
    this.updateQtyBox();
    this.updateBuyActionWrap();
    this.showMaxCountErrorModal();
    this.setTriggerUpdatePrice();
    if (Object.keys(skus).length > 1) {
        this.updateFeatures(options);
    }
    if ($('.product-total').length > 0) {
        this.updateTotalPrice();
    }
    if ($('.product_bonus').length > 0) {
        this.updateBonusTotal();
    }
}

// Добавим методы для обновления изображений
Product.prototype.updateImagesForSku = function (skuId) {
    var skuImagesData = window.skuImagesData || {};
    // if (!skuImagesData[skuId]) return;
    var images = skuImagesData[skuId] || skuImagesData['default']; // Получаем изображения для артикула или дефолтные изображения, если артикул не имеет собственных изображений
    $('.js-product_gallery-images-main').trigger('destroy.owl.carousel');
    $('.js-product_gallery-images-main').removeClass('owl-loaded');
    $('.js-product_gallery-images-main').find('.owl-stage-outer').children().unwrap();
    $('.js-product_gallery-images-main').removeData();
    
    this.updateThumbnailGallery(images);
    this.updateMainImage(images);
    
    // Реинициализация слайдера
    // itemGallery.init();
    if (typeof window.reinitSliderProductOnMobile === "function") {
        window.reinitSliderProductOnMobile();
    }
}

Product.prototype.updateThumbnailGallery = function(images) {
    // console.log(images);
    var gallery = $('#product-gallery .image-preview-list');
    gallery.empty(); // Очищаем текущую галерею

    images.forEach(function(image, index) {
        var thumbnailHtml = '<div data-id="' + image.image_id + '" data-position="' + index + '" class="js-id-preview-gallery image-preview">' +
                            '<a id="product-image-' + image.image_id + '" href="' + image.url_full + '">' +
                            '<img src="' + image.url_thumbnail + '" alt="">' +
                            '</a></div>';
        gallery.append(thumbnailHtml);
    });
};

Product.prototype.updateMainImage = function (images) {
    var mainImageBlock = $('.js-product_gallery-images-main');
    var isMobile = $('body').hasClass('mobile'); // Проверяем, является ли версия мобильной
    mainImageBlock.empty(); // Очищаем текущие изображения

    images.forEach(function (image, index) {
        var mainImageHtml;
        
        if (isMobile) {
            mainImageHtml = '<span class="product_gallery-images-main-el-outer">' +
                '<a data-id="' + image.image_id + '" itemprop="image" class="product_gallery-images-main-el js-product_gallery-images-main-el js-popup-photoswipe" href="' + image.url_full + '" data-position="' + index + '" data-pswp-width="650" data-pswp-height="650">' +
                '<img class="product_gallery-images-main-img" alt="Дрель Bosch GSB 19-2 RE" title="Дрель Bosch GSB 19-2 RE" src="' + image.url_main + '">' +
                '</a></span>';
        } else {
            mainImageHtml = '<span class="product_gallery-images-main-el-outer">' +
                '<a data-id="' + image.image_id + '" data-position="' + index + '" class="product_gallery-images-main-el js-product_gallery-images-main-el js-image-popup-swipebox" href="' + image.url_full + '" style="position: relative; overflow: hidden;">' +
                '<img src="' + image.url_main + '" class="product_gallery-images-main-img">' +
                '<img role="presentation" alt="" src="' + image.url_full + '" class="zoomImg" style="position: absolute; top: 4.36989px; left: -119.119px; opacity: 0; width: 700px; height: 700px; border: none; max-width: none; max-height: none;">' +
                '</a></span>';
        }

        mainImageBlock.append(mainImageHtml);
    });
};

Product.prototype.resetServices = function () {
    $('.js-style-check-input').each(function () {
        if ($(this).is(':checked')) {
            //$(this).trigger('click')
        }
    });
}

Product.prototype.setTriggerUpdatePrice = function () {
    $('.js-feature-sku, select.js-product-skus, [name="quantity"]').on('change', function () {
        $(document).trigger('priceUpdated');
    })
    $('.js-product-skus li').on('click', function () {
        $(document).trigger('priceUpdated');
    });
}

Product.prototype.updateTotalPrice = function () {
    $(document).on('priceUpdated', function () {
        setTimeout(function () {
            const price = parseInt($('.product__price.price').text()) * $('[name="quantity"]').val();
            const currency = $('.product__price.price').find('span').clone();
            $('.product-total').text(` ${price.toLocaleString()} `);
            $('.product-total').prepend($('<span class="product-total__text">Итого:</span>'));
            $('.product-total').append(currency);
        }, 1);
    });
};

Product.prototype.updateBonusTotal = function () {
    $(document).on('priceUpdated', function () {
        setTimeout(function () {
            const price = parseInt($('.product__price.price').text()) * $('[name="quantity"]').val();
            const cfStr = $('.product_bonus').data('cf').toString().replace(',', '.');
            const cf = parseFloat(cfStr);
            const totalBonus = price * cf;
            $('.product_bonus .product_bonus__num').text(totalBonus);
        }, 1);
    });
};

Product.prototype.serviceVariantHtml = function (id, name, price) {
    return $('<option data-price="' + price + '" value="' + id + '"></option>').text(name + ' (+' + this.currencyFormat(price, 1) + ')');
};

Product.prototype.getEscapedText = function (bad_string) {
    return $("<div>").text(bad_string).html();
};

Product.prototype.cartButtonVisibility = function (visible) {
    if (visible) {
        this.add2cart.find('.js-compare-at-price').show();
        this.add2cart.find('input[type="submit"]').show();
        this.add2cart.find('.price').show();
        this.add2cart.find('.js-qty').show();
        this.add2cart.find('span.added2cart').hide();
    }
};

Product.prototype.checkQtyProduct = function (id, skus) {
    let maxCount = getMaxCount();
    const _this = this;
    checkedBlocked();
    $('.js-qty input').on('change', function () {
        checkedBlocked();
    });

    function checkedBlocked() {
        maxCount = getMaxCount();
        $('.js-submit-form').removeAttr('data-max-count');
        $('.js-submit-form').removeClass('blocked');
        valueQty = $('.js-qty input').val();
        if (valueQty > maxCount) {
            $('.js-submit-form').attr('data-max-count', maxCount);
            $('.js-submit-form').addClass('blocked');
        }
    }

    function getMaxCount() {
        if (skus[`${id}`] == 'mnogo') {
            return Number.MAX_SAFE_INTEGER;
        } else {
            return parseInt(skus[`${id}`]);
        }
    }
};

Product.prototype.showMaxCountErrorModal = function () {
    $('.product_add-services .addtocart').on('click', function (e) {
        if ($(this).hasClass('blocked')) {
            e.stopPropagation();
            const modal = $(`<div class="modal__wrap"><div class="modal"><div class="modal__text">Максимально допустимое количество товара к покупке: ${$('.addtocart.blocked').data('max-count')}</div><div class="modal__closed">✕</div></div></div>`);
            $('body').append(modal);

            $(document).on('click', function (e) {
                if ($(e.target).hasClass('modal__wrap') || $(e.target).hasClass('modal__closed')) {
                    $('body>.modal__wrap').remove();
                }
            });
        }
    });
};

Product.prototype.updateFeatures = function (options) {
    if ($('.js-product-skus').length == 0) {
        const key = getKey();
        const id = options.features[key].id;
        showFeatures(id);
    } else {
        const id = getKey();
        showFeatures(id);
    }

    $('.js-feature-sku').on('change', function () {
        const key = getKey();
        const id = options.features[key].id;
        showFeatures(id);
    });
    $('select.js-product-skus').on('change', function () {
        const id = $(this).find('option:selected').attr('value');
        showFeatures(id);
    });
    $('.js-product-skus li').on('click', function (e) {
        if ($(e.target).hasClass('js-toggle-styler-input')) {
            const id = $(this).find('input').attr('value');
            showFeatures(id);
        }
    });

    function showFeatures(id) {
        $('.Product__features').css('display', 'none');
        $(`.Product__features[data-features-id="${id}"]`).css('display', 'table');
    }

    function getKey() {
        let key = "";
        if ($('.product-page .pd_option_select').length > 0) {
            let iteration = 0;
            $('.pd_option_select').each(function () {
                iteration++;
                const id = $(this).find('.js-feature-sku').data('feature-id');
                const value = $(this).find('option:selected').attr('value');
                key += `${id}:${value};`;
            });
        }
        if ($('.product-page .select-v-inline').length > 0) {
            let iteration = 0;
            $('.select-v-inline').each(function () {
                iteration++;
                const id = $(this).find('.js-feature-sku').data('feature-id');
                const value = $(this).find('.selected').attr('data-value');
                key += `${id}:${value};`;
            });
        }
        if ($('.js-product-skus').length > 0) {
            if ($('.js-product-skus').hasClass('md')) {
                key = $('.js-product-skus').find('option[selected="selected"]').attr('value');
            } else {
                key = $('.js-product-skus').find('.checked').find('input').attr('value');
            }
        }
        return key;
    }
};

Product.prototype.updateFastOrderBtn = function () {
    if ($('.quickorder-button').length > 0) {
        if ($('.product_add-services--box').find('.js-submit-form').hasClass('disabled')) {
            this.wrapFastButton.fadeOut();
        } else {
            this.wrapFastButton.fadeIn();
        }
    }
};

Product.prototype.updateURLSku = function (sku_id) {
    var key_name = "sku";
    var search_object = stringToObject(window.location.search.substring(1));

    if (sku_id) {
        search_object[key_name] = sku_id;
    } else {
        delete search_object[key_name];
    }

    var search_string = objectToString(search_object);
    var new_URL = location.origin + location.pathname + search_string + location.hash;

    if (typeof history.replaceState === "function") {
        history.replaceState(null, document.title, new_URL);
    }

    function stringToObject(string) {
        var result = {};

        string = string.split("&");

        $.each(string, function (i, value) {
            if (value) {
                var pair = value.split("=");
                result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] ? pair[1] : "");
            }
        });

        return result;
    }

    function objectToString(object) {
        var result = "",
            array = [];

        $.each(object, function (key, value) {
            array.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        });

        if (array.length) {
            result = "?" + array.join("&");
        }

        return result;
    }
};

Product.prototype.currencyFormat = function (number, no_html) {
    var i, j, kw, kd, km;
    var decimals = this.currency.frac_digits;
    var dec_point = this.currency.decimal_point;
    var thousands_sep = this.currency.thousands_sep;

    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ",";
    }
    if (thousands_sep == undefined) {
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    kd = (decimals && (number - i) ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

    var number = km + kw + kd;
    var s = no_html ? this.currency.sign : this.currency.sign_html;
    if (!this.currency.sign_position) {
        return s + this.currency.sign_delim + number;
    } else {
        return number + this.currency.sign_delim + s;
    }
};

Product.prototype.updateSkuServices = function (sku_id) {
    let pdCodeBox = $('.pd-code__box');
    if (pdCodeBox.find(".js-pd-code").length > 0) {
        pdCodeBox.find(".js-pd-code").hide();
        pdCodeBox.find(".sku-" + sku_id + "-pd-code").show();
    }

    this.formWrap.find("div.stocks>div").hide();
    this.formWrap.find(".sku-" + sku_id + "-stock").show();
    for (var service_id in this.services[sku_id]) {
        var v = this.services[sku_id][service_id];
        if (v === false) {
            this.formWrap.find(".service-" + service_id).hide().find('input,select').attr('disabled', 'disabled').removeAttr('checked').trigger('refresh');
            this.formWrap.find(".service-" + service_id).find(".js-style-check, label").addClass("disabled");
        } else {
            this.formWrap.find(".service-" + service_id).show().find('input').removeAttr('disabled').trigger('refresh');
            this.formWrap.find(".service-" + service_id).find(".js-style-check, label").removeClass("disabled");
            if (typeof (v) == 'string' || typeof (v) == 'number') {
                this.formWrap.find(".service-" + service_id + ' .service-price').html(this.currencyFormat(v));
                this.formWrap.find(".service-" + service_id + ' input').data('price', v);
            } else {
                var select = this.formWrap.find(".service-" + service_id + ' .service-option');
                var selected_variant_id = select.val();
                for (var variant_id in v) {
                    var obj = select.find('option[value=' + variant_id + ']');
                    if (v[variant_id] === false) {
                        obj.hide().addClass("disable");
                        if (obj.attr('value') == selected_variant_id) {
                            selected_variant_id = false;
                        }
                    } else {
                        if (!selected_variant_id) {
                            selected_variant_id = variant_id;
                        }
                        obj.replaceWith(this.serviceVariantHtml(variant_id, v[variant_id][0], v[variant_id][1]));
                    }
                }
                if (!selected_variant_id) {
                    selected_variant_id = this.form.find(".service-" + service_id + ' .service-option').find("option:not(.disable):first").attr("value");
                }
                this.formWrap.find(".service-" + service_id + ' .service-option').val(selected_variant_id);
            }
        }
    }
};

Product.prototype.updatePrice = function (price, compare_price) {
    var input_checked = this.formWrap.find(".skus input:radio:checked, .skus option:selected");
    if (price === undefined) {
        if (input_checked.length) {
            var price = parseFloat(input_checked.data('price'));
            var compare_price = parseFloat(input_checked.data('compare-price'));
        } else {
            if ($('.product__header .product-card_discounts').data('compare')) {
                var compare_price = parseFloat($('.product__header .product-card_discounts').data('compare'));
            }
            var price = parseFloat(this.add2cart.find(".price").data('price'));
        }
    }

    if (compare_price && price) {
        if (!this.add2cart.find(".js-compare-at-price").length) {
            this.add2cart.find(".price").after('<span class="js-compare-at-price product__old-price old-price nowrap"></span>');
        }
        this.add2cart.find(".js-compare-at-price").html(this.currencyFormat(compare_price)).show();
    } else {
        this.add2cart.find(".js-compare-at-price").html("");
    }
    var self = this;
    this.formWrap.find(".services input:checked").each(function () {
        var s = $(this).val();
        if (self.formWrap.find('.service-' + s + '  .service-option').length) {
            price += parseFloat(self.formWrap.find('.service-' + s + '  .service-option :selected').data('price'));
        } else {
            price += parseFloat($(this).data('price'));
        }
    });

    var $priceWrap = this.add2cart.find(".price");
    var priceFormat = this.currencyFormat(price);
    var textZeroPrice = $priceWrap.data("zero-text");
    if (price == 0 && textZeroPrice) {
        $priceWrap.html('<span class="product_nul-price">' + textZeroPrice + '</span>');
    } else {
        $priceWrap.html(priceFormat);
    }

    self.updateDiscount(price, compare_price);
    self.updateSaved(price, compare_price);

    if (!self.button.hasClass('disabled')) {
        if (price == 0 && self.button.data('zero-price-disabled')) {
            self.button.addClass('disabled');
            self.skFastButton.addClass('disabled');
        } else {
            self.button.removeClass('disabled');
            self.skFastButton.removeClass('disabled');
        }
    }

    this.updateArrivedBtn();
    this.updateFastOrderBtn();
    this.updateQtyBox();
    this.updateBuyActionWrap();
};

Product.prototype.updateArrivedBtn = function () {
    if ($('.plugin_arrived-button').length > 0) {
        if ($('.product-actions').find('.js-submit-form').hasClass('disabled')) {
            $('.plugin_arrived-button').fadeIn();
        } else {
            $('.plugin_arrived-button').fadeOut();
        }
    }
};

Product.prototype.updateQtyBox = function () {
    if ($('.product_add-services--box').find('.js-submit-form').hasClass('disabled')) {
        this.wrapQty.fadeOut();
    } else {
        this.wrapQty.fadeIn();
    }
};

Product.prototype.updateBuyActionWrap = function () {
    if ($('.product_add-services--box').find('.js-submit-form').hasClass('disabled')) {
        this.buyActionsWrap.fadeOut();
    } else {
        this.buyActionsWrap.fadeIn();
    }
};

Product.prototype.showAllSkus = function () {
    $("body").on("click", ".js-product-skus-show", function () {
        var $this = $(this), outerWrap = $this.closest(".js-product-skus");

        outerWrap.find(".js-product-skus-item").toggleClass("hide");
        $this.find(".js-icon-minus").toggleClass("hide");
        $this.find(".js-icon-plus").toggleClass("hide");
    });
};

Product.prototype.updateDiscount = function (price, compare_price) {
    if (this.discount.length) {
        var discount = 0,
            typeRound = this.discount.data('round'),
            minimal = parseInt(this.discount.data('minimal'));

        this.discount.addClass('-Close');
        this.discount.closest('.product-card_discounts').addClass('-Close');
        if (compare_price > price && price > 0) {
            discount = ((compare_price - price) / compare_price) * 100;
            if (typeRound == "ceil") {
                discount = Math.ceil(discount);
            } else if (typeRound == "floor") {
                discount = Math.floor(discount);
            } else {
                discount = Math.round(discount);
            }
            if (discount >= minimal) {
                this.discount.html('-' + discount + '%').removeClass('-Close');
                this.discount.closest('.product-card_discounts').removeClass('-Close');
            }
        }
    }
};

Product.prototype.updateSaved = function (price, compare_price) {
    if (this.savedWrap.length) {

        this.savedWrap.addClass('-Close');
        if (compare_price > price && price > 0) {
            var saved = price - compare_price;

            this.savedWrap.html(this.currencyFormat(saved)).removeClass('-Close');
        }
    }
};

Product.prototype.removeDivider = function () {
    $('.Product__features-item').each(function () {
        const featuresIndex = $(this).data('index');
        if ($(this).hasClass('divider') && $(`.Product__features-item[data-index='${featuresIndex - 1}']`).hasClass('divider')) {
            $(`.Product__features-item[data-index='${featuresIndex - 1}']`).hide();
        }
    });
};


$(function () {
    main.init();
    tabs.init();
    tabsAcc.init();
    formFunc.init();
    formSelectList.init();
    menu.init();
    slider.init();
    formModal.init();
    ddBox.init();
    categoriesMainMenu.init();
    mobileMenuBtn.init();
    phoneSearch.init();
    phoneSbar.init();
    fixedPanel.init();
    tags.init();
    freeCallback.init();
    cart.init();
    productViewGrid.init();
    productViewListCustom.init();
    listHome.init();
    productsSlider.init();
    videoModal.init();
    lazyLoadImg.init();
    itemsViewList.init();
    cookieMessage.init($('.js-head-info-massage'));
    attentionMessage.init()
    catImgs.init();
    fixOrder.init();
    itemGallery.init();
    ddFooterCol.init();
    filterSearch.init();
    navDdPosition.init();
    stickyHeader.init();
    hideDdItemTwo.init();
    showContantBox.init();
    haederBurger.init();
    fixedAdd2Cart.init();
    new productGridGallery();
    editLinkBoxCategory.init();
});

$.fn.elementRealWidth = function () {
    $clone = this.clone()
        .css("visibility", "hidden")
        .appendTo($('body'));
    var $width = $clone.outerWidth(true);
    $clone.remove();
    return $width;
};

jQuery.fn.outerHTML = function (s) {
    return s ?
        this.before(s).remove() :
        jQuery("<p>").append(this.eq(0).clone()).html();
};

function checkTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};

function viewport() {
    var e = window,
        a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {
        width: e[a + 'Width'],
        height: e[a + 'Height']
    };
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

void 0 === jQuery.migrateMute && (jQuery.migrateMute = !0),
    function (t, e, i) {
        function n(i) {
            var n = e.console;
            o[i] || (o[i] = !0, t.migrateWarnings.push(i), n && n.warn && !t.migrateMute && (n.warn("JQMIGRATE: " + i), t.migrateTrace && n.trace && n.trace()))
        }

        function s(e, s, o, a) {
            if (Object.defineProperty) try {
                return Object.defineProperty(e, s, {
                    configurable: !0,
                    enumerable: !0,
                    get: function () {
                        return n(a), o
                    },
                    set: function (t) {
                        n(a), o = t
                    }
                }), i
            } catch (t) {
            }
            t._definePropertyBroken = !0, e[s] = o
        }

        var o = {};
        t.migrateWarnings = [], !t.migrateMute && e.console && e.console.log && e.console.log("JQMIGRATE: Logging is active"), t.migrateTrace === i && (t.migrateTrace = !0), t.migrateReset = function () {
            o = {}, t.migrateWarnings.length = 0
        }, "BackCompat" === document.compatMode && n("jQuery is not compatible with Quirks Mode");
        var a = t("<input>", {
            size: 1
        }).attr("size") && t.attrFn,
            r = t.attr,
            l = t.attrHooks.value && t.attrHooks.value.get || function () {
                return null
            },
            c = t.attrHooks.value && t.attrHooks.value.set || function () {
                return i
            },
            d = /^(?:input|button)$/i,
            u = /^[238]$/,
            h = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
            p = /^(?:checked|selected)$/i;
        s(t, "attrFn", a || {}, "jQuery.attrFn is deprecated"), t.attr = function (e, s, o, l) {
            var c = s.toLowerCase(),
                f = e && e.nodeType;
            return l && (4 > r.length && n("jQuery.fn.attr( props, pass ) is deprecated"), e && !u.test(f) && (a ? s in a : t.isFunction(t.fn[s]))) ? t(e)[s](o) : ("type" === s && o !== i && d.test(e.nodeName) && e.parentNode && n("Can't change the 'type' of an input or button in IE 6/7/8"), !t.attrHooks[c] && h.test(c) && (t.attrHooks[c] = {
                get: function (e, n) {
                    var s, o = t.prop(e, n);
                    return !0 === o || "boolean" != typeof o && (s = e.getAttributeNode(n)) && !1 !== s.nodeValue ? n.toLowerCase() : i
                },
                set: function (e, i, n) {
                    var s;
                    return !1 === i ? t.removeAttr(e, n) : (s = t.propFix[n] || n, s in e && (e[s] = !0), e.setAttribute(n, n.toLowerCase())), n
                }
            }, p.test(c) && n("jQuery.fn.attr('" + c + "') may use property instead of attribute")), r.call(t, e, s, o))
        }, t.attrHooks.value = {
            get: function (t, e) {
                var i = (t.nodeName || "").toLowerCase();
                return "button" === i ? l.apply(this, arguments) : ("input" !== i && "option" !== i && n("jQuery.fn.attr('value') no longer gets properties"), e in t ? t.value : null)
            },
            set: function (t, e) {
                var s = (t.nodeName || "").toLowerCase();
                return "button" === s ? c.apply(this, arguments) : ("input" !== s && "option" !== s && n("jQuery.fn.attr('value', val) no longer sets properties"), t.value = e, i)
            }
        };
        var f, m, g = t.fn.init,
            v = t.parseJSON,
            _ = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
        t.fn.init = function (e, i, s) {
            var o;
            return e && "string" == typeof e && !t.isPlainObject(i) && (o = _.exec(t.trim(e))) && o[0] && ("<" !== e.charAt(0) && n("$(html) HTML strings must start with '<' character"), o[3] && n("$(html) HTML text after last tag is ignored"), "#" === o[0].charAt(0) && (n("HTML string cannot start with a '#' character"), t.error("JQMIGRATE: Invalid selector string (XSS)")), i && i.context && (i = i.context), t.parseHTML) ? g.call(this, t.parseHTML(o[2], i, !0), i, s) : g.apply(this, arguments)
        }, t.fn.init.prototype = t.fn, t.parseJSON = function (t) {
            return t || null === t ? v.apply(this, arguments) : (n("jQuery.parseJSON requires a valid JSON string"), null)
        }, t.uaMatch = function (t) {
            t = t.toLowerCase();
            var e = /(chrome)[ \/]([\w.]+)/.exec(t) || /(webkit)[ \/]([\w.]+)/.exec(t) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) || /(msie) ([\w.]+)/.exec(t) || 0 > t.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t) || [];
            return {
                browser: e[1] || "",
                version: e[2] || "0"
            }
        }, t.browser || (f = t.uaMatch(navigator.userAgent), m = {}, f.browser && (m[f.browser] = !0, m.version = f.version), m.chrome ? m.webkit = !0 : m.webkit && (m.safari = !0), t.browser = m), s(t, "browser", t.browser, "jQuery.browser is deprecated"), t.sub = function () {
            function e(t, i) {
                return new e.fn.init(t, i)
            }

            t.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, e.sub = this.sub, e.fn.init = function (n, s) {
                return s && s instanceof t && !(s instanceof e) && (s = e(s)), t.fn.init.call(this, n, s, i)
            }, e.fn.init.prototype = e.fn;
            var i = e(document);
            return n("jQuery.sub() is deprecated"), e
        }, t.ajaxSetup({
            converters: {
                "text json": t.parseJSON
            }
        });
        var y = t.fn.data;
        t.fn.data = function (e) {
            var s, o, a = this[0];
            return !a || "events" !== e || 1 !== arguments.length || (s = t.data(a, e), o = t._data(a, e), s !== i && s !== o || o === i) ? y.apply(this, arguments) : (n("Use of jQuery.fn.data('events') is deprecated"), o)
        };
        var b = /\/(java|ecma)script/i,
            w = t.fn.andSelf || t.fn.addBack;
        t.fn.andSelf = function () {
            return n("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"), w.apply(this, arguments)
        }, t.clean || (t.clean = function (e, s, o, a) {
            s = s || document, s = !s.nodeType && s[0] || s, s = s.ownerDocument || s, n("jQuery.clean() is deprecated");
            var r, l, c, d, u = [];
            if (t.merge(u, t.buildFragment(e, s).childNodes), o)
                for (c = function (t) {
                    return !t.type || b.test(t.type) ? a ? a.push(t.parentNode ? t.parentNode.removeChild(t) : t) : o.appendChild(t) : i
                }, r = 0; null != (l = u[r]); r++) t.nodeName(l, "script") && c(l) || (o.appendChild(l), l.getElementsByTagName !== i && (d = t.grep(t.merge([], l.getElementsByTagName("script")), c), u.splice.apply(u, [r + 1, 0].concat(d)), r += d.length));
            return u
        });
        var x = t.event.add,
            C = t.event.remove,
            k = t.event.trigger,
            S = t.fn.toggle,
            T = t.fn.live,
            I = t.fn.die,
            D = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
            E = RegExp("\\b(?:" + D + ")\\b"),
            A = /(?:^|\s)hover(\.\S+|)\b/,
            P = function (e) {
                return "string" != typeof e || t.event.special.hover ? e : (A.test(e) && n("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"), e && e.replace(A, "mouseenter$1 mouseleave$1"))
            };
        t.event.props && "attrChange" !== t.event.props[0] && t.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"), t.event.dispatch && s(t.event, "handle", t.event.dispatch, "jQuery.event.handle is undocumented and deprecated"), t.event.add = function (t, e, i, s, o) {
            t !== document && E.test(e) && n("AJAX events should be attached to document: " + e), x.call(this, t, P(e || ""), i, s, o)
        }, t.event.remove = function (t, e, i, n, s) {
            C.call(this, t, P(e) || "", i, n, s)
        }, t.fn.error = function () {
            var t = Array.prototype.slice.call(arguments, 0);
            return n("jQuery.fn.error() is deprecated"), t.splice(0, 0, "error"), arguments.length ? this.bind.apply(this, t) : (this.triggerHandler.apply(this, t), this)
        }, t.fn.toggle = function (e, i) {
            if (!t.isFunction(e) || !t.isFunction(i)) return S.apply(this, arguments);
            n("jQuery.fn.toggle(handler, handler...) is deprecated");
            var s = arguments,
                o = e.guid || t.guid++,
                a = 0,
                r = function (i) {
                    var n = (t._data(this, "lastToggle" + e.guid) || 0) % a;
                    return t._data(this, "lastToggle" + e.guid, n + 1), i.preventDefault(), s[n].apply(this, arguments) || !1
                };
            for (r.guid = o; s.length > a;) s[a++].guid = o;
            return this.click(r)
        }, t.fn.live = function (e, i, s) {
            return n("jQuery.fn.live() is deprecated"), T ? T.apply(this, arguments) : (t(this.context).on(e, this.selector, i, s), this)
        }, t.fn.die = function (e, i) {
            return n("jQuery.fn.die() is deprecated"), I ? I.apply(this, arguments) : (t(this.context).off(e, this.selector || "**", i), this)
        }, t.event.trigger = function (t, e, i, s) {
            return i || E.test(t) || n("Global events are undocumented and deprecated"), k.call(this, t, e, i || document, s)
        }, t.each(D.split("|"), function (e, i) {
            t.event.special[i] = {
                setup: function () {
                    var e = this;
                    return e !== document && (t.event.add(document, i + "." + t.guid, function () {
                        t.event.trigger(i, null, e, !0)
                    }), t._data(this, i, t.guid++)), !1
                },
                teardown: function () {
                    return this !== document && t.event.remove(document, i + "." + t._data(this, i)), !1
                }
            }
        })
    }(jQuery, window),
    function (t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e(exports, require("jquery"), require("popper.js")) : "function" == typeof define && define.amd ? define(["exports", "jquery", "popper.js"], e) : e((t = t || self).bootstrap = {}, t.jQuery, t.Popper)
    }(this, function (t, e, i) {
        "use strict";

        function n(t, e) {
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }

        function s(t, e, i) {
            return e && n(t.prototype, e), i && n(t, i), t
        }

        function o(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = null != arguments[e] ? arguments[e] : {},
                    n = Object.keys(i);
                "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(i).filter(function (t) {
                    return Object.getOwnPropertyDescriptor(i, t).enumerable
                }))), n.forEach(function (e) {
                    var n, s, o;
                    n = t, o = i[s = e], s in n ? Object.defineProperty(n, s, {
                        value: o,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : n[s] = o
                })
            }
            return t
        }

        function a(t) {
            var i = this,
                n = !1;
            return e(this).one(c.TRANSITION_END, function () {
                n = !0
            }), setTimeout(function () {
                n || c.triggerTransitionEnd(i)
            }, t), this
        }

        function r(t, e, i) {
            if (0 === t.length) return t;
            if (i && "function" == typeof i) return i(t);
            for (var n = (new window.DOMParser).parseFromString(t, "text/html"), s = Object.keys(e), o = [].slice.call(n.body.querySelectorAll("*")), a = function (t, i) {
                var n = o[t],
                    a = n.nodeName.toLowerCase();
                if (-1 === s.indexOf(n.nodeName.toLowerCase())) return n.parentNode.removeChild(n), "continue";
                var r = [].slice.call(n.attributes),
                    l = [].concat(e["*"] || [], e[a] || []);
                r.forEach(function (t) {
                    (function (t, e) {
                        var i = t.nodeName.toLowerCase();
                        if (-1 !== e.indexOf(i)) return -1 === me.indexOf(i) || Boolean(t.nodeValue.match(ve) || t.nodeValue.match(_e));
                        for (var n = e.filter(function (t) {
                            return t instanceof RegExp
                        }), s = 0, o = n.length; s < o; s++)
                            if (i.match(n[s])) return !0;
                        return !1
                    })(t, l) || n.removeAttribute(t.nodeName)
                })
            }, r = 0, l = o.length; r < l; r++) a(r);
            return n.body.innerHTML
        }

        e = e && e.hasOwnProperty("default") ? e.default : e, i = i && i.hasOwnProperty("default") ? i.default : i;
        var l = "transitionend",
            c = {
                TRANSITION_END: "bsTransitionEnd",
                getUID: function (t) {
                    for (; t += ~~(1e6 * Math.random()), document.getElementById(t););
                    return t
                },
                getSelectorFromElement: function (t) {
                    var e = t.getAttribute("data-target");
                    if (!e || "#" === e) {
                        var i = t.getAttribute("href");
                        e = i && "#" !== i ? i.trim() : ""
                    }
                    try {
                        return document.querySelector(e) ? e : null
                    } catch (t) {
                        return null
                    }
                },
                getTransitionDurationFromElement: function (t) {
                    if (!t) return 0;
                    var i = e(t).css("transition-duration"),
                        n = e(t).css("transition-delay"),
                        s = parseFloat(i),
                        o = parseFloat(n);
                    return s || o ? (i = i.split(",")[0], n = n.split(",")[0], 1e3 * (parseFloat(i) + parseFloat(n))) : 0
                },
                reflow: function (t) {
                    return t.offsetHeight
                },
                triggerTransitionEnd: function (t) {
                    e(t).trigger(l)
                },
                supportsTransitionEnd: function () {
                    return Boolean(l)
                },
                isElement: function (t) {
                    return (t[0] || t).nodeType
                },
                typeCheckConfig: function (t, e, i) {
                    for (var n in i)
                        if (Object.prototype.hasOwnProperty.call(i, n)) {
                            var s = i[n],
                                o = e[n],
                                a = o && c.isElement(o) ? "element" : (r = o, {}.toString.call(r).match(/\s([a-z]+)/i)[1].toLowerCase());
                            if (!new RegExp(s).test(a)) throw new Error(t.toUpperCase() + ': Option "' + n + '" provided type "' + a + '" but expected type "' + s + '".')
                        }
                    var r
                },
                findShadowRoot: function (t) {
                    if (!document.documentElement.attachShadow) return null;
                    if ("function" != typeof t.getRootNode) return t instanceof ShadowRoot ? t : t.parentNode ? c.findShadowRoot(t.parentNode) : null;
                    var e = t.getRootNode();
                    return e instanceof ShadowRoot ? e : null
                }
            };
        e.fn.emulateTransitionEnd = a, e.event.special[c.TRANSITION_END] = {
            bindType: l,
            delegateType: l,
            handle: function (t) {
                if (e(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
            }
        };
        var d = "alert",
            u = "bs.alert",
            h = "." + u,
            p = e.fn[d],
            f = {
                CLOSE: "close" + h,
                CLOSED: "closed" + h,
                CLICK_DATA_API: "click" + h + ".data-api"
            },
            m = "alert",
            g = "fade",
            v = "show",
            _ = function () {
                function t(t) {
                    this._element = t
                }

                var i = t.prototype;
                return i.close = function (t) {
                    var e = this._element;
                    t && (e = this._getRootElement(t)), this._triggerCloseEvent(e).isDefaultPrevented() || this._removeElement(e)
                }, i.dispose = function () {
                    e.removeData(this._element, u), this._element = null
                }, i._getRootElement = function (t) {
                    var i = c.getSelectorFromElement(t),
                        n = !1;
                    return i && (n = document.querySelector(i)), n || (n = e(t).closest("." + m)[0]), n
                }, i._triggerCloseEvent = function (t) {
                    var i = e.Event(f.CLOSE);
                    return e(t).trigger(i), i
                }, i._removeElement = function (t) {
                    var i = this;
                    if (e(t).removeClass(v), e(t).hasClass(g)) {
                        var n = c.getTransitionDurationFromElement(t);
                        e(t).one(c.TRANSITION_END, function (e) {
                            return i._destroyElement(t, e)
                        }).emulateTransitionEnd(n)
                    } else this._destroyElement(t)
                }, i._destroyElement = function (t) {
                    e(t).detach().trigger(f.CLOSED).remove()
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this),
                            s = n.data(u);
                        s || (s = new t(this), n.data(u, s)), "close" === i && s[i](this)
                    })
                }, t._handleDismiss = function (t) {
                    return function (e) {
                        e && e.preventDefault(), t.close(this)
                    }
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }]), t
            }();
        e(document).on(f.CLICK_DATA_API, '[data-dismiss="alert"]', _._handleDismiss(new _)), e.fn[d] = _._jQueryInterface, e.fn[d].Constructor = _, e.fn[d].noConflict = function () {
            return e.fn[d] = p, _._jQueryInterface
        };
        var y = "button",
            b = "bs.button",
            w = "." + b,
            x = ".data-api",
            C = e.fn[y],
            k = "active",
            S = '[data-toggle^="button"]',
            T = '[data-toggle="buttons"]',
            I = 'input:not([type="hidden"])',
            D = ".active",
            E = ".btn",
            A = {
                CLICK_DATA_API: "click" + w + x,
                FOCUS_BLUR_DATA_API: "focus" + w + x + " blur" + w + x
            },
            P = function () {
                function t(t) {
                    this._element = t
                }

                var i = t.prototype;
                return i.toggle = function () {
                    var t = !0,
                        i = !0,
                        n = e(this._element).closest(T)[0];
                    if (n) {
                        var s = this._element.querySelector(I);
                        if (s) {
                            if ("radio" === s.type)
                                if (s.checked && this._element.classList.contains(k)) t = !1;
                                else {
                                    var o = n.querySelector(D);
                                    o && e(o).removeClass(k)
                                }
                            if (t) {
                                if (s.hasAttribute("disabled") || n.hasAttribute("disabled") || s.classList.contains("disabled") || n.classList.contains("disabled")) return;
                                s.checked = !this._element.classList.contains(k), e(s).trigger("change")
                            }
                            s.focus(), i = !1
                        }
                    }
                    i && this._element.setAttribute("aria-pressed", !this._element.classList.contains(k)), t && e(this._element).toggleClass(k)
                }, i.dispose = function () {
                    e.removeData(this._element, b), this._element = null
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this).data(b);
                        n || (n = new t(this), e(this).data(b, n)), "toggle" === i && n[i]()
                    })
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }]), t
            }();
        e(document).on(A.CLICK_DATA_API, S, function (t) {
            t.preventDefault();
            var i = t.target;
            e(i).hasClass("btn") || (i = e(i).closest(E)), P._jQueryInterface.call(e(i), "toggle")
        }).on(A.FOCUS_BLUR_DATA_API, S, function (t) {
            var i = e(t.target).closest(E)[0];
            e(i).toggleClass("focus", /^focus(in)?$/.test(t.type))
        }), e.fn[y] = P._jQueryInterface, e.fn[y].Constructor = P, e.fn[y].noConflict = function () {
            return e.fn[y] = C, P._jQueryInterface
        };
        var M = "carousel",
            j = "bs.carousel",
            $ = "." + j,
            O = ".data-api",
            N = e.fn[M],
            L = {
                interval: 5e3,
                keyboard: !0,
                slide: !1,
                pause: "hover",
                wrap: !0,
                touch: !0
            },
            z = {
                interval: "(number|boolean)",
                keyboard: "boolean",
                slide: "(boolean|string)",
                pause: "(string|boolean)",
                wrap: "boolean",
                touch: "boolean"
            },
            F = "next",
            H = "prev",
            W = "left",
            R = "right",
            B = {
                SLIDE: "slide" + $,
                SLID: "slid" + $,
                KEYDOWN: "keydown" + $,
                MOUSEENTER: "mouseenter" + $,
                MOUSELEAVE: "mouseleave" + $,
                TOUCHSTART: "touchstart" + $,
                TOUCHMOVE: "touchmove" + $,
                TOUCHEND: "touchend" + $,
                POINTERDOWN: "pointerdown" + $,
                POINTERUP: "pointerup" + $,
                DRAG_START: "dragstart" + $,
                LOAD_DATA_API: "load" + $ + O,
                CLICK_DATA_API: "click" + $ + O
            },
            q = "carousel",
            U = "active",
            Y = "slide",
            K = "carousel-item-right",
            V = "carousel-item-left",
            Q = "carousel-item-next",
            Z = "carousel-item-prev",
            G = "pointer-event",
            X = ".active",
            J = ".active.carousel-item",
            tt = ".carousel-item",
            et = ".carousel-item img",
            it = ".carousel-item-next, .carousel-item-prev",
            nt = ".carousel-indicators",
            st = '[data-ride="carousel"]',
            ot = {
                TOUCH: "touch",
                PEN: "pen"
            },
            at = function () {
                function t(t, e) {
                    this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(e), this._element = t, this._indicatorsElement = this._element.querySelector(nt), this._touchSupported = "ontouchstart" in document.documentElement || 0 < navigator.maxTouchPoints, this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent), this._addEventListeners()
                }

                var i = t.prototype;
                return i.next = function () {
                    this._isSliding || this._slide(F)
                }, i.nextWhenVisible = function () {
                    !document.hidden && e(this._element).is(":visible") && "hidden" !== e(this._element).css("visibility") && this.next()
                }, i.prev = function () {
                    this._isSliding || this._slide(H)
                }, i.pause = function (t) {
                    t || (this._isPaused = !0), this._element.querySelector(it) && (c.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
                }, i.cycle = function (t) {
                    t || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
                }, i.to = function (t) {
                    var i = this;
                    this._activeElement = this._element.querySelector(J);
                    var n = this._getItemIndex(this._activeElement);
                    if (!(t > this._items.length - 1 || t < 0))
                        if (this._isSliding) e(this._element).one(B.SLID, function () {
                            return i.to(t)
                        });
                        else {
                            if (n === t) return this.pause(), void this.cycle();
                            var s = n < t ? F : H;
                            this._slide(s, this._items[t])
                        }
                }, i.dispose = function () {
                    e(this._element).off($), e.removeData(this._element, j), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null
                }, i._getConfig = function (t) {
                    return t = o({}, L, t), c.typeCheckConfig(M, t, z), t
                }, i._handleSwipe = function () {
                    var t = Math.abs(this.touchDeltaX);
                    if (!(t <= 40)) {
                        var e = t / this.touchDeltaX;
                        0 < e && this.prev(), e < 0 && this.next()
                    }
                }, i._addEventListeners = function () {
                    var t = this;
                    this._config.keyboard && e(this._element).on(B.KEYDOWN, function (e) {
                        return t._keydown(e)
                    }), "hover" === this._config.pause && e(this._element).on(B.MOUSEENTER, function (e) {
                        return t.pause(e)
                    }).on(B.MOUSELEAVE, function (e) {
                        return t.cycle(e)
                    }), this._config.touch && this._addTouchEventListeners()
                }, i._addTouchEventListeners = function () {
                    var t = this;
                    if (this._touchSupported) {
                        var i = function (e) {
                            t._pointerEvent && ot[e.originalEvent.pointerType.toUpperCase()] ? t.touchStartX = e.originalEvent.clientX : t._pointerEvent || (t.touchStartX = e.originalEvent.touches[0].clientX)
                        },
                            n = function (e) {
                                t._pointerEvent && ot[e.originalEvent.pointerType.toUpperCase()] && (t.touchDeltaX = e.originalEvent.clientX - t.touchStartX), t._handleSwipe(), "hover" === t._config.pause && (t.pause(), t.touchTimeout && clearTimeout(t.touchTimeout), t.touchTimeout = setTimeout(function (e) {
                                    return t.cycle(e)
                                }, 500 + t._config.interval))
                            };
                        e(this._element.querySelectorAll(et)).on(B.DRAG_START, function (t) {
                            return t.preventDefault()
                        }), this._pointerEvent ? (e(this._element).on(B.POINTERDOWN, function (t) {
                            return i(t)
                        }), e(this._element).on(B.POINTERUP, function (t) {
                            return n(t)
                        }), this._element.classList.add(G)) : (e(this._element).on(B.TOUCHSTART, function (t) {
                            return i(t)
                        }), e(this._element).on(B.TOUCHMOVE, function (e) {
                            var i;
                            (i = e).originalEvent.touches && 1 < i.originalEvent.touches.length ? t.touchDeltaX = 0 : t.touchDeltaX = i.originalEvent.touches[0].clientX - t.touchStartX
                        }), e(this._element).on(B.TOUCHEND, function (t) {
                            return n(t)
                        }))
                    }
                }, i._keydown = function (t) {
                    if (!/input|textarea/i.test(t.target.tagName)) switch (t.which) {
                        case 37:
                            t.preventDefault(), this.prev();
                            break;
                        case 39:
                            t.preventDefault(), this.next()
                    }
                }, i._getItemIndex = function (t) {
                    return this._items = t && t.parentNode ? [].slice.call(t.parentNode.querySelectorAll(tt)) : [], this._items.indexOf(t)
                }, i._getItemByDirection = function (t, e) {
                    var i = t === F,
                        n = t === H,
                        s = this._getItemIndex(e),
                        o = this._items.length - 1;
                    if ((n && 0 === s || i && s === o) && !this._config.wrap) return e;
                    var a = (s + (t === H ? -1 : 1)) % this._items.length;
                    return -1 === a ? this._items[this._items.length - 1] : this._items[a]
                }, i._triggerSlideEvent = function (t, i) {
                    var n = this._getItemIndex(t),
                        s = this._getItemIndex(this._element.querySelector(J)),
                        o = e.Event(B.SLIDE, {
                            relatedTarget: t,
                            direction: i,
                            from: s,
                            to: n
                        });
                    return e(this._element).trigger(o), o
                }, i._setActiveIndicatorElement = function (t) {
                    if (this._indicatorsElement) {
                        var i = [].slice.call(this._indicatorsElement.querySelectorAll(X));
                        e(i).removeClass(U);
                        var n = this._indicatorsElement.children[this._getItemIndex(t)];
                        n && e(n).addClass(U)
                    }
                }, i._slide = function (t, i) {
                    var n, s, o, a = this,
                        r = this._element.querySelector(J),
                        l = this._getItemIndex(r),
                        d = i || r && this._getItemByDirection(t, r),
                        u = this._getItemIndex(d),
                        h = Boolean(this._interval);
                    if (o = t === F ? (n = V, s = Q, W) : (n = K, s = Z, R), d && e(d).hasClass(U)) this._isSliding = !1;
                    else if (!this._triggerSlideEvent(d, o).isDefaultPrevented() && r && d) {
                        this._isSliding = !0, h && this.pause(), this._setActiveIndicatorElement(d);
                        var p = e.Event(B.SLID, {
                            relatedTarget: d,
                            direction: o,
                            from: l,
                            to: u
                        });
                        if (e(this._element).hasClass(Y)) {
                            e(d).addClass(s), c.reflow(d), e(r).addClass(n), e(d).addClass(n);
                            var f = parseInt(d.getAttribute("data-interval"), 10);
                            this._config.interval = f ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, f) : this._config.defaultInterval || this._config.interval;
                            var m = c.getTransitionDurationFromElement(r);
                            e(r).one(c.TRANSITION_END, function () {
                                e(d).removeClass(n + " " + s).addClass(U), e(r).removeClass(U + " " + s + " " + n), a._isSliding = !1, setTimeout(function () {
                                    return e(a._element).trigger(p)
                                }, 0)
                            }).emulateTransitionEnd(m)
                        } else e(r).removeClass(U), e(d).addClass(U), this._isSliding = !1, e(this._element).trigger(p);
                        h && this.cycle()
                    }
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this).data(j),
                            s = o({}, L, e(this).data());
                        "object" == typeof i && (s = o({}, s, i));
                        var a = "string" == typeof i ? i : s.slide;
                        if (n || (n = new t(this, s), e(this).data(j, n)), "number" == typeof i) n.to(i);
                        else if ("string" == typeof a) {
                            if (void 0 === n[a]) throw new TypeError('No method named "' + a + '"');
                            n[a]()
                        } else s.interval && s.ride && (n.pause(), n.cycle())
                    })
                }, t._dataApiClickHandler = function (i) {
                    var n = c.getSelectorFromElement(this);
                    if (n) {
                        var s = e(n)[0];
                        if (s && e(s).hasClass(q)) {
                            var a = o({}, e(s).data(), e(this).data()),
                                r = this.getAttribute("data-slide-to");
                            r && (a.interval = !1), t._jQueryInterface.call(e(s), a), r && e(s).data(j).to(r), i.preventDefault()
                        }
                    }
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return L
                    }
                }]), t
            }();
        e(document).on(B.CLICK_DATA_API, "[data-slide], [data-slide-to]", at._dataApiClickHandler), e(window).on(B.LOAD_DATA_API, function () {
            for (var t = [].slice.call(document.querySelectorAll(st)), i = 0, n = t.length; i < n; i++) {
                var s = e(t[i]);
                at._jQueryInterface.call(s, s.data())
            }
        }), e.fn[M] = at._jQueryInterface, e.fn[M].Constructor = at, e.fn[M].noConflict = function () {
            return e.fn[M] = N, at._jQueryInterface
        };
        var rt = "collapse",
            lt = "bs.collapse",
            ct = "." + lt,
            dt = e.fn[rt],
            ut = {
                toggle: !0,
                parent: ""
            },
            ht = {
                toggle: "boolean",
                parent: "(string|element)"
            },
            pt = {
                SHOW: "show" + ct,
                SHOWN: "shown" + ct,
                HIDE: "hide" + ct,
                HIDDEN: "hidden" + ct,
                CLICK_DATA_API: "click" + ct + ".data-api"
            },
            ft = "show",
            mt = "collapse",
            gt = "collapsing",
            vt = "collapsed",
            _t = "width",
            yt = "height",
            bt = ".show, .collapsing",
            wt = '[data-toggle="collapse"]',
            xt = function () {
                function t(t, e) {
                    this._isTransitioning = !1, this._element = t, this._config = this._getConfig(e), this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'));
                    for (var i = [].slice.call(document.querySelectorAll(wt)), n = 0, s = i.length; n < s; n++) {
                        var o = i[n],
                            a = c.getSelectorFromElement(o),
                            r = [].slice.call(document.querySelectorAll(a)).filter(function (e) {
                                return e === t
                            });
                        null !== a && 0 < r.length && (this._selector = a, this._triggerArray.push(o))
                    }
                    this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle()
                }

                var i = t.prototype;
                return i.toggle = function () {
                    e(this._element).hasClass(ft) ? this.hide() : this.show()
                }, i.show = function () {
                    var i, n, s = this;
                    if (!(this._isTransitioning || e(this._element).hasClass(ft) || (this._parent && 0 === (i = [].slice.call(this._parent.querySelectorAll(bt)).filter(function (t) {
                        return "string" == typeof s._config.parent ? t.getAttribute("data-parent") === s._config.parent : t.classList.contains(mt)
                    })).length && (i = null), i && (n = e(i).not(this._selector).data(lt)) && n._isTransitioning))) {
                        var o = e.Event(pt.SHOW);
                        if (e(this._element).trigger(o), !o.isDefaultPrevented()) {
                            i && (t._jQueryInterface.call(e(i).not(this._selector), "hide"), n || e(i).data(lt, null));
                            var a = this._getDimension();
                            e(this._element).removeClass(mt).addClass(gt), this._element.style[a] = 0, this._triggerArray.length && e(this._triggerArray).removeClass(vt).attr("aria-expanded", !0), this.setTransitioning(!0);
                            var r = "scroll" + (a[0].toUpperCase() + a.slice(1)),
                                l = c.getTransitionDurationFromElement(this._element);
                            e(this._element).one(c.TRANSITION_END, function () {
                                e(s._element).removeClass(gt).addClass(mt).addClass(ft), s._element.style[a] = "", s.setTransitioning(!1), e(s._element).trigger(pt.SHOWN)
                            }).emulateTransitionEnd(l), this._element.style[a] = this._element[r] + "px"
                        }
                    }
                }, i.hide = function () {
                    var t = this;
                    if (!this._isTransitioning && e(this._element).hasClass(ft)) {
                        var i = e.Event(pt.HIDE);
                        if (e(this._element).trigger(i), !i.isDefaultPrevented()) {
                            var n = this._getDimension();
                            this._element.style[n] = this._element.getBoundingClientRect()[n] + "px", c.reflow(this._element), e(this._element).addClass(gt).removeClass(mt).removeClass(ft);
                            var s = this._triggerArray.length;
                            if (0 < s)
                                for (var o = 0; o < s; o++) {
                                    var a = this._triggerArray[o],
                                        r = c.getSelectorFromElement(a);
                                    null !== r && (e([].slice.call(document.querySelectorAll(r))).hasClass(ft) || e(a).addClass(vt).attr("aria-expanded", !1))
                                }
                            this.setTransitioning(!0), this._element.style[n] = "";
                            var l = c.getTransitionDurationFromElement(this._element);
                            e(this._element).one(c.TRANSITION_END, function () {
                                t.setTransitioning(!1), e(t._element).removeClass(gt).addClass(mt).trigger(pt.HIDDEN)
                            }).emulateTransitionEnd(l)
                        }
                    }
                }, i.setTransitioning = function (t) {
                    this._isTransitioning = t
                }, i.dispose = function () {
                    e.removeData(this._element, lt), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null
                }, i._getConfig = function (t) {
                    return (t = o({}, ut, t)).toggle = Boolean(t.toggle), c.typeCheckConfig(rt, t, ht), t
                }, i._getDimension = function () {
                    return e(this._element).hasClass(_t) ? _t : yt
                }, i._getParent = function () {
                    var i, n = this;
                    c.isElement(this._config.parent) ? (i = this._config.parent, void 0 !== this._config.parent.jquery && (i = this._config.parent[0])) : i = document.querySelector(this._config.parent);
                    var s = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]',
                        o = [].slice.call(i.querySelectorAll(s));
                    return e(o).each(function (e, i) {
                        n._addAriaAndCollapsedClass(t._getTargetFromElement(i), [i])
                    }), i
                }, i._addAriaAndCollapsedClass = function (t, i) {
                    var n = e(t).hasClass(ft);
                    i.length && e(i).toggleClass(vt, !n).attr("aria-expanded", n)
                }, t._getTargetFromElement = function (t) {
                    var e = c.getSelectorFromElement(t);
                    return e ? document.querySelector(e) : null
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this),
                            s = n.data(lt),
                            a = o({}, ut, n.data(), "object" == typeof i && i ? i : {});
                        if (!s && a.toggle && /show|hide/.test(i) && (a.toggle = !1), s || (s = new t(this, a), n.data(lt, s)), "string" == typeof i) {
                            if (void 0 === s[i]) throw new TypeError('No method named "' + i + '"');
                            s[i]()
                        }
                    })
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return ut
                    }
                }]), t
            }();
        e(document).on(pt.CLICK_DATA_API, wt, function (t) {
            "A" === t.currentTarget.tagName && t.preventDefault();
            var i = e(this),
                n = c.getSelectorFromElement(this),
                s = [].slice.call(document.querySelectorAll(n));
            e(s).each(function () {
                var t = e(this),
                    n = t.data(lt) ? "toggle" : i.data();
                xt._jQueryInterface.call(t, n)
            })
        }), e.fn[rt] = xt._jQueryInterface, e.fn[rt].Constructor = xt, e.fn[rt].noConflict = function () {
            return e.fn[rt] = dt, xt._jQueryInterface
        };
        var Ct = "dropdown",
            kt = "bs.dropdown",
            St = "." + kt,
            Tt = ".data-api",
            It = e.fn[Ct],
            Dt = new RegExp("38|40|27"),
            Et = {
                HIDE: "hide" + St,
                HIDDEN: "hidden" + St,
                SHOW: "show" + St,
                SHOWN: "shown" + St,
                CLICK: "click" + St,
                CLICK_DATA_API: "click" + St + Tt,
                KEYDOWN_DATA_API: "keydown" + St + Tt,
                KEYUP_DATA_API: "keyup" + St + Tt
            },
            At = "disabled",
            Pt = "show",
            Mt = "dropup",
            jt = "dropright",
            $t = "dropleft",
            Ot = "dropdown-menu-right",
            Nt = "position-static",
            Lt = '[data-toggle="dropdown"]',
            zt = ".dropdown-menu",
            Ft = ".navbar-nav",
            Ht = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",
            Wt = "top-start",
            Rt = "top-end",
            Bt = "bottom-start",
            qt = "bottom-end",
            Ut = "right-start",
            Yt = "left-start",
            Kt = {
                offset: 0,
                flip: !0,
                boundary: "scrollParent",
                reference: "toggle",
                display: "dynamic"
            },
            Vt = {
                offset: "(number|string|function)",
                flip: "boolean",
                boundary: "(string|element)",
                reference: "(string|element)",
                display: "string"
            },
            Qt = function () {
                function t(t, e) {
                    this._element = t, this._popper = null, this._config = this._getConfig(e), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners()
                }

                var n = t.prototype;
                return n.toggle = function () {
                    if (!this._element.disabled && !e(this._element).hasClass(At)) {
                        var n = t._getParentFromElement(this._element),
                            s = e(this._menu).hasClass(Pt);
                        if (t._clearMenus(), !s) {
                            var o = {
                                relatedTarget: this._element
                            },
                                a = e.Event(Et.SHOW, o);
                            if (e(n).trigger(a), !a.isDefaultPrevented()) {
                                if (!this._inNavbar) {
                                    if (void 0 === i) throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");
                                    var r = this._element;
                                    "parent" === this._config.reference ? r = n : c.isElement(this._config.reference) && (r = this._config.reference, void 0 !== this._config.reference.jquery && (r = this._config.reference[0])), "scrollParent" !== this._config.boundary && e(n).addClass(Nt), this._popper = new i(r, this._menu, this._getPopperConfig())
                                }
                                "ontouchstart" in document.documentElement && 0 === e(n).closest(Ft).length && e(document.body).children().on("mouseover", null, e.noop), this._element.focus(), this._element.setAttribute("aria-expanded", !0), e(this._menu).toggleClass(Pt), e(n).toggleClass(Pt).trigger(e.Event(Et.SHOWN, o))
                            }
                        }
                    }
                }, n.show = function () {
                    if (!(this._element.disabled || e(this._element).hasClass(At) || e(this._menu).hasClass(Pt))) {
                        var i = {
                            relatedTarget: this._element
                        },
                            n = e.Event(Et.SHOW, i),
                            s = t._getParentFromElement(this._element);
                        e(s).trigger(n), n.isDefaultPrevented() || (e(this._menu).toggleClass(Pt), e(s).toggleClass(Pt).trigger(e.Event(Et.SHOWN, i)))
                    }
                }, n.hide = function () {
                    if (!this._element.disabled && !e(this._element).hasClass(At) && e(this._menu).hasClass(Pt)) {
                        var i = {
                            relatedTarget: this._element
                        },
                            n = e.Event(Et.HIDE, i),
                            s = t._getParentFromElement(this._element);
                        e(s).trigger(n), n.isDefaultPrevented() || (e(this._menu).toggleClass(Pt), e(s).toggleClass(Pt).trigger(e.Event(Et.HIDDEN, i)))
                    }
                }, n.dispose = function () {
                    e.removeData(this._element, kt), e(this._element).off(St), this._element = null, (this._menu = null) !== this._popper && (this._popper.destroy(), this._popper = null)
                }, n.update = function () {
                    this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate()
                }, n._addEventListeners = function () {
                    var t = this;
                    e(this._element).on(Et.CLICK, function (e) {
                        e.preventDefault(), e.stopPropagation(), t.toggle()
                    })
                }, n._getConfig = function (t) {
                    return t = o({}, this.constructor.Default, e(this._element).data(), t), c.typeCheckConfig(Ct, t, this.constructor.DefaultType), t
                }, n._getMenuElement = function () {
                    if (!this._menu) {
                        var e = t._getParentFromElement(this._element);
                        e && (this._menu = e.querySelector(zt))
                    }
                    return this._menu
                }, n._getPlacement = function () {
                    var t = e(this._element.parentNode),
                        i = Bt;
                    return t.hasClass(Mt) ? (i = Wt, e(this._menu).hasClass(Ot) && (i = Rt)) : t.hasClass(jt) ? i = Ut : t.hasClass($t) ? i = Yt : e(this._menu).hasClass(Ot) && (i = qt), i
                }, n._detectNavbar = function () {
                    return 0 < e(this._element).closest(".navbar").length
                }, n._getOffset = function () {
                    var t = this,
                        e = {};
                    return "function" == typeof this._config.offset ? e.fn = function (e) {
                        return e.offsets = o({}, e.offsets, t._config.offset(e.offsets, t._element) || {}), e
                    } : e.offset = this._config.offset, e
                }, n._getPopperConfig = function () {
                    var t = {
                        placement: this._getPlacement(),
                        modifiers: {
                            offset: this._getOffset(),
                            flip: {
                                enabled: this._config.flip
                            },
                            preventOverflow: {
                                boundariesElement: this._config.boundary
                            }
                        }
                    };
                    return "static" === this._config.display && (t.modifiers.applyStyle = {
                        enabled: !1
                    }), t
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this).data(kt);
                        if (n || (n = new t(this, "object" == typeof i ? i : null), e(this).data(kt, n)), "string" == typeof i) {
                            if (void 0 === n[i]) throw new TypeError('No method named "' + i + '"');
                            n[i]()
                        }
                    })
                }, t._clearMenus = function (i) {
                    if (!i || 3 !== i.which && ("keyup" !== i.type || 9 === i.which))
                        for (var n = [].slice.call(document.querySelectorAll(Lt)), s = 0, o = n.length; s < o; s++) {
                            var a = t._getParentFromElement(n[s]),
                                r = e(n[s]).data(kt),
                                l = {
                                    relatedTarget: n[s]
                                };
                            if (i && "click" === i.type && (l.clickEvent = i), r) {
                                var c = r._menu;
                                if (e(a).hasClass(Pt) && !(i && ("click" === i.type && /input|textarea/i.test(i.target.tagName) || "keyup" === i.type && 9 === i.which) && e.contains(a, i.target))) {
                                    var d = e.Event(Et.HIDE, l);
                                    e(a).trigger(d), d.isDefaultPrevented() || ("ontouchstart" in document.documentElement && e(document.body).children().off("mouseover", null, e.noop), n[s].setAttribute("aria-expanded", "false"), e(c).removeClass(Pt), e(a).removeClass(Pt).trigger(e.Event(Et.HIDDEN, l)))
                                }
                            }
                        }
                }, t._getParentFromElement = function (t) {
                    var e, i = c.getSelectorFromElement(t);
                    return i && (e = document.querySelector(i)), e || t.parentNode
                }, t._dataApiKeydownHandler = function (i) {
                    if ((/input|textarea/i.test(i.target.tagName) ? !(32 === i.which || 27 !== i.which && (40 !== i.which && 38 !== i.which || e(i.target).closest(zt).length)) : Dt.test(i.which)) && (i.preventDefault(), i.stopPropagation(), !this.disabled && !e(this).hasClass(At))) {
                        var n = t._getParentFromElement(this),
                            s = e(n).hasClass(Pt);
                        if (s && (!s || 27 !== i.which && 32 !== i.which)) {
                            var o = [].slice.call(n.querySelectorAll(Ht));
                            if (0 !== o.length) {
                                var a = o.indexOf(i.target);
                                38 === i.which && 0 < a && a--, 40 === i.which && a < o.length - 1 && a++, a < 0 && (a = 0), o[a].focus()
                            }
                        } else {
                            if (27 === i.which) {
                                var r = n.querySelector(Lt);
                                e(r).trigger("focus")
                            }
                            e(this).trigger("click")
                        }
                    }
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return Kt
                    }
                }, {
                    key: "DefaultType",
                    get: function () {
                        return Vt
                    }
                }]), t
            }();
        e(document).on(Et.KEYDOWN_DATA_API, Lt, Qt._dataApiKeydownHandler).on(Et.KEYDOWN_DATA_API, zt, Qt._dataApiKeydownHandler).on(Et.CLICK_DATA_API + " " + Et.KEYUP_DATA_API, Qt._clearMenus).on(Et.CLICK_DATA_API, Lt, function (t) {
            t.preventDefault(), t.stopPropagation(), Qt._jQueryInterface.call(e(this), "toggle")
        }).on(Et.CLICK_DATA_API, ".dropdown form", function (t) {
            t.stopPropagation()
        }), e.fn[Ct] = Qt._jQueryInterface, e.fn[Ct].Constructor = Qt, e.fn[Ct].noConflict = function () {
            return e.fn[Ct] = It, Qt._jQueryInterface
        };
        var Zt = "modal",
            Gt = "bs.modal",
            Xt = "." + Gt,
            Jt = e.fn[Zt],
            te = {
                backdrop: !0,
                keyboard: !0,
                focus: !0,
                show: !0
            },
            ee = {
                backdrop: "(boolean|string)",
                keyboard: "boolean",
                focus: "boolean",
                show: "boolean"
            },
            ie = {
                HIDE: "hide" + Xt,
                HIDDEN: "hidden" + Xt,
                SHOW: "show" + Xt,
                SHOWN: "shown" + Xt,
                FOCUSIN: "focusin" + Xt,
                RESIZE: "resize" + Xt,
                CLICK_DISMISS: "click.dismiss" + Xt,
                KEYDOWN_DISMISS: "keydown.dismiss" + Xt,
                MOUSEUP_DISMISS: "mouseup.dismiss" + Xt,
                MOUSEDOWN_DISMISS: "mousedown.dismiss" + Xt,
                CLICK_DATA_API: "click" + Xt + ".data-api"
            },
            ne = "modal-dialog-scrollable",
            se = "modal-scrollbar-measure",
            oe = "modal-backdrop",
            ae = "modal-open",
            re = "fade",
            le = "show",
            ce = ".modal-dialog",
            de = ".modal-body",
            ue = '[data-dismiss="modal"]',
            he = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
            pe = ".sticky-top",
            fe = function () {
                function t(t, e) {
                    this._config = this._getConfig(e), this._element = t, this._dialog = t.querySelector(ce), this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollbarWidth = 0
                }

                var i = t.prototype;
                return i.toggle = function (t) {
                    return this._isShown ? this.hide() : this.show(t)
                }, i.show = function (t) {
                    var i = this;
                    if (!this._isShown && !this._isTransitioning) {
                        e(this._element).hasClass(re) && (this._isTransitioning = !0);
                        var n = e.Event(ie.SHOW, {
                            relatedTarget: t
                        });
                        e(this._element).trigger(n), this._isShown || n.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), e(this._element).on(ie.CLICK_DISMISS, ue, function (t) {
                            return i.hide(t)
                        }), e(this._dialog).on(ie.MOUSEDOWN_DISMISS, function () {
                            e(i._element).one(ie.MOUSEUP_DISMISS, function (t) {
                                e(t.target).is(i._element) && (i._ignoreBackdropClick = !0)
                            })
                        }), this._showBackdrop(function () {
                            return i._showElement(t)
                        }))
                    }
                }, i.hide = function (t) {
                    var i = this;
                    if (t && t.preventDefault(), this._isShown && !this._isTransitioning) {
                        var n = e.Event(ie.HIDE);
                        if (e(this._element).trigger(n), this._isShown && !n.isDefaultPrevented()) {
                            this._isShown = !1;
                            var s = e(this._element).hasClass(re);
                            if (s && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), e(document).off(ie.FOCUSIN), e(this._element).removeClass(le), e(this._element).off(ie.CLICK_DISMISS), e(this._dialog).off(ie.MOUSEDOWN_DISMISS), s) {
                                var o = c.getTransitionDurationFromElement(this._element);
                                e(this._element).one(c.TRANSITION_END, function (t) {
                                    return i._hideModal(t)
                                }).emulateTransitionEnd(o)
                            } else this._hideModal()
                        }
                    }
                }, i.dispose = function () {
                    [window, this._element, this._dialog].forEach(function (t) {
                        return e(t).off(Xt)
                    }), e(document).off(ie.FOCUSIN), e.removeData(this._element, Gt), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null
                }, i.handleUpdate = function () {
                    this._adjustDialog()
                }, i._getConfig = function (t) {
                    return t = o({}, te, t), c.typeCheckConfig(Zt, t, ee), t
                }, i._showElement = function (t) {
                    var i = this,
                        n = e(this._element).hasClass(re);
                    this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), e(this._dialog).hasClass(ne) ? this._dialog.querySelector(de).scrollTop = 0 : this._element.scrollTop = 0, n && c.reflow(this._element), e(this._element).addClass(le), this._config.focus && this._enforceFocus();
                    var s = e.Event(ie.SHOWN, {
                        relatedTarget: t
                    }),
                        o = function () {
                            i._config.focus && i._element.focus(), i._isTransitioning = !1, e(i._element).trigger(s)
                        };
                    if (n) {
                        var a = c.getTransitionDurationFromElement(this._dialog);
                        e(this._dialog).one(c.TRANSITION_END, o).emulateTransitionEnd(a)
                    } else o()
                }, i._enforceFocus = function () {
                    var t = this;
                    e(document).off(ie.FOCUSIN).on(ie.FOCUSIN, function (i) {
                        document !== i.target && t._element !== i.target && 0 === e(t._element).has(i.target).length && t._element.focus()
                    })
                }, i._setEscapeEvent = function () {
                    var t = this;
                    this._isShown && this._config.keyboard ? e(this._element).on(ie.KEYDOWN_DISMISS, function (e) {
                        27 === e.which && (e.preventDefault(), t.hide())
                    }) : this._isShown || e(this._element).off(ie.KEYDOWN_DISMISS)
                }, i._setResizeEvent = function () {
                    var t = this;
                    this._isShown ? e(window).on(ie.RESIZE, function (e) {
                        return t.handleUpdate(e)
                    }) : e(window).off(ie.RESIZE)
                }, i._hideModal = function () {
                    var t = this;
                    this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._isTransitioning = !1, this._showBackdrop(function () {
                        e(document.body).removeClass(ae), t._resetAdjustments(), t._resetScrollbar(), e(t._element).trigger(ie.HIDDEN)
                    })
                }, i._removeBackdrop = function () {
                    this._backdrop && (e(this._backdrop).remove(), this._backdrop = null)
                }, i._showBackdrop = function (t) {
                    var i = this,
                        n = e(this._element).hasClass(re) ? re : "";
                    if (this._isShown && this._config.backdrop) {
                        if (this._backdrop = document.createElement("div"), this._backdrop.className = oe, n && this._backdrop.classList.add(n), e(this._backdrop).appendTo(document.body), e(this._element).on(ie.CLICK_DISMISS, function (t) {
                            i._ignoreBackdropClick ? i._ignoreBackdropClick = !1 : t.target === t.currentTarget && ("static" === i._config.backdrop ? i._element.focus() : i.hide())
                        }), n && c.reflow(this._backdrop), e(this._backdrop).addClass(le), !t) return;
                        if (!n) return void t();
                        var s = c.getTransitionDurationFromElement(this._backdrop);
                        e(this._backdrop).one(c.TRANSITION_END, t).emulateTransitionEnd(s)
                    } else if (!this._isShown && this._backdrop) {
                        e(this._backdrop).removeClass(le);
                        var o = function () {
                            i._removeBackdrop(), t && t()
                        };
                        if (e(this._element).hasClass(re)) {
                            var a = c.getTransitionDurationFromElement(this._backdrop);
                            e(this._backdrop).one(c.TRANSITION_END, o).emulateTransitionEnd(a)
                        } else o()
                    } else t && t()
                }, i._adjustDialog = function () {
                    var t = this._element.scrollHeight > document.documentElement.clientHeight;
                    !this._isBodyOverflowing && t && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !t && (this._element.style.paddingRight = this._scrollbarWidth + "px")
                }, i._resetAdjustments = function () {
                    this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
                }, i._checkScrollbar = function () {
                    var t = document.body.getBoundingClientRect();
                    this._isBodyOverflowing = t.left + t.right < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth()
                }, i._setScrollbar = function () {
                    var t = this;
                    if (this._isBodyOverflowing) {
                        var i = [].slice.call(document.querySelectorAll(he)),
                            n = [].slice.call(document.querySelectorAll(pe));
                        e(i).each(function (i, n) {
                            var s = n.style.paddingRight,
                                o = e(n).css("padding-right");
                            e(n).data("padding-right", s).css("padding-right", parseFloat(o) + t._scrollbarWidth + "px")
                        }), e(n).each(function (i, n) {
                            var s = n.style.marginRight,
                                o = e(n).css("margin-right");
                            e(n).data("margin-right", s).css("margin-right", parseFloat(o) - t._scrollbarWidth + "px")
                        });
                        var s = document.body.style.paddingRight,
                            o = e(document.body).css("padding-right");
                        e(document.body).data("padding-right", s).css("padding-right", parseFloat(o) + this._scrollbarWidth + "px")
                    }
                    e(document.body).addClass(ae)
                }, i._resetScrollbar = function () {
                    var t = [].slice.call(document.querySelectorAll(he));
                    e(t).each(function (t, i) {
                        var n = e(i).data("padding-right");
                        e(i).removeData("padding-right"), i.style.paddingRight = n || ""
                    });
                    var i = [].slice.call(document.querySelectorAll("" + pe));
                    e(i).each(function (t, i) {
                        var n = e(i).data("margin-right");
                        void 0 !== n && e(i).css("margin-right", n).removeData("margin-right")
                    });
                    var n = e(document.body).data("padding-right");
                    e(document.body).removeData("padding-right"), document.body.style.paddingRight = n || ""
                }, i._getScrollbarWidth = function () {
                    var t = document.createElement("div");
                    t.className = se, document.body.appendChild(t);
                    var e = t.getBoundingClientRect().width - t.clientWidth;
                    return document.body.removeChild(t), e
                }, t._jQueryInterface = function (i, n) {
                    return this.each(function () {
                        var s = e(this).data(Gt),
                            a = o({}, te, e(this).data(), "object" == typeof i && i ? i : {});
                        if (s || (s = new t(this, a), e(this).data(Gt, s)), "string" == typeof i) {
                            if (void 0 === s[i]) throw new TypeError('No method named "' + i + '"');
                            s[i](n)
                        } else a.show && s.show(n)
                    })
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return te
                    }
                }]), t
            }();
        e(document).on(ie.CLICK_DATA_API, '[data-toggle="modal"]', function (t) {
            var i, n = this,
                s = c.getSelectorFromElement(this);
            s && (i = document.querySelector(s));
            var a = e(i).data(Gt) ? "toggle" : o({}, e(i).data(), e(this).data());
            "A" !== this.tagName && "AREA" !== this.tagName || t.preventDefault();
            var r = e(i).one(ie.SHOW, function (t) {
                t.isDefaultPrevented() || r.one(ie.HIDDEN, function () {
                    e(n).is(":visible") && n.focus()
                })
            });
            fe._jQueryInterface.call(e(i), a, this)
        }), e.fn[Zt] = fe._jQueryInterface, e.fn[Zt].Constructor = fe, e.fn[Zt].noConflict = function () {
            return e.fn[Zt] = Jt, fe._jQueryInterface
        };
        var me = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"],
            ge = {
                "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
                a: ["target", "href", "title", "rel"],
                area: [],
                b: [],
                br: [],
                col: [],
                code: [],
                div: [],
                em: [],
                hr: [],
                h1: [],
                h2: [],
                h3: [],
                h4: [],
                h5: [],
                h6: [],
                i: [],
                img: ["src", "alt", "title", "width", "height"],
                li: [],
                ol: [],
                p: [],
                pre: [],
                s: [],
                small: [],
                span: [],
                sub: [],
                sup: [],
                strong: [],
                u: [],
                ul: []
            },
            ve = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:\/?#]*(?:[\/?#]|$))/gi,
            _e = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i,
            ye = "tooltip",
            be = "bs.tooltip",
            we = "." + be,
            xe = e.fn[ye],
            Ce = "bs-tooltip",
            ke = new RegExp("(^|\\s)" + Ce + "\\S+", "g"),
            Se = ["sanitize", "whiteList", "sanitizeFn"],
            Te = {
                animation: "boolean",
                template: "string",
                title: "(string|element|function)",
                trigger: "string",
                delay: "(number|object)",
                html: "boolean",
                selector: "(string|boolean)",
                placement: "(string|function)",
                offset: "(number|string|function)",
                container: "(string|element|boolean)",
                fallbackPlacement: "(string|array)",
                boundary: "(string|element)",
                sanitize: "boolean",
                sanitizeFn: "(null|function)",
                whiteList: "object"
            },
            Ie = {
                AUTO: "auto",
                TOP: "top",
                RIGHT: "right",
                BOTTOM: "bottom",
                LEFT: "left"
            },
            De = {
                animation: !0,
                template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: "hover focus",
                title: "",
                delay: 0,
                html: !1,
                selector: !1,
                placement: "top",
                offset: 0,
                container: !1,
                fallbackPlacement: "flip",
                boundary: "scrollParent",
                sanitize: !0,
                sanitizeFn: null,
                whiteList: ge
            },
            Ee = "show",
            Ae = "out",
            Pe = {
                HIDE: "hide" + we,
                HIDDEN: "hidden" + we,
                SHOW: "show" + we,
                SHOWN: "shown" + we,
                INSERTED: "inserted" + we,
                CLICK: "click" + we,
                FOCUSIN: "focusin" + we,
                FOCUSOUT: "focusout" + we,
                MOUSEENTER: "mouseenter" + we,
                MOUSELEAVE: "mouseleave" + we
            },
            Me = "fade",
            je = "show",
            $e = ".tooltip-inner",
            Oe = ".arrow",
            Ne = "hover",
            Le = "focus",
            ze = "click",
            Fe = "manual",
            He = function () {
                function t(t, e) {
                    if (void 0 === i) throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");
                    this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = t, this.config = this._getConfig(e), this.tip = null, this._setListeners()
                }

                var n = t.prototype;
                return n.enable = function () {
                    this._isEnabled = !0
                }, n.disable = function () {
                    this._isEnabled = !1
                }, n.toggleEnabled = function () {
                    this._isEnabled = !this._isEnabled
                }, n.toggle = function (t) {
                    if (this._isEnabled)
                        if (t) {
                            var i = this.constructor.DATA_KEY,
                                n = e(t.currentTarget).data(i);
                            n || (n = new this.constructor(t.currentTarget, this._getDelegateConfig()), e(t.currentTarget).data(i, n)), n._activeTrigger.click = !n._activeTrigger.click, n._isWithActiveTrigger() ? n._enter(null, n) : n._leave(null, n)
                        } else {
                            if (e(this.getTipElement()).hasClass(je)) return void this._leave(null, this);
                            this._enter(null, this)
                        }
                }, n.dispose = function () {
                    clearTimeout(this._timeout), e.removeData(this.element, this.constructor.DATA_KEY), e(this.element).off(this.constructor.EVENT_KEY), e(this.element).closest(".modal").off("hide.bs.modal"), this.tip && e(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, (this._activeTrigger = null) !== this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null
                }, n.show = function () {
                    var t = this;
                    if ("none" === e(this.element).css("display")) throw new Error("Please use show on visible elements");
                    var n = e.Event(this.constructor.Event.SHOW);
                    if (this.isWithContent() && this._isEnabled) {
                        e(this.element).trigger(n);
                        var s = c.findShadowRoot(this.element),
                            o = e.contains(null !== s ? s : this.element.ownerDocument.documentElement, this.element);
                        if (n.isDefaultPrevented() || !o) return;
                        var a = this.getTipElement(),
                            r = c.getUID(this.constructor.NAME);
                        a.setAttribute("id", r), this.element.setAttribute("aria-describedby", r), this.setContent(), this.config.animation && e(a).addClass(Me);
                        var l = "function" == typeof this.config.placement ? this.config.placement.call(this, a, this.element) : this.config.placement,
                            d = this._getAttachment(l);
                        this.addAttachmentClass(d);
                        var u = this._getContainer();
                        e(a).data(this.constructor.DATA_KEY, this), e.contains(this.element.ownerDocument.documentElement, this.tip) || e(a).appendTo(u), e(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new i(this.element, a, {
                            placement: d,
                            modifiers: {
                                offset: this._getOffset(),
                                flip: {
                                    behavior: this.config.fallbackPlacement
                                },
                                arrow: {
                                    element: Oe
                                },
                                preventOverflow: {
                                    boundariesElement: this.config.boundary
                                }
                            },
                            onCreate: function (e) {
                                e.originalPlacement !== e.placement && t._handlePopperPlacementChange(e)
                            },
                            onUpdate: function (e) {
                                return t._handlePopperPlacementChange(e)
                            }
                        }), e(a).addClass(je), "ontouchstart" in document.documentElement && e(document.body).children().on("mouseover", null, e.noop);
                        var h = function () {
                            t.config.animation && t._fixTransition();
                            var i = t._hoverState;
                            t._hoverState = null, e(t.element).trigger(t.constructor.Event.SHOWN), i === Ae && t._leave(null, t)
                        };
                        if (e(this.tip).hasClass(Me)) {
                            var p = c.getTransitionDurationFromElement(this.tip);
                            e(this.tip).one(c.TRANSITION_END, h).emulateTransitionEnd(p)
                        } else h()
                    }
                }, n.hide = function (t) {
                    var i = this,
                        n = this.getTipElement(),
                        s = e.Event(this.constructor.Event.HIDE),
                        o = function () {
                            i._hoverState !== Ee && n.parentNode && n.parentNode.removeChild(n), i._cleanTipClass(), i.element.removeAttribute("aria-describedby"), e(i.element).trigger(i.constructor.Event.HIDDEN), null !== i._popper && i._popper.destroy(), t && t()
                        };
                    if (e(this.element).trigger(s), !s.isDefaultPrevented()) {
                        if (e(n).removeClass(je), "ontouchstart" in document.documentElement && e(document.body).children().off("mouseover", null, e.noop), this._activeTrigger[ze] = !1, this._activeTrigger[Le] = !1, this._activeTrigger[Ne] = !1, e(this.tip).hasClass(Me)) {
                            var a = c.getTransitionDurationFromElement(n);
                            e(n).one(c.TRANSITION_END, o).emulateTransitionEnd(a)
                        } else o();
                        this._hoverState = ""
                    }
                }, n.update = function () {
                    null !== this._popper && this._popper.scheduleUpdate()
                }, n.isWithContent = function () {
                    return Boolean(this.getTitle())
                }, n.addAttachmentClass = function (t) {
                    e(this.getTipElement()).addClass(Ce + "-" + t)
                }, n.getTipElement = function () {
                    return this.tip = this.tip || e(this.config.template)[0], this.tip
                }, n.setContent = function () {
                    var t = this.getTipElement();
                    this.setElementContent(e(t.querySelectorAll($e)), this.getTitle()), e(t).removeClass(Me + " " + je)
                }, n.setElementContent = function (t, i) {
                    "object" != typeof i || !i.nodeType && !i.jquery ? this.config.html ? (this.config.sanitize && (i = r(i, this.config.whiteList, this.config.sanitizeFn)), t.html(i)) : t.text(i) : this.config.html ? e(i).parent().is(t) || t.empty().append(i) : t.text(e(i).text())
                }, n.getTitle = function () {
                    var t = this.element.getAttribute("data-original-title");
                    return t || (t = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), t
                }, n._getOffset = function () {
                    var t = this,
                        e = {};
                    return "function" == typeof this.config.offset ? e.fn = function (e) {
                        return e.offsets = o({}, e.offsets, t.config.offset(e.offsets, t.element) || {}), e
                    } : e.offset = this.config.offset, e
                }, n._getContainer = function () {
                    return !1 === this.config.container ? document.body : c.isElement(this.config.container) ? e(this.config.container) : e(document).find(this.config.container)
                }, n._getAttachment = function (t) {
                    return Ie[t.toUpperCase()]
                }, n._setListeners = function () {
                    var t = this;
                    this.config.trigger.split(" ").forEach(function (i) {
                        if ("click" === i) e(t.element).on(t.constructor.Event.CLICK, t.config.selector, function (e) {
                            return t.toggle(e)
                        });
                        else if (i !== Fe) {
                            var n = i === Ne ? t.constructor.Event.MOUSEENTER : t.constructor.Event.FOCUSIN,
                                s = i === Ne ? t.constructor.Event.MOUSELEAVE : t.constructor.Event.FOCUSOUT;
                            e(t.element).on(n, t.config.selector, function (e) {
                                return t._enter(e)
                            }).on(s, t.config.selector, function (e) {
                                return t._leave(e)
                            })
                        }
                    }), e(this.element).closest(".modal").on("hide.bs.modal", function () {
                        t.element && t.hide()
                    }), this.config.selector ? this.config = o({}, this.config, {
                        trigger: "manual",
                        selector: ""
                    }) : this._fixTitle()
                }, n._fixTitle = function () {
                    var t = typeof this.element.getAttribute("data-original-title");
                    (this.element.getAttribute("title") || "string" !== t) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""))
                }, n._enter = function (t, i) {
                    var n = this.constructor.DATA_KEY;
                    (i = i || e(t.currentTarget).data(n)) || (i = new this.constructor(t.currentTarget, this._getDelegateConfig()), e(t.currentTarget).data(n, i)), t && (i._activeTrigger["focusin" === t.type ? Le : Ne] = !0), e(i.getTipElement()).hasClass(je) || i._hoverState === Ee ? i._hoverState = Ee : (clearTimeout(i._timeout), i._hoverState = Ee, i.config.delay && i.config.delay.show ? i._timeout = setTimeout(function () {
                        i._hoverState === Ee && i.show()
                    }, i.config.delay.show) : i.show())
                }, n._leave = function (t, i) {
                    var n = this.constructor.DATA_KEY;
                    (i = i || e(t.currentTarget).data(n)) || (i = new this.constructor(t.currentTarget, this._getDelegateConfig()), e(t.currentTarget).data(n, i)), t && (i._activeTrigger["focusout" === t.type ? Le : Ne] = !1), i._isWithActiveTrigger() || (clearTimeout(i._timeout), i._hoverState = Ae, i.config.delay && i.config.delay.hide ? i._timeout = setTimeout(function () {
                        i._hoverState === Ae && i.hide()
                    }, i.config.delay.hide) : i.hide())
                }, n._isWithActiveTrigger = function () {
                    for (var t in this._activeTrigger)
                        if (this._activeTrigger[t]) return !0;
                    return !1
                }, n._getConfig = function (t) {
                    var i = e(this.element).data();
                    return Object.keys(i).forEach(function (t) {
                        -1 !== Se.indexOf(t) && delete i[t]
                    }), "number" == typeof (t = o({}, this.constructor.Default, i, "object" == typeof t && t ? t : {})).delay && (t.delay = {
                        show: t.delay,
                        hide: t.delay
                    }), "number" == typeof t.title && (t.title = t.title.toString()), "number" == typeof t.content && (t.content = t.content.toString()), c.typeCheckConfig(ye, t, this.constructor.DefaultType), t.sanitize && (t.template = r(t.template, t.whiteList, t.sanitizeFn)), t
                }, n._getDelegateConfig = function () {
                    var t = {};
                    if (this.config)
                        for (var e in this.config) this.constructor.Default[e] !== this.config[e] && (t[e] = this.config[e]);
                    return t
                }, n._cleanTipClass = function () {
                    var t = e(this.getTipElement()),
                        i = t.attr("class").match(ke);
                    null !== i && i.length && t.removeClass(i.join(""))
                }, n._handlePopperPlacementChange = function (t) {
                    var e = t.instance;
                    this.tip = e.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(t.placement))
                }, n._fixTransition = function () {
                    var t = this.getTipElement(),
                        i = this.config.animation;
                    null === t.getAttribute("x-placement") && (e(t).removeClass(Me), this.config.animation = !1, this.hide(), this.show(), this.config.animation = i)
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this).data(be),
                            s = "object" == typeof i && i;
                        if ((n || !/dispose|hide/.test(i)) && (n || (n = new t(this, s), e(this).data(be, n)), "string" == typeof i)) {
                            if (void 0 === n[i]) throw new TypeError('No method named "' + i + '"');
                            n[i]()
                        }
                    })
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return De
                    }
                }, {
                    key: "NAME",
                    get: function () {
                        return ye
                    }
                }, {
                    key: "DATA_KEY",
                    get: function () {
                        return be
                    }
                }, {
                    key: "Event",
                    get: function () {
                        return Pe
                    }
                }, {
                    key: "EVENT_KEY",
                    get: function () {
                        return we
                    }
                }, {
                    key: "DefaultType",
                    get: function () {
                        return Te
                    }
                }]), t
            }();
        e.fn[ye] = He._jQueryInterface, e.fn[ye].Constructor = He, e.fn[ye].noConflict = function () {
            return e.fn[ye] = xe, He._jQueryInterface
        };
        var We = "popover",
            Re = "bs.popover",
            Be = "." + Re,
            qe = e.fn[We],
            Ue = "bs-popover",
            Ye = new RegExp("(^|\\s)" + Ue + "\\S+", "g"),
            Ke = o({}, He.Default, {
                placement: "right",
                trigger: "click",
                content: "",
                template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
            }),
            Ve = o({}, He.DefaultType, {
                content: "(string|element|function)"
            }),
            Qe = "fade",
            Ze = "show",
            Ge = ".popover-header",
            Xe = ".popover-body",
            Je = {
                HIDE: "hide" + Be,
                HIDDEN: "hidden" + Be,
                SHOW: "show" + Be,
                SHOWN: "shown" + Be,
                INSERTED: "inserted" + Be,
                CLICK: "click" + Be,
                FOCUSIN: "focusin" + Be,
                FOCUSOUT: "focusout" + Be,
                MOUSEENTER: "mouseenter" + Be,
                MOUSELEAVE: "mouseleave" + Be
            },
            ti = function (t) {
                function i() {
                    return t.apply(this, arguments) || this
                }

                var n, o;
                o = t, (n = i).prototype = Object.create(o.prototype), (n.prototype.constructor = n).__proto__ = o;
                var a = i.prototype;
                return a.isWithContent = function () {
                    return this.getTitle() || this._getContent()
                }, a.addAttachmentClass = function (t) {
                    e(this.getTipElement()).addClass(Ue + "-" + t)
                }, a.getTipElement = function () {
                    return this.tip = this.tip || e(this.config.template)[0], this.tip
                }, a.setContent = function () {
                    var t = e(this.getTipElement());
                    this.setElementContent(t.find(Ge), this.getTitle());
                    var i = this._getContent();
                    "function" == typeof i && (i = i.call(this.element)), this.setElementContent(t.find(Xe), i), t.removeClass(Qe + " " + Ze)
                }, a._getContent = function () {
                    return this.element.getAttribute("data-content") || this.config.content
                }, a._cleanTipClass = function () {
                    var t = e(this.getTipElement()),
                        i = t.attr("class").match(Ye);
                    null !== i && 0 < i.length && t.removeClass(i.join(""))
                }, i._jQueryInterface = function (t) {
                    return this.each(function () {
                        var n = e(this).data(Re),
                            s = "object" == typeof t ? t : null;
                        if ((n || !/dispose|hide/.test(t)) && (n || (n = new i(this, s), e(this).data(Re, n)), "string" == typeof t)) {
                            if (void 0 === n[t]) throw new TypeError('No method named "' + t + '"');
                            n[t]()
                        }
                    })
                }, s(i, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return Ke
                    }
                }, {
                    key: "NAME",
                    get: function () {
                        return We
                    }
                }, {
                    key: "DATA_KEY",
                    get: function () {
                        return Re
                    }
                }, {
                    key: "Event",
                    get: function () {
                        return Je
                    }
                }, {
                    key: "EVENT_KEY",
                    get: function () {
                        return Be
                    }
                }, {
                    key: "DefaultType",
                    get: function () {
                        return Ve
                    }
                }]), i
            }(He);
        e.fn[We] = ti._jQueryInterface, e.fn[We].Constructor = ti, e.fn[We].noConflict = function () {
            return e.fn[We] = qe, ti._jQueryInterface
        };
        var ei = "scrollspy",
            ii = "bs.scrollspy",
            ni = "." + ii,
            si = e.fn[ei],
            oi = {
                offset: 10,
                method: "auto",
                target: ""
            },
            ai = {
                offset: "number",
                method: "string",
                target: "(string|element)"
            },
            ri = {
                ACTIVATE: "activate" + ni,
                SCROLL: "scroll" + ni,
                LOAD_DATA_API: "load" + ni + ".data-api"
            },
            li = "dropdown-item",
            ci = "active",
            di = '[data-spy="scroll"]',
            ui = ".nav, .list-group",
            hi = ".nav-link",
            pi = ".nav-item",
            fi = ".list-group-item",
            mi = ".dropdown",
            gi = ".dropdown-item",
            vi = ".dropdown-toggle",
            _i = "offset",
            yi = "position",
            bi = function () {
                function t(t, i) {
                    var n = this;
                    this._element = t, this._scrollElement = "BODY" === t.tagName ? window : t, this._config = this._getConfig(i), this._selector = this._config.target + " " + hi + "," + this._config.target + " " + fi + "," + this._config.target + " " + gi, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, e(this._scrollElement).on(ri.SCROLL, function (t) {
                        return n._process(t)
                    }), this.refresh(), this._process()
                }

                var i = t.prototype;
                return i.refresh = function () {
                    var t = this,
                        i = this._scrollElement === this._scrollElement.window ? _i : yi,
                        n = "auto" === this._config.method ? i : this._config.method,
                        s = n === yi ? this._getScrollTop() : 0;
                    this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function (t) {
                        var i, o = c.getSelectorFromElement(t);
                        if (o && (i = document.querySelector(o)), i) {
                            var a = i.getBoundingClientRect();
                            if (a.width || a.height) return [e(i)[n]().top + s, o]
                        }
                        return null
                    }).filter(function (t) {
                        return t
                    }).sort(function (t, e) {
                        return t[0] - e[0]
                    }).forEach(function (e) {
                        t._offsets.push(e[0]), t._targets.push(e[1])
                    })
                }, i.dispose = function () {
                    e.removeData(this._element, ii), e(this._scrollElement).off(ni), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null
                }, i._getConfig = function (t) {
                    if ("string" != typeof (t = o({}, oi, "object" == typeof t && t ? t : {})).target) {
                        var i = e(t.target).attr("id");
                        i || (i = c.getUID(ei), e(t.target).attr("id", i)), t.target = "#" + i
                    }
                    return c.typeCheckConfig(ei, t, ai), t
                }, i._getScrollTop = function () {
                    return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
                }, i._getScrollHeight = function () {
                    return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                }, i._getOffsetHeight = function () {
                    return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
                }, i._process = function () {
                    var t = this._getScrollTop() + this._config.offset,
                        e = this._getScrollHeight(),
                        i = this._config.offset + e - this._getOffsetHeight();
                    if (this._scrollHeight !== e && this.refresh(), i <= t) {
                        var n = this._targets[this._targets.length - 1];
                        this._activeTarget !== n && this._activate(n)
                    } else {
                        if (this._activeTarget && t < this._offsets[0] && 0 < this._offsets[0]) return this._activeTarget = null, void this._clear();
                        for (var s = this._offsets.length; s--;) this._activeTarget !== this._targets[s] && t >= this._offsets[s] && (void 0 === this._offsets[s + 1] || t < this._offsets[s + 1]) && this._activate(this._targets[s])
                    }
                }, i._activate = function (t) {
                    this._activeTarget = t, this._clear();
                    var i = this._selector.split(",").map(function (e) {
                        return e + '[data-target="' + t + '"],' + e + '[href="' + t + '"]'
                    }),
                        n = e([].slice.call(document.querySelectorAll(i.join(","))));
                    n.hasClass(li) ? (n.closest(mi).find(vi).addClass(ci), n.addClass(ci)) : (n.addClass(ci), n.parents(ui).prev(hi + ", " + fi).addClass(ci), n.parents(ui).prev(pi).children(hi).addClass(ci)), e(this._scrollElement).trigger(ri.ACTIVATE, {
                        relatedTarget: t
                    })
                }, i._clear = function () {
                    [].slice.call(document.querySelectorAll(this._selector)).filter(function (t) {
                        return t.classList.contains(ci)
                    }).forEach(function (t) {
                        return t.classList.remove(ci)
                    })
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this).data(ii);
                        if (n || (n = new t(this, "object" == typeof i && i), e(this).data(ii, n)), "string" == typeof i) {
                            if (void 0 === n[i]) throw new TypeError('No method named "' + i + '"');
                            n[i]()
                        }
                    })
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return oi
                    }
                }]), t
            }();
        e(window).on(ri.LOAD_DATA_API, function () {
            for (var t = [].slice.call(document.querySelectorAll(di)), i = t.length; i--;) {
                var n = e(t[i]);
                bi._jQueryInterface.call(n, n.data())
            }
        }), e.fn[ei] = bi._jQueryInterface, e.fn[ei].Constructor = bi, e.fn[ei].noConflict = function () {
            return e.fn[ei] = si, bi._jQueryInterface
        };
        var wi = "bs.tab",
            xi = "." + wi,
            Ci = e.fn.tab,
            ki = {
                HIDE: "hide" + xi,
                HIDDEN: "hidden" + xi,
                SHOW: "show" + xi,
                SHOWN: "shown" + xi,
                CLICK_DATA_API: "click" + xi + ".data-api"
            },
            Si = "dropdown-menu",
            Ti = "active",
            Ii = "disabled",
            Di = "fade",
            Ei = "show",
            Ai = ".dropdown",
            Pi = ".nav, .list-group",
            Mi = ".active",
            ji = "> li > .active",
            $i = ".dropdown-toggle",
            Oi = "> .dropdown-menu .active",
            Ni = function () {
                function t(t) {
                    this._element = t
                }

                var i = t.prototype;
                return i.show = function () {
                    var t = this;
                    if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && e(this._element).hasClass(Ti) || e(this._element).hasClass(Ii))) {
                        var i, n, s = e(this._element).closest(Pi)[0],
                            o = c.getSelectorFromElement(this._element);
                        if (s) {
                            var a = "UL" === s.nodeName || "OL" === s.nodeName ? ji : Mi;
                            n = (n = e.makeArray(e(s).find(a)))[n.length - 1]
                        }
                        var r = e.Event(ki.HIDE, {
                            relatedTarget: this._element
                        }),
                            l = e.Event(ki.SHOW, {
                                relatedTarget: n
                            });
                        if (n && e(n).trigger(r), e(this._element).trigger(l), !l.isDefaultPrevented() && !r.isDefaultPrevented()) {
                            o && (i = document.querySelector(o)), this._activate(this._element, s);
                            var d = function () {
                                var i = e.Event(ki.HIDDEN, {
                                    relatedTarget: t._element
                                }),
                                    s = e.Event(ki.SHOWN, {
                                        relatedTarget: n
                                    });
                                e(n).trigger(i), e(t._element).trigger(s)
                            };
                            i ? this._activate(i, i.parentNode, d) : d()
                        }
                    }
                }, i.dispose = function () {
                    e.removeData(this._element, wi), this._element = null
                }, i._activate = function (t, i, n) {
                    var s = this,
                        o = (!i || "UL" !== i.nodeName && "OL" !== i.nodeName ? e(i).children(Mi) : e(i).find(ji))[0],
                        a = n && o && e(o).hasClass(Di),
                        r = function () {
                            return s._transitionComplete(t, o, n)
                        };
                    if (o && a) {
                        var l = c.getTransitionDurationFromElement(o);
                        e(o).removeClass(Ei).one(c.TRANSITION_END, r).emulateTransitionEnd(l)
                    } else r()
                }, i._transitionComplete = function (t, i, n) {
                    if (i) {
                        e(i).removeClass(Ti);
                        var s = e(i.parentNode).find(Oi)[0];
                        s && e(s).removeClass(Ti), "tab" === i.getAttribute("role") && i.setAttribute("aria-selected", !1)
                    }
                    if (e(t).addClass(Ti), "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !0), c.reflow(t), t.classList.contains(Di) && t.classList.add(Ei), t.parentNode && e(t.parentNode).hasClass(Si)) {
                        var o = e(t).closest(Ai)[0];
                        if (o) {
                            var a = [].slice.call(o.querySelectorAll($i));
                            e(a).addClass(Ti)
                        }
                        t.setAttribute("aria-expanded", !0)
                    }
                    n && n()
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this),
                            s = n.data(wi);
                        if (s || (s = new t(this), n.data(wi, s)), "string" == typeof i) {
                            if (void 0 === s[i]) throw new TypeError('No method named "' + i + '"');
                            s[i]()
                        }
                    })
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }]), t
            }();
        e(document).on(ki.CLICK_DATA_API, '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]', function (t) {
            t.preventDefault(), Ni._jQueryInterface.call(e(this), "show")
        }), e.fn.tab = Ni._jQueryInterface, e.fn.tab.Constructor = Ni, e.fn.tab.noConflict = function () {
            return e.fn.tab = Ci, Ni._jQueryInterface
        };
        var Li = "toast",
            zi = "bs.toast",
            Fi = "." + zi,
            Hi = e.fn[Li],
            Wi = {
                CLICK_DISMISS: "click.dismiss" + Fi,
                HIDE: "hide" + Fi,
                HIDDEN: "hidden" + Fi,
                SHOW: "show" + Fi,
                SHOWN: "shown" + Fi
            },
            Ri = "fade",
            Bi = "hide",
            qi = "show",
            Ui = "showing",
            Yi = {
                animation: "boolean",
                autohide: "boolean",
                delay: "number"
            },
            Ki = {
                animation: !0,
                autohide: !0,
                delay: 500
            },
            Vi = '[data-dismiss="toast"]',
            Qi = function () {
                function t(t, e) {
                    this._element = t, this._config = this._getConfig(e), this._timeout = null, this._setListeners()
                }

                var i = t.prototype;
                return i.show = function () {
                    var t = this;
                    e(this._element).trigger(Wi.SHOW), this._config.animation && this._element.classList.add(Ri);
                    var i = function () {
                        t._element.classList.remove(Ui), t._element.classList.add(qi), e(t._element).trigger(Wi.SHOWN), t._config.autohide && t.hide()
                    };
                    if (this._element.classList.remove(Bi), this._element.classList.add(Ui), this._config.animation) {
                        var n = c.getTransitionDurationFromElement(this._element);
                        e(this._element).one(c.TRANSITION_END, i).emulateTransitionEnd(n)
                    } else i()
                }, i.hide = function (t) {
                    var i = this;
                    this._element.classList.contains(qi) && (e(this._element).trigger(Wi.HIDE), t ? this._close() : this._timeout = setTimeout(function () {
                        i._close()
                    }, this._config.delay))
                }, i.dispose = function () {
                    clearTimeout(this._timeout), this._timeout = null, this._element.classList.contains(qi) && this._element.classList.remove(qi), e(this._element).off(Wi.CLICK_DISMISS), e.removeData(this._element, zi), this._element = null, this._config = null
                }, i._getConfig = function (t) {
                    return t = o({}, Ki, e(this._element).data(), "object" == typeof t && t ? t : {}), c.typeCheckConfig(Li, t, this.constructor.DefaultType), t
                }, i._setListeners = function () {
                    var t = this;
                    e(this._element).on(Wi.CLICK_DISMISS, Vi, function () {
                        return t.hide(!0)
                    })
                }, i._close = function () {
                    var t = this,
                        i = function () {
                            t._element.classList.add(Bi), e(t._element).trigger(Wi.HIDDEN)
                        };
                    if (this._element.classList.remove(qi), this._config.animation) {
                        var n = c.getTransitionDurationFromElement(this._element);
                        e(this._element).one(c.TRANSITION_END, i).emulateTransitionEnd(n)
                    } else i()
                }, t._jQueryInterface = function (i) {
                    return this.each(function () {
                        var n = e(this),
                            s = n.data(zi);
                        if (s || (s = new t(this, "object" == typeof i && i), n.data(zi, s)), "string" == typeof i) {
                            if (void 0 === s[i]) throw new TypeError('No method named "' + i + '"');
                            s[i](this)
                        }
                    })
                }, s(t, null, [{
                    key: "VERSION",
                    get: function () {
                        return "4.3.1"
                    }
                }, {
                    key: "DefaultType",
                    get: function () {
                        return Yi
                    }
                }, {
                    key: "Default",
                    get: function () {
                        return Ki
                    }
                }]), t
            }();
        e.fn[Li] = Qi._jQueryInterface, e.fn[Li].Constructor = Qi, e.fn[Li].noConflict = function () {
            return e.fn[Li] = Hi, Qi._jQueryInterface
        },
            function () {
                if (void 0 === e) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
                var t = e.fn.jquery.split(" ")[0].split(".");
                if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
            }(), t.Util = c, t.Alert = _, t.Button = P, t.Carousel = at, t.Collapse = xt, t.Dropdown = Qt, t.Modal = fe, t.Popover = ti, t.Scrollspy = bi, t.Tab = Ni, t.Toast = Qi, t.Tooltip = He, Object.defineProperty(t, "__esModule", {
                value: !0
            })
    }),
    function (t) {
        "use strict";

        function e() {
        }

        function i() {
            try {
                return document.activeElement
            } catch (t) {
            }
        }

        function n(t, e) {
            for (var i = 0, n = t.length; n > i; i++)
                if (t[i] === e) return !0;
            return !1
        }

        function s(t, e, i) {
            return t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent ? t.attachEvent("on" + e, i) : void 0
        }

        function o(t, e) {
            var i;
            t.createTextRange ? (i = t.createTextRange(), i.move("character", e), i.select()) : t.selectionStart && (t.focus(), t.setSelectionRange(e, e))
        }

        function a(t, e) {
            try {
                return t.type = e, !0
            } catch (t) {
                return !1
            }
        }

        function r(t, e) {
            if (t && t.getAttribute(I)) e(t);
            else
                for (var i, n = t ? t.getElementsByTagName("input") : F, s = t ? t.getElementsByTagName("textarea") : H, o = n ? n.length : 0, a = s ? s.length : 0, r = o + a, l = 0; r > l; l++) i = o > l ? n[l] : s[l - o], e(i)
        }

        function l(t) {
            r(t, d)
        }

        function c(t) {
            r(t, u)
        }

        function d(t, e) {
            var i = !!e && t.value !== e,
                n = t.value === t.getAttribute(I);
            if ((i || n) && "true" === t.getAttribute(D)) {
                t.removeAttribute(D), t.value = t.value.replace(t.getAttribute(I), ""), t.className = t.className.replace(T, "");
                var s = t.getAttribute($);
                parseInt(s, 10) >= 0 && (t.setAttribute("maxLength", s), t.removeAttribute($));
                var o = t.getAttribute(E);
                return o && (t.type = o), !0
            }
            return !1
        }

        function u(t) {
            var e = t.getAttribute(I);
            if ("" === t.value && e) {
                t.setAttribute(D, "true"), t.value = e, t.className += " " + S;
                t.getAttribute($) || (t.setAttribute($, t.maxLength), t.removeAttribute("maxLength"));
                return t.getAttribute(E) ? t.type = "text" : "password" === t.type && a(t, "text") && t.setAttribute(E, "password"), !0
            }
            return !1
        }

        function h(t) {
            return function () {
                W && t.value === t.getAttribute(I) && "true" === t.getAttribute(D) ? o(t, 0) : d(t)
            }
        }

        function p(t) {
            return function () {
                u(t)
            }
        }

        function f(t) {
            return function () {
                l(t)
            }
        }

        function m(t) {
            return function (e) {
                return w = t.value, "true" === t.getAttribute(D) && w === t.getAttribute(I) && n(C, e.keyCode) ? (e.preventDefault && e.preventDefault(), !1) : void 0
            }
        }

        function g(t) {
            return function () {
                d(t, w), "" === t.value && (t.blur(), o(t, 0))
            }
        }

        function v(t) {
            return function () {
                t === i() && t.value === t.getAttribute(I) && "true" === t.getAttribute(D) && o(t, 0)
            }
        }

        function _(t) {
            var e = t.form;
            e && "string" == typeof e && (e = document.getElementById(e), e.getAttribute(A) || (s(e, "submit", f(e)), e.setAttribute(A, "true"))), s(t, "focus", h(t)), s(t, "blur", p(t)), W && (s(t, "keydown", m(t)), s(t, "keyup", g(t)), s(t, "click", v(t))), t.setAttribute(P, "true"), t.setAttribute(I, U), (W || t !== i()) && u(t)
        }

        var y = document.createElement("input"),
            b = void 0 !== y.placeholder;
        if (t.Placeholders = {
            nativeSupport: b,
            disable: b ? e : l,
            enable: b ? e : c
        }, !b) {
            var w, x = ["text", "search", "url", "tel", "email", "password", "number", "textarea"],
                C = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46],
                k = "#ccc",
                S = "placeholdersjs",
                T = new RegExp("(?:^|\\s)" + S + "(?!\\S)"),
                I = "data-placeholder-value",
                D = "data-placeholder-active",
                E = "data-placeholder-type",
                A = "data-placeholder-submit",
                P = "data-placeholder-bound",
                M = "data-placeholder-focus",
                j = "data-placeholder-live",
                $ = "data-placeholder-maxlength",
                O = 100,
                N = document.getElementsByTagName("head")[0],
                L = document.documentElement,
                z = t.Placeholders,
                F = document.getElementsByTagName("input"),
                H = document.getElementsByTagName("textarea"),
                W = "false" === L.getAttribute(M),
                R = "false" !== L.getAttribute(j),
                B = document.createElement("style");
            B.type = "text/css";
            var q = document.createTextNode("." + S + " {color:" + k + ";}");
            B.styleSheet ? B.styleSheet.cssText = q.nodeValue : B.appendChild(q), N.insertBefore(B, N.firstChild);
            for (var U, Y, K = 0, V = F.length + H.length; V > K; K++) Y = K < F.length ? F[K] : H[K - F.length], (U = Y.attributes.placeholder) && (U = U.nodeValue) && n(x, Y.type) && _(Y);
            var Q = setInterval(function () {
                for (var t = 0, e = F.length + H.length; e > t; t++) Y = t < F.length ? F[t] : H[t - F.length], U = Y.attributes.placeholder, U ? (U = U.nodeValue) && n(x, Y.type) && (Y.getAttribute(P) || _(Y), (U !== Y.getAttribute(I) || "password" === Y.type && !Y.getAttribute(E)) && ("password" === Y.type && !Y.getAttribute(E) && a(Y, "text") && Y.setAttribute(E, "password"), Y.value === Y.getAttribute(I) && (Y.value = U), Y.setAttribute(I, U))) : Y.getAttribute(D) && (d(Y), Y.removeAttribute(I));
                R || clearInterval(Q)
            }, O);
            s(t, "beforeunload", function () {
                z.disable()
            })
        }
    }(this),
    function (t) {
        var e = {
            mode: "horizontal",
            slideSelector: "",
            infiniteLoop: !0,
            hideControlOnEnd: !1,
            speed: 500,
            easing: null,
            slideMargin: 0,
            startSlide: 0,
            randomStart: !1,
            captions: !1,
            ticker: !1,
            tickerHover: !1,
            adaptiveHeight: !1,
            adaptiveHeightSpeed: 500,
            video: !1,
            useCSS: !0,
            preloadImages: "visible",
            responsive: !0,
            slideZIndex: 50,
            wrapperClass: "bx-wrapper",
            touchEnabled: !0,
            swipeThreshold: 50,
            oneToOneTouch: !0,
            preventDefaultSwipeX: !0,
            preventDefaultSwipeY: !1,
            ariaLive: !0,
            ariaHidden: !0,
            keyboardEnabled: !1,
            pager: !0,
            pagerType: "full",
            pagerShortSeparator: " / ",
            pagerSelector: null,
            buildPager: null,
            pagerCustom: null,
            controls: !0,
            nextText: "Next",
            prevText: "Prev",
            nextSelector: null,
            prevSelector: null,
            autoControls: !1,
            startText: "Start",
            stopText: "Stop",
            autoControlsCombine: !1,
            autoControlsSelector: null,
            auto: !1,
            pause: 4e3,
            autoStart: !0,
            autoDirection: "next",
            stopAutoOnClick: !1,
            autoHover: !1,
            autoDelay: 0,
            autoSlideForOnePage: !1,
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 0,
            slideWidth: 0,
            shrinkItems: !1,
            onSliderLoad: function () {
                return !0
            },
            onSlideBefore: function () {
                return !0
            },
            onSlideAfter: function () {
                return !0
            },
            onSlideNext: function () {
                return !0
            },
            onSlidePrev: function () {
                return !0
            },
            onSliderResize: function () {
                return !0
            },
            onAutoChange: function () {
                return !0
            }
        };
        t.fn.bxSlider = function (n) {
            if (0 === this.length) return this;
            if (this.length > 1) return this.each(function () {
                t(this).bxSlider(n)
            }), this;
            var s = {},
                o = this,
                a = t(window).width(),
                r = t(window).height();
            if (!t(o).data("bxSlider")) {
                var l = function () {
                    t(o).data("bxSlider") || (s.settings = t.extend({}, e, n), s.settings.slideWidth = parseInt(s.settings.slideWidth), s.children = o.children(s.settings.slideSelector), s.children.length < s.settings.minSlides && (s.settings.minSlides = s.children.length), s.children.length < s.settings.maxSlides && (s.settings.maxSlides = s.children.length), s.settings.randomStart && (s.settings.startSlide = Math.floor(Math.random() * s.children.length)), s.active = {
                        index: s.settings.startSlide
                    }, s.carousel = s.settings.minSlides > 1 || s.settings.maxSlides > 1, s.carousel && (s.settings.preloadImages = "all"), s.minThreshold = s.settings.minSlides * s.settings.slideWidth + (s.settings.minSlides - 1) * s.settings.slideMargin, s.maxThreshold = s.settings.maxSlides * s.settings.slideWidth + (s.settings.maxSlides - 1) * s.settings.slideMargin, s.working = !1, s.controls = {}, s.interval = null, s.animProp = "vertical" === s.settings.mode ? "top" : "left", s.usingCSS = s.settings.useCSS && "fade" !== s.settings.mode && function () {
                        for (var t = document.createElement("div"), e = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"], i = 0; i < e.length; i++)
                            if (void 0 !== t.style[e[i]]) return s.cssPrefix = e[i].replace("Perspective", "").toLowerCase(), s.animProp = "-" + s.cssPrefix + "-transform", !0;
                        return !1
                    }(), "vertical" === s.settings.mode && (s.settings.maxSlides = s.settings.minSlides), o.data("origStyle", o.attr("style")), o.children(s.settings.slideSelector).each(function () {
                        t(this).data("origStyle", t(this).attr("style"))
                    }), c())
                },
                    c = function () {
                        var e = s.children.eq(s.settings.startSlide);
                        o.wrap('<div class="' + s.settings.wrapperClass + '"><div class="bx-viewport"></div></div>'), s.viewport = o.parent(), s.settings.ariaLive && !s.settings.ticker && s.viewport.attr("aria-live", "polite"), s.loader = t('<div class="bx-loading" />'), s.viewport.prepend(s.loader), o.css({
                            width: "horizontal" === s.settings.mode ? 1e3 * s.children.length + 215 + "%" : "auto",
                            position: "relative"
                        }), s.usingCSS && s.settings.easing ? o.css("-" + s.cssPrefix + "-transition-timing-function", s.settings.easing) : s.settings.easing || (s.settings.easing = "swing"), s.viewport.css({
                            width: "100%",
                            overflow: "hidden",
                            position: "relative"
                        }), s.viewport.parent().css({
                            maxWidth: p()
                        }), s.children.css({
                            float: "horizontal" === s.settings.mode ? "left" : "none",
                            listStyle: "none",
                            position: "relative"
                        }), s.children.css("width", f()), "horizontal" === s.settings.mode && s.settings.slideMargin > 0 && s.children.css("marginRight", s.settings.slideMargin), "vertical" === s.settings.mode && s.settings.slideMargin > 0 && s.children.css("marginBottom", s.settings.slideMargin), "fade" === s.settings.mode && (s.children.css({
                            position: "absolute",
                            zIndex: 0,
                            display: "none"
                        }), s.children.eq(s.settings.startSlide).css({
                            zIndex: s.settings.slideZIndex,
                            display: "block"
                        })), s.controls.el = t('<div class="bx-controls" />'), s.settings.captions && k(), s.active.last = s.settings.startSlide === g() - 1, s.settings.video && o.fitVids(), "none" === s.settings.preloadImages ? e = null : ("all" === s.settings.preloadImages || s.settings.ticker) && (e = s.children), s.settings.ticker ? s.settings.pager = !1 : (s.settings.controls && x(), s.settings.auto && s.settings.autoControls && C(), s.settings.pager && w(), (s.settings.controls || s.settings.autoControls || s.settings.pager) && s.viewport.after(s.controls.el)), null === e ? u() : d(e, u)
                    },
                    d = function (e, i) {
                        var n = e.find('img:not([src=""]), iframe').length,
                            s = 0;
                        if (0 === n) return void i();
                        e.find('img:not([src=""]), iframe').each(function () {
                            t(this).one("load error", function () {
                                ++s === n && i()
                            }).each(function () {
                                (this.complete || "" == this.src) && t(this).trigger("load")
                            })
                        })
                    },
                    u = function () {
                        if (s.settings.infiniteLoop && "fade" !== s.settings.mode && !s.settings.ticker) {
                            var e = "vertical" === s.settings.mode ? s.settings.minSlides : s.settings.maxSlides,
                                i = s.children.slice(0, e).clone(!0).addClass("bx-clone"),
                                n = s.children.slice(-e).clone(!0).addClass("bx-clone");
                            s.settings.ariaHidden && (i.attr("aria-hidden", !0), n.attr("aria-hidden", !0)), o.append(i).prepend(n)
                        }
                        s.loader.remove(), _(), "vertical" === s.settings.mode && (s.settings.adaptiveHeight = !0), s.viewport.height(h()), o.redrawSlider(), s.settings.onSliderLoad.call(o, s.active.index), s.initialized = !0, s.settings.responsive && t(window).on("resize", Y), s.settings.auto && s.settings.autoStart && (g() > 1 || s.settings.autoSlideForOnePage) && N(), s.settings.ticker && L(), s.settings.pager && A(s.settings.startSlide), s.settings.controls && j(), s.settings.touchEnabled && !s.settings.ticker && W(), s.settings.keyboardEnabled && !s.settings.ticker && t(document).keydown(H)
                    },
                    h = function () {
                        var e = 0,
                            n = t();
                        if ("vertical" === s.settings.mode || s.settings.adaptiveHeight)
                            if (s.carousel) {
                                var o = 1 === s.settings.moveSlides ? s.active.index : s.active.index * v();
                                for (n = s.children.eq(o), i = 1; i <= s.settings.maxSlides - 1; i++) n = o + i >= s.children.length ? n.add(s.children.eq(i - 1)) : n.add(s.children.eq(o + i))
                            } else n = s.children.eq(s.active.index);
                        else n = s.children;
                        return "vertical" === s.settings.mode ? (n.each(function (i) {
                            e += t(this).outerHeight()
                        }), s.settings.slideMargin > 0 && (e += s.settings.slideMargin * (s.settings.minSlides - 1))) : e = Math.max.apply(Math, n.map(function () {
                            return t(this).outerHeight(!1)
                        }).get()), "border-box" === s.viewport.css("box-sizing") ? e += parseFloat(s.viewport.css("padding-top")) + parseFloat(s.viewport.css("padding-bottom")) + parseFloat(s.viewport.css("border-top-width")) + parseFloat(s.viewport.css("border-bottom-width")) : "padding-box" === s.viewport.css("box-sizing") && (e += parseFloat(s.viewport.css("padding-top")) + parseFloat(s.viewport.css("padding-bottom"))), e
                    },
                    p = function () {
                        var t = "100%";
                        return s.settings.slideWidth > 0 && (t = "horizontal" === s.settings.mode ? s.settings.maxSlides * s.settings.slideWidth + (s.settings.maxSlides - 1) * s.settings.slideMargin : s.settings.slideWidth), t
                    },
                    f = function () {
                        var t = s.settings.slideWidth,
                            e = s.viewport.width();
                        if (0 === s.settings.slideWidth || s.settings.slideWidth > e && !s.carousel || "vertical" === s.settings.mode) t = e;
                        else if (s.settings.maxSlides > 1 && "horizontal" === s.settings.mode) {
                            if (e > s.maxThreshold) return t;
                            e < s.minThreshold ? t = (e - s.settings.slideMargin * (s.settings.minSlides - 1)) / s.settings.minSlides : s.settings.shrinkItems && (t = Math.floor((e + s.settings.slideMargin) / Math.ceil((e + s.settings.slideMargin) / (t + s.settings.slideMargin)) - s.settings.slideMargin))
                        }
                        return t
                    },
                    m = function () {
                        var t = 1,
                            e = null;
                        return "horizontal" === s.settings.mode && s.settings.slideWidth > 0 ? s.viewport.width() < s.minThreshold ? t = s.settings.minSlides : s.viewport.width() > s.maxThreshold ? t = s.settings.maxSlides : (e = s.children.first().width() + s.settings.slideMargin, t = Math.floor((s.viewport.width() + s.settings.slideMargin) / e) || 1) : "vertical" === s.settings.mode && (t = s.settings.minSlides), t
                    },
                    g = function () {
                        var t = 0,
                            e = 0,
                            i = 0;
                        if (s.settings.moveSlides > 0) {
                            if (!s.settings.infiniteLoop) {
                                for (; e < s.children.length;) ++t, e = i + m(), i += s.settings.moveSlides <= m() ? s.settings.moveSlides : m();
                                return i
                            }
                            t = Math.ceil(s.children.length / v())
                        } else t = Math.ceil(s.children.length / m());
                        return t
                    },
                    v = function () {
                        return s.settings.moveSlides > 0 && s.settings.moveSlides <= m() ? s.settings.moveSlides : m()
                    },
                    _ = function () {
                        var t, e, i;
                        s.children.length > s.settings.maxSlides && s.active.last && !s.settings.infiniteLoop ? "horizontal" === s.settings.mode ? (e = s.children.last(), t = e.position(), y(-(t.left - (s.viewport.width() - e.outerWidth())), "reset", 0)) : "vertical" === s.settings.mode && (i = s.children.length - s.settings.minSlides, t = s.children.eq(i).position(), y(-t.top, "reset", 0)) : (t = s.children.eq(s.active.index * v()).position(), s.active.index === g() - 1 && (s.active.last = !0), void 0 !== t && ("horizontal" === s.settings.mode ? y(-t.left, "reset", 0) : "vertical" === s.settings.mode && y(-t.top, "reset", 0)))
                    },
                    y = function (e, i, n, a) {
                        var r, l;
                        s.usingCSS ? (l = "vertical" === s.settings.mode ? "translate3d(0, " + e + "px, 0)" : "translate3d(" + e + "px, 0, 0)", o.css("-" + s.cssPrefix + "-transition-duration", n / 1e3 + "s"), "slide" === i ? (o.css(s.animProp, l), 0 !== n ? o.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (e) {
                            t(e.target).is(o) && (o.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), P())
                        }) : P()) : "reset" === i ? o.css(s.animProp, l) : "ticker" === i && (o.css("-" + s.cssPrefix + "-transition-timing-function", "linear"), o.css(s.animProp, l), 0 !== n ? o.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (e) {
                            t(e.target).is(o) && (o.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), y(a.resetValue, "reset", 0), z())
                        }) : (y(a.resetValue, "reset", 0), z()))) : (r = {}, r[s.animProp] = e, "slide" === i ? o.animate(r, n, s.settings.easing, function () {
                            P()
                        }) : "reset" === i ? o.css(s.animProp, e) : "ticker" === i && o.animate(r, n, "linear", function () {
                            y(a.resetValue, "reset", 0), z()
                        }))
                    },
                    b = function () {
                        for (var e = "", i = "", n = g(), o = 0; o < n; o++) i = "", s.settings.buildPager && t.isFunction(s.settings.buildPager) || s.settings.pagerCustom ? (i = s.settings.buildPager(o), s.pagerEl.addClass("bx-custom-pager")) : (i = o + 1, s.pagerEl.addClass("bx-default-pager")), e += '<div class="bx-pager-item"><a href="" data-slide-index="' + o + '" class="bx-pager-link">' + i + "</a></div>";
                        s.pagerEl.html(e)
                    },
                    w = function () {
                        s.settings.pagerCustom ? s.pagerEl = t(s.settings.pagerCustom) : (s.pagerEl = t('<div class="bx-pager" />'), s.settings.pagerSelector ? t(s.settings.pagerSelector).html(s.pagerEl) : s.controls.el.addClass("bx-has-pager").append(s.pagerEl), b()), s.pagerEl.on("click touchend", "a", E)
                    },
                    x = function () {
                        s.controls.next = t('<a class="bx-next" href="">' + s.settings.nextText + "</a>"), s.controls.prev = t('<a class="bx-prev" href="">' + s.settings.prevText + "</a>"), s.controls.next.on("click touchend", S), s.controls.prev.on("click touchend", T), s.settings.nextSelector && t(s.settings.nextSelector).append(s.controls.next), s.settings.prevSelector && t(s.settings.prevSelector).append(s.controls.prev), s.settings.nextSelector || s.settings.prevSelector || (s.controls.directionEl = t('<div class="bx-controls-direction" />'), s.controls.directionEl.append(s.controls.prev).append(s.controls.next), s.controls.el.addClass("bx-has-controls-direction").append(s.controls.directionEl))
                    },
                    C = function () {
                        s.controls.start = t('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + s.settings.startText + "</a></div>"), s.controls.stop = t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + s.settings.stopText + "</a></div>"), s.controls.autoEl = t('<div class="bx-controls-auto" />'), s.controls.autoEl.on("click", ".bx-start", I), s.controls.autoEl.on("click", ".bx-stop", D), s.settings.autoControlsCombine ? s.controls.autoEl.append(s.controls.start) : s.controls.autoEl.append(s.controls.start).append(s.controls.stop), s.settings.autoControlsSelector ? t(s.settings.autoControlsSelector).html(s.controls.autoEl) : s.controls.el.addClass("bx-has-controls-auto").append(s.controls.autoEl), M(s.settings.autoStart ? "stop" : "start")
                    },
                    k = function () {
                        s.children.each(function (e) {
                            var i = t(this).find("img:first").attr("title");
                            void 0 !== i && ("" + i).length && t(this).append('<div class="bx-caption"><span>' + i + "</span></div>")
                        })
                    },
                    S = function (t) {
                        t.preventDefault(), s.controls.el.hasClass("disabled") || (s.settings.auto && s.settings.stopAutoOnClick && o.stopAuto(), o.goToNextSlide())
                    },
                    T = function (t) {
                        t.preventDefault(), s.controls.el.hasClass("disabled") || (s.settings.auto && s.settings.stopAutoOnClick && o.stopAuto(), o.goToPrevSlide())
                    },
                    I = function (t) {
                        o.startAuto(), t.preventDefault()
                    },
                    D = function (t) {
                        o.stopAuto(), t.preventDefault()
                    },
                    E = function (e) {
                        var i, n;
                        e.preventDefault(), s.controls.el.hasClass("disabled") || (s.settings.auto && s.settings.stopAutoOnClick && o.stopAuto(), i = t(e.currentTarget), void 0 !== i.attr("data-slide-index") && (n = parseInt(i.attr("data-slide-index"))) !== s.active.index && o.goToSlide(n))
                    },
                    A = function (e) {
                        var i = s.children.length;
                        if ("short" === s.settings.pagerType) return s.settings.maxSlides > 1 && (i = Math.ceil(s.children.length / s.settings.maxSlides)), void s.pagerEl.html(e + 1 + s.settings.pagerShortSeparator + i);
                        s.pagerEl.find("a").removeClass("active"), s.pagerEl.each(function (i, n) {
                            t(n).find("a").eq(e).addClass("active")
                        })
                    },
                    P = function () {
                        if (s.settings.infiniteLoop) {
                            var t = "";
                            0 === s.active.index ? t = s.children.eq(0).position() : s.active.index === g() - 1 && s.carousel ? t = s.children.eq((g() - 1) * v()).position() : s.active.index === s.children.length - 1 && (t = s.children.eq(s.children.length - 1).position()), t && ("horizontal" === s.settings.mode ? y(-t.left, "reset", 0) : "vertical" === s.settings.mode && y(-t.top, "reset", 0))
                        }
                        s.working = !1, s.settings.onSlideAfter.call(o, s.children.eq(s.active.index), s.oldIndex, s.active.index)
                    },
                    M = function (t) {
                        s.settings.autoControlsCombine ? s.controls.autoEl.html(s.controls[t]) : (s.controls.autoEl.find("a").removeClass("active"), s.controls.autoEl.find("a:not(.bx-" + t + ")").addClass("active"))
                    },
                    j = function () {
                        1 === g() ? (s.controls.prev.addClass("disabled"), s.controls.next.addClass("disabled")) : !s.settings.infiniteLoop && s.settings.hideControlOnEnd && (0 === s.active.index ? (s.controls.prev.addClass("disabled"), s.controls.next.removeClass("disabled")) : s.active.index === g() - 1 ? (s.controls.next.addClass("disabled"), s.controls.prev.removeClass("disabled")) : (s.controls.prev.removeClass("disabled"), s.controls.next.removeClass("disabled")))
                    },
                    $ = function () {
                        o.startAuto()
                    },
                    O = function () {
                        o.stopAuto()
                    },
                    N = function () {
                        s.settings.autoDelay > 0 ? setTimeout(o.startAuto, s.settings.autoDelay) : (o.startAuto(), t(window).focus($).blur(O)), s.settings.autoHover && o.hover(function () {
                            s.interval && (o.stopAuto(!0), s.autoPaused = !0)
                        }, function () {
                            s.autoPaused && (o.startAuto(!0), s.autoPaused = null)
                        })
                    },
                    L = function () {
                        var e, i, n, a, r, l, c, d, u = 0;
                        "next" === s.settings.autoDirection ? o.append(s.children.clone().addClass("bx-clone")) : (o.prepend(s.children.clone().addClass("bx-clone")), e = s.children.first().position(), u = "horizontal" === s.settings.mode ? -e.left : -e.top), y(u, "reset", 0), s.settings.pager = !1, s.settings.controls = !1, s.settings.autoControls = !1, s.settings.tickerHover && (s.usingCSS ? (a = "horizontal" === s.settings.mode ? 4 : 5, s.viewport.hover(function () {
                            i = o.css("-" + s.cssPrefix + "-transform"), n = parseFloat(i.split(",")[a]), y(n, "reset", 0)
                        }, function () {
                            d = 0, s.children.each(function (e) {
                                d += "horizontal" === s.settings.mode ? t(this).outerWidth(!0) : t(this).outerHeight(!0)
                            }), r = s.settings.speed / d, l = "horizontal" === s.settings.mode ? "left" : "top", c = r * (d - Math.abs(parseInt(n))), z(c)
                        })) : s.viewport.hover(function () {
                            o.stop()
                        }, function () {
                            d = 0, s.children.each(function (e) {
                                d += "horizontal" === s.settings.mode ? t(this).outerWidth(!0) : t(this).outerHeight(!0)
                            }), r = s.settings.speed / d, l = "horizontal" === s.settings.mode ? "left" : "top", c = r * (d - Math.abs(parseInt(o.css(l)))), z(c)
                        })), z()
                    },
                    z = function (t) {
                        var e, i, n, a = t || s.settings.speed,
                            r = {
                                left: 0,
                                top: 0
                            },
                            l = {
                                left: 0,
                                top: 0
                            };
                        "next" === s.settings.autoDirection ? r = o.find(".bx-clone").first().position() : l = s.children.first().position(), e = "horizontal" === s.settings.mode ? -r.left : -r.top, i = "horizontal" === s.settings.mode ? -l.left : -l.top, n = {
                            resetValue: i
                        }, y(e, "ticker", a, n)
                    },
                    F = function (e) {
                        var i = t(window),
                            n = {
                                top: i.scrollTop(),
                                left: i.scrollLeft()
                            },
                            s = e.offset();
                        return n.right = n.left + i.width(), n.bottom = n.top + i.height(), s.right = s.left + e.outerWidth(), s.bottom = s.top + e.outerHeight(), !(n.right < s.left || n.left > s.right || n.bottom < s.top || n.top > s.bottom)
                    },
                    H = function (t) {
                        var e = document.activeElement.tagName.toLowerCase();
                        if (null == new RegExp(e, ["i"]).exec("input|textarea") && F(o)) {
                            if (39 === t.keyCode) return S(t), !1;
                            if (37 === t.keyCode) return T(t), !1
                        }
                    },
                    W = function () {
                        s.touch = {
                            start: {
                                x: 0,
                                y: 0
                            },
                            end: {
                                x: 0,
                                y: 0
                            }
                        }, s.viewport.on("touchstart MSPointerDown pointerdown", R), s.viewport.on("click", ".bxslider a", function (t) {
                            s.viewport.hasClass("click-disabled") && (t.preventDefault(), s.viewport.removeClass("click-disabled"))
                        })
                    },
                    R = function (t) {
                        if ("touchstart" === t.type || 0 === t.button)
                            if (t.preventDefault(), s.controls.el.addClass("disabled"), s.working) s.controls.el.removeClass("disabled");
                            else {
                                s.touch.originalPos = o.position();
                                var e = t.originalEvent,
                                    i = void 0 !== e.changedTouches ? e.changedTouches : [e],
                                    n = "function" == typeof PointerEvent;
                                if (n && void 0 === e.pointerId) return;
                                s.touch.start.x = i[0].pageX, s.touch.start.y = i[0].pageY, s.viewport.get(0).setPointerCapture && (s.pointerId = e.pointerId, s.viewport.get(0).setPointerCapture(s.pointerId)), s.originalClickTarget = e.originalTarget || e.target, s.originalClickButton = e.button, s.originalClickButtons = e.buttons, s.originalEventType = e.type, s.hasMove = !1, s.viewport.on("touchmove MSPointerMove pointermove", q), s.viewport.on("touchend MSPointerUp pointerup", U), s.viewport.on("MSPointerCancel pointercancel", B)
                            }
                    },
                    B = function (t) {
                        t.preventDefault(), y(s.touch.originalPos.left, "reset", 0), s.controls.el.removeClass("disabled"), s.viewport.off("MSPointerCancel pointercancel", B), s.viewport.off("touchmove MSPointerMove pointermove", q), s.viewport.off("touchend MSPointerUp pointerup", U), s.viewport.get(0).releasePointerCapture && s.viewport.get(0).releasePointerCapture(s.pointerId)
                    },
                    q = function (t) {
                        var e = t.originalEvent,
                            i = void 0 !== e.changedTouches ? e.changedTouches : [e],
                            n = Math.abs(i[0].pageX - s.touch.start.x),
                            o = Math.abs(i[0].pageY - s.touch.start.y),
                            a = 0,
                            r = 0;
                        s.hasMove = !0, 3 * n > o && s.settings.preventDefaultSwipeX ? t.preventDefault() : 3 * o > n && s.settings.preventDefaultSwipeY && t.preventDefault(), "touchmove" !== t.type && t.preventDefault(), "fade" !== s.settings.mode && s.settings.oneToOneTouch && ("horizontal" === s.settings.mode ? (r = i[0].pageX - s.touch.start.x, a = s.touch.originalPos.left + r) : (r = i[0].pageY - s.touch.start.y, a = s.touch.originalPos.top + r), y(a, "reset", 0))
                    },
                    U = function (e) {
                        e.preventDefault(), s.viewport.off("touchmove MSPointerMove pointermove", q), s.controls.el.removeClass("disabled");
                        var i = e.originalEvent,
                            n = void 0 !== i.changedTouches ? i.changedTouches : [i],
                            a = 0,
                            r = 0;
                        s.touch.end.x = n[0].pageX, s.touch.end.y = n[0].pageY, "fade" === s.settings.mode ? (r = Math.abs(s.touch.start.x - s.touch.end.x)) >= s.settings.swipeThreshold && (s.touch.start.x > s.touch.end.x ? o.goToNextSlide() : o.goToPrevSlide(), o.stopAuto()) : ("horizontal" === s.settings.mode ? (r = s.touch.end.x - s.touch.start.x, a = s.touch.originalPos.left) : (r = s.touch.end.y - s.touch.start.y, a = s.touch.originalPos.top), !s.settings.infiniteLoop && (0 === s.active.index && r > 0 || s.active.last && r < 0) ? y(a, "reset", 200) : Math.abs(r) >= s.settings.swipeThreshold ? (r < 0 ? o.goToNextSlide() : o.goToPrevSlide(), o.stopAuto()) : y(a, "reset", 200)), s.viewport.off("touchend MSPointerUp pointerup", U), s.viewport.get(0).releasePointerCapture && s.viewport.get(0).releasePointerCapture(s.pointerId), !1 !== s.hasMove || 0 !== s.originalClickButton && "touchstart" !== s.originalEventType || t(s.originalClickTarget).trigger({
                            type: "click",
                            button: s.originalClickButton,
                            buttons: s.originalClickButtons
                        })
                    },
                    Y = function (e) {
                        if (s.initialized)
                            if (s.working) window.setTimeout(Y, 10);
                            else {
                                var i = t(window).width(),
                                    n = t(window).height();
                                a === i && r === n || (a = i, r = n, o.redrawSlider(), s.settings.onSliderResize.call(o, s.active.index))
                            }
                    },
                    K = function (t) {
                        var e = m();
                        s.settings.ariaHidden && !s.settings.ticker && (s.children.attr("aria-hidden", "true"), s.children.slice(t, t + e).attr("aria-hidden", "false"))
                    },
                    V = function (t) {
                        return t < 0 ? s.settings.infiniteLoop ? g() - 1 : s.active.index : t >= g() ? s.settings.infiniteLoop ? 0 : s.active.index : t
                    };
                return o.goToSlide = function (e, i) {
                    var n, a, r, l, c = !0,
                        d = 0,
                        u = {
                            left: 0,
                            top: 0
                        },
                        p = null;
                    if (s.oldIndex = s.active.index, s.active.index = V(e), !s.working && s.active.index !== s.oldIndex) {
                        if (s.working = !0, void 0 !== (c = s.settings.onSlideBefore.call(o, s.children.eq(s.active.index), s.oldIndex, s.active.index)) && !c) return s.active.index = s.oldIndex, void (s.working = !1);
                        "next" === i ? s.settings.onSlideNext.call(o, s.children.eq(s.active.index), s.oldIndex, s.active.index) || (c = !1) : "prev" === i && (s.settings.onSlidePrev.call(o, s.children.eq(s.active.index), s.oldIndex, s.active.index) || (c = !1)), s.active.last = s.active.index >= g() - 1, (s.settings.pager || s.settings.pagerCustom) && A(s.active.index), s.settings.controls && j(), "fade" === s.settings.mode ? (s.settings.adaptiveHeight && s.viewport.height() !== h() && s.viewport.animate({
                            height: h()
                        }, s.settings.adaptiveHeightSpeed), s.children.filter(":visible").fadeOut(s.settings.speed).css({
                            zIndex: 0
                        }), s.children.eq(s.active.index).css("zIndex", s.settings.slideZIndex + 1).fadeIn(s.settings.speed, function () {
                            t(this).css("zIndex", s.settings.slideZIndex), P()
                        })) : (s.settings.adaptiveHeight && s.viewport.height() !== h() && s.viewport.animate({
                            height: h()
                        }, s.settings.adaptiveHeightSpeed), !s.settings.infiniteLoop && s.carousel && s.active.last ? "horizontal" === s.settings.mode ? (p = s.children.eq(s.children.length - 1), u = p.position(), d = s.viewport.width() - p.outerWidth()) : (n = s.children.length - s.settings.minSlides, u = s.children.eq(n).position()) : s.carousel && s.active.last && "prev" === i ? (a = 1 === s.settings.moveSlides ? s.settings.maxSlides - v() : (g() - 1) * v() - (s.children.length - s.settings.maxSlides), p = o.children(".bx-clone").eq(a), u = p.position()) : "next" === i && 0 === s.active.index ? (u = o.find("> .bx-clone").eq(s.settings.maxSlides).position(), s.active.last = !1) : e >= 0 && (l = e * parseInt(v()), u = s.children.eq(l).position()), void 0 !== u && (r = "horizontal" === s.settings.mode ? -(u.left - d) : -u.top, y(r, "slide", s.settings.speed)), s.working = !1), s.settings.ariaHidden && K(s.active.index * v())
                    }
                }, o.goToNextSlide = function () {
                    if ((s.settings.infiniteLoop || !s.active.last) && !0 !== s.working) {
                        var t = parseInt(s.active.index) + 1;
                        o.goToSlide(t, "next")
                    }
                }, o.goToPrevSlide = function () {
                    if ((s.settings.infiniteLoop || 0 !== s.active.index) && !0 !== s.working) {
                        var t = parseInt(s.active.index) - 1;
                        o.goToSlide(t, "prev")
                    }
                }, o.startAuto = function (t) {
                    s.interval || (s.interval = setInterval(function () {
                        "next" === s.settings.autoDirection ? o.goToNextSlide() : o.goToPrevSlide()
                    }, s.settings.pause), s.settings.onAutoChange.call(o, !0), s.settings.autoControls && !0 !== t && M("stop"))
                }, o.stopAuto = function (t) {
                    s.autoPaused && (s.autoPaused = !1), s.interval && (clearInterval(s.interval), s.interval = null, s.settings.onAutoChange.call(o, !1), s.settings.autoControls && !0 !== t && M("start"))
                }, o.getCurrentSlide = function () {
                    return s.active.index
                }, o.getCurrentSlideElement = function () {
                    return s.children.eq(s.active.index)
                }, o.getSlideElement = function (t) {
                    return s.children.eq(t)
                }, o.getSlideCount = function () {
                    return s.children.length
                }, o.isWorking = function () {
                    return s.working
                }, o.redrawSlider = function () {
                    s.children.add(o.find(".bx-clone")).outerWidth(f()), s.viewport.css("height", h()), s.settings.ticker || _(), s.active.last && (s.active.index = g() - 1), s.active.index >= g() && (s.active.last = !0), s.settings.pager && !s.settings.pagerCustom && (b(), A(s.active.index)), s.settings.ariaHidden && K(s.active.index * v())
                }, o.destroySlider = function () {
                    s.initialized && (s.initialized = !1, t(".bx-clone", this).remove(), s.children.each(function () {
                        void 0 !== t(this).data("origStyle") ? t(this).attr("style", t(this).data("origStyle")) : t(this).removeAttr("style")
                    }), void 0 !== t(this).data("origStyle") ? this.attr("style", t(this).data("origStyle")) : t(this).removeAttr("style"), t(this).unwrap().unwrap(), s.controls.el && s.controls.el.remove(), s.controls.next && s.controls.next.remove(), s.controls.prev && s.controls.prev.remove(), s.pagerEl && s.settings.controls && !s.settings.pagerCustom && s.pagerEl.remove(), t(".bx-caption", this).remove(), s.controls.autoEl && s.controls.autoEl.remove(), clearInterval(s.interval), s.settings.responsive && t(window).off("resize", Y), s.settings.keyboardEnabled && t(document).off("keydown", H), t(this).removeData("bxSlider"), t(window).off("blur", O).off("focus", $))
                }, o.reloadSlider = function (e) {
                    void 0 !== e && (n = e), o.destroySlider(), l(), t(o).data("bxSlider", this)
                }, l(), t(o).data("bxSlider", this), this
            }
        }
    }(jQuery),
    function (t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? module.exports = t($ || require("jquery")) : t(jQuery)
    }(function (t) {
        "use strict";

        function e(e, i) {
            this.element = e, this.options = t.extend({}, s, i);
            var n = this.options.locale;
            void 0 !== this.options.locales[n] && t.extend(this.options, this.options.locales[n]), this.init()
        }

        function i(e) {
            if (!t(e.target).parents().hasClass("jq-selectbox") && "OPTION" != e.target.nodeName && t("div.jq-selectbox.opened").length) {
                var i = t("div.jq-selectbox.opened"),
                    s = t("div.jq-selectbox__search input", i),
                    o = t("div.jq-selectbox__dropdown", i);
                i.find("select").data("_" + n).options.onSelectClosed.call(i), s.length && s.val("").keyup(), o.hide().find("li.sel").addClass("selected"), i.removeClass("focused opened dropup dropdown")
            }
        }

        var n = "styler",
            s = {
                idSuffix: "-styler",
                filePlaceholder: "Файл не выбран",
                fileBrowse: "Обзор...",
                fileNumber: "Выбрано файлов: %s",
                selectPlaceholder: "Выберите...",
                selectSearch: !1,
                selectSearchLimit: 10,
                selectSearchNotFound: "Совпадений не найдено",
                selectSearchPlaceholder: "Поиск...",
                selectVisibleOptions: 0,
                singleSelectzIndex: "100",
                selectSmartPositioning: !0,
                locale: "ru",
                locales: {
                    en: {
                        filePlaceholder: "No file selected",
                        fileBrowse: "Browse...",
                        fileNumber: "Selected files: %s",
                        selectPlaceholder: "Select...",
                        selectSearchNotFound: "No matches found",
                        selectSearchPlaceholder: "Search..."
                    }
                },
                onSelectOpened: function () {
                },
                onSelectClosed: function () {
                },
                onFormStyled: function () {
                }
            };
        e.prototype = {
            init: function () {
                function e() {
                    void 0 !== n.attr("id") && "" !== n.attr("id") && (this.id = n.attr("id") + s.idSuffix), this.title = n.attr("title"), this.classes = n.attr("class"), this.data = n.data()
                }

                var n = t(this.element),
                    s = this.options,
                    o = !(!navigator.userAgent.match(/(iPad|iPhone|iPod)/i) || navigator.userAgent.match(/(Windows\sPhone)/i)),
                    a = !(!navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/(Windows\sPhone)/i));

                if (n.is(":checkbox")) {
                    var r = function () {
                        var i = new e,
                            s = t('<div class="jq-checkbox"><div class="jq-checkbox__div"></div></div>').attr({
                                id: i.id,
                                title: i.title
                            }).addClass(i.classes).data(i.data);
                        n.css({
                            position: "absolute",
                            zIndex: "-1",
                            opacity: 0,
                            margin: 0,
                            padding: 0
                        }).after(s).prependTo(s), s.attr("unselectable", "on").css({
                            "-webkit-user-select": "none",
                            "-moz-user-select": "none",
                            "-ms-user-select": "none",
                            "-o-user-select": "none",
                            "user-select": "none",
                            display: "inline-block",
                            position: "relative",
                            overflow: "hidden"
                        }), n.is(":checked") && s.addClass("checked"), n.is(":disabled") && s.addClass("disabled"), s.click(function (t) {
                            t.preventDefault(), s.is(".disabled") || (n.is(":checked") ? (n.prop("checked", !1), s.removeClass("checked")) : (n.prop("checked", !0), s.addClass("checked")), n.focus().change())
                        }), n.closest("label").add('label[for="' + n.attr("id") + '"]').on("click.styler", function (e) {
                            t(e.target).is("a") || t(e.target).closest(s).length || (s.triggerHandler("click"), e.preventDefault())
                        }), n.on("change.styler", function () {
                            n.is(":checked") ? s.addClass("checked") : s.removeClass("checked")
                        }).on("keydown.styler", function (t) {
                            32 == t.which && s.click()
                        }).on("focus.styler", function () {
                            s.is(".disabled") || s.addClass("focused")
                        }).on("blur.styler", function () {
                            s.removeClass("focused")
                        })
                    };
                    r(), n.on("refresh", function () {
                        n.closest("label").add('label[for="' + n.attr("id") + '"]').off(".styler"), n.off(".styler").parent().before(n).remove(), r()
                    })
                } else if (n.is(":radio")) {
                    var l = function () {
                        var i = new e,
                            s = t('<div class="jq-radio"><div class="jq-radio__div"></div></div>').attr({
                                id: i.id,
                                title: i.title
                            }).addClass(i.classes).data(i.data);
                        n.css({
                            position: "absolute",
                            zIndex: "-1",
                            opacity: 0,
                            margin: 0,
                            padding: 0
                        }).after(s).prependTo(s), s.attr("unselectable", "on").css({
                            "-webkit-user-select": "none",
                            "-moz-user-select": "none",
                            "-ms-user-select": "none",
                            "-o-user-select": "none",
                            "user-select": "none",
                            display: "inline-block",
                            position: "relative"
                        }), n.is(":checked") && s.addClass("checked"), n.is(":disabled") && s.addClass("disabled"), t.fn.commonParents = function () {
                            var e = this;
                            return e.first().parents().filter(function () {
                                return t(this).find(e).length === e.length
                            })
                        }, t.fn.commonParent = function () {
                            return t(this).commonParents().first()
                        }, s.click(function (e) {
                            if (e.preventDefault(), !s.is(".disabled")) {
                                var i = t('input[name="' + n.attr("name") + '"]');
                                i.commonParent().find(i).prop("checked", !1).parent().removeClass("checked"), n.prop("checked", !0).parent().addClass("checked"), n.focus().change()
                            }
                        }), n.closest("label").add('label[for="' + n.attr("id") + '"]').on("click.styler", function (e) {
                            t(e.target).is("a") || t(e.target).closest(s).length || (s.triggerHandler("click"), e.preventDefault())
                        }), n.on("change.styler", function () {
                            n.parent().addClass("checked")
                        }).on("focus.styler", function () {
                            s.is(".disabled") || s.addClass("focused")
                        }).on("blur.styler", function () {
                            s.removeClass("focused")
                        })
                    };
                    l(), n.on("refresh", function () {
                        n.closest("label").add('label[for="' + n.attr("id") + '"]').off(".styler"), n.off(".styler").parent().before(n).remove(), l()
                    })
                } else if (n.is(":file")) {
                    n.css({
                        position: "absolute",
                        top: 0,
                        right: 0,
                        margin: 0,
                        padding: 0,
                        opacity: 0,
                        fontSize: "100px"
                    });
                    var c = function () {
                        var i = new e,
                            o = n.data("placeholder");
                        void 0 === o && (o = s.filePlaceholder);
                        var a = n.data("browse");
                        void 0 !== a && "" !== a || (a = s.fileBrowse);
                        var r = t('<div class="jq-file"><div class="jq-file__name">' + o + '</div><div class="jq-file__browse">' + a + "</div></div>").css({
                            display: "inline-block",
                            position: "relative",
                            overflow: "hidden"
                        }).attr({
                            id: i.id,
                            title: i.title
                        }).addClass(i.classes).data(i.data);
                        n.after(r).appendTo(r), n.is(":disabled") && r.addClass("disabled"), n.on("change.styler", function () {
                            var e = n.val(),
                                i = t("div.jq-file__name", r);
                            if (n.is("[multiple]")) {
                                e = "";
                                var a = n[0].files.length;
                                if (a > 0) {
                                    var l = n.data("number");
                                    void 0 === l && (l = s.fileNumber), l = l.replace("%s", a), e = l
                                }
                            }
                            i.text(e.replace(/.+[\\\/]/, "")), "" === e ? (i.text(o), r.removeClass("changed")) : r.addClass("changed")
                        }).on("focus.styler", function () {
                            r.addClass("focused")
                        }).on("blur.styler", function () {
                            r.removeClass("focused")
                        }).on("click.styler", function () {
                            r.removeClass("focused")
                        })
                    };
                    c(), n.on("refresh", function () {
                        n.off(".styler").parent().before(n).remove(), c()
                    })
                } else if (n.is('input[type="number"]')) {
                    var d = function () {
                        var i = new e,
                            s = t('<div class="jq-number"><div class="jq-number__spin minus"></div><div class="jq-number__spin plus"></div></div>').attr({
                                id: i.id,
                                title: i.title
                            }).addClass(i.classes).data(i.data);
                        n.after(s).prependTo(s).wrap('<div class="jq-number__field"></div>'), n.is(":disabled") && s.addClass("disabled");
                        var o, a, r, l = null,
                            c = null;
                        void 0 !== n.attr("min") && (o = n.attr("min")), void 0 !== n.attr("max") && (a = n.attr("max")), r = void 0 !== n.attr("step") && t.isNumeric(n.attr("step")) ? Number(n.attr("step")) : Number(1);
                        var d = function (e) {
                            var i, s = n.val();
                            t.isNumeric(s) || (s = 0, n.val("0")), e.is(".minus") ? i = Number(s) - r : e.is(".plus") && (i = Number(s) + r);
                            var l = (r.toString().split(".")[1] || []).length;
                            if (l > 0) {
                                for (var c = "1"; c.length <= l;) c += "0";
                                i = Math.round(i * c) / c
                            }
                            t.isNumeric(o) && t.isNumeric(a) ? i >= o && a >= i && n.val(i) : t.isNumeric(o) && !t.isNumeric(a) ? i >= o && n.val(i) : !t.isNumeric(o) && t.isNumeric(a) ? a >= i && n.val(i) : n.val(i)
                        };
                        s.is(".disabled") || (s.on("mousedown", "div.jq-number__spin", function () {
                            var e = t(this);
                            d(e), l = setTimeout(function () {
                                c = setInterval(function () {
                                    d(e)
                                }, 40)
                            }, 350)
                        }).on("mouseup mouseout", "div.jq-number__spin", function () {
                            clearTimeout(l), clearInterval(c)
                        }).on("mouseup", "div.jq-number__spin", function () {
                            n.change()
                        }), n.on("focus.styler", function () {
                            s.addClass("focused")
                        }).on("blur.styler", function () {
                            s.removeClass("focused")
                        }))
                    };
                    d(), n.on("refresh", function () {
                        n.off(".styler").closest(".jq-number").before(n).remove(), d()
                    })
                } else if (n.is("select")) {
                    var u = function () {
                        function r(e) {
                            e.off("mousewheel DOMMouseScroll").on("mousewheel DOMMouseScroll", function (e) {
                                var i = null;
                                "mousewheel" == e.type ? i = -1 * e.originalEvent.wheelDelta : "DOMMouseScroll" == e.type && (i = 40 * e.originalEvent.detail), i && (e.stopPropagation(), e.preventDefault(), t(this).scrollTop(i + t(this).scrollTop()))
                            })
                        }

                        function l() {
                            for (var t = 0; t < u.length; t++) {
                                var e = u.eq(t),
                                    i = "",
                                    n = "",
                                    o = "",
                                    a = "",
                                    r = "",
                                    l = "",
                                    c = "",
                                    d = "",
                                    p = "";
                                e.prop("selected") && (n = "selected sel"), e.is(":disabled") && (n = "disabled"), e.is(":selected:disabled") && (n = "selected sel disabled"), void 0 !== e.attr("id") && "" !== e.attr("id") && (a = ' id="' + e.attr("id") + s.idSuffix + '"'), void 0 !== e.attr("title") && "" !== u.attr("title") && (r = ' title="' + e.attr("title") + '"'), void 0 !== e.attr("class") && (c = " " + e.attr("class"), p = ' data-jqfs-class="' + e.attr("class") + '"');
                                var f = e.data();
                                for (var m in f) "" !== f[m] && (l += " data-" + m + '="' + f[m] + '"');
                                n + c !== "" && (o = ' class="' + n + c + '"'), i = "<li" + p + l + o + r + a + ">" + e.html() + "</li>", e.parent().is("optgroup") && (void 0 !== e.parent().attr("class") && (d = " " + e.parent().attr("class")), i = "<li" + p + l + ' class="' + n + c + " option" + d + '"' + r + a + ">" + e.html() + "</li>", e.is(":first-child") && (i = '<li class="optgroup' + d + '">' + e.parent().attr("label") + "</li>" + i)), h += i
                            }
                        }

                        function c() {
                            var a = new e,
                                c = "",
                                d = n.data("placeholder"),
                                p = n.data("search"),
                                f = n.data("search-limit"),
                                m = n.data("search-not-found"),
                                g = n.data("search-placeholder"),
                                v = n.data("z-index"),
                                _ = n.data("smart-positioning");
                            void 0 === d && (d = s.selectPlaceholder), void 0 !== p && "" !== p || (p = s.selectSearch), void 0 !== f && "" !== f || (f = s.selectSearchLimit), void 0 !== m && "" !== m || (m = s.selectSearchNotFound), void 0 === g && (g = s.selectSearchPlaceholder), void 0 !== v && "" !== v || (v = s.singleSelectzIndex), void 0 !== _ && "" !== _ || (_ = s.selectSmartPositioning);
                            var y = t('<div class="jq-selectbox jqselect"><div class="jq-selectbox__select" style="position: relative"><div class="jq-selectbox__select-text"></div><div class="jq-selectbox__trigger"><div class="jq-checked__arrow-trigger"></div></div></div></div>').css({
                                display: "inline-block",
                                position: "relative",
                                zIndex: v
                            }).attr({
                                id: a.id,
                                title: a.title
                            }).addClass(a.classes).data(a.data);
                            n.css({
                                margin: 0,
                                padding: 0
                            }).after(y).prependTo(y);
                            var b = t("div.jq-selectbox__select", y),
                                w = t("div.jq-selectbox__select-text", y),
                                x = u.filter(":selected");
                            l(), p && (c = '<div class="jq-selectbox__search"><input type="search" autocomplete="off" placeholder="' + g + '"></div><div class="jq-selectbox__not-found">' + m + "</div>");
                            var C = t('<div class="jq-selectbox__dropdown" style="position: absolute">' + c + '<ul style="position: relative; list-style: none; overflow: auto; overflow-x: hidden">' + h + "</ul></div>");
                            y.append(C);
                            var k = t("ul", C),
                                S = t("li", C),
                                T = t("input", C),
                                I = t("div.jq-selectbox__not-found", C).hide();
                            S.length < f && T.parent().hide(), "" === u.first().text() && u.first().is(":selected") && !1 !== d ? w.text(d).addClass("placeholder") : w.text(x.text());
                            var D = 0,
                                E = 0;
                            if (S.css({
                                display: "inline-block"
                            }), S.each(function () {
                                var e = t(this);
                                e.innerWidth() > D && (D = e.innerWidth(), E = e.width())
                            }), S.css({
                                display: ""
                            }), w.is(".placeholder") && w.width() > D) w.width(w.width());
                            else {
                                var A = y.clone().appendTo("body").width("auto"),
                                    P = A.outerWidth();
                                A.remove(), P == y.outerWidth() && w.width(E)
                            }
                            D > y.width() && C.width(D), "" === u.first().text() && "" !== n.data("placeholder") && S.first().hide(), n.css({
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0
                            });
                            var M = y.outerHeight(!0),
                                j = T.parent().outerHeight(!0) || 0,
                                $ = k.css("max-height"),
                                O = S.filter(".selected");
                            if (O.length < 1 && S.first().addClass("selected sel"), void 0 === S.data("li-height")) {
                                var N = S.outerHeight();
                                !1 !== d && (N = S.eq(1).outerHeight()), S.data("li-height", N)
                            }
                            var L = C.css("top");
                            if ("auto" == C.css("left") && C.css({
                                left: 0
                            }), "auto" == C.css("top") && (C.css({
                                top: M
                            }), L = M), C.hide(), O.length && (u.first().text() != x.text() && y.addClass("changed"), y.data("jqfs-class", O.data("jqfs-class")), y.addClass(O.data("jqfs-class"))), n.is(":disabled")) return y.addClass("disabled"), !1;
                            b.click(function () {
                                if (t("div.jq-selectbox").filter(".opened").length && s.onSelectClosed.call(t("div.jq-selectbox").filter(".opened")), n.focus(), !o) {
                                    var e = t(window),
                                        i = S.data("li-height"),
                                        a = y.offset().top,
                                        l = e.height() - M - (a - e.scrollTop()),
                                        c = n.data("visible-options");
                                    void 0 !== c && "" !== c || (c = s.selectVisibleOptions);
                                    var d = 5 * i,
                                        h = i * c;
                                    c > 0 && 6 > c && (d = h), 0 === c && (h = "auto");
                                    var p = function () {
                                        C.height("auto").css({
                                            bottom: "auto",
                                            top: L
                                        });
                                        var t = function () {
                                            k.css("max-height", Math.floor((l - 20 - j) / i) * i)
                                        };
                                        t(), k.css("max-height", h), "none" != $ && k.css("max-height", $), l < C.outerHeight() + 20 && t()
                                    },
                                        f = function () {
                                            C.height("auto").css({
                                                top: "auto",
                                                bottom: L
                                            });
                                            var t = function () {
                                                k.css("max-height", Math.floor((a - e.scrollTop() - 20 - j) / i) * i)
                                            };
                                            t(), k.css("max-height", h), "none" != $ && k.css("max-height", $), a - e.scrollTop() - 20 < C.outerHeight() + 20 && t()
                                        };
                                    !0 === _ || 1 === _ ? l > d + j + 20 ? (p(), y.removeClass("dropup").addClass("dropdown")) : (f(), y.removeClass("dropdown").addClass("dropup")) : !1 === _ || 0 === _ ? l > d + j + 20 && (p(), y.removeClass("dropup").addClass("dropdown")) : (C.height("auto").css({
                                        bottom: "auto",
                                        top: L
                                    }), k.css("max-height", h), "none" != $ && k.css("max-height", $)), y.offset().left + C.outerWidth() > e.width() && C.css({
                                        left: "auto",
                                        right: 0
                                    }), t("div.jqselect").css({
                                        zIndex: v - 1
                                    }).removeClass("opened"), y.css({
                                        zIndex: v
                                    }), C.is(":hidden") ? (t("div.jq-selectbox__dropdown:visible").hide(), C.show(), y.addClass("opened focused"), s.onSelectOpened.call(y)) : (C.hide(), y.removeClass("opened dropup dropdown"), t("div.jq-selectbox").filter(".opened").length && s.onSelectClosed.call(y)), T.length && (T.val("").keyup(), I.hide(), T.keyup(function () {
                                        var e = t(this).val();
                                        S.each(function () {
                                            t(this).html().match(new RegExp(".*?" + e + ".*?", "i")) ? t(this).show() : t(this).hide()
                                        }), "" === u.first().text() && "" !== n.data("placeholder") && S.first().hide(), S.filter(":visible").length < 1 ? I.show() : I.hide()
                                    })), S.filter(".selected").length && ("" === n.val() ? k.scrollTop(0) : (k.innerHeight() / i % 2 != 0 && (i /= 2), k.scrollTop(k.scrollTop() + S.filter(".selected").position().top - k.innerHeight() / 2 + i))), r(k)
                                }
                            }), S.hover(function () {
                                t(this).siblings().removeClass("selected")
                            });
                            var z = S.filter(".selected").text();
                            S.filter(":not(.disabled):not(.optgroup)").click(function () {
                                n.focus();
                                var e = t(this),
                                    i = e.text();
                                if (!e.is(".selected")) {
                                    var o = e.index();
                                    o -= e.prevAll(".optgroup").length, e.addClass("selected sel").siblings().removeClass("selected sel"), u.prop("selected", !1).eq(o).prop("selected", !0), z = i, w.text(i), y.data("jqfs-class") && y.removeClass(y.data("jqfs-class")), y.data("jqfs-class", e.data("jqfs-class")), y.addClass(e.data("jqfs-class")), n.change()
                                }
                                C.hide(), y.removeClass("opened dropup dropdown"), s.onSelectClosed.call(y)
                            }), C.mouseout(function () {
                                t("li.sel", C).addClass("selected")
                            }), n.on("change.styler", function () {
                                w.text(u.filter(":selected").text()).removeClass("placeholder"), S.removeClass("selected sel").not(".optgroup").eq(n[0].selectedIndex).addClass("selected sel"), u.first().text() != S.filter(".selected").text() ? y.addClass("changed") : y.removeClass("changed")
                            }).on("focus.styler", function () {
                                y.addClass("focused"), t("div.jqselect").not(".focused").removeClass("opened dropup dropdown").find("div.jq-selectbox__dropdown").hide()
                            }).on("blur.styler", function () {
                                y.removeClass("focused")
                            }).on("keydown.styler keyup.styler", function (t) {
                                var e = S.data("li-height");
                                "" === n.val() ? w.text(d).addClass("placeholder") : w.text(u.filter(":selected").text()), S.removeClass("selected sel").not(".optgroup").eq(n[0].selectedIndex).addClass("selected sel"), 38 != t.which && 37 != t.which && 33 != t.which && 36 != t.which || ("" === n.val() ? k.scrollTop(0) : k.scrollTop(k.scrollTop() + S.filter(".selected").position().top)), 40 != t.which && 39 != t.which && 34 != t.which && 35 != t.which || k.scrollTop(k.scrollTop() + S.filter(".selected").position().top - k.innerHeight() + e), 13 == t.which && (t.preventDefault(), C.hide(), y.removeClass("opened dropup dropdown"), s.onSelectClosed.call(y))
                            }).on("keydown.styler", function (t) {
                                32 == t.which && (t.preventDefault(), b.click())
                            }), i.registered || (t(document).on("click", i), i.registered = !0)
                        }

                        function d() {
                            var i = new e,
                                s = t('<div class="jq-select-multiple jqselect"></div>').css({
                                    display: "inline-block",
                                    position: "relative"
                                }).attr({
                                    id: i.id,
                                    title: i.title
                                }).addClass(i.classes).data(i.data);
                            n.css({
                                margin: 0,
                                padding: 0
                            }).after(s), l(), s.append("<ul>" + h + "</ul>");
                            var o = t("ul", s).css({
                                position: "relative",
                                "overflow-x": "hidden",
                                "-webkit-overflow-scrolling": "touch"
                            }),
                                a = t("li", s).attr("unselectable", "on"),
                                c = n.attr("size"),
                                d = o.outerHeight(),
                                p = a.outerHeight();
                            void 0 !== c && c > 0 ? o.css({
                                height: p * c
                            }) : o.css({
                                height: 4 * p
                            }), d > s.height() && (o.css("overflowY", "scroll"), r(o), a.filter(".selected").length && o.scrollTop(o.scrollTop() + a.filter(".selected").position().top)), n.prependTo(s).css({
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0
                            }), n.is(":disabled") ? (s.addClass("disabled"), u.each(function () {
                                t(this).is(":selected") && a.eq(t(this).index()).addClass("selected")
                            })) : (a.filter(":not(.disabled):not(.optgroup)").click(function (e) {
                                n.focus();
                                var i = t(this);
                                if (e.ctrlKey || e.metaKey || i.addClass("selected"), e.shiftKey || i.addClass("first"), e.ctrlKey || e.metaKey || e.shiftKey || i.siblings().removeClass("selected first"), (e.ctrlKey || e.metaKey) && (i.is(".selected") ? i.removeClass("selected first") : i.addClass("selected first"), i.siblings().removeClass("first")), e.shiftKey) {
                                    var s = !1,
                                        o = !1;
                                    i.siblings().removeClass("selected").siblings(".first").addClass("selected"), i.prevAll().each(function () {
                                        t(this).is(".first") && (s = !0)
                                    }), i.nextAll().each(function () {
                                        t(this).is(".first") && (o = !0)
                                    }), s && i.prevAll().each(function () {
                                        return !t(this).is(".selected") && void t(this).not(".disabled, .optgroup").addClass("selected")
                                    }), o && i.nextAll().each(function () {
                                        return !t(this).is(".selected") && void t(this).not(".disabled, .optgroup").addClass("selected")
                                    }), 1 == a.filter(".selected").length && i.addClass("first")
                                }
                                u.prop("selected", !1), a.filter(".selected").each(function () {
                                    var e = t(this),
                                        i = e.index();
                                    e.is(".option") && (i -= e.prevAll(".optgroup").length), u.eq(i).prop("selected", !0)
                                }), n.change()
                            }), u.each(function (e) {
                                t(this).data("optionIndex", e)
                            }), n.on("change.styler", function () {
                                a.removeClass("selected");
                                var e = [];
                                u.filter(":selected").each(function () {
                                    e.push(t(this).data("optionIndex"))
                                }), a.not(".optgroup").filter(function (i) {
                                    return t.inArray(i, e) > -1
                                }).addClass("selected")
                            }).on("focus.styler", function () {
                                s.addClass("focused")
                            }).on("blur.styler", function () {
                                s.removeClass("focused")
                            }), d > s.height() && n.on("keydown.styler", function (t) {
                                38 != t.which && 37 != t.which && 33 != t.which || o.scrollTop(o.scrollTop() + a.filter(".selected").position().top - p), 40 != t.which && 39 != t.which && 34 != t.which || o.scrollTop(o.scrollTop() + a.filter(".selected:last").position().top - o.innerHeight() + 2 * p)
                            }))
                        }

                        var u = t("option", n),
                            h = "";
                        if (n.is("[multiple]")) {
                            if (a || o) return;
                            d()
                        } else c()
                    };
                    u(), n.on("refresh", function () {
                        n.off(".styler").parent().before(n).remove(), u()
                    })
                } else n.is(":reset") && n.on("click", function () {
                    setTimeout(function () {
                        n.closest("form").find("input, select").trigger("refresh")
                    }, 1)
                })
            },
            destroy: function () {
                var e = t(this.element);
                e.is(":checkbox") || e.is(":radio") ? (e.removeData("_" + n).off(".styler refresh").removeAttr("style").parent().before(e).remove(), e.closest("label").add('label[for="' + e.attr("id") + '"]').off(".styler")) : e.is('input[type="number"]') ? e.removeData("_" + n).off(".styler refresh").closest(".jq-number").before(e).remove() : (e.is(":file") || e.is("select")) && e.removeData("_" + n).off(".styler refresh").removeAttr("style").parent().before(e).remove()
            }
        }, t.fn[n] = function (i) {
            var s = arguments;
            if (void 0 === i || "object" == typeof i) return this.each(function () {
                t.data(this, "_" + n) || t.data(this, "_" + n, new e(this, i))
            }).promise().done(function () {
                var e = t(this[0]).data("_" + n);
                e && e.options.onFormStyled.call()
            }), this;
            if ("string" == typeof i && "_" !== i[0] && "init" !== i) {
                var o;
                return this.each(function () {
                    var a = t.data(this, "_" + n);
                    a instanceof e && "function" == typeof a[i] && (o = a[i].apply(a, Array.prototype.slice.call(s, 1)))
                }), void 0 !== o ? o : this
            }
        }, i.registered = !1
    }),
    function (t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : jQuery)
    }(function (t) {
        function e(e, n, s) {
            var n = {
                content: {
                    message: "object" == typeof n ? n.message : n,
                    title: n.title ? n.title : "",
                    icon: n.icon ? n.icon : "",
                    url: n.url ? n.url : "#",
                    target: n.target ? n.target : "-"
                }
            };
            s = t.extend(!0, {}, n, s), this.settings = t.extend(!0, {}, i, s), this._defaults = i, "-" == this.settings.content.target && (this.settings.content.target = this.settings.url_target), this.animations = {
                start: "webkitAnimationStart oanimationstart MSAnimationStart animationstart",
                end: "webkitAnimationEnd oanimationend MSAnimationEnd animationend"
            }, "number" == typeof this.settings.offset && (this.settings.offset = {
                x: this.settings.offset,
                y: this.settings.offset
            }), this.init()
        }

        var i = {
            element: "body",
            position: null,
            type: "info",
            allow_dismiss: !0,
            newest_on_top: !1,
            showProgressbar: !1,
            placement: {
                from: "top",
                align: "right"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 5e3,
            timer: 1e3,
            url_target: "_blank",
            mouse_over: null,
            animate: {
                enter: "animated fadeInDown",
                exit: "animated fadeOutUp"
            },
            onShow: null,
            onShown: null,
            onClose: null,
            onClosed: null,
            icon_type: "class",
            template: '<div data-notify="container" class="col-xs-11 col-sm-4 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        };
        String.format = function () {
            for (var t = arguments[0], e = 1; e < arguments.length; e++) t = t.replace(RegExp("\\{" + (e - 1) + "\\}", "gm"), arguments[e]);
            return t
        }, t.extend(e.prototype, {
            init: function () {
                var t = this;
                this.buildNotify(), this.settings.content.icon && this.setIcon(), "#" != this.settings.content.url && this.styleURL(), this.placement(), this.bind(), this.notify = {
                    $ele: this.$ele,
                    update: function (e, i) {
                        var n = {};
                        "string" == typeof e ? n[e] = i : n = e;
                        for (var e in n) switch (e) {
                            case "type":
                                this.$ele.removeClass("alert-" + t.settings.type), this.$ele.find('[data-notify="progressbar"] > .progress-bar').removeClass("progress-bar-" + t.settings.type), t.settings.type = n[e], this.$ele.addClass("alert-" + n[e]).find('[data-notify="progressbar"] > .progress-bar').addClass("progress-bar-" + n[e]);
                                break;
                            case "icon":
                                var s = this.$ele.find('[data-notify="icon"]');
                                "class" == t.settings.icon_type.toLowerCase() ? s.removeClass(t.settings.content.icon).addClass(n[e]) : (s.is("img") || s.find("img"), s.attr("src", n[e]));
                                break;
                            case "progress":
                                var o = t.settings.delay - t.settings.delay * (n[e] / 100);
                                this.$ele.data("notify-delay", o), this.$ele.find('[data-notify="progressbar"] > div').attr("aria-valuenow", n[e]).css("width", n[e] + "%");
                                break;
                            case "url":
                                this.$ele.find('[data-notify="url"]').attr("href", n[e]);
                                break;
                            case "target":
                                this.$ele.find('[data-notify="url"]').attr("target", n[e]);
                                break;
                            default:
                                this.$ele.find('[data-notify="' + e + '"]').html(n[e])
                        }
                        var a = this.$ele.outerHeight() + parseInt(t.settings.spacing) + parseInt(t.settings.offset.y);
                        t.reposition(a)
                    },
                    close: function () {
                        t.close()
                    }
                }
            },
            buildNotify: function () {
                var e = this.settings.content;
                this.$ele = t(String.format(this.settings.template, this.settings.type, e.title, e.message, e.url, e.target)), this.$ele.attr("data-notify-position", this.settings.placement.from + "-" + this.settings.placement.align), this.settings.allow_dismiss || this.$ele.find('[data-notify="dismiss"]').css("display", "none"), (this.settings.delay <= 0 && !this.settings.showProgressbar || !this.settings.showProgressbar) && this.$ele.find('[data-notify="progressbar"]').remove()
            },
            setIcon: function () {
                "class" == this.settings.icon_type.toLowerCase() ? this.$ele.find('[data-notify="icon"]').addClass(this.settings.content.icon) : this.$ele.find('[data-notify="icon"]').is("img") ? this.$ele.find('[data-notify="icon"]').attr("src", this.settings.content.icon) : this.$ele.find('[data-notify="icon"]').append('<img src="' + this.settings.content.icon + '" alt="Notify Icon" >')
            },
            styleURL: function () {
                this.$ele.find('[data-notify="url"]').css({
                    backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)",
                    height: "100%",
                    left: "0px",
                    position: "absolute",
                    top: "0px",
                    width: "100%",
                    zIndex: this.settings.z_index + 1
                }), this.$ele.find('[data-notify="dismiss"]').css({
                    position: "absolute",
                    right: "10px",
                    top: "5px",
                    zIndex: this.settings.z_index + 2
                })
            },
            placement: function () {
                var e = this,
                    i = this.settings.offset.y,
                    n = {
                        display: "inline-block",
                        margin: "0px auto",
                        position: this.settings.position ? this.settings.position : "body" === this.settings.element ? "fixed" : "absolute",
                        transition: "all .5s ease-in-out",
                        zIndex: this.settings.z_index
                    },
                    s = !1,
                    o = this.settings;
                switch (t('[data-notify-position="' + this.settings.placement.from + "-" + this.settings.placement.align + '"]:not([data-closing="true"])').each(function () {
                    return i = Math.max(i, parseInt(t(this).css(o.placement.from)) + parseInt(t(this).outerHeight()) + parseInt(o.spacing))
                }), 1 == this.settings.newest_on_top && (i = this.settings.offset.y), n[this.settings.placement.from] = i + "px", this.settings.placement.align) {
                    case "left":
                    case "right":
                        n[this.settings.placement.align] = this.settings.offset.x + "px";
                        break;
                    case "center":
                        n.left = 0, n.right = 0
                }
                this.$ele.css(n).addClass(this.settings.animate.enter), t.each(Array("webkit", "moz", "o", "ms", ""), function (t, i) {
                    e.$ele[0].style[i + "AnimationIterationCount"] = 1
                }), t(this.settings.element).append(this.$ele), 1 == this.settings.newest_on_top && (i = parseInt(i) + parseInt(this.settings.spacing) + this.$ele.outerHeight(), this.reposition(i)), t.isFunction(e.settings.onShow) && e.settings.onShow.call(this.$ele), this.$ele.one(this.animations.start, function () {
                    s = !0
                }).one(this.animations.end, function () {
                    t.isFunction(e.settings.onShown) && e.settings.onShown.call(this)
                }), setTimeout(function () {
                    s || t.isFunction(e.settings.onShown) && e.settings.onShown.call(this)
                }, 600)
            },
            bind: function () {
                var e = this;
                if (this.$ele.find('[data-notify="dismiss"]').on("click", function () {
                    e.close()
                }), this.$ele.mouseover(function () {
                    t(this).data("data-hover", "true")
                }).mouseout(function () {
                    t(this).data("data-hover", "false")
                }), this.$ele.data("data-hover", "false"), this.settings.delay > 0) {
                    e.$ele.data("notify-delay", e.settings.delay);
                    var i = setInterval(function () {
                        var t = parseInt(e.$ele.data("notify-delay")) - e.settings.timer;
                        if ("false" === e.$ele.data("data-hover") && "pause" == e.settings.mouse_over || "pause" != e.settings.mouse_over) {
                            var n = (e.settings.delay - t) / e.settings.delay * 100;
                            e.$ele.data("notify-delay", t), e.$ele.find('[data-notify="progressbar"] > div').attr("aria-valuenow", n).css("width", n + "%")
                        }
                        t <= -e.settings.timer && (clearInterval(i), e.close())
                    }, e.settings.timer)
                }
            },
            close: function () {
                var e = this,
                    i = parseInt(this.$ele.css(this.settings.placement.from)),
                    n = !1;
                this.$ele.data("closing", "true").addClass(this.settings.animate.exit), e.reposition(i), t.isFunction(e.settings.onClose) && e.settings.onClose.call(this.$ele), this.$ele.one(this.animations.start, function () {
                    n = !0
                }).one(this.animations.end, function () {
                    t(this).remove(), t.isFunction(e.settings.onClosed) && e.settings.onClosed.call(this)
                }), setTimeout(function () {
                    n || (e.$ele.remove(), e.settings.onClosed && e.settings.onClosed(e.$ele))
                }, 600)
            },
            reposition: function (e) {
                var i = this,
                    n = '[data-notify-position="' + this.settings.placement.from + "-" + this.settings.placement.align + '"]:not([data-closing="true"])',
                    s = this.$ele.nextAll(n);
                1 == this.settings.newest_on_top && (s = this.$ele.prevAll(n)), s.each(function () {
                    t(this).css(i.settings.placement.from, e), e = parseInt(e) + parseInt(i.settings.spacing) + t(this).outerHeight()
                })
            }
        }), t.notify = function (t, i) {
            return new e(this, t, i).notify
        }, t.notifyDefaults = function (e) {
            return i = t.extend(!0, {}, i, e)
        }, t.notifyClose = function (e) {
            void 0 === e || "all" == e ? t("[data-notify]").find('[data-notify="dismiss"]').trigger("click") : t('[data-notify-position="' + e + '"]').find('[data-notify="dismiss"]').trigger("click")
        }
    }),
    function (t) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
    }(function (t) {
        "use strict";

        function e(t) {
            if (t instanceof Date) return t;
            if (String(t).match(a)) return String(t).match(/^[0-9]*$/) && (t = Number(t)), String(t).match(/\-/) && (t = String(t).replace(/\-/g, "/")), new Date(t);
            throw new Error("Couldn't cast `" + t + "` to a date object.")
        }

        function i(t) {
            var e = t.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
            return new RegExp(e)
        }

        function n(t) {
            return function (e) {
                var n = e.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
                if (n)
                    for (var o = 0, a = n.length; o < a; ++o) {
                        var r = n[o].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),
                            c = i(r[0]),
                            d = r[1] || "",
                            u = r[3] || "",
                            h = null;
                        r = r[2], l.hasOwnProperty(r) && (h = l[r], h = Number(t[h])), null !== h && ("!" === d && (h = s(u, h)), "" === d && h < 10 && (h = "0" + h.toString()), e = e.replace(c, h.toString()))
                    }
                return e = e.replace(/%%/, "%")
            }
        }

        function s(t, e) {
            var i = "s",
                n = "";
            return t && (t = t.replace(/(:|;|\s)/gi, "").split(/\,/), 1 === t.length ? i = t[0] : (n = t[0], i = t[1])), Math.abs(e) > 1 ? i : n
        }

        var o = [],
            a = [],
            r = {
                precision: 100,
                elapse: !1,
                defer: !1
            };
        a.push(/^[0-9]*$/.source), a.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), a.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), a = new RegExp(a.join("|"));
        var l = {
            Y: "years",
            m: "months",
            n: "daysToMonth",
            d: "daysToWeek",
            w: "weeks",
            W: "weeksToMonth",
            H: "hours",
            M: "minutes",
            S: "seconds",
            D: "totalDays",
            I: "totalHours",
            N: "totalMinutes",
            T: "totalSeconds"
        },
            c = function (e, i, n) {
                this.el = e, this.$el = t(e), this.interval = null, this.offset = {}, this.options = t.extend({}, r), this.instanceNumber = o.length, o.push(this), this.$el.data("countdown-instance", this.instanceNumber), n && ("function" == typeof n ? (this.$el.on("update.countdown", n), this.$el.on("stoped.countdown", n), this.$el.on("finish.countdown", n)) : this.options = t.extend({}, r, n)), this.setFinalDate(i), !1 === this.options.defer && this.start()
            };
        t.extend(c.prototype, {
            start: function () {
                null !== this.interval && clearInterval(this.interval);
                var t = this;
                this.update(), this.interval = setInterval(function () {
                    t.update.call(t)
                }, this.options.precision)
            },
            stop: function () {
                clearInterval(this.interval), this.interval = null, this.dispatchEvent("stoped")
            },
            toggle: function () {
                this.interval ? this.stop() : this.start()
            },
            pause: function () {
                this.stop()
            },
            resume: function () {
                this.start()
            },
            remove: function () {
                this.stop.call(this), o[this.instanceNumber] = null, delete this.$el.data().countdownInstance
            },
            setFinalDate: function (t) {
                this.finalDate = e(t)
            },
            update: function () {
                if (0 === this.$el.closest("html").length) return void this.remove();
                var e, i = void 0 !== t._data(this.el, "events"),
                    n = new Date;
                e = this.finalDate.getTime() - n.getTime(), e = Math.ceil(e / 1e3), e = !this.options.elapse && e < 0 ? 0 : Math.abs(e), this.totalSecsLeft !== e && i && (this.totalSecsLeft = e, this.elapsed = n >= this.finalDate, this.offset = {
                    seconds: this.totalSecsLeft % 60,
                    minutes: Math.floor(this.totalSecsLeft / 60) % 60,
                    hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
                    days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                    daysToWeek: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                    daysToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 % 30.4368),
                    weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
                    weeksToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7) % 4,
                    months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30.4368),
                    years: Math.abs(this.finalDate.getFullYear() - n.getFullYear()),
                    totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
                    totalHours: Math.floor(this.totalSecsLeft / 60 / 60),
                    totalMinutes: Math.floor(this.totalSecsLeft / 60),
                    totalSeconds: this.totalSecsLeft
                }, this.options.elapse || 0 !== this.totalSecsLeft ? this.dispatchEvent("update") : (this.stop(), this.dispatchEvent("finish")))
            },
            dispatchEvent: function (e) {
                var i = t.Event(e + ".countdown");
                i.finalDate = this.finalDate, i.elapsed = this.elapsed, i.offset = t.extend({}, this.offset), i.strftime = n(this.offset), this.$el.trigger(i)
            }
        }), t.fn.countdown = function () {
            var e = Array.prototype.slice.call(arguments, 0);
            return this.each(function () {
                var i = t(this).data("countdown-instance");
                if (void 0 !== i) {
                    var n = o[i],
                        s = e[0];
                    c.prototype.hasOwnProperty(s) ? n[s].apply(n, e.slice(1)) : null === String(s).match(/^[$A-Z_][0-9A-Z_$]*$/i) ? (n.setFinalDate.call(n, s), n.start()) : t.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, s))
                } else new c(this, e[0], e[1])
            })
        }
    }),
    function (t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : jQuery)
    }(function (t) {
        function e(t) {
            return r.raw ? t : encodeURIComponent(t)
        }

        function i(t) {
            return r.raw ? t : decodeURIComponent(t)
        }

        function n(t) {
            return e(r.json ? JSON.stringify(t) : String(t))
        }

        function s(t) {
            0 === t.indexOf('"') && (t = t.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
            try {
                return t = decodeURIComponent(t.replace(a, " ")), r.json ? JSON.parse(t) : t
            } catch (t) {
            }
        }

        function o(e, i) {
            var n = r.raw ? e : s(e);
            return t.isFunction(i) ? i(n) : n
        }

        var a = /\+/g,
            r = t.cookie = function (s, a, l) {
                if (void 0 !== a && !t.isFunction(a)) {
                    if (l = t.extend({}, r.defaults, l), "number" == typeof l.expires) {
                        var c = l.expires,
                            d = l.expires = new Date;
                        d.setTime(+d + 864e5 * c)
                    }
                    return document.cookie = [e(s), "=", n(a), l.expires ? "; expires=" + l.expires.toUTCString() : "", l.path ? "; path=" + l.path : "", l.domain ? "; domain=" + l.domain : "", l.secure ? "; secure" : ""].join("")
                }
                for (var u = s ? void 0 : {}, h = document.cookie ? document.cookie.split("; ") : [], p = 0, f = h.length; p < f; p++) {
                    var m = h[p].split("="),
                        g = i(m.shift()),
                        v = m.join("=");
                    if (s && s === g) {
                        u = o(v, a);
                        break
                    }
                    s || void 0 === (v = o(v)) || (u[g] = v)
                }
                return u
            };
        r.defaults = {}, t.removeCookie = function (e, i) {
            return void 0 !== t.cookie(e) && (t.cookie(e, "", t.extend({}, i, {
                expires: -1
            })), !t.cookie(e))
        }
    }),
    function (t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
    }(function (t) {
        var e, i, n, s, o, a, r = "Close",
            l = "BeforeClose",
            c = "MarkupParse",
            d = "Open",
            u = "Change",
            h = "mfp",
            p = "." + h,
            f = "mfp-ready",
            m = "mfp-removing",
            g = "mfp-prevent-close",
            v = function () {
            },
            _ = !!window.jQuery,
            y = t(window),
            b = function (t, i) {
                e.ev.on(h + t + p, i)
            },
            w = function (e, i, n, s) {
                var o = document.createElement("div");
                return o.className = "mfp-" + e, n && (o.innerHTML = n), s ? i && i.appendChild(o) : (o = t(o), i && o.appendTo(i)), o
            },
            x = function (i, n) {
                e.ev.triggerHandler(h + i, n), e.st.callbacks && (i = i.charAt(0).toLowerCase() + i.slice(1), e.st.callbacks[i] && e.st.callbacks[i].apply(e, t.isArray(n) ? n : [n]))
            },
            C = function (i) {
                return i === a && e.currTemplate.closeBtn || (e.currTemplate.closeBtn = t(e.st.closeMarkup.replace("%title%", e.st.tClose)), a = i), e.currTemplate.closeBtn
            },
            k = function () {
                t.magnificPopup.instance || (e = new v, e.init(), t.magnificPopup.instance = e)
            },
            S = function () {
                var t = document.createElement("p").style,
                    e = ["ms", "O", "Moz", "Webkit"];
                if (void 0 !== t.transition) return !0;
                for (; e.length;)
                    if (e.pop() + "Transition" in t) return !0;
                return !1
            };
        v.prototype = {
            constructor: v,
            init: function () {
                var i = navigator.appVersion;
                e.isLowIE = e.isIE8 = document.all && !document.addEventListener, e.isAndroid = /android/gi.test(i), e.isIOS = /iphone|ipad|ipod/gi.test(i), e.supportsTransition = S(), e.probablyMobile = e.isAndroid || e.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), n = t(document), e.popupsCache = {}
            },
            open: function (i) {
                var s;
                if (!1 === i.isObj) {
                    e.items = i.items.toArray(), e.index = 0;
                    var a, r = i.items;
                    for (s = 0; s < r.length; s++)
                        if (a = r[s], a.parsed && (a = a.el[0]), a === i.el[0]) {
                            e.index = s;
                            break
                        }
                } else e.items = t.isArray(i.items) ? i.items : [i.items], e.index = i.index || 0;
                if (e.isOpen) return void e.updateItemHTML();
                e.types = [], o = "", i.mainEl && i.mainEl.length ? e.ev = i.mainEl.eq(0) : e.ev = n, i.key ? (e.popupsCache[i.key] || (e.popupsCache[i.key] = {}), e.currTemplate = e.popupsCache[i.key]) : e.currTemplate = {}, e.st = t.extend(!0, {}, t.magnificPopup.defaults, i), e.fixedContentPos = "auto" === e.st.fixedContentPos ? !e.probablyMobile : e.st.fixedContentPos, e.st.modal && (e.st.closeOnContentClick = !1, e.st.closeOnBgClick = !1, e.st.showCloseBtn = !1, e.st.enableEscapeKey = !1), e.bgOverlay || (e.bgOverlay = w("bg").on("click" + p, function () {
                    e.close()
                }), e.wrap = w("wrap").attr("tabindex", -1).on("click" + p, function (t) {
                    e._checkIfClose(t.target) && e.close()
                }), e.container = w("container", e.wrap)), e.contentContainer = w("content"), e.st.preloader && (e.preloader = w("preloader", e.container, e.st.tLoading));
                var l = t.magnificPopup.modules;
                for (s = 0; s < l.length; s++) {
                    var u = l[s];
                    u = u.charAt(0).toUpperCase() + u.slice(1), e["init" + u].call(e)
                }
                x("BeforeOpen"), e.st.showCloseBtn && (e.st.closeBtnInside ? (b(c, function (t, e, i, n) {
                    i.close_replaceWith = C(n.type)
                }), o += " mfp-close-btn-in") : e.wrap.append(C())), e.st.alignTop && (o += " mfp-align-top"), e.fixedContentPos ? e.wrap.css({
                    overflow: e.st.overflowY,
                    overflowX: "hidden",
                    overflowY: e.st.overflowY
                }) : e.wrap.css({
                    top: y.scrollTop(),
                    position: "absolute"
                }), (!1 === e.st.fixedBgPos || "auto" === e.st.fixedBgPos && !e.fixedContentPos) && e.bgOverlay.css({
                    height: n.height(),
                    position: "absolute"
                }), e.st.enableEscapeKey && n.on("keyup" + p, function (t) {
                    27 === t.keyCode && e.close()
                }), y.on("resize" + p, function () {
                    e.updateSize()
                }), e.st.closeOnContentClick || (o += " mfp-auto-cursor"), o && e.wrap.addClass(o);
                var h = e.wH = y.height(),
                    m = {};
                if (e.fixedContentPos && e._hasScrollBar(h)) {
                    var g = e._getScrollbarSize();
                    g && (m.marginRight = g)
                }
                e.fixedContentPos && (e.isIE7 ? t("body, html").css("overflow", "hidden") : m.overflow = "hidden");
                var v = e.st.mainClass;
                return e.isIE7 && (v += " mfp-ie7"), v && e._addClassTomfp(v), e.updateItemHTML(), x("BuildControls"), t("html").css(m), e.bgOverlay.add(e.wrap).prependTo(e.st.prependTo || t(document.body)), e._lastFocusedEl = document.activeElement, setTimeout(function () {
                    e.content ? (e._addClassTomfp(f), e._setFocus()) : e.bgOverlay.addClass(f), n.on("focusin" + p, e._onFocusIn)
                }, 16), e.isOpen = !0, e.updateSize(h), x(d), i
            },
            close: function () {
                e.isOpen && (x(l), e.isOpen = !1, e.st.removalDelay && !e.isLowIE && e.supportsTransition ? (e._addClassTomfp(m), setTimeout(function () {
                    e._close()
                }, e.st.removalDelay)) : e._close())
            },
            _close: function () {
                x(r);
                var i = m + " " + f + " ";
                if (e.bgOverlay.detach(), e.wrap.detach(), e.container.empty(), e.st.mainClass && (i += e.st.mainClass + " "), e._removeClassFrommfp(i), e.fixedContentPos) {
                    var s = {
                        marginRight: ""
                    };
                    e.isIE7 ? t("body, html").css("overflow", "") : s.overflow = "", t("html").css(s)
                }
                n.off("keyup" + p + " focusin" + p), e.ev.off(p), e.wrap.attr("class", "mfp-wrap").removeAttr("style"), e.bgOverlay.attr("class", "mfp-bg"), e.container.attr("class", "mfp-container"), !e.st.showCloseBtn || e.st.closeBtnInside && !0 !== e.currTemplate[e.currItem.type] || e.currTemplate.closeBtn && e.currTemplate.closeBtn.detach(), e.st.autoFocusLast && e._lastFocusedEl && t(e._lastFocusedEl).focus(), e.currItem = null, e.content = null, e.currTemplate = null, e.prevHeight = 0, x("AfterClose")
            },
            updateSize: function (t) {
                if (e.isIOS) {
                    var i = document.documentElement.clientWidth / window.innerWidth,
                        n = window.innerHeight * i;
                    e.wrap.css("height", n), e.wH = n
                } else e.wH = t || y.height();
                e.fixedContentPos || e.wrap.css("height", e.wH), x("Resize")
            },
            updateItemHTML: function () {
                var i = e.items[e.index];
                e.contentContainer.detach(), e.content && e.content.detach(), i.parsed || (i = e.parseEl(e.index));
                var n = i.type;
                if (x("BeforeChange", [e.currItem ? e.currItem.type : "", n]), e.currItem = i, !e.currTemplate[n]) {
                    var o = !!e.st[n] && e.st[n].markup;
                    x("FirstMarkupParse", o), e.currTemplate[n] = !o || t(o)
                }
                s && s !== i.type && e.container.removeClass("mfp-" + s + "-holder");
                var a = e["get" + n.charAt(0).toUpperCase() + n.slice(1)](i, e.currTemplate[n]);
                e.appendContent(a, n), i.preloaded = !0, x(u, i), s = i.type, e.container.prepend(e.contentContainer), x("AfterChange")
            },
            appendContent: function (t, i) {
                e.content = t, t ? e.st.showCloseBtn && e.st.closeBtnInside && !0 === e.currTemplate[i] ? e.content.find(".mfp-close").length || e.content.append(C()) : e.content = t : e.content = "", x("BeforeAppend"), e.container.addClass("mfp-" + i + "-holder"), e.contentContainer.append(e.content)
            },
            parseEl: function (i) {
                var n, s = e.items[i];
                if (s.tagName ? s = {
                    el: t(s)
                } : (n = s.type, s = {
                    data: s,
                    src: s.src
                }), s.el) {
                    for (var o = e.types, a = 0; a < o.length; a++)
                        if (s.el.hasClass("mfp-" + o[a])) {
                            n = o[a];
                            break
                        }
                    s.src = s.el.attr("data-mfp-src"), s.src || (s.src = s.el.attr("href"))
                }
                return s.type = n || e.st.type || "inline", s.index = i, s.parsed = !0, e.items[i] = s, x("ElementParse", s), e.items[i]
            },
            addGroup: function (t, i) {
                var n = function (n) {
                    n.mfpEl = this, e._openClick(n, t, i)
                };
                i || (i = {});
                var s = "click.magnificPopup";
                i.mainEl = t, i.items ? (i.isObj = !0, t.off(s).on(s, n)) : (i.isObj = !1, i.delegate ? t.off(s).on(s, i.delegate, n) : (i.items = t, t.off(s).on(s, n)))
            },
            _openClick: function (i, n, s) {
                if ((void 0 !== s.midClick ? s.midClick : t.magnificPopup.defaults.midClick) || !(2 === i.which || i.ctrlKey || i.metaKey || i.altKey || i.shiftKey)) {
                    var o = void 0 !== s.disableOn ? s.disableOn : t.magnificPopup.defaults.disableOn;
                    if (o)
                        if (t.isFunction(o)) {
                            if (!o.call(e)) return !0
                        } else if (y.width() < o) return !0;
                    i.type && (i.preventDefault(), e.isOpen && i.stopPropagation()), s.el = t(i.mfpEl), s.delegate && (s.items = n.find(s.delegate)), e.open(s)
                }
            },
            updateStatus: function (t, n) {
                if (e.preloader) {
                    i !== t && e.container.removeClass("mfp-s-" + i), n || "loading" !== t || (n = e.st.tLoading);
                    var s = {
                        status: t,
                        text: n
                    };
                    x("UpdateStatus", s), t = s.status, n = s.text, e.preloader.html(n), e.preloader.find("a").on("click", function (t) {
                        t.stopImmediatePropagation()
                    }), e.container.addClass("mfp-s-" + t), i = t
                }
            },
            _checkIfClose: function (i) {
                if (!t(i).hasClass(g)) {
                    var n = e.st.closeOnContentClick,
                        s = e.st.closeOnBgClick;
                    if (n && s) return !0;
                    if (!e.content || t(i).hasClass("mfp-close") || e.preloader && i === e.preloader[0]) return !0;
                    if (i === e.content[0] || t.contains(e.content[0], i)) {
                        if (n) return !0
                    } else if (s && t.contains(document, i)) return !0;
                    return !1
                }
            },
            _addClassTomfp: function (t) {
                e.bgOverlay.addClass(t), e.wrap.addClass(t)
            },
            _removeClassFrommfp: function (t) {
                this.bgOverlay.removeClass(t), e.wrap.removeClass(t)
            },
            _hasScrollBar: function (t) {
                return (e.isIE7 ? n.height() : document.body.scrollHeight) > (t || y.height())
            },
            _setFocus: function () {
                (e.st.focus ? e.content.find(e.st.focus).eq(0) : e.wrap).focus()
            },
            _onFocusIn: function (i) {
                return i.target === e.wrap[0] || t.contains(e.wrap[0], i.target) ? void 0 : (e._setFocus(), !1)
            },
            _parseMarkup: function (e, i, n) {
                var s;
                n.data && (i = t.extend(n.data, i)), x(c, [e, i, n]), t.each(i, function (i, n) {
                    if (void 0 === n || !1 === n) return !0;
                    if (s = i.split("_"), s.length > 1) {
                        var o = e.find(p + "-" + s[0]);
                        if (o.length > 0) {
                            var a = s[1];
                            "replaceWith" === a ? o[0] !== n[0] && o.replaceWith(n) : "img" === a ? o.is("img") ? o.attr("src", n) : o.replaceWith(t("<img>").attr("src", n).attr("class", o.attr("class"))) : o.attr(s[1], n)
                        }
                    } else e.find(p + "-" + i).html(n)
                })
            },
            _getScrollbarSize: function () {
                if (void 0 === e.scrollbarSize) {
                    var t = document.createElement("div");
                    t.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(t), e.scrollbarSize = t.offsetWidth - t.clientWidth, document.body.removeChild(t)
                }
                return e.scrollbarSize
            }
        }, t.magnificPopup = {
            instance: null,
            proto: v.prototype,
            modules: [],
            open: function (e, i) {
                return k(), e = e ? t.extend(!0, {}, e) : {}, e.isObj = !0, e.index = i || 0, this.instance.open(e)
            },
            close: function () {
                return t.magnificPopup.instance && t.magnificPopup.instance.close()
            },
            registerModule: function (e, i) {
                i.options && (t.magnificPopup.defaults[e] = i.options), t.extend(this.proto, i.proto), this.modules.push(e)
            },
            defaults: {
                disableOn: 0,
                key: null,
                midClick: !1,
                mainClass: "",
                preloader: !0,
                focus: "",
                closeOnContentClick: !1,
                closeOnBgClick: !0,
                closeBtnInside: !0,
                showCloseBtn: !0,
                enableEscapeKey: !0,
                modal: !1,
                alignTop: !1,
                removalDelay: 0,
                prependTo: null,
                fixedContentPos: "auto",
                fixedBgPos: "auto",
                overflowY: "auto",
                closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
                tClose: "Close (Esc)",
                tLoading: "Loading...",
                autoFocusLast: !0
            }
        }, t.fn.magnificPopup = function (i) {
            k();
            var n = t(this);
            if ("string" == typeof i)
                if ("open" === i) {
                    var s, o = _ ? n.data("magnificPopup") : n[0].magnificPopup,
                        a = parseInt(arguments[1], 10) || 0;
                    o.items ? s = o.items[a] : (s = n, o.delegate && (s = s.find(o.delegate)), s = s.eq(a)), e._openClick({
                        mfpEl: s
                    }, n, o)
                } else e.isOpen && e[i].apply(e, Array.prototype.slice.call(arguments, 1));
            else i = t.extend(!0, {}, i), _ ? n.data("magnificPopup", i) : n[0].magnificPopup = i, e.addGroup(n, i);
            return n
        };
        var T, I, D, E = "inline",
            A = function () {
                D && (I.after(D.addClass(T)).detach(), D = null)
            };
        t.magnificPopup.registerModule(E, {
            options: {
                hiddenClass: "hide",
                markup: "",
                tNotFound: "Content not found"
            },
            proto: {
                initInline: function () {
                    e.types.push(E), b(r + "." + E, function () {
                        A()
                    })
                },
                getInline: function (i, n) {
                    if (A(), i.src) {
                        var s = e.st.inline,
                            o = t(i.src);
                        if (o.length) {
                            var a = o[0].parentNode;
                            a && a.tagName && (I || (T = s.hiddenClass, I = w(T), T = "mfp-" + T), D = o.after(I).detach().removeClass(T)), e.updateStatus("ready")
                        } else e.updateStatus("error", s.tNotFound), o = t("<div>");
                        return i.inlineElement = o, o
                    }
                    return e.updateStatus("ready"), e._parseMarkup(n, {}, i), n
                }
            }
        });
        var P, M = "ajax",
            j = function () {
                P && t(document.body).removeClass(P)
            },
            $ = function () {
                j(), e.req && e.req.abort()
            };
        t.magnificPopup.registerModule(M, {
            options: {
                settings: null,
                cursor: "mfp-ajax-cur",
                tError: '<a href="%url%">The content</a> could not be loaded.'
            },
            proto: {
                initAjax: function () {
                    e.types.push(M), P = e.st.ajax.cursor, b(r + "." + M, $), b("BeforeChange." + M, $)
                },
                getAjax: function (i) {
                    P && t(document.body).addClass(P), e.updateStatus("loading");
                    var n = t.extend({
                        url: i.src,
                        success: function (n, s, o) {
                            var a = {
                                data: n,
                                xhr: o
                            };
                            x("ParseAjax", a), e.appendContent(t(a.data), M), i.finished = !0, j(), e._setFocus(), setTimeout(function () {
                                e.wrap.addClass(f)
                            }, 16), e.updateStatus("ready"), x("AjaxContentAdded")
                        },
                        error: function () {
                            j(), i.finished = i.loadError = !0, e.updateStatus("error", e.st.ajax.tError.replace("%url%", i.src))
                        }
                    }, e.st.ajax.settings);
                    return e.req = t.ajax(n), ""
                }
            }
        });
        var O, N = function (i) {
            if (i.data && void 0 !== i.data.title) return i.data.title;
            var n = e.st.image.titleSrc;
            if (n) {
                if (t.isFunction(n)) return n.call(e, i);
                if (i.el) return i.el.attr(n) || ""
            }
            return ""
        };
        t.magnificPopup.registerModule("image", {
            options: {
                markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
                cursor: "mfp-zoom-out-cur",
                titleSrc: "title",
                verticalFit: !0,
                tError: '<a href="%url%">The image</a> could not be loaded.'
            },
            proto: {
                initImage: function () {
                    var i = e.st.image,
                        n = ".image";
                    e.types.push("image"), b(d + n, function () {
                        "image" === e.currItem.type && i.cursor && t(document.body).addClass(i.cursor)
                    }), b(r + n, function () {
                        i.cursor && t(document.body).removeClass(i.cursor), y.off("resize" + p)
                    }), b("Resize" + n, e.resizeImage), e.isLowIE && b("AfterChange", e.resizeImage)
                },
                resizeImage: function () {
                    var t = e.currItem;
                    if (t && t.img && e.st.image.verticalFit) {
                        var i = 0;
                        e.isLowIE && (i = parseInt(t.img.css("padding-top"), 10) + parseInt(t.img.css("padding-bottom"), 10)), t.img.css("max-height", e.wH - i)
                    }
                },
                _onImageHasSize: function (t) {
                    t.img && (t.hasSize = !0, O && clearInterval(O), t.isCheckingImgSize = !1, x("ImageHasSize", t), t.imgHidden && (e.content && e.content.removeClass("mfp-loading"), t.imgHidden = !1))
                },
                findImageSize: function (t) {
                    var i = 0,
                        n = t.img[0],
                        s = function (o) {
                            O && clearInterval(O), O = setInterval(function () {
                                return n.naturalWidth > 0 ? void e._onImageHasSize(t) : (i > 200 && clearInterval(O), i++, void (3 === i ? s(10) : 40 === i ? s(50) : 100 === i && s(500)))
                            }, o)
                        };
                    s(1)
                },
                getImage: function (i, n) {
                    var s = 0,
                        o = function () {
                            i && (i.img[0].complete ? (i.img.off(".mfploader"), i === e.currItem && (e._onImageHasSize(i), e.updateStatus("ready")), i.hasSize = !0, i.loaded = !0, x("ImageLoadComplete")) : (s++, 200 > s ? setTimeout(o, 100) : a()))
                        },
                        a = function () {
                            i && (i.img.off(".mfploader"), i === e.currItem && (e._onImageHasSize(i), e.updateStatus("error", r.tError.replace("%url%", i.src))), i.hasSize = !0, i.loaded = !0, i.loadError = !0)
                        },
                        r = e.st.image,
                        l = n.find(".mfp-img");
                    if (l.length) {
                        var c = document.createElement("img");
                        c.className = "mfp-img", i.el && i.el.find("img").length && (c.alt = i.el.find("img").attr("alt")), i.img = t(c).on("load.mfploader", o).on("error.mfploader", a), c.src = i.src, l.is("img") && (i.img = i.img.clone()), c = i.img[0], c.naturalWidth > 0 ? i.hasSize = !0 : c.width || (i.hasSize = !1)
                    }
                    return e._parseMarkup(n, {
                        title: N(i),
                        img_replaceWith: i.img
                    }, i), e.resizeImage(), i.hasSize ? (O && clearInterval(O), i.loadError ? (n.addClass("mfp-loading"), e.updateStatus("error", r.tError.replace("%url%", i.src))) : (n.removeClass("mfp-loading"), e.updateStatus("ready")), n) : (e.updateStatus("loading"), i.loading = !0, i.hasSize || (i.imgHidden = !0, n.addClass("mfp-loading"), e.findImageSize(i)), n)
                }
            }
        });
        var L, z = function () {
            return void 0 === L && (L = void 0 !== document.createElement("p").style.MozTransform), L
        };
        t.magnificPopup.registerModule("zoom", {
            options: {
                enabled: !1,
                easing: "ease-in-out",
                duration: 300,
                opener: function (t) {
                    return t.is("img") ? t : t.find("img")
                }
            },
            proto: {
                initZoom: function () {
                    var t, i = e.st.zoom,
                        n = ".zoom";
                    if (i.enabled && e.supportsTransition) {
                        var s, o, a = i.duration,
                            c = function (t) {
                                var e = t.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                    n = "all " + i.duration / 1e3 + "s " + i.easing,
                                    s = {
                                        position: "fixed",
                                        zIndex: 9999,
                                        left: 0,
                                        top: 0,
                                        "-webkit-backface-visibility": "hidden"
                                    },
                                    o = "transition";
                                return s["-webkit-" + o] = s["-moz-" + o] = s["-o-" + o] = s[o] = n, e.css(s), e
                            },
                            d = function () {
                                e.content.css("visibility", "visible")
                            };
                        b("BuildControls" + n, function () {
                            if (e._allowZoom()) {
                                if (clearTimeout(s), e.content.css("visibility", "hidden"), !(t = e._getItemToZoom())) return void d();
                                o = c(t), o.css(e._getOffset()), e.wrap.append(o), s = setTimeout(function () {
                                    o.css(e._getOffset(!0)), s = setTimeout(function () {
                                        d(), setTimeout(function () {
                                            o.remove(), t = o = null, x("ZoomAnimationEnded")
                                        }, 16)
                                    }, a)
                                }, 16)
                            }
                        }), b(l + n, function () {
                            if (e._allowZoom()) {
                                if (clearTimeout(s), e.st.removalDelay = a, !t) {
                                    if (!(t = e._getItemToZoom())) return;
                                    o = c(t)
                                }
                                o.css(e._getOffset(!0)), e.wrap.append(o), e.content.css("visibility", "hidden"), setTimeout(function () {
                                    o.css(e._getOffset())
                                }, 16)
                            }
                        }), b(r + n, function () {
                            e._allowZoom() && (d(), o && o.remove(), t = null)
                        })
                    }
                },
                _allowZoom: function () {
                    return "image" === e.currItem.type
                },
                _getItemToZoom: function () {
                    return !!e.currItem.hasSize && e.currItem.img
                },
                _getOffset: function (i) {
                    var n;
                    n = i ? e.currItem.img : e.st.zoom.opener(e.currItem.el || e.currItem);
                    var s = n.offset(),
                        o = parseInt(n.css("padding-top"), 10),
                        a = parseInt(n.css("padding-bottom"), 10);
                    s.top -= t(window).scrollTop() - o;
                    var r = {
                        width: n.width(),
                        height: (_ ? n.innerHeight() : n[0].offsetHeight) - a - o
                    };
                    return z() ? r["-moz-transform"] = r.transform = "translate(" + s.left + "px," + s.top + "px)" : (r.left = s.left, r.top = s.top), r
                }
            }
        });
        var F = "iframe",
            H = "//about:blank",
            W = function (t) {
                if (e.currTemplate[F]) {
                    var i = e.currTemplate[F].find("iframe");
                    i.length && (t || (i[0].src = H), e.isIE8 && i.css("display", t ? "block" : "none"))
                }
            };
        t.magnificPopup.registerModule(F, {
            options: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
                srcAction: "iframe_src",
                patterns: {
                    youtube: {
                        index: "youtube.com",
                        id: "v=",
                        src: "//www.youtube.com/embed/%id%?autoplay=1"
                    },
                    vimeo: {
                        index: "vimeo.com/",
                        id: "/",
                        src: "//player.vimeo.com/video/%id%?autoplay=1"
                    },
                    gmaps: {
                        index: "//maps.google.",
                        src: "%id%&output=embed"
                    }
                }
            },
            proto: {
                initIframe: function () {
                    e.types.push(F), b("BeforeChange", function (t, e, i) {
                        e !== i && (e === F ? W() : i === F && W(!0))
                    }), b(r + "." + F, function () {
                        W()
                    })
                },
                getIframe: function (i, n) {
                    var s = i.src,
                        o = e.st.iframe;
                    t.each(o.patterns, function () {
                        return s.indexOf(this.index) > -1 ? (this.id && (s = "string" == typeof this.id ? s.substr(s.lastIndexOf(this.id) + this.id.length, s.length) : this.id.call(this, s)), s = this.src.replace("%id%", s), !1) : void 0
                    });
                    var a = {};
                    return o.srcAction && (a[o.srcAction] = s), e._parseMarkup(n, a, i), e.updateStatus("ready"), n
                }
            }
        });
        var R = function (t) {
            var i = e.items.length;
            return t > i - 1 ? t - i : 0 > t ? i + t : t
        },
            B = function (t, e, i) {
                return t.replace(/%curr%/gi, e + 1).replace(/%total%/gi, i)
            };
        t.magnificPopup.registerModule("gallery", {
            options: {
                enabled: !1,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                preload: [0, 2],
                navigateByImgClick: !0,
                arrows: !0,
                tPrev: "Previous (Left arrow key)",
                tNext: "Next (Right arrow key)",
                tCounter: "%curr% of %total%"
            },
            proto: {
                initGallery: function () {
                    var i = e.st.gallery,
                        s = ".mfp-gallery";
                    return e.direction = !0, !(!i || !i.enabled) && (o += " mfp-gallery", b(d + s, function () {
                        i.navigateByImgClick && e.wrap.on("click" + s, ".mfp-img", function () {
                            return e.items.length > 1 ? (e.next(), !1) : void 0
                        }), n.on("keydown" + s, function (t) {
                            37 === t.keyCode ? e.prev() : 39 === t.keyCode && e.next()
                        })
                    }), b("UpdateStatus" + s, function (t, i) {
                        i.text && (i.text = B(i.text, e.currItem.index, e.items.length))
                    }), b(c + s, function (t, n, s, o) {
                        var a = e.items.length;
                        s.counter = a > 1 ? B(i.tCounter, o.index, a) : ""
                    }), b("BuildControls" + s, function () {
                        if (e.items.length > 1 && i.arrows && !e.arrowLeft) {
                            var n = i.arrowMarkup,
                                s = e.arrowLeft = t(n.replace(/%title%/gi, i.tPrev).replace(/%dir%/gi, "left")).addClass(g),
                                o = e.arrowRight = t(n.replace(/%title%/gi, i.tNext).replace(/%dir%/gi, "right")).addClass(g);
                            s.click(function () {
                                e.prev()
                            }), o.click(function () {
                                e.next()
                            }), e.container.append(s.add(o))
                        }
                    }), b(u + s, function () {
                        e._preloadTimeout && clearTimeout(e._preloadTimeout), e._preloadTimeout = setTimeout(function () {
                            e.preloadNearbyImages(), e._preloadTimeout = null
                        }, 16)
                    }), void b(r + s, function () {
                        n.off(s), e.wrap.off("click" + s), e.arrowRight = e.arrowLeft = null
                    }))
                },
                next: function () {
                    e.direction = !0, e.index = R(e.index + 1), e.updateItemHTML()
                },
                prev: function () {
                    e.direction = !1, e.index = R(e.index - 1), e.updateItemHTML()
                },
                goTo: function (t) {
                    e.direction = t >= e.index, e.index = t, e.updateItemHTML()
                },
                preloadNearbyImages: function () {
                    var t, i = e.st.gallery.preload,
                        n = Math.min(i[0], e.items.length),
                        s = Math.min(i[1], e.items.length);
                    for (t = 1; t <= (e.direction ? s : n); t++) e._preloadItem(e.index + t);
                    for (t = 1; t <= (e.direction ? n : s); t++) e._preloadItem(e.index - t)
                },
                _preloadItem: function (i) {
                    if (i = R(i), !e.items[i].preloaded) {
                        var n = e.items[i];
                        n.parsed || (n = e.parseEl(i)), x("LazyLoad", n), "image" === n.type && (n.img = t('<img class="mfp-img" >').on("load.mfploader", function () {
                            n.hasSize = !0
                        }).on("error.mfploader", function () {
                            n.hasSize = !0, n.loadError = !0, x("LazyLoadError", n)
                        }).attr("src", n.src)), n.preloaded = !0
                    }
                }
            }
        });
        var q = "retina";
        t.magnificPopup.registerModule(q, {
            options: {
                replaceSrc: function (t) {
                    return t.src.replace(/\.\w+$/, function (t) {
                        return "@2x" + t
                    })
                },
                ratio: 1
            },
            proto: {
                initRetina: function () {
                    if (window.devicePixelRatio > 1) {
                        var t = e.st.retina,
                            i = t.ratio;
                        (i = isNaN(i) ? i() : i) > 1 && (b("ImageHasSize." + q, function (t, e) {
                            e.img.css({
                                "max-width": e.img[0].naturalWidth / i,
                                width: "100%"
                            })
                        }), b("ElementParse." + q, function (e, n) {
                            n.src = t.replaceSrc(n, i)
                        }))
                    }
                }
            }
        }), k()
    }),
    function (t, e, i, n) {
        function s(e, i) {
            this.settings = null, this.options = t.extend({}, s.Defaults, i), this.$element = t(e), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
                time: null,
                target: null,
                pointer: null,
                stage: {
                    start: null,
                    current: null
                },
                direction: null
            }, this._states = {
                current: {},
                tags: {
                    initializing: ["busy"],
                    animating: ["busy"],
                    dragging: ["interacting"]
                }
            }, t.each(["onResize", "onThrottledResize"], t.proxy(function (e, i) {
                this._handlers[i] = t.proxy(this[i], this)
            }, this)), t.each(s.Plugins, t.proxy(function (t, e) {
                this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this)
            }, this)), t.each(s.Workers, t.proxy(function (e, i) {
                this._pipe.push({
                    filter: i.filter,
                    run: t.proxy(i.run, this)
                })
            }, this)), this.setup(), this.initialize()
        }

        s.Defaults = {
            items: 3,
            loop: !1,
            center: !1,
            rewind: !1,
            checkVisibility: !0,
            mouseDrag: !0,
            touchDrag: !0,
            pullDrag: !0,
            freeDrag: !1,
            margin: 0,
            stagePadding: 0,
            merge: !1,
            mergeFit: !0,
            autoWidth: !1,
            startPosition: 0,
            rtl: !1,
            smartSpeed: 250,
            fluidSpeed: !1,
            dragEndSpeed: !1,
            responsive: {},
            responsiveRefreshRate: 200,
            responsiveBaseElement: e,
            fallbackEasing: "swing",
            slideTransition: "",
            info: !1,
            nestedItemSelector: !1,
            itemElement: "div",
            stageElement: "div",
            refreshClass: "owl-refresh",
            loadedClass: "owl-loaded",
            loadingClass: "owl-loading",
            rtlClass: "owl-rtl",
            responsiveClass: "owl-responsive",
            dragClass: "owl-drag",
            itemClass: "owl-item",
            stageClass: "owl-stage",
            stageOuterClass: "owl-stage-outer",
            grabClass: "owl-grab"
        }, s.Width = {
            Default: "default",
            Inner: "inner",
            Outer: "outer"
        }, s.Type = {
            Event: "event",
            State: "state"
        }, s.Plugins = {}, s.Workers = [{
            filter: ["width", "settings"],
            run: function () {
                this._width = this.$element.width()
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function (t) {
                t.current = this._items && this._items[this.relative(this._current)]
            }
        }, {
            filter: ["items", "settings"],
            run: function () {
                this.$stage.children(".cloned").remove()
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function (t) {
                var e = this.settings.margin || "",
                    i = !this.settings.autoWidth,
                    n = this.settings.rtl,
                    s = {
                        width: "auto",
                        "margin-left": n ? e : "",
                        "margin-right": n ? "" : e
                    };
                !i && this.$stage.children().css(s), t.css = s
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function (t) {
                var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                    i = null,
                    n = this._items.length,
                    s = !this.settings.autoWidth,
                    o = [];
                for (t.items = {
                    merge: !1,
                    width: e
                }; n--;) i = this._mergers[n], i = this.settings.mergeFit && Math.min(i, this.settings.items) || i, t.items.merge = i > 1 || t.items.merge, o[n] = s ? e * i : this._items[n].width();
                this._widths = o
            }
        }, {
            filter: ["items", "settings"],
            run: function () {
                var e = [],
                    i = this._items,
                    n = this.settings,
                    s = Math.max(2 * n.items, 4),
                    o = 2 * Math.ceil(i.length / 2),
                    a = n.loop && i.length ? n.rewind ? s : Math.max(s, o) : 0,
                    r = "",
                    l = "";
                for (a /= 2; a > 0;) e.push(this.normalize(e.length / 2, !0)), r += i[e[e.length - 1]][0].outerHTML, e.push(this.normalize(i.length - 1 - (e.length - 1) / 2, !0)), l = i[e[e.length - 1]][0].outerHTML + l, a -= 1;
                this._clones = e, t(r).addClass("cloned").appendTo(this.$stage), t(l).addClass("cloned").prependTo(this.$stage)
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function () {
                for (var t = this.settings.rtl ? 1 : -1, e = this._clones.length + this._items.length, i = -1, n = 0, s = 0, o = []; ++i < e;) n = o[i - 1] || 0, s = this._widths[this.relative(i)] + this.settings.margin, o.push(n + s * t);
                this._coordinates = o
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function () {
                var t = this.settings.stagePadding,
                    e = this._coordinates,
                    i = {
                        width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
                        "padding-left": t || "",
                        "padding-right": t || ""
                    };
                this.$stage.css(i)
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function (t) {
                var e = this._coordinates.length,
                    i = !this.settings.autoWidth,
                    n = this.$stage.children();
                if (i && t.items.merge)
                    for (; e--;) t.css.width = this._widths[this.relative(e)], n.eq(e).css(t.css);
                else i && (t.css.width = t.items.width, n.css(t.css))
            }
        }, {
            filter: ["items"],
            run: function () {
                this._coordinates.length < 1 && this.$stage.removeAttr("style")
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function (t) {
                t.current = t.current ? this.$stage.children().index(t.current) : 0, t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current)), this.reset(t.current)
            }
        }, {
            filter: ["position"],
            run: function () {
                this.animate(this.coordinates(this._current))
            }
        }, {
            filter: ["width", "position", "items", "settings"],
            run: function () {
                var t, e, i, n, s = this.settings.rtl ? 1 : -1,
                    o = 2 * this.settings.stagePadding,
                    a = this.coordinates(this.current()) + o,
                    r = a + this.width() * s,
                    l = [];
                for (i = 0, n = this._coordinates.length; i < n; i++) t = this._coordinates[i - 1] || 0, e = Math.abs(this._coordinates[i]) + o * s, (this.op(t, "<=", a) && this.op(t, ">", r) || this.op(e, "<", a) && this.op(e, ">", r)) && l.push(i);
                this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + l.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center")
            }
        }], s.prototype.initializeStage = function () {
            this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = t("<" + this.settings.stageElement + ">", {
                class: this.settings.stageClass
            }).wrap(t("<div/>", {
                class: this.settings.stageOuterClass
            })), this.$element.append(this.$stage.parent()))
        }, s.prototype.initializeItems = function () {
            var e = this.$element.find(".owl-item");
            if (e.length) return this._items = e.get().map(function (e) {
                return t(e)
            }), this._mergers = this._items.map(function () {
                return 1
            }), void this.refresh();
            this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)
        }, s.prototype.initialize = function () {
            if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
                var t, e, i;
                t = this.$element.find("img"), e = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : n, i = this.$element.children(e).width(), t.length && i <= 0 && this.preloadAutoWidthImages(t)
            }
            this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
        }, s.prototype.isVisible = function () {
            return !this.settings.checkVisibility || this.$element.is(":visible")
        }, s.prototype.setup = function () {
            var e = this.viewport(),
                i = this.options.responsive,
                n = -1,
                s = null;
            i ? (t.each(i, function (t) {
                t <= e && t > n && (n = Number(t))
            }), s = t.extend({}, this.options, i[n]), "function" == typeof s.stagePadding && (s.stagePadding = s.stagePadding()), delete s.responsive, s.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + n))) : s = t.extend({}, this.options), this.trigger("change", {
                property: {
                    name: "settings",
                    value: s
                }
            }), this._breakpoint = n, this.settings = s, this.invalidate("settings"), this.trigger("changed", {
                property: {
                    name: "settings",
                    value: this.settings
                }
            })
        }, s.prototype.optionsLogic = function () {
            this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
        }, s.prototype.prepare = function (e) {
            var i = this.trigger("prepare", {
                content: e
            });
            return i.data || (i.data = t("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(e)), this.trigger("prepared", {
                content: i.data
            }), i.data
        }, s.prototype.update = function () {
            for (var e = 0, i = this._pipe.length, n = t.proxy(function (t) {
                return this[t]
            }, this._invalidated), s = {}; e < i;) (this._invalidated.all || t.grep(this._pipe[e].filter, n).length > 0) && this._pipe[e].run(s), e++;
            this._invalidated = {}, !this.is("valid") && this.enter("valid")
        }, s.prototype.width = function (t) {
            switch (t = t || s.Width.Default) {
                case s.Width.Inner:
                case s.Width.Outer:
                    return this._width;
                default:
                    return this._width - 2 * this.settings.stagePadding + this.settings.margin
            }
        }, s.prototype.refresh = function () {
            this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
        }, s.prototype.onThrottledResize = function () {
            e.clearTimeout(this.resizeTimer), this.resizeTimer = e.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
        }, s.prototype.onResize = function () {
            return !!this._items.length && this._width !== this.$element.width() && !!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
        }, s.prototype.registerEventHandlers = function () {
            t.support.transition && this.$stage.on(t.support.transition.end + ".owl.core", t.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(e, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", t.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
                return !1
            })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", t.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", t.proxy(this.onDragEnd, this)))
        }, s.prototype.onDragStart = function (e) {
            var n = null;
            3 !== e.which && (t.support.transform ? (n = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), n = {
                x: n[16 === n.length ? 12 : 4],
                y: n[16 === n.length ? 13 : 5]
            }) : (n = this.$stage.position(), n = {
                x: this.settings.rtl ? n.left + this.$stage.width() - this.width() + this.settings.margin : n.left,
                y: n.top
            }), this.is("animating") && (t.support.transform ? this.animate(n.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === e.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = t(e.target), this._drag.stage.start = n, this._drag.stage.current = n, this._drag.pointer = this.pointer(e), t(i).on("mouseup.owl.core touchend.owl.core", t.proxy(this.onDragEnd, this)), t(i).one("mousemove.owl.core touchmove.owl.core", t.proxy(function (e) {
                var n = this.difference(this._drag.pointer, this.pointer(e));
                t(i).on("mousemove.owl.core touchmove.owl.core", t.proxy(this.onDragMove, this)), Math.abs(n.x) < Math.abs(n.y) && this.is("valid") || (e.preventDefault(), this.enter("dragging"), this.trigger("drag"))
            }, this)))
        }, s.prototype.onDragMove = function (t) {
            var e = null,
                i = null,
                n = null,
                s = this.difference(this._drag.pointer, this.pointer(t)),
                o = this.difference(this._drag.stage.start, s);
            this.is("dragging") && (t.preventDefault(), this.settings.loop ? (e = this.coordinates(this.minimum()), i = this.coordinates(this.maximum() + 1) - e, o.x = ((o.x - e) % i + i) % i + e) : (e = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), i = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), n = this.settings.pullDrag ? -1 * s.x / 5 : 0, o.x = Math.max(Math.min(o.x, e + n), i + n)), this._drag.stage.current = o, this.animate(o.x))
        }, s.prototype.onDragEnd = function (e) {
            var n = this.difference(this._drag.pointer, this.pointer(e)),
                s = this._drag.stage.current,
                o = n.x > 0 ^ this.settings.rtl ? "left" : "right";
            t(i).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== n.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(s.x, 0 !== n.x ? o : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = o, (Math.abs(n.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function () {
                return !1
            })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
        }, s.prototype.closest = function (e, i) {
            var s = -1,
                o = 30,
                a = this.width(),
                r = this.coordinates();
            return this.settings.freeDrag || t.each(r, t.proxy(function (t, l) {
                return "left" === i && e > l - o && e < l + o ? s = t : "right" === i && e > l - a - o && e < l - a + o ? s = t + 1 : this.op(e, "<", l) && this.op(e, ">", r[t + 1] !== n ? r[t + 1] : l - a) && (s = "left" === i ? t + 1 : t), -1 === s
            }, this)), this.settings.loop || (this.op(e, ">", r[this.minimum()]) ? s = e = this.minimum() : this.op(e, "<", r[this.maximum()]) && (s = e = this.maximum())), s
        }, s.prototype.animate = function (e) {
            var i = this.speed() > 0;
            this.is("animating") && this.onTransitionEnd(), i && (this.enter("animating"), this.trigger("translate")), t.support.transform3d && t.support.transition ? this.$stage.css({
                transform: "translate3d(" + e + "px,0px,0px)",
                transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")
            }) : i ? this.$stage.animate({
                left: e + "px"
            }, this.speed(), this.settings.fallbackEasing, t.proxy(this.onTransitionEnd, this)) : this.$stage.css({
                left: e + "px"
            })
        }, s.prototype.is = function (t) {
            return this._states.current[t] && this._states.current[t] > 0
        }, s.prototype.current = function (t) {
            if (t === n) return this._current;
            if (0 === this._items.length) return n;
            if (t = this.normalize(t), this._current !== t) {
                var e = this.trigger("change", {
                    property: {
                        name: "position",
                        value: t
                    }
                });
                e.data !== n && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {
                    property: {
                        name: "position",
                        value: this._current
                    }
                })
            }
            return this._current
        }, s.prototype.invalidate = function (e) {
            return "string" === t.type(e) && (this._invalidated[e] = !0, this.is("valid") && this.leave("valid")), t.map(this._invalidated, function (t, e) {
                return e
            })
        }, s.prototype.reset = function (t) {
            (t = this.normalize(t)) !== n && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]))
        }, s.prototype.normalize = function (t, e) {
            var i = this._items.length,
                s = e ? 0 : this._clones.length;
            return !this.isNumeric(t) || i < 1 ? t = n : (t < 0 || t >= i + s) && (t = ((t - s / 2) % i + i) % i + s / 2), t
        }, s.prototype.relative = function (t) {
            return t -= this._clones.length / 2, this.normalize(t, !0)
        }, s.prototype.maximum = function (t) {
            var e, i, n, s = this.settings,
                o = this._coordinates.length;
            if (s.loop) o = this._clones.length / 2 + this._items.length - 1;
            else if (s.autoWidth || s.merge) {
                if (e = this._items.length)
                    for (i = this._items[--e].width(), n = this.$element.width(); e-- && !((i += this._items[e].width() + this.settings.margin) > n););
                o = e + 1
            } else o = s.center ? this._items.length - 1 : this._items.length - s.items;
            return t && (o -= this._clones.length / 2), Math.max(o, 0)
        }, s.prototype.minimum = function (t) {
            return t ? 0 : this._clones.length / 2
        }, s.prototype.items = function (t) {
            return t === n ? this._items.slice() : (t = this.normalize(t, !0), this._items[t])
        }, s.prototype.mergers = function (t) {
            return t === n ? this._mergers.slice() : (t = this.normalize(t, !0), this._mergers[t])
        }, s.prototype.clones = function (e) {
            var i = this._clones.length / 2,
                s = i + this._items.length,
                o = function (t) {
                    return t % 2 == 0 ? s + t / 2 : i - (t + 1) / 2
                };
            return e === n ? t.map(this._clones, function (t, e) {
                return o(e)
            }) : t.map(this._clones, function (t, i) {
                return t === e ? o(i) : null
            })
        }, s.prototype.speed = function (t) {
            return t !== n && (this._speed = t), this._speed
        }, s.prototype.coordinates = function (e) {
            var i, s = 1,
                o = e - 1;
            return e === n ? t.map(this._coordinates, t.proxy(function (t, e) {
                return this.coordinates(e)
            }, this)) : (this.settings.center ? (this.settings.rtl && (s = -1, o = e + 1), i = this._coordinates[e], i += (this.width() - i + (this._coordinates[o] || 0)) / 2 * s) : i = this._coordinates[o] || 0, i = Math.ceil(i))
        }, s.prototype.duration = function (t, e, i) {
            return 0 === i ? 0 : Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed)
        }, s.prototype.to = function (t, e) {
            var i = this.current(),
                n = null,
                s = t - this.relative(i),
                o = (s > 0) - (s < 0),
                a = this._items.length,
                r = this.minimum(),
                l = this.maximum();
            this.settings.loop ? (!this.settings.rewind && Math.abs(s) > a / 2 && (s += -1 * o * a), t = i + s, (n = ((t - r) % a + a) % a + r) !== t && n - s <= l && n - s > 0 && (i = n - s, t = n, this.reset(i))) : this.settings.rewind ? (l += 1, t = (t % l + l) % l) : t = Math.max(r, Math.min(l, t)), this.speed(this.duration(i, t, e)), this.current(t), this.isVisible() && this.update()
        }, s.prototype.next = function (t) {
            t = t || !1, this.to(this.relative(this.current()) + 1, t)
        }, s.prototype.prev = function (t) {
            t = t || !1, this.to(this.relative(this.current()) - 1, t)
        }, s.prototype.onTransitionEnd = function (t) {
            if (t !== n && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))) return !1;
            this.leave("animating"), this.trigger("translated")
        }, s.prototype.viewport = function () {
            var n;
            return this.options.responsiveBaseElement !== e ? n = t(this.options.responsiveBaseElement).width() : e.innerWidth ? n = e.innerWidth : i.documentElement && i.documentElement.clientWidth ? n = i.documentElement.clientWidth : console.warn("Can not detect viewport width."), n
        }, s.prototype.replace = function (e) {
            this.$stage.empty(), this._items = [], e && (e = e instanceof jQuery ? e : t(e)), this.settings.nestedItemSelector && (e = e.find("." + this.settings.nestedItemSelector)), e.filter(function () {
                return 1 === this.nodeType
            }).each(t.proxy(function (t, e) {
                e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
            }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
        }, s.prototype.add = function (e, i) {
            var s = this.relative(this._current);
            i = i === n ? this._items.length : this.normalize(i, !0), e = e instanceof jQuery ? e : t(e), this.trigger("add", {
                content: e,
                position: i
            }), e = this.prepare(e), 0 === this._items.length || i === this._items.length ? (0 === this._items.length && this.$stage.append(e), 0 !== this._items.length && this._items[i - 1].after(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[i].before(e), this._items.splice(i, 0, e), this._mergers.splice(i, 0, 1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[s] && this.reset(this._items[s].index()), this.invalidate("items"), this.trigger("added", {
                content: e,
                position: i
            })
        }, s.prototype.remove = function (t) {
            (t = this.normalize(t, !0)) !== n && (this.trigger("remove", {
                content: this._items[t],
                position: t
            }), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {
                content: null,
                position: t
            }))
        }, s.prototype.preloadAutoWidthImages = function (e) {
            e.each(t.proxy(function (e, i) {
                this.enter("pre-loading"), i = t(i), t(new Image).one("load", t.proxy(function (t) {
                    i.attr("src", t.target.src), i.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
                }, this)).attr("src", i.attr("src") || i.attr("data-src") || i.attr("data-src-retina"))
            }, this))
        }, s.prototype.destroy = function () {
            this.$element.off(".owl.core"), this.$stage.off(".owl.core"), t(i).off(".owl.core"), !1 !== this.settings.responsive && (e.clearTimeout(this.resizeTimer), this.off(e, "resize", this._handlers.onThrottledResize));
            for (var n in this._plugins) this._plugins[n].destroy();
            this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
        }, s.prototype.op = function (t, e, i) {
            var n = this.settings.rtl;
            switch (e) {
                case "<":
                    return n ? t > i : t < i;
                case ">":
                    return n ? t < i : t > i;
                case ">=":
                    return n ? t <= i : t >= i;
                case "<=":
                    return n ? t >= i : t <= i
            }
        }, s.prototype.on = function (t, e, i, n) {
            t.addEventListener ? t.addEventListener(e, i, n) : t.attachEvent && t.attachEvent("on" + e, i)
        }, s.prototype.off = function (t, e, i, n) {
            t.removeEventListener ? t.removeEventListener(e, i, n) : t.detachEvent && t.detachEvent("on" + e, i)
        }, s.prototype.trigger = function (e, i, n, o, a) {
            var r = {
                item: {
                    count: this._items.length,
                    index: this.current()
                }
            },
                l = t.camelCase(t.grep(["on", e, n], function (t) {
                    return t
                }).join("-").toLowerCase()),
                c = t.Event([e, "owl", n || "carousel"].join(".").toLowerCase(), t.extend({
                    relatedTarget: this
                }, r, i));
            return this._supress[e] || (t.each(this._plugins, function (t, e) {
                e.onTrigger && e.onTrigger(c)
            }), this.register({
                type: s.Type.Event,
                name: e
            }), this.$element.trigger(c), this.settings && "function" == typeof this.settings[l] && this.settings[l].call(this, c)), c
        }, s.prototype.enter = function (e) {
            t.each([e].concat(this._states.tags[e] || []), t.proxy(function (t, e) {
                this._states.current[e] === n && (this._states.current[e] = 0), this._states.current[e]++
            }, this))
        }, s.prototype.leave = function (e) {
            t.each([e].concat(this._states.tags[e] || []), t.proxy(function (t, e) {
                this._states.current[e]--
            }, this))
        }, s.prototype.register = function (e) {
            if (e.type === s.Type.Event) {
                if (t.event.special[e.name] || (t.event.special[e.name] = {}), !t.event.special[e.name].owl) {
                    var i = t.event.special[e.name]._default;
                    t.event.special[e.name]._default = function (t) {
                        return !i || !i.apply || t.namespace && -1 !== t.namespace.indexOf("owl") ? t.namespace && t.namespace.indexOf("owl") > -1 : i.apply(this, arguments)
                    }, t.event.special[e.name].owl = !0
                }
            } else e.type === s.Type.State && (this._states.tags[e.name] ? this._states.tags[e.name] = this._states.tags[e.name].concat(e.tags) : this._states.tags[e.name] = e.tags, this._states.tags[e.name] = t.grep(this._states.tags[e.name], t.proxy(function (i, n) {
                return t.inArray(i, this._states.tags[e.name]) === n
            }, this)))
        }, s.prototype.suppress = function (e) {
            t.each(e, t.proxy(function (t, e) {
                this._supress[e] = !0
            }, this))
        }, s.prototype.release = function (e) {
            t.each(e, t.proxy(function (t, e) {
                delete this._supress[e]
            }, this))
        }, s.prototype.pointer = function (t) {
            var i = {
                x: null,
                y: null
            };
            return t = t.originalEvent || t || e.event, t = t.touches && t.touches.length ? t.touches[0] : t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, t.pageX ? (i.x = t.pageX, i.y = t.pageY) : (i.x = t.clientX, i.y = t.clientY), i
        }, s.prototype.isNumeric = function (t) {
            return !isNaN(parseFloat(t))
        }, s.prototype.difference = function (t, e) {
            return {
                x: t.x - e.x,
                y: t.y - e.y
            }
        }, t.fn.owlCarousel = function (e) {
            var i = Array.prototype.slice.call(arguments, 1);
            return this.each(function () {
                var n = t(this),
                    o = n.data("owl.carousel");
                o || (o = new s(this, "object" == typeof e && e), n.data("owl.carousel", o), t.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (e, i) {
                    o.register({
                        type: s.Type.Event,
                        name: i
                    }), o.$element.on(i + ".owl.carousel.core", t.proxy(function (t) {
                        t.namespace && t.relatedTarget !== this && (this.suppress([i]), o[i].apply(this, [].slice.call(arguments, 1)), this.release([i]))
                    }, o))
                })), "string" == typeof e && "_" !== e.charAt(0) && o[e].apply(o, i)
            })
        }, t.fn.owlCarousel.Constructor = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        var s = function (e) {
            this._core = e, this._interval = null, this._visible = null, this._handlers = {
                "initialized.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.settings.autoRefresh && this.watch()
                }, this)
            }, this._core.options = t.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers)
        };
        s.Defaults = {
            autoRefresh: !0,
            autoRefreshInterval: 500
        }, s.prototype.watch = function () {
            this._interval || (this._visible = this._core.isVisible(), this._interval = e.setInterval(t.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
        }, s.prototype.refresh = function () {
            this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
        }, s.prototype.destroy = function () {
            var t, i;
            e.clearInterval(this._interval);
            for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
            for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
        }, t.fn.owlCarousel.Constructor.Plugins.AutoRefresh = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        var s = function (e) {
            this._core = e, this._loaded = [], this._handlers = {
                "initialized.owl.carousel change.owl.carousel resized.owl.carousel": t.proxy(function (e) {
                    if (e.namespace && this._core.settings && this._core.settings.lazyLoad && (e.property && "position" == e.property.name || "initialized" == e.type)) {
                        var i = this._core.settings,
                            s = i.center && Math.ceil(i.items / 2) || i.items,
                            o = i.center && -1 * s || 0,
                            a = (e.property && e.property.value !== n ? e.property.value : this._core.current()) + o,
                            r = this._core.clones().length,
                            l = t.proxy(function (t, e) {
                                this.load(e)
                            }, this);
                        for (i.lazyLoadEager > 0 && (s += i.lazyLoadEager, i.loop && (a -= i.lazyLoadEager, s++)); o++ < s;) this.load(r / 2 + this._core.relative(a)), r && t.each(this._core.clones(this._core.relative(a)), l), a++
                    }
                }, this)
            }, this._core.options = t.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers)
        };
        s.Defaults = {
            lazyLoad: !1,
            lazyLoadEager: 0
        }, s.prototype.load = function (i) {
            var n = this._core.$stage.children().eq(i),
                s = n && n.find(".owl-lazy");
            !s || t.inArray(n.get(0), this._loaded) > -1 || (s.each(t.proxy(function (i, n) {
                var s, o = t(n),
                    a = e.devicePixelRatio > 1 && o.attr("data-src-retina") || o.attr("data-src") || o.attr("data-srcset");
                this._core.trigger("load", {
                    element: o,
                    url: a
                }, "lazy"), o.is("img") ? o.one("load.owl.lazy", t.proxy(function () {
                    o.css("opacity", 1), this._core.trigger("loaded", {
                        element: o,
                        url: a
                    }, "lazy")
                }, this)).attr("src", a) : o.is("source") ? o.one("load.owl.lazy", t.proxy(function () {
                    this._core.trigger("loaded", {
                        element: o,
                        url: a
                    }, "lazy")
                }, this)).attr("srcset", a) : (s = new Image, s.onload = t.proxy(function () {
                    o.css({
                        "background-image": 'url("' + a + '")',
                        opacity: "1"
                    }), this._core.trigger("loaded", {
                        element: o,
                        url: a
                    }, "lazy")
                }, this), s.src = a)
            }, this)), this._loaded.push(n.get(0)))
        }, s.prototype.destroy = function () {
            var t, e;
            for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
            for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
        }, t.fn.owlCarousel.Constructor.Plugins.Lazy = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        var s = function (i) {
            this._core = i, this._previousHeight = null, this._handlers = {
                "initialized.owl.carousel refreshed.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.settings.autoHeight && this.update()
                }, this),
                "changed.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.settings.autoHeight && "position" === t.property.name && this.update()
                }, this),
                "loaded.owl.lazy": t.proxy(function (t) {
                    t.namespace && this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
                }, this)
            }, this._core.options = t.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null;
            var n = this;
            t(e).on("load", function () {
                n._core.settings.autoHeight && n.update()
            }), t(e).resize(function () {
                n._core.settings.autoHeight && (null != n._intervalId && clearTimeout(n._intervalId), n._intervalId = setTimeout(function () {
                    n.update()
                }, 250))
            })
        };
        s.Defaults = {
            autoHeight: !1,
            autoHeightClass: "owl-height"
        }, s.prototype.update = function () {
            var e = this._core._current,
                i = e + this._core.settings.items,
                n = this._core.settings.lazyLoad,
                s = this._core.$stage.children().toArray().slice(e, i),
                o = [],
                a = 0;
            t.each(s, function (e, i) {
                o.push(t(i).height())
            }), a = Math.max.apply(null, o), a <= 1 && n && this._previousHeight && (a = this._previousHeight), this._previousHeight = a, this._core.$stage.parent().height(a).addClass(this._core.settings.autoHeightClass)
        }, s.prototype.destroy = function () {
            var t, e;
            for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
            for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
        }, t.fn.owlCarousel.Constructor.Plugins.AutoHeight = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        var s = function (e) {
            this._core = e, this._videos = {}, this._playing = null, this._handlers = {
                "initialized.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.register({
                        type: "state",
                        name: "playing",
                        tags: ["interacting"]
                    })
                }, this),
                "resize.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.settings.video && this.isInFullScreen() && t.preventDefault()
                }, this),
                "refreshed.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
                }, this),
                "changed.owl.carousel": t.proxy(function (t) {
                    t.namespace && "position" === t.property.name && this._playing && this.stop()
                }, this),
                "prepared.owl.carousel": t.proxy(function (e) {
                    if (e.namespace) {
                        var i = t(e.content).find(".owl-video");
                        i.length && (i.css("display", "none"), this.fetch(i, t(e.content)))
                    }
                }, this)
            }, this._core.options = t.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", t.proxy(function (t) {
                this.play(t)
            }, this))
        };
        s.Defaults = {
            video: !1,
            videoHeight: !1,
            videoWidth: !1
        }, s.prototype.fetch = function (t, e) {
            var i = function () {
                return t.attr("data-vimeo-id") ? "vimeo" : t.attr("data-vzaar-id") ? "vzaar" : "youtube"
            }(),
                n = t.attr("data-vimeo-id") || t.attr("data-youtube-id") || t.attr("data-vzaar-id"),
                s = t.attr("data-width") || this._core.settings.videoWidth,
                o = t.attr("data-height") || this._core.settings.videoHeight,
                a = t.attr("href");
            if (!a) throw new Error("Missing video URL.");
            if (n = a.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), n[3].indexOf("youtu") > -1) i = "youtube";
            else if (n[3].indexOf("vimeo") > -1) i = "vimeo";
            else {
                if (!(n[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
                i = "vzaar"
            }
            n = n[6], this._videos[a] = {
                type: i,
                id: n,
                width: s,
                height: o
            }, e.attr("data-video", a), this.thumbnail(t, this._videos[a])
        }, s.prototype.thumbnail = function (e, i) {
            var n, s, o, a = i.width && i.height ? "width:" + i.width + "px;height:" + i.height + "px;" : "",
                r = e.find("img"),
                l = "src",
                c = "",
                d = this._core.settings,
                u = function (i) {
                    s = '<div class="owl-video-play-icon"></div>', n = d.lazyLoad ? t("<div/>", {
                        class: "owl-video-tn " + c,
                        srcType: i
                    }) : t("<div/>", {
                        class: "owl-video-tn",
                        style: "opacity:1;background-image:url(" + i + ")"
                    }), e.after(n), e.after(s)
                };
            if (e.wrap(t("<div/>", {
                class: "owl-video-wrapper",
                style: a
            })), this._core.settings.lazyLoad && (l = "data-src", c = "owl-lazy"), r.length) return u(r.attr(l)), r.remove(), !1;
            "youtube" === i.type ? (o = "//img.youtube.com/vi/" + i.id + "/hqdefault.jpg", u(o)) : "vimeo" === i.type ? t.ajax({
                type: "GET",
                url: "//vimeo.com/api/v2/video/" + i.id + ".json",
                jsonp: "callback",
                dataType: "jsonp",
                success: function (t) {
                    o = t[0].thumbnail_large, u(o)
                }
            }) : "vzaar" === i.type && t.ajax({
                type: "GET",
                url: "//vzaar.com/api/videos/" + i.id + ".json",
                jsonp: "callback",
                dataType: "jsonp",
                success: function (t) {
                    o = t.framegrab_url, u(o)
                }
            })
        }, s.prototype.stop = function () {
            this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
        }, s.prototype.play = function (e) {
            var i, n = t(e.target),
                s = n.closest("." + this._core.settings.itemClass),
                o = this._videos[s.attr("data-video")],
                a = o.width || "100%",
                r = o.height || this._core.$stage.height();
            this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), s = this._core.items(this._core.relative(s.index())), this._core.reset(s.index()), i = t('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'), i.attr("height", r), i.attr("width", a), "youtube" === o.type ? i.attr("src", "//www.youtube.com/embed/" + o.id + "?autoplay=1&rel=0&v=" + o.id) : "vimeo" === o.type ? i.attr("src", "//player.vimeo.com/video/" + o.id + "?autoplay=1") : "vzaar" === o.type && i.attr("src", "//view.vzaar.com/" + o.id + "/player?autoplay=true"), t(i).wrap('<div class="owl-video-frame" />').insertAfter(s.find(".owl-video")), this._playing = s.addClass("owl-video-playing"))
        }, s.prototype.isInFullScreen = function () {
            var e = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
            return e && t(e).parent().hasClass("owl-video-frame")
        }, s.prototype.destroy = function () {
            var t, e;
            this._core.$element.off("click.owl.video");
            for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
            for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
        }, t.fn.owlCarousel.Constructor.Plugins.Video = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        var s = function (e) {
            this.core = e, this.core.options = t.extend({}, s.Defaults, this.core.options), this.swapping = !0, this.previous = n, this.next = n, this.handlers = {
                "change.owl.carousel": t.proxy(function (t) {
                    t.namespace && "position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value)
                }, this),
                "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": t.proxy(function (t) {
                    t.namespace && (this.swapping = "translated" == t.type)
                }, this),
                "translate.owl.carousel": t.proxy(function (t) {
                    t.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
                }, this)
            }, this.core.$element.on(this.handlers)
        };
        s.Defaults = {
            animateOut: !1,
            animateIn: !1
        }, s.prototype.swap = function () {
            if (1 === this.core.settings.items && t.support.animation && t.support.transition) {
                this.core.speed(0);
                var e, i = t.proxy(this.clear, this),
                    n = this.core.$stage.children().eq(this.previous),
                    s = this.core.$stage.children().eq(this.next),
                    o = this.core.settings.animateIn,
                    a = this.core.settings.animateOut;
                this.core.current() !== this.previous && (a && (e = this.core.coordinates(this.previous) - this.core.coordinates(this.next), n.one(t.support.animation.end, i).css({
                    left: e + "px"
                }).addClass("animated owl-animated-out").addClass(a)), o && s.one(t.support.animation.end, i).addClass("animated owl-animated-in").addClass(o))
            }
        }, s.prototype.clear = function (e) {
            t(e.target).css({
                left: ""
            }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
        }, s.prototype.destroy = function () {
            var t, e;
            for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
            for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
        }, t.fn.owlCarousel.Constructor.Plugins.Animate = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        var s = function (e) {
            this._core = e, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = {
                "changed.owl.carousel": t.proxy(function (t) {
                    t.namespace && "settings" === t.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : t.namespace && "position" === t.property.name && this._paused && (this._time = 0)
                }, this),
                "initialized.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.settings.autoplay && this.play()
                }, this),
                "play.owl.autoplay": t.proxy(function (t, e, i) {
                    t.namespace && this.play(e, i)
                }, this),
                "stop.owl.autoplay": t.proxy(function (t) {
                    t.namespace && this.stop()
                }, this),
                "mouseover.owl.autoplay": t.proxy(function () {
                    this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
                }, this),
                "mouseleave.owl.autoplay": t.proxy(function () {
                    this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
                }, this),
                "touchstart.owl.core": t.proxy(function () {
                    this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
                }, this),
                "touchend.owl.core": t.proxy(function () {
                    this._core.settings.autoplayHoverPause && this.play()
                }, this)
            }, this._core.$element.on(this._handlers), this._core.options = t.extend({}, s.Defaults, this._core.options)
        };
        s.Defaults = {
            autoplay: !1,
            autoplayTimeout: 5e3,
            autoplayHoverPause: !1,
            autoplaySpeed: !1
        }, s.prototype._next = function (n) {
            this._call = e.setTimeout(t.proxy(this._next, this, n), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || i.hidden || this._core.next(n || this._core.settings.autoplaySpeed)
        }, s.prototype.read = function () {
            return (new Date).getTime() - this._time
        }, s.prototype.play = function (i, n) {
            var s;
            this._core.is("rotating") || this._core.enter("rotating"), i = i || this._core.settings.autoplayTimeout, s = Math.min(this._time % (this._timeout || i), i), this._paused ? (this._time = this.read(), this._paused = !1) : e.clearTimeout(this._call), this._time += this.read() % i - s, this._timeout = i, this._call = e.setTimeout(t.proxy(this._next, this, n), i - s)
        }, s.prototype.stop = function () {
            this._core.is("rotating") && (this._time = 0, this._paused = !0, e.clearTimeout(this._call), this._core.leave("rotating"))
        }, s.prototype.pause = function () {
            this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, e.clearTimeout(this._call))
        }, s.prototype.destroy = function () {
            var t, e;
            this.stop();
            for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
            for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
        }, t.fn.owlCarousel.Constructor.Plugins.autoplay = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        "use strict";
        var s = function (e) {
            this._core = e, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
                next: this._core.next,
                prev: this._core.prev,
                to: this._core.to
            }, this._handlers = {
                "prepared.owl.carousel": t.proxy(function (e) {
                    e.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + t(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
                }, this),
                "added.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 0, this._templates.pop())
                }, this),
                "remove.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 1)
                }, this),
                "changed.owl.carousel": t.proxy(function (t) {
                    t.namespace && "position" == t.property.name && this.draw()
                }, this),
                "initialized.owl.carousel": t.proxy(function (t) {
                    t.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
                }, this),
                "refreshed.owl.carousel": t.proxy(function (t) {
                    t.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
                }, this)
            }, this._core.options = t.extend({}, s.Defaults, this._core.options), this.$element.on(this._handlers)
        };
        s.Defaults = {
            nav: !1,
            navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'],
            navSpeed: !1,
            navElement: 'button type="button" role="presentation"',
            navContainer: !1,
            navContainerClass: "owl-nav",
            navClass: ["owl-prev", "owl-next"],
            slideBy: 1,
            dotClass: "owl-dot",
            dotsClass: "owl-dots",
            dots: !0,
            dotsEach: !1,
            dotsData: !1,
            dotsSpeed: !1,
            dotsContainer: !1
        }, s.prototype.initialize = function () {
            var e, i = this._core.settings;
            this._controls.$relative = (i.navContainer ? t(i.navContainer) : t("<div>").addClass(i.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = t("<" + i.navElement + ">").addClass(i.navClass[0]).html(i.navText[0]).prependTo(this._controls.$relative).on("click", t.proxy(function (t) {
                this.prev(i.navSpeed)
            }, this)), this._controls.$next = t("<" + i.navElement + ">").addClass(i.navClass[1]).html(i.navText[1]).appendTo(this._controls.$relative).on("click", t.proxy(function (t) {
                this.next(i.navSpeed)
            }, this)), i.dotsData || (this._templates = [t('<button role="button">').addClass(i.dotClass).append(t("<span>")).prop("outerHTML")]), this._controls.$absolute = (i.dotsContainer ? t(i.dotsContainer) : t("<div>").addClass(i.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", t.proxy(function (e) {
                var n = t(e.target).parent().is(this._controls.$absolute) ? t(e.target).index() : t(e.target).parent().index();
                e.preventDefault(), this.to(n, i.dotsSpeed)
            }, this));
            for (e in this._overrides) this._core[e] = t.proxy(this[e], this)
        }, s.prototype.destroy = function () {
            var t, e, i, n, s;
            s = this._core.settings;
            for (t in this._handlers) this.$element.off(t, this._handlers[t]);
            for (e in this._controls) "$relative" === e && s.navContainer ? this._controls[e].html("") : this._controls[e].remove();
            for (n in this.overides) this._core[n] = this._overrides[n];
            for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
        }, s.prototype.update = function () {
            var t, e, i, n = this._core.clones().length / 2,
                s = n + this._core.items().length,
                o = this._core.maximum(!0),
                a = this._core.settings,
                r = a.center || a.autoWidth || a.dotsData ? 1 : a.dotsEach || a.items;
            if ("page" !== a.slideBy && (a.slideBy = Math.min(a.slideBy, a.items)), a.dots || "page" == a.slideBy)
                for (this._pages = [], t = n, e = 0, i = 0; t < s; t++) {
                    if (e >= r || 0 === e) {
                        if (this._pages.push({
                            start: Math.min(o, t - n),
                            end: t - n + r - 1
                        }), Math.min(o, t - n) === o) break;
                        e = 0, ++i
                    }
                    e += this._core.mergers(this._core.relative(t))
                }
        }, s.prototype.draw = function () {
            var e, i = this._core.settings,
                n = this._core.items().length <= i.items,
                s = this._core.relative(this._core.current()),
                o = i.loop || i.rewind;
            this._controls.$relative.toggleClass("disabled", !i.nav || n), i.nav && (this._controls.$previous.toggleClass("disabled", !o && s <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !o && s >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !i.dots || n), i.dots && (e = this._pages.length - this._controls.$absolute.children().length, i.dotsData && 0 !== e ? this._controls.$absolute.html(this._templates.join("")) : e > 0 ? this._controls.$absolute.append(new Array(e + 1).join(this._templates[0])) : e < 0 && this._controls.$absolute.children().slice(e).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(t.inArray(this.current(), this._pages)).addClass("active"))
        }, s.prototype.onTrigger = function (e) {
            var i = this._core.settings;
            e.page = {
                index: t.inArray(this.current(), this._pages),
                count: this._pages.length,
                size: i && (i.center || i.autoWidth || i.dotsData ? 1 : i.dotsEach || i.items)
            }
        }, s.prototype.current = function () {
            var e = this._core.relative(this._core.current());
            return t.grep(this._pages, t.proxy(function (t, i) {
                return t.start <= e && t.end >= e
            }, this)).pop()
        }, s.prototype.getPosition = function (e) {
            var i, n, s = this._core.settings;
            return "page" == s.slideBy ? (i = t.inArray(this.current(), this._pages), n = this._pages.length, e ? ++i : --i, i = this._pages[(i % n + n) % n].start) : (i = this._core.relative(this._core.current()), n = this._core.items().length, e ? i += s.slideBy : i -= s.slideBy), i
        }, s.prototype.next = function (e) {
            t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e)
        }, s.prototype.prev = function (e) {
            t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e)
        }, s.prototype.to = function (e, i, n) {
            var s;
            !n && this._pages.length ? (s = this._pages.length, t.proxy(this._overrides.to, this._core)(this._pages[(e % s + s) % s].start, i)) : t.proxy(this._overrides.to, this._core)(e, i)
        }, t.fn.owlCarousel.Constructor.Plugins.Navigation = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        "use strict";
        var s = function (i) {
            this._core = i, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
                "initialized.owl.carousel": t.proxy(function (i) {
                    i.namespace && "URLHash" === this._core.settings.startPosition && t(e).trigger("hashchange.owl.navigation")
                }, this),
                "prepared.owl.carousel": t.proxy(function (e) {
                    if (e.namespace) {
                        var i = t(e.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                        if (!i) return;
                        this._hashes[i] = e.content
                    }
                }, this),
                "changed.owl.carousel": t.proxy(function (i) {
                    if (i.namespace && "position" === i.property.name) {
                        var n = this._core.items(this._core.relative(this._core.current())),
                            s = t.map(this._hashes, function (t, e) {
                                return t === n ? e : null
                            }).join();
                        if (!s || e.location.hash.slice(1) === s) return;
                        e.location.hash = s
                    }
                }, this)
            }, this._core.options = t.extend({}, s.Defaults, this._core.options), this.$element.on(this._handlers), t(e).on("hashchange.owl.navigation", t.proxy(function (t) {
                var i = e.location.hash.substring(1),
                    s = this._core.$stage.children(),
                    o = this._hashes[i] && s.index(this._hashes[i]);
                o !== n && o !== this._core.current() && this._core.to(this._core.relative(o), !1, !0)
            }, this))
        };
        s.Defaults = {
            URLhashListener: !1
        }, s.prototype.destroy = function () {
            var i, n;
            t(e).off("hashchange.owl.navigation");
            for (i in this._handlers) this._core.$element.off(i, this._handlers[i]);
            for (n in Object.getOwnPropertyNames(this)) "function" != typeof this[n] && (this[n] = null)
        }, t.fn.owlCarousel.Constructor.Plugins.Hash = s
    }(window.Zepto || window.jQuery, window, document),
    function (t, e, i, n) {
        function s(e, i) {
            var s = !1,
                o = e.charAt(0).toUpperCase() + e.slice(1);
            return t.each((e + " " + r.join(o + " ") + o).split(" "), function (t, e) {
                if (a[e] !== n) return s = !i || e, !1
            }), s
        }

        function o(t) {
            return s(t, !0)
        }

        var a = t("<support>").get(0).style,
            r = "Webkit Moz O ms".split(" "),
            l = {
                transition: {
                    end: {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "oTransitionEnd",
                        transition: "transitionend"
                    }
                },
                animation: {
                    end: {
                        WebkitAnimation: "webkitAnimationEnd",
                        MozAnimation: "animationend",
                        OAnimation: "oAnimationEnd",
                        animation: "animationend"
                    }
                }
            },
            c = {
                csstransforms: function () {
                    return !!s("transform")
                },
                csstransforms3d: function () {
                    return !!s("perspective")
                },
                csstransitions: function () {
                    return !!s("transition")
                },
                cssanimations: function () {
                    return !!s("animation")
                }
            };
        c.csstransitions() && (t.support.transition = new String(o("transition")), t.support.transition.end = l.transition.end[t.support.transition]), c.cssanimations() && (t.support.animation = new String(o("animation")), t.support.animation.end = l.animation.end[t.support.animation]), c.csstransforms() && (t.support.transform = new String(o("transform")), t.support.transform3d = c.csstransforms3d())
    }(window.Zepto || window.jQuery, window, document),
    function () {
        var t;
        t = function () {
            function t(t, e) {
                var i, n;
                if (this.options = {
                    target: "instafeed",
                    get: "popular",
                    resolution: "thumbnail",
                    sortBy: "none",
                    links: !0,
                    mock: !1,
                    useHttp: !1
                }, "object" == typeof t)
                    for (i in t) n = t[i], this.options[i] = n;
                this.context = null != e ? e : this, this.unique = this._genKey()
            }

            return t.prototype.hasNext = function () {
                return "string" == typeof this.context.nextUrl && this.context.nextUrl.length > 0
            }, t.prototype.next = function () {
                return !!this.hasNext() && this.run(this.context.nextUrl)
            }, t.prototype.run = function (e) {
                var i, n, s;
                if ("string" != typeof this.options.clientId && "string" != typeof this.options.accessToken) throw new Error("Missing clientId or accessToken.");
                if ("string" != typeof this.options.accessToken && "string" != typeof this.options.clientId) throw new Error("Missing clientId or accessToken.");
                return null != this.options.before && "function" == typeof this.options.before && this.options.before.call(this), "undefined" != typeof document && null !== document && (s = document.createElement("script"), s.id = "instafeed-fetcher", s.src = e || this._buildUrl(), i = document.getElementsByTagName("head"), i[0].appendChild(s), n = "instafeedCache" + this.unique, window[n] = new t(this.options, this), window[n].unique = this.unique), !0
            }, t.prototype.parse = function (t) {
                var e, i, n, s, o, a, r, l, c, d, u, h, p, f, m, g, v, _, y, b, w, x, C, k, S, T, I, D, E, A, P;
                if ("object" != typeof t) {
                    if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "Invalid JSON data"), !1;
                    throw new Error("Invalid JSON response")
                }
                if (200 !== t.meta.code) {
                    if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, t.meta.error_message), !1;
                    throw new Error("Error from Instagram: " + t.meta.error_message)
                }
                if (0 === t.data.length) {
                    if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "No images were returned from Instagram"), !1;
                    throw new Error("No images were returned from Instagram")
                }
                if (null != this.options.success && "function" == typeof this.options.success && this.options.success.call(this, t), this.context.nextUrl = "", null != t.pagination && (this.context.nextUrl = t.pagination.next_url), "none" !== this.options.sortBy) switch (E = "random" === this.options.sortBy ? ["", "random"] : this.options.sortBy.split("-"), D = "least" === E[0], E[1]) {
                    case "random":
                        t.data.sort(function () {
                            return .5 - Math.random()
                        });
                        break;
                    case "recent":
                        t.data = this._sortBy(t.data, "created_time", D);
                        break;
                    case "liked":
                        t.data = this._sortBy(t.data, "likes.count", D);
                        break;
                    case "commented":
                        t.data = this._sortBy(t.data, "comments.count", D);
                        break;
                    default:
                        throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
                }
                if ("undefined" != typeof document && null !== document && !1 === this.options.mock) {
                    if (m = t.data, I = parseInt(this.options.limit, 10), null != this.options.limit && m.length > I && (m = m.slice(0, I)), a = document.createDocumentFragment(), null != this.options.filter && "function" == typeof this.options.filter && (m = this._filter(m, this.options.filter)), null != this.options.template && "string" == typeof this.options.template) {
                        for (l = "", p = "", "", P = document.createElement("div"), d = 0, C = m.length; d < C; d++) {
                            if (u = m[d], "object" != typeof (h = u.images[this.options.resolution])) throw o = "No image found for resolution: " + this.options.resolution + ".", new Error(o);
                            y = h.width, v = h.height, _ = "square", y > v && (_ = "landscape"), y < v && (_ = "portrait"), f = h.url, c = window.location.protocol.indexOf("http") >= 0, c && !this.options.useHttp && (f = f.replace(/https?:\/\//, "//")), p = this._makeTemplate(this.options.template, {
                                model: u,
                                id: u.id,
                                link: u.link,
                                type: u.type,
                                image: f,
                                width: y,
                                height: v,
                                orientation: _,
                                caption: this._getObjectProperty(u, "caption.text"),
                                likes: u.likes.count,
                                comments: u.comments.count,
                                location: this._getObjectProperty(u, "location.name")
                            }), l += p
                        }
                        for (P.innerHTML = l, s = [], n = 0, i = P.childNodes.length; n < i;) s.push(P.childNodes[n]), n += 1;
                        for (w = 0, k = s.length; w < k; w++) T = s[w], a.appendChild(T)
                    } else
                        for (x = 0, S = m.length; x < S; x++) {
                            if (u = m[x], g = document.createElement("img"), h = u.images[this.options.resolution], "object" != typeof h) throw o = "No image found for resolution: " + this.options.resolution + ".", new Error(o);
                            f = h.url, c = window.location.protocol.indexOf("http") >= 0, c && !this.options.useHttp && (f = f.replace(/https?:\/\//, "//")), g.src = f, !0 === this.options.links ? (e = document.createElement("a"), e.href = u.link, e.appendChild(g), a.appendChild(e)) : a.appendChild(g)
                        }
                    if ("string" == typeof (A = this.options.target) && (A = document.getElementById(A)), null == A) throw o = 'No element with id="' + this.options.target + '" on page.', new Error(o);
                    A.appendChild(a), r = document.getElementsByTagName("head")[0], r.removeChild(document.getElementById("instafeed-fetcher")), b = "instafeedCache" + this.unique, window[b] = void 0;
                    try {
                        delete window[b]
                    } catch (t) {
                        t
                    }
                }
                return null != this.options.after && "function" == typeof this.options.after && this.options.after.call(this), !0
            }, t.prototype._buildUrl = function () {
                var t, e, i;
                switch (t = "https://api.instagram.com/v1", this.options.get) {
                    case "popular":
                        e = "media/popular";
                        break;
                    case "tagged":
                        if (!this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                        e = "tags/" + this.options.tagName + "/media/recent";
                        break;
                    case "location":
                        if (!this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                        e = "locations/" + this.options.locationId + "/media/recent";
                        break;
                    case "user":
                        if (!this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                        e = "users/" + this.options.userId + "/media/recent";
                        break;
                    default:
                        throw new Error("Invalid option for get: '" + this.options.get + "'.")
                }
                return i = t + "/" + e, null != this.options.accessToken ? i += "?access_token=" + this.options.accessToken : i += "?client_id=" + this.options.clientId, null != this.options.limit && (i += "&count=" + this.options.limit), i += "&callback=instafeedCache" + this.unique + ".parse"
            }, t.prototype._genKey = function () {
                var t;
                return "" + (t = function () {
                    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
                })() + t() + t() + t()
            }, t.prototype._makeTemplate = function (t, e) {
                var i, n, s, o, a;
                for (n = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, i = t; n.test(i);) o = i.match(n)[1], a = null != (s = this._getObjectProperty(e, o)) ? s : "", i = i.replace(n, function () {
                    return "" + a
                });
                return i
            }, t.prototype._getObjectProperty = function (t, e) {
                var i, n;
                for (e = e.replace(/\[(\w+)\]/g, ".$1"), n = e.split("."); n.length;) {
                    if (i = n.shift(), !(null != t && i in t)) return null;
                    t = t[i]
                }
                return t
            }, t.prototype._sortBy = function (t, e, i) {
                var n;
                return n = function (t, n) {
                    var s, o;
                    return s = this._getObjectProperty(t, e), o = this._getObjectProperty(n, e), i ? s > o ? 1 : -1 : s < o ? 1 : -1
                }, t.sort(n.bind(this)), t
            }, t.prototype._filter = function (t, e) {
                var i, n, s, o, a;
                for (i = [], n = function (t) {
                    if (e(t)) return i.push(t)
                }, s = 0, a = t.length; s < a; s++) o = t[s], n(o);
                return i
            }, t
        }(),
            function (t, e) {
                "function" == typeof define && define.amd ? define([], e) : "object" == typeof module && module.exports ? module.exports = e() : t.Instafeed = e()
            }(this, function () {
                return t
            })
    }.call(this),
    function (t, e) {
        "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = e() : t.PhotoSwipe = e()
    }(this, function () {
        "use strict";
        return function (t, e, i, n) {
            var s = {
                features: null,
                bind: function (t, e, i, n) {
                    var s = (n ? "remove" : "add") + "EventListener";
                    e = e.split(" ");
                    for (var o = 0; o < e.length; o++) e[o] && t[s](e[o], i, !1)
                },
                isArray: function (t) {
                    return t instanceof Array
                },
                createEl: function (t, e) {
                    var i = document.createElement(e || "div");
                    return t && (i.className = t), i
                },
                getScrollY: function () {
                    var t = window.pageYOffset;
                    return void 0 !== t ? t : document.documentElement.scrollTop
                },
                unbind: function (t, e, i) {
                    s.bind(t, e, i, !0)
                },
                removeClass: function (t, e) {
                    var i = new RegExp("(\\s|^)" + e + "(\\s|$)");
                    t.className = t.className.replace(i, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "")
                },
                addClass: function (t, e) {
                    s.hasClass(t, e) || (t.className += (t.className ? " " : "") + e)
                },
                hasClass: function (t, e) {
                    return t.className && new RegExp("(^|\\s)" + e + "(\\s|$)").test(t.className)
                },
                getChildByClass: function (t, e) {
                    for (var i = t.firstChild; i;) {
                        if (s.hasClass(i, e)) return i;
                        i = i.nextSibling
                    }
                },
                arraySearch: function (t, e, i) {
                    for (var n = t.length; n--;)
                        if (t[n][i] === e) return n;
                    return -1
                },
                extend: function (t, e, i) {
                    for (var n in e)
                        if (e.hasOwnProperty(n)) {
                            if (i && t.hasOwnProperty(n)) continue;
                            t[n] = e[n]
                        }
                },
                easing: {
                    sine: {
                        out: function (t) {
                            return Math.sin(t * (Math.PI / 2))
                        },
                        inOut: function (t) {
                            return -(Math.cos(Math.PI * t) - 1) / 2
                        }
                    },
                    cubic: {
                        out: function (t) {
                            return --t * t * t + 1
                        }
                    }
                },
                detectFeatures: function () {
                    if (s.features) return s.features;
                    var t = s.createEl(),
                        e = t.style,
                        i = "",
                        n = {};
                    if (n.oldIE = document.all && !document.addEventListener, n.touch = "ontouchstart" in window, window.requestAnimationFrame && (n.raf = window.requestAnimationFrame, n.caf = window.cancelAnimationFrame), n.pointerEvent = !!window.PointerEvent || navigator.msPointerEnabled, !n.pointerEvent) {
                        var o = navigator.userAgent;
                        if (/iP(hone|od)/.test(navigator.platform)) {
                            var a = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
                            a && a.length > 0 && (a = parseInt(a[1], 10)) >= 1 && a < 8 && (n.isOldIOSPhone = !0)
                        }
                        var r = o.match(/Android\s([0-9\.]*)/),
                            l = r ? r[1] : 0;
                        l = parseFloat(l), l >= 1 && (l < 4.4 && (n.isOldAndroid = !0), n.androidVersion = l), n.isMobileOpera = /opera mini|opera mobi/i.test(o)
                    }
                    for (var c, d, u = ["transform", "perspective", "animationName"], h = ["", "webkit", "Moz", "ms", "O"], p = 0; p < 4; p++) {
                        i = h[p];
                        for (var f = 0; f < 3; f++) c = u[f], d = i + (i ? c.charAt(0).toUpperCase() + c.slice(1) : c), !n[c] && d in e && (n[c] = d);
                        i && !n.raf && (i = i.toLowerCase(), n.raf = window[i + "RequestAnimationFrame"], n.raf && (n.caf = window[i + "CancelAnimationFrame"] || window[i + "CancelRequestAnimationFrame"]))
                    }
                    if (!n.raf) {
                        var m = 0;
                        n.raf = function (t) {
                            var e = (new Date).getTime(),
                                i = Math.max(0, 16 - (e - m)),
                                n = window.setTimeout(function () {
                                    t(e + i)
                                }, i);
                            return m = e + i, n
                        }, n.caf = function (t) {
                            clearTimeout(t)
                        }
                    }
                    return n.svg = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect, s.features = n, n
                }
            };
            s.detectFeatures(), s.features.oldIE && (s.bind = function (t, e, i, n) {
                e = e.split(" ");
                for (var s, o = (n ? "detach" : "attach") + "Event", a = function () {
                    i.handleEvent.call(i)
                }, r = 0; r < e.length; r++)
                    if (s = e[r])
                        if ("object" == typeof i && i.handleEvent) {
                            if (n) {
                                if (!i["oldIE" + s]) return !1
                            } else i["oldIE" + s] = a;
                            t[o]("on" + s, i["oldIE" + s])
                        } else t[o]("on" + s, i)
            });
            var o = this,
                a = 25,
                r = 3,
                l = {
                    allowPanToNext: !0,
                    spacing: .12,
                    bgOpacity: 1,
                    mouseUsed: !1,
                    loop: !0,
                    pinchToClose: !0,
                    closeOnScroll: !0,
                    closeOnVerticalDrag: !0,
                    verticalDragRange: .75,
                    hideAnimationDuration: 333,
                    showAnimationDuration: 333,
                    showHideOpacity: !1,
                    focus: !0,
                    escKey: !0,
                    arrowKeys: !0,
                    mainScrollEndFriction: .35,
                    panEndFriction: .35,
                    isClickableElement: function (t) {
                        return "A" === t.tagName
                    },
                    getDoubleTapZoom: function (t, e) {
                        return t ? 1 : e.initialZoomLevel < .7 ? 1 : 1.33
                    },
                    maxSpreadZoom: 1.33,
                    modal: !0,
                    scaleMode: "fit"
                };
            s.extend(l, n);
            var c, d, u, h, p, f, m, g, v, _, y, b, w, x, C, k, S, T, I, D, E, A, P, M, j, $, O, N, L, z, F, H, W, R, B,
                q,
                U, Y, K, V, Q, Z, G, X, J, tt, et, it, nt, st, ot, at, rt, lt, ct, dt, ut, ht = function () {
                    return {
                        x: 0,
                        y: 0
                    }
                },
                pt = ht(),
                ft = ht(),
                mt = ht(),
                gt = {},
                vt = 0,
                _t = {},
                yt = ht(),
                bt = 0,
                wt = !0,
                xt = [],
                Ct = {},
                kt = !1,
                St = function (t, e) {
                    s.extend(o, e.publicMethods), xt.push(t)
                },
                Tt = function (t) {
                    var e = ti();
                    return t > e - 1 ? t - e : t < 0 ? e + t : t
                },
                It = {},
                Dt = function (t, e) {
                    return It[t] || (It[t] = []), It[t].push(e)
                },
                Et = function (t) {
                    var e = It[t];
                    if (e) {
                        var i = Array.prototype.slice.call(arguments);
                        i.shift();
                        for (var n = 0; n < e.length; n++) e[n].apply(o, i)
                    }
                },
                At = function () {
                    return (new Date).getTime()
                },
                Pt = function (t) {
                    ct = t, o.bg.style.opacity = t * l.bgOpacity
                },
                Mt = function (t, e, i, n, s) {
                    (!kt || s && s !== o.currItem) && (n /= s ? s.fitRatio : o.currItem.fitRatio), t[A] = b + e + "px, " + i + "px" + w + " scale(" + n + ")"
                },
                jt = function (t) {
                    st && (t && (_ > o.currItem.fitRatio ? kt || (hi(o.currItem, !1, !0), kt = !0) : kt && (hi(o.currItem), kt = !1)), Mt(st, mt.x, mt.y, _))
                },
                $t = function (t) {
                    t.container && Mt(t.container.style, t.initialPosition.x, t.initialPosition.y, t.initialZoomLevel, t)
                },
                Ot = function (t, e) {
                    e[A] = b + t + "px, 0px" + w
                },
                Nt = function (t, e) {
                    if (!l.loop && e) {
                        var i = h + (yt.x * vt - t) / yt.x,
                            n = Math.round(t - ye.x);
                        (i < 0 && n > 0 || i >= ti() - 1 && n < 0) && (t = ye.x + n * l.mainScrollEndFriction)
                    }
                    ye.x = t, Ot(t, p)
                },
                Lt = function (t, e) {
                    var i = be[t] - _t[t];
                    return ft[t] + pt[t] + i - i * (e / y)
                },
                zt = function (t, e) {
                    t.x = e.x, t.y = e.y, e.id && (t.id = e.id)
                },
                Ft = function (t) {
                    t.x = Math.round(t.x), t.y = Math.round(t.y)
                },
                Ht = null,
                Wt = function () {
                    Ht && (s.unbind(document, "mousemove", Wt), s.addClass(t, "pswp--has_mouse"), l.mouseUsed = !0, Et("mouseUsed")), Ht = setTimeout(function () {
                        Ht = null
                    }, 100)
                },
                Rt = function () {
                    s.bind(document, "keydown", o), F.transform && s.bind(o.scrollWrap, "click", o), l.mouseUsed || s.bind(document, "mousemove", Wt), s.bind(window, "resize scroll orientationchange", o), Et("bindEvents")
                },
                Bt = function () {
                    s.unbind(window, "resize scroll orientationchange", o), s.unbind(window, "scroll", v.scroll), s.unbind(document, "keydown", o), s.unbind(document, "mousemove", Wt), F.transform && s.unbind(o.scrollWrap, "click", o), K && s.unbind(window, m, o), clearTimeout(H), Et("unbindEvents")
                },
                qt = function (t, e) {
                    var i = li(o.currItem, gt, t);
                    return e && (nt = i), i
                },
                Ut = function (t) {
                    return t || (t = o.currItem), t.initialZoomLevel
                },
                Yt = function (t) {
                    return t || (t = o.currItem), t.w > 0 ? l.maxSpreadZoom : 1
                },
                Kt = function (t, e, i, n) {
                    return n === o.currItem.initialZoomLevel ? (i[t] = o.currItem.initialPosition[t], !0) : (i[t] = Lt(t, n), i[t] > e.min[t] ? (i[t] = e.min[t], !0) : i[t] < e.max[t] && (i[t] = e.max[t], !0))
                },
                Vt = function () {
                    if (A) {
                        var e = F.perspective && !M;
                        return b = "translate" + (e ? "3d(" : "("), void (w = F.perspective ? ", 0px)" : ")")
                    }
                    A = "left", s.addClass(t, "pswp--ie"), Ot = function (t, e) {
                        e.left = t + "px"
                    }, $t = function (t) {
                        var e = t.fitRatio > 1 ? 1 : t.fitRatio,
                            i = t.container.style,
                            n = e * t.w,
                            s = e * t.h;
                        i.width = n + "px", i.height = s + "px", i.left = t.initialPosition.x + "px", i.top = t.initialPosition.y + "px"
                    }, jt = function () {
                        if (st) {
                            var t = st,
                                e = o.currItem,
                                i = e.fitRatio > 1 ? 1 : e.fitRatio,
                                n = i * e.w,
                                s = i * e.h;
                            t.width = n + "px", t.height = s + "px", t.left = mt.x + "px", t.top = mt.y + "px"
                        }
                    }
                },
                Qt = function (t) {
                    var e = "";
                    l.escKey && 27 === t.keyCode ? e = "close" : l.arrowKeys && (37 === t.keyCode ? e = "prev" : 39 === t.keyCode && (e = "next")), e && (t.ctrlKey || t.altKey || t.shiftKey || t.metaKey || (t.preventDefault ? t.preventDefault() : t.returnValue = !1, o[e]()))
                },
                Zt = function (t) {
                    t && (Z || Q || ot || U) && (t.preventDefault(), t.stopPropagation())
                },
                Gt = function () {
                    o.setScrollOffset(0, s.getScrollY())
                },
                Xt = {},
                Jt = 0,
                te = function (t) {
                    Xt[t] && (Xt[t].raf && $(Xt[t].raf), Jt--, delete Xt[t])
                },
                ee = function (t) {
                    Xt[t] && te(t), Xt[t] || (Jt++, Xt[t] = {})
                },
                ie = function () {
                    for (var t in Xt) Xt.hasOwnProperty(t) && te(t)
                },
                ne = function (t, e, i, n, s, o, a) {
                    var r, l = At();
                    ee(t);
                    var c = function () {
                        if (Xt[t]) {
                            if ((r = At() - l) >= n) return te(t), o(i), void (a && a());
                            o((i - e) * s(r / n) + e), Xt[t].raf = j(c)
                        }
                    };
                    c()
                },
                se = {
                    shout: Et,
                    listen: Dt,
                    viewportSize: gt,
                    options: l,
                    isMainScrollAnimating: function () {
                        return ot
                    },
                    getZoomLevel: function () {
                        return _
                    },
                    getCurrentIndex: function () {
                        return h
                    },
                    isDragging: function () {
                        return K
                    },
                    _zoomOning: function () {
                        return tt
                    },
                    setScrollOffset: function (t, e) {
                        _t.x = t, z = _t.y = e, Et("updateScrollOffset", _t)
                    },
                    applyZoomPan: function (t, e, i, n) {
                        mt.x = e, mt.y = i, _ = t, jt(n)
                    },
                    init: function () {
                        if (!c && !d) {
                            var i;
                            o.framework = s, o.template = t, o.bg = s.getChildByClass(t, "pswp__bg"), O = t.className, c = !0, F = s.detectFeatures(), j = F.raf, $ = F.caf, A = F.transform, L = F.oldIE, o.scrollWrap = s.getChildByClass(t, "pswp__scroll-wrap"), o.container = s.getChildByClass(o.scrollWrap, "pswp__container"), p = o.container.style, o.itemHolders = k = [{
                                el: o.container.children[0],
                                wrap: 0,
                                index: -1
                            }, {
                                el: o.container.children[1],
                                wrap: 0,
                                index: -1
                            }, {
                                el: o.container.children[2],
                                wrap: 0,
                                index: -1
                            }], k[0].el.style.display = k[2].el.style.display = "none", Vt(), v = {
                                resize: o.updateSize,
                                orientationchange: function () {
                                    clearTimeout(H), H = setTimeout(function () {
                                        gt.x !== o.scrollWrap.clientWidth && o.updateSize()
                                    }, 500)
                                },
                                scroll: Gt,
                                keydown: Qt,
                                click: Zt
                            };
                            var n = F.isOldIOSPhone || F.isOldAndroid || F.isMobileOpera;
                            for (F.animationName && F.transform && !n || (l.showAnimationDuration = l.hideAnimationDuration = 0), i = 0; i < xt.length; i++) o["init" + xt[i]]();
                            if (e) {
                                (o.ui = new e(o, s)).init()
                            }
                            Et("firstUpdate"), h = h || l.index || 0, (isNaN(h) || h < 0 || h >= ti()) && (h = 0), o.currItem = Je(h), (F.isOldIOSPhone || F.isOldAndroid) && (wt = !1), t.setAttribute("aria-hidden", "false"), l.modal && (wt ? t.style.position = "fixed" : (t.style.position = "absolute", t.style.top = s.getScrollY() + "px")), void 0 === z && (Et("initialLayout"), z = N = s.getScrollY());
                            var a = "pswp--open ";
                            for (l.mainClass && (a += l.mainClass + " "), l.showHideOpacity && (a += "pswp--animate_opacity "), a += M ? "pswp--touch" : "pswp--notouch", a += F.animationName ? " pswp--css_animation" : "", a += F.svg ? " pswp--svg" : "", s.addClass(t, a), o.updateSize(), f = -1, bt = null, i = 0; i < r; i++) Ot((i + f) * yt.x, k[i].el.style);
                            L || s.bind(o.scrollWrap, g, o), Dt("initialZoomInEnd", function () {
                                o.setContent(k[0], h - 1), o.setContent(k[2], h + 1), k[0].el.style.display = k[2].el.style.display = "block", l.focus && t.focus(), Rt()
                            }), o.setContent(k[1], h), o.updateCurrItem(), Et("afterInit"), wt || (x = setInterval(function () {
                                Jt || K || tt || _ !== o.currItem.initialZoomLevel || o.updateSize()
                            }, 1e3)), s.addClass(t, "pswp--visible")
                        }
                    },
                    close: function () {
                        c && (c = !1, d = !0, Et("close"), Bt(), ii(o.currItem, null, !0, o.destroy))
                    },
                    destroy: function () {
                        Et("destroy"), Qe && clearTimeout(Qe), t.setAttribute("aria-hidden", "true"), t.className = O, x && clearInterval(x), s.unbind(o.scrollWrap, g, o), s.unbind(window, "scroll", o), Se(), ie(), It = null
                    },
                    panTo: function (t, e, i) {
                        i || (t > nt.min.x ? t = nt.min.x : t < nt.max.x && (t = nt.max.x), e > nt.min.y ? e = nt.min.y : e < nt.max.y && (e = nt.max.y)), mt.x = t, mt.y = e, jt()
                    },
                    handleEvent: function (t) {
                        t = t || window.event, v[t.type] && v[t.type](t)
                    },
                    goTo: function (t) {
                        t = Tt(t);
                        var e = t - h;
                        bt = e, h = t, o.currItem = Je(h), vt -= e, Nt(yt.x * vt), ie(), ot = !1, o.updateCurrItem()
                    },
                    next: function () {
                        o.goTo(h + 1)
                    },
                    prev: function () {
                        o.goTo(h - 1)
                    },
                    updateCurrZoomItem: function (t) {
                        if (t && Et("beforeChange", 0), k[1].el.children.length) {
                            var e = k[1].el.children[0];
                            st = s.hasClass(e, "pswp__zoom-wrap") ? e.style : null
                        } else st = null;
                        nt = o.currItem.bounds, y = _ = o.currItem.initialZoomLevel, mt.x = nt.center.x, mt.y = nt.center.y, t && Et("afterChange")
                    },
                    invalidateCurrItems: function () {
                        C = !0;
                        for (var t = 0; t < r; t++) k[t].item && (k[t].item.needsUpdate = !0)
                    },
                    updateCurrItem: function (t) {
                        if (0 !== bt) {
                            var e, i = Math.abs(bt);
                            if (!(t && i < 2)) {
                                o.currItem = Je(h), kt = !1, Et("beforeChange", bt), i >= r && (f += bt + (bt > 0 ? -r : r), i = r);
                                for (var n = 0; n < i; n++) bt > 0 ? (e = k.shift(), k[r - 1] = e, f++, Ot((f + 2) * yt.x, e.el.style), o.setContent(e, h - i + n + 1 + 1)) : (e = k.pop(), k.unshift(e), f--, Ot(f * yt.x, e.el.style), o.setContent(e, h + i - n - 1 - 1));
                                if (st && 1 === Math.abs(bt)) {
                                    var s = Je(S);
                                    s.initialZoomLevel !== _ && (li(s, gt), hi(s), $t(s))
                                }
                                bt = 0, o.updateCurrZoomItem(), S = h, Et("afterChange")
                            }
                        }
                    },
                    updateSize: function (e) {
                        if (!wt && l.modal) {
                            var i = s.getScrollY();
                            if (z !== i && (t.style.top = i + "px", z = i), !e && Ct.x === window.innerWidth && Ct.y === window.innerHeight) return;
                            Ct.x = window.innerWidth, Ct.y = window.innerHeight, t.style.height = Ct.y + "px"
                        }
                        if (gt.x = o.scrollWrap.clientWidth, gt.y = o.scrollWrap.clientHeight, Gt(), yt.x = gt.x + Math.round(gt.x * l.spacing), yt.y = gt.y, Nt(yt.x * vt), Et("beforeResize"), void 0 !== f) {
                            for (var n, a, c, d = 0; d < r; d++) n = k[d], Ot((d + f) * yt.x, n.el.style), c = h + d - 1, l.loop && ti() > 2 && (c = Tt(c)), a = Je(c), a && (C || a.needsUpdate || !a.bounds) ? (o.cleanSlide(a), o.setContent(n, c), 1 === d && (o.currItem = a, o.updateCurrZoomItem(!0)), a.needsUpdate = !1) : -1 === n.index && c >= 0 && o.setContent(n, c), a && a.container && (li(a, gt), hi(a), $t(a));
                            C = !1
                        }
                        y = _ = o.currItem.initialZoomLevel, nt = o.currItem.bounds, nt && (mt.x = nt.center.x, mt.y = nt.center.y, jt(!0)), Et("resize")
                    },
                    zoomTo: function (t, e, i, n, o) {
                        e && (y = _, be.x = Math.abs(e.x) - mt.x, be.y = Math.abs(e.y) - mt.y, zt(ft, mt));
                        var a = qt(t, !1),
                            r = {};
                        Kt("x", a, r, t), Kt("y", a, r, t);
                        var l = _,
                            c = {
                                x: mt.x,
                                y: mt.y
                            };
                        Ft(r);
                        var d = function (e) {
                            1 === e ? (_ = t, mt.x = r.x, mt.y = r.y) : (_ = (t - l) * e + l, mt.x = (r.x - c.x) * e + c.x, mt.y = (r.y - c.y) * e + c.y), o && o(e), jt(1 === e)
                        };
                        i ? ne("customZoomTo", 0, 1, i, n || s.easing.sine.inOut, d) : d(1)
                    }
                },
                oe = 30,
                ae = 10,
                re = {},
                le = {},
                ce = {},
                de = {},
                ue = {},
                he = [],
                pe = {},
                fe = [],
                me = {},
                ge = 0,
                ve = ht(),
                _e = 0,
                ye = ht(),
                be = ht(),
                we = ht(),
                xe = function (t, e) {
                    return t.x === e.x && t.y === e.y
                },
                Ce = function (t, e) {
                    return Math.abs(t.x - e.x) < a && Math.abs(t.y - e.y) < a
                },
                ke = function (t, e) {
                    return me.x = Math.abs(t.x - e.x), me.y = Math.abs(t.y - e.y), Math.sqrt(me.x * me.x + me.y * me.y)
                },
                Se = function () {
                    G && ($(G), G = null)
                },
                Te = function () {
                    K && (G = j(Te), Re())
                },
                Ie = function () {
                    return !("fit" === l.scaleMode && _ === o.currItem.initialZoomLevel)
                },
                De = function (t, e) {
                    return !(!t || t === document) && !(t.getAttribute("class") && t.getAttribute("class").indexOf("pswp__scroll-wrap") > -1) && (e(t) ? t : De(t.parentNode, e))
                },
                Ee = {},
                Ae = function (t, e) {
                    return Ee.prevent = !De(t.target, l.isClickableElement), Et("preventDragEvent", t, e, Ee), Ee.prevent
                },
                Pe = function (t, e) {
                    return e.x = t.pageX, e.y = t.pageY, e.id = t.identifier, e
                },
                Me = function (t, e, i) {
                    i.x = .5 * (t.x + e.x), i.y = .5 * (t.y + e.y)
                },
                je = function (t, e, i) {
                    if (t - R > 50) {
                        var n = fe.length > 2 ? fe.shift() : {};
                        n.x = e, n.y = i, fe.push(n), R = t
                    }
                },
                $e = function () {
                    var t = mt.y - o.currItem.initialPosition.y;
                    return 1 - Math.abs(t / (gt.y / 2))
                },
                Oe = {},
                Ne = {},
                Le = [],
                ze = function (t) {
                    for (; Le.length > 0;) Le.pop();
                    return P ? (ut = 0, he.forEach(function (t) {
                        0 === ut ? Le[0] = t : 1 === ut && (Le[1] = t), ut++
                    })) : t.type.indexOf("touch") > -1 ? t.touches && t.touches.length > 0 && (Le[0] = Pe(t.touches[0], Oe), t.touches.length > 1 && (Le[1] = Pe(t.touches[1], Ne))) : (Oe.x = t.pageX, Oe.y = t.pageY, Oe.id = "", Le[0] = Oe), Le
                },
                Fe = function (t, e) {
                    var i, n, s, a, r = mt[t] + e[t],
                        c = e[t] > 0,
                        d = ye.x + e.x,
                        u = ye.x - pe.x;
                    return i = r > nt.min[t] || r < nt.max[t] ? l.panEndFriction : 1, r = mt[t] + e[t] * i, !l.allowPanToNext && _ !== o.currItem.initialZoomLevel || (st ? "h" !== at || "x" !== t || Q || (c ? (r > nt.min[t] && (i = l.panEndFriction, nt.min[t] - r, n = nt.min[t] - ft[t]), (n <= 0 || u < 0) && ti() > 1 ? (a = d, u < 0 && d > pe.x && (a = pe.x)) : nt.min.x !== nt.max.x && (s = r)) : (r < nt.max[t] && (i = l.panEndFriction, r - nt.max[t], n = ft[t] - nt.max[t]), (n <= 0 || u > 0) && ti() > 1 ? (a = d, u > 0 && d < pe.x && (a = pe.x)) : nt.min.x !== nt.max.x && (s = r))) : a = d, "x" !== t) ? void (ot || X || _ > o.currItem.fitRatio && (mt[t] += e[t] * i)) : (void 0 !== a && (Nt(a, !0), X = a !== pe.x), nt.min.x !== nt.max.x && (void 0 !== s ? mt.x = s : X || (mt.x += e.x * i)), void 0 !== a)
                },
                He = function (t) {
                    if (!("mousedown" === t.type && t.button > 0)) {
                        if (Xe) return void t.preventDefault();
                        if (!Y || "mousedown" !== t.type) {
                            if (Ae(t, !0) && t.preventDefault(), Et("pointerDown"), P) {
                                var e = s.arraySearch(he, t.pointerId, "id");
                                e < 0 && (e = he.length), he[e] = {
                                    x: t.pageX,
                                    y: t.pageY,
                                    id: t.pointerId
                                }
                            }
                            var i = ze(t),
                                n = i.length;
                            J = null, ie(), K && 1 !== n || (K = rt = !0, s.bind(window, m, o), q = dt = lt = U = X = Z = V = Q = !1, at = null, Et("firstTouchStart", i), zt(ft, mt), pt.x = pt.y = 0, zt(de, i[0]), zt(ue, de), pe.x = yt.x * vt, fe = [{
                                x: de.x,
                                y: de.y
                            }], R = W = At(), qt(_, !0), Se(), Te()), !tt && n > 1 && !ot && !X && (y = _, Q = !1, tt = V = !0, pt.y = pt.x = 0, zt(ft, mt), zt(re, i[0]), zt(le, i[1]), Me(re, le, we), be.x = Math.abs(we.x) - mt.x, be.y = Math.abs(we.y) - mt.y, et = it = ke(re, le))
                        }
                    }
                },
                We = function (t) {
                    if (t.preventDefault(), P) {
                        var e = s.arraySearch(he, t.pointerId, "id");
                        if (e > -1) {
                            var i = he[e];
                            i.x = t.pageX, i.y = t.pageY
                        }
                    }
                    if (K) {
                        var n = ze(t);
                        if (at || Z || tt) J = n;
                        else if (ye.x !== yt.x * vt) at = "h";
                        else {
                            var o = Math.abs(n[0].x - de.x) - Math.abs(n[0].y - de.y);
                            Math.abs(o) >= ae && (at = o > 0 ? "h" : "v", J = n)
                        }
                    }
                },
                Re = function () {
                    if (J) {
                        var t = J.length;
                        if (0 !== t)
                            if (zt(re, J[0]), ce.x = re.x - de.x, ce.y = re.y - de.y, tt && t > 1) {
                                if (de.x = re.x, de.y = re.y, !ce.x && !ce.y && xe(J[1], le)) return;
                                zt(le, J[1]), Q || (Q = !0, Et("zoomGestureStarted"));
                                var e = ke(re, le),
                                    i = Ke(e);
                                i > o.currItem.initialZoomLevel + o.currItem.initialZoomLevel / 15 && (dt = !0);
                                var n = 1,
                                    s = Ut(),
                                    a = Yt();
                                if (i < s)
                                    if (l.pinchToClose && !dt && y <= o.currItem.initialZoomLevel) {
                                        var r = s - i,
                                            c = 1 - r / (s / 1.2);
                                        Pt(c), Et("onPinchClose", c), lt = !0
                                    } else n = (s - i) / s, n > 1 && (n = 1), i = s - n * (s / 3);
                                else i > a && (n = (i - a) / (6 * s), n > 1 && (n = 1), i = a + n * s);
                                n < 0 && (n = 0), et = e, Me(re, le, ve), pt.x += ve.x - we.x, pt.y += ve.y - we.y, zt(we, ve), mt.x = Lt("x", i), mt.y = Lt("y", i), q = i > _, _ = i, jt()
                            } else {
                                if (!at) return;
                                if (rt && (rt = !1, Math.abs(ce.x) >= ae && (ce.x -= J[0].x - ue.x), Math.abs(ce.y) >= ae && (ce.y -= J[0].y - ue.y)), de.x = re.x, de.y = re.y, 0 === ce.x && 0 === ce.y) return;
                                if ("v" === at && l.closeOnVerticalDrag && !Ie()) {
                                    pt.y += ce.y, mt.y += ce.y;
                                    var d = $e();
                                    return U = !0, Et("onVerticalDrag", d), Pt(d), void jt()
                                }
                                je(At(), re.x, re.y), Z = !0, nt = o.currItem.bounds;
                                var u = Fe("x", ce);
                                u || (Fe("y", ce), Ft(mt), jt())
                            }
                    }
                },
                Be = function (t) {
                    if (F.isOldAndroid) {
                        if (Y && "mouseup" === t.type) return;
                        t.type.indexOf("touch") > -1 && (clearTimeout(Y), Y = setTimeout(function () {
                            Y = 0
                        }, 600))
                    }
                    Et("pointerUp"), Ae(t, !1) && t.preventDefault();
                    var e;
                    if (P) {
                        var i = s.arraySearch(he, t.pointerId, "id");
                        if (i > -1)
                            if (e = he.splice(i, 1)[0], navigator.msPointerEnabled) {
                                var n = {
                                    4: "mouse",
                                    2: "touch",
                                    3: "pen"
                                };
                                e.type = n[t.pointerType], e.type || (e.type = t.pointerType || "mouse")
                            } else e.type = t.pointerType || "mouse"
                    }
                    var a, r = ze(t),
                        c = r.length;
                    if ("mouseup" === t.type && (c = 0), 2 === c) return J = null, !0;
                    1 === c && zt(ue, r[0]), 0 !== c || at || ot || (e || ("mouseup" === t.type ? e = {
                        x: t.pageX,
                        y: t.pageY,
                        type: "mouse"
                    } : t.changedTouches && t.changedTouches[0] && (e = {
                        x: t.changedTouches[0].pageX,
                        y: t.changedTouches[0].pageY,
                        type: "touch"
                    })), Et("touchRelease", t, e));
                    var d = -1;
                    if (0 === c && (K = !1, s.unbind(window, m, o), Se(), tt ? d = 0 : -1 !== _e && (d = At() - _e)), _e = 1 === c ? At() : -1, a = -1 !== d && d < 150 ? "zoom" : "swipe", tt && c < 2 && (tt = !1, 1 === c && (a = "zoomPointerUp"), Et("zoomGestureEnded")), J = null, Z || Q || ot || U)
                        if (ie(), B || (B = qe()), B.calculateSwipeSpeed("x"), U) {
                            var u = $e();
                            if (u < l.verticalDragRange) o.close();
                            else {
                                var h = mt.y,
                                    p = ct;
                                ne("verticalDrag", 0, 1, 300, s.easing.cubic.out, function (t) {
                                    mt.y = (o.currItem.initialPosition.y - h) * t + h, Pt((1 - p) * t + p), jt()
                                }), Et("onVerticalDrag", 1)
                            }
                        } else {
                            if ((X || ot) && 0 === c) {
                                var f = Ye(a, B);
                                if (f) return;
                                a = "zoomPointerUp"
                            }
                            if (!ot) return "swipe" !== a ? void Ve() : void (!X && _ > o.currItem.fitRatio && Ue(B))
                        }
                },
                qe = function () {
                    var t, e, i = {
                        lastFlickOffset: {},
                        lastFlickDist: {},
                        lastFlickSpeed: {},
                        slowDownRatio: {},
                        slowDownRatioReverse: {},
                        speedDecelerationRatio: {},
                        speedDecelerationRatioAbs: {},
                        distanceOffset: {},
                        backAnimDestination: {},
                        backAnimStarted: {},
                        calculateSwipeSpeed: function (n) {
                            fe.length > 1 ? (t = At() - R + 50, e = fe[fe.length - 2][n]) : (t = At() - W, e = ue[n]), i.lastFlickOffset[n] = de[n] - e, i.lastFlickDist[n] = Math.abs(i.lastFlickOffset[n]), i.lastFlickDist[n] > 20 ? i.lastFlickSpeed[n] = i.lastFlickOffset[n] / t : i.lastFlickSpeed[n] = 0, Math.abs(i.lastFlickSpeed[n]) < .1 && (i.lastFlickSpeed[n] = 0), i.slowDownRatio[n] = .95, i.slowDownRatioReverse[n] = 1 - i.slowDownRatio[n], i.speedDecelerationRatio[n] = 1
                        },
                        calculateOverBoundsAnimOffset: function (t, e) {
                            i.backAnimStarted[t] || (mt[t] > nt.min[t] ? i.backAnimDestination[t] = nt.min[t] : mt[t] < nt.max[t] && (i.backAnimDestination[t] = nt.max[t]), void 0 !== i.backAnimDestination[t] && (i.slowDownRatio[t] = .7, i.slowDownRatioReverse[t] = 1 - i.slowDownRatio[t], i.speedDecelerationRatioAbs[t] < .05 && (i.lastFlickSpeed[t] = 0, i.backAnimStarted[t] = !0, ne("bounceZoomPan" + t, mt[t], i.backAnimDestination[t], e || 300, s.easing.sine.out, function (e) {
                                mt[t] = e, jt()
                            }))))
                        },
                        calculateAnimOffset: function (t) {
                            i.backAnimStarted[t] || (i.speedDecelerationRatio[t] = i.speedDecelerationRatio[t] * (i.slowDownRatio[t] + i.slowDownRatioReverse[t] - i.slowDownRatioReverse[t] * i.timeDiff / 10), i.speedDecelerationRatioAbs[t] = Math.abs(i.lastFlickSpeed[t] * i.speedDecelerationRatio[t]), i.distanceOffset[t] = i.lastFlickSpeed[t] * i.speedDecelerationRatio[t] * i.timeDiff, mt[t] += i.distanceOffset[t])
                        },
                        panAnimLoop: function () {
                            if (Xt.zoomPan && (Xt.zoomPan.raf = j(i.panAnimLoop), i.now = At(), i.timeDiff = i.now - i.lastNow, i.lastNow = i.now, i.calculateAnimOffset("x"), i.calculateAnimOffset("y"), jt(), i.calculateOverBoundsAnimOffset("x"), i.calculateOverBoundsAnimOffset("y"), i.speedDecelerationRatioAbs.x < .05 && i.speedDecelerationRatioAbs.y < .05)) return mt.x = Math.round(mt.x), mt.y = Math.round(mt.y), jt(), void te("zoomPan")
                        }
                    };
                    return i
                },
                Ue = function (t) {
                    return t.calculateSwipeSpeed("y"), nt = o.currItem.bounds, t.backAnimDestination = {}, t.backAnimStarted = {}, Math.abs(t.lastFlickSpeed.x) <= .05 && Math.abs(t.lastFlickSpeed.y) <= .05 ? (t.speedDecelerationRatioAbs.x = t.speedDecelerationRatioAbs.y = 0, t.calculateOverBoundsAnimOffset("x"), t.calculateOverBoundsAnimOffset("y"), !0) : (ee("zoomPan"), t.lastNow = At(), void t.panAnimLoop())
                },
                Ye = function (t, e) {
                    var i;
                    ot || (ge = h);
                    var n;
                    if ("swipe" === t) {
                        var a = de.x - ue.x,
                            r = e.lastFlickDist.x < 10;
                        a > oe && (r || e.lastFlickOffset.x > 20) ? n = -1 : a < -oe && (r || e.lastFlickOffset.x < -20) && (n = 1)
                    }
                    var c;
                    n && (h += n, h < 0 ? (h = l.loop ? ti() - 1 : 0, c = !0) : h >= ti() && (h = l.loop ? 0 : ti() - 1, c = !0), c && !l.loop || (bt += n, vt -= n, i = !0));
                    var d, u = yt.x * vt,
                        p = Math.abs(u - ye.x);
                    return i || u > ye.x == e.lastFlickSpeed.x > 0 ? (d = Math.abs(e.lastFlickSpeed.x) > 0 ? p / Math.abs(e.lastFlickSpeed.x) : 333, d = Math.min(d, 400), d = Math.max(d, 250)) : d = 333, ge === h && (i = !1), ot = !0, Et("mainScrollAnimStart"), ne("mainScroll", ye.x, u, d, s.easing.cubic.out, Nt, function () {
                        ie(), ot = !1, ge = -1, (i || ge !== h) && o.updateCurrItem(), Et("mainScrollAnimComplete")
                    }), i && o.updateCurrItem(!0), i
                },
                Ke = function (t) {
                    return 1 / it * t * y
                },
                Ve = function () {
                    var t = _,
                        e = Ut(),
                        i = Yt();
                    _ < e ? t = e : _ > i && (t = i);
                    var n, a = ct;
                    return lt && !q && !dt && _ < e ? (o.close(), !0) : (lt && (n = function (t) {
                        Pt((1 - a) * t + a)
                    }), o.zoomTo(t, 0, 200, s.easing.cubic.out, n), !0)
                };
            St("Gestures", {
                publicMethods: {
                    initGestures: function () {
                        var t = function (t, e, i, n, s) {
                            T = t + e, I = t + i, D = t + n, E = s ? t + s : ""
                        };
                        P = F.pointerEvent, P && F.touch && (F.touch = !1), P ? navigator.msPointerEnabled ? t("MSPointer", "Down", "Move", "Up", "Cancel") : t("pointer", "down", "move", "up", "cancel") : F.touch ? (t("touch", "start", "move", "end", "cancel"), M = !0) : t("mouse", "down", "move", "up"), m = I + " " + D + " " + E, g = T, P && !M && (M = navigator.maxTouchPoints > 1 || navigator.msMaxTouchPoints > 1), o.likelyTouchDevice = M, v[T] = He, v[I] = We, v[D] = Be, E && (v[E] = v[D]), F.touch && (g += " mousedown", m += " mousemove mouseup", v.mousedown = v[T], v.mousemove = v[I], v.mouseup = v[D]), M || (l.allowPanToNext = !1)
                    }
                }
            });
            var Qe, Ze, Ge, Xe, Je, ti, ei, ii = function (e, i, n, a) {
                Qe && clearTimeout(Qe), Xe = !0, Ge = !0;
                var r;
                e.initialLayout ? (r = e.initialLayout, e.initialLayout = null) : r = l.getThumbBoundsFn && l.getThumbBoundsFn(h);
                var c = n ? l.hideAnimationDuration : l.showAnimationDuration,
                    d = function () {
                        te("initialZoom"), n ? (o.template.removeAttribute("style"), o.bg.removeAttribute("style")) : (Pt(1), i && (i.style.display = "block"), s.addClass(t, "pswp--animated-in"), Et("initialZoom" + (n ? "OutEnd" : "InEnd"))), a && a(), Xe = !1
                    };
                if (!c || !r || void 0 === r.x) return Et("initialZoom" + (n ? "Out" : "In")), _ = e.initialZoomLevel, zt(mt, e.initialPosition), jt(), t.style.opacity = n ? 0 : 1, Pt(1), void (c ? setTimeout(function () {
                    d()
                }, c) : d());
                !function () {
                    var i = u,
                        a = !o.currItem.src || o.currItem.loadError || l.showHideOpacity;
                    e.miniImg && (e.miniImg.style.webkitBackfaceVisibility = "hidden"), n || (_ = r.w / e.w, mt.x = r.x, mt.y = r.y - N, o[a ? "template" : "bg"].style.opacity = .001, jt()), ee("initialZoom"), n && !i && s.removeClass(t, "pswp--animated-in"), a && (n ? s[(i ? "remove" : "add") + "Class"](t, "pswp--animate_opacity") : setTimeout(function () {
                        s.addClass(t, "pswp--animate_opacity")
                    }, 30)), Qe = setTimeout(function () {
                        if (Et("initialZoom" + (n ? "Out" : "In")), n) {
                            var o = r.w / e.w,
                                l = {
                                    x: mt.x,
                                    y: mt.y
                                },
                                u = _,
                                h = ct,
                                p = function (e) {
                                    1 === e ? (_ = o, mt.x = r.x, mt.y = r.y - z) : (_ = (o - u) * e + u, mt.x = (r.x - l.x) * e + l.x, mt.y = (r.y - z - l.y) * e + l.y), jt(), a ? t.style.opacity = 1 - e : Pt(h - e * h)
                                };
                            i ? ne("initialZoom", 0, 1, c, s.easing.cubic.out, p, d) : (p(1), Qe = setTimeout(d, c + 20))
                        } else _ = e.initialZoomLevel, zt(mt, e.initialPosition), jt(), Pt(1), a ? t.style.opacity = 1 : Pt(1), Qe = setTimeout(d, c + 20)
                    }, n ? 25 : 90)
                }()
            },
                ni = {},
                si = [],
                oi = {
                    index: 0,
                    errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
                    forceProgressiveLoading: !1,
                    preload: [1, 1],
                    getNumItemsFn: function () {
                        return Ze.length
                    }
                },
                ai = function () {
                    return {
                        center: {
                            x: 0,
                            y: 0
                        },
                        max: {
                            x: 0,
                            y: 0
                        },
                        min: {
                            x: 0,
                            y: 0
                        }
                    }
                },
                ri = function (t, e, i) {
                    var n = t.bounds;
                    n.center.x = Math.round((ni.x - e) / 2), n.center.y = Math.round((ni.y - i) / 2) + t.vGap.top, n.max.x = e > ni.x ? Math.round(ni.x - e) : n.center.x, n.max.y = i > ni.y ? Math.round(ni.y - i) + t.vGap.top : n.center.y, n.min.x = e > ni.x ? 0 : n.center.x, n.min.y = i > ni.y ? t.vGap.top : n.center.y
                },
                li = function (t, e, i) {
                    if (t.src && !t.loadError) {
                        var n = !i;
                        if (n && (t.vGap || (t.vGap = {
                            top: 0,
                            bottom: 0
                        }), Et("parseVerticalMargin", t)), ni.x = e.x, ni.y = e.y - t.vGap.top - t.vGap.bottom, n) {
                            var s = ni.x / t.w,
                                o = ni.y / t.h;
                            t.fitRatio = s < o ? s : o;
                            var a = l.scaleMode;
                            "orig" === a ? i = 1 : "fit" === a && (i = t.fitRatio), i > 1 && (i = 1), t.initialZoomLevel = i, t.bounds || (t.bounds = ai())
                        }
                        if (!i) return;
                        return ri(t, t.w * i, t.h * i), n && i === t.initialZoomLevel && (t.initialPosition = t.bounds.center), t.bounds
                    }
                    return t.w = t.h = 0, t.initialZoomLevel = t.fitRatio = 1, t.bounds = ai(), t.initialPosition = t.bounds.center, t.bounds
                },
                ci = function (t, e, i, n, s, a) {
                    e.loadError || n && (e.imageAppended = !0, hi(e, n, e === o.currItem && kt), i.appendChild(n), a && setTimeout(function () {
                        e && e.loaded && e.placeholder && (e.placeholder.style.display = "none", e.placeholder = null)
                    }, 500))
                },
                di = function (t) {
                    t.loading = !0, t.loaded = !1;
                    var e = t.img = s.createEl("pswp__img", "img"),
                        i = function () {
                            t.loading = !1, t.loaded = !0, t.loadComplete ? t.loadComplete(t) : t.img = null, e.onload = e.onerror = null, e = null
                        };
                    return e.onload = i, e.onerror = function () {
                        t.loadError = !0, i()
                    }, e.src = t.src, e
                },
                ui = function (t, e) {
                    if (t.src && t.loadError && t.container) return e && (t.container.innerHTML = ""), t.container.innerHTML = l.errorMsg.replace("%url%", t.src), !0
                },
                hi = function (t, e, i) {
                    if (t.src) {
                        e || (e = t.container.lastChild);
                        var n = i ? t.w : Math.round(t.w * t.fitRatio),
                            s = i ? t.h : Math.round(t.h * t.fitRatio);
                        t.placeholder && !t.loaded && (t.placeholder.style.width = n + "px", t.placeholder.style.height = s + "px"), e.style.width = n + "px", e.style.height = s + "px"
                    }
                },
                pi = function () {
                    if (si.length) {
                        for (var t, e = 0; e < si.length; e++) t = si[e], t.holder.index === t.index && ci(t.index, t.item, t.baseDiv, t.img, !1, t.clearPlaceholder);
                        si = []
                    }
                };
            St("Controller", {
                publicMethods: {
                    lazyLoadItem: function (t) {
                        t = Tt(t);
                        var e = Je(t);
                        e && (!e.loaded && !e.loading || C) && (Et("gettingData", t, e), e.src && di(e))
                    },
                    initController: function () {
                        s.extend(l, oi, !0), o.items = Ze = i, Je = o.getItemAt, ti = l.getNumItemsFn, ei = l.loop, ti() < 3 && (l.loop = !1), Dt("beforeChange", function (t) {
                            var e, i = l.preload,
                                n = null === t || t >= 0,
                                s = Math.min(i[0], ti()),
                                a = Math.min(i[1], ti());
                            for (e = 1; e <= (n ? a : s); e++) o.lazyLoadItem(h + e);
                            for (e = 1; e <= (n ? s : a); e++) o.lazyLoadItem(h - e)
                        }), Dt("initialLayout", function () {
                            o.currItem.initialLayout = l.getThumbBoundsFn && l.getThumbBoundsFn(h)
                        }), Dt("mainScrollAnimComplete", pi), Dt("initialZoomInEnd", pi), Dt("destroy", function () {
                            for (var t, e = 0; e < Ze.length; e++) t = Ze[e], t.container && (t.container = null), t.placeholder && (t.placeholder = null), t.img && (t.img = null), t.preloader && (t.preloader = null), t.loadError && (t.loaded = t.loadError = !1);
                            si = null
                        })
                    },
                    getItemAt: function (t) {
                        return t >= 0 && void 0 !== Ze[t] && Ze[t]
                    },
                    allowProgressiveImg: function () {
                        return l.forceProgressiveLoading || !M || l.mouseUsed || screen.width > 1200
                    },
                    setContent: function (t, e) {
                        l.loop && (e = Tt(e));
                        var i = o.getItemAt(t.index);
                        i && (i.container = null);
                        var n, a = o.getItemAt(e);
                        if (!a) return void (t.el.innerHTML = "");
                        Et("gettingData", e, a), t.index = e, t.item = a;
                        var r = a.container = s.createEl("pswp__zoom-wrap");
                        if (!a.src && a.html && (a.html.tagName ? r.appendChild(a.html) : r.innerHTML = a.html), ui(a), li(a, gt), !a.src || a.loadError || a.loaded) a.src && !a.loadError && (n = s.createEl("pswp__img", "img"), n.style.opacity = 1, n.src = a.src, hi(a, n), ci(e, a, r, n, !0));
                        else {
                            if (a.loadComplete = function (i) {
                                if (c) {
                                    if (t && t.index === e) {
                                        if (ui(i, !0)) return i.loadComplete = i.img = null, li(i, gt), $t(i), void (t.index === h && o.updateCurrZoomItem());
                                        i.imageAppended ? !Xe && i.placeholder && (i.placeholder.style.display = "none", i.placeholder = null) : F.transform && (ot || Xe) ? si.push({
                                            item: i,
                                            baseDiv: r,
                                            img: i.img,
                                            index: e,
                                            holder: t,
                                            clearPlaceholder: !0
                                        }) : ci(e, i, r, i.img, ot || Xe, !0)
                                    }
                                    i.loadComplete = null, i.img = null, Et("imageLoadComplete", e, i)
                                }
                            }, s.features.transform) {
                                var d = "pswp__img pswp__img--placeholder";
                                d += a.msrc ? "" : " pswp__img--placeholder--blank";
                                var u = s.createEl(d, a.msrc ? "img" : "");
                                a.msrc && (u.src = a.msrc), hi(a, u), r.appendChild(u), a.placeholder = u
                            }
                            a.loading || di(a), o.allowProgressiveImg() && (!Ge && F.transform ? si.push({
                                item: a,
                                baseDiv: r,
                                img: a.img,
                                index: e,
                                holder: t
                            }) : ci(e, a, r, a.img, !0, !0))
                        }
                        Ge || e !== h ? $t(a) : (st = r.style, ii(a, n || a.img)), t.el.innerHTML = "", t.el.appendChild(r)
                    },
                    cleanSlide: function (t) {
                        t.img && (t.img.onload = t.img.onerror = null), t.loaded = t.loading = t.img = t.imageAppended = !1
                    }
                }
            });
            var fi, mi = {},
                gi = function (t, e, i) {
                    var n = document.createEvent("CustomEvent"),
                        s = {
                            origEvent: t,
                            target: t.target,
                            releasePoint: e,
                            pointerType: i || "touch"
                        };
                    n.initCustomEvent("pswpTap", !0, !0, s), t.target.dispatchEvent(n)
                };
            St("Tap", {
                publicMethods: {
                    initTap: function () {
                        Dt("firstTouchStart", o.onTapStart), Dt("touchRelease", o.onTapRelease), Dt("destroy", function () {
                            mi = {}, fi = null
                        })
                    },
                    onTapStart: function (t) {
                        t.length > 1 && (clearTimeout(fi), fi = null)
                    },
                    onTapRelease: function (t, e) {
                        if (e && !Z && !V && !Jt) {
                            var i = e;
                            if (fi && (clearTimeout(fi), fi = null, Ce(i, mi))) return void Et("doubleTap", i);
                            if ("mouse" === e.type) return void gi(t, e, "mouse");
                            if ("BUTTON" === t.target.tagName.toUpperCase() || s.hasClass(t.target, "pswp__single-tap")) return void gi(t, e);
                            zt(mi, i), fi = setTimeout(function () {
                                gi(t, e), fi = null
                            }, 300)
                        }
                    }
                }
            });
            var vi;
            St("DesktopZoom", {
                publicMethods: {
                    initDesktopZoom: function () {
                        L || (M ? Dt("mouseUsed", function () {
                            o.setupDesktopZoom()
                        }) : o.setupDesktopZoom(!0))
                    },
                    setupDesktopZoom: function (e) {
                        vi = {};
                        var i = "wheel mousewheel DOMMouseScroll";
                        Dt("bindEvents", function () {
                            s.bind(t, i, o.handleMouseWheel)
                        }), Dt("unbindEvents", function () {
                            vi && s.unbind(t, i, o.handleMouseWheel)
                        }), o.mouseZoomedIn = !1;
                        var n, a = function () {
                            o.mouseZoomedIn && (s.removeClass(t, "pswp--zoomed-in"), o.mouseZoomedIn = !1), _ < 1 ? s.addClass(t, "pswp--zoom-allowed") : s.removeClass(t, "pswp--zoom-allowed"), r()
                        },
                            r = function () {
                                n && (s.removeClass(t, "pswp--dragging"), n = !1)
                            };
                        Dt("resize", a), Dt("afterChange", a), Dt("pointerDown", function () {
                            o.mouseZoomedIn && (n = !0, s.addClass(t, "pswp--dragging"))
                        }), Dt("pointerUp", r), e || a()
                    },
                    handleMouseWheel: function (t) {
                        if (_ <= o.currItem.fitRatio) return l.modal && (!l.closeOnScroll || Jt || K ? t.preventDefault() : A && Math.abs(t.deltaY) > 2 && (u = !0, o.close())), !0;
                        if (t.stopPropagation(), vi.x = 0, "deltaX" in t) 1 === t.deltaMode ? (vi.x = 18 * t.deltaX, vi.y = 18 * t.deltaY) : (vi.x = t.deltaX, vi.y = t.deltaY);
                        else if ("wheelDelta" in t) t.wheelDeltaX && (vi.x = -.16 * t.wheelDeltaX), t.wheelDeltaY ? vi.y = -.16 * t.wheelDeltaY : vi.y = -.16 * t.wheelDelta;
                        else {
                            if (!("detail" in t)) return;
                            vi.y = t.detail
                        }
                        qt(_, !0);
                        var e = mt.x - vi.x,
                            i = mt.y - vi.y;
                        (l.modal || e <= nt.min.x && e >= nt.max.x && i <= nt.min.y && i >= nt.max.y) && t.preventDefault(), o.panTo(e, i)
                    },
                    toggleDesktopZoom: function (e) {
                        e = e || {
                            x: gt.x / 2 + _t.x,
                            y: gt.y / 2 + _t.y
                        };
                        var i = l.getDoubleTapZoom(!0, o.currItem),
                            n = _ === i;
                        o.mouseZoomedIn = !n, o.zoomTo(n ? o.currItem.initialZoomLevel : i, e, 333), s[(n ? "remove" : "add") + "Class"](t, "pswp--zoomed-in")
                    }
                }
            });
            var _i, yi, bi, wi, xi, Ci, ki, Si, Ti, Ii, Di, Ei, Ai = {
                history: !0,
                galleryUID: 1
            },
                Pi = function () {
                    return Di.hash.substring(1)
                },
                Mi = function () {
                    _i && clearTimeout(_i), bi && clearTimeout(bi)
                },
                ji = function () {
                    var t = Pi(),
                        e = {};
                    if (t.length < 5) return e;
                    var i, n = t.split("&");
                    for (i = 0; i < n.length; i++)
                        if (n[i]) {
                            var s = n[i].split("=");
                            s.length < 2 || (e[s[0]] = s[1])
                        }
                    if (l.galleryPIDs) {
                        var o = e.pid;
                        for (e.pid = 0, i = 0; i < Ze.length; i++)
                            if (Ze[i].pid === o) {
                                e.pid = i;
                                break
                            }
                    } else e.pid = parseInt(e.pid, 10) - 1;
                    return e.pid < 0 && (e.pid = 0), e
                },
                $i = function () {
                    if (bi && clearTimeout(bi), Jt || K) return void (bi = setTimeout($i, 500));
                    wi ? clearTimeout(yi) : wi = !0;
                    var t = h + 1,
                        e = Je(h);
                    e.hasOwnProperty("pid") && (t = e.pid);
                    var i = ki + "&gid=" + l.galleryUID + "&pid=" + t;
                    Si || -1 === Di.hash.indexOf(i) && (Ii = !0);
                    var n = Di.href.split("#")[0] + "#" + i;
                    Ei ? "#" + i !== window.location.hash && history[Si ? "replaceState" : "pushState"]("", document.title, n) : Si ? Di.replace(n) : Di.hash = i, Si = !0, yi = setTimeout(function () {
                        wi = !1
                    }, 60)
                };
            St("History", {
                publicMethods: {
                    initHistory: function () {
                        if (s.extend(l, Ai, !0), l.history) {
                            Di = window.location, Ii = !1, Ti = !1, Si = !1, ki = Pi(), Ei = "pushState" in history, ki.indexOf("gid=") > -1 && (ki = ki.split("&gid=")[0], ki = ki.split("?gid=")[0]), Dt("afterChange", o.updateURL), Dt("unbindEvents", function () {
                                s.unbind(window, "hashchange", o.onHashChange)
                            });
                            var t = function () {
                                Ci = !0, Ti || (Ii ? history.back() : ki ? Di.hash = ki : Ei ? history.pushState("", document.title, Di.pathname + Di.search) : Di.hash = ""), Mi()
                            };
                            Dt("unbindEvents", function () {
                                u && t()
                            }), Dt("destroy", function () {
                                Ci || t()
                            }), Dt("firstUpdate", function () {
                                h = ji().pid
                            });
                            var e = ki.indexOf("pid=");
                            e > -1 && (ki = ki.substring(0, e), "&" === ki.slice(-1) && (ki = ki.slice(0, -1))), setTimeout(function () {
                                c && s.bind(window, "hashchange", o.onHashChange)
                            }, 40)
                        }
                    },
                    onHashChange: function () {
                        return Pi() === ki ? (Ti = !0, void o.close()) : void (wi || (xi = !0, o.goTo(ji().pid), xi = !1))
                    },
                    updateURL: function () {
                        Mi(), xi || (Si ? _i = setTimeout($i, 800) : $i())
                    }
                }
            }), s.extend(o, se)
        }
    }),
    function (t, e) {
        "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = e() : t.PhotoSwipeUI_Default = e()
    }(this, function () {
        "use strict";
        return function (t, e) {
            var i, n, s, o, a, r, l, c, d, u, h, p, f, m, g, v, _, y, b, w = this,
                x = !1,
                C = !0,
                k = !0,
                S = {
                    barsSize: {
                        top: 44,
                        bottom: "auto"
                    },
                    closeElClasses: ["item", "caption", "zoom-wrap", "ui", "top-bar"],
                    timeToIdle: 4e3,
                    timeToIdleOutside: 1e3,
                    loadingIndicatorDelay: 1e3,
                    addCaptionHTMLFn: function (t, e) {
                        return t.title ? (e.children[0].innerHTML = t.title, !0) : (e.children[0].innerHTML = "", !1)
                    },
                    closeEl: !0,
                    captionEl: !0,
                    fullscreenEl: !0,
                    zoomEl: !0,
                    shareEl: !0,
                    counterEl: !0,
                    arrowEl: !0,
                    preloaderEl: !0,
                    tapToClose: !1,
                    tapToToggleControls: !0,
                    clickToCloseNonZoomable: !0,
                    shareButtons: [{
                        id: "facebook",
                        label: "Share on Facebook",
                        url: "https://www.facebook.com/sharer/sharer.php?u={{url}}"
                    }, {
                        id: "twitter",
                        label: "Tweet",
                        url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
                    }, {
                        id: "pinterest",
                        label: "Pin it",
                        url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"
                    }, {
                        id: "download",
                        label: "Download image",
                        url: "{{raw_image_url}}",
                        download: !0
                    }],
                    getImageURLForShare: function () {
                        return t.currItem.src || ""
                    },
                    getPageURLForShare: function () {
                        return window.location.href
                    },
                    getTextForShare: function () {
                        return t.currItem.title || ""
                    },
                    indexIndicatorSep: " / ",
                    fitControlsWidth: 1200
                },
                T = function (t) {
                    if (v) return !0;
                    t = t || window.event, g.timeToIdle && g.mouseUsed && !d && N();
                    for (var i, n, s = t.target || t.srcElement, o = s.getAttribute("class") || "", a = 0; a < q.length; a++) i = q[a], i.onTap && o.indexOf("pswp__" + i.name) > -1 && (i.onTap(), n = !0);
                    if (n) {
                        t.stopPropagation && t.stopPropagation(), v = !0;
                        var r = e.features.isOldAndroid ? 600 : 30;
                        _ = setTimeout(function () {
                            v = !1
                        }, r)
                    }
                },
                I = function () {
                    return !t.likelyTouchDevice || g.mouseUsed || screen.width > g.fitControlsWidth
                },
                D = function (t, i, n) {
                    e[(n ? "add" : "remove") + "Class"](t, "pswp__" + i)
                },
                E = function () {
                    var t = 1 === g.getNumItemsFn();
                    t !== m && (D(n, "ui--one-slide", t), m = t)
                },
                A = function () {
                    D(l, "share-modal--hidden", k)
                },
                P = function () {
                    return k = !k, k ? (e.removeClass(l, "pswp__share-modal--fade-in"), setTimeout(function () {
                        k && A()
                    }, 300)) : (A(), setTimeout(function () {
                        k || e.addClass(l, "pswp__share-modal--fade-in")
                    }, 30)), k || j(), !1
                },
                M = function (e) {
                    e = e || window.event;
                    var i = e.target || e.srcElement;
                    return t.shout("shareLinkClick", e, i), !!i.href && (!!i.hasAttribute("download") || (window.open(i.href, "pswp_share", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 100)), k || P(), !1))
                },
                j = function () {
                    for (var t, e, i, n, s, o = "", a = 0; a < g.shareButtons.length; a++) t = g.shareButtons[a], i = g.getImageURLForShare(t), n = g.getPageURLForShare(t), s = g.getTextForShare(t), e = t.url.replace("{{url}}", encodeURIComponent(n)).replace("{{image_url}}", encodeURIComponent(i)).replace("{{raw_image_url}}", i).replace("{{text}}", encodeURIComponent(s)), o += '<a href="' + e + '" target="_blank" class="pswp__share--' + t.id + '"' + (t.download ? "download" : "") + ">" + t.label + "</a>", g.parseShareButtonOut && (o = g.parseShareButtonOut(t, o));
                    l.children[0].innerHTML = o, l.children[0].onclick = M
                },
                $ = function (t) {
                    for (var i = 0; i < g.closeElClasses.length; i++)
                        if (e.hasClass(t, "pswp__" + g.closeElClasses[i])) return !0
                },
                O = 0,
                N = function () {
                    clearTimeout(b), O = 0, d && w.setIdle(!1)
                },
                L = function (t) {
                    t = t || window.event;
                    var e = t.relatedTarget || t.toElement;
                    e && "HTML" !== e.nodeName || (clearTimeout(b), b = setTimeout(function () {
                        w.setIdle(!0)
                    }, g.timeToIdleOutside))
                },
                z = function () {
                    g.fullscreenEl && !e.features.isOldAndroid && (i || (i = w.getFullscreenAPI()), i ? (e.bind(document, i.eventK, w.updateFullscreen), w.updateFullscreen(), e.addClass(t.template, "pswp--supports-fs")) : e.removeClass(t.template, "pswp--supports-fs"))
                },
                F = function () {
                    g.preloaderEl && (H(!0), u("beforeChange", function () {
                        clearTimeout(f), f = setTimeout(function () {
                            t.currItem && t.currItem.loading ? (!t.allowProgressiveImg() || t.currItem.img && !t.currItem.img.naturalWidth) && H(!1) : H(!0)
                        }, g.loadingIndicatorDelay)
                    }), u("imageLoadComplete", function (e, i) {
                        t.currItem === i && H(!0)
                    }))
                },
                H = function (t) {
                    p !== t && (D(h, "preloader--active", !t), p = t)
                },
                W = function (t) {
                    var i = t.vGap;
                    if (I()) {
                        var a = g.barsSize;
                        if (g.captionEl && "auto" === a.bottom)
                            if (o || (o = e.createEl("pswp__caption pswp__caption--fake"), o.appendChild(e.createEl("pswp__caption__center")), n.insertBefore(o, s), e.addClass(n, "pswp__ui--fit")), g.addCaptionHTMLFn(t, o, !0)) {
                                var r = o.clientHeight;
                                i.bottom = parseInt(r, 10) || 44
                            } else i.bottom = a.top;
                        else i.bottom = "auto" === a.bottom ? 0 : a.bottom;
                        i.top = a.top
                    } else i.top = i.bottom = 0
                },
                R = function () {
                    g.timeToIdle && u("mouseUsed", function () {
                        e.bind(document, "mousemove", N), e.bind(document, "mouseout", L), y = setInterval(function () {
                            2 === ++O && w.setIdle(!0)
                        }, g.timeToIdle / 2)
                    })
                },
                B = function () {
                    u("onVerticalDrag", function (t) {
                        C && t < .95 ? w.hideControls() : !C && t >= .95 && w.showControls()
                    });
                    var t;
                    u("onPinchClose", function (e) {
                        C && e < .9 ? (w.hideControls(), t = !0) : t && !C && e > .9 && w.showControls()
                    }), u("zoomGestureEnded", function () {
                        (t = !1) && !C && w.showControls()
                    })
                },
                q = [{
                    name: "caption",
                    option: "captionEl",
                    onInit: function (t) {
                        s = t
                    }
                }, {
                    name: "share-modal",
                    option: "shareEl",
                    onInit: function (t) {
                        l = t
                    },
                    onTap: function () {
                        P()
                    }
                }, {
                    name: "button--share",
                    option: "shareEl",
                    onInit: function (t) {
                        r = t
                    },
                    onTap: function () {
                        P()
                    }
                }, {
                    name: "button--zoom",
                    option: "zoomEl",
                    onTap: t.toggleDesktopZoom
                }, {
                    name: "counter",
                    option: "counterEl",
                    onInit: function (t) {
                        a = t
                    }
                }, {
                    name: "button--close",
                    option: "closeEl",
                    onTap: t.close
                }, {
                    name: "button--arrow--left",
                    option: "arrowEl",
                    onTap: t.prev
                }, {
                    name: "button--arrow--right",
                    option: "arrowEl",
                    onTap: t.next
                }, {
                    name: "button--fs",
                    option: "fullscreenEl",
                    onTap: function () {
                        i.isFullscreen() ? i.exit() : i.enter()
                    }
                }, {
                    name: "preloader",
                    option: "preloaderEl",
                    onInit: function (t) {
                        h = t
                    }
                }],
                U = function () {
                    var t, i, s, o = function (n) {
                        if (n)
                            for (var o = n.length, a = 0; a < o; a++) {
                                t = n[a], i = t.className;
                                for (var r = 0; r < q.length; r++) s = q[r], i.indexOf("pswp__" + s.name) > -1 && (g[s.option] ? (e.removeClass(t, "pswp__element--disabled"), s.onInit && s.onInit(t)) : e.addClass(t, "pswp__element--disabled"))
                            }
                    };
                    o(n.children);
                    var a = e.getChildByClass(n, "pswp__top-bar");
                    a && o(a.children)
                };
            w.init = function () {
                e.extend(t.options, S, !0), g = t.options, n = e.getChildByClass(t.scrollWrap, "pswp__ui"), u = t.listen, B(), u("beforeChange", w.update), u("doubleTap", function (e) {
                    var i = t.currItem.initialZoomLevel;
                    t.getZoomLevel() !== i ? t.zoomTo(i, e, 333) : t.zoomTo(g.getDoubleTapZoom(!1, t.currItem), e, 333)
                }), u("preventDragEvent", function (t, e, i) {
                    var n = t.target || t.srcElement;
                    n && n.getAttribute("class") && t.type.indexOf("mouse") > -1 && (n.getAttribute("class").indexOf("__caption") > 0 || /(SMALL|STRONG|EM)/i.test(n.tagName)) && (i.prevent = !1)
                }), u("bindEvents", function () {
                    e.bind(n, "pswpTap click", T), e.bind(t.scrollWrap, "pswpTap", w.onGlobalTap), t.likelyTouchDevice || e.bind(t.scrollWrap, "mouseover", w.onMouseOver)
                }), u("unbindEvents", function () {
                    k || P(), y && clearInterval(y), e.unbind(document, "mouseout", L), e.unbind(document, "mousemove", N), e.unbind(n, "pswpTap click", T), e.unbind(t.scrollWrap, "pswpTap", w.onGlobalTap), e.unbind(t.scrollWrap, "mouseover", w.onMouseOver), i && (e.unbind(document, i.eventK, w.updateFullscreen), i.isFullscreen() && (g.hideAnimationDuration = 0, i.exit()), i = null)
                }), u("destroy", function () {
                    g.captionEl && (o && n.removeChild(o), e.removeClass(s, "pswp__caption--empty")), l && (l.children[0].onclick = null), e.removeClass(n, "pswp__ui--over-close"), e.addClass(n, "pswp__ui--hidden"), w.setIdle(!1)
                }), g.showAnimationDuration || e.removeClass(n, "pswp__ui--hidden"), u("initialZoomIn", function () {
                    g.showAnimationDuration && e.removeClass(n, "pswp__ui--hidden")
                }), u("initialZoomOut", function () {
                    e.addClass(n, "pswp__ui--hidden")
                }), u("parseVerticalMargin", W), U(), g.shareEl && r && l && (k = !0), E(), R(), z(), F()
            }, w.setIdle = function (t) {
                d = t, D(n, "ui--idle", t)
            }, w.update = function () {
                C && t.currItem ? (w.updateIndexIndicator(), g.captionEl && (g.addCaptionHTMLFn(t.currItem, s), D(s, "caption--empty", !t.currItem.title)), x = !0) : x = !1, k || P(), E()
            }, w.updateFullscreen = function (n) {
                n && setTimeout(function () {
                    t.setScrollOffset(0, e.getScrollY())
                }, 50), e[(i.isFullscreen() ? "add" : "remove") + "Class"](t.template, "pswp--fs")
            }, w.updateIndexIndicator = function () {
                g.counterEl && (a.innerHTML = t.getCurrentIndex() + 1 + g.indexIndicatorSep + g.getNumItemsFn())
            }, w.onGlobalTap = function (i) {
                i = i || window.event;
                var n = i.target || i.srcElement;
                if (!v)
                    if (i.detail && "mouse" === i.detail.pointerType) {
                        if ($(n)) return void t.close();
                        e.hasClass(n, "pswp__img") && (1 === t.getZoomLevel() && t.getZoomLevel() <= t.currItem.fitRatio ? g.clickToCloseNonZoomable && t.close() : t.toggleDesktopZoom(i.detail.releasePoint))
                    } else if (g.tapToToggleControls && (C ? w.hideControls() : w.showControls()), g.tapToClose && (e.hasClass(n, "pswp__img") || $(n))) return void t.close()
            }, w.onMouseOver = function (t) {
                t = t || window.event;
                var e = t.target || t.srcElement;
                D(n, "ui--over-close", $(e))
            }, w.hideControls = function () {
                e.addClass(n, "pswp__ui--hidden"), C = !1
            }, w.showControls = function () {
                C = !0, x || w.update(), e.removeClass(n, "pswp__ui--hidden")
            }, w.supportsFullscreen = function () {
                var t = document;
                return !!(t.exitFullscreen || t.mozCancelFullScreen || t.webkitExitFullscreen || t.msExitFullscreen)
            }, w.getFullscreenAPI = function () {
                var e, i = document.documentElement,
                    n = "fullscreenchange";
                return i.requestFullscreen ? e = {
                    enterK: "requestFullscreen",
                    exitK: "exitFullscreen",
                    elementK: "fullscreenElement",
                    eventK: n
                } : i.mozRequestFullScreen ? e = {
                    enterK: "mozRequestFullScreen",
                    exitK: "mozCancelFullScreen",
                    elementK: "mozFullScreenElement",
                    eventK: "moz" + n
                } : i.webkitRequestFullscreen ? e = {
                    enterK: "webkitRequestFullscreen",
                    exitK: "webkitExitFullscreen",
                    elementK: "webkitFullscreenElement",
                    eventK: "webkit" + n
                } : i.msRequestFullscreen && (e = {
                    enterK: "msRequestFullscreen",
                    exitK: "msExitFullscreen",
                    elementK: "msFullscreenElement",
                    eventK: "MSFullscreenChange"
                }), e && (e.enter = function () {
                    if (c = g.closeOnScroll, g.closeOnScroll = !1, "webkitRequestFullscreen" !== this.enterK) return t.template[this.enterK]();
                    t.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)
                }, e.exit = function () {
                    return g.closeOnScroll = c, document[this.exitK]()
                }, e.isFullscreen = function () {
                    return document[this.elementK]
                }), e
            }
        }
    }),
    function (t, e) {
        "use strict";

        function i(i, n, o, r, l) {
            function c() {
                k = t.devicePixelRatio > 1, o = d(o), n.delay >= 0 && setTimeout(function () {
                    u(!0)
                }, n.delay), (n.delay < 0 || n.combined) && (r.e = _(n.throttle, function (t) {
                    "resize" === t.type && (x = C = -1), u(t.all)
                }), r.a = function (t) {
                    t = d(t), o.push.apply(o, t)
                }, r.g = function () {
                    return o = s(o).filter(function () {
                        return !s(this).data(n.loadedName)
                    })
                }, r.f = function (t) {
                    for (var e = 0; e < t.length; e++) {
                        var i = o.filter(function () {
                            return this === t[e]
                        });
                        i.length && u(!1, i)
                    }
                }, u(), s(n.appendScroll).on("scroll." + l + " resize." + l, r.e))
            }

            function d(t) {
                var o = n.defaultImage,
                    a = n.placeholder,
                    r = n.imageBase,
                    l = n.srcsetAttribute,
                    c = n.loaderAttribute,
                    d = n._f || {};
                t = s(t).filter(function () {
                    var t = s(this),
                        i = g(this);
                    return !t.data(n.handledName) && (t.attr(n.attribute) || t.attr(l) || t.attr(c) || d[i] !== e)
                }).data("plugin_" + n.name, i);
                for (var u = 0, h = t.length; u < h; u++) {
                    var p = s(t[u]),
                        f = g(t[u]),
                        m = p.attr(n.imageBaseAttribute) || r;
                    f === D && m && p.attr(l) && p.attr(l, v(p.attr(l), m)), d[f] === e || p.attr(c) || p.attr(c, d[f]), f === D && o && !p.attr(E) ? p.attr(E, o) : f === D || !a || p.css(M) && "none" !== p.css(M) || p.css(M, "url('" + a + "')")
                }
                return t
            }

            function u(t, e) {
                if (!o.length) return void (n.autoDestroy && i.destroy());
                for (var a = e || o, r = !1, l = n.imageBase || "", c = n.srcsetAttribute, d = n.handledName, u = 0; u < a.length; u++)
                    if (t || e || p(a[u])) {
                        var f = s(a[u]),
                            m = g(a[u]),
                            v = f.attr(n.attribute),
                            _ = f.attr(n.imageBaseAttribute) || l,
                            y = f.attr(n.loaderAttribute);
                        f.data(d) || n.visibleOnly && !f.is(":visible") || !((v || f.attr(c)) && (m === D && (_ + v !== f.attr(E) || f.attr(c) !== f.attr(A)) || m !== D && _ + v !== f.css(M)) || y) || (r = !0, f.data(d, !0), h(f, m, _, y))
                    }
                r && (o = s(o).filter(function () {
                    return !s(this).data(d)
                }))
            }

            function h(t, e, i, o) {
                ++w;
                var a = function () {
                    b("onError", t), y(), a = s.noop
                };
                b("beforeLoad", t);
                var r = n.attribute,
                    l = n.srcsetAttribute,
                    c = n.sizesAttribute,
                    d = n.retinaAttribute,
                    u = n.removeAttribute,
                    h = n.loadedName,
                    p = t.attr(d);
                if (o) {
                    var f = function () {
                        u && t.removeAttr(n.loaderAttribute), t.data(h, !0), b(S, t), setTimeout(y, 1), f = s.noop
                    };
                    t.off(I).one(I, a).one(T, f), b(o, t, function (e) {
                        e ? (t.off(T), f()) : (t.off(I), a())
                    }) || t.trigger(I)
                } else {
                    var m = s(new Image);
                    m.one(I, a).one(T, function () {
                        t.hide(), e === D ? t.attr(P, m.attr(P)).attr(A, m.attr(A)).attr(E, m.attr(E)) : t.css(M, "url('" + m.attr(E) + "')"), t[n.effect](n.effectTime), u && (t.removeAttr(r + " " + l + " " + d + " " + n.imageBaseAttribute), c !== P && t.removeAttr(c)), t.data(h, !0), b(S, t), m.remove(), y()
                    });
                    var g = (k && p ? p : t.attr(r)) || "";
                    m.attr(P, t.attr(c)).attr(A, t.attr(l)).attr(E, g ? i + g : null), m.complete && m.trigger(T)
                }
            }

            function p(t) {
                var e = t.getBoundingClientRect(),
                    i = n.scrollDirection,
                    s = n.threshold,
                    o = m() + s > e.top && -s < e.bottom,
                    a = f() + s > e.left && -s < e.right;
                return "vertical" === i ? o : "horizontal" === i ? a : o && a
            }

            function f() {
                return x >= 0 ? x : x = s(t).width()
            }

            function m() {
                return C >= 0 ? C : C = s(t).height()
            }

            function g(t) {
                return t.tagName.toLowerCase()
            }

            function v(t, e) {
                if (e) {
                    var i = t.split(",");
                    t = "";
                    for (var n = 0, s = i.length; n < s; n++) t += e + i[n].trim() + (n !== s - 1 ? "," : "")
                }
                return t
            }

            function _(t, e) {
                var s, o = 0;
                return function (a, r) {
                    function l() {
                        o = +new Date, e.call(i, a)
                    }

                    var c = +new Date - o;
                    s && clearTimeout(s), c > t || !n.enableThrottle || r ? l() : s = setTimeout(l, t - c)
                }
            }

            function y() {
                --w, o.length || w || b("onFinishedAll")
            }

            function b(t, e, s) {
                return !!(t = n[t]) && (t.apply(i, [].slice.call(arguments, 1)), !0)
            }

            var w = 0,
                x = -1,
                C = -1,
                k = !1,
                S = "afterLoad",
                T = "load",
                I = "error",
                D = "img",
                E = "src",
                A = "srcset",
                P = "sizes",
                M = "background-image";
            "event" === n.bind || a ? c() : s(t).on(T + "." + l, c)
        }

        function n(n, a) {
            var r = this,
                l = s.extend({}, r.config, a),
                c = {},
                d = l.name + "-" + ++o;
            return r.config = function (t, i) {
                return i === e ? l[t] : (l[t] = i, r)
            }, r.addItems = function (t) {
                return c.a && c.a("string" === s.type(t) ? s(t) : t), r
            }, r.getItems = function () {
                return c.g ? c.g() : {}
            }, r.update = function (t) {
                return c.e && c.e({}, !t), r
            }, r.force = function (t) {
                return c.f && c.f("string" === s.type(t) ? s(t) : t), r
            }, r.loadAll = function () {
                return c.e && c.e({
                    all: !0
                }, !0), r
            }, r.destroy = function () {
                return s(l.appendScroll).off("." + d, c.e), s(t).off("." + d), c = {}, e
            }, i(r, l, n, c, d), l.chainable ? n : r
        }

        var s = t.jQuery || t.Zepto,
            o = 0,
            a = !1;
        s.fn.Lazy = s.fn.lazy = function (t) {
            return new n(this, t)
        }, s.Lazy = s.lazy = function (t, i, o) {
            if (s.isFunction(i) && (o = i, i = []), s.isFunction(o)) {
                t = s.isArray(t) ? t : [t], i = s.isArray(i) ? i : [i];
                for (var a = n.prototype.config, r = a._f || (a._f = {}), l = 0, c = t.length; l < c; l++) (a[t[l]] === e || s.isFunction(a[t[l]])) && (a[t[l]] = o);
                for (var d = 0, u = i.length; d < u; d++) r[i[d]] = t[0]
            }
        }, n.prototype.config = {
            name: "lazy",
            chainable: !0,
            autoDestroy: !0,
            bind: "load",
            threshold: 500,
            visibleOnly: !1,
            appendScroll: t,
            scrollDirection: "both",
            imageBase: null,
            defaultImage: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            placeholder: null,
            delay: -1,
            combined: !1,
            attribute: "data-src",
            srcsetAttribute: "data-srcset",
            sizesAttribute: "data-sizes",
            retinaAttribute: "data-retina",
            loaderAttribute: "data-loader",
            imageBaseAttribute: "data-imagebase",
            removeAttribute: !0,
            handledName: "handled",
            loadedName: "loaded",
            effect: "show",
            effectTime: 0,
            enableThrottle: !0,
            throttle: 250,
            beforeLoad: e,
            afterLoad: e,
            onError: e,
            onFinishedAll: e
        }, s(t).on("load", function () {
            a = !0
        })
    }(window),
    function (t, e) {
        fontSpy = function (t, i) {
            var n = e("html"),
                s = e("body"),
                o = t;
            if ("string" != typeof o || "" === o) throw "A valid fontName is required. fontName must be a string and must not be an empty string.";
            var a = {
                font: o,
                fontClass: o.toLowerCase().replace(/\s/g, ""),
                success: function () {
                },
                failure: function () {
                },
                testFont: "Courier New",
                testString: "QW@HhsXJ",
                glyphs: "",
                delay: 50,
                timeOut: 1e3,
                callback: e.noop
            },
                r = e.extend(a, i),
                l = e("<span>" + r.testString + r.glyphs + "</span>").css("position", "absolute").css("top", "-9999px").css("left", "-9999px").css("visibility", "hidden").css("fontFamily", r.testFont).css("fontSize", "250px");
            s.append(l);
            var c = l.outerWidth();
            l.css("fontFamily", r.font + "," + r.testFont);
            var d = function () {
                n.addClass("no-" + r.fontClass), r && r.failure && r.failure(), r.callback(new Error("FontSpy timeout")), l.remove()
            },
                u = function () {
                    r.callback(), n.addClass(r.fontClass), r && r.success && r.success(), l.remove()
                },
                h = function () {
                    setTimeout(p, r.delay), r.timeOut = r.timeOut - r.delay
                },
                p = function () {
                    var t = l.outerWidth();
                    c !== t ? u() : r.timeOut < 0 ? d() : h()
                };
            p()
        }
    }(0, jQuery),
    function (t) {
        "function" == typeof define && define.amd && define.amd.jQuery ? define(["jquery"], t) : t("undefined" != typeof module && module.exports ? require("jquery") : jQuery)
    }(function (t) {
        "use strict";

        function e(e) {
            return !e || void 0 !== e.allowPageScroll || void 0 === e.swipe && void 0 === e.swipeStatus || (e.allowPageScroll = c), void 0 !== e.click && void 0 === e.tap && (e.tap = e.click), e || (e = {}), e = t.extend({}, t.fn.swipe.defaults, e), this.each(function () {
                var n = t(this),
                    s = n.data(I);
                s || (s = new i(this, e), n.data(I, s))
            })
        }

        function i(e, i) {
            function D(e) {
                if (!(ct() || t(e.target).closest(i.excludedElements, Ut).length > 0)) {
                    var n = e.originalEvent ? e.originalEvent : e;
                    if (!n.pointerType || "mouse" != n.pointerType || 0 != i.fallbackToMouseEvents) {
                        var s, o = n.touches,
                            a = o ? o[0] : n;
                        return Yt = b, o ? Kt = o.length : !1 !== i.preventDefaultEvents && e.preventDefault(), Ot = 0, Nt = null, Lt = null, Bt = null, zt = 0, Ft = 0, Ht = 0, Wt = 1, Rt = 0, qt = gt(), rt(), ut(0, a), !o || Kt === i.fingers || i.fingers === _ || B() ? (Qt = St(), 2 == Kt && (ut(1, o[1]), Ft = Ht = yt(Vt[0].start, Vt[1].start)), (i.swipeStatus || i.pinchStatus) && (s = O(n, Yt))) : s = !1, !1 === s ? (Yt = C, O(n, Yt), s) : (i.hold && (ee = setTimeout(t.proxy(function () {
                            Ut.trigger("hold", [n.target]), i.hold && (s = i.hold.call(Ut, n, n.target))
                        }, this), i.longTapThreshold)), dt(!0), null)
                    }
                }
            }

            function E(t) {
                var e = t.originalEvent ? t.originalEvent : t;
                if (Yt !== x && Yt !== C && !lt()) {
                    var n, s = e.touches,
                        o = s ? s[0] : e,
                        a = ht(o);
                    if (Zt = St(), s && (Kt = s.length), i.hold && clearTimeout(ee), Yt = w, 2 == Kt && (0 == Ft ? (ut(1, s[1]), Ft = Ht = yt(Vt[0].start, Vt[1].start)) : (ht(s[1]), Ht = yt(Vt[0].end, Vt[1].end), Bt = wt(Vt[0].end, Vt[1].end)), Wt = bt(Ft, Ht), Rt = Math.abs(Ft - Ht)), Kt === i.fingers || i.fingers === _ || !s || B()) {
                        if (Nt = kt(a.start, a.end), Lt = kt(a.last, a.end), W(t, Lt), Ot = xt(a.start, a.end), zt = _t(), ft(Nt, Ot), n = O(e, Yt), !i.triggerOnTouchEnd || i.triggerOnTouchLeave) {
                            var r = !0;
                            if (i.triggerOnTouchLeave) {
                                var l = Tt(this);
                                r = It(a.end, l)
                            }
                            !i.triggerOnTouchEnd && r ? Yt = $(w) : i.triggerOnTouchLeave && !r && (Yt = $(x)), Yt != C && Yt != x || O(e, Yt)
                        }
                    } else Yt = C, O(e, Yt);
                    !1 === n && (Yt = C, O(e, Yt))
                }
            }

            function A(t) {
                var e = t.originalEvent ? t.originalEvent : t,
                    n = e.touches;
                if (n) {
                    if (n.length && !lt()) return at(e), !0;
                    if (n.length && lt()) return !0
                }
                return lt() && (Kt = Xt), Zt = St(), zt = _t(), z() || !L() ? (Yt = C, O(e, Yt)) : i.triggerOnTouchEnd || !1 === i.triggerOnTouchEnd && Yt === w ? (!1 !== i.preventDefaultEvents && !1 !== t.cancelable && t.preventDefault(), Yt = x, O(e, Yt)) : !i.triggerOnTouchEnd && Z() ? (Yt = x, N(e, Yt, p)) : Yt === w && (Yt = C, O(e, Yt)), dt(!1), null
            }

            function P() {
                Kt = 0, Zt = 0, Qt = 0, Ft = 0, Ht = 0, Wt = 1, rt(), dt(!1)
            }

            function M(t) {
                var e = t.originalEvent ? t.originalEvent : t;
                i.triggerOnTouchLeave && (Yt = $(x), O(e, Yt))
            }

            function j() {
                Ut.off(At, D), Ut.off($t, P), Ut.off(Pt, E), Ut.off(Mt, A), jt && Ut.off(jt, M), dt(!1)
            }

            function $(t) {
                var e = t,
                    n = H(),
                    s = L(),
                    o = z();
                return !n || o ? e = C : !s || t != w || i.triggerOnTouchEnd && !i.triggerOnTouchLeave ? !s && t == x && i.triggerOnTouchLeave && (e = C) : e = x, e
            }

            function O(t, e) {
                var i, n = t.touches;
                return (K() || Y()) && (i = N(t, e, u)), (q() || B()) && !1 !== i && (i = N(t, e, h)), st() && !1 !== i ? i = N(t, e, f) : ot() && !1 !== i ? i = N(t, e, m) : nt() && !1 !== i && (i = N(t, e, p)), e === C && P(t), e === x && (n ? n.length || P(t) : P(t)), i
            }

            function N(e, c, d) {
                var g;
                if (d == u) {
                    if (Ut.trigger("swipeStatus", [c, Nt || null, Ot || 0, zt || 0, Kt, Vt, Lt]), i.swipeStatus && !1 === (g = i.swipeStatus.call(Ut, e, c, Nt || null, Ot || 0, zt || 0, Kt, Vt, Lt))) return !1;
                    if (c == x && U()) {
                        if (clearTimeout(te), clearTimeout(ee), Ut.trigger("swipe", [Nt, Ot, zt, Kt, Vt, Lt]), i.swipe && !1 === (g = i.swipe.call(Ut, e, Nt, Ot, zt, Kt, Vt, Lt))) return !1;
                        switch (Nt) {
                            case n:
                                Ut.trigger("swipeLeft", [Nt, Ot, zt, Kt, Vt, Lt]), i.swipeLeft && (g = i.swipeLeft.call(Ut, e, Nt, Ot, zt, Kt, Vt, Lt));
                                break;
                            case s:
                                Ut.trigger("swipeRight", [Nt, Ot, zt, Kt, Vt, Lt]), i.swipeRight && (g = i.swipeRight.call(Ut, e, Nt, Ot, zt, Kt, Vt, Lt));
                                break;
                            case o:
                                Ut.trigger("swipeUp", [Nt, Ot, zt, Kt, Vt, Lt]), i.swipeUp && (g = i.swipeUp.call(Ut, e, Nt, Ot, zt, Kt, Vt, Lt));
                                break;
                            case a:
                                Ut.trigger("swipeDown", [Nt, Ot, zt, Kt, Vt, Lt]), i.swipeDown && (g = i.swipeDown.call(Ut, e, Nt, Ot, zt, Kt, Vt, Lt))
                        }
                    }
                }
                if (d == h) {
                    if (Ut.trigger("pinchStatus", [c, Bt || null, Rt || 0, zt || 0, Kt, Wt, Vt]), i.pinchStatus && !1 === (g = i.pinchStatus.call(Ut, e, c, Bt || null, Rt || 0, zt || 0, Kt, Wt, Vt))) return !1;
                    if (c == x && R()) switch (Bt) {
                        case r:
                            Ut.trigger("pinchIn", [Bt || null, Rt || 0, zt || 0, Kt, Wt, Vt]), i.pinchIn && (g = i.pinchIn.call(Ut, e, Bt || null, Rt || 0, zt || 0, Kt, Wt, Vt));
                            break;
                        case l:
                            Ut.trigger("pinchOut", [Bt || null, Rt || 0, zt || 0, Kt, Wt, Vt]), i.pinchOut && (g = i.pinchOut.call(Ut, e, Bt || null, Rt || 0, zt || 0, Kt, Wt, Vt))
                    }
                }
                return d == p ? c !== C && c !== x || (clearTimeout(te), clearTimeout(ee), G() && !tt() ? (Jt = St(), te = setTimeout(t.proxy(function () {
                    Jt = null, Ut.trigger("tap", [e.target]), i.tap && (g = i.tap.call(Ut, e, e.target))
                }, this), i.doubleTapThreshold)) : (Jt = null, Ut.trigger("tap", [e.target]), i.tap && (g = i.tap.call(Ut, e, e.target)))) : d == f ? c !== C && c !== x || (clearTimeout(te), clearTimeout(ee), Jt = null, Ut.trigger("doubletap", [e.target]), i.doubleTap && (g = i.doubleTap.call(Ut, e, e.target))) : d == m && (c !== C && c !== x || (clearTimeout(te), Jt = null, Ut.trigger("longtap", [e.target]), i.longTap && (g = i.longTap.call(Ut, e, e.target)))), g
            }

            function L() {
                var t = !0;
                return null !== i.threshold && (t = Ot >= i.threshold), t
            }

            function z() {
                var t = !1;
                return null !== i.cancelThreshold && null !== Nt && (t = mt(Nt) - Ot >= i.cancelThreshold), t
            }

            function F() {
                return null === i.pinchThreshold || Rt >= i.pinchThreshold
            }

            function H() {
                return !i.maxTimeThreshold || !(zt >= i.maxTimeThreshold)
            }

            function W(t, e) {
                if (!1 !== i.preventDefaultEvents)
                    if (i.allowPageScroll === c) t.preventDefault();
                    else {
                        var r = i.allowPageScroll === d;
                        switch (e) {
                            case n:
                                (i.swipeLeft && r || !r && i.allowPageScroll != g) && t.preventDefault();
                                break;
                            case s:
                                (i.swipeRight && r || !r && i.allowPageScroll != g) && t.preventDefault();
                                break;
                            case o:
                                (i.swipeUp && r || !r && i.allowPageScroll != v) && t.preventDefault();
                                break;
                            case a:
                                (i.swipeDown && r || !r && i.allowPageScroll != v) && t.preventDefault()
                        }
                    }
            }

            function R() {
                var t = V(),
                    e = Q(),
                    i = F();
                return t && e && i
            }

            function B() {
                return !!(i.pinchStatus || i.pinchIn || i.pinchOut)
            }

            function q() {
                return !(!R() || !B())
            }

            function U() {
                var t = H(),
                    e = L(),
                    i = V(),
                    n = Q();
                return !z() && n && i && e && t
            }

            function Y() {
                return !!(i.swipe || i.swipeStatus || i.swipeLeft || i.swipeRight || i.swipeUp || i.swipeDown)
            }

            function K() {
                return !(!U() || !Y())
            }

            function V() {
                return Kt === i.fingers || i.fingers === _ || !k
            }

            function Q() {
                return 0 !== Vt[0].end.x
            }

            function Z() {
                return !!i.tap
            }

            function G() {
                return !!i.doubleTap
            }

            function X() {
                return !!i.longTap
            }

            function J() {
                if (null == Jt) return !1;
                var t = St();
                return G() && t - Jt <= i.doubleTapThreshold
            }

            function tt() {
                return J()
            }

            function et() {
                return (1 === Kt || !k) && (isNaN(Ot) || Ot < i.threshold)
            }

            function it() {
                return zt > i.longTapThreshold && y > Ot
            }

            function nt() {
                return !(!et() || !Z())
            }

            function st() {
                return !(!J() || !G())
            }

            function ot() {
                return !(!it() || !X())
            }

            function at(t) {
                Gt = St(), Xt = t.touches.length + 1
            }

            function rt() {
                Gt = 0, Xt = 0
            }

            function lt() {
                var t = !1;
                if (Gt) {
                    St() - Gt <= i.fingerReleaseThreshold && (t = !0)
                }
                return t
            }

            function ct() {
                return !(!0 !== Ut.data(I + "_intouch"))
            }

            function dt(t) {
                Ut && (!0 === t ? (Ut.on(Pt, E), Ut.on(Mt, A), jt && Ut.on(jt, M)) : (Ut.off(Pt, E, !1), Ut.off(Mt, A, !1), jt && Ut.off(jt, M, !1)), Ut.data(I + "_intouch", !0 === t))
            }

            function ut(t, e) {
                var i = {
                    start: {
                        x: 0,
                        y: 0
                    },
                    last: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    }
                };
                return i.start.x = i.last.x = i.end.x = e.pageX || e.clientX, i.start.y = i.last.y = i.end.y = e.pageY || e.clientY, Vt[t] = i, i
            }

            function ht(t) {
                var e = void 0 !== t.identifier ? t.identifier : 0,
                    i = pt(e);
                return null === i && (i = ut(e, t)), i.last.x = i.end.x, i.last.y = i.end.y, i.end.x = t.pageX || t.clientX, i.end.y = t.pageY || t.clientY, i
            }

            function pt(t) {
                return Vt[t] || null
            }

            function ft(t, e) {
                t != c && (e = Math.max(e, mt(t)), qt[t].distance = e)
            }

            function mt(t) {
                return qt[t] ? qt[t].distance : void 0
            }

            function gt() {
                var t = {};
                return t[n] = vt(n), t[s] = vt(s), t[o] = vt(o), t[a] = vt(a), t
            }

            function vt(t) {
                return {
                    direction: t,
                    distance: 0
                }
            }

            function _t() {
                return Zt - Qt
            }

            function yt(t, e) {
                var i = Math.abs(t.x - e.x),
                    n = Math.abs(t.y - e.y);
                return Math.round(Math.sqrt(i * i + n * n))
            }

            function bt(t, e) {
                return (e / t * 1).toFixed(2)
            }

            function wt() {
                return 1 > Wt ? l : r
            }

            function xt(t, e) {
                return Math.round(Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2)))
            }

            function Ct(t, e) {
                var i = t.x - e.x,
                    n = e.y - t.y,
                    s = Math.atan2(n, i),
                    o = Math.round(180 * s / Math.PI);
                return 0 > o && (o = 360 - Math.abs(o)), o
            }

            function kt(t, e) {
                if (Dt(t, e)) return c;
                var i = Ct(t, e);
                return 45 >= i && i >= 0 ? n : 360 >= i && i >= 315 ? n : i >= 135 && 225 >= i ? s : i > 45 && 135 > i ? a : o
            }

            function St() {
                return (new Date).getTime()
            }

            function Tt(e) {
                e = t(e);
                var i = e.offset();
                return {
                    left: i.left,
                    right: i.left + e.outerWidth(),
                    top: i.top,
                    bottom: i.top + e.outerHeight()
                }
            }

            function It(t, e) {
                return t.x > e.left && t.x < e.right && t.y > e.top && t.y < e.bottom
            }

            function Dt(t, e) {
                return t.x == e.x && t.y == e.y
            }

            var i = t.extend({}, i),
                Et = k || T || !i.fallbackToMouseEvents,
                At = Et ? T ? S ? "MSPointerDown" : "pointerdown" : "touchstart" : "mousedown",
                Pt = Et ? T ? S ? "MSPointerMove" : "pointermove" : "touchmove" : "mousemove",
                Mt = Et ? T ? S ? "MSPointerUp" : "pointerup" : "touchend" : "mouseup",
                jt = Et ? T ? "mouseleave" : null : "mouseleave",
                $t = T ? S ? "MSPointerCancel" : "pointercancel" : "touchcancel",
                Ot = 0,
                Nt = null,
                Lt = null,
                zt = 0,
                Ft = 0,
                Ht = 0,
                Wt = 1,
                Rt = 0,
                Bt = 0,
                qt = null,
                Ut = t(e),
                Yt = "start",
                Kt = 0,
                Vt = {},
                Qt = 0,
                Zt = 0,
                Gt = 0,
                Xt = 0,
                Jt = 0,
                te = null,
                ee = null;
            try {
                Ut.on(At, D), Ut.on($t, P)
            } catch (e) {
                t.error("events not supported " + At + "," + $t + " on jQuery.swipe")
            }
            this.enable = function () {
                return this.disable(), Ut.on(At, D), Ut.on($t, P), Ut
            }, this.disable = function () {
                return j(), Ut
            }, this.destroy = function () {
                j(), Ut.data(I, null), Ut = null
            }, this.option = function (e, n) {
                if ("object" == typeof e) i = t.extend(i, e);
                else if (void 0 !== i[e]) {
                    if (void 0 === n) return i[e];
                    i[e] = n
                } else {
                    if (!e) return i;
                    t.error("Option " + e + " does not exist on jQuery.swipe.options")
                }
                return null
            }
        }

        var n = "left",
            s = "right",
            o = "up",
            a = "down",
            r = "in",
            l = "out",
            c = "none",
            d = "auto",
            u = "swipe",
            h = "pinch",
            p = "tap",
            f = "doubletap",
            m = "longtap",
            g = "horizontal",
            v = "vertical",
            _ = "all",
            y = 10,
            b = "start",
            w = "move",
            x = "end",
            C = "cancel",
            k = "ontouchstart" in window,
            S = window.navigator.msPointerEnabled && !window.PointerEvent && !k,
            T = (window.PointerEvent || window.navigator.msPointerEnabled) && !k,
            I = "TouchSwipe",
            D = {
                fingers: 1,
                threshold: 75,
                cancelThreshold: null,
                pinchThreshold: 20,
                maxTimeThreshold: null,
                fingerReleaseThreshold: 250,
                longTapThreshold: 500,
                doubleTapThreshold: 200,
                swipe: null,
                swipeLeft: null,
                swipeRight: null,
                swipeUp: null,
                swipeDown: null,
                swipeStatus: null,
                pinchIn: null,
                pinchOut: null,
                pinchStatus: null,
                click: null,
                tap: null,
                doubleTap: null,
                longTap: null,
                hold: null,
                triggerOnTouchEnd: !0,
                triggerOnTouchLeave: !1,
                allowPageScroll: "auto",
                fallbackToMouseEvents: !0,
                excludedElements: ".noSwipe",
                preventDefaultEvents: !0
            };
        t.fn.swipe = function (i) {
            var n = t(this),
                s = n.data(I);
            if (s && "string" == typeof i) {
                if (s[i]) return s[i].apply(s, Array.prototype.slice.call(arguments, 1));
                t.error("Method " + i + " does not exist on jQuery.swipe")
            } else if (s && "object" == typeof i) s.option.apply(s, arguments);
            else if (!(s || "object" != typeof i && i)) return e.apply(this, arguments);
            return n
        }, t.fn.swipe.version = "1.6.18", t.fn.swipe.defaults = D, t.fn.swipe.phases = {
            PHASE_START: b,
            PHASE_MOVE: w,
            PHASE_END: x,
            PHASE_CANCEL: C
        }, t.fn.swipe.directions = {
            LEFT: n,
            RIGHT: s,
            UP: o,
            DOWN: a,
            IN: r,
            OUT: l
        }, t.fn.swipe.pageScroll = {
            NONE: c,
            HORIZONTAL: g,
            VERTICAL: v,
            AUTO: d
        }, t.fn.swipe.fingers = {
            ONE: 1,
            TWO: 2,
            THREE: 3,
            FOUR: 4,
            FIVE: 5,
            ALL: _
        }
    }),
    function (t) {
        t.fn.lazyLoad = function (e, i) {
            function n() {
                null !== a.hash && (t.isArray(a.hash) || (a.hash = [a.hash])), t.fn.lazyLoad.call(r, a.state), o()
            }

            function s() {
                if (a.stopped) return void (this.onscroll = null);
                if (!a.stopped && !a.loading && c(l, r) <= a.distance) {
                    if (null !== a.hash) {
                        var t = location.hash.replace(/^[^#]*#\/*/, "").split("/")[0];
                        if (-1 === a.hash.indexOf(t)) return void (this.onscroll = null)
                    }
                    a.load()
                }
            }

            function o() {
                var t, e = 350,
                    i = setTimeout(t = function () {
                        if (a.stopped) return void clearTimeout(i);
                        if (null !== a.hash) {
                            var n = location.hash.replace(/^[^#]*#\/*/, "").split("/")[0];
                            if (-1 === a.hash.indexOf(n)) return void clearTimeout(i)
                        }
                        if (a.loading) i = setTimeout(t, e);
                        else {
                            c(l, r);
                            c(l, r) <= a.distance ? (a.load(), i = setTimeout(t, e)) : (r.get(0).onscroll = s, clearTimeout(i))
                        }
                    }, e)
            }

            if ("stop" == e) {
                var a = this.data("lazyLoadSettings");
                return void (a && (a.stopped = !0))
            }
            if ("reload" == e) {
                var a = this.data("lazyLoadSettings");
                return void (a && (a.stopped = !1, a.loading = !1, this.get(0).onscroll = null, this.lazyLoad(a)))
            }
            if ("sleep" == e) {
                var a = this.data("lazyLoadSettings");
                return void (a && (a.loading = !0))
            }
            if ("wake" == e) {
                var a = this.data("lazyLoadSettings");
                return void (a && (a.loading = !1))
            }
            if ("force" == e) {
                var a = this.data("lazyLoadSettings");
                return void (a && (a.loading || a.load()))
            }
            if ("get" === e) {
                var a = this.data("lazyLoadSettings") || {};
                return a[i]
            }
            this.data("lazyLoadSettings", t.extend({
                distance: 50,
                load: function () {
                },
                container: l,
                state: "wake",
                hash: location.hash.replace(/^[^#]*#\/*/, "").split("/")[0] || null,
                distanceBetweenBottoms: null
            }, e || {}));
            var a = this.data("lazyLoadSettings");
            a.loading = !1, a.stopped = !1;
            var r = t(window),
                l = a.container || t(this);
            n();
            var c = "function" == typeof a.distanceBetweenBottoms ? a.distanceBetweenBottoms : function (e, i, n) {
                return e = "string" == typeof e ? t(e) : e, n = n || 0, e.position().top + e.outerHeight() - n - (i.scrollTop() + i.height())
            }
        }
    }(jQuery),
    function (t, e) {
        function i(e, i) {
            var s = e.nodeName.toLowerCase();
            if ("area" === s) {
                var o, a = e.parentNode,
                    r = a.name;
                return !(!e.href || !r || "map" !== a.nodeName.toLowerCase()) && (!!(o = t("img[usemap=#" + r + "]")[0]) && n(o))
            }
            return (/input|select|textarea|button|object/.test(s) ? !e.disabled : "a" == s ? e.href || i : i) && n(e)
        }

        function n(e) {
            return !t(e).parents().andSelf().filter(function () {
                return "hidden" === t.curCSS(this, "visibility") || t.expr.filters.hidden(this)
            }).length
        }

        t.ui = t.ui || {}, t.ui.version || (t.extend(t.ui, {
            version: "1.8.24",
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            }
        }), t.fn.extend({
            propAttr: t.fn.prop || t.fn.attr,
            _focus: t.fn.focus,
            focus: function (e, i) {
                return "number" == typeof e ? this.each(function () {
                    var n = this;
                    setTimeout(function () {
                        t(n).focus(), i && i.call(n)
                    }, e)
                }) : this._focus.apply(this, arguments)
            },
            scrollParent: function () {
                var e;
                return e = t.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
                    return /(relative|absolute|fixed)/.test(t.curCSS(this, "position", 1)) && /(auto|scroll)/.test(t.curCSS(this, "overflow", 1) + t.curCSS(this, "overflow-y", 1) + t.curCSS(this, "overflow-x", 1))
                }).eq(0) : this.parents().filter(function () {
                    return /(auto|scroll)/.test(t.curCSS(this, "overflow", 1) + t.curCSS(this, "overflow-y", 1) + t.curCSS(this, "overflow-x", 1))
                }).eq(0), /fixed/.test(this.css("position")) || !e.length ? t(document) : e
            },
            zIndex: function (i) {
                if (i !== e) return this.css("zIndex", i);
                if (this.length)
                    for (var n, s, o = t(this[0]); o.length && o[0] !== document;) {
                        if (("absolute" === (n = o.css("position")) || "relative" === n || "fixed" === n) && (s = parseInt(o.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;
                        o = o.parent()
                    }
                return 0
            },
            disableSelection: function () {
                return this.bind((t.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (t) {
                    t.preventDefault()
                })
            },
            enableSelection: function () {
                return this.unbind(".ui-disableSelection")
            }
        }), t("<a>").outerWidth(1).jquery || t.each(["Width", "Height"], function (i, n) {
            function s(e, i, n, s) {
                return t.each(o, function () {
                    i -= parseFloat(t.curCSS(e, "padding" + this, !0)) || 0, n && (i -= parseFloat(t.curCSS(e, "border" + this + "Width", !0)) || 0), s && (i -= parseFloat(t.curCSS(e, "margin" + this, !0)) || 0)
                }), i
            }

            var o = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
                a = n.toLowerCase(),
                r = {
                    innerWidth: t.fn.innerWidth,
                    innerHeight: t.fn.innerHeight,
                    outerWidth: t.fn.outerWidth,
                    outerHeight: t.fn.outerHeight
                };
            t.fn["inner" + n] = function (i) {
                return i === e ? r["inner" + n].call(this) : this.each(function () {
                    t(this).css(a, s(this, i) + "px")
                })
            }, t.fn["outer" + n] = function (e, i) {
                return "number" != typeof e ? r["outer" + n].call(this, e) : this.each(function () {
                    t(this).css(a, s(this, e, !0, i) + "px")
                })
            }
        }), t.extend(t.expr[":"], {
            data: t.expr.createPseudo ? t.expr.createPseudo(function (e) {
                return function (i) {
                    return !!t.data(i, e)
                }
            }) : function (e, i, n) {
                return !!t.data(e, n[3])
            },
            focusable: function (e) {
                return i(e, !isNaN(t.attr(e, "tabindex")))
            },
            tabbable: function (e) {
                var n = t.attr(e, "tabindex"),
                    s = isNaN(n);
                return (s || n >= 0) && i(e, !s)
            }
        }), t(function () {
            var e = document.body,
                i = e.appendChild(i = document.createElement("div"));
            i.offsetHeight, t.extend(i.style, {
                minHeight: "100px",
                height: "auto",
                padding: 0,
                borderWidth: 0
            }), t.support.minHeight = 100 === i.offsetHeight, t.support.selectstart = "onselectstart" in i, e.removeChild(i).style.display = "none"
        }), t.curCSS || (t.curCSS = t.css), t.extend(t.ui, {
            plugin: {
                add: function (e, i, n) {
                    var s = t.ui[e].prototype;
                    for (var o in n) s.plugins[o] = s.plugins[o] || [], s.plugins[o].push([i, n[o]])
                },
                call: function (t, e, i) {
                    var n = t.plugins[e];
                    if (n && t.element[0].parentNode)
                        for (var s = 0; s < n.length; s++) t.options[n[s][0]] && n[s][1].apply(t.element, i)
                }
            },
            contains: function (t, e) {
                return document.compareDocumentPosition ? 16 & t.compareDocumentPosition(e) : t !== e && t.contains(e)
            },
            hasScroll: function (e, i) {
                if ("hidden" === t(e).css("overflow")) return !1;
                var n = i && "left" === i ? "scrollLeft" : "scrollTop",
                    s = !1;
                return e[n] > 0 || (e[n] = 1, s = e[n] > 0, e[n] = 0, s)
            },
            isOverAxis: function (t, e, i) {
                return t > e && t < e + i
            },
            isOver: function (e, i, n, s, o, a) {
                return t.ui.isOverAxis(e, n, o) && t.ui.isOverAxis(i, s, a)
            }
        }))
    }(jQuery),
    function (t, e) {
        if (t.cleanData) {
            var i = t.cleanData;
            t.cleanData = function (e) {
                for (var n, s = 0; null != (n = e[s]); s++) try {
                    t(n).triggerHandler("remove")
                } catch (t) {
                }
                i(e)
            }
        } else {
            var n = t.fn.remove;
            t.fn.remove = function (e, i) {
                return this.each(function () {
                    return i || (!e || t.filter(e, [this]).length) && t("*", this).add([this]).each(function () {
                        try {
                            t(this).triggerHandler("remove")
                        } catch (t) {
                        }
                    }), n.call(t(this), e, i)
                })
            }
        }
        t.widget = function (e, i, n) {
            var s, o = e.split(".")[0];
            e = e.split(".")[1], s = o + "-" + e, n || (n = i, i = t.Widget), t.expr[":"][s] = function (i) {
                return !!t.data(i, e)
            }, t[o] = t[o] || {}, t[o][e] = function (t, e) {
                arguments.length && this._createWidget(t, e)
            };
            var a = new i;
            a.options = t.extend(!0, {}, a.options), t[o][e].prototype = t.extend(!0, a, {
                namespace: o,
                widgetName: e,
                widgetEventPrefix: t[o][e].prototype.widgetEventPrefix || e,
                widgetBaseClass: s
            }, n), t.widget.bridge(e, t[o][e])
        }, t.widget.bridge = function (i, n) {
            t.fn[i] = function (s) {
                var o = "string" == typeof s,
                    a = Array.prototype.slice.call(arguments, 1),
                    r = this;
                return s = !o && a.length ? t.extend.apply(null, [!0, s].concat(a)) : s, o && "_" === s.charAt(0) ? r : (o ? this.each(function () {
                    var n = t.data(this, i),
                        o = n && t.isFunction(n[s]) ? n[s].apply(n, a) : n;
                    if (o !== n && o !== e) return r = o, !1
                }) : this.each(function () {
                    var e = t.data(this, i);
                    e ? e.option(s || {})._init() : t.data(this, i, new n(s, this))
                }), r)
            }
        }, t.Widget = function (t, e) {
            arguments.length && this._createWidget(t, e)
        }, t.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            options: {
                disabled: !1
            },
            _createWidget: function (e, i) {
                t.data(i, this.widgetName, this), this.element = t(i), this.options = t.extend(!0, {}, this.options, this._getCreateOptions(), e);
                var n = this;
                this.element.bind("remove." + this.widgetName, function () {
                    n.destroy()
                }), this._create(), this._trigger("create"), this._init()
            },
            _getCreateOptions: function () {
                return t.metadata && t.metadata.get(this.element[0])[this.widgetName]
            },
            _create: function () {
            },
            _init: function () {
            },
            destroy: function () {
                this.element.unbind("." + this.widgetName).removeData(this.widgetName), this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
            },
            widget: function () {
                return this.element
            },
            option: function (i, n) {
                var s = i;
                if (0 === arguments.length) return t.extend({}, this.options);
                if ("string" == typeof i) {
                    if (n === e) return this.options[i];
                    s = {}, s[i] = n
                }
                return this._setOptions(s), this
            },
            _setOptions: function (e) {
                var i = this;
                return t.each(e, function (t, e) {
                    i._setOption(t, e)
                }), this
            },
            _setOption: function (t, e) {
                return this.options[t] = e, "disabled" === t && this.widget()[e ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", e), this
            },
            enable: function () {
                return this._setOption("disabled", !1)
            },
            disable: function () {
                return this._setOption("disabled", !0)
            },
            _trigger: function (e, i, n) {
                var s, o, a = this.options[e];
                if (n = n || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent, o)
                    for (s in o) s in i || (i[s] = o[s]);
                return this.element.trigger(i, n), !(t.isFunction(a) && !1 === a.call(this.element[0], i, n) || i.isDefaultPrevented())
            }
        }
    }(jQuery),
    function (t, e) {
        var i = !1;
        t(document).mouseup(function (t) {
            i = !1
        }), t.widget("ui.mouse", {
            options: {
                cancel: ":input,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function () {
                var e = this;
                this.element.bind("mousedown." + this.widgetName, function (t) {
                    return e._mouseDown(t)
                }).bind("click." + this.widgetName, function (i) {
                    if (!0 === t.data(i.target, e.widgetName + ".preventClickEvent")) return t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1
                }), this.started = !1
            },
            _mouseDestroy: function () {
                this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
            },
            _mouseDown: function (e) {
                if (!i) {
                    this._mouseStarted && this._mouseUp(e), this._mouseDownEvent = e;
                    var n = this,
                        s = 1 == e.which,
                        o = !("string" != typeof this.options.cancel || !e.target.nodeName) && t(e.target).closest(this.options.cancel).length;
                    return !(s && !o && this._mouseCapture(e)) || (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                        n.mouseDelayMet = !0
                    }, this.options.delay)), this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = !1 !== this._mouseStart(e), !this._mouseStarted) ? (e.preventDefault(), !0) : (!0 === t.data(e.target, this.widgetName + ".preventClickEvent") && t.removeData(e.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) {
                        return n._mouseMove(t)
                    }, this._mouseUpDelegate = function (t) {
                        return n._mouseUp(t)
                    }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), e.preventDefault(), i = !0, !0))
                }
            },
            _mouseMove: function (e) {
                return !t.browser.msie || document.documentMode >= 9 || e.button ? this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, e), this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted) : this._mouseUp(e)
            },
            _mouseUp: function (e) {
                return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target == this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), !1
            },
            _mouseDistanceMet: function (t) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
            },
            _mouseDelayMet: function (t) {
                return this.mouseDelayMet
            },
            _mouseStart: function (t) {
            },
            _mouseDrag: function (t) {
            },
            _mouseStop: function (t) {
            },
            _mouseCapture: function (t) {
                return !0
            }
        })
    }(jQuery),
    function (t) {
        t.widget("ui.slider", t.ui.mouse, {
            widgetEventPrefix: "slide",
            options: {
                animate: !1,
                distance: 0,
                max: 100,
                min: 0,
                orientation: "horizontal",
                range: !1,
                step: 1,
                value: 0,
                values: null
            },
            _create: function () {
                var e = this,
                    i = this.options;
                if (this._mouseSliding = this._keySliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-angle-all"), i.disabled && this.element.addClass("ui-slider-disabled ui-disabled"), this.range = t([]), i.range && (!0 === i.range ? (this.range = t("<div></div>"), i.values || (i.values = [this._valueMin(), this._valueMin()]), i.values.length && 2 !== i.values.length && (i.values = [i.values[0], i.values[0]])) : this.range = t("<div></div>"), this.range.appendTo(this.element).addClass("ui-slider-range"), "min" !== i.range && "max" !== i.range || this.range.addClass("ui-slider-range-" + i.range), this.range.addClass("ui-widget-header")), 0 === t(".ui-slider-handle", this.element).length && t("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle"), i.values && i.values.length)
                    for (; t(".ui-slider-handle", this.element).length < i.values.length;) t("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
                this.handles = t(".ui-slider-handle", this.element).addClass("ui-state-default ui-angle-all"), this.handle = this.handles.eq(0), this.handles.add(this.range).filter("a").click(function (t) {
                    t.preventDefault()
                }).hover(function () {
                    i.disabled || t(this).addClass("ui-state-hover")
                }, function () {
                    t(this).removeClass("ui-state-hover")
                }).focus(function () {
                    i.disabled ? t(this).blur() : (t(".ui-slider .ui-state-focus").removeClass("ui-state-focus"), t(this).addClass("ui-state-focus"))
                }).blur(function () {
                    t(this).removeClass("ui-state-focus")
                }), this.handles.each(function (e) {
                    t(this).data("index.ui-slider-handle", e)
                }), this.handles.keydown(function (i) {
                    var n, s, o, a = !0,
                        r = t(this).data("index.ui-slider-handle");
                    if (!e.options.disabled) {
                        switch (i.keyCode) {
                            case t.ui.keyCode.HOME:
                            case t.ui.keyCode.END:
                            case t.ui.keyCode.PAGE_UP:
                            case t.ui.keyCode.PAGE_DOWN:
                            case t.ui.keyCode.UP:
                            case t.ui.keyCode.RIGHT:
                            case t.ui.keyCode.DOWN:
                            case t.ui.keyCode.LEFT:
                                if (a = !1, !e._keySliding && (e._keySliding = !0, t(this).addClass("ui-state-active"), !1 === (n = e._start(i, r)))) return
                        }
                        switch (o = e.options.step, n = s = e.options.values && e.options.values.length ? e.values(r) : e.value(), i.keyCode) {
                            case t.ui.keyCode.HOME:
                                s = e._valueMin();
                                break;
                            case t.ui.keyCode.END:
                                s = e._valueMax();
                                break;
                            case t.ui.keyCode.PAGE_UP:
                                s = e._trimAlignValue(n + (e._valueMax() - e._valueMin()) / 5);
                                break;
                            case t.ui.keyCode.PAGE_DOWN:
                                s = e._trimAlignValue(n - (e._valueMax() - e._valueMin()) / 5);
                                break;
                            case t.ui.keyCode.UP:
                            case t.ui.keyCode.RIGHT:
                                if (n === e._valueMax()) return;
                                s = e._trimAlignValue(n + o);
                                break;
                            case t.ui.keyCode.DOWN:
                            case t.ui.keyCode.LEFT:
                                if (n === e._valueMin()) return;
                                s = e._trimAlignValue(n - o)
                        }
                        return e._slide(i, r, s), a
                    }
                }).keyup(function (i) {
                    var n = t(this).data("index.ui-slider-handle");
                    e._keySliding && (e._keySliding = !1, e._stop(i, n), e._change(i, n), t(this).removeClass("ui-state-active"))
                }), this._refreshValue(), this._animateOff = !1
            },
            destroy: function () {
                return this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-angle-all").removeData("slider").unbind(".slider"), this._mouseDestroy(), this
            },
            _mouseCapture: function (e) {
                var i, n, s, o, a, r, l = this.options;
                return !l.disabled && (this.elementSize = {
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight()
                }, this.elementOffset = this.element.offset(), i = {
                    x: e.pageX,
                    y: e.pageY
                }, n = this._normValueFromMouse(i), s = this._valueMax() - this._valueMin() + 1, a = this, this.handles.each(function (e) {
                    var i = Math.abs(n - a.values(e));
                    s > i && (s = i, o = t(this), r = e)
                }), !0 === l.range && this.values(1) === l.min && (r += 1, o = t(this.handles[r])), !1 !== this._start(e, r) && (this._mouseSliding = !0, a._handleIndex = r, o.addClass("ui-state-active").focus(), l = o.offset(), this._clickOffset = t(e.target).parents().andSelf().is(".ui-slider-handle") ? {
                    left: e.pageX - l.left - o.width() / 2,
                    top: e.pageY - l.top - o.height() / 2 - (parseInt(o.css("borderTopWidth"), 10) || 0) - (parseInt(o.css("borderBottomWidth"), 10) || 0) + (parseInt(o.css("marginTop"), 10) || 0)
                } : {
                    left: 0,
                    top: 0
                }, n = this._normValueFromMouse(i), this._slide(e, r, n), this._animateOff = !0))
            },
            _mouseStart: function () {
                return !0
            },
            _mouseDrag: function (t) {
                var e = this._normValueFromMouse({
                    x: t.pageX,
                    y: t.pageY
                });
                return this._slide(t, this._handleIndex, e), !1
            },
            _mouseStop: function (t) {
                return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(t, this._handleIndex), this._change(t, this._handleIndex), this._clickOffset = this._handleIndex = null, this._animateOff = !1
            },
            _detectOrientation: function () {
                this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
            },
            _normValueFromMouse: function (t) {
                var e;
                return "horizontal" === this.orientation ? (e = this.elementSize.width, t = t.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (e = this.elementSize.height, t = t.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), e = t / e, e > 1 && (e = 1), e < 0 && (e = 0), "vertical" === this.orientation && (e = 1 - e), t = this._valueMax() - this._valueMin(), this._trimAlignValue(this._valueMin() + e * t)
            },
            _start: function (t, e) {
                var i = {
                    handle: this.handles[e],
                    value: this.value()
                };
                return this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("start", t, i)
            },
            _slide: function (t, e, i) {
                var n;
                this.options.values && this.options.values.length ? (n = this.values(e ? 0 : 1), 2 === this.options.values.length && !0 === this.options.range && (0 === e && i > n || 1 === e && i < n) && (i = n), i !== this.values(e) && (n = this.values(), n[e] = i, t = this._trigger("slide", t, {
                    handle: this.handles[e],
                    value: i,
                    values: n
                }), this.values(e ? 0 : 1), !1 !== t && this.values(e, i, !0))) : i !== this.value() && !1 !== (t = this._trigger("slide", t, {
                    handle: this.handles[e],
                    value: i
                })) && this.value(i)
            },
            _stop: function (t, e) {
                var i = {
                    handle: this.handles[e],
                    value: this.value()
                };
                this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("stop", t, i)
            },
            _change: function (t, e) {
                if (!this._keySliding && !this._mouseSliding) {
                    var i = {
                        handle: this.handles[e],
                        value: this.value()
                    };
                    this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("change", t, i)
                }
            },
            value: function (t) {
                return arguments.length && (this.options.value = this._trimAlignValue(t), this._refreshValue(), this._change(null, 0)), this._value()
            },
            values: function (e, i) {
                var n, s, o;
                if (arguments.length > 1 && (this.options.values[e] = this._trimAlignValue(i), this._refreshValue(), this._change(null, e)), !arguments.length) return this._values();
                if (!t.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(e) : this.value();
                for (n = this.options.values, s = arguments[0], o = 0; o < n.length; o += 1) n[o] = this._trimAlignValue(s[o]), this._change(null, o);
                this._refreshValue()
            },
            _setOption: function (e, i) {
                var n, s = 0;
                switch (t.isArray(this.options.values) && (s = this.options.values.length), t.Widget.prototype._setOption.apply(this, arguments), e) {
                    case "disabled":
                        i ? (this.handles.filter(".ui-state-focus").blur(), this.handles.removeClass("ui-state-hover"), this.handles.attr("disabled", "disabled"), this.element.addClass("ui-disabled")) : (this.handles.removeAttr("disabled"), this.element.removeClass("ui-disabled"));
                        break;
                    case "orientation":
                        this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue();
                        break;
                    case "value":
                        this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                        break;
                    case "values":
                        for (this._animateOff = !0, this._refreshValue(), n = 0; n < s; n += 1) this._change(null, n);
                        this._animateOff = !1
                }
            },
            _value: function () {
                var t = this.options.value;
                return t = this._trimAlignValue(t)
            },
            _values: function (t) {
                var e, i;
                if (arguments.length) return e = this.options.values[t], e = this._trimAlignValue(e);
                for (e = this.options.values.slice(), i = 0; i < e.length; i += 1) e[i] = this._trimAlignValue(e[i]);
                return e
            },
            _trimAlignValue: function (t) {
                if (t < this._valueMin()) return this._valueMin();
                if (t > this._valueMax()) return this._valueMax();
                var e = this.options.step > 0 ? this.options.step : 1,
                    i = t % e;
                return t -= i, 2 * Math.abs(i) >= e && (t += i > 0 ? e : -e), parseFloat(t.toFixed(5))
            },
            _valueMin: function () {
                return this.options.min
            },
            _valueMax: function () {
                return this.options.max
            },
            _refreshValue: function () {
                var e, i, n, s, o, a = this.options.range,
                    r = this.options,
                    l = this,
                    c = !this._animateOff && r.animate,
                    d = {};
                this.options.values && this.options.values.length ? this.handles.each(function (n) {
                    e = (l.values(n) - l._valueMin()) / (l._valueMax() - l._valueMin()) * 100, d["horizontal" === l.orientation ? "left" : "bottom"] = e + "%", t(this).stop(1, 1)[c ? "animate" : "css"](d, r.animate), !0 === l.options.range && ("horizontal" === l.orientation ? (0 === n && l.range.stop(1, 1)[c ? "animate" : "css"]({
                        left: e + "%"
                    }, r.animate), 1 === n && l.range[c ? "animate" : "css"]({
                        width: e - i + "%"
                    }, {
                        queue: !1,
                        duration: r.animate
                    })) : (0 === n && l.range.stop(1, 1)[c ? "animate" : "css"]({
                        bottom: e + "%"
                    }, r.animate), 1 === n && l.range[c ? "animate" : "css"]({
                        height: e - i + "%"
                    }, {
                        queue: !1,
                        duration: r.animate
                    }))), i = e
                }) : (n = this.value(), s = this._valueMin(), o = this._valueMax(), e = o !== s ? (n - s) / (o - s) * 100 : 0, d["horizontal" === l.orientation ? "left" : "bottom"] = e + "%", this.handle.stop(1, 1)[c ? "animate" : "css"](d, r.animate), "min" === a && "horizontal" === this.orientation && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    width: e + "%"
                }, r.animate), "max" === a && "horizontal" === this.orientation && this.range[c ? "animate" : "css"]({
                    width: 100 - e + "%"
                }, {
                    queue: !1,
                    duration: r.animate
                }), "min" === a && "vertical" === this.orientation && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    height: e + "%"
                }, r.animate), "max" === a && "vertical" === this.orientation && this.range[c ? "animate" : "css"]({
                    height: 100 - e + "%"
                }, {
                    queue: !1,
                    duration: r.animate
                }))
            }
        }), t.extend(t.ui.slider, {
            version: "1.8.2"
        })
    }(jQuery),
    function (t) {
        function e(t, e) {
            if (!(t.originalEvent.touches.length > 1)) {
                t.preventDefault();
                var i = t.originalEvent.changedTouches[0],
                    n = document.createEvent("MouseEvents");
                n.initMouseEvent(e, !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), t.target.dispatchEvent(n)
            }
        }

        if (t.support.touch = "ontouchend" in document, t.support.touch) {
            var i, n = t.ui.mouse.prototype,
                s = n._mouseInit,
                o = n._mouseDestroy;
            n._touchStart = function (t) {
                var n = this;
                !i && n._mouseCapture(t.originalEvent.changedTouches[0]) && (i = !0, n._touchMoved = !1, e(t, "mouseover"), e(t, "mousemove"), e(t, "mousedown"))
            }, n._touchMove = function (t) {
                i && (this._touchMoved = !0, e(t, "mousemove"))
            }, n._touchEnd = function (t) {
                i && (e(t, "mouseup"), e(t, "mouseout"), this._touchMoved || e(t, "click"), i = !1)
            }, n._mouseInit = function () {
                var e = this;
                e.element.bind({
                    touchstart: t.proxy(e, "_touchStart"),
                    touchmove: t.proxy(e, "_touchMove"),
                    touchend: t.proxy(e, "_touchEnd")
                }), s.call(e)
            }, n._mouseDestroy = function () {
                var e = this;
                e.element.unbind({
                    touchstart: t.proxy(e, "_touchStart"),
                    touchmove: t.proxy(e, "_touchMove"),
                    touchend: t.proxy(e, "_touchEnd")
                }), o.call(e)
            }
        }
    }(jQuery),
    function (t) {
        var e = {
            url: !1,
            callback: !1,
            target: !1,
            duration: 120,
            on: "mouseover",
            touch: !0,
            onZoomIn: !1,
            onZoomOut: !1,
            magnify: 1
        };
        t.zoom = function (e, i, n, s) {
            var o, a, r, l, c, d, u, h = t(e),
                p = h.css("position"),
                f = t(i);
            return e.style.position = /(absolute|fixed)/.test(p) ? p : "relative", e.style.overflow = "hidden", n.style.width = n.style.height = "", t(n).addClass("zoomImg").css({
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0,
                width: n.width * s,
                height: n.height * s,
                border: "none",
                maxWidth: "none",
                maxHeight: "none"
            }).appendTo(e), {
                init: function () {
                    a = h.outerWidth(), o = h.outerHeight(), i === e ? (l = a, r = o) : (l = f.outerWidth(), r = f.outerHeight()), c = (n.width - a) / l, d = (n.height - o) / r, u = f.offset()
                },
                move: function (t) {
                    var e = t.pageX - u.left,
                        i = t.pageY - u.top;
                    i = Math.max(Math.min(i, r), 0), e = Math.max(Math.min(e, l), 0), n.style.left = e * -c + "px", n.style.top = i * -d + "px"
                }
            }
        }, t.fn.zoom = function (i) {
            return this.each(function () {
                var n = t.extend({}, e, i || {}),
                    s = n.target && t(n.target)[0] || this,
                    o = this,
                    a = t(o),
                    r = document.createElement("img"),
                    l = t(r),
                    c = "mousemove.zoom",
                    d = !1,
                    u = !1;
                if (!n.url) {
                    var h = o.querySelector("img");
                    if (h && (n.url = h.getAttribute("data-src") || h.currentSrc || h.src), !n.url) return
                }
                a.one("zoom.destroy", function (t, e) {
                    a.off(".zoom"), s.style.position = t, s.style.overflow = e, r.onload = null, l.remove()
                }.bind(this, s.style.position, s.style.overflow)), r.onload = function () {
                    function e(e) {
                        h.init(), h.move(e), l.stop().fadeTo(t.support.opacity ? n.duration : 0, 1, !!t.isFunction(n.onZoomIn) && n.onZoomIn.call(r))
                    }

                    function i() {
                        l.stop().fadeTo(n.duration, 0, !!t.isFunction(n.onZoomOut) && n.onZoomOut.call(r))
                    }

                    var h = t.zoom(s, o, r, n.magnify);
                    "grab" === n.on ? a.on("mousedown.zoom", function (n) {
                        1 === n.which && (t(document).one("mouseup.zoom", function () {
                            i(), t(document).off(c, h.move)
                        }), e(n), t(document).on(c, h.move), n.preventDefault())
                    }) : "click" === n.on ? a.on("click.zoom", function (n) {
                        return d ? void 0 : (d = !0, e(n), t(document).on(c, h.move), t(document).one("click.zoom", function () {
                            i(), d = !1, t(document).off(c, h.move)
                        }), !1)
                    }) : "toggle" === n.on ? a.on("click.zoom", function (t) {
                        d ? i() : e(t), d = !d
                    }) : "mouseover" === n.on && (h.init(), a.on("mouseenter.zoom", e).on("mouseleave.zoom", i).on(c, h.move)), n.touch && a.on("touchstart.zoom", function (t) {
                        t.preventDefault(), u ? (u = !1, i()) : (u = !0, e(t.originalEvent.touches[0] || t.originalEvent.changedTouches[0]))
                    }).on("touchmove.zoom", function (t) {
                        t.preventDefault(), h.move(t.originalEvent.touches[0] || t.originalEvent.changedTouches[0])
                    }).on("touchend.zoom", function (t) {
                        t.preventDefault(), u && (u = !1, i())
                    }), t.isFunction(n.callback) && n.callback.call(r)
                }, r.setAttribute("role", "presentation"), r.alt = "", r.src = n.url
            })
        }, t.fn.zoom.defaults = e
    }(window.jQuery),
    function (t, e, i, n) {
        i.swipebox = function (s, o) {
            var a, r, l = {
                useCSS: !0,
                useSVG: !0,
                initialIndexOnArray: 0,
                removeBarsOnMobile: !0,
                hideCloseButtonOnMobile: !1,
                hideBarsDelay: 3e3,
                videoMaxWidth: 1140,
                vimeoColor: "cccccc",
                beforeOpen: null,
                afterOpen: null,
                afterClose: null,
                nextSlide: null,
                prevSlide: null,
                loopAtEnd: !1,
                autoplayVideos: !1,
                queryStringData: {},
                toggleClassOnLoad: "",
                thumbs: !1
            },
                c = this,
                d = [],
                u = s.selector,
                h = i(u),
                p = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i),
                f = null !== p || e.createTouch !== n || "ontouchstart" in t || "onmsgesturechange" in t || navigator.msMaxTouchPoints,
                m = !!e.createElementNS && !!e.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
                g = t.innerWidth ? t.innerWidth : i(t).width(),
                v = t.innerHeight ? t.innerHeight : i(t).height(),
                _ = 0;
            c.settings = {}, i.swipebox.close = function () {
                a.closeSlide()
            }, i.swipebox.extend = function () {
                return a
            }, c.init = function () {
                c.settings = i.extend({}, l, o), i.isArray(s) ? (d = s, a.target = i(t), a.init(c.settings.initialIndexOnArray)) : i(e).on("click", u, function (t) {
                    if ("slide current" === t.target.parentNode.className) return !1;
                    i.isArray(s) || (a.destroy(), r = i(u), a.actions()), d = [];
                    var e, n, o;
                    o || (n = "data-rel", o = i(this).attr(n)), o || (n = "rel", o = i(this).attr(n)), r = o && "" !== o && "nofollow" !== o ? h.filter("[" + n + '="' + o + '"]') : i(u), r.each(function () {
                        var t = null,
                            e = null;
                        i(this).attr("title") && (t = i(this).attr("title")), i(this).attr("href") && (e = i(this).attr("href")), d.push({
                            href: e,
                            title: t
                        })
                    }), e = r.index(i(this)), t.preventDefault(), t.stopPropagation(), a.target = i(t.target), a.init(e)
                })
            }, a = {
                init: function (t) {
                    c.settings.beforeOpen && c.settings.beforeOpen(), this.target.trigger("swipebox-start"), i.swipebox.isOpen = !0, this.build(), this.openSlide(t), this.openMedia(t), this.preloadMedia(t + 1), this.preloadMedia(t - 1), c.settings.afterOpen && c.settings.afterOpen()
                },
                build: function () {
                    var t, e = this;
                    i("body").append('<div id="swipebox-overlay">\t\t\t\t\t<div id="swipebox-container">\t\t\t\t\t\t<div id="swipebox-slider"></div>\t\t\t\t\t\t<div id="swipebox-top-bar">\t\t\t\t\t\t\t<div id="swipebox-title"></div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div id="swipebox-bottom-bar">\t\t\t\t\t\t\t<div id="swipebox-arrows">\t\t\t\t\t\t\t\t<a id="swipebox-prev"></a>\t\t\t\t\t\t\t\t<a id="swipebox-next"></a>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<a id="swipebox-close"></a>\t\t\t\t\t</div>\t\t\t</div>'), m && !0 === c.settings.useSVG && (t = i("#swipebox-close").css("background-image"), t = t.replace("png", "svg"), i("#swipebox-prev, #swipebox-next, #swipebox-close").css({
                        "background-image": t
                    })), p && c.settings.removeBarsOnMobile && i("#swipebox-bottom-bar, #swipebox-top-bar").remove(), i.each(d, function (t) {
                        i("#swipebox-slider").append('<div data-index="' + t + '" class="slide"></div>')
                    }), e.setDim(), e.actions(), f && e.gesture(), e.keyboard(), e.animBars(), e.resize()
                },
                setDim: function () {
                    var e, n, s = {};
                    "onorientationchange" in t ? t.addEventListener("orientationchange", function () {
                        0 === t.orientation ? (e = g, n = v) : 90 !== t.orientation && -90 !== t.orientation || (e = v, n = g)
                    }, !1) : (e = t.innerWidth ? t.innerWidth : i(t).width(), n = t.innerHeight ? t.innerHeight : i(t).height()), s = {
                        width: e,
                        height: n
                    }, i("#swipebox-overlay").css(s)
                },
                resize: function () {
                    var e = this;
                    i(t).resize(function () {
                        e.setDim()
                    }).resize()
                },
                supportTransition: function () {
                    var t,
                        i = "transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");
                    for (t = 0; t < i.length; t++)
                        if (e.createElement("div").style[i[t]] !== n) return i[t];
                    return !1
                },
                doCssTrans: function () {
                    if (c.settings.useCSS && this.supportTransition()) return !0
                },
                gesture: function () {
                    var t, e, n, s, o, a, r = this,
                        l = !1,
                        c = !1,
                        u = 10,
                        h = 50,
                        p = {},
                        f = {},
                        m = i("#swipebox-top-bar, #swipebox-bottom-bar"),
                        v = i("#swipebox-slider");
                    m.addClass("visible-bars"), r.setTimeout(), i("body").bind("touchstart", function (r) {
                        return i(this).addClass("touching"), t = i("#swipebox-slider .slide").index(i("#swipebox-slider .slide.current")), f = r.originalEvent.targetTouches[0], p.pageX = r.originalEvent.targetTouches[0].pageX, p.pageY = r.originalEvent.targetTouches[0].pageY, i("#swipebox-slider").css({
                            "-webkit-transform": "translate3d(" + _ + "%, 0, 0)",
                            transform: "translate3d(" + _ + "%, 0, 0)"
                        }), i(".touching").bind("touchmove", function (r) {
                            if (r.preventDefault(), r.stopPropagation(), f = r.originalEvent.targetTouches[0], !c && (o = n, n = f.pageY - p.pageY, Math.abs(n) >= h || l)) {
                                var m = .75 - Math.abs(n) / v.height();
                                v.css({
                                    top: n + "px"
                                }), v.css({
                                    opacity: m
                                }), l = !0
                            }
                            s = e, e = f.pageX - p.pageX, a = 100 * e / g, !c && !l && Math.abs(e) >= u && (i("#swipebox-slider").css({
                                "-webkit-transition": "",
                                transition: ""
                            }), c = !0), c && (0 < e ? 0 === t ? i("#swipebox-overlay").addClass("leftSpringTouch") : (i("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"), i("#swipebox-slider").css({
                                "-webkit-transform": "translate3d(" + (_ + a) + "%, 0, 0)",
                                transform: "translate3d(" + (_ + a) + "%, 0, 0)"
                            })) : 0 > e && (d.length === t + 1 ? i("#swipebox-overlay").addClass("rightSpringTouch") : (i("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"), i("#swipebox-slider").css({
                                "-webkit-transform": "translate3d(" + (_ + a) + "%, 0, 0)",
                                transform: "translate3d(" + (_ + a) + "%, 0, 0)"
                            }))))
                        }), !1
                    }).bind("touchend", function (t) {
                        if (t.preventDefault(), t.stopPropagation(), i("#swipebox-slider").css({
                            "-webkit-transition": "-webkit-transform 0.4s ease",
                            transition: "transform 0.4s ease"
                        }), n = f.pageY - p.pageY, e = f.pageX - p.pageX, a = 100 * e / g, l)
                            if (l = !1, Math.abs(n) >= 2 * h && Math.abs(n) > Math.abs(o)) {
                                var d = n > 0 ? v.height() : -v.height();
                                v.animate({
                                    top: d + "px",
                                    opacity: 0
                                }, 300, function () {
                                    r.closeSlide()
                                })
                            } else v.animate({
                                top: 0,
                                opacity: 1
                            }, 300);
                        else c ? (c = !1, e >= u && e >= s ? r.getPrev() : e <= -u && e <= s && r.getNext()) : m.hasClass("visible-bars") ? (r.clearTimeout(), r.hideBars()) : (r.showBars(), r.setTimeout());
                        i("#swipebox-slider").css({
                            "-webkit-transform": "translate3d(" + _ + "%, 0, 0)",
                            transform: "translate3d(" + _ + "%, 0, 0)"
                        }), i("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"), i(".touching").off("touchmove").removeClass("touching")
                    })
                },
                setTimeout: function () {
                    if (c.settings.hideBarsDelay > 0) {
                        var e = this;
                        e.clearTimeout(), e.timeout = t.setTimeout(function () {
                            e.hideBars()
                        }, c.settings.hideBarsDelay)
                    }
                },
                clearTimeout: function () {
                    t.clearTimeout(this.timeout), this.timeout = null
                },
                showBars: function () {
                    var t = i("#swipebox-top-bar, #swipebox-bottom-bar");
                    this.doCssTrans() ? t.addClass("visible-bars") : (i("#swipebox-top-bar").animate({
                        top: 0
                    }, 500), i("#swipebox-bottom-bar").animate({
                        bottom: 0
                    }, 500), setTimeout(function () {
                        t.addClass("visible-bars")
                    }, 1e3))
                },
                hideBars: function () {
                    var t = i("#swipebox-top-bar, #swipebox-bottom-bar");
                    this.doCssTrans() ? t.removeClass("visible-bars") : (i("#swipebox-top-bar").animate({
                        top: "-50px"
                    }, 500), i("#swipebox-bottom-bar").animate({
                        bottom: "-50px"
                    }, 500), setTimeout(function () {
                        t.removeClass("visible-bars")
                    }, 1e3))
                },
                animBars: function () {
                    var t = this,
                        e = i("#swipebox-top-bar, #swipebox-bottom-bar");
                    e.addClass("visible-bars"), t.setTimeout(), i("#swipebox-slider").click(function () {
                        e.hasClass("visible-bars") || (t.showBars(), t.setTimeout())
                    }), i("#swipebox-bottom-bar").hover(function () {
                        t.showBars(), e.addClass("visible-bars"), t.clearTimeout()
                    }, function () {
                        c.settings.hideBarsDelay > 0 && (e.removeClass("visible-bars"), t.setTimeout())
                    })
                },
                keyboard: function () {
                    var e = this;
                    i(t).bind("keyup", function (t) {
                        t.preventDefault(), t.stopPropagation(), 37 === t.keyCode ? e.getPrev() : 39 === t.keyCode ? e.getNext() : 27 === t.keyCode && e.closeSlide()
                    })
                },
                actions: function () {
                    var t = this,
                        e = "touchend click";
                    d.length < 2 ? (i("#swipebox-bottom-bar").hide(), n === d[1] && i("#swipebox-top-bar").hide()) : (i("#swipebox-prev").bind(e, function (e) {
                        e.preventDefault(), e.stopPropagation(), t.getPrev(), t.setTimeout()
                    }), i("#swipebox-next").bind(e, function (e) {
                        e.preventDefault(), e.stopPropagation(), t.getNext(), t.setTimeout()
                    }), c.settings.thumbs && (d.forEach(function (e, i) {
                        t.preloadMedia(i)
                    }), i("body").on(e, ".js-swipebox-thumbs-el", function (e) {
                        e.preventDefault(), e.stopPropagation(), t.getThumb(i(this)), t.setTimeout()
                    }))), i("#swipebox-close").bind(e, function () {
                        t.closeSlide()
                    })
                },
                setSlide: function (t, e) {
                    e = e || !1;
                    var n = i("#swipebox-slider");
                    _ = 100 * -t, this.doCssTrans() ? n.css({
                        "-webkit-transform": "translate3d(" + 100 * -t + "%, 0, 0)",
                        transform: "translate3d(" + 100 * -t + "%, 0, 0)"
                    }) : n.animate({
                        left: 100 * -t + "%"
                    }), i("#swipebox-slider .slide").removeClass("current"), i("#swipebox-slider .slide").eq(t).addClass("current"), c.settings.thumbs && (i(".js-swipebox-thumbs-el").removeClass("active"), i('.js-swipebox-thumbs-el[data-index="' + t + '"]').addClass("active")), this.setTitle(t), e && n.fadeIn(), i("#swipebox-prev, #swipebox-next").removeClass("disabled"), 0 === t ? i("#swipebox-prev").addClass("disabled") : t === d.length - 1 && !0 !== c.settings.loopAtEnd && i("#swipebox-next").addClass("disabled")
                },
                openSlide: function (e) {
                    i("html").addClass("swipebox-html"), f ? (i("html").addClass("swipebox-touch"), c.settings.hideCloseButtonOnMobile && i("html").addClass("swipebox-no-close-button")) : i("html").addClass("swipebox-no-touch"), i(t).trigger("resize"), this.setSlide(e, !0)
                },
                preloadMedia: function (t) {
                    var e = this,
                        i = null;
                    d[t] !== n && (i = d[t].href), e.isVideo(i) ? e.openMedia(t) : setTimeout(function () {
                        e.openMedia(t)
                    }, 1e3)
                },
                openMedia: function (t) {
                    var e, s, o = this;
                    if (d[t] !== n && (e = d[t].href), t < 0 || t >= d.length) return !1;
                    s = i("#swipebox-slider .slide").eq(t), o.isVideo(e) ? s.html(o.getVideo(e)) : (s.addClass("slide-loading"), o.loadMedia(e, function () {
                        s.removeClass("slide-loading"), s.html(this)
                    }))
                },
                setTitle: function (t) {
                    var e = null;
                    i("#swipebox-title").empty(), d[t] !== n && (e = d[t].title), e ? (i("#swipebox-top-bar").show(), i("#swipebox-title").append(e)) : i("#swipebox-top-bar").hide()
                },
                isVideo: function (t) {
                    if (t) {
                        if (t.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || t.match(/vimeo\.com\/([0-9]*)/) || t.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || t.match(/youtube\.com\/([a-zA-Z0-9\-_]+)/)) return !0;
                        if (t.toLowerCase().indexOf("swipeboxvideo=1") >= 0) return !0
                    }
                },
                parseUri: function (t, n) {
                    var s = e.createElement("a"),
                        o = {};
                    return s.href = decodeURIComponent(t), s.search && (o = JSON.parse('{"' + s.search.toLowerCase().replace("?", "").replace(/&/g, '","').replace(/=/g, '":"') + '"}')), i.isPlainObject(n) && (o = i.extend(o, n, c.settings.queryStringData)), i.map(o, function (t, e) {
                        if (t && t > "") return encodeURIComponent(e) + "=" + encodeURIComponent(t)
                    }).join("&")
                },
                getVideo: function (t) {
                    var e = "",
                        i = t.match(/((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/),
                        n = t.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/),
                        s = t.match(/(?:www\.)?vimeo\.com\/([0-9]*)/),
                        o = "";
                    return i || n ? (n && (i = n), o = a.parseUri(t, {
                        autoplay: c.settings.autoplayVideos ? "1" : "0",
                        v: ""
                    }), e = '<iframe width="560" height="315" src="//' + i[1] + "/embed/" + i[2] + "?" + o + '" frameborder="0" allowfullscreen></iframe>') : s ? (o = a.parseUri(t, {
                        autoplay: c.settings.autoplayVideos ? "1" : "0",
                        byline: "0",
                        portrait: "0",
                        color: c.settings.vimeoColor
                    }), e = '<iframe width="560" height="315"  src="//player.vimeo.com/video/' + s[1] + "?" + o + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>') : e = '<iframe width="560" height="315" src="' + t + '" frameborder="0" allowfullscreen></iframe>', '<div class="swipebox-video-container" style="max-width:' + c.settings.videoMaxWidth + 'px"><div class="swipebox-video">' + e + "</div></div>"
                },
                loadMedia: function (t, e) {
                    if (0 === t.trim().indexOf("#")) e.call(i("<div>", {
                        class: "swipebox-inline-container"
                    }).append(i(t).clone().toggleClass(c.settings.toggleClassOnLoad)));
                    else if (!this.isVideo(t)) {
                        var n = i("<img>").on("load", function () {
                            e.call(n)
                        });
                        n.attr("src", t)
                    }
                },
                getNext: function () {
                    var t, e = this,
                        n = i("#swipebox-slider .slide").index(i("#swipebox-slider .slide.current"));
                    n + 1 < d.length ? (t = i("#swipebox-slider .slide").eq(n).contents().find("iframe").attr("src"), i("#swipebox-slider .slide").eq(n).contents().find("iframe").attr("src", t), n++, e.setSlide(n), e.preloadMedia(n + 1), c.settings.nextSlide && c.settings.nextSlide()) : !0 === c.settings.loopAtEnd ? (t = i("#swipebox-slider .slide").eq(n).contents().find("iframe").attr("src"), i("#swipebox-slider .slide").eq(n).contents().find("iframe").attr("src", t), n = 0, e.preloadMedia(n), e.setSlide(n), e.preloadMedia(n + 1), c.settings.nextSlide && c.settings.nextSlide()) : (i("#swipebox-overlay").addClass("rightSpring"), setTimeout(function () {
                        i("#swipebox-overlay").removeClass("rightSpring")
                    }, 500))
                },
                getPrev: function () {
                    var t, e = i("#swipebox-slider .slide").index(i("#swipebox-slider .slide.current"));
                    e > 0 ? (t = i("#swipebox-slider .slide").eq(e).contents().find("iframe").attr("src"), i("#swipebox-slider .slide").eq(e).contents().find("iframe").attr("src", t), e--, this.setSlide(e), this.preloadMedia(e - 1), c.settings.prevSlide && c.settings.prevSlide()) : (i("#swipebox-overlay").addClass("leftSpring"), setTimeout(function () {
                        i("#swipebox-overlay").removeClass("leftSpring")
                    }, 500))
                },
                getThumb: function (t) {
                    var e, n = parseInt(t.data("index"));
                    e = i("#swipebox-slider .slide").eq(n).contents().find("iframe").attr("src"), i("#swipebox-slider .slide").eq(n).contents().find("iframe").attr("src", e), this.preloadMedia(n), this.setSlide(n), c.settings.prevSlide && c.settings.prevSlide()
                },
                nextSlide: function () {
                },
                prevSlide: function () {
                },
                closeSlide: function () {
                    i("html").removeClass("swipebox-html"), i("html").removeClass("swipebox-touch"), i(t).trigger("resize"), this.destroy()
                },
                destroy: function () {
                    i(t).unbind("keyup"), i("body").unbind("touchstart"), i("body").unbind("touchmove"), i("body").unbind("touchend"), i("#swipebox-slider").unbind(), i("#swipebox-overlay").remove(), i.isArray(s) || s.removeData("_swipebox"), this.target && this.target.trigger("swipebox-destroy"), i.swipebox.isOpen = !1, c.settings.afterClose && c.settings.afterClose(), d = []
                }
            }, c.init()
        }, i.fn.swipebox = function (t) {
            if (!i.data(this, "_swipebox")) {
                var e = new i.swipebox(this, t);
                this.data("_swipebox", e)
            }
            return this.data("_swipebox")
        }
    }(window, document, jQuery);