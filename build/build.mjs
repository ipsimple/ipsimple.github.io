import fs from 'fs-extra';
import path from 'path';
import cssnano from 'cssnano';
import PurgeCSS from 'purgecss';
import { minify } from 'html-minifier-terser';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

// Get the version number from environment variable set by the CI/CD pipeline
const version = process.env.NEW_TAG || '1.0.0';

const srcHtmlPath = path.join(__dirname, '../src/index.html');
const distHtmlPath = path.join(__dirname, '../dist/index.html');
const srcCssPath = path.join(__dirname, '../src/styles.css');
const distCssPath = path.join(__dirname, '../dist/styles.min.css');
const srcImagePath = path.join(__dirname, '../src/logo.jpeg');
const distImagePath = path.join(__dirname, '../dist/logo.jpeg');
const srcCnamePath = path.join(__dirname, '../src/CNAME');
const distCnamePath = path.join(__dirname, '../dist/CNAME');

async function buildCSS() {
    const purgeCSSResult = await new PurgeCSS().purge({
        content: [srcHtmlPath],
        css: [srcCssPath]
    });

    const minifiedCSS = await cssnano.process(purgeCSSResult[0].css, { from: undefined });
    await fs.outputFile(distCssPath, minifiedCSS.css);
}

async function buildHTML() {
    let htmlContent = await fs.readFile(srcHtmlPath, 'utf8');

    // Replace the version placeholder with the actual version number
    htmlContent = htmlContent.replace('VERSION_PLACEHOLDER', version);

    const minifiedHTML = await minify(htmlContent, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    });

    await fs.outputFile(distHtmlPath, minifiedHTML);
}

async function compressImages() {
    await imagemin([srcImagePath], {
        destination: path.dirname(distImagePath),
        plugins: [
            imageminMozjpeg(),
            imageminPngquant()
        ]
    });
}

async function copyCNAME() {
    await fs.copy(srcCnamePath, distCnamePath);
}

async function build() {
    await buildCSS();
    await buildHTML();
    await compressImages();
    await copyCNAME();
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
