import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class UploadPage {
  private page: Page;
  private consoleMessage: string = '';
  private errorMessage: string = '';
  private successMessage: string = '';
  private headers;

  constructor(page: Page) {
    this.page = page;
    this.headers = this.page.locator('table thead tr th');
  }

  async goToUploadPage() {
    await this.page.goto('http://localhost:4200/upload');
  }

  async uploadWrongFile(file: string){

    const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        this.page.locator('#fileUpload').click(),
      ]);
  
      await fileChooser.setFiles([file]);

  }

  async uploadFile(file: string, index: number, containerSelector: string = '', uploadLocator: string = '') {
  
    const uploadButton = this.page.locator(uploadLocator);
    const fileUploadLocator = this.page.locator(`${containerSelector ? containerSelector + ' ' : ''}#fileUpload:nth-of-type(${index})`);
  
    await fileUploadLocator.waitFor({ state: 'visible' });

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      fileUploadLocator.click(),
    ]);
  
    await fileChooser.setFiles([file]);
    await uploadButton.click();

  }

  async captureConsoleLog() {

    // Escutando as mensagens do console
    this.page.on('console', (msg) => {
      if (msg.type() === 'log') {
        this.consoleMessage = msg.text(); // Captura a mensagem de log
      }
    });
  }

  getConsoleMessage(): string {
    return this.consoleMessage;
  }

  async captureErrorMessage(locator: string){
    const message = await this.page.locator(locator).innerText();
    this.errorMessage = message ?? "";
  }

  getErrorMessage(): string{
    return this.errorMessage;
  }

  async clickButton(locator: string){
    await this.page.getByRole('button', {name: locator}).click(); 
  }

  async clickButtonWithinContainer(containerSelector, buttonName) {
    await this.page
    .locator(containerSelector)
    .getByRole('button', { name: buttonName })
    .click();
  }

  
  async captureTableHeaders(){
     this.headers = this.page.locator('table thead tr th');
  }

  async getTableHeaders(): Promise<string[]>{
    const headerTexts = await this.headers.allTextContents();
    return headerTexts;
  }

  async getTableHeadersCount(): Promise<number> {
    return await this.headers.count();
  }

  async findElement(locator: string){
    return this.page.getByText(locator);
  }

  async findElementByRoleAndText(role: string, name: string) {
  return this.page.locator(`role=${role}[name=${name}]`);
}

  async countElements(){
    const elements = await this.page.locator('#fileUpload').all();
    console.log(elements.length);
  }

  async captureMessage(locator: string){
    const message = await this.page.locator(locator).textContent();
    this.successMessage = message ?? "";

  }

  getMessage(): string{
    return this.successMessage;
  }

  getElementByText(expectedMessage: string){
    const message = this.page.getByText(expectedMessage);
    return message;
  }

  async closeRoomsSuccess(){
    const successModalCloseButton = this.page.locator('app-success-error-modal').filter({ hasText: 'Salas atualizadas com sucesso' }).getByRole('button');      
    return successModalCloseButton;
  }

  async uploadWrongStructureFile(file: string, index: number, containerSelector: string = '', uploadLocator: string = '') {
  
    const fileUploadLocator = this.page.locator(`${containerSelector ? containerSelector + ' ' : ''}#fileUpload:nth-of-type(${index})`);

    await fileUploadLocator.waitFor({ state: 'visible' });

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      fileUploadLocator.click(),
    ]);
  
    await fileChooser.setFiles([file]);

  }



}