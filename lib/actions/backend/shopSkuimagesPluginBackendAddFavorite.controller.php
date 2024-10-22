<?php

class shopSkuimagesPluginBackendAddfavoriteController extends waJsonController
{
    public function execute()
    {
        $sku_id = waRequest::post('sku_id', null, waRequest::TYPE_INT);
        $product_id = waRequest::post('product_id', null, waRequest::TYPE_INT);
        $selected = waRequest::post('selected', null);

        // Логируем полученные данные
        waLog::dump(array(
            'sku_id' => $sku_id,
            'product_id' => $product_id,
            'selected' => $selected,
        ), 'addFavorite.log');

        if ($sku_id && $product_id && $selected) {
            $model = new shopSkuimagesFavoritesModel();

            // Логируем перед добавлением в избранное
            waLog::dump("Добавляем в избранное: product_id: $product_id, sku_id: $sku_id, image_id: $selected", 'addFavorite.log');

            $model->addFavorite($product_id, $sku_id, $selected);

            // Логируем успешное добавление
            waLog::dump("Изображение добавлено в избранное успешно", 'addFavorite.log');

            $this->response = array('status' => 'ok');
        } else {
            // Логируем ошибку, если данные отсутствуют
            waLog::dump('Ошибка: отсутствуют необходимые данные', 'addFavorite.log');
            $this->setError('Missing required data');
        }

    }
}
