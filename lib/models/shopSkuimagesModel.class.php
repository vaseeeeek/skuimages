<?php

class shopSkuimagesModel extends waModel
{
    protected $table = 'shop_sku_images';

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
    public function addFavorite($product_id, $sku_id, $selected) {
        $sql = "INSERT INTO `shop_sku_images_favorites` (product_id, sku_id, image_id) 
        VALUES (:product_id, :sku_id, :image_id) 
        ON DUPLICATE KEY UPDATE sku_id = :sku_id, image_id = :image_id";
        $data = array(
            "product_id"=> $product_id,
            "sku_id"=> $sku_id,
            "image_id"=> $selected
        );
        return $this->query($sql, $data);
    }
    public function getFavoriteImagesByProductId($product_id) {
        return $this->query("SELECT * FROM `shop_sku_images_favorites` WHERE product_id = ".$product_id)->fetchAll();
    }
}
