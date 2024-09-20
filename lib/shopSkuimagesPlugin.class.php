<?php

class shopSkuimagesPlugin extends shopPlugin
{

    protected $modelImages;
    protected $modelFavorites;

    public function __construct()
    {
        $this->modelImages = new shopSkuimagesImagesModel();
        $this->modelFavorites = new shopSkuimagesFavoritesModel();
    }

    public function backendProductEdit($product)
    {
        $product_id = $product['id'];
        $skus = $this->modelImages->getSkusByProductId($product_id);
        $attached_skus = $this->modelImages->getImagesByProductId($product_id);
        $favorite_images_arr = $this->modelFavorites->getFavoriteImagesByProductId($product_id);
        
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

    public function getFavoriteImages($product_id) {
        return $this->modelFavorites->getFavoriteImagesByProductId($product_id);
    }
    public function getProductSkuImages($product_id)
    {
        $product_skus_model = new shopProductSkusModel();
        
        $skus = $product_skus_model->getByField('product_id', $product_id, true);
        
        $sku_images = array();
        
        foreach ($skus as $sku) {
            $images = $this->modelImages->getImagesBySkuId($sku['id']);
            
            if (!empty($images)) {
                $sku_images[$sku['id']] = $images;
            }
        }

        return $sku_images;
    }

}
