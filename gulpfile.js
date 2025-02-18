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

function css( done ) {
    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('dist/css') )

    done();
}

function javascript() {
    return src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(dest('dist/js'));
}

function imagenes() {
    return src('assets/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('dist/img') )
}

function html() {
    return src('index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(replace('dist/', '')) // Elimina "dist/" de los href
        .pipe(dest('dist'));
}

function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('assets/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('dist/img') )
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('assets/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('dist/img'))
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