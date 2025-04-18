import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('src/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream())
}

// HTML

const html = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
}

// Scripts

const scripts = () => {
  return gulp.src('src/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream())
}

// Images

const optimizeImages = () => {
  return gulp.src('src/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('src/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

// WebP

const webp = () => {
  return gulp.src(['src/img/**/*.{jpg,png}', '!src/img/favicons/*.{jpg,png}'])
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

// SVG

const svg = () =>
  gulp.src('src/img/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img'))

const sprite = () => {
  return gulp.src('src/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))
}

// Copy

const copy = () => {
  return gulp.src([
    'src/fonts/*.{woff2,woff}',
    'src/*.ico',
    'src/*.webmanifest'
  ], {
    base: 'src'
  })
    .pipe(gulp.dest('build'))
}

// Clean

const clean = () => {
  return del('build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  })
  done()
}

// Reload

const reload = (done) => {
  browser.reload()
  done()
}

// Watcher

const watcher = () => {
  gulp.watch('src/less/**/*.less', gulp.series(styles));
  gulp.watch('src/js/*.js', gulp.series(scripts))
  gulp.watch('src/*.html', gulp.series(html, reload))
}

export const deploy = () => {
  return gulp.src("./build/**/*")
    .pipe(ghPages());
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    webp
  )
)

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    webp,
  ),
  gulp.series(
    server,
    watcher
  )
);
