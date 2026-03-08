# Portfolio — nikitka.me

Фотопортфолио Никиты Савельева. Статический сайт на GitHub Pages.

## Stack
- Pure HTML/CSS/JS (один файл — `index.html`)
- Cloudinary для хранения фото (cloud name: `dxvpalhqh`)
- Supabase для лайков (credentials в SESSION_NOTES.md локально)
- Umami Cloud для аналитики
- Google Fonts: Crimson Text 400/600 + Saira 300/400/500/800
- Deploy: GitHub Pages → nikitka.me
- SSH remote: `git@github.com:nikitor228/portfolio.git` (ключ `~/.ssh/github`)
- Локальная разработка: `npx serve` → `localhost:3000`

## Файлы
- `index.html` — весь сайт (HTML + CSS + JS)
- `photos.json` — манифест 196 фото
- `scripts/generate-manifest.js` — генератор манифеста через Cloudinary API
- `admin.html` — drag-and-drop сортировка (в .gitignore, только локально)

## Данные фото
- Категории (порядок в меню): georgia, vietnam, russia, indonesia, thailand, turkey, armenia
- Georgia: 85, Turkey: 31, Vietnam: 25, Indonesia: 19, Russia: 17, Thailand: 16, Armenia: 3
- Ориентация: `width >= height` → landscape (2 колонки); portrait → 1 колонка

## Архитектура layout
- Flex header: имя + SVG em-dash глиф + заголовок
- CSS grid контент: `200px sidebar | 1fr фото` (desktop)
- Сетка фото: `grid-template-columns: 1fr 1fr; grid-auto-flow: dense; gap: 20px`
- `max-width: 800px` на сетке фото, `max-width: 1600px` на body
- `overflow-x: clip` на html/body (НЕ hidden — ломает sticky sidebar!)
- Breakpoints: 1400px, 1200px, 1024px, 900px, 700px, 480px
- Мобилка (≤700px): sidebar наверх, хедер по центру

## Мобильный хедер (≤700px)
- Имя: Crimson Text 400, 16vw
- Заголовок: Crimson Text 600, 7.5vw
- align-items: center, gap: 6px

## Лайки
- Supabase: таблица `photo_likes (photo_id TEXT PRIMARY KEY, count INTEGER DEFAULT 0)`
- RPC функции: `increment_like(p_photo_id TEXT)`, `decrement_like(p_photo_id TEXT)` — SECURITY DEFINER + GRANT EXECUTE TO anon
- localStorage ключ `liked` — массив photo_id лайкнутых фото
- Кнопка: SVG сердечко (viewBox 0 0 32 29) + `<text>` для счётчика внутри
- Текст кнопки: "Absolute cinema!"
- `updateLikeButton()` вызывается из `showPhoto()` при каждом переключении фото

## Аналитика (Umami Cloud)
- Website ID: `4011ff59-fcb3-4544-9640-637b6a79970c`
- События: `photo_open`, `photo_like`, `scroll_depth`
- Все `umami.track` обёрнуты в try/catch (AdBlock блокирует в dev)

## Cloudinary URLs
- Превью: `https://res.cloudinary.com/dxvpalhqh/image/upload/w_1200,q_auto,f_auto/{id}`
- Полное разрешение: `https://res.cloudinary.com/dxvpalhqh/image/upload/q_auto/{id}`

## Цвета
- Фон: `#F8F8F8`, текст: `#3F3F3F`
- Лайтбокс: `rgba(0,0,0,0.95)`

## Ключевые технические решения
- Hash-роутинг: `#PHOTO_ID` при открытии лайтбокса
- Лайтбокс: два слоя (thumb + hi-res overlay), `loadToken` для отмены устаревших загрузок
- SVG `<text>` для счётчика лайков (position:absolute не работает — transform на родителе меняет containing block)
- Социальные иконки: фиксированная пилюля снизу на мобилке (backdrop-filter blur)
