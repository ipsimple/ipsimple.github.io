const fs = require('fs-extra');
const path = require('path');
const sizeOf = require('image-size');

// Get the version number from the environment variable
const version = process.env.NEW_TAG || '1.0.0';

describe('Build Process', () => {
  const srcHtmlPath = path.join(__dirname, '../src/index.html');
  const distHtmlPath = path.join(__dirname, '../dist/index.html');
  const srcCssPath = path.join(__dirname, '../src/styles.css');
  const distCssPath = path.join(__dirname, '../dist/styles.min.css');
  const srcImagePath = path.join(__dirname, '../src/logo.jpeg');
  const distImagePath = path.join(__dirname, '../dist/logo.jpeg');
  const srcCnamePath = path.join(__dirname, '../src/CNAME');
  const distCnamePath = path.join(__dirname, '../dist/CNAME');

  test('HTML is minified', () => {
    const srcHtml = fs.readFileSync(srcHtmlPath, 'utf8');
    const distHtml = fs.readFileSync(distHtmlPath, 'utf8');

    // Check that minified HTML is smaller than the original
    try {
      expect(distHtml.length).toBeLessThan(srcHtml.length);
      console.log('Success: Minified HTML is smaller than the original HTML.');
    } catch (error) {
      error.message = 'Failed: Minified HTML is not smaller than the original HTML.';
      throw error;
    }

    // Check that specific elements are present
    try {
      expect(distHtml).toContain('<nav class="navbar');
      expect(distHtml).toContain('<div class="container');
      console.log('Success: Required elements are present in the minified HTML.');
    } catch (error) {
      error.message = 'Failed: Required elements are missing in the minified HTML.';
      throw error;
    }
  });

  test('CSS is minified', () => {
    const srcCss = fs.readFileSync(srcCssPath, 'utf8');
    const distCss = fs.readFileSync(distCssPath, 'utf8');

    // Check that minified CSS is smaller than the original
    try {
      expect(distCss.length).toBeLessThan(srcCss.length);
      console.log('Success: Minified CSS is smaller than the original CSS.');
    } catch (error) {
      error.message = 'Failed: Minified CSS is not smaller than the original CSS.';
      throw error;
    }
  });

  test('HTML contains required meta tags', () => {
    const distHtml = fs.readFileSync(distHtmlPath, 'utf8');

    // Check for specific meta tags using regex to account for minified formatting
    try {
      expect(distHtml).toMatch(/<meta charset="utf-8">/);
      expect(distHtml).toMatch(/<meta name="viewport" content="width=device-width,initial-scale=1">/);
      console.log('Success: Required meta tags are present in the minified HTML.');
    } catch (error) {
      error.message = 'Failed: Required meta tags are missing in the minified HTML.';
      throw error;
    }
  });

  test('HTML contains CSS link', () => {
    const distHtml = fs.readFileSync(distHtmlPath, 'utf8');

    // Check for the minified CSS link
    try {
      expect(distHtml).toContain('<link href="styles.min.css" rel="stylesheet">');
      console.log('Success: Minified CSS link is present in the HTML.');
    } catch (error) {
      error.message = 'Failed: Minified CSS link is missing in the HTML.';
      throw error;
    }
  });

  test('HTML contains JavaScript inclusion', () => {
    const distHtml = fs.readFileSync(distHtmlPath, 'utf8');

    // Check for the JavaScript bundle inclusion
    try {
      expect(distHtml).toContain('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>');
      console.log('Success: JavaScript inclusion is present in the HTML.');
    } catch (error) {
      error.message = 'Failed: JavaScript inclusion is missing in the HTML.';
      throw error;
    }
  });

  test('CNAME file is copied and contains the correct domain', () => {
    const srcCname = fs.readFileSync(srcCnamePath, 'utf8');
    const distCname = fs.readFileSync(distCnamePath, 'utf8');

    // Check that CNAME file content is the same
    try {
      expect(distCname).toBe(srcCname);
      console.log('Success: CNAME file is copied correctly.');
    } catch (error) {
      error.message = 'Failed: CNAME file is not copied correctly.';
      throw error;
    }

    // Check that CNAME file contains the correct domain
    try {
      expect(distCname).toContain('ipsimple.org');
      console.log('Success: CNAME file contains the correct domain.');
    } catch (error) {
      error.message = 'Failed: CNAME file does not contain the correct domain.';
      throw error;
    }
  });

  test('Image is compressed', () => {
    const srcImage = fs.readFileSync(srcImagePath);
    const distImage = fs.readFileSync(distImagePath);

    // Check that compressed image is smaller than the original
    try {
      expect(distImage.length).toBeLessThan(srcImage.length);
      console.log('Success: Image is compressed successfully.');
    } catch (error) {
      error.message = 'Failed: Image is not compressed successfully.';
      throw error;
    }

    // Optionally, check that the image dimensions are the same
    const srcDimensions = sizeOf(srcImage);
    const distDimensions = sizeOf(distImage);
    try {
      expect(distDimensions.width).toBe(srcDimensions.width);
      expect(distDimensions.height).toBe(srcDimensions.height);
      console.log('Success: Image dimensions are preserved after compression.');
    } catch (error) {
      error.message = 'Failed: Image dimensions are not preserved after compression.';
      throw error;
    }
  });

  test('HTML contains the correct version number', () => {
    const distHtml = fs.readFileSync(distHtmlPath, 'utf8');

    // Check that the version number is correctly inserted into the HTML
    try {
      expect(distHtml).toContain(`<span id="version-placeholder">${version}</span>`);
      console.log(`Success: HTML contains the correct version number ${version}.`);
    } catch (error) {
      console.error(`Expected version: <span id="version-placeholder">${version}</span>`);
      console.error(`Actual HTML content: ${distHtml}`);
      error.message = `Failed: HTML does not contain the correct version number <span id="version-placeholder">${version}</span>.`;
      throw error;
    }
  });
});
