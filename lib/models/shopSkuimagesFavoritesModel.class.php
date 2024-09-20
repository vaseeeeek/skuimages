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
        // Данные для вставки
        $data = array(
            'product_id' => $product_id,
            'sku_id' => $sku_id,
            'image_id' => $selected,
        );

        // Вставляем или обновляем запись
        return $this->insert($data, 2); // Используем режим REPLACE (ON DUPLICATE KEY UPDATE)
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
