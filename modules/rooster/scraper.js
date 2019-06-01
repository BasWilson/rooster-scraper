const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require('cheerio');
var striptags = require('striptags');

class Schedule {
    constructor(studentName, date) {
        this.studentName = studentName;
        this.date = date;
        this.lessons = [[]];
    }

    /**
     * Returns the lesson at a certain time on a certain day. Days range from 0 to 4 (mo - fr). Hours range from (1 - 10)
     * @param {int} dayOfTheWeek 
     * @param {int} hourOfTheDay 
     */
    findLesson(dayOfTheWeek, hourOfTheDay) {
        return this.lessons[hourOfTheDay][dayOfTheWeek];
    }
}

module.exports = {
    newRetriever: async function (user, pass) {

        return new Promise(
            async function (resolve, reject) {

                // If the session ID is found switch this to true.
                var foundSession = false;
                var sessionPage;

                // Puppeteer browser
                const browser = await puppeteer.launch({ headless: true });

                browser.on('targetcreated', async function () {
                    // Wait 500ms
                    await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](500)
                    // Check the pages
                    const pages = await browser.pages();
                    for (let i = 0; i < pages.length; i++) {

                        // Find the session page
                        if (pages[i].url().includes('f5-w-')) {
                            if (!foundSession) {
                                console.log('found session page', pages[i].url())
                                foundSession = true;
                                // Create the session page with the auth
                                sessionPage = await browser.newPage();

                                await sessionPage.authenticate({
                                    username: user,
                                    password: pass
                                });

                                // Navigate to the session page (portal page)
                                await sessionPage.goto(pages[i].url());

                                // Navigate to schedule page
                                const schedulePage = await browser.newPage();
                                await schedulePage.goto(sessionPage.url() + "Pages/Rooster.aspx");

                                var content = await schedulePage.content();
                                await browser.close();

                                // Scrape the content

                                // Name and date
                                const $ = cheerio.load(content);
                                const name = $('.listitem_header').text().replace('Rooster voor student ', '').replace(' (overzicht)', '');
                                if (!name)
                                    return resolve({error: 'Er is een fout met VPN, probeer het nog een keer.'});
                                const date = $('.listitem_even').first().text();

                                // New schedule object
                                var s = new Schedule(name, date);

                                // Loop through the 10 hours
                                for (let hCount = 1; hCount < 10; hCount++) {

                                    // Create the 2dArray, so all 
                                    // lessonHour 1's will be together in s.lessons[0]
                                    // lessonHour 2's will be together in s.lessons[1]
                                    // etc
                                    s.lessons.push([]);

                                    $("td[title='Lesuur: " + hCount + "']").each(function () {
                                        var htmlString = $(this).html();
                                        s.lessons[hCount].push(formatSubjectString(htmlString))
                                    });

                                }

                                console.log('Rooster opgehaald voor: ' + s.studentName)
                                var d = new Date();
                                if (!fs.existsSync('./logs/'+d.toLocaleDateString().replace(/\//g, '-') + '.txt'))
                                    fs.writeFileSync('./logs/'+d.toLocaleDateString().replace(/\//g, '-') + '.txt', '');
                                    
                                var log = fs.readFileSync('./logs/'+d.toLocaleDateString().replace(/\//g, '-') + '.txt');
                                log += s.studentName + ' | ' + d.toLocaleString() + '\n';
                                fs.writeFileSync('./logs/'+d.toLocaleDateString().replace(/\//g, '-') + '.txt', log);
                                return resolve(s);
                            }
                        }
                    }
                });

                // Login to VPN
                const loginPage = await browser.newPage();

                await loginPage.goto('https://vpn.glr.nl/');
                await loginPage.type('.credentials_input_text', user);
                await loginPage.type('.credentials_input_password', pass);
                await loginPage.click('.credentials_input_submit');

                await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](1000)

                // Check if login was ok
                const content = await loginPage.content();

                if (content.toString().includes('Please try again.')) {
                    return resolve({error: 'Je leerlingnummer of wachtwoord is incorrect.'});
                }

                // Open and login to portal
                await loginPage.click("span[id*='/DMZ/portal.glr.nl']");


            })

    }
}


function formatSubjectString(string) {
    var array = string.split('<br>');
    return {
        subject: striptags(array[0]).replace('!', '⚠️'),
        teacher: striptags(array[2]).replace('!', '⚠️'),
        classRoom: striptags(array[1]).replace('!', '⚠️'),
        group: striptags(array[3]).replace('!', '⚠️')
    }
}



// prePortalPage.click("span[id*='/DMZ/portal.glr.nl']").then(() => {
