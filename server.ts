import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini lazily to handle missing API keys gracefully
  let ai: GoogleGenAI | null = null;
  const getGenAIClient = () => {
    if (ai) return ai;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Using mock AI completions.");
      return null;
    }
    ai = new GoogleGenAI({ apiKey });
    return ai;
  };

  // API Proxy for Gemini AI
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, model = "gemini-2.5-flash" } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const client = getGenAIClient();
      if (!client) {
        // Fallback Mock completion to keep it ultra robust and stable even without credentials set
        console.log("Mocking AI response for prompt:", prompt.substring(0, 100));
        let mockResponse = "";
        const lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.includes("proposta") || lowerPrompt.includes("comercial")) {
          mockResponse = `## Proposta Comercial Gerada por IA
**Cliente:** Exemplo S.A.
**Data do Evento:** 15 de Outubro de 2026
**Status:** Rascunho de Alta Conversão

### 1. Escopo e Objetivos
A presente proposta descreve o planejamento comercial, técnico e logístico para a realização do evento solicitado, garantindo que os objetivos de engajamento do público e entrega de altíssima qualidade operacional e de experiência sejam plenamente atingidos.

### 2. Cronograma Sugerido
- **Visita Técnica:** 45 dias antes do início da montagem
- **Montagem Geral:** 48 horas de antecedência
- **Ensaios Técnicos & Som:** 12 horas antes da abertura das portas
- **Período de Realização do Evento:** Cronograma principal mapeado por checklists de equipe
- **Desmontagem:** Início imediato pós-fechamento do evento

### 3. Logística de Equipamentos e Fornecedores Recomendados
- **Energia:** Mega Geradores - 1 Gerador Kit 250kVA reserva redundante.
- **Segurança:** Brigadista + Op. Trânsito no local com posto médico munido de Ambulância.
- **Buffet:** Lanche Corporativo executivo para 500 congressistas.

### 4. Valores de Investimento Estimado
- **Taxa de Planejamento de Produção:** R$ 15.000,00
- **Logística e Suporte em Campo:** R$ 8.500,00
- **Fornecedores Clave (Energia / Segurança / Ambulância):** Sob orçamento integrado na planilha de orçamento.
*Total Parcial Recomendado:* R$ 23.500,00.

### 5. Termos Gerais
Termos de aceitação padrão com faturamento pré-evento em parcelas de 50/50.`;
        } else if (lowerPrompt.includes("resumo") || lowerPrompt.includes("pós-evento")) {
          mockResponse = `## Relatório de Fechamento Pós-Evento (IA)
A inteligência analítica compilou 12 ocorrências e 4 checklists para gerar este resumo executivo da operação:

### Pontos Positivos (O que funcionou muito bem)
- **Logística de Entrada:** Cumprimento rigoroso do cronograma de chegada das equipes.
- **Controle de Fornecedores:** Avaliação positiva geral do fornecedor de Gerador de Energia "Mega Geradores" (15 indicações normais em funcionamento).
- **Checklist Fotográfico:** 100% de cobertura das categorias prioritárias de "Estrutura", "Palestras", e "Backstage".

### Pontos de Atenção (Ocorrências registradas)
- **Fornecedores Auxiliares:** Pequeno atraso na montagem do buffet de lanches (atraso de 15 minutos, sem impacto crítico).
- **Divergência de Ponto:** Dois colaboradores registraram inconsistência de retorno do almoço, corrigida pelo DP.

### Próximos Aprendizados Operacionais
1. Mapear a área de energia centralizada com 72h de antecedência.
2. Manter backup redundante de lixeiras e banheiros químicos nas áreas de fluxo crítico.`;
        } else {
          mockResponse = `Prezado usuário, este é um retorno inteligente do Assistente de Operações da GS Eventos. Analisamos os dados do sistema local e geramos a seguinte recomendação:

- Certifique-se de que os **checklists de fornecedores** estejam devidamente atribuídos aos responsáveis antes de irem em campo.
- A **calculadora de vencimentos** acusa 2 documentos críticos com prazo próximo de expirar nos próximos 7 dias. Por favor, revise as notificações.
- Os **registros de ponto** dos colaboradores ativos estão estáveis e sem divergências nas últimas 24 horas.`;
        }
        return res.json({ text: mockResponse });
      }

      // Call Google GenAI SDK
      const response = await client.models.generateContent({
        model,
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Error in /api/gemini/generate:", err);
      res.status(500).json({ error: err.message || "Failed to generate content" });
    }
  });

  // Serve static assets and SPA route fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
