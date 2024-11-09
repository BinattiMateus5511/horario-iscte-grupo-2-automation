import { Page } from '@playwright/test';

export class UploadPage {
  private page: Page;
  private consoleMessage: string = '';
  private errorMessage: string = '';
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

  async uploadFile(file: string){

    const uploadButton = this.page.locator('button:text("Upload")');

    const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        this.page.locator('#fileUpload').click(),
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


}