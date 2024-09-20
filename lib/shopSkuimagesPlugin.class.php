<?php

class shopSkuimagesPlugin extends shopPlugin
{
    public function backendProductEdit($product)
    {
        $product_id = $product['id'];
        $model = new shopSkuimagesModel();
        $skus = $model->getSkusByProductId($product_id);
        $attached_skus = $model->getImagesByProductId($product_id);
        $favorite_images_arr = $model->getFavoriteImagesByProductId($product_id);
        
        $favorite_images = [];
        foreach ($favorite_images_arr as $image) {
            $favorite_images[$image['sku_id']] = $image;
        }
        $features = array_filter($product['features_selectable'], function ($feature) {
            return $feature['selected'] > 0;
        });

        foreach ($features as &$feature) {
            $feature['values'] = array_filter($feature['values'], function ($value) {
                return $value['selected'];
            });
        }

        $skuFeatureValues = $this->getSkuFeatureValues($product_id);

        $view = wa()->getView();
        $view->assign('plugin_skuimages_skus', $skus);
        $view->assign('plugin_skuimages_features', $features);
        $view->assign('plugin_skuimages_product_id', $product_id);
        $view->assign('plugin_skuimages_product_features', $features);
        $view->assign('plugin_skuimages_sku_feature_values', $skuFeatureValues);
        $view->assign('attached_skus', $attached_skus); // Передаем привязанные SKU
        $view->assign('favorite_images', $favorite_images);
        // Передаем URL плагина в шаблон
        $plugin_url = wa()->getAppStaticUrl('shop') . "plugins/skuimages";
        $view->assign('plugin_skuimages_plugin_url', $plugin_url);

        $content = $view->fetch($this->path . '/templates/actions/backend/ProductSkuImages.html');

        return array(
            'images' => $content,
        );
    }


    private function getSkuFeatureValues($product_id)
    {
        $model = new shopProductFeaturesModel();
        $data = $model->getByField('product_id', $product_id, true);
        $skuFeatureValues = [];
        foreach ($data as $row) {
            if (!isset($skuFeatureValues[$row['sku_id']])) {
                $skuFeatureValues[$row['sku_id']] = [];
            }
            $skuFeatureValues[$row['sku_id']][$row['feature_id']] = $row['feature_value_id'];
        }
        return $skuFeatureValues;
    }

    public static function getFavoriteImages($product_id) {
        $model = new shopSkuimagesModel();
        return $model->getFavoriteImagesByProductId($product_id);
    }
    public static function getProductSkuImages($product_id)
    {
        $sku_images_model = new shopSkuimagesModel();
        $product_skus_model = new shopProductSkusModel();

        // Получаем все артикулы продукта
        $skus = $product_skus_model->getByField('product_id', $product_id, true);

        // Массив для хранения SKU с изображениями
        $sku_images = array();

        // Проходимся по каждому SKU и проверяем наличие изображений
        foreach ($skus as $sku) {
            $images = $sku_images_model->getImagesBySkuId($sku['id']);

            // Добавляем SKU в массив, только если у него есть изображения
            if (!empty($images)) {
                $sku_images[$sku['id']] = $images;
            }
        }

        return $sku_images;
    }

}
