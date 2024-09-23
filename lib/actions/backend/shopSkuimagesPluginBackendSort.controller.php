<?php

class shopSkuimagesPluginBackendSortController extends waJsonController
{
    public function execute()
    {
        try {
            // Получаем данные через GET-запрос (без csrf)
            $positions_raw = waRequest::get('positions', '');
            $sku_id = waRequest::get('sku_id', null, waRequest::TYPE_INT);
            $product_id = waRequest::get('product_id', null, waRequest::TYPE_INT);

            // Декодируем JSON-строку в массив
            $positions = json_decode($positions_raw, true);

            // Логирование позиций для проверки
            waLog::dump($positions, 'positions.log');

            if (empty($positions) || !$this->validatePositions($positions)) {
                throw new waException('Неверные данные для сортировки изображений.', 400);
            }

            $modelImages = new shopSkuimagesImagesModel();
            $modelImages->updateImagePositions($positions, $sku_id, $product_id);

            $this->response = array('status' => 'success', 'message' => 'Позиции изображений успешно обновлены.');
        } catch (Exception $e) {
            $this->setError($e->getMessage());
        }
    }

    /**
     * Валидация данных о позициях изображений
     *
     * @param array $positions Массив данных вида [image_id => position]
     * @return bool
     */
    private function validatePositions(array $positions)
    {
        foreach ($positions as $image_id => $position) {
            if (!is_numeric($image_id) || !is_numeric($position)) {
                return false;
            }
        }
        return true;
    }
}

