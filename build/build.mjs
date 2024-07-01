import fs from 'fs';
import { PurgeCSS } from 'purgecss';
import postcss from 'postcss';
import cssnano from 'cssnano';
import { minify } from 'html-minifier-terser';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

// Get the version number from environment variable set by the CI/CD pipeline
const version = process.env.NEW_TAG || '1.0.0';

async function buildCSS() {
    const purgeCSSResult = await new PurgeCSS().purge({
        content: ['src/index.html'],
        css: ['src/styles.css'],
    });

    const result = await postcss([cssnano]).process(purgeCSSResult[0].css, { from: undefined });

    fs.writeFileSync('dist/styles.min.css', result.css);
}

async function minifyHTML() {
    let html = fs.readFileSync('src/index.html', 'utf8');

    // Replace the version placeholder with the actual version number
    html = html.replace(/VERSION_PLACEHOLDER/g, version);

    const minifiedHTML = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
    });

    fs.writeFileSync('dist/index.html', minifiedHTML);
}

async function compressImages() {
    const imageFiles = [
        'src/logo.jpeg',
        'src/logo.png',
        'src/logo.ico'
    ];

    await imagemin(imageFiles, {
        destination: 'dist/',
        plugins: [
            imageminMozjpeg({ quality: 75 }),
            imageminPngquant({ quality: [0.6, 0.8] })
        ]
    });

    // Directly copy ICO files as imagemin doesn't handle ICO files
    fs.copyFileSync('src/logo.ico', 'dist/logo.ico');
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
