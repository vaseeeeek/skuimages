/*$(document).ready(function () {
    var selectedImages = [];
    var selectedFeatures = {};
    var isSelecting = false;
    var startX, startY;

    var selectionBox = $('<div id="selection-box"></div>').css({
        'position': 'absolute',
        'border': '2px dashed #cb4444',
        'background-color': 'rgba(203, 68, 68, 0.2)',
        'display': 'none',
        'z-index': 10000
    }).appendTo('body');

    function addCheckboxes() {
        $('#s-product-image-list li').each(function () {
            if (!$(this).find('.plugin-skuimages-checkbox').length) {
                $(this).append('<input type="checkbox" class="plugin-skuimages-checkbox" data-image-id="' + $(this).data('image-id') + '">');
            }
        });
    }
    function startSelection(e) {
        isSelecting = true;
        startX = e.pageX;
        startY = e.pageY;
        selectionBox.css({
            'left': startX,
            'top': startY,
            'width': 0,
            'height': 0,
            'display': 'block'
        });
    }

    function updateSelection(e) {
        if (!isSelecting) return;

        var currentX = e.pageX;
        var currentY = e.pageY;

        var width = Math.abs(currentX - startX);
        var height = Math.abs(currentY - startY);
        var left = Math.min(currentX, startX);
        var top = Math.min(currentY, startY);

        selectionBox.css({
            'width': width,
            'height': height,
            'left': left,
            'top': top
        });

        $('#s-product-image-list li').each(function () {
            var $li = $(this),
                liOffset = $li.offset(),
                liWidth = $li.outerWidth(),
                liHeight = $li.outerHeight();

            if (left < liOffset.left + liWidth && left + width > liOffset.left &&
                top < liOffset.top + liHeight && top + height > liOffset.top) {
                $li.addClass('skuimages-selected-img');
                $li.find('.plugin-skuimages-checkbox').prop('checked', true);
            } else {
                $li.removeClass('skuimages-selected-img');
                $li.find('.plugin-skuimages-checkbox').prop('checked', false);
            }
        });
    }

    function endSelection() {
        isSelecting = false;
        selectionBox.css('display', 'none');
    }

    $('#s-product-image-list').on('mousedown', function (e) {
        if (e.which !== 1) return; // Только левая кнопка мыши
        if ($(e.target).is('.plugin-skuimages-checkbox')) return; // Если клик на чекбоксе, не начинаем выделение

        startSelection(e);
        e.preventDefault();
    });

    $(document).on('mousemove', function (e) {
        updateSelection(e);
    });

    $(document).on('mouseup', function () {
        endSelection();
    });

    function assignPathToImage() {
        const listImges = $('#s-product-image-list');

        $('.plugin-skuimages-sku-image').each(function () {
            const nonSrcImage = $(this);
            const idNonSrcImage = nonSrcImage.data('image-id');
            const srcImage = listImges.find(`li[data-image-id="${idNonSrcImage}"]`).find('img').attr('src');

            nonSrcImage.attr('src', srcImage);
        })
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                $(mutation.addedNodes).each(function () {
                    if ($('#s-product-image-list').length) {
                        addCheckboxes();
                        assignPathToImage();
                    }
                });
            }
        });
    });

    var observerConfig = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, observerConfig);

    $('#plugin-skuimages-select-sku-btn').click(function () {
        selectedImages = [];
        $('#s-product-image-list .plugin-skuimages-checkbox:checked').each(function () {
            selectedImages.push($(this).data('image-id'));
        });

        if (selectedImages.length === 0) {
            alert('Выберите хотя бы одно изображение.');
            return;
        }

        var selectedImagesHtml = selectedImages.map(function (imageId) {
            var imgElement = $('li[data-image-id="' + imageId + '"] .s-image img').clone().get(0).outerHTML;
            return '<div>' + imgElement + '</div>';
        }).join('');

        $('#plugin-skuimages-selected-images').html(selectedImagesHtml);
        $('#plugin-skuimages-sku-modal').show();
    });

    $('.plugin-skuimages-feature-value-btn').on('click', function () {
        var featureId = $(this).closest('.plugin-skuimages-feature-values').data('feature-id');
        var valueId = $(this).data('value-id');
        selectedFeatures[featureId] = valueId;

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });

    $('.plugin-skuimages-save-sku-btn').click(function () {
        if ($.isEmptyObject(selectedFeatures)) {
            alert('Выберите характеристики.');
            return;
        }

        var matchingSkus = findMatchingSkus(selectedFeatures);
        if (matchingSkus.length === 0) {
            alert('Нет соответствующих SKU.');
            return;
        }

        var product_id = $('#plugin-skuimages-select-sku-btn').data('product-id');
        if (!product_id) {
            alert('Отсутствует ID продукта.');
            return;
        }

        $.post('?plugin=skuimages&action=save', {
            images: selectedImages,
            skus: matchingSkus,
            product_id: product_id
        }, function (response) {
            if (response.status === 'ok') {
                $('#plugin-skuimages-sku-modal').hide();
            } else {
                alert('Ошибка при сохранении данных');
            }
        }, 'json');
    });

    function findMatchingSkus(selectedFeatures) {
        var matchingSkus = [];
        if (window.pluginSkuimagesSkuFeatureValues) {
            $.each(window.pluginSkuimagesSkuFeatureValues, function (skuId, features) {
                var isMatching = true;
                $.each(selectedFeatures, function (featureId, valueId) {
                    if (!features[featureId] || features[featureId] != valueId) {
                        isMatching = false;
                        return false;
                    }
                });
                if (isMatching) {
                    matchingSkus.push(skuId);
                }
            });
        }
        return matchingSkus;
    }

    $('#plugin-skuimages-sku-modal .plugin-skuimages-modal-content').click(function (e) {
        e.stopPropagation();
    });

    $('#plugin-skuimages-sku-modal').click(function () {
        $(this).hide();
    });


    
});


$(document).on('click', '.plugin-skuimages-remove-sku-btn', function () {
    var skuId = $(this).data('sku-id');
    var productId = $('#plugin-skuimages-select-sku-btn').data('product-id');

    $.post('?plugin=skuimages&action=remove', {
        sku_id: skuId,
        product_id: productId
    }, function (response) {
        if (response.status === 'ok') {
            $('div[data-sku-id="' + skuId + '"]').remove();
        } else {
            alert('Ошибка при удалении привязки SKU');
        }
    }, 'json');
});
*/

$(document).ready(function () {
    var selectedImages = [];
    var selectedFeatures = {};
    var isSelecting = false;
    var startX, startY;

    var selectionBox = $('<div id="selection-box"></div>').css({
        'position': 'absolute',
        'border': '2px dashed #cb4444',
        'background-color': 'rgba(203, 68, 68, 0.2)',
        'display': 'none',
        'z-index': 10000
    }).appendTo('body');

    function addCheckboxes() {
        $('#s-product-image-list li').each(function () {
            if (!$(this).find('.plugin-skuimages-checkbox').length) {
                $(this).append('<input type="checkbox" class="plugin-skuimages-checkbox" data-image-id="' + $(this).data('image-id') + '">');
            }
        });
    }

    function startSelection(e) {
        isSelecting = true;
        startX = e.pageX;
        startY = e.pageY;
        selectionBox.css({
            'left': startX,
            'top': startY,
            'width': 0,
            'height': 0,
            'display': 'block'
        });
    }

    function updateSelection(e) {
        if (!isSelecting) return;

        var currentX = e.pageX;
        var currentY = e.pageY;

        var width = Math.abs(currentX - startX);
        var height = Math.abs(currentY - startY);
        var left = Math.min(currentX, startX);
        var top = Math.min(currentY, startY);

        selectionBox.css({
            'width': width,
            'height': height,
            'left': left,
            'top': top
        });

        $('#s-product-image-list li').each(function () {
            var $li = $(this),
                liOffset = $li.offset(),
                liWidth = $li.outerWidth(),
                liHeight = $li.outerHeight();

            if (left < liOffset.left + liWidth && left + width > liOffset.left &&
                top < liOffset.top + liHeight && top + height > liOffset.top) {
                $li.addClass('skuimages-selected-img');
                $li.find('.plugin-skuimages-checkbox').prop('checked', true);
            } else {
                $li.removeClass('skuimages-selected-img');
                $li.find('.plugin-skuimages-checkbox').prop('checked', false);
            }
        });
    }

    function endSelection() {
        isSelecting = false;
        selectionBox.css('display', 'none');
    }

    $('#s-product-image-list').on('mousedown', function (e) {
        if ($(e.target).prop("tagName") == 'IMG') return;
        if (e.which !== 1) return; // Только левая кнопка мыши
        if ($(e.target).is('.plugin-skuimages-checkbox')) return; // Если клик на чекбоксе, не начинаем выделение

        startSelection(e);
        e.preventDefault();
    });

    $(document).on('mousemove', function (e) {
        updateSelection(e);
    });

    $(document).on('mouseup', function () {
        endSelection();
    });

    // Снятие класса при снятии флажка
    $(document).on('change', '.plugin-skuimages-checkbox', function () {
        var $li = $(this).closest('li');
        if ($(this).is(':checked')) {
            $li.addClass('skuimages-selected-img');
        } else {
            $li.removeClass('skuimages-selected-img');
        }
    });

    function assignPathToImage() {
        const listImages = $('#s-product-image-list');

        $('.plugin-skuimages-sku-image').each(function () {
            const nonSrcImage = $(this);
            const idNonSrcImage = nonSrcImage.data('image-id');
            const srcImage = listImages.find(`li[data-image-id="${idNonSrcImage}"]`).find('img').attr('src');

            nonSrcImage.attr('src', srcImage);
        });
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                $(mutation.addedNodes).each(function () {
                    if ($('#s-product-image-list').length) {
                        addCheckboxes();
                        assignPathToImage();
                    }
                });
            }
        });
    });

    var observerConfig = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, observerConfig);

    $('#plugin-skuimages-select-sku-btn').click(function () {
        selectedImages = [];
        $('#s-product-image-list .plugin-skuimages-checkbox:checked').each(function () {
            selectedImages.push($(this).data('image-id'));
        });

        if (selectedImages.length === 0) {
            alert('Выберите хотя бы одно изображение.');
            return;
        }

        var selectedImagesHtml = selectedImages.map(function (imageId) {
            var imgElement = $('li[data-image-id="' + imageId + '"] .s-image img').clone().get(0).outerHTML;
            return '<div>' + imgElement + '</div>';
        }).join('');

        $('#plugin-skuimages-selected-images').html(selectedImagesHtml);
        $('#plugin-skuimages-sku-modal').show();
    });

    $('.plugin-skuimages-feature-value-btn').on('click', function () {
        var featureId = $(this).closest('.plugin-skuimages-feature-values').data('feature-id');
        var valueId = $(this).data('value-id');
        selectedFeatures[featureId] = valueId;

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });

    $('.plugin-skuimages-save-sku-btn').click(function () {
        if ($.isEmptyObject(selectedFeatures)) {
            alert('Выберите характеристики.');
            return;
        }

        var matchingSkus = findMatchingSkus(selectedFeatures);
        if (matchingSkus.length === 0) {
            alert('Нет соответствующих SKU.');
            return;
        }

        var product_id = $('#plugin-skuimages-select-sku-btn').data('product-id');
        if (!product_id) {
            alert('Отсутствует ID продукта.');
            return;
        }

        $.post('?plugin=skuimages&action=save', {
            images: selectedImages,
            skus: matchingSkus,
            product_id: product_id
        }, function (response) {
            if (response.status === 'ok') {
                // Успешное сохранение
                $('#plugin-skuimages-sku-modal').hide();
                // Сброс всех чекбоксов и удаление классов
                $('#s-product-image-list .plugin-skuimages-checkbox').prop('checked', false).closest('li').removeClass('skuimages-selected-img');
            } else {
                alert('Ошибка при сохранении данных');
            }
        }, 'json');
    });

    function findMatchingSkus(selectedFeatures) {
        var matchingSkus = [];
        if (window.pluginSkuimagesSkuFeatureValues) {
            $.each(window.pluginSkuimagesSkuFeatureValues, function (skuId, features) {
                var isMatching = true;
                $.each(selectedFeatures, function (featureId, valueId) {
                    if (!features[featureId] || features[featureId] != valueId) {
                        isMatching = false;
                        return false;
                    }
                });
                if (isMatching) {
                    matchingSkus.push(skuId);
                }
            });
        }
        return matchingSkus;
    }

    $('#plugin-skuimages-sku-modal .plugin-skuimages-modal-content').click(function (e) {
        e.stopPropagation();
    });

    $('#plugin-skuimages-sku-modal').click(function () {
        $(this).hide();
    });

    $(document).on('click', '.plugin-skuimages-remove-sku-btn', function () {
        var skuId = $(this).data('sku-id');
        var productId = $('#plugin-skuimages-select-sku-btn').data('product-id');

        $.post('?plugin=skuimages&action=remove', {
            sku_id: skuId,
            product_id: productId
        }, function (response) {
            if (response.status === 'ok') {
                $('div[data-sku-id="' + skuId + '"]').remove();
            } else {
                alert('Ошибка при удалении привязки SKU');
            }
        }, 'json');
    });
    $(document).on('click', '.plugin-skuimages-sku-image', function(){
        $(this).parent().find('.plugin-skuimages-sku-image').removeClass('selected');
        $(this).addClass('selected');
    });
    $(document).on('click', '.plugin-skuimages-selectfavorite', function(){
        let skuId = $(this).data('sku-id');
        let productId = $('#plugin-skuimages-select-sku-btn').data('product-id');
        let $button = $(this);
        let selected = $(this).parent().find('.plugin-skuimages-sku-image.selected').data('image-id');
        $.post('?plugin=skuimages&action=AddFavorite', {
            sku_id: skuId,
            product_id: productId,
            selected: selected
        }, function (response) {
            console.log(response);
            if (response.status == 'ok') {
                function showSuccessMessage() {
                    const messageDiv = document.createElement('div');
                    messageDiv.textContent = 'Успешно';
                    messageDiv.className = 'success-message';
                    document.body.appendChild(messageDiv);
                    setTimeout(() => {
                        messageDiv.remove();
                    }, 5000);
                }
                showSuccessMessage();
            }
        }, 'json'); 
    });
});
