<?php

class shopSkuimagesPluginBackendAddFavoriteController extends waJsonController
{
    public function execute()
    {
        $sku_id = waRequest::post('sku_id', null, waRequest::TYPE_INT);
        $product_id = waRequest::post('product_id', null, waRequest::TYPE_INT);
        $selected = waRequest::post('selected', null);
        if ($sku_id && $product_id && $selected) {
            $model = new shopSkuimagesModel();
            $model->addFavorite($product_id, $sku_id, $selected);
            $this->response = array('status' => 'ok');
        } else {
            $this->setError('Missing required data');
        }
    }
}
