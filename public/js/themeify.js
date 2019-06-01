/**
 * Themeify
 * Version: 1.0.0
 * Author: Bas Wilson
 * Hosted at https://npmawesome.net
 * Check for updates at https://npmawesome.net/library/themeify
 * Check the example theme at the bottom of the file.
 */

class ThemeifyTheme {

    /**
     * @param {ThemeifyElement} elements 
     */
    constructor(elements) {
        this.elements = elements; // Custom elements that you want to theme
    }

    /**
     * @param {string} themeStyle 
     */
    applyTheme(themeStyle) {

        localStorage.setItem('ThemeifyTheme', themeStyle);

        // Apply style for all custom elements in the theme
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i]
            var elements = document.querySelectorAll(element.selector);
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.cssText += themeStyle == 'light' ? element.customCss.light : element.customCss.dark;
            }
        }
    }
}

class ThemeifyElement {
    /** Specify a selector such as a class or id and add a ThemeifyCss object to it.
     * @param {string} selector 
     * @param {ThemeifyCss} customCss 
     */
    constructor(selector, customCss) {
        this.selector = selector;
        this.customCss = customCss;
    }
}

class ThemeifyCss {

    /**
     * @param {string} light 
     * @param {string} dark 
     */
    constructor(light, dark) {
        this.light = light;
        this.dark = dark;
    }
}


var sampleTheme = new ThemeifyTheme(
    [
        // Body
        new ThemeifyElement(
            'body',
            new ThemeifyCss(
                'background-color: #ffffff; color: #000000;', // CSS Light theme
                'background-color: rgb(0, 1, 87); color: #c7c5ff;' // CSS Dark theme
            ),
        ),
        // Button
        new ThemeifyElement(
            'button',
            new ThemeifyCss(
                'background-color: #c7c5ff; color: #ffffff;', // CSS Light theme
                'background-color: #c7c5ff; color: rgb(0, 1, 87);' // CSS Dark theme
            )
        )
    ]
);