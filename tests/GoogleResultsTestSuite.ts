import { slow, suite, test, timeout } from 'mocha-typescript';
import { By, until, WebElement }      from 'selenium-webdriver';
import { BaseTestSuite }              from 'browserstack-automate-typescript-base';

// https://mochajs.org/api/mocha#timeout
// https://mochajs.org/api/mocha#slow
// ...
@suite(timeout(60000))
class GoogleResultsTestSuite extends BaseTestSuite {

    protected static async before(): Promise<void> {
        await super.before();
        // Add here logic that needs to run before running the tests
        await this.getBrowser().get('https://www.google.com');
    }

    async before(): Promise<void> {
        // Add logic that needs to run before each test
    }

    @test(timeout(10000), slow(3500))
    public async isBrowserstackWebsiteFirstResult() {
        // Find form
        const form: WebElement = await this.browser.findElement(By.css('form[action="/search"]'));
        // Input search query
        await form.findElement(By.css('input[name="q"]')).sendKeys('browserstack');
        // Submit form
        await form.findElement(By.css('input[type="submit"]')).click();
        // Wait till new page is loaded by waiting for an element that is expected to be there
        const main = await this.browser.wait(until.elementLocated(By.css(`#res[role="main"] > #search`)), 2000);
        // Get an item that needs te be tested
        const firstSearchResult = await main.findElement(By.css('#rso > div:first-child'));
        const cite = await firstSearchResult.findElement(By.css('cite'));

        // Check of link of first result is for browserstack
        this.assert.isTrue((await cite.getText()).includes(`www.browserstack.com`));
    }
}
