/**
 * SCRIPT PARA INTEGRAÇÃO COM GOOGLE SHEETS
 * 
 * Siga os passos abaixo para configurar:
 * 1. Abra o Google Drive e crie uma nova Planilha (ou use a existente).
 * 2. Vá em "Extensões" > "Apps Script".
 * 3. Apague todo o código que estiver lá e cole o código abaixo.
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Selecione o tipo "App da Web" (ícone de engrenagem).
 * 6. Em "Quem pode acessar", selecione "Qualquer pessoa".
 * 7. Clique em "Implantar" e autorize o acesso à sua conta do Google.
 * 8. Copie a URL gerada ("URL do app da Web").
 * 9. Cole essa URL no arquivo `src/cadastro.js` na variável `WEBHOOK_URL`.
 */

const SHEET_ID = '1IL_rrbcBVlJnuQWtEWrjbbS3f7E7pzKNNRn6pNTMbc8'; // ID da sua planilha

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Se a planilha estiver vazia, cria o cabeçalho
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Data de Envio", "Empresa", "Responsável", "Segmento", "Cidade", 
        "WhatsApp", "Já Investe?", "Faturamento", "Equipe Comercial", 
        "Objetivo 6 Meses", "Perfil Decidido?", "Observações"
      ];
      sheet.appendRow(headers);
    }

    // Adiciona os dados na ordem do cabeçalho
    const row = [
      data.data_envio || new Date().toISOString(),
      data.empresa || "",
      data.responsavel || "",
      data.segmento || "",
      data.cidade || "",
      data.whatsapp || "",
      data.investe_trafego || "",
      data.faturamento || "",
      data.equipe_vendas || "",
      data.objetivo || "",
      data.perfil_decidido || "",
      data.observacoes || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Prospect cadastrado." }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Isso permite que você teste o script visitando a URL no navegador
function doGet(e) {
  return ContentService.createTextOutput("Webhook está ativo e funcionando. Envie um POST com os dados JSON.")
                       .setMimeType(ContentService.MimeType.TEXT);
}
