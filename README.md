# Проект: [Место (с использованием React)](https://deneroxin.github.io/mesto-react/)

## Описание

Проект представляет собой одностраничное web-приложение, служащее для размещения
фотографий достопримечательных мест зарегистрированными пользователями.
Состоит из шапки, секции с данными пользователя и кнопками интерфейса,
секции с карточками, содержащими фотографии мест, и подвала.


## Функциональность

* Секция с данными пользователя содержит три элемента управления:
  * кнопка "добавить карточку",
  * кнопка "редактировать профиль",
  * при клике на аватар вызывается редактирование ссылки на фотографию.
* Имеется возможность редактировать данные профиля.
Чтобы отредактировать имя и описание, нужно воспользваться кнопкой _"редактировать профиль"_,
а чтобы изменить аватар, нужно кликнуть по аватару.
В ответ на каждое действие вызывается соответствующее всплывающее окно с формой,
куда нужно будет ввести данные и нажать кнопку подтверждения.
Тогда приложение посылает запрос к серверу, если запрос обработался удачно,
модифицирует страницу соответствующим образом, а если нет - выведет текст ошибки под
кнопкой подтверждения в этом же окне.
* Имеется возможность добавлять новую карточку, для этого нужно воспользоваться кнопкой
_"добавить карточку"_ (с плюсом). В появившемся окне ввести заголовок карточки и ссылку на изображение.
* Имеется возможность удалять карточки, но только те, которые были опубликованы нами.
Для удаления карточки необходимо кликнуть по _значку корзины_ в её правом верхнем углу.
У карточек, опубликованных другими пользователями, такого знака нет.
Перед удалнением запрашивается подтверждение.
* Имеется возможность ставить "лайк" карточке. Для этого нужно щелкнуть по кнопке
_"поставить лайк"_ с сердечком напротив подписи. Сердечко станет закрашенным.
Повторный щелчок по нему убирает лайк, делая сердечко пустым.
Отслеживается количество лайков у каждой карточки. Установка и сброс лайка
фиксируется на сервере, обновлённое количество лайков берётся из его ответа.
* Имеется возможность просмотра изображения в увеличенном виде.
Для этого нужно щелкнуть по изображению на карточе. Появится соответствующее всплывающее окно.
* Всплывающие окна можно также закрывать или подтверждать с помощью клавиатуры:
**<Esc>** закрывает окно, **<Enter>** вызывает подтверждение.
* Реализована валидация форм. Валидность полей отслеживается непрерывно, текст ошибки выводится под полем,
не прошедшим валидацию. Доспупность кнопки подтверждения поддерживается в соответствии с валидностью
всех полей формы. Результат запроса на сервер также может вернуть ошибку, тогда текст этой ошибки
отобразится под кнопкой подтверждения.
* Имеется индикация того, что запрос обрабатывается сервером: кнопка подтверждения в период запроса меняет текст.
* Регистрация пользователя **не** реализована. Пользователями страницы являются студенты
практикума, заведомо зарегистрированые на сервере, каждому выдан собственный
идентификационный токен, который используется в запросах к серверу.


## Используемые технологии

* HTML5
* CSS3
* JS
* React 18.2, JSX (реализован функциональный подход при создании компонентов, с применением хуков)
* Вёрстка произведена согласно правилам методоллогии БЭМ.
* Изображения, используемые на странице, оптимизированы с помощью онлайн сервиса [https://tinypng.com/]


## Особенности реализации интерфейса

Особенности реализации интерфейса всплывающих окон, имеющие место в данном проекте,
обусловлены следующими принципами, которые я считаю важными:

1. В браузерах неправильно реализован клик. Чтобы обойти этот баг, являющийся причиной
непреднамеренного закрытия всплывающего окна, вместо простого события "click" используется
имитация его правильного поведения через события "mouseDown" и "mouseUp".
Это позволяет избежать закрытия окна в случаях, когда кнопка была нажата на оверлее
и отпущена внутри окна, или была нажата внутри окна и отпущена на оверлее.
Первый случай актуален, когда пользователь собрался закрыть окно, нажал кнопку в области закрытия,
и передумал - тогда он сможет отвести курсор внутрь окна и отпустить кнопку.
Второй случай ещё важнее, так как при выделении текста в полях (в особенности, всего текста)
курсор может выйти за пределы формы и тогда при отпускании кнопки окно закроется,
чего ни в коем случае нельзя допустить.
2. Пользователь может закрыть окно непреднамеренно. Поэтому поля формы очищаются **только** в случае её
подтверждения. При закрытии окна *без* подтверждения, поля формы **не** очищаются, и ошибки **не** сбрасываются!
Это даёт возможность пользователю не потерять данные, которые он успел ввести, при случайном закрытии окна,
и завершить редактирование при следующем открытии.


## Что планируется доработать

* добавить возможность смотеть данные пользователей, поставивших лайк той или иной карточке;
* добавить форму регистрации пользователя на сервере.
