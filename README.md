# IpSimple

IpSimple is a simple, reliable, and scalable public IP address API designed for seamless integration into any application. This repository contains the source code and build scripts for deploying the IpSimple website to GitHub Pages.

## Branch Structure

- `dev`: This branch is used for development and building the project. The build process is automated using GitHub Actions, which minifies CSS and HTML, compresses images, and then publishes the build to the `main` branch.
- `main`: This branch hosts the production-ready build of the website, which is served via GitHub Pages.

## Project Structure

```plaintext
.
├── src
│   ├── index.html
│   ├── styles.css
│   ├── logo.jpeg
│   ├── CNAME
├── build
│   ├── build.mjs
├── dist
│   ├── (generated minified files will go here)
├── .github
│   └── workflows
│       └── build-and-deploy.yml
├── package.json
├── .gitignore
└── README.md

## Development Setup

### Prerequisites

- Node.js and npm installed
- Git installed

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ipsimple/ipsimple.github.io.git
    cd ipsimple.github.io
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

### Building the Project

To build the project locally, run:

```sh
npm run build
```

This command will:

Minify the CSS and HTML files
Compress the images
Copy the CNAME file
Testing Locally
To test the website locally, you can use a simple HTTP server. If you have http-server installed globally, you can run:

```sh
npm start
```

Open your browser and navigate to http://localhost:8080 to view the website.

### Deployment

The deployment process is automated using GitHub Actions. When changes are pushed to the dev branch, the workflow defined in .github/workflows/build-and-deploy.yml will:

### Install dependencies

Build the project
Deploy the build output to the main branch
The main branch is configured to serve the website via GitHub Pages.