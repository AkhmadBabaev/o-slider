Ordinary slider
===============

Это ещё один обыкновенный слайдер.


## 🏷️ Содержание

- [Требования](#requirements)
- [Установка](#installation)
- [Использование](#usage)
- [Конфигурации](#configurations)
- [Лицензия](#license)


##  <a name="requirements"></a> ✒️ Требования

Для работы слайдера необходима библиотека [jQuery](https://jquery.com/) версии 3.1.^.

>  Библиотека  jQuery должна быть загружена на страницу раньше слайдера.


##  <a name="installation"></a> 💾 Установка

> Инструкции данного раздела следует выполнять в командной строке.

С помощью **npm**

```bash
npm install ordinary-slider
```

С помощью **yarn**

```bash
yarn add ordinary-slider
```


##  <a name="usage"></a> 💊 Использование

### Подключение

#####  ES2015+

```javascript
import 'ordinary-slider/docs/o-slider.min';
import 'ordinary-slider/docs/o-slider.min.css';
```

#### CommonJS

```javascript
require('ordinary-slider/docs/o-slider.min');
require('ordinary-slider/docs/o-slider.min.css');
```

### Инициализация 

Настройки по умолчанию

```javascript
$(() => {
  $(selector).oSlider();
})
```

> Код инициализации слайдера должен запускаться после того как страница будет загружена.
> В примере выше это обеспечивает **jQuery** обёртка, в дальнейшем она будет отброшена для лучшей читаемости кода.

Передача настроек с помощью объекта настроек

```javascript
$(selector).oSlider({
  value: 50,
});
```

Тоже самое что и выше только с помощью дата атрибутов

```html
<div class="o-slider" data-value="50"></div>

<script>
  $('.o-slider').oSlider();
</script>
```
> Передача настроек через атрибуты работает и после инициализации слайдера.

> Параметры указанные в дата атрибутах имеют приоритет над переданными в объект настроек.


##  <a name="configurations"></a> ⚙️ Конфигурации

### Настройки 

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| min | number | 0 | минимальное значение |
| max | number | 100 | максимальное значение |
| step | number | 1 | размера шага |
| value | number | 0 | позиция слайдера |
| tip | boolean | true | добавить подсказку |
| bar | boolean | true | добавить бар |

### Методы

#### getSettings()

Возвращает объект настроек слайдера.

```javascript
const sliderSettings = $(selector).oSlider().getSettings(); 
```

#### setSettings(settings)

Позволяет изменять параметры слайдера после инициализации.

```javascript
const $slider = $(selector).oSlider();

$slider.setSettings({
  min: 10,
  value: 20,
});

console.log($slider.getSettings()); // {  min: 10, value: 20, ...rest }
```

#### subscribe(callback)

Запускает callback функцию при каждом изменении значений настроек,
передает объект только с измененными свойствами в аргументы
callback функции.

```javascript
const $slider = $(selector).oSlider();

// подписываем функцию
$slider.subscribe((changedSettings) => {
  console.log(changedSettings);
});

// изменяем value
$slider.setSettings({
  value: 10,
});

// console.log выдаст { value: 10 }
```

#### unsubscribe(callback)

Прекращает запуск callback функции при изменениях значений настроек.

```javascript
const $slider = $(selector).oSlider();

const cb = ((changedSettings) => {
  console.log(changedSettings);
});

// подписываем cb
$slider.subscribe(cb);

// отписываем cb
$slider.unsubscribe(cb)

// изменяем value
$slider.setSettings({
  value: 10,
});

// console.log не выполнится, так как функция cb удалена из подписчиков
```

#### reset()

Сбрасывает к настройкам по умолчанию

```javascript
const $slider = $(selector).oSlider({
  tip: false, // изменяем дефолтную конфигурацию
});

// возвращаем в прежнее состояние
$slider.reset();
```

##  <a name="license"></a> 📃 Лицензия

Этот проект лицензирован на условиях лицензии **MIT**.

> Вы можете ознакомиться с содержанием лицензии [здесь](./LICENSE.md).
