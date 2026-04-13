const MANUAL_TEXT = `
MANUAL ESTRATÉGICO DO SDR | ACALANTIS

1. MENTALIDADE E POSICIONAMENTO ESTRATÉGICO
- Nome: Acalantis significa "Senhor dos Pássaros". Simboliza o predador de topo, a precisão e a visão de longo alcance para domínio de mercado.
- Atributos: Visão de Mercado (antecipar tendências), Escala Sólida (processos previsíveis) e Foco em Resultado (ROI real).
- Público-Alvo: Decisores estratégicos (35-50 anos) que buscam clareza profissional e solidez comercial.

2. DIFERENCIAL: BLINDAGEM DE TERRITÓRIO
- Conceito: Exclusividade geográfica total. Atendemos apenas UM cliente por nicho em cada região estratégica.
- Argumento: "Meu compromisso é com o seu domínio. Quando você escala com a Acalantis, o céu da sua região é exclusivamente seu."

3. ACELERADORES DE ESCALA (SOLUÇÕES)
- Google Ads: Foco em VENDA IMEDIATA. Captura a demanda reprimida no momento da busca.
- Meta Ads: Foco em DEMANDA E AUTORIDADE. Escala faturamento através de desejo e presença inabalável.
- TikTok Ads: Foco em VIRALIZAÇÃO E VOLUME. Ideal para lançamentos e escala rápida de audiência.
- Design de Autoridade: Transformação de redes sociais em vitrines premium magnéticas para leads qualificados.

4. REGRAS COMERCIAIS
- Ticket Médio: R$ 1.500,00/mês.
- Fidelidade: Contrato de 6 meses (tempo mínimo para maturação de ativos).
- Comissão SDR: 50% do valor do primeiro mês.

5. PROTOCOLO DE QUALIFICAÇÃO (O FILTRO DE ELITE)
I. Blindagem: Localização e verificação de concorrência ativa na região.
II. Diagnóstico de Gap: Identificação do gargalo (Leads, Processo ou Marca), histórico e prontidão operacional.
III. Alinhamento: Verba de gestão (R$1.500), verba de mídia e mindset de escala (Longo Prazo).

6. GUIA DE CONDUÇÃO DE CONVERSA (O VOO DA VENDA)
I. Gatilhos: Exclusividade (Reserva de nicho/região), Autoridade (Visão Acalantis) e Escassez (Poucas vagas de onboarding).
II. Fase 1 (Situação): Entender fluxo atual, indicações vs anúncios.
III. Fase 2 (Problema): Falta de posicionamento, custo de inércia.
IV. Fase 3 (Implicação): Concorrente fechando vaga de exclusividade.
V. Fase 4 (Necessidade): Estratégia multicanal resolutiva.
VI. Resumo de Objeções: "6 meses é longo" -> "Consistência e maturação exigem tempo". "Vou pensar" -> "Vaga fica aberta só até o 1º fechamento".

7. PROTOCOLO DE AGENDAMENTO
- Único Objetivo: Vender o "Diagnóstico de Viabilidade de Escala".
- Técnica: Controle de agenda com sugestão de dois horários (Terça 14h ou Quarta 10h).
- Fechamento: Link do Calendly (https://calendly.com/matheusschettini115/propesct).

CONTATOS OFICIAIS:
- WhatsApp SDR: 77988039620
- Email: contato@agenciaacalantis.com.br
- Instagram: @acalantisagencia
`;

const ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;

async function runAI(messages) {
    const response = await fetch(`/api-ai/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages })
    });
    const result = await response.json();
    return result.result.response;
}

document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('ai-chat-widget');
    const openChatBtn = document.getElementById('open-chat');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    openChatBtn.addEventListener('click', () => {
        chatWidget.classList.remove('hidden');
    });

    closeChatBtn.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message to UI
        appendMessage('user', text);
        chatInput.value = '';

        // Prepare context
        const messages = [
            {
                role: "system", 
                content: `Você é o Mentor Sênior de Vendas da Acalantis. Sua função é treinar e tirar dúvidas dos SDRs sobre o Manual Estratégico e as táticas de fechamento de agenda. 
                
                REGRAS CRÍTICAS:
                1. Você DEVE responder baseando-se no texto do manual fornecido abaixo ou em fundamentos de Tráfego Pago e Qualificação de Vendas (BANT, SPIN, etc., adaptados ao contexto).
                2. Use um tom de Mentor: profissional, direto, focado em alta performance, ambicioso e estratégico. 
                3. Trate o SDR como um profissional de elite. Use termos como "Blindagem de Território", "Aceleradores de Escala" e "Diagnóstico de Viabilidade".
                4. Se o usuário perguntar algo irrelevante, redirecione-o para o objetivo: bookar a reunião de diagnóstico.
                5. Reforce sempre o ROI e a Exclusividade como gatilhos principais.

                CONTEÚDO DO MANUAL PARA CONSULTA:
                ${MANUAL_TEXT}`
            },
            { role: "user", content: text }
        ];

        // Show typing indicator
        if(typingIndicator) typingIndicator.classList.remove('hidden');

        try {
            const aiResponse = await runAI(messages);
            if(typingIndicator) typingIndicator.classList.add('hidden');
            appendMessage('bot', aiResponse);
        } catch (error) {
            if(typingIndicator) typingIndicator.classList.add('hidden');
            appendMessage('bot', "Desculpe, tive um problema ao processar sua resposta. Verifique as credenciais da Cloudflare.");
            console.error(error);
        }
    }

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
