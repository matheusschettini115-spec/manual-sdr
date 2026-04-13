document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prospect-form');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackMsg = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        feedbackMsg.className = 'feedback-msg';
        feedbackMsg.style.display = 'none';

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.data_envio = new Date().toISOString();

        // ----------------------------------------------------------------------
        // INSTRUÇÕES PARA INTEGRAÇÃO COM GOOGLE SHEETS
        // Substitua a URL abaixo pela sua URL do Webhook (n8n, Make, Zapier) 
        // ou pela URL do Google Apps Script configurado para sua planilha
        // Planilha Alvo: 1IL_rrbcBVlJnuQWtEWrjbbS3f7E7pzKNNRn6pNTMbc8
        // ----------------------------------------------------------------------
        const WEBHOOK_URL = 'COLOQUE_AQUI_A_URL_DO_SEU_WEBHOOK_OU_APPS_SCRIPT'; 

        try {
            if (WEBHOOK_URL === 'COLOQUE_AQUI_A_URL_DO_SEU_WEBHOOK_OU_APPS_SCRIPT') {
                throw new Error("A URL do Webhook/Google Sheets não foi configurada no arquivo src/cadastro.js.");
            }

            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                mode: 'no-cors' // Use no-cors for simple Google Apps Script setups
            });

            // Assuming success if it doesn't throw a network error 
            // no-cors will return an opaque response with status 0
            showFeedback('Prospect cadastrado com sucesso!', 'success');
            form.reset();

        } catch (error) {
            console.error('Erro ao enviar form:', error);
            showFeedback('Erro: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Cadastro para Planilha';
        }
    });

    function showFeedback(message, type) {
        feedbackMsg.textContent = message;
        feedbackMsg.className = `feedback-msg ${type}`;
        feedbackMsg.style.display = 'block';
        
        // Auto hide after 5 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                feedbackMsg.style.display = 'none';
            }, 5000);
        }
    }
});
