import { test, expect } from '@playwright/test';
import { UploadPage } from './pageObjects/upload.page';


test.describe('Upload de arquivos', () => { 

  let uploadPage: UploadPage;

  test.beforeEach(async ({ page }) => {

    uploadPage = new UploadPage(page);
    await uploadPage.goToUploadPage();
    await uploadPage.captureConsoleLog();

  });

  test('Validar upload de arquivo com extensao diferente de .csv', async () => {

    const fileName = "teste.pdf"
    const expectedErrorMessage = "Apenas arquivos .csv são permitidos.";

    await uploadPage.uploadWrongFile(fileName);
    await uploadPage.captureErrorMessage('.file-error');

    const displayedMessage = uploadPage.getErrorMessage();
    expect(displayedMessage).toBe(expectedErrorMessage);

  });

  test('Validar upload de arquivo em branco', async () => {

    const fileName = "vazio.csv"
    const expectedErrorMessage = "O arquivo CSV está vazio e não pode ser processado.";

    await uploadPage.uploadFile(fileName, 1, '', 'button:text("Upload")');
    await uploadPage.captureErrorMessage('.success-message-container');

    const consoleMessage = uploadPage.getConsoleMessage();
    expect(consoleMessage).toBe(fileName);

    const displayedMessage = uploadPage.getErrorMessage();
    expect(displayedMessage).toContain(expectedErrorMessage);

    await uploadPage.clickButton('Fechar');

  });

  test('Validar upload de arquivo com os horários', async () => {

    const fileName = "ficheiro-horarios-teste.csv";
    const expectedMessage = "Horários atualizados com sucesso!";
    const botaoDetalhesLocator = 'Detalhes';
    const botaoApagarLocator = 'Apagar';
    const botaoEliminarLocator = 'Eliminar';
    const botaoCancelarLocator = 'Cancelar';

    await uploadPage.uploadFile(fileName, 1, '', 'button:text("Upload")');
    await uploadPage.captureErrorMessage('.success-message-container');

    const displayedMessage = uploadPage.getErrorMessage();
    expect(displayedMessage).toContain(expectedMessage);

    await uploadPage.clickButton('Fechar');

    const fileNameElement = await uploadPage.findElement(fileName);
    const botaoApagarElement = await uploadPage.findElement(botaoApagarLocator);
    
    await uploadPage.captureTableHeaders();

    const tableHeadersText = await uploadPage.getTableHeaders();
    const tableHeadersCount = await uploadPage.getTableHeadersCount();

    expect(tableHeadersCount).toBe(4);
    expect(tableHeadersText).toStrictEqual(['ID', 'Nome do Horário', 'Data de Upload Ordenar ', 'Ações']);

    await expect(fileNameElement).toBeVisible();
    await expect(botaoApagarElement).toBeVisible();

    await uploadPage.clickButton(botaoApagarLocator);
    await uploadPage.clickButton(botaoCancelarLocator);

    await uploadPage.clickButton(botaoApagarLocator);
    await uploadPage.clickButton(botaoEliminarLocator);

    await expect(fileNameElement).toHaveCount(0);
    await expect(botaoApagarElement).toHaveCount(0);

  });

  test('Validar upload de arquivo de estrutura em branco', async () => {
    const fileName = "vazio.csv"
    const expectedErrorMessage = "O arquivo CSV está vazio e não pode ser processado.";

    await uploadPage.clickButton('Alterar Estrutura das Salas');
    await uploadPage.uploadFile(fileName, 1, 'upload-salas', '.upload-container button:text("Upload")');

    const message = uploadPage.getElementByText(expectedErrorMessage);  
    expect(await message.textContent()).toBe('O arquivo CSV está vazio e não pode ser processado.');
    
    await uploadPage.clickButtonWithinContainer('.success-message-container', 'Fechar')
    
  });

  test('Validar upload de arquivo de estrutura diferente de CSV', async () => {
    const fileName = "teste.pdf"
    const expectedErrorMessage = "Apenas arquivos .csv são permitidos.";

    await uploadPage.clickButton('Alterar Estrutura das Salas');
    const uploadElement = (await uploadPage.findElementByRoleAndText('button', 'Upload')).nth(1);
    await uploadPage.uploadWrongStructureFile(fileName, 1, 'upload-salas', '.upload-container button:text("Upload")');

    const message = uploadPage.getElementByText(expectedErrorMessage);  
    expect(await message.textContent()).toBe('Apenas arquivos .csv são permitidos.');
    
    await expect(uploadElement).toBeDisabled();
    await uploadPage.clickButton('Fechar');
    
  });


  test('Validar upload de arquivo de estrutura de salas', async () => {

    const fileName = "ficheiro-estrutura-salas.csv";
    const successMessage = "Salas atualizadas com sucesso!";

    await uploadPage.clickButton('Alterar Estrutura das Salas');
    const uploadElement = (await uploadPage.findElementByRoleAndText('button', 'Upload')).nth(1);
    await expect(uploadElement).toBeDisabled();
    await uploadPage.clickButton('Fechar');

    await uploadPage.clickButton('Alterar Estrutura das Salas');
    await uploadPage.uploadFile(fileName, 1, 'upload-salas', '.upload-container button:text("Upload")');

    const message = uploadPage.getElementByText(successMessage);  
    expect(await message.textContent()).toBe('Salas atualizadas com sucesso!');
    const closeRoomsElement = await uploadPage.closeRoomsSuccess();
    await closeRoomsElement.click();
  });


});
