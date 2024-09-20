<?php

class shopSkuimagesImagesModel extends waModel
{
    protected $table = 'shop_skuimages_images';

    public function getImagesByProductId($product_id)
    {
        $sql = "SELECT * FROM {$this->table} WHERE product_id = i:product_id";
        $result = $this->query($sql, array('product_id' => $product_id))->fetchAll();
        $images = [];
        foreach ($result as $row) {
            $images[$row['sku_id']][] = $row;
        }
        return $images;
    }

    public function addImage($product_id, $sku_id, $image_id)
    {
        return $this->insert(
            array(
                'product_id' => $product_id,
                'sku_id' => $sku_id,
                'image_id' => $image_id,
            )
        );
    }

    public function removeImagesBySkuId($product_id, $sku_id)
    {
        $sql = "DELETE FROM {$this->table} WHERE product_id = i:product_id AND sku_id = i:sku_id";
        return $this->query($sql, array('product_id' => $product_id, 'sku_id' => $sku_id));
    }

    public function getSkusByProductId($product_id)
    {
        $sql = "SELECT id, sku FROM shop_product_skus WHERE product_id = i:product_id";
        return $this->query($sql, array('product_id' => $product_id))->fetchAll();
    }

    public function saveSkuImageRelation($data)
    {
        $sql = "INSERT INTO {$this->table} (product_id, sku_id, image_id) 
                VALUES (:product_id, :sku_id, :image_id) 
                ON DUPLICATE KEY UPDATE sku_id = :sku_id, image_id = :image_id";
        return $this->query($sql, $data);
    }
    
    public function getImagesBySkuId($sku_id)
    {
        return $this->select('*')->where('sku_id = ?', $sku_id)->fetchAll();
    }

    /**
     * Получить изображения по product_id с сортировкой по позиции
     *
     * @param int $product_id
     * @return array
     */
    public function getImagesByProductIdSorted($product_id)
    {
        // Получаем изображения с сортировкой по полю position
        return $this->select('*')
                    ->where('product_id = ?', $product_id)
                    ->order('position ASC')
                    ->fetchAll();
    }

    /**
     * Массовое обновление позиций изображений
     *
     * @param array $positions Массив данных, где ключ — ID изображения, значение — новая позиция
     * @return bool
     */
    public function updateImagePositions(array $positions)
    {
        foreach ($positions as $image_id => $position) {
            $this->updateByField('image_id', $image_id, ['position' => $position]);
        }
        return true;
    }
}
