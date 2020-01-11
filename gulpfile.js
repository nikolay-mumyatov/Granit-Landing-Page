let gulp = require('gulp'),
    rename = require('gulp-rename'), // Изменение имени файла.
    sass = require('gulp-sass'), // Компиляция SCSS в CSS файлы.
    autoprefixer = require('gulp-autoprefixer'), // Добавление префиксов для стабильной работы в разных браузерах.
    sourcemaps = require('gulp-sourcemaps'), // Создание файла-карты для облегчения работы со стилями в консоли браузера.
    concat = require('gulp-concat'), // Объединение файлов в один.
    uglify = require('gulp-uglify'), // Минификация JS.
    browserSync = require('browser-sync'), // Автоматическое обновление браузера при изменении файлов.
    del = require('del'), // Очистка папки.
    imagemin = require('gulp-imagemin'); // Минификация изображений.

gulp.task('styles', () => { // Сбор, оптимизация и минификация SCSS.
    return gulp .src('./scss/**/*.scss')
                .pipe(sourcemaps.init())
                .pipe(concat('style.scss'))
                .pipe(sass({
                    errLogToConsole: true,
                    outputStyle: 'compressed'
                }))
                .on('error', console.error.bind(console))
                .pipe(autoprefixer({
                    overrideBrowserslist: ['last 3 versions'],
                    cascade: false
                }))
                .pipe(rename({ suffix: '.min' }))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('./build/css/'))
                .pipe(browserSync.stream());
});

gulp.task('scripts', () => { // Сбор, оптимизация и минификация JS.
    return gulp .src('./js/**/*.js')
            .pipe(sourcemaps.init())
            .pipe(concat('scripts.js'))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/js/'))
            .pipe(browserSync.stream());
});

gulp.task('image-compress', () => { // Сбор, оптимизация и минификация изображений.
    return gulp .src('./img/**')
                .pipe(imagemin([
                    imagemin.gifsicle({interlaced: true}), // Сжатие GIF.
                    imagemin.jpegtran({progressive: true}), // Сжатие JPEG.
                    imagemin.optipng({optimizationLevel: 5}), // Сжатие PNG.
                    imagemin.svgo({ // Сжатие SVG.
                        plugins: [
                            {removeViewBox: true},
                            {cleanupIDs: false}
                        ]
                    })
                ]))
                .pipe(gulp.dest('./build/img/'));
})

gulp.task('del', () => { // Очистка папки build.
    return del(['./build/*'])
 });

gulp.task('watch', () => { // Запуск локального хостинга.
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
        // Отслеживание изменений в файлах и перезапись конечного результата.
    gulp.watch('./scss/**/*', gulp.series('styles'));
    gulp.watch('./js/**/*', gulp.series('scripts'));
    gulp.watch("./js/**/*.js").on('change', browserSync.reload); //
    gulp.watch("./**/*.html").on('change', browserSync.reload); // Обновление в браузере при изменении файлов.
    gulp.watch("./**/*.php").on('change', browserSync.reload); //
    gulp.watch('./img/**', gulp.series('image-compress')); // Отслеживание добавления/изменений изображений.
});


//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task('default', gulp.series(gulp.parallel('styles', 'scripts'), 'watch'));

gulp.task('build', gulp.series(gulp.parallel('styles', 'scripts', 'image-compress'), 'watch'));