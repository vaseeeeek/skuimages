<?php
return array(
    'shop_skuimages_images' => array(
        'product_id' => array('int', 11, 'null' => 0),
        'sku_id'     => array('int', 11, 'null' => 0),
        'image_id'   => array('int', 11, 'null' => 0),
        'position'   => array('int', 11, 'null' => 0, 'default' => 0),
        ':keys'      => array(
            'PRIMARY' => array('product_id', 'sku_id', 'image_id'),
        ),
    ),
    'shop_skuimages_favorites' => array(
        'product_id' => array('int', 11, 'null' => 0),
        'sku_id'     => array('int', 11, 'null' => 0),
        'image_id'   => array('int', 11, 'null' => 0),
        ':keys'      => array(
            'PRIMARY' => array('product_id', 'sku_id'),
        ),
    ),
);
