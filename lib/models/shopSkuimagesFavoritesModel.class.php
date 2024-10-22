<?php

class shopSkuimagesFavoritesModel extends waModel
{
    protected $table = 'shop_skuimages_favorites';
    /**
     * Добавление избранного изображения
     *
     * @param int $product_id
     * @param int $sku_id
     * @param int $selected
     * @return bool
     */
    public function addFavorite($product_id, $sku_id, $selected)
    {
        // Данные для вставки или обновления
        $data = array(
            'product_id' => $product_id,
            'sku_id' => $sku_id,
            'image_id' => $selected,
        );
    
        // Проверяем, существует ли запись с такими product_id и sku_id
        $existing = $this->getByField(array(
            'product_id' => $product_id,
            'sku_id' => $sku_id,
        ));
    
        if ($existing) {
            // Если запись существует, обновляем image_id
            return $this->updateByField(array(
                'product_id' => $product_id,
                'sku_id' => $sku_id,
            ), array('image_id' => $selected));
        } else {
            // Если записи нет, вставляем новую
            return $this->insert($data);
        }
    }

    /**
     * Получить избранные изображения по product_id
     *
     * @param int $product_id
     * @return array
     */
    public function getFavoriteImagesByProductId($product_id)
    {
        return $this->select('*')->where('product_id = ?', $product_id)->fetchAll();
    }
}
