import { test, expect } from '@playwright/test';
import { UploadPage } from './pageObjects/upload.page';


test.describe('Upload de arquivos', () => { 

  let uploadPage: UploadPage;

  test.beforeEach(async ({ page }) => {

    uploadPage = new UploadPage(page);
    await uploadPage.goToUploadPage();
    await uploadPage.captureConsoleLog();

  });

  test('Upload de arquivo com extensao diferente de .csv', async () => {

    let fileName = "teste.pdf"
    let expectedErrorMessage = "Apenas arquivos .csv são permitidos.";

    await uploadPage.uploadWrongFile(fileName);
    await uploadPage.captureErrorMessage('.file-error');

    const displayedMessage = uploadPage.getErrorMessage();
    expect(displayedMessage).toBe(expectedErrorMessage);

  });

  test('Upload de arquivo em branco', async () => {

    let fileName = "vazio.csv"
    let expectedErrorMessage = "O arquivo CSV está vazio e não pode ser processado.";

    await uploadPage.uploadFile(fileName);
    await uploadPage.captureErrorMessage('.success-message-container');

    const consoleMessage = uploadPage.getConsoleMessage();
    expect(consoleMessage).toBe(fileName);

    const displayedMessage = uploadPage.getErrorMessage();
    expect(displayedMessage).toContain(expectedErrorMessage);

    await uploadPage.clickButton('Fechar');

  });

  test('Upload de arquivo com os horários', async () => {

    let fileName = "ficheiro-horarios-teste.csv"
    let expectedMessage = "Horários atualizados com sucesso!";

    await uploadPage.uploadFile(fileName);
    await uploadPage.captureErrorMessage('.success-message-container');

    const displayedMessage = uploadPage.getErrorMessage();
    expect(displayedMessage).toContain(expectedMessage);

    await uploadPage.clickButton('Fechar');


  });

  test('Validar o grid de horários carregados', async () =>{

    await uploadPage.captureTableHeaders();

    const tableHeadersText = await uploadPage.getTableHeaders();
    const tableHeadersCount = await uploadPage.getTableHeadersCount();

    expect(tableHeadersCount).toBe(4);
    expect(tableHeadersText).toBe("[ 'ID', 'Nome do Horário', 'Data de Upload', 'Ações' ]");

  });

  

});
