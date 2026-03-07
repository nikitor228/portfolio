# Photography Portfolio — Session Notes

> Прочитай этот файл в начале следующей сессии чтобы восстановить контекст.

## Stack
- Pure HTML/CSS/JS static site
- Cloudinary для хранения фото (cloud name: `dxvpalhqh`)
- `photos.json` — манифест (196 фото)
- Google Fonts: Crimson Text 600 + Saira 300/400/500
- Локальная разработка: `npx serve` (обязательно — fetch('photos.json') не работает без HTTP)

## Файлы проекта
- `index.html` — основная страница портфолио
- `admin.html` — drag-and-drop сортировка фото
- `photos.json` — сгенерированный манифест
- `scripts/generate-manifest.js` — генератор манифеста через Cloudinary API
- `.gitignore` — node_modules/, .env
- `package.json` — зависимость: cloudinary

## Данные фото
- Armenia: 3, Georgia: 85, Turkey: 31, Vietnam: 25, Indonesia: 19, Russia: 17, Thailand: 16
- Категории: armenia, georgia, indonesia, russia, thailand, turkey, vietnam
- Ориентация: `width >= height` → landscape (занимает 2 колонки); portrait → 1 колонка

## Архитектура лейаута (index.html)
- Flex header: \"Savelev Nikita — Street & Travel Photography\"
- CSS grid контент: `200px sidebar | 1fr фото`
- Sidebar: `position: sticky; top: 46px; align-self: start`
- Сетка фото: `grid-template-columns: 1fr 1fr; grid-auto-flow: dense; gap: 20px`
- Portrait: `aspect-ratio: 2/3`; Landscape: `grid-column: 1/-1; aspect-ratio: 3/2`
- `overflow-x: clip` на html/body (НЕ overflow-x: hidden — ломает sticky!)
- Сетка фото имеет `max-width: 800px; margin-left: auto`
- 5 responsive breakpoints: 1400px, 1200px, 1024px, 900px, 700px, 480px
- Мобилка: 2-колоночная сетка сохраняется, sidebar сворачивается наверх

## Cloudinary URL
- Превью: `https://res.cloudinary.com/dxvpalhqh/image/upload/w_1200,q_auto,f_auto/{public_id}`
- Полное разрешение (lightbox): `https://res.cloudinary.com/dxvpalhqh/image/upload/q_auto/{public_id}`
- Admin превью: `w_300,h_300,c_fill,q_auto,f_auto`

## Ключевые технические решения
- Cloudinary \"fixed folder mode\": папка хранится в поле `asset_folder`, НЕ как префикс в `public_id`
- Генерация манифеста: `CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy node scripts/generate-manifest.js`
- Нужно получать ВСЕ ресурсы и фильтровать по `r.asset_folder` на клиенте (API-параметр `asset_folder` ненадёжен)
- `overflow-x: clip` ≠ `overflow-x: hidden` — clip не создаёт новый scroll container, sticky работает

## Lightbox
- Сразу показывает превью, в фоне грузит полное разрешение с fade-swap
- Навигация: ←/→/Esc + свайп

## Admin (admin.html)
- Квадратные превью в CSS grid
- HTML5 Drag & Drop для перестановки внутри категории
- Фильтр по стране через `<select>`
- Кнопка \"Save photos.json\" скачивает обновлённый JSON — пользователь вручную заменяет photos.json

## Заголовок (site-header)
- `.site-header` — flex, без overflow: hidden (обрезает текст!)
- `.site-name` и `.site-title` — `flex-shrink: 1; min-width: 0; white-space: nowrap` на десктопе
- Font-size через `clamp(min, vw, max)` — масштабируется пропорционально вьюпорту
- `.header-rule` — `flex: 1` — линия между именем и тайтлом
- Правая граница заголовка совпадает с правой границей фото (оба внутри body с одинаковым padding)
- Выравнивание работает корректно — header full body-width, фото с margin-left: auto прижаты вправо

### Текущие размеры шрифтов по брейкпоинтам:
```css
/* base (>1400px): body padding 180px */
.site-name, .site-title { font-size: clamp(42px, 4vw, 64px); }

@media (max-width: 1400px) { /* padding 120px */
  .site-name, .site-title { font-size: clamp(46px, 4vw, 54px); }
}
@media (max-width: 1200px) { /* padding 80px */
  .site-name, .site-title { font-size: clamp(44px, 4.5vw, 50px); }
}
@media (max-width: 1024px) { /* padding 48px */
  .site-name, .site-title { font-size: clamp(38px, 4.5vw, 46px); }
}
@media (max-width: 900px) { /* padding 36px */
  .site-name  { font-size: 40px; white-space: normal; }
  .site-title { font-size: 26px; white-space: normal; }
}
@media (max-width: 700px) { /* padding 28px */
  .site-name  { font-size: 36px; }
  .site-title { font-size: 22px; }
}
@media (max-width: 480px) { /* padding 20px */
  .site-name  { font-size: 32px; }
  .site-title { font-size: 20px; }
}
```

## Социальные иконки
- Instagram, Telegram, Threads — 3 иконки SVG (22×22px)
- `position: fixed; bottom: 46px; left: [body-padding]` — симметрично заголовку сверху
- `left` меняется на каждом брейкпоинте вместе с `body padding-left`
- На ≤700px: `position: static; margin-top: 20px` (sidebar уходит наверх)
- Opacity: 0.4, hover: 0.65
- HTML размещён внутри `<nav>`, после `</ul>`

### Ссылки:
- Instagram: `https://www.instagram.com/noobitter`
- Telegram: `https://t.me/nikitor`
- Threads: `https://www.threads.com/@noobitter`

### SVG иконки:
- Instagram: stroke-based (`rect` + `circle` + dot)
- Telegram: stroke-based (стрелка/самолётик)
- Threads: fill-based, официальный путь из simple-icons (viewBox="0 0 24 24", путь начинается с `M12.186 24h-.007c-3.581...`)

### left по брейкпоинтам:
```css
.social-links { left: 180px; }                    /* base */
@media (max-width: 1400px) { left: 120px; }
@media (max-width: 1200px) { left: 80px; }
@media (max-width: 1024px) { left: 48px; }
@media (max-width: 900px)  { left: 36px; }
@media (max-width: 700px)  { position: static; margin-top: 20px; }
```

## Известные проблемы / Не решено
- НЕ использовать `overflow: hidden` на `.site-header` — обрезает текст
- НЕ использовать `overflow-x: hidden` на html/body — ломает sticky sidebar

## Git история (ключевые коммиты)
- `05d68ed` — \"Revert to stable layout before header alignment attempts\"
- `12c6b09` — \"Fix sticky sidebar (overflow-x: clip), reduce nav item spacing to 12px\"

## Что ещё не сделано
- Деплой на Netlify
- GitHub remote repository
