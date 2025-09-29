### Описание
   Тестовое задание: Веб-сервис для управления движением денежных средств (ДДС)
   ![Скриншот](https://github.com/Asterrus/cash_flow_management/blob/main/assets/main.png)

### Используемые пакеты:
Backend:
* django
* django-cors-headers
* django-filter
* djangorestframework
* psycopg[binary]
* uvicorn

Frontend:
* react
* typescript
* material-ui

Database:
* postgresql

### Установка
Требуемые инструменты:
* git
* docker
* docker compose (v2)

1. Клонировать репозиторий:

   ```bash
   git clone ...
   ```

2. Перейти в папку с проектом:

   ```bash
   cd cash_flow_management/
   ```
3. Создать .env и заполнить по примеру из .env.example

4. Создать и запустить контейнеры:

   ```bash
   docker compose up -d
   ```

* Доступ к ресурсам:
   Backend:
   ```
   http://localhost:8000/
   ```
   API:
   ```
   http://localhost:8000/api/
   ```
   Frontend:
   ```
   http://localhost:3000/
   ```

Возможности:
   * Просмотр списка ДДС, добавление, редактирование и удаление ДДС
   * Фильтрация ДДС по статусу, типу, категории и подкатегории, дате (диапазон)
   * Сортировка ДДС по дате, типу, категории и подкатегории, сумме, статусу
   * Пагинация
   * Добавление, редактирование и удаление справочников (статусов, типов, категорий, подкатегорий)
   
   