import { test, expect } from '@playwright/test';
import { UploadPage } from './pageObjects/upload.page';


test.describe('Upload de arquivos', () => { 

  let uploadPage: UploadPage;

  test.beforeEach(async ({ page }) => {

    uploadPage = new UploadPage(page);
    await uploadPage.goToUploadPage();
    await uploadPage.captureConsoleLog();

  });

  test('Validar o grid de horários carregados', async () =>{

    await uploadPage.captureTableHeaders();

    const tableHeadersText = await uploadPage.getTableHeaders();
    const tableHeadersCount = await uploadPage.getTableHeadersCount();

    expect(tableHeadersCount).toBe(4);
    expect(tableHeadersText).toStrictEqual(['ID', 'Nome do Horário', 'Data de Upload', 'Ações']);

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

    await uploadPage.uploadFile(fileName, 1);
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

    await uploadPage.uploadFile(fileName, 1);
    await uploadPage.captureErrorMessage('.success-message-container');

    const displayedMessage = uploadPage.getErrorMessage();
    expect(displayedMessage).toContain(expectedMessage);

    await uploadPage.clickButton('Fechar');

    const fileNameElement = await uploadPage.findElement(fileName);
    const botaoDetalhesElement = await uploadPage.findElement(botaoDetalhesLocator);
    const botaoApagarElement = await uploadPage.findElement(botaoApagarLocator);
    
    await expect(fileNameElement).toBeVisible();
    await expect(botaoDetalhesElement).toBeVisible();
    await expect(botaoApagarElement).toBeVisible();

    await uploadPage.clickButton(botaoApagarLocator);
    await uploadPage.clickButton(botaoCancelarLocator);

    await uploadPage.clickButton(botaoApagarLocator);
    await uploadPage.clickButton(botaoEliminarLocator);

    await expect(fileNameElement).toHaveCount(0);
    await expect(botaoDetalhesElement).toHaveCount(0);
    await expect(botaoApagarElement).toHaveCount(0);

  });

  test('Validar upload de arquivo de estrutura de salas', async () => {

    const fileName = "ficheiro-estrutura-salas.csv";

    await uploadPage.clickButton('Alterar Estrutura das Salas');
    const uploadElement = (await uploadPage.findElementByRoleAndText('button', 'Upload')).nth(1);
    await expect(uploadElement).toBeDisabled();
    await uploadPage.clickButton('Fechar');

    await uploadPage.clickButton('Alterar Estrutura das Salas');
    await uploadPage.uploadFile(fileName, 1, 'upload-salas');
    await uploadElement.click();
    
    await uploadPage.captureErrorMessage('.success-message-container');
    
    

  });


});
