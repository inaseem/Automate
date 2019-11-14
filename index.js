const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;
const creds = require("./creds.json");
const chrome = require("selenium-webdriver/chrome");

// Setting Chrome Options For A Test Profile Names Tony I Created For This Experiment
const options = new chrome.Options();
options.addArguments(
    "--user-data-dir=C:/Users/hp/AppData/Local/Google/Chrome/User Data/Profile 1"
);
const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build();

const handleLogin = async () => {
    await driver.get("https://www.facebook.com/groups/184139591763145/");
    let emailInput = await driver.findElement(By.id("email"));
    let passInput = await driver.findElement(By.id("pass"));
    await emailInput.sendKeys(creds.email);
    await passInput.sendKeys(creds.password);
    let loginButton = await driver.findElement(By.id("loginbutton"));
    await loginButton.click();
};

let steps = async () => {
    try {
        // Already Logged In So Won't Be Running This Function
        // await handleLogin();
        await driver.get(
            "https://www.facebook.com/groups/184139591763145/requests/"
        );

        // await driver.wait(
        //     new Promise((resolve, reject) => {
        //         driver
        //             .executeScript("return document.readyState")
        //             .then(res => {
        //                 console.log(`Page loading ${res}`);

        //                 resolve(res);
        //             })
        //             .catch(e => {
        //                 console.log(e);
        //                 reject(e);
        //             });
        //     })
        // );
        await driver.wait(
            until.elementLocated(By.className("_4k1_ img _8o _8r"))
        );
        let totalRequests = await driver.findElement(
            By.className("_4k1_ img _8o _8r")
        );
        let requests = (await totalRequests.getText()).match(/\d+/g);
        if (requests > 0) {
            await driver.wait(until.elementLocated(By.name("approve_all")));
            let approve_button = await driver.findElement(
                By.name("approve_all")
            );
            await approve_button.click();
            await driver.wait(
                until.elementLocated(By.className("_4-i2 _pig  _50f4"))
            );
            let numberOfMembers = await driver.findElement(
                By.className("_4-i2 _pig  _50f4")
            );
            const msg = await numberOfMembers.getText();
            let confirm_button = await driver.findElement(
                By.className(
                    "layerConfirm _4jy0 _4jy3 _4jy1 _51sy selected _42ft"
                )
            );
            await confirm_button.click();
            console.log(`Approved Members Requests = ${msg.match(/\d+/g)}`);
            clearTimeout(3000)
            driver.quit();
        } else {
            console.log("No New Request");
            clearTimeout(5000)
            driver.quit();
        }
    } catch (e) {
        driver.quit();
        console.log(e);
    }
};
steps();
