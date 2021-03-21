oSlider
===============

Это ещё один обыкновенный слайдер.  
Опробовать слайдер в действии можно открыв [превью](https://akhmadbabaev.github.io/o-slider/).  


**Внимание:** Данный пакет является учебным проектом для студентов компании [Metalamp](https://www.metalamp.io/),  
не стоит его использовать в реальных проектах.  

**NOTE:** This package is a training project for students of the company [Metalamp](https://en.metalamp.io/),  
do not use it in real projects.  

## 🏷️ Содержание

- [Требования](#requirements)
- [Установка](#installation)
- [Использование](#usage)
- [Конфигурации](#configurations)
- [Для разработчиков](#developers)
- [Лицензия](#license)


##  <a name="requirements"></a> ✒️ Требования

Для работы слайдера необходима библиотека [jQuery](https://jquery.com/) версии ^3.1.0.

>  Библиотека jQuery должна быть загружена на страницу раньше слайдера.


##  <a name="installation"></a> 💾 Установка

> Инструкции данного раздела следует выполнять в командной строке.

С помощью **npm**

```bash
npm install o-slider
```

С помощью **yarn**

```bash
yarn add o-slider
```


##  <a name="usage"></a> 💊 Использование

### Подключение

#####  ES2015+

```javascript
import 'o-slider';
```

#### CommonJS

```javascript
require('o-slider');
```

### Инициализация 

Настройки по умолчанию

```javascript
$(() => {
  $(selector).oSlider();
})
```

> Код инициализации слайдера должен запускаться после того как страница будет загружена.
> В примере выше это обеспечивает **jQuery** обёртка, далее в примерах она будет отброшена для лучшей читаемости кода.

Передача настроек с помощью объекта настроек

```javascript
$(selector).oSlider({
  from: 50,
});
```

Тоже самое что и выше только с помощью data-* атрибутов

```html
<div class = "o-slider" data-from = "50"></div>

<script>
  $('.o-slider').oSlider();
</script>
```
> Передача настроек через data-* атрибуты возможна и после инициализации слайдера.

> Настройки указанные в data-* атрибутах имеют приоритет над переданными в объект настроек.


##  <a name="configurations"></a> ⚙️ Конфигурации

### Настройки 

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| min | number | 0 | минимальное значение |
| max | number | 100 | максимальное значение |
| step | number | 1 | размера шага |
| from | number | 0 | позиция ползунка, если `range: true` то нижняя граница интервала |
| to | number | null | верхняя граница интервала, этот параметр не имеет смысла если `range: false` |
| tip | boolean | false | добавить подсказку |
| bar | boolean | false | добавить бар |
| scale | boolean | false | добавить шкалу |
| range | boolean | false | создать интервал |
| vertical | boolean | false | сменить направление слайдера на вертикальное |

### Методы

#### oSlider('settings', [options])

Вызов без **options** возвращает объект настроек слайдера.

```javascript
const sliderSettings = $(selector).oSlider('settings'); 
```

Аргумент **options** позволяет изменять настройки слайдера.

```javascript
const $slider = $(selector).oSlider();

$slider.oSlider('settings', {
  min: 10,
  from: 20,
});

console.log($slider.oSlider('settings')); // { min: 10, from: 20, ...rest }
```

#### oSlider('subscribe', callback)

Запускает callback функцию при каждом изменении настроек слайдера, передает объект только с измененными паматрами в аргументы callback функции.

```javascript
const $slider = $(selector).oSlider();

// подписываемся
$slider.oSlider('subscribe', (changedSettings) => {
  console.log(changedSettings);
});

// устанавливаем новое значение параметру from
$slider.oSlider('settings', {
  from: 10,
});

// console.log выдаст { from: 10 }
```

#### oSlider('unsubscribe', callback)

Прекращает запуск callback функции при изменениях настроек.

```javascript
const $slider = $(selector).oSlider();

const cb = ((changedSettings) => {
  console.log(changedSettings);
});

// подписываемся
$slider.oSlider('subscribe', cb);

// отписываемся
$slider.oSlider('unsubscribe', cb);

// устанавливаем новое значение параметру from
$slider.oSlider('settings', {
  from: 10,
});

// console.log не выполнится, так как функция cb удалена из подписчиков
```


##  <a name="developers"></a> ⚔️ Для разработчиков

Если вы желаете развивать проект, ознакомьтесь с руководством для разрабочиков [здесь](./DEVELOPERS-GUIDE.md).


##  <a name="license"></a> 📃 Лицензия

Этот проект лицензирован на условиях лицензии **MIT**.

> Вы можете ознакомиться с содержанием лицензии [здесь](./LICENSE.md).
