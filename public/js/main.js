var app;
const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
const times = ['', '8:15 - 9:15', '9:15 - 10:15', '10:30 - 11:30', '11:30 - 12:30', '13:00 - 14:00', '14:00 - 15:00', '15:15 - 16:15', '16:15 - 17:15', '17:30 - 18:30', '18:30 - 19:30'];
const quotes = ['We zijn jouw rooster aan het kweken', 'Jouw rooster, ergens diep in de VPN zooi', 'We zijn hard op zoek naar je rooster', 'Mooi dagje vandaag?', "Rooster al toegevoegd aan je homescreen?"];

var theme = new ThemeifyTheme(
    [
        // Mobileify element
        new ThemeifyElement(
            '.mobileify',
            new ThemeifyCss(
                'background-color: #ffffff; color: #000000;', // CSS Light theme
                'background-color: rgb(0, 1, 87); color: #c7c5ff;' // CSS Dark theme
            ),
        ),
        // Button element
        new ThemeifyElement(
            '.btn',
            new ThemeifyCss(
                'background-color: #c7c5ff; color: #ffffff;', // CSS Light theme
                'background-color: #c7c5ff; color: rgb(0, 1, 87);' // CSS Dark theme
            )
        )
    ]
);

function logIn() {
    var username, password;

    if (localStorage.getItem('username') && localStorage.getItem('password')) {
        username = localStorage.getItem('username');
        password = localStorage.getItem('password');
    } else {
        username = document.querySelector('#username').value;
        password = document.querySelector('#password').value;
    }


    if (!username || !password) {
        return alert("Voer graag uw leerlingnummer en wachtwoord in");
    }

    buildLoader('Rooster zoeken');

    const data = { username: username, password: password }

    localStorage.setItem('tempUsername', username);
    localStorage.setItem('tempPassword', password);

    new ExpressRequest(
        '/login',
        data,
        loginCallback
    );
}

function loginCallback(result) {

    if (result.error) {
        alert(result.error)
        return buildLogin();
    } else {

        localStorage.setItem('username', localStorage.getItem('tempUsername'));
        localStorage.setItem('password', localStorage.getItem('tempPassword'));

        localStorage.removeItem('tempUsername');
        localStorage.removeItem('tempPassword');

        buildSchedule(result);
    }
}

function buildLoader(title) {
    app = new MobileifyApp(
        {
            name: 'Rooster',
            description: 'Een net wat cleaner rooster',
            navbar: false
        },
        theme
    )

    app.addView(new MobileifyView(
        {
            name: title,
            header: true,
        },
        `
                <div class="trip margin"></div>
                <div class="margin" style="text-align: center">
                    <img style="width: 40%; height: auto; margin-bottom: 20px" src="assets/cat2.svg" />
                    <p>${quotes[Math.floor(Math.random() * quotes.length)]}</p>
                </div>
            `
    ));
}

function buildLogin() {

    app = new MobileifyApp(
        {
            name: 'Rooster',
            description: 'Een net wat cleaner rooster',
            navbar: true
        },
        theme

    );

    app.addView(new MobileifyView(
        {
            name: 'Rooster Login',
            header: true,
            navbar: {
                icon: 'assets/login.png'
            },
        },
        `
        <div class="margin days-holder">
        <input class="btn" style="width: 100%;" id="username" type="username" placeholder="Leerling nummer" />
        <input class="btn" style="width: 100%;" id="password" type="password" placeholder="Wachtwoord" />
        <p class="rule">Door op 'Log in' te klikken ga je akkoord met de <u onclick="app.changeView('Privacy')">privacy</u> pagina.</p>
        <button class="btn" style="width: 100%; "  onclick="logIn()" >Log in</button>
        </div>
        `
    ));

    app.addView(new MobileifyView(
        {
            name: 'Info',
            header: true,
            navbar: {
                icon: 'assets/help.png'
            }
        },
        `  
        <p class="rule">Deze site maakt het inzien van je GLR rooster 100x makkelijker.</p>
        <h3 class="rule"><strong>Waarom is het makkelijker?</strong></h3>
        <p class="rule">- Praktische web app</p>
        <p class="rule">- Eenmalig inloggen</p>
        <p class="rule">- Makkelijker overzicht</p>
        <p class="rule">- Wij bewaren jouw gegevens niet</p>
        <p class="rule">- Altijd een veilige SSL verbinding</p>
        `
    ));

    app.addView(new MobileifyView(
        {
            name: 'Privacy',
            header: true,
            navbar: {
                icon: 'assets/eye.png'
            }
        },
        `  
        <p class="rule">Deze site is niet aansprakelijk voor schade of verlies van uw gegevens.</p>
        <p class="rule">U gebruikt deze website op eigen risico.</p>
        <p class="rule">Indien u geen groen slotje (SSL) ziet in de adresbalk gebruikt u deze site niet.</p>
        <p class="rule">Deze site slaat uw wachtwoord en gegevens <b>niet</b> op. Alles wordt lokaal opgeslagen op uw mobiel of PC.</p>
        <p class="rule">Deze site werkt allèèn, er is geen aansluiting met derde partijen.</p>
        `
    ));

}

function buildSchedule(s) {

    app = new MobileifyApp(
        {
            name: 'Rooster',
            description: 'Een net wat cleaner rooster',
            navbar: true
        },
        theme
    );

    app.addView(new MobileifyView(
        {
            name: 'Rooster',
            header: true,
            navbar: {
                icon: 'assets/calender.png'
            },
        },
        scheduleBuilder(s)
    ));

    app.addView(new MobileifyView(
        {
            name: 'Profiel',
            header: true,
            navbar: {
                icon: 'assets/profile.png'
            },
            onload: setThemeSwitch
        },
        `
        <p class="rule">Bedankt voor het gebruiken van Rooster. Bekijk hier jouw profiel.</p>
        <p class="rule">Rooster slaat jouw gegevens <strong>niet</strong> op.</p>
        <p class="rule">Licht of donker?</p>
        <div class="onoffswitch rule">
        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" onclick="toggleTheme(this.checked)">
        <label class="onoffswitch-label" for="myonoffswitch"></label>
        </div>
        <button class="btn rule" onclick="logOut()" >Log uit</button>
        `
    ));

}

function scheduleBuilder(s) {
    var html = `
    <div style="padding: 20px;">
        <h2>${s.studentName}</h2>
        <p>${s.date}</p>
    </div>
        <div class="days-holder">
    `;

    for (let i = 0; i < 5; i++) {
        var c = 0;
        html += `
            <h2 style="margin-left: 10px; margin-bottom: 5px; margin-top: 20px;">${days[i]}</h2>
            <div class="day">
        `
        for (let z = 1; z < 10; z++) {
            if (s.lessons[z][i].subject) {
                c++;
                html += `
                <a class="day-subject"><h3>${z}e (${times[z]})</h3> ${s.lessons[z][i].subject}, ${s.lessons[z][i].classRoom}, ${s.lessons[z][i].teacher}, ${s.lessons[z][i].group}</a>
            `;
            }
        }
        if (c == 0) {
            html += `
            <a><h3>Makkelijk daggieeee </h3></a>
        `;
        }
        html += '</div>';
    }


    return html += '</div>';
}

function logOut() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    buildLogin();
}

function toggleTheme (checked) {
    checked = !checked;
    app.setTheme(checked ? 'light' : 'dark');
}
// Try automatic login
if (!localStorage.getItem('username') || !localStorage.getItem('password')) {
    buildLogin();
} else {
    logIn();
}

function setThemeSwitch () {
    document.querySelector('#myonoffswitch').checked = localStorage.getItem('ThemeifyTheme') == 'light' ? false : true ;
}
