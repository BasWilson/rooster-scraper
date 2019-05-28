function setTheme(themeId) {

    switch (themeId) {
        case 0:
            console.log('Night time')
            document.body.style.backgroundColor = 'rgb(0, 1, 87)';
            document.body.style.color = '#c7c5ff';
            break;
        case 1:
            console.log('Day time')
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
        default:
            break;
    }
}
setTheme(0);

var app;

const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
const times = ['', '8:15 - 9:15', '9:15 - 10:15', '10:30 - 11:30', '11:30 - 12:30', '13:00 - 14:00', '14:00 - 15:00', '15:15 - 16:15', '16:15 - 17:15', '17:30 - 18:30', '18:30 - 19:30'];
const quotes = ['We zijn jouw rooster aan het kweken', 'Jouw rooster, ergens diep in de VPN zooi', 'We zijn hard op zoek naar je rooster', 'Mooi dagje vandaag?', "Rooster toevoegen aan je homescreen? Check 'help'"]
function logIn () {
    var username, password;

    if (Cookies.get('username') && Cookies.get('password')) {
        username = Cookies.get('username');
        password = Cookies.get('password');
    } else {
        username = document.querySelector('#username').value;
        password = document.querySelector('#password').value;
    }


    if (!username || !password) {
        return alert("Voer graag uw leerlingnummer en wachtwoord in");
    }

    buildLoader('Rooster zoeken');

    const data = {username: username, password: password}

    Cookies.set('tempUsername', username);
    Cookies.set('tempPassword', password);

    new ExpressRequest(
        '/login',
        data,
        loginCallback
    );
}

function loginCallback(result) {
   
    console.log(result)
    if (result.error) {
        alert(result.error)
        return buildLogin();
    } else {

        Cookies.set('username', Cookies.get('tempUsername'));
        Cookies.set('password', Cookies.get('tempPassword'));

        Cookies.remove('tempUsername');
        Cookies.remove('tempPassword');

        buildSchedule(result);
    }
}

function buildLoader (title) {
    app = new MobileifyApp(
        {
            name: 'Rooster',
            description: 'Een net wat cleaner rooster',
            primaryColor: 'rgb(0, 1, 87)',
            secondaryColor: '#c7c5ff',
            navbar: false
        })
    
        app.addView(new MobileifyView(
            {
                name: title,
                header: true,
            },
            `
                <div class="trip margin"></div>
                <div class="margin" style="text-align: center">
                    <img style="width: 40%; height: auto; margin-bottom: 20px" src="cat2.svg" />
                    <p>${quotes[Math.floor(Math.random() * quotes.length)]}</p>
                </div>
            `
        ));  
}

function buildLogin () {

    app = new MobileifyApp(
        {
            name: 'Rooster',
            description: 'Een net wat cleaner rooster',
            primaryColor: 'rgb(0, 1, 87)',
            secondaryColor: '#c7c5ff',
            navbar: true
        }
    
    );
    
    app.addView(new MobileifyView(
        {
            name: 'Rooster Login',
            header: true,
            navbar: {
                icon: 'login.png'
            },
        },
        `
        <div class="margin days-holder">
        <input class="btn" style="width: 100%;" id="username" type="username" placeholder="Leerling nummer" />
        <input class="btn" style="width: 100%;" id="password" type="password" placeholder="Wachtwoord" />
        <p class="rule">Door op 'Log in' te klikken ga je akkoord met de <u onclick="app.changeView('Privacy')">privacy</u> pagina.</p>
        <button class="btn" style="width: 100%;"  onclick="logIn()" >Log in</button>
        </div>
        `
    ));
    
    app.addView(new MobileifyView(
        {
            name: 'Info',
            header: true,
            navbar: {
                icon: 'help.png'
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
                icon: 'eye.png'
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

function buildSchedule (s) {

    app = new MobileifyApp(
        {
            name: 'Rooster',
            description: 'Een net wat cleaner rooster',
            primaryColor: 'rgb(0, 1, 87)',
            secondaryColor: '#c7c5ff',
            navbar: true
        }
    );
    
    app.addView(new MobileifyView(
        {
            name: 'Rooster',
            header: true,
            navbar: {
                icon: 'calender.png'
            },
        },
        scheduleBuilder(s)
    ));
    
    app.addView(new MobileifyView(
        {
            name: 'Profiel',
            header: true,
            navbar: {
                icon: 'profile.png'
            },
        },
        `
        <p class="rule">Bedankt voor het gebruiken van Rooster. Bekijk hier jouw profiel.</p>
        <p class="rule">Rooster slaat jouw gegevens <strong>niet</strong> op.</p>
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
        <div class="days-holder" style="margin-bottom: 150px;">
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
            <a><h3>Makkelijk daggieeee</h3></a>
        `;
        }
        html += '</div>';
    }


    return html += '</div>';
}

// Try automatic login
if (!Cookies.get('username') || !Cookies.get('password')) {
    buildLogin();
} else {
    logIn();
}


function logOut() {
    Cookies.remove('username');
    Cookies.remove('password');

    buildLogin();
}