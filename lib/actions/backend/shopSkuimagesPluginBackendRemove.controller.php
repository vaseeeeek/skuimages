<?php

class shopSkuimagesPluginBackendRemoveController extends waJsonController
{
    public function execute()
    {
        $sku_id = waRequest::post('sku_id', null, waRequest::TYPE_INT);
        $product_id = waRequest::post('product_id', null, waRequest::TYPE_INT);

        if ($sku_id && $product_id) {
            $model = new shopSkuimagesModel();
            $model->removeImagesBySkuId($product_id, $sku_id);
            $this->response = array('status' => 'ok');
        } else {
            $this->setError('Missing required data');
        }
    }
}
