'use strict';

const { src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

const uglify = require('gulp-uglify');

const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');

const newer = require('gulp-newer');

function css(done) {
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(replace('../../../../assets/img/', '../img/'))
        .pipe(replace(/\.(png|jpg)/g, '.webp'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('docs/css'));

    done();
}

function javascript() {
    return src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(dest('docs/js'));
}

function imagenes() {
    return src('assets/img/**/*', { encoding: false })
        .pipe(newer('docs/img'))
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('docs/img', { encoding: false }))
}

function html() {
    return src('index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(replace('docs/', ''))
        .pipe(replace(/assets\/(.*?\.svg)/g, '$1'))
        .pipe(dest('docs'));
}

function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('assets/img/**/*.{png,jpg}', { encoding: false })
        .pipe(newer({ dest: 'docs/img', ext: '.webp' }))
        .pipe( webp( opciones ) )
        .pipe( dest('docs/img', { encoding: false }))
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('assets/img/**/*.{png,jpg}', { encoding: false })
        .pipe(newer({ dest: 'docs/img', ext: '.avif' }))
        .pipe( avif( opciones ) )
        .pipe( dest('docs/img', { encoding: false }))
}

function dev() {
    watch( 'src/scss/**/*.scss', css );
    watch( 'assets/img/**/*', imagenes );
    watch('src/js/**/*.js', javascript);
    watch('index.html', html);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.javascript = javascript;
exports.default = series(imagenes, versionWebp, versionAvif, css, javascript, html, dev);