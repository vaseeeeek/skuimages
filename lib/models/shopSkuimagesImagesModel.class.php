<?php

class shopSkuimagesImagesModel extends waModel
{
    protected $table = 'shop_skuimages_images';

    public function getImagesByProductId($product_id)
    {
        $sql = "SELECT * FROM {$this->table} WHERE product_id = i:product_id ORDER BY position ASC";
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
        return $this->select('*')
            ->where('sku_id = ?', $sku_id)
            ->order('position ASC')
            ->fetchAll();
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
     * @param int $sku_id ID артикулов (SKU)
     * @param int $product_id ID товара (product)
     * @return bool
     */
    public function updateImagePositions(array $positions, $sku_id, $product_id)
    {
        waLog::dump($positions, 'updateImagePositions.log');
        waLog::dump($sku_id, 'updateImagePositions.log');
        waLog::dump($product_id, 'updateImagePositions.log');

        foreach ($positions as $image_id => $position) {
            // Проверяем, существует ли запись для данного SKU и товара
            $record = $this->getByField(array(
                'image_id' => $image_id,
                'sku_id' => $sku_id,
                'product_id' => $product_id
            ));

            if ($record) {
                // Если запись найдена, обновляем позицию
                $this->updateByField(
                    array(
                        'image_id' => $image_id,
                        'sku_id' => $sku_id,
                        'product_id' => $product_id
                    ),
                    array('position' => $position)
                );
                waLog::dump("Запись обновлена: image_id: $image_id, position: $position", 'updateImagePositions.log');
            } else {
                // Если запись не найдена, логируем это
                waLog::dump("Запись не найдена: image_id: $image_id, sku_id: $sku_id, product_id: $product_id", 'updateImagePositions.log');
            }
        }
        return true;
    }


}
