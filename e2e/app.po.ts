import { browser, by, element, promise } from 'protractor';

/**
 * App page.
 */
export class AppPage {
  /**
   * Navigate to.
   */
  public navigateTo(): promise.Promise<any> {
    return browser.get('/');
  }

  /**
   * Get paragraph text.
   */
  public getParagraphText(): promise.Promise<any> {
    return element(by.css('app-root h1')).getText();
  }
}
