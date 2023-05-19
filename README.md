# Tailpine

Tailpine is Block Digital's Shopify Theme built on Alpine JS and Tailwind CSS. 

Tailpine has been developed inline with Shopify's Theme 2.0 code best practices.

Tailpine utilises a 'no jQuery' approach to improve Web Vitals scores.

Make use of Tailwind CSS ecommerce UI components to build the structure of the theme - [Tailwind UI](https://tailwindui.com/#product-ecommerce).

## Installation

To use Tailpine on your project, create a new repository from this template.

Once you've cloned the project to your local machine, navigate to your project folder in Terminal/CMD and run:

```bash
npm install
```

This will install all of the dependencies you need to develop your project theme.

## Usage

To start developing, you will need to open 3 separate command lines based on what tasks you are running.

### Theme Kit

To run Theme Kit and move files between your local machine and your store run the command below:

```bash
theme watch --env=[enviroment]
```

Alternatively, you can deploy files to your theme with the following command:

```bash
theme deploy --env=[environment]
```

Don't forget to replace \[environment\] with your actual environment set in your config.yml file.

### Webpack

Webpack is used to compile, minify and bundle JS to improve download speeds.

There are two commands that you can run depending on the tasks you are running.

```bash
npm run webpack:development
```

This command continually watches JS files for changes and compiles when they are saved. This creates an unminified version of the JS bundle to allow for easier debugging.

To view the development version of your JS files, switch on "Development Mode" in the Theme Customiser.

```bash
npm run webpack:production
```

This command compiles, minifies and bundles JS files for production.

### Gulp

Gulp is used to minify and compile any sass created in the Theme.scss file and to compile Tailwind CSS in to a usable CSS file.

To run gulp, go to a command line and run:

```bash
gulp
```

## Connect to store via GitHub

It is easier than ever to connect your theme to the client's store. Once you've created a repository from this template, go to your store admin dashboard.

Once logged in, go to Online Store > Themes. Then click "Add Theme", from the options, click "Connect from GitHub". You will then be prompted to login to GitHub.

For the GitHub integration to work **you must be logged in to an account on your Shopify store that uses the same email address as your GitHub account**.

Once you are logged in, you should be able to select the newly created repository. Shopify will then download the theme to the store.

## Shopify Liquid Extension

Create a theme from this repo will also install the Shopify Liquid extension in to Visual Studio Code. This extension creates a "PROBLEMS" tab in your Terminal Tablet. This will highlight any issues with the theme. Where possible, the problems tab should have as little issues highlighted as possible. Although we do aknowledge that you may struggle to get this number down to 0.

## JavaScript

When developing with JavaScript, we must adhere to strict JS best practices. This ensures we don't effect Core Web Vitals scores and ensures that we are writing solid and scalable code.

In the [App.js](https://github.com/Block-Digital/Tailpine/blob/main/scripts/app.js) folder you will find minimal JS code. This is because JS code has been broken down in to it's individual components. The App.js file is the main theme file that contains theme critical code. Such as:
1. Cart Functionality
2. Product Form Functionality
3. Theme Listeners and Events Callbacks
4. Helper Functions.

The App.js file should only contain code that is used globally across the site. This ensures all theme critical code is ran via one core file.

For sections/snippets that require its own JS, consider breaking the JS in to its own file.

JS libraries from 3rd parties should be stored in the [Assets](https://github.com/Block-Digital/Tailpine/tree/main/assets) folder and prefixed with "vendor-".

Any components created for snippets/sections should be store in the [Assets](https://github.com/Block-Digital/Tailpine/tree/main/assets) folder and prefixed with "component-".

### No jQuery

Under no circumstances must jQuery be used within your theme. During our tests we've found jQuery to negatively impact Core Web Vitals.

### Alpine JS

To reduce the amount of JS needed for basic interactions, we've adopted [Alpine JS](https://alpinejs.dev/).

Alpine JS has drastically helped us cut down on the amount of JS needed to implement basic interactions such as:

1. Opening/Closing Drawers.
2. Creating Accordions
3. Implementing Mega Menus.
4. Implementing Predictive Search.

> :warning:  **WARNING**: When possible, always use Alpine JS.

### Cart JS

Initially we utilised Cart JS, however this required Rivets JS and jQuery in order to function correctly.

Therefore we decided to re-think the Cart functionality and decided upon the same utilisation as the Dawn Framework. However, we have also integrated the Shopify Cart JS script from [Shopify Theme Scripts](https://github.com/Shopify/theme-scripts).

Rather than using a templating engine to build/destroy the Mini Cart when the customers Cart is updated, we simply fetch the layout from the...
```liquid
{{ route.cart_url }}
```
...and output the HTML to the Mini Cart.

This technique has several benefits:
1. We can run server side logic easily for creating upsells, cross sells and discounts.
2. We no longer need a cumbersome templating script.
3. The Cart information will always be correct as it is rendered server side first.

## CSS

As previously mentioned, the core structure of the theme is built using Tailwind CSS. By using Gulp and Tailwind, we can create a compiled file that only contains the classes used in the .liquid files of the theme. This removes any unneccessary CSS and compiles only what is needed.

> :warning:  **WARNING**: For Tailwind.scss to compile, you will need to save the Tailwind file every time you've used new Tailwind CSS classes. This is because Gulp **does not** listen for the .liquid files to be saved.

All CSS for your theme can be found within the [Styles](https://github.com/Block-Digital/Tailpine/tree/main/styles) folder. The Styles Folder has a specific structure to provide a guide for how files should be named.

> :warning:  **WARNING**: When possible, always use Tailwind CSS.

When possible, Tailwind CSS must be used for styling HTML elements. In the event that you need to create a stylesheet for a section or a snippet/component, you should create the file within the relevant folder within Styles. You must prefix the file with the appropriate name.

For example, components should be prefixed with "component-"

> **Full Example**: component-product-grid-item.scss.

**The same applies for sections.**

## Iconography

Any icons included in this theme should be included in SVG format.

If you are struggling to find Icons, use [Heroicons](https://heroicons.com/) - created by the authors of Tailwind CSS.