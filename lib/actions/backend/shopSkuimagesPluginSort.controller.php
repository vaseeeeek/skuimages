<?php

class shopSkuimagesPluginSortController extends waJsonController
{
    /**
     * Основной метод контроллера для обработки сортировки изображений
     */
    public function execute()
    {
        try {
            // Получаем данные из POST-запроса
            $positions = waRequest::post('positions', array(), waRequest::TYPE_ARRAY);

            // Валидация данных
            if (empty($positions) || !$this->validatePositions($positions)) {
                throw new waException('Неверные данные для сортировки изображений.', 400);
            }

            // Получаем модель изображений
            $modelImages = new shopSkuimagesImagesModel();

            // Обновляем позиции изображений
            $modelImages->updateImagePositions($positions);

            // Возвращаем успешный результат
            $this->response = array('status' => 'success', 'message' => 'Позиции изображений успешно обновлены.');
        } catch (Exception $e) {
            // Обрабатываем ошибки
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
