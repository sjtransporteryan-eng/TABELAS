================================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const MASTER_KEY = process.env.MASTER_KEY;
const BIN_ID = process.env.BIN_ID;
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/dados', async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        const data = await response.json();
        res.json({ success: true, dados: data.record || [] });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/dados', async (req, res) => {
    try {
        const dados = req.body;
        if (!dados || typeof dados !== 'object') {
            return res.status(400).json({ success: false, error: 'Dados inválidos' });
        }
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify(dados)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        const result = await response.json();
        res.json({ success: true, message: 'Dados salvos com sucesso!', data: result });
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/status', async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        res.json({ success: response.ok, status: response.status, online: response.ok, bin_id: BIN_ID });
    } catch (error) {
        res.json({ success: false, online: false, error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        bin_id: BIN_ID,
        master_key_configured: !!MASTER_KEY
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`BIN ID: ${BIN_ID}`);
    console.log(`Master Key: ${MASTER_KEY ? 'Configurada' : 'Nao configurada'}`);
});

================================================================================