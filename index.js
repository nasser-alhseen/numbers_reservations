const puppeteer = require('puppeteer')
const TelegramBot = require('node-telegram-bot-api');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


const token = '6582823602:AAFN1N_aI0uXKobKXre1-MptWlSKRo8D8no';
var newNumbers = []
var storedNumbers = [];
let counter = 0;

const ratebChatID = 1631333030;
const nasser = 1462861733;
const user = 1805120604

const bot = new TelegramBot(token, { polling: true });


// bot.onText(/\/echo (.+)/, (msg, match) => {


//     const chatId = msg.chat.id;


//     bot.sendMessage(chatId, resp);
// });
// // messages.
bot.on('message', (msg) => {
    const processes = msg.text.split('*')
    processes.forEach((element) => {
        const data = msg.text.split('-')
        console.log(data);
        const number = data[0];
        const id = data[1];
        const fName = data[2];
        const lName = data[3];
        const fatherName = data[4];
        const motherName = data[5];
        const phoneNumber = data[6];
        const dobDay = data[7];
        const dobMonth = data[8];
        const dobYear = data[9];
        const code = data[10];
        const dataOb = {
            "number": number,
            "id": id,
            "firstName": fName,
            "lastName": lName,
            "fatherName": fatherName,
            "motherName": motherName,
            "phoneNumber": phoneNumber,
            "dobDay": dobDay,
            "dobMonth": dobMonth,
            "dobYear": dobYear,
            "code": code
        };
        console.log(dataOb)
        bookNumber(dataOb).then(_ => bot.sendPhoto(msg.chat.id, "./images/screenMtc.jpg"))
    })


});

async function getIndex(value, id) {
    var selectElement = document.querySelector();
    var options = selectElement.options;

    for (var i = 0; i < options.length; i++) {
        if (options[i].text === value) {
            await page.$eval
        }
    }

}
async function bookNumber(data) {
    ;
    const browser = await puppeteer.launch({
        headless: true,
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    })
    const page = await browser.newPage()
    await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });
    await Promise.all([
        page.waitForNavigation(),
        page.click("#numbers > input[type=button]:nth-child(10)"),
        page.setViewport({
            width: 1080,
            height: 1920,
            deviceScaleFactor: 1
        })

    ]);
    await page.$eval('#available-Numbers > div > select', (element, data) => {
        var options = element.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].text === data.number) {
                element.selectedIndex = i;
            }
        }

    }, data);

    await page.$eval('#divID > input[type=text]', (el, data) => el.value = data.id, data);
    await page.$eval('#divReID > input[type=text]', (el, data) => el.value = data.id, data);
    page.click("#id-submit > input[type=BUTTON]"),
        await page.waitForNavigation(),
        await page.waitForSelector("#divFName > input[type=text]")
    await page.$eval('#divFName > input[type=text]', (el, data) => el.value = data.firstName, data);
    await page.$eval('#divFatherName > input[type=text]', (el, data) => el.value = data.fatherName, data);
    await page.$eval('#divLName > input[type=text]', (el, data) => el.value = data.lastName, data);
    await page.$eval('#divMother > input[type=text]', (el, data) => el.value = data.motherName, data);
    await page.$eval('#divrefnb > input[type=text]', (el, data) => el.value = data.phoneNumber, data);
    await page.$eval("#divdob > input", (el, data) => el.value = data.dobYear, data);

    await page.$eval('#divdob > div.styleSelect.daySelect > select', (element, data) => {
        var options = element.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].text === data.dobDay) {
                element.selectedIndex = i;
            }
        }

    }, data);
    await page.$eval("#divdob > div:nth-child(3) > select", (element, data) => {
        var options = element.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].text === data.dobMonth) {
                element.selectedIndex = i;
            }
        }

    }, data);

    page.click("#SubButL"),
        await page.waitForNavigation();

    await page.$eval("#divID > input[type=text]:nth-child(2)", (el, data) => el.value = data.code, data);


    page.click("#divID > input[type=BUTTON]:nth-child(4)"),
        await page.waitForNavigation();
    await page.setViewport({
        width: 1080,
        height: 500,
    });
    await page.screenshot({ path: `./images/screenMtc.jpg` });
    await browser.close()




}

async function start() {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    },)
    const page = await browser.newPage()
    await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });
    await Promise.all([
        page.waitForNavigation(),
        page.click("#numbers > input[type=button]:nth-child(10)"),
        page.setViewport({
            width: 1000,
            height: 10000,
            deviceScaleFactor: 1
        })

    ]);
    var nums = await page.evaluate(() => { return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text) });
    async function numbersFilter() {
        if (localStorage.getItem("nums") != null) {
            storedNumbers = JSON.parse(localStorage.getItem("nums"));

            for (i of nums) {
                if (!storedNumbers.includes(i)) {
                    newNumbers.push(i);
                    storedNumbers.push(i)

                }
            }
            localStorage.setItem("nums", JSON.stringify(storedNumbers));
        } else {
            newNumbers = nums;
            storedNumbers = nums;
            localStorage.setItem("nums", JSON.stringify(storedNumbers));


        }
    }
    await numbersFilter()


    await browser.close()
    if (newNumbers.length > 0)
        await sendNotifications()


}
async function start03() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    })
    const page = await browser.newPage()
    await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });
    await Promise.all([
        page.waitForNavigation(),
        await page.$eval('#id1', el => el.value = 0),
        // await page.$eval('#num2', el => el.value = 3),
        page.click("#numbers > input[type=button]:nth-child(10)"),
        page.setViewport({
            width: 1000,
            height: 10000,
            deviceScaleFactor: 1
        })

    ]);
    var nums = await page.evaluate(() => { return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text) });
    async function numbersFilter() {
        if (localStorage.getItem("nums") != null) {
            storedNumbers = JSON.parse(localStorage.getItem("nums"));
            for (i of nums) {
                if (!storedNumbers.includes(i)) {
                    newNumbers.push(i);
                    storedNumbers.push(i)

                }
            }
            localStorage.setItem("nums", JSON.stringify(storedNumbers));
        } else {
            newNumbers = nums;
            storedNumbers = nums;
            localStorage.setItem("nums", JSON.stringify(storedNumbers));


        }
    }
    await numbersFilter()

    await browser.close()
    if (newNumbers.length > 0) {
        await sendNotifications()

    }


}
async function sendNotifications() {
    let c = 0
    var list = rearrangeNumbers(newNumbers);
    if (newNumbers.length > 0) {

        if (list.length > 30) {
            for (let i = 0; i < list.length; i += 30) {
                const chunk = list.slice(i, i + 30);

                // Perform an action on the chunk
                // bot.sendMessage(ratebChatID, chunk.join(' '));
                // bot.sendMessage(user, chunk.join(' '));

                // bot.sendMessage(me, 'nasser');
                console.log(chunk)

            }
        }

        // Handle any remaining elements
        const remaining = list.slice((Math.floor(list.length / 30)) * 30);
        if (remaining.length > 0) {
            // Perform an action on the remaining elements
            // bot.sendMessage(ratebChatID, remaining.join(' '));
            // bot.sendMessage(user, remaining.join(' '));
            console.log(remaining)




        }
    }





}

setInterval(() => {
    start03().then(() => {
        newNumbers = [];
        storedNumbers = [];
    })

}, 17 * 1000);



function rearrangeNumbers(numbers) {
    // Convert the numbers to an array of strings
    const nums = numbers.map(Number);

    // Sort the numbers in ascending order
    nums.sort((a, b) => a - b);

    // Initialize variables
    let prevNum = nums[0];
    let currGroup = [prevNum];
    let groups = [currGroup];

    // Group the numbers based on proximity to each other
    for (let i = 1; i < nums.length; i++) {
        const currNum = nums[i];
        const diff = currNum - prevNum;

        if (diff <= 1) {
            currGroup.push(currNum);
        } else {
            currGroup = [currNum];
            groups.push(currGroup);
        }

        prevNum = currNum;
    }

    // Flatten the groups into a single array
    const result = groups.reduce((acc, group) => acc.concat(group), []);

    // Return the rearranged numbers as a string
    return result
}

