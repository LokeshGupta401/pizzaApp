
let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css').setPublicPath('');
// mix.sass('resources/scss/app.scss', 'public/css/app.css').setPublicPath('public/css/app.css');