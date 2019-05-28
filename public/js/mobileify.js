/**
 * Mobileify
 * Version: 0.0.1
 * Author: Bas Wilson
 * Hosted at https://npmawesome.net
 * Check for updates at https://npmawesome.net/library/mobileify
 */

class MobileifyApp {
    constructor(properties) {
        this.properties = properties;
        this.navigator = new MobileifyNavigator();
        this.navbar = properties.navbar ? new MobileifyNavbar() : null
        this.buildApp().then(() => {
            this.changeView();
        });
    }

    buildApp() {

        return new Promise(resolve => {

            // Add the css to the body 
            var css = document.createElement('style');
            css.type = 'text/css';

            if (css.styleSheet) css.styleSheet.cssText = this.createStyle();
            else css.appendChild(document.createTextNode(this.createStyle()));

            document.getElementsByTagName("head")[0].appendChild(css);

            document.body.innerHTML = `
            <div class="mobileify mob-app">
                <div class="mobileify mob-header"><h2 id="mob-header-text">${this.properties.name}</h2></div>
                <div class="mobileify mob-content"></div>
                ${this.navbar ? `<div class="mobileify mob-navbar">${this.navbar.renderedNavbar}</div>` : ''}
            </div>
            `;

            if (this.navbar)
                this.navbar.renderNavbar();

            resolve(true);
        });
    }


    /**
     * @param {MobileifyView} view 
     */
    addView(view) {
        if (view.properties.navbar) {
            this.navbar.addNavItem({
                text: view.properties.name,
                icon: view.properties.navbar.icon
            });
        }
        this.navigator.addView(view);
    }

    changeView(viewName) {
        this.navigator.changeView(viewName);
        if (this.navbar)
            this.navbar.updateSelectedNavItem(viewName);
    }

    createStyle() {
        return `

            body {
                margin: 0px;
                padding: 0px;
                
            }
            .mobileify {
                background-color: ${this.properties.primaryColor};
                color: ${this.properties.secondaryColor};
                font-family: googlesans;
            }

            .mob-app {
                height: 100vh;
            }

            .mob-header {
                height: 50px;
                padding: 10px 20px;
                line-height: 50px;
                position: fixed;
                top: 0px;
                border-bottom: 1px solid rgba(199,197,255,.1);
            }

            .mob-content {
                height: 100%;
                position: fixed;
                top: 70px;
                left: 0px;
                right: 0px;
                bottom: ${this.navbar ? '70px' : '0px'};
                overflow-y: scroll;
            }

            .mob-view {
                position: absolute;
                height: 100%;
                width: 100%;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                -webkit-animation-name: navigate;
                -webkit-animation-duration: .3s;
            }

            .mob-navbar {
                width: 100%;
                height: 70px;
                position: fixed;
                bottom: 0px;
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
                border-top: 1px solid rgba(199,197,255,.1);
            }

            .mob-navbar-item {
                display:flex;
                flex-direction: column;
                text-align: center;
                align-items: center;
                font-size: 12px;
                vertical-align: middle;
                width: 100%;
                padding: 10px;
            }

            .mob-navbar-item-selected {
            ;
                -webkit-animation-name: nabvar;
                -webkit-animation-duration: .3s;
                font-size: 15px;
            }

            @-webkit-keyframes nabvar {
                0%{ background-color: rgba(0,0,0,0);}
                50%{ background-color: rgba(0,0,0,0.1);}
                100%{ background-color: rgba(0,0,0,0);}
            }

            .mob-navbar-item img {
                height: 30px;
                background-color: rgba(0,0,0,0);
                width: 30px;
                margin-bottom: 5px;
            }
            @-webkit-keyframes navigate {
                0% { opacity: 1;}
                100%{ opacity: 1;}
            }

            .mobileify h1, h2, h3, h4, h5, p {
                margin: 0px;
            }
        `;
    }

}

class MobileifyNavbar {
    constructor() {
        this.selectedNavItem = null;
        this.navItems = [];
        this.renderedNavbar = this.renderNavbar();
        this.rendered = false;
    }

    renderNavbar() {
        var barItems = '';
        for (let i = 0; i < this.navItems.length; i++) {
            barItems += `
            <div class="mobileify mob-navbar-item" data-navitem="${this.navItems[i].text}" onclick="app.changeView('${this.navItems[i].text}')">
                <img class="mobileify mob-navbar-icon" src="${this.navItems[i].icon}" />
                <p>${this.navItems[i].text}</p>
            </div>`;
        }
        this.renderedNavbar = barItems;
        if (this.rendered) {
            document.querySelector('.mob-navbar').innerHTML = this.renderedNavbar;
        }

        this.rendered = true;
        return barItems;
    }

    addNavItem(item) {
        this.navItems.push(item);
        this.renderNavbar();
    }

    updateSelectedNavItem(navItemName) {
        if (this.selectedNavItem) 
            document.querySelector(`[data-navitem="${this.selectedNavItem}"]`).classList.remove('mob-navbar-item-selected');

        if (!navItemName) 
            navItemName = this.navItems[0].text;

        document.querySelector(`[data-navitem="${navItemName}"]`).classList.add('mob-navbar-item-selected');
        this.selectedNavItem = navItemName;
    }
}
class MobileifyNavigator {

    constructor() {
        this.currentView = null;
        this.views = [];
        this.navigating = false;
    }

    changeView(viewName) {
        this.navigating = true;
        if (!viewName)
            viewName = this.views[0].properties.name;
        this.renderView(viewName).then((result) => {
            if (result.renderedView) {
                this.animateViewSwitch(result.renderedView, result.viewIndex);
            }
        });
    }

    renderView(viewName) {
        return new Promise(resolve => {

            for (let i = 0; i < this.views.length; i++) {
                if (this.views[i].properties.name == viewName) {
                    // console.log(this.views)
                    document.querySelector('.mob-header').style.display = this.views[i].properties.header ? 'block' : 'none';
                    document.querySelector('.mob-content').style.top = this.views[i].properties.header ? '70px' : '0px';
                    return resolve({renderedView: this.views[i], viewIndex: i});
                }
            }
            return resolve(false);
        });
    }

    closeView(viewName) {

    }

    animateViewSwitch(renderedView, viewIndex) {
        if (this.currentView) {
            document.querySelector(`#mob-view-${this.currentView}`).style.display = 'none';
        }

        if (!renderedView.loaded) {
            document.querySelector('.mob-content').innerHTML += renderedView.view;
        }
        document.querySelector('#mob-header-text').innerHTML = renderedView.properties.name;
        document.querySelector(`#mob-view-${renderedView.name}`).style.display = 'block';

        this.currentView = renderedView.name;
        this.navigating = false;
        this.views[viewIndex].loaded = true;
        if (this.views[viewIndex].properties.onload) {
            this.views[viewIndex].properties.onload();
        }
    }
    /**
     * @param {MobileifyView} view 
     */
    addView(view) {
        this.views.push(view);
    }
}

class MobileifyView {

    constructor(properties, html) {
        this.properties = properties;
        this.name = this.properties.name.replace(' ', '_').toLowerCase();
        this.loaded = false;
        this.view = `<div class="mobileify mob-view" id="mob-view-${this.name}">${html}</div>`;
    }

}