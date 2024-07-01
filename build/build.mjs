import fs from 'fs';
import { PurgeCSS } from 'purgecss';
import postcss from 'postcss';
import cssnano from 'cssnano';
import { minify } from 'html-minifier-terser';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

async function buildCSS() {
    const purgeCSSResult = await new PurgeCSS().purge({
        content: ['src/index.html'],
        css: ['src/styles.css'],
    });

    const result = await postcss([cssnano]).process(purgeCSSResult[0].css, { from: undefined });

    fs.writeFileSync('dist/styles.min.css', result.css);
}

async function minifyHTML() {
    const html = fs.readFileSync('src/index.html', 'utf8');
    const minifiedHTML = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
    });

    fs.writeFileSync('dist/index.html', minifiedHTML);
}

async function compressImages() {
    await imagemin(['src/logo.jpeg'], {
        destination: 'dist/',
        plugins: [
            imageminMozjpeg({ quality: 75 }),
            imageminPngquant({ quality: [0.6, 0.8] })
        ]
    });
}

function copyCNAME() {
    fs.copyFileSync('src/CNAME', 'dist/CNAME');
}

async function build() {
    // Ensure the dist directory exists
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    await buildCSS();
    await minifyHTML();
    await compressImages();
    copyCNAME();
    console.log('Build completed successfully');
}

build();
