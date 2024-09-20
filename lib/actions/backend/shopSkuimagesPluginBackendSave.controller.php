<?php

class shopSkuimagesPluginBackendSaveController extends waJsonController
{
    public function execute()
    {
        $images = waRequest::post('images', [], waRequest::TYPE_ARRAY_INT);
        $skus = waRequest::post('skus', [], waRequest::TYPE_ARRAY_INT);
        $product_id = waRequest::post('product_id', 0, waRequest::TYPE_INT);

        // Debugging output
        waLog::dump(compact('images', 'skus', 'product_id'), 'plugin-skuimages.log');

        if (empty($images) || empty($skus) || !$product_id) {
            $this->setError('Invalid images, SKU IDs, or product ID');
            return;
        }

        $model = new shopSkuimagesModel();

        foreach ($images as $image_id) {
            foreach ($skus as $sku_id) {
                $data = [
                    'product_id' => $product_id,
                    'image_id' => $image_id,
                    'sku_id' => $sku_id
                ];
                $model->saveSkuImageRelation($data);
            }
        }

        $this->response = array('status' => 'ok');
    }
}
