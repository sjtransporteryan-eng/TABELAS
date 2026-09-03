// ============================================================
// CONFIGURAÇÕES
// ============================================================
const CONFIG = {
    BIN_ID: '6a708f6af5f4af5e29e50603',
    MASTER_KEY: '$2a$10$XHYsaSwZh2v6lebsk9vvEugA6omdPattDTtGC3BPZP1FauxoGHy72'
};
const API_URL = `https://api.jsonbin.io/v3/b/${CONFIG.BIN_ID}`;

const SUPABASE_URL = 'https://jdvdkvbaffpzvbpmvisb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2Ve4n-K446YAquI080OpuA_yUI1zh0o';

const CAMPOS_PADRAO = [
    { id: 'NOME', label: 'NOME', enabled: true },
    { id: 'CNPJ', label: 'CNPJ/CPF', enabled: true },
    { id: 'TELEFONE', label: 'TELEFONE', enabled: true },
    { id: 'PEDIDO', label: 'N. Pedido', enabled: true },
    { id: 'ENDERECO', label: 'ENDEREÇO', enabled: true },
    { id: 'BAIRRO', label: 'BAIRRO', enabled: true },
    { id: 'CIDADE', label: 'CIDADE', enabled: true },
    { id: 'UF', label: 'UF', enabled: true },
    { id: 'CEP', label: 'CEP', enabled: true },
    { id: 'IE', label: 'IE', enabled: true },
    { id: 'EMAIL', label: 'EMAIL', enabled: true }
];

let configImpressao = {
    headerBgColor: '#1a3a5c',
    headerTextColor: '#ffffff',
    headerBorderColor: '#ffd700',
    headerFontSize: 13,
    headerFont: "'Courier New', monospace",
    headerAlign: 'center',
    headerPadding: 30,
    logoMaxHeight: 80,
    logoUrl: 'https://i.ibb.co/678L9Rqt/Chat-GPT-Image-31-de-jul-de-2026-18-54-24.png',
    enderecoEmpresa: 'RUA: INTERLAGOS | BAIRRO: IBERAPUERA | NUMERO: 129\nCIDADE: SINOP-MT | CEP: 78556-788',
    clienteBgColor: '#f8f9fa',
    clienteTextColor: '#333333',
    clienteFontSize: 12,
    clienteFont: "'Courier New', monospace",
    clienteAlign: 'left',
    clientePadding: 15,
    tabelaHeaderBg: '#1a3a5c',
    tabelaHeaderText: '#ffffff',
    tabelaHeaderFontSize: 12,
    tabelaDataFontSize: 12,
    tabelaFont: "'Courier New', monospace",
    tabelaAlign: 'left',
    tabelaLinhaPar: '#f8f9fa',
    tabelaLinhaImpar: '#ffffff',
    textoContato: 'CONTATO / WHATSAPP: (93) 8418-4950',
    rodapeFontSize: 13,
    rodapeFont: "'Courier New', monospace",
    rodapeAlign: 'center',
    assinatura1: 'SINOP-MT',
    assinatura2: 'ASSINATURA',
    mostrarDataEmissao: true,
    larguraMaxima: 1000,
    campos: JSON.parse(JSON.stringify(CAMPOS_PADRAO))
};

// ============================================================
// ESTADO GLOBAL
// ============================================================
let tabelas = [];
let editandoId = null;
let cidadesTemp = [];
let tabelaImpressaoAtual = null;
let clientesColeta = [];
let coletas = [];

// ============================================================
// REFERÊNCIAS DOM
// ============================================================
const elements = {
    corpoTabela: document.getElementById('corpoTabela'),
    totalTabelas: document.getElementById('totalTabelas'),
    ultimaAtualizacao: document.getElementById('ultimaAtualizacao'),
    searchInput: document.getElementById('searchInput'),
    btnNovo: document.getElementById('btnNovo'),
    btnConfigurar: document.getElementById('btnConfigurar'),
    btnBuscar: document.getElementById('btnBuscar'),
    btnLimpar: document.getElementById('btnLimpar'),
    modal: document.getElementById('modalTabela'),
    modalTitle: document.getElementById('modalTitle'),
    form: document.getElementById('formTabela'),
    tabelaId: document.getElementById('tabelaId'),
    cliente: document.getElementById('cliente'),
    cnpj: document.getElementById('cnpj'),
    telefone: document.getElementById('telefone'),
    email: document.getElementById('email'),
    ie: document.getElementById('ie'),
    logradouro: document.getElementById('logradouro'),
    numero: document.getElementById('numero'),
    bairro: document.getElementById('bairro'),
    cidade: document.getElementById('cidade'),
    uf: document.getElementById('uf'),
    cep: document.getElementById('cep'),
    origem: document.getElementById('origem'),
    destino: document.getElementById('destino'),
    observacao: document.getElementById('observacao'),
    cidadesList: document.getElementById('cidadesList'),
    cidadeCount: document.getElementById('cidadeCount'),
    selectCidade: document.getElementById('selectCidade'),
    cidadePersonalizada: document.getElementById('cidadePersonalizada'),
    freteCidade: document.getElementById('freteCidade'),
    kgCidade: document.getElementById('kgCidade'),
    percentualCidade: document.getElementById('percentualCidade'),
    btnAddCidade: document.getElementById('btnAddCidade'),
    closeModal: document.querySelectorAll('.close-modal'),
    modalPrint: document.getElementById('modalImprimir'),
    conteudoImpressao: document.getElementById('conteudoImpressao'),
    closePrint: document.querySelector('.close-print'),
    btnGerarPDF: document.getElementById('btnGerarPDF'),
    modalConfig: document.getElementById('modalConfig'),
    closeConfig: document.querySelectorAll('.close-config'),
    btnResetConfig: document.getElementById('btnResetConfig'),
    formConfig: document.getElementById('formConfig'),
    previewContent: document.getElementById('previewContent'),
    previewFonteInfo: document.getElementById('previewFonteInfo'),
    previewAlignInfo: document.getElementById('previewAlignInfo'),
    previewLogoTamanho: document.getElementById('previewLogoTamanho'),
    btnTabelaFixa: document.getElementById('btnTabelaFixa'),
    modalTabelaFixa: document.getElementById('modalTabelaFixa'),
    closeTabelaFixa: document.querySelectorAll('.close-modal-fixa'),
    btnImprimirFixa: document.getElementById('btnImprimirFixa'),
    camposContainer: document.getElementById('camposContainer'),
    btnAdicionarCampo: document.getElementById('btnAdicionarCampo'),
    logoUrl: document.getElementById('logoUrl'),
    logoUpload: document.getElementById('logoUpload'),
    logoPreviewImg: document.getElementById('logoPreviewImg'),
    headerLogoImg: document.getElementById('headerLogoImg'),

    // Coleta
    menuColeta: document.getElementById('menuColeta'),
    modalColeta: document.getElementById('modalColeta'),
    corpoColeta: document.getElementById('corpoColeta'),
    btnNovaColeta: document.getElementById('btnNovaColeta'),
    btnGerenciarClientes: document.getElementById('btnGerenciarClientes'),
    btnAtualizarColeta: document.getElementById('btnAtualizarColeta'),
    closeColeta: document.querySelectorAll('.close-coleta'),

    // Cliente form
    modalClienteColeta: document.getElementById('modalClienteColeta'),
    modalClienteColetaTitle: document.getElementById('modalClienteColetaTitle'),
    formClienteColeta: document.getElementById('formClienteColeta'),
    clienteColetaId: document.getElementById('clienteColetaId'),
    nomeClienteColeta: document.getElementById('nomeClienteColeta'),
    cnpjClienteColeta: document.getElementById('cnpjClienteColeta'),
    telefoneClienteColeta: document.getElementById('telefoneClienteColeta'),
    emailClienteColeta: document.getElementById('emailClienteColeta'),
    ieClienteColeta: document.getElementById('ieClienteColeta'),
    logradouroClienteColeta: document.getElementById('logradouroClienteColeta'),
    numeroClienteColeta: document.getElementById('numeroClienteColeta'),
    bairroClienteColeta: document.getElementById('bairroClienteColeta'),
    cidadeClienteColeta: document.getElementById('cidadeClienteColeta'),
    ufClienteColeta: document.getElementById('ufClienteColeta'),
    cepClienteColeta: document.getElementById('cepClienteColeta'),
    observacaoClienteColeta: document.getElementById('observacaoClienteColeta'),
    closeClienteColeta: document.querySelectorAll('.close-cliente-coleta'),

    // Nova coleta
    modalNovaColeta: document.getElementById('modalNovaColeta'),
    formNovaColeta: document.getElementById('formNovaColeta'),
    clienteColetaSelect: document.getElementById('clienteColetaSelect'),
    volumesColeta: document.getElementById('volumesColeta'),
    btnNovoClienteColeta: document.getElementById('btnNovoClienteColeta'),
    closeNovaColeta: document.querySelectorAll('.close-nova-coleta'),

    // Gerenciar clientes
    modalGerenciarClientes: document.getElementById('modalGerenciarClientes'),
    corpoClientes: document.getElementById('corpoClientes'),
    btnNovoClienteGerenciar: document.getElementById('btnNovoClienteGerenciar'),
    btnAtualizarClientes: document.getElementById('btnAtualizarClientes'),
    closeGerenciarClientes: document.querySelectorAll('.close-gerenciar-clientes'),

    // CRM
    menuCRM: document.getElementById('menuCRM'),
    modalCRM: document.getElementById('modalCRM'),
    corpoCRM: document.getElementById('corpoCRM'),
    btnNovoClienteCRM: document.getElementById('btnNovoClienteCRM'),
    btnAtualizarCRM: document.getElementById('btnAtualizarCRM'),
    buscaCRM: document.getElementById('buscaCRM'),
    closeCRM: document.querySelectorAll('.close-crm'),
};

// ============================================================
// FUNÇÕES PARA LOGO
// ============================================================
function atualizarLogo(url) {
    if (!url) return;
    elements.headerLogoImg.src = url;
    elements.logoPreviewImg.src = url;
    configImpressao.logoUrl = url;
    atualizarPreview();
}
elements.logoUpload.addEventListener('change', function(e) {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64 = event.target.result;
        elements.logoUrl.value = base64;
        atualizarLogo(base64);
        mostrarToast('Logo atualizada por upload!', 'success');
    };
    reader.readAsDataURL(file);
});
elements.logoUrl.addEventListener('change', function() {
    const url = this.value.trim();
    if (url) {
        atualizarLogo(url);
        mostrarToast('Logo atualizada por URL!', 'success');
    }
});

// ============================================================
// UTILIDADES DE MODAL
// ============================================================
function openModal(modal) { modal.classList.add('active'); }
function closeModal(modal) { modal.classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
    });
});

// Fechar modais específicos
elements.closeModal.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal);
    });
});
elements.closeConfig.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal);
    });
});
elements.closePrint.addEventListener('click', function() {
    closeModal(elements.modalPrint);
});
elements.closeTabelaFixa.forEach(btn => {
    btn.addEventListener('click', function() {
        closeModal(elements.modalTabelaFixa);
    });
});
elements.closeColeta.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal);
    });
});
elements.closeClienteColeta.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal);
    });
});
elements.closeNovaColeta.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal);
    });
});
elements.closeGerenciarClientes.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal);
    });
});
elements.closeCRM.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal);
    });
});

// ============================================================
// GERENCIAMENTO DE CAMPOS DE IMPRESSÃO
// ============================================================
let dragItem = null;

function renderizarCampos() {
    const container = elements.camposContainer;
    const campos = configImpressao.campos;
    if (!campos || campos.length === 0) {
        container.innerHTML =
            `<div style="text-align:center; padding:20px; color:#666;">Nenhum campo configurado. Clique em "Adicionar Campo".</div>`;
        return;
    }
    container.innerHTML = campos.map((campo, index) => `
        <div class="campo-item" draggable="true" data-index="${index}">
            <span class="campo-drag">::</span>
            <input type="checkbox" class="campo-checkbox" ${campo.enabled ? 'checked' : ''} data-index="${index}">
            <span class="campo-label">${campo.label || campo.id}</span>
            <input type="text" class="campo-input" value="${campo.label || campo.id}" data-index="${index}" placeholder="Nome do campo">
            <button type="button" class="btn btn-sm btn-danger" style="padding:0 6px;min-height:18px;font-size:10px;" onclick="removerCampo(${index})">X</button>
        </div>
    `).join('');

    const items = container.querySelectorAll('.campo-item');
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', handleDrop);
    });

    container.querySelectorAll('.campo-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
            const idx = parseInt(this.dataset.index);
            configImpressao.campos[idx].enabled = this.checked;
            atualizarPreview();
        });
    });
    container.querySelectorAll('.campo-input').forEach(inp => {
        inp.addEventListener('change', function() {
            const idx = parseInt(this.dataset.index);
            configImpressao.campos[idx].label = this.value.trim() || configImpressao.campos[idx].id;
            const labelSpan = this.parentElement.querySelector('.campo-label');
            if (labelSpan) labelSpan.textContent = configImpressao.campos[idx].label;
            atualizarPreview();
        });
    });
}

function handleDragStart(e) {
    const item = e.target.closest('.campo-item');
    if (!item) return;
    dragItem = parseInt(item.dataset.index);
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragItem);
}
function handleDragEnd(e) {
    const item = e.target.closest('.campo-item');
    if (item) item.classList.remove('dragging');
    document.querySelectorAll('.campo-item').forEach(el => el.classList.remove('drag-over'));
}
function handleDragOver(e) { e.preventDefault();
    e.dataTransfer.dropEffect = 'move'; }
function handleDragEnter(e) { const item = e.target.closest('.campo-item'); if (item) item.classList.add('drag-over'); }
function handleDragLeave(e) { const item = e.target.closest('.campo-item'); if (item) item.classList.remove('drag-over'); }
function handleDrop(e) {
    e.preventDefault();
    const target = e.target.closest('.campo-item');
    if (!target) return;
    const targetIndex = parseInt(target.dataset.index);
    if (dragItem === null || dragItem === targetIndex) return;
    const campos = configImpressao.campos;
    const [removed] = campos.splice(dragItem, 1);
    campos.splice(targetIndex, 0, removed);
    renderizarCampos();
    atualizarPreview();
    dragItem = null;
}

function removerCampo(index) {
    if (!confirm(`Remover o campo "${configImpressao.campos[index].label}"?`)) return;
    configImpressao.campos.splice(index, 1);
    renderizarCampos();
    atualizarPreview();
    mostrarToast('Campo removido!', 'success');
}

function adicionarCampo() {
    const novoId = 'CAMPO_' + (configImpressao.campos.length + 1);
    configImpressao.campos.push({ id: novoId, label: 'Novo Campo', enabled: true });
    renderizarCampos();
    const inputs = elements.camposContainer.querySelectorAll('.campo-input');
    const lastInput = inputs[inputs.length - 1];
    if (lastInput) { lastInput.focus();
        lastInput.select(); }
    atualizarPreview();
    mostrarToast('Campo adicionado!', 'success');
}
elements.btnAdicionarCampo.addEventListener('click', adicionarCampo);

// ============================================================
// TABELA FIXA
// ============================================================
elements.btnTabelaFixa.addEventListener('click', function() {
    openModal(elements.modalTabelaFixa);
});
elements.btnImprimirFixa.addEventListener('click', function() {
    const conteudo = document.querySelector('.table-fixed').outerHTML;
    const origem = document.querySelector('#modalTabelaFixa .window-body > div:first-child')?.textContent || '';
    const contato = document.querySelector('#modalTabelaFixa .window-body > div:last-child')?.textContent || '';
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
        <html><head><title>Tabela de Fretes</title>
        <style>
            body { font-family: 'Tahoma','Geneva',sans-serif; padding:20px; background:#fff; }
            .header { text-align:center; border-bottom:2px solid #06458F; padding-bottom:10px; margin-bottom:15px; }
            .header .sj-logo { display:flex; align-items:center; justify-content:center; gap:10px; }
            .header .sj-logo .monograma { font-size:32px; font-weight:900; font-family:'Segoe UI','Arial Black',sans-serif; letter-spacing:-3px; }
            .header .sj-logo .monograma .s { color:#06458F; }
            .header .sj-logo .monograma .j { color:#000; }
            .header .sj-logo .texto-empresa { font-size:14px; font-weight:700; color:#06458F; font-family:'Segoe UI','Arial Black',sans-serif; text-transform:uppercase; border-left:1px solid #ccc; padding-left:10px; }
            table { width:100%; border-collapse:collapse; font-size:12px; }
            th { background:#06458F; color:white; padding:6px; border:1px solid #002a5c; text-align:left; }
            td { padding:5px; border:1px solid #a0a0a0; }
            tr:nth-child(even) td { background:#f0f0e8; }
            .footer { margin-top:20px; border-top:2px solid #333; padding-top:12px; display:flex; justify-content:space-between; }
            .assinaturas { display:flex; gap:40px; text-align:center; }
            .assinaturas div { min-width:120px; }
            .linha { border-top:1px solid #333; width:100%; margin-bottom:5px; }
            @media print { body { padding:10px; } }
        </style>
        </head><body>
        <div class="header">
            <div class="sj-logo">
                <div class="monograma"><span class="s">S</span><span class="j">J</span></div>
                <div class="texto-empresa">Transportes e Logistica</div>
            </div>
            <p style="margin-top:6px;font-size:12px;">RUA: INTERLAGOS | BAIRRO: IBERAPUERA | NUMERO: 129<br>CIDADE: SINOP-MT | CEP: 78556-788</p>
        </div>
        <div style="margin:8px 0;font-weight:bold;">${origem}</div>
        ${conteudo}
        <div style="margin-top:10px;text-align:center;">${contato}</div>
        <div class="footer">
            <div></div>
            <div class="assinaturas">
                <div><div class="linha"></div><small>SINOP-MT</small></div>
                <div><div class="linha"></div><small>ASSINATURA</small></div>
            </div>
        </div>
        <div style="text-align:center;color:#999;font-size:10px;margin-top:10px;">
            Documento emitido em ${new Date().toLocaleString('pt-BR')}
        </div>
        <script>window.print();<\/script>
        </body></html>
    `);
    printWindow.document.close();
});

// ============================================================
// CONFIGURAÇÕES DE IMPRESSÃO
// ============================================================
function carregarConfiguracoes() {
    const salvo = localStorage.getItem('configImpressao');
    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            if (!parsed.campos || parsed.campos.length === 0) {
                parsed.campos = JSON.parse(JSON.stringify(CAMPOS_PADRAO));
            }
            configImpressao = { ...configImpressao, ...parsed };
        } catch (e) {}
    }
    if (configImpressao.logoUrl) {
        atualizarLogo(configImpressao.logoUrl);
    }
}

function salvarConfiguracoesLocal() {
    localStorage.setItem('configImpressao', JSON.stringify(configImpressao));
}

function preencherFormConfig() {
    document.getElementById('headerBgColor').value = configImpressao.headerBgColor;
    document.getElementById('headerTextColor').value = configImpressao.headerTextColor;
    document.getElementById('headerBorderColor').value = configImpressao.headerBorderColor;
    document.getElementById('headerFontSize').value = configImpressao.headerFontSize;
    document.getElementById('headerFont').value = configImpressao.headerFont;
    document.getElementById('headerAlign').value = configImpressao.headerAlign;
    document.getElementById('headerPadding').value = configImpressao.headerPadding;
    document.getElementById('logoMaxHeight').value = configImpressao.logoMaxHeight;
    document.getElementById('logoUrl').value = configImpressao.logoUrl || '';
    document.getElementById('enderecoEmpresa').value = configImpressao.enderecoEmpresa;
    document.getElementById('clienteBgColor').value = configImpressao.clienteBgColor;
    document.getElementById('clienteTextColor').value = configImpressao.clienteTextColor;
    document.getElementById('clienteFontSize').value = configImpressao.clienteFontSize;
    document.getElementById('clienteFont').value = configImpressao.clienteFont;
    document.getElementById('clienteAlign').value = configImpressao.clienteAlign;
    document.getElementById('clientePadding').value = configImpressao.clientePadding;
    document.getElementById('tabelaHeaderBg').value = configImpressao.tabelaHeaderBg;
    document.getElementById('tabelaHeaderText').value = configImpressao.tabelaHeaderText;
    document.getElementById('tabelaHeaderFontSize').value = configImpressao.tabelaHeaderFontSize;
    document.getElementById('tabelaDataFontSize').value = configImpressao.tabelaDataFontSize;
    document.getElementById('tabelaFont').value = configImpressao.tabelaFont;
    document.getElementById('tabelaAlign').value = configImpressao.tabelaAlign;
    document.getElementById('tabelaLinhaPar').value = configImpressao.tabelaLinhaPar;
    document.getElementById('tabelaLinhaImpar').value = configImpressao.tabelaLinhaImpar;
    document.getElementById('textoContato').value = configImpressao.textoContato;
    document.getElementById('rodapeFontSize').value = configImpressao.rodapeFontSize;
    document.getElementById('rodapeFont').value = configImpressao.rodapeFont;
    document.getElementById('rodapeAlign').value = configImpressao.rodapeAlign;
    document.getElementById('assinatura1').value = configImpressao.assinatura1;
    document.getElementById('assinatura2').value = configImpressao.assinatura2;
    document.getElementById('mostrarDataEmissao').value = configImpressao.mostrarDataEmissao ? 'true' : 'false';
    document.getElementById('larguraMaxima').value = configImpressao.larguraMaxima;
    renderizarCampos();
    atualizarPreview();
}

// ============================================================
// MAPEAMENTO DE CAMPOS
// ============================================================
function mapearCampos(tabela) {
    const campos = configImpressao.campos;
    let enderecoCompleto = '';
    if (tabela.logradouro) {
        enderecoCompleto = tabela.logradouro;
        if (tabela.numero) enderecoCompleto += `, ${tabela.numero}`;
        if (tabela.bairro) enderecoCompleto += ` - ${tabela.bairro}`;
    } else if (tabela.endereco) {
        enderecoCompleto = tabela.endereco;
    } else {
        let partes = [];
        if (tabela.cidade) partes.push(tabela.cidade);
        if (tabela.uf) partes.push(tabela.uf);
        if (tabela.cep) partes.push('CEP: ' + tabela.cep);
        if (partes.length > 0) enderecoCompleto = partes.join(' - ');
    }
    let cidadeUf = '';
    if (tabela.cidade) {
        cidadeUf = tabela.cidade;
        if (tabela.uf) cidadeUf += ` - ${tabela.uf}`;
    }
    if (cidadeUf && !enderecoCompleto.includes(cidadeUf)) {
        enderecoCompleto += (enderecoCompleto ? ', ' : '') + cidadeUf;
    }
    if (tabela.cep && !enderecoCompleto.includes(tabela.cep)) {
        enderecoCompleto += (enderecoCompleto ? ' - CEP: ' : 'CEP: ') + tabela.cep;
    }
    if (!enderecoCompleto) enderecoCompleto = 'Endereço não informado';

    const dadosCliente = {
        'NOME': tabela.cliente || '-',
        'CNPJ': tabela.cnpj || '-',
        'TELEFONE': tabela.telefone || '-',
        'PEDIDO': tabela.id || '-',
        'ENDERECO': enderecoCompleto,
        'RUA': tabela.logradouro || '-',
        'LOGRADOURO': tabela.logradouro || '-',
        'NUMERO': tabela.numero || '-',
        'BAIRRO': tabela.bairro || '-',
        'CIDADE': cidadeUf || '-',
        'UF': tabela.uf || '-',
        'CEP': tabela.cep || '-',
        'IE': tabela.ie || '-',
        'EMAIL': tabela.email || '-'
    };

    const mapa = {};
    campos.forEach(campo => {
        const id = campo.id;
        if (dadosCliente.hasOwnProperty(id)) {
            mapa[id] = dadosCliente[id];
        } else {
            mapa[id] = tabela[campo.id] || '-';
        }
    });
    return mapa;
}

// ============================================================
// PRÉ-VISUALIZAÇÃO E IMPRESSÃO
// ============================================================
function atualizarPreview() {
    const exemplo = {
        id: 1,
        cliente: 'DISTRIBUIDORA DE MOLAS MATO GROSSO LTDA',
        cnpj: '7306297000167',
        telefone: '(66) 3515-9853',
        email: 'contato@molasmt.com.br',
        logradouro: 'RUA VALDIR DOERNER',
        numero: '666',
        bairro: 'DIST. INDL.',
        cidade: 'SINOP',
        uf: 'MT',
        cep: '78556-788',
        ie: '132989689',
        origem: 'SINOP - MT',
        destino: 'DIVERSOS (PA)',
        observacao: 'Tabela de fretes para o Pará',
        cidades: [
            { nome: 'Cachoeira da Serra', frete: 75.00, kg: 650.00, percentual: 3.00 },
            { nome: 'Castelo dos Sonhos', frete: 75.00, kg: 650.00, percentual: 3.00 },
            { nome: 'Novo Progresso', frete: 80.00, kg: 700.00, percentual: 3.50 },
            { nome: 'Santarém', frete: 130.00, kg: 1100.00, percentual: 4.50 }
        ]
    };
    const html = gerarHTMLImpressao(exemplo, true);
    elements.previewContent.innerHTML = html;
    const nomeFonte = configImpressao.headerFont.replace(/'/g, '').replace(/,.*$/, '').trim() || 'Courier New';
    elements.previewFonteInfo.textContent = 'Fonte: ' + nomeFonte;
    elements.previewAlignInfo.textContent = 'Alinhamento: ' + configImpressao.headerAlign.charAt(0).toUpperCase() +
        configImpressao.headerAlign.slice(1);
    elements.previewLogoTamanho.textContent = 'Logo: ' + configImpressao.logoMaxHeight + 'px';
}

function gerarHTMLImpressao(tabela, preview = false) {
    const cfg = configImpressao;
    const camposMap = mapearCampos(tabela);

    const camposHTML = cfg.campos
        .filter(c => c.enabled)
        .map(c => {
            const valor = camposMap[c.id] || '-';
            return `<div class="item"><strong>${c.label || c.id}:</strong> ${valor}</div>`;
        })
        .join('');

    const cidadesHTML = tabela.cidades.map(c => `
        <tr>
            <td>${c.nome}</td>
            <td>PA</td>
            <td>R$ ${c.frete.toFixed(2)}</td>
            <td>R$ ${c.kg.toFixed(2)}/kg</td>
            <td>${c.percentual.toFixed(2)}%</td>
        </tr>
    `).join('');

    const enderecoHTML = cfg.enderecoEmpresa.replace(/\n/g, '<br>');

    const styleHeader =
        `background:${cfg.headerBgColor};color:${cfg.headerTextColor};border-bottom:2px solid ${cfg.headerBorderColor};padding:${cfg.headerPadding}px 15px;text-align:${cfg.headerAlign};font-size:${cfg.headerFontSize}px;font-family:${cfg.headerFont};`;
    const styleCliente =
        `background:${cfg.clienteBgColor};color:${cfg.clienteTextColor};padding:${cfg.clientePadding}px 15px;font-size:${cfg.clienteFontSize}px;font-family:${cfg.clienteFont};text-align:${cfg.clienteAlign};`;
    const styleTable =
        `font-size:${cfg.tabelaDataFontSize}px;font-family:${cfg.tabelaFont};text-align:${cfg.tabelaAlign};`;
    const styleTh =
        `background:${cfg.tabelaHeaderBg};color:${cfg.tabelaHeaderText};padding:4px 8px;border:1px solid #002a5c;font-size:${cfg.tabelaHeaderFontSize}px;text-align:${cfg.tabelaAlign};`;
    const styleTd =
        `padding:4px 8px;border:1px solid #a0a0a0;text-align:${cfg.tabelaAlign};`;

    const logoUrl = cfg.logoUrl || 'https://i.ibb.co/678L9Rqt/Chat-GPT-Image-31-de-jul-de-2026-18-54-24.png';
    const logoTamanho = cfg.logoMaxHeight || 80;
    const dataHoraAtual = new Date().toLocaleString('pt-BR');
    const nomeCliente = tabela.cliente || 'Cliente';

    const html = `
        <div style="max-width:${cfg.larguraMaxima}px; margin:0 auto; font-family:'Tahoma','Geneva',sans-serif; background:#fff; padding:${preview ? '4px' : '10px'}; display:flex; flex-direction:column; min-height:100%;">
            <div class="conteudo-impressao" style="flex:1;">
                <div class="sj-logo-print" style="display:flex; justify-content:center; align-items:center; margin-bottom:${preview ? '8px' : '14px'}; border-bottom:2px solid #06458F; padding-bottom:${preview ? '6px' : '10px'};">
                    <img src="${logoUrl}" alt="SJ Transportes e Logistica" style="max-height:${preview ? Math.min(logoTamanho * 0.6, 60) : logoTamanho}px; width:auto; object-fit:contain;">
                </div>
                <div class="endereco-print" style="text-align:center; font-size:${preview ? '10px' : '12px'}; margin-bottom:${preview ? '6px' : '14px'}; color:#333;">${enderecoHTML}</div>
                <div class="info-cliente-print" style="display:grid; grid-template-columns:1fr 1fr; gap:2px 20px; font-size:11px; background:#f5f5f0; padding:6px 12px; border:1px solid #a0a0a0; margin-bottom:10px;">${camposHTML}</div>
                <div class="origem-destino-print" style="display:flex; justify-content:space-between; background:#e9ecef; padding:4px 12px; font-weight:bold; font-size:12px; margin-bottom:10px; border:1px solid #a0a0a0;">
                    <span>ORIGEM: ${tabela.origem}</span>
                    <span>DESTINO: ${tabela.destino}</span>
                </div>
                <table class="table-print" style="width:100%; border-collapse:collapse; ${styleTable}">
                    <thead><tr><th style="${styleTh}">Cidades</th><th style="${styleTh}">UF</th><th style="${styleTh}">Frete</th><th style="${styleTh}">Preço KG</th><th style="${styleTh}">% NF</th></tr></thead>
                    <tbody>${cidadesHTML}</tbody>
                </table>
                ${tabela.observacao ? `<div class="observacao-print" style="font-size:11px; padding:4px 10px; border:1px solid #ccc; background:#f9f9f9; margin-bottom:15px;"><strong>Observação:</strong> ${tabela.observacao}</div>` : ''}
            </div>
            <div class="rodape-assinaturas" style="margin-top:auto; padding-top:30px; border-top:2px solid #333; display:flex; justify-content:space-between; align-items:flex-end; padding-bottom:0; margin-bottom:0; min-height:100px;">
                <div class="assinatura-cliente" style="flex:1; text-align:left; padding-right:20px;">
                    <div class="linha-assinatura" style="border-bottom:1px solid #333; width:100%; height:1px; margin-bottom:4px;"></div>
                    <span class="nome-assinatura" style="font-size:11px; color:#333; font-weight:bold;">${nomeCliente}</span>
                </div>
                <div class="assinatura-empresa" style="flex:1; text-align:right; padding-left:20px;">
                    <div class="linha-assinatura" style="border-bottom:1px solid #333; width:100%; height:1px; margin-bottom:4px;"></div>
                    <span class="nome-assinatura" style="font-size:11px; color:#333; font-weight:bold;">SJ Transportes e Logística</span>
                </div>
            </div>
            <div class="rodape-info" style="display:flex; justify-content:flex-start; align-items:center; margin-top:10px; padding-top:8px; border-top:1px solid #ddd; font-size:10px; color:#999;">
                <span class="sinop-data" style="text-align:left; font-weight:bold; color:#333; font-size:10px;">SINOP-MT - ${dataHoraAtual}</span>
            </div>
        </div>
    `;
    return html;
}

// ============================================================
// IMPRESSÃO E PDF
// ============================================================
function abrirImpressao(id) {
    const tabela = tabelas.find(t => t.id === id);
    if (!tabela) { mostrarToast('Tabela não encontrada!', 'error'); return; }
    tabelaImpressaoAtual = tabela;
    const html = gerarHTMLImpressao(tabela, false);
    elements.conteudoImpressao.innerHTML = html;
    openModal(elements.modalPrint);
}

function imprimirRecibo() {
    window.print();
}

function gerarPDF() {
    const btn = elements.btnGerarPDF;
    const original = btn.innerHTML;
    btn.innerHTML = 'Gerando...';
    btn.disabled = true;
    if (!elements.modalPrint.classList.contains('active')) {
        if (tabelaImpressaoAtual) {
            const html = gerarHTMLImpressao(tabelaImpressaoAtual, false);
            elements.conteudoImpressao.innerHTML = html;
            openModal(elements.modalPrint);
        } else if (tabelas.length > 0) {
            const primeira = tabelas[0];
            tabelaImpressaoAtual = primeira;
            const html = gerarHTMLImpressao(primeira, false);
            elements.conteudoImpressao.innerHTML = html;
            openModal(elements.modalPrint);
        } else {
            mostrarToast('Nenhuma tabela para gerar PDF.', 'error');
            btn.innerHTML = original;
            btn.disabled = false;
            return;
        }
    }
    setTimeout(() => {
        const element = document.querySelector('#modalImprimir .window-body');
        const opt = {
            margin: [0, 0, 0, 0],
            filename: `tabela_frete_${tabelaImpressaoAtual?.id || 'sem_id'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save()
            .then(() => {
                btn.innerHTML = original;
                btn.disabled = false;
                mostrarToast('PDF gerado com sucesso!', 'success');
            })
            .catch((err) => {
                console.error(err);
                btn.innerHTML = original;
                btn.disabled = false;
                mostrarToast('Erro ao gerar PDF: ' + err.message, 'error');
            });
    }, 300);
}

// ============================================================
// JSONBIN - TABELAS DE FRETE
// ============================================================
async function carregarDados() {
    try {
        const response = await fetch(API_URL, { headers: { 'X-Master-Key': CONFIG.MASTER_KEY } });
        if (!response.ok) throw new Error('Erro ao carregar dados');
        const data = await response.json();
        tabelas = data.record || [];
        renderizarTabelas();
        atualizarTotalizadores();
        return tabelas;
    } catch (error) {
        console.error('Erro ao carregar:', error);
        tabelas = getDadosExemplo();
        renderizarTabelas();
        atualizarTotalizadores();
        mostrarToast('Usando dados de exemplo (offline)', 'error');
        return tabelas;
    }
}

async function salvarDados() {
    try {
        if (!tabelas || tabelas.length === 0) tabelas = [];
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': CONFIG.MASTER_KEY
            },
            body: JSON.stringify(tabelas)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        mostrarToast('Dados salvos com sucesso!', 'success');
        return true;
    } catch (error) {
        console.error('Erro ao salvar:', error);
        mostrarToast('Erro ao salvar: ' + error.message, 'error');
        return false;
    }
}

function getDadosExemplo() {
    const hoje = new Date().toISOString().split('T')[0];
    return [{
        id: 1,
        cliente: 'DISTRIBUIDORA DE MOLAS MATO GROSSO LTDA',
        cnpj: '7306297000167',
        telefone: '(66) 3515-9853',
        email: '',
        logradouro: 'RUA VALDIR DOERNER',
        numero: '666',
        bairro: 'DIST. INDL.',
        cidade: 'SINOP',
        uf: 'MT',
        cep: '78556-788',
        ie: '132989689',
        origem: 'SINOP - MT',
        destino: 'DIVERSOS (PA)',
        observacao: 'Tabela de fretes para o Pará',
        data: hoje,
        cidades: [
            { nome: 'Cachoeira da Serra', frete: 75.00, kg: 650.00, percentual: 3.00 },
            { nome: 'Castelo dos Sonhos', frete: 75.00, kg: 650.00, percentual: 3.00 },
            { nome: 'Novo Progresso', frete: 80.00, kg: 700.00, percentual: 3.50 },
            { nome: 'Moraes Almeida', frete: 90.00, kg: 800.00, percentual: 4.00 },
            { nome: 'Santarém', frete: 130.00, kg: 1100.00, percentual: 4.50 }
        ]
    }];
}

function renderizarTabelas(filtro = '') {
    let dados = filtro ? tabelas.filter(t =>
        t.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
        t.origem.toLowerCase().includes(filtro.toLowerCase()) ||
        t.destino.toLowerCase().includes(filtro.toLowerCase())
    ) : tabelas;
    if (dados.length === 0) {
        elements.corpoTabela.innerHTML =
            `<tr><td colspan="7" style="text-align:center;padding:20px;color:#666;">Nenhuma tabela encontrada</td></tr>`;
        return;
    }
    elements.corpoTabela.innerHTML = dados.map(tabela => `
        <tr>
            <td><strong>#${tabela.id}</strong></td>
            <td>${tabela.cliente}</td>
            <td>${tabela.origem}</td>
            <td>${tabela.destino}</td>
            <td>${tabela.cidades.length}</td>
            <td>${formatarData(tabela.data)}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-sm" onclick="abrirImpressao(${tabela.id})">P</button>
                    <button class="btn btn-sm btn-primary" onclick="editarTabela(${tabela.id})">E</button>
                    <button class="btn btn-sm btn-danger" onclick="excluirTabela(${tabela.id})">X</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function atualizarTotalizadores() {
    elements.totalTabelas.textContent = tabelas.length;
    const agora = new Date();
    elements.ultimaAtualizacao.textContent = agora.toLocaleString('pt-BR');
}

function formatarData(data) {
    if (!data) return '-';
    const d = new Date(data + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

// ============================================================
// CRUD DE TABELAS DE FRETE
// ============================================================
function abrirModalNovo() {
    editandoId = null;
    elements.modalTitle.textContent = 'Nova Tabela de Frete';
    elements.form.reset();
    elements.tabelaId.value = '';
    elements.origem.value = 'SINOP - MT';
    elements.destino.value = 'DIVERSOS (PA)';
    cidadesTemp = [];
    renderizarCidadesForm();
    openModal(elements.modal);
}

function editarTabela(id) {
    const tabela = tabelas.find(t => t.id === id);
    if (!tabela) return;
    editandoId = id;
    elements.modalTitle.textContent = 'Editar Tabela de Frete';
    elements.tabelaId.value = tabela.id;
    elements.cliente.value = tabela.cliente;
    elements.cnpj.value = tabela.cnpj || '';
    elements.telefone.value = tabela.telefone || '';
    elements.email.value = tabela.email || '';
    elements.ie.value = tabela.ie || '';
    elements.logradouro.value = tabela.logradouro || '';
    elements.numero.value = tabela.numero || '';
    elements.bairro.value = tabela.bairro || '';
    elements.cidade.value = tabela.cidade || '';
    elements.uf.value = tabela.uf || '';
    elements.cep.value = tabela.cep || '';
    elements.origem.value = tabela.origem;
    elements.destino.value = tabela.destino;
    elements.observacao.value = tabela.observacao || '';
    cidadesTemp = JSON.parse(JSON.stringify(tabela.cidades));
    renderizarCidadesForm();
    openModal(elements.modal);
}

async function excluirTabela(id) {
    if (!confirm('Tem certeza que deseja excluir esta tabela?')) return;
    tabelas = tabelas.filter(t => t.id !== id);
    const salvou = await salvarDados();
    if (salvou) {
        renderizarTabelas();
        atualizarTotalizadores();
        mostrarToast('Tabela excluída!', 'success');
    } else {
        await carregarDados();
        mostrarToast('Erro ao excluir.', 'error');
    }
}

async function salvarTabela(event) {
    event.preventDefault();
    if (cidadesTemp.length === 0) {
        mostrarToast('Adicione pelo menos uma cidade!', 'error');
        return;
    }
    const dados = {
        cliente: elements.cliente.value.trim(),
        cnpj: elements.cnpj.value.trim() || '',
        telefone: elements.telefone.value.trim() || '',
        email: elements.email.value.trim() || '',
        ie: elements.ie.value.trim() || '',
        logradouro: elements.logradouro.value.trim() || '',
        numero: elements.numero.value.trim() || '',
        bairro: elements.bairro.value.trim() || '',
        cidade: elements.cidade.value.trim() || '',
        uf: elements.uf.value.trim().toUpperCase() || '',
        cep: elements.cep.value.trim() || '',
        origem: elements.origem.value.trim(),
        destino: elements.destino.value.trim(),
        observacao: elements.observacao.value.trim() || '',
        data: new Date().toISOString().split('T')[0],
        cidades: JSON.parse(JSON.stringify(cidadesTemp))
    };
    if (!dados.cliente || !dados.origem || !dados.destino || !dados.logradouro) {
        mostrarToast('Preencha os campos obrigatórios: Cliente, Origem, Destino e Logradouro!', 'error');
        return;
    }
    if (editandoId) {
        const index = tabelas.findIndex(t => t.id === editandoId);
        if (index !== -1) tabelas[index] = { ...tabelas[index], ...dados };
    } else {
        const novoId = tabelas.length > 0 ? Math.max(...tabelas.map(t => t.id)) + 1 : 1;
        tabelas.push({ id: novoId, ...dados });
    }
    const salvou = await salvarDados();
    if (salvou) {
        renderizarTabelas();
        atualizarTotalizadores();
        closeModal(elements.modal);
        mostrarToast('Tabela ' + (editandoId ? 'atualizada' : 'criada') + '!', 'success');
    } else {
        await carregarDados();
        mostrarToast('Erro ao salvar.', 'error');
    }
}

// ============================================================
// CIDADES (FORM)
// ============================================================
function renderizarCidadesForm() {
    elements.cidadeCount.textContent = `(${cidadesTemp.length} adicionadas)`;
    if (cidadesTemp.length === 0) {
        elements.cidadesList.innerHTML =
            `<div class="cidades-empty">Nenhuma cidade adicionada</div>`;
        return;
    }
    elements.cidadesList.innerHTML = cidadesTemp.map((c, idx) => `
        <div class="cidade-item">
            <span class="info"><strong>${c.nome}</strong> | Frete: R$ ${c.frete.toFixed(2)} | KG: R$ ${c.kg.toFixed(2)} | %: ${c.percentual.toFixed(2)}%</span>
            <button class="btn-remove" onclick="removerCidade(${idx})">X</button>
        </div>
    `).join('');
}

function adicionarCidade() {
    let nome = elements.selectCidade.value;
    if (nome === 'OUTRA') {
        nome = elements.cidadePersonalizada.value.trim();
        if (!nome) { mostrarToast('Digite o nome da cidade!', 'error'); return; }
    }
    const frete = parseFloat(elements.freteCidade.value);
    const kg = parseFloat(elements.kgCidade.value);
    const percentual = parseFloat(elements.percentualCidade.value);
    if (!nome) { mostrarToast('Selecione ou digite uma cidade!', 'error'); return; }
    if (isNaN(frete) || isNaN(kg) || isNaN(percentual)) { mostrarToast('Preencha todos os valores!', 'error'); return; }
    if (frete <= 0 || kg <= 0 || percentual <= 0) { mostrarToast('Valores devem ser > zero!', 'error'); return; }
    if (cidadesTemp.some(c => c.nome.toLowerCase() === nome.toLowerCase())) { mostrarToast('Cidade já adicionada!',
            'error'); return; }
    cidadesTemp.push({ nome, frete, kg, percentual });
    renderizarCidadesForm();
    elements.selectCidade.value = '';
    elements.cidadePersonalizada.value = '';
    elements.cidadePersonalizada.style.display = 'none';
    elements.freteCidade.value = '';
    elements.kgCidade.value = '';
    elements.percentualCidade.value = '';
    mostrarToast('Cidade "' + nome + '" adicionada!', 'success');
}

function removerCidade(index) {
    cidadesTemp.splice(index, 1);
    renderizarCidadesForm();
}

elements.selectCidade.addEventListener('change', function() {
    if (this.value === 'OUTRA') {
        elements.cidadePersonalizada.style.display = 'inline-block';
        elements.cidadePersonalizada.focus();
    } else {
        elements.cidadePersonalizada.style.display = 'none';
        elements.cidadePersonalizada.value = '';
    }
});
elements.btnAddCidade.addEventListener('click', adicionarCidade);
['selectCidade', 'cidadePersonalizada', 'freteCidade', 'kgCidade', 'percentualCidade'].forEach(id => {
    document.getElementById(id).addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarCidade();
        }
    });
});

// ============================================================
// CONFIGURAÇÕES - SALVAR
// ============================================================
function salvarConfiguracoes(event) {
    event.preventDefault();
    const inputs = elements.camposContainer.querySelectorAll('.campo-input');
    inputs.forEach(inp => {
        const idx = parseInt(inp.dataset.index);
        if (configImpressao.campos[idx]) {
            configImpressao.campos[idx].label = inp.value.trim() || configImpressao.campos[idx].id;
        }
    });
    const checkbox = elements.camposContainer.querySelectorAll('.campo-checkbox');
    checkbox.forEach(cb => {
        const idx = parseInt(cb.dataset.index);
        if (configImpressao.campos[idx]) {
            configImpressao.campos[idx].enabled = cb.checked;
        }
    });
    configImpressao = {
        headerBgColor: document.getElementById('headerBgColor').value,
        headerTextColor: document.getElementById('headerTextColor').value,
        headerBorderColor: document.getElementById('headerBorderColor').value,
        headerFontSize: parseInt(document.getElementById('headerFontSize').value) || 13,
        headerFont: document.getElementById('headerFont').value,
        headerAlign: document.getElementById('headerAlign').value,
        headerPadding: parseInt(document.getElementById('headerPadding').value) || 30,
        logoMaxHeight: parseInt(document.getElementById('logoMaxHeight').value) || 80,
        logoUrl: document.getElementById('logoUrl').value.trim() || configImpressao.logoUrl,
        enderecoEmpresa: document.getElementById('enderecoEmpresa').value,
        clienteBgColor: document.getElementById('clienteBgColor').value,
        clienteTextColor: document.getElementById('clienteTextColor').value,
        clienteFontSize: parseInt(document.getElementById('clienteFontSize').value) || 12,
        clienteFont: document.getElementById('clienteFont').value,
        clienteAlign: document.getElementById('clienteAlign').value,
        clientePadding: parseInt(document.getElementById('clientePadding').value) || 15,
        tabelaHeaderBg: document.getElementById('tabelaHeaderBg').value,
        tabelaHeaderText: document.getElementById('tabelaHeaderText').value,
        tabelaHeaderFontSize: parseInt(document.getElementById('tabelaHeaderFontSize').value) || 12,
        tabelaDataFontSize: parseInt(document.getElementById('tabelaDataFontSize').value) || 12,
        tabelaFont: document.getElementById('tabelaFont').value,
        tabelaAlign: document.getElementById('tabelaAlign').value,
        tabelaLinhaPar: document.getElementById('tabelaLinhaPar').value,
        tabelaLinhaImpar: document.getElementById('tabelaLinhaImpar').value,
        textoContato: document.getElementById('textoContato').value,
        rodapeFontSize: parseInt(document.getElementById('rodapeFontSize').value) || 13,
        rodapeFont: document.getElementById('rodapeFont').value,
        rodapeAlign: document.getElementById('rodapeAlign').value,
        assinatura1: document.getElementById('assinatura1').value,
        assinatura2: document.getElementById('assinatura2').value,
        mostrarDataEmissao: document.getElementById('mostrarDataEmissao').value === 'true',
        larguraMaxima: parseInt(document.getElementById('larguraMaxima').value) || 1000,
        campos: configImpressao.campos
    };
    if (configImpressao.logoUrl) {
        atualizarLogo(configImpressao.logoUrl);
    }
    salvarConfiguracoesLocal();
    closeModal(elements.modalConfig);
    mostrarToast('Configurações salvas!', 'success');
}

function restaurarConfiguracoes() {
    if (!confirm('Restaurar padrões?')) return;
    configImpressao = {
        headerBgColor: '#1a3a5c',
        headerTextColor: '#ffffff',
        headerBorderColor: '#ffd700',
        headerFontSize: 13,
        headerFont: "'Courier New', monospace",
        headerAlign: 'center',
        headerPadding: 30,
        logoMaxHeight: 80,
        logoUrl: 'https://i.ibb.co/678L9Rqt/Chat-GPT-Image-31-de-jul-de-2026-18-54-24.png',
        enderecoEmpresa: 'RUA: INTERLAGOS | BAIRRO: IBERAPUERA | NUMERO: 129\nCIDADE: SINOP-MT | CEP: 78556-788',
        clienteBgColor: '#f8f9fa',
        clienteTextColor: '#333333',
        clienteFontSize: 12,
        clienteFont: "'Courier New', monospace",
        clienteAlign: 'left',
        clientePadding: 15,
        tabelaHeaderBg: '#1a3a5c',
        tabelaHeaderText: '#ffffff',
        tabelaHeaderFontSize: 12,
        tabelaDataFontSize: 12,
        tabelaFont: "'Courier New', monospace",
        tabelaAlign: 'left',
        tabelaLinhaPar: '#f8f9fa',
        tabelaLinhaImpar: '#ffffff',
        textoContato: 'CONTATO / WHATSAPP: (93) 8418-4950',
        rodapeFontSize: 13,
        rodapeFont: "'Courier New', monospace",
        rodapeAlign: 'center',
        assinatura1: 'SINOP-MT',
        assinatura2: 'ASSINATURA',
        mostrarDataEmissao: true,
        larguraMaxima: 1000,
        campos: JSON.parse(JSON.stringify(CAMPOS_PADRAO))
    };
    atualizarLogo(configImpressao.logoUrl);
    salvarConfiguracoesLocal();
    preencherFormConfig();
    mostrarToast('Configurações restauradas!', 'success');
}

// ============================================================
// TOAST
// ============================================================
function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: #ece9d8; border: 2px solid; border-color: #fff #404040 #404040 #fff;
        padding: 6px 20px; font-family: 'Tahoma','Geneva',sans-serif; font-size: 12px;
        box-shadow: 4px 4px 10px rgba(0,0,0,0.4); z-index: 9999;
        color: ${tipo === 'success' ? '#000' : '#c00'};
        font-weight: bold;
    `;
    toast.textContent = (tipo === 'success' ? '' : '') + mensagem;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ============================================================
// BUSCA DE CNPJ - REUTILIZÁVEL
// ============================================================
async function buscarCnpjGenerico(cnpj, campos) {
    if (cnpj.length !== 14 || !/^\d{14}$/.test(cnpj)) {
        mostrarToast('CNPJ inválido. Digite 14 números.', 'error');
        return null;
    }
    let data = null;
    let origem = '';
    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        if (response.ok) {
            data = await response.json();
            origem = 'BrasilAPI';
        } else if (response.status === 429) {
            mostrarToast('⚠️ Limite da BrasilAPI excedido, tentando fallback...', 'error');
        } else {
            throw new Error(`BrasilAPI retornou status ${response.status}`);
        }
    } catch (error) {
        console.warn('BrasilAPI falhou:', error.message);
        mostrarToast('⚠️ BrasilAPI indisponível, usando fallback...', 'error');
    }
    if (!data) {
        try {
            const response = await fetch(`https://api.cnpj.pw/cnpj/${cnpj}`);
            if (response.status === 503) {
                throw new Error('Limite de requisições do cnpj.pw excedido.');
            }
            if (!response.ok) throw new Error(`cnpj.pw retornou status ${response.status}`);
            data = await response.json();
            origem = 'cnpj.pw';
        } catch (error) {
            console.error('Fallback cnpj.pw também falhou:', error);
            mostrarToast('❌ Ambas as APIs falharam. Verifique sua conexão.', 'error');
            return null;
        }
    }
    if (!data) {
        mostrarToast('❌ Não foi possível obter dados do CNPJ.', 'error');
        return null;
    }
    if (campos.nome && (data.razao_social || data.nome_empresarial)) {
        campos.nome.value = data.razao_social || data.nome_empresarial || '';
    } else if (campos.nome && data.nome_fantasia) {
        campos.nome.value = data.nome_fantasia;
    }
    let ie = data.inscricao_estadual || data.ie || '';
    if (campos.ie) campos.ie.value = ie;
    let logradouro = data.logradouro || '';
    let numero = data.numero || '';
    let bairro = data.bairro || '';
    let cidade = data.municipio || data.municipio_desc || '';
    let uf = data.uf || '';
    let cep = data.cep || data.codigo_cep || '';
    if (!logradouro && data.endereco) {
        const partes = data.endereco.split(',');
        if (partes.length > 0) logradouro = partes[0].trim();
        if (!numero) {
            const match = data.endereco.match(/,?\s*(\d+)\s*/);
            if (match) numero = match[1];
        }
    }
    if (!bairro && data.bairro_desc) bairro = data.bairro_desc;
    if (!cidade && data.municipio_desc) cidade = data.municipio_desc;
    if (campos.logradouro) campos.logradouro.value = logradouro || '';
    if (campos.numero) campos.numero.value = numero || 's/n';
    if (campos.bairro) campos.bairro.value = bairro || '';
    if (campos.cidade) campos.cidade.value = cidade || '';
    if (campos.uf) campos.uf.value = uf || '';
    if (campos.cep) campos.cep.value = cep || '';
    let telefone = data.telefone_1 || data.telefone || '';
    if (telefone && data.ddd1) {
        telefone = `(${data.ddd1}) ${telefone}`;
    }
    if (campos.telefone) campos.telefone.value = telefone;
    if (campos.email) campos.email.value = data.correio_eletronico || data.email || '';
    mostrarToast(`✅ Dados carregados via ${origem}!`, 'success');
    console.log(`Dados obtidos via ${origem}:`, data);
    return data;
}

// ============================================================
// BUSCA CNPJ PARA TABELA DE FRETE
// ============================================================
const campoCnpj = document.getElementById('cnpj');
campoCnpj.addEventListener('blur', function() {
    const cnpj = this.value.replace(/\D/g, '');
    if (cnpj.length === 14) {
        const campos = {
            nome: document.getElementById('cliente'),
            ie: document.getElementById('ie'),
            logradouro: document.getElementById('logradouro'),
            numero: document.getElementById('numero'),
            bairro: document.getElementById('bairro'),
            cidade: document.getElementById('cidade'),
            uf: document.getElementById('uf'),
            cep: document.getElementById('cep'),
            telefone: document.getElementById('telefone'),
            email: document.getElementById('email')
        };
        buscarCnpjGenerico(cnpj, campos);
    }
});
campoCnpj.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const cnpj = this.value.replace(/\D/g, '');
        if (cnpj.length === 14) {
            const campos = {
                nome: document.getElementById('cliente'),
                ie: document.getElementById('ie'),
                logradouro: document.getElementById('logradouro'),
                numero: document.getElementById('numero'),
                bairro: document.getElementById('bairro'),
                cidade: document.getElementById('cidade'),
                uf: document.getElementById('uf'),
                cep: document.getElementById('cep'),
                telefone: document.getElementById('telefone'),
                email: document.getElementById('email')
            };
            buscarCnpjGenerico(cnpj, campos);
        } else {
            mostrarToast('Digite um CNPJ válido com 14 dígitos', 'error');
        }
    }
});

// ============================================================
// BUSCA CNPJ PARA CLIENTE DE COLETA / CRM
// ============================================================
const campoCnpjColeta = document.getElementById('cnpjClienteColeta');
campoCnpjColeta.addEventListener('blur', function() {
    const cnpj = this.value.replace(/\D/g, '');
    if (cnpj.length === 14) {
        const campos = {
            nome: document.getElementById('nomeClienteColeta'),
            ie: document.getElementById('ieClienteColeta'),
            logradouro: document.getElementById('logradouroClienteColeta'),
            numero: document.getElementById('numeroClienteColeta'),
            bairro: document.getElementById('bairroClienteColeta'),
            cidade: document.getElementById('cidadeClienteColeta'),
            uf: document.getElementById('ufClienteColeta'),
            cep: document.getElementById('cepClienteColeta'),
            telefone: document.getElementById('telefoneClienteColeta'),
            email: document.getElementById('emailClienteColeta')
        };
        buscarCnpjGenerico(cnpj, campos);
    }
});
campoCnpjColeta.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const cnpj = this.value.replace(/\D/g, '');
        if (cnpj.length === 14) {
            const campos = {
                nome: document.getElementById('nomeClienteColeta'),
                ie: document.getElementById('ieClienteColeta'),
                logradouro: document.getElementById('logradouroClienteColeta'),
                numero: document.getElementById('numeroClienteColeta'),
                bairro: document.getElementById('bairroClienteColeta'),
                cidade: document.getElementById('cidadeClienteColeta'),
                uf: document.getElementById('ufClienteColeta'),
                cep: document.getElementById('cepClienteColeta'),
                telefone: document.getElementById('telefoneClienteColeta'),
                email: document.getElementById('emailClienteColeta')
            };
            buscarCnpjGenerico(cnpj, campos);
        } else {
            mostrarToast('Digite um CNPJ válido com 14 dígitos', 'error');
        }
    }
});

// ============================================================
// FUNÇÕES SUPABASE - CLIENTES E COLETAS
// ============================================================
const supabaseHeaders = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
};

async function carregarClientesColeta() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes_coleta?select=*&order=id.asc`, {
            headers: supabaseHeaders
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        clientesColeta = await response.json();
        return clientesColeta;
    } catch (error) {
        console.error('Erro carregar clientes:', error);
        mostrarToast('Erro ao carregar clientes de coleta.', 'error');
        return [];
    }
}

async function carregarColetas() {
    try {
        const url = `${SUPABASE_URL}/rest/v1/coletas?select=*,clientes_coleta(nome)&order=id.desc`;
        const response = await fetch(url, { headers: supabaseHeaders });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        coletas = await response.json();
        return coletas;
    } catch (error) {
        console.error('Erro carregar coletas:', error);
        mostrarToast('Erro ao carregar coletas.', 'error');
        return [];
    }
}

async function criarClienteColeta(dados) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes_coleta`, {
            method: 'POST',
            headers: supabaseHeaders,
            body: JSON.stringify(dados)
        });
        const text = await response.text();
        if (!response.ok) {
            console.error('Erro resposta:', text);
            throw new Error(`Erro ${response.status}: ${text || response.statusText}`);
        }
        if (!text) return null;
        const json = JSON.parse(text);
        return json[0] || json;
    } catch (error) {
        console.error('Erro criar cliente:', error);
        mostrarToast('Erro ao criar cliente: ' + error.message, 'error');
        return null;
    }
}

async function criarColeta(dados) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/coletas`, {
            method: 'POST',
            headers: supabaseHeaders,
            body: JSON.stringify(dados)
        });
        const text = await response.text();
        if (!response.ok) {
            console.error('Erro resposta:', text);
            throw new Error(`Erro ${response.status}: ${text || response.statusText}`);
        }
        if (!text) return null;
        const json = JSON.parse(text);
        return json[0] || json;
    } catch (error) {
        console.error('Erro criar coleta:', error);
        mostrarToast('Erro ao criar coleta: ' + error.message, 'error');
        return null;
    }
}

async function atualizarColeta(id, status) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/coletas?id=eq.${id}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify({ status })
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ${response.status}: ${text}`);
        }
        mostrarToast('Status da coleta atualizado!', 'success');
        return true;
    } catch (error) {
        console.error('Erro atualizar coleta:', error);
        mostrarToast('Erro ao atualizar coleta: ' + error.message, 'error');
        return false;
    }
}

async function deletarColeta(id) {
    if (!confirm('Tem certeza que deseja excluir esta coleta?')) return;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/coletas?id=eq.${id}`, {
            method: 'DELETE',
            headers: supabaseHeaders
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ${response.status}: ${text}`);
        }
        mostrarToast('Coleta excluída com sucesso!', 'success');
        await carregarColetas();
        renderizarColetas();
    } catch (error) {
        console.error('Erro deletar coleta:', error);
        mostrarToast('Erro ao excluir coleta: ' + error.message, 'error');
    }
}

async function deletarClienteColeta(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente? Todas as coletas associadas também serão excluídas (CASCADE).')) return;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes_coleta?id=eq.${id}`, {
            method: 'DELETE',
            headers: supabaseHeaders
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ${response.status}: ${text}`);
        }
        mostrarToast('Cliente excluído com sucesso!', 'success');
        await carregarClientesColeta();
        await carregarColetas();
        renderizarClientesColeta();
        renderizarColetas();
        renderizarCRM(elements.buscaCRM.value);
        preencherSelectClientes();
    } catch (error) {
        console.error('Erro deletar cliente:', error);
        mostrarToast('Erro ao excluir cliente: ' + error.message, 'error');
    }
}

// ============================================================
// RENDERIZAÇÕES
// ============================================================
function renderizarColetas() {
    if (coletas.length === 0) {
        elements.corpoColeta.innerHTML =
            `<tr><td colspan="6" style="text-align:center;padding:20px;color:#666;">Nenhuma coleta encontrada</td></tr>`;
        return;
    }
    elements.corpoColeta.innerHTML = coletas.map(coleta => {
        const nomeCliente = coleta.clientes_coleta?.nome || 'Cliente não informado';
        const statusClass = coleta.status === 'pendente' ? 'status-pendente' : 'status-feita';
        return `
        <tr>
            <td><strong>#${coleta.id}</strong></td>
            <td>${nomeCliente}</td>
            <td>${coleta.volumes || 1}</td>
            <td>${new Date(coleta.data_publicacao).toLocaleDateString('pt-BR')}</td>
            <td class="${statusClass}">${coleta.status.toUpperCase()}</td>
            <td>
                <div class="actions">
                    ${coleta.status === 'pendente' ? 
                        `<button class="btn btn-sm btn-primary" onclick="marcarColetaFeita(${coleta.id})">Concluir</button>` : 
                        `<span style="color:#060;">✓ Concluída</span>`
                    }
                    <button class="btn btn-sm btn-danger" onclick="deletarColeta(${coleta.id})">Excluir</button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function renderizarClientesColeta() {
    if (clientesColeta.length === 0) {
        elements.corpoClientes.innerHTML =
            `<tr><td colspan="5" style="text-align:center;padding:20px;color:#666;">Nenhum cliente cadastrado</td></tr>`;
        return;
    }
    elements.corpoClientes.innerHTML = clientesColeta.map(cliente => `
        <tr>
            <td><strong>#${cliente.id}</strong></td>
            <td>${cliente.nome}</td>
            <td>${cliente.cnpj || '-'}</td>
            <td>${cliente.telefone || '-'}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deletarClienteColeta(${cliente.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function renderizarCRM(filtro = '') {
    let lista = clientesColeta;
    if (filtro) {
        const f = filtro.toLowerCase();
        lista = lista.filter(c =>
            c.nome.toLowerCase().includes(f) ||
            (c.cnpj && c.cnpj.includes(f))
        );
    }
    if (lista.length === 0) {
        elements.corpoCRM.innerHTML =
            `<tr><td colspan="8" style="text-align:center;padding:20px;color:#666;">Nenhum cliente encontrado</td></tr>`;
        return;
    }
    elements.corpoCRM.innerHTML = lista.map(cliente => `
        <tr>
            <td><strong>#${cliente.id}</strong></td>
            <td>${cliente.nome}</td>
            <td>${cliente.cnpj || '-'}</td>
            <td>${cliente.telefone || '-'}</td>
            <td>${cliente.email || '-'}</td>
            <td>${cliente.uf || '-'}</td>
            <td>${cliente.observacao || '-'}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-sm btn-primary" onclick="editarClienteCRM(${cliente.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletarClienteColeta(${cliente.id})">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================================
// EDIÇÃO DE CLIENTE NO CRM
// ============================================================
function editarClienteCRM(id) {
    const cliente = clientesColeta.find(c => c.id === id);
    if (!cliente) return;
    elements.clienteColetaId.value = cliente.id;
    elements.nomeClienteColeta.value = cliente.nome;
    elements.cnpjClienteColeta.value = cliente.cnpj || '';
    elements.telefoneClienteColeta.value = cliente.telefone || '';
    elements.emailClienteColeta.value = cliente.email || '';
    elements.ieClienteColeta.value = cliente.ie || '';
    elements.logradouroClienteColeta.value = cliente.logradouro || '';
    elements.numeroClienteColeta.value = cliente.numero || '';
    elements.bairroClienteColeta.value = cliente.bairro || '';
    elements.cidadeClienteColeta.value = cliente.cidade || '';
    elements.ufClienteColeta.value = cliente.uf || '';
    elements.cepClienteColeta.value = cliente.cep || '';
    elements.observacaoClienteColeta.value = cliente.observacao || '';
    elements.modalClienteColetaTitle.textContent = 'Editar Cliente';
    openModal(elements.modalClienteColeta);
}

// ============================================================
// AÇÕES DE COLETA
// ============================================================
async function marcarColetaFeita(id) {
    if (!confirm('Marcar esta coleta como FEITA?')) return;
    const ok = await atualizarColeta(id, 'feita');
    if (ok) {
        await carregarColetas();
        renderizarColetas();
    }
}

// ============================================================
// ABRIR MODAIS
// ============================================================
async function abrirModalColeta() {
    await carregarClientesColeta();
    await carregarColetas();
    renderizarColetas();
    openModal(elements.modalColeta);
}

async function abrirModalNovaColeta() {
    await carregarClientesColeta();
    preencherSelectClientes();
    elements.formNovaColeta.reset();
    openModal(elements.modalNovaColeta);
}

function preencherSelectClientes() {
    const select = elements.clienteColetaSelect;
    select.innerHTML = '<option value="">Selecione um cliente</option>';
    clientesColeta.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nome + (cliente.cnpj ? ` (${cliente.cnpj})` : '');
        select.appendChild(option);
    });
}

async function abrirGerenciarClientes() {
    await carregarClientesColeta();
    renderizarClientesColeta();
    openModal(elements.modalGerenciarClientes);
}

async function abrirCRM() {
    await carregarClientesColeta();
    renderizarCRM(elements.buscaCRM.value);
    openModal(elements.modalCRM);
}

// ============================================================
// SALVAR CLIENTE DE COLETA / CRM
// ============================================================
async function salvarClienteColeta(event) {
    event.preventDefault();
    const dados = {
        nome: elements.nomeClienteColeta.value.trim(),
        cnpj: elements.cnpjClienteColeta.value.trim(),
        telefone: elements.telefoneClienteColeta.value.trim(),
        email: elements.emailClienteColeta.value.trim(),
        ie: elements.ieClienteColeta.value.trim(),
        logradouro: elements.logradouroClienteColeta.value.trim(),
        numero: elements.numeroClienteColeta.value.trim(),
        bairro: elements.bairroClienteColeta.value.trim(),
        cidade: elements.cidadeClienteColeta.value.trim(),
        uf: elements.ufClienteColeta.value.trim().toUpperCase(),
        cep: elements.cepClienteColeta.value.trim(),
        observacao: elements.observacaoClienteColeta.value.trim()
    };
    if (!dados.nome) {
        mostrarToast('Nome do cliente é obrigatório!', 'error');
        return;
    }
    const id = parseInt(elements.clienteColetaId.value);
    let novo = null;
    if (id) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes_coleta?id=eq.${id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(dados)
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Erro ${response.status}: ${text}`);
            }
            mostrarToast('Cliente atualizado com sucesso!', 'success');
            novo = { id, ...dados };
        } catch (error) {
            console.error('Erro atualizar cliente:', error);
            mostrarToast('Erro ao atualizar cliente: ' + error.message, 'error');
            return;
        }
    } else {
        novo = await criarClienteColeta(dados);
        if (!novo) return;
        mostrarToast('Cliente criado com sucesso!', 'success');
    }
    await carregarClientesColeta();
    preencherSelectClientes();
    if (elements.modalGerenciarClientes.classList.contains('active')) {
        renderizarClientesColeta();
    }
    if (elements.modalCRM.classList.contains('active')) {
        renderizarCRM(elements.buscaCRM.value);
    }
    closeModal(elements.modalClienteColeta);
    if (elements.modalNovaColeta.classList.contains('active') && novo) {
        elements.clienteColetaSelect.value = novo.id;
    }
}

// ============================================================
// PUBLICAR COLETA
// ============================================================
async function publicarColeta(event) {
    event.preventDefault();
    const clienteId = parseInt(elements.clienteColetaSelect.value);
    const volumes = parseInt(elements.volumesColeta.value) || 1;
    if (!clienteId) {
        mostrarToast('Selecione um cliente!', 'error');
        return;
    }
    const dados = {
        cliente_id: clienteId,
        volumes: volumes,
        status: 'pendente',
        data_publicacao: new Date().toISOString().split('T')[0]
    };
    const nova = await criarColeta(dados);
    if (nova) {
        mostrarToast('Coleta publicada com sucesso!', 'success');
        closeModal(elements.modalNovaColeta);
        await carregarColetas();
        renderizarColetas();
    }
}

// ============================================================
// EVENTOS DO MÓDULO COLETA E CRM
// ============================================================
elements.menuColeta.addEventListener('click', abrirModalColeta);
elements.btnNovaColeta.addEventListener('click', abrirModalNovaColeta);
elements.btnGerenciarClientes.addEventListener('click', abrirGerenciarClientes);
elements.btnAtualizarColeta.addEventListener('click', async function() {
    await carregarColetas();
    renderizarColetas();
    mostrarToast('Coletas atualizadas!', 'success');
});
elements.btnNovoClienteColeta.addEventListener('click', function() {
    elements.formClienteColeta.reset();
    elements.clienteColetaId.value = '';
    elements.modalClienteColetaTitle.textContent = 'Cadastrar Cliente';
    openModal(elements.modalClienteColeta);
});
elements.btnNovoClienteGerenciar.addEventListener('click', function() {
    elements.formClienteColeta.reset();
    elements.clienteColetaId.value = '';
    elements.modalClienteColetaTitle.textContent = 'Cadastrar Cliente';
    openModal(elements.modalClienteColeta);
});
elements.btnAtualizarClientes.addEventListener('click', async function() {
    await carregarClientesColeta();
    renderizarClientesColeta();
    mostrarToast('Clientes atualizados!', 'success');
});

// CRM
elements.menuCRM.addEventListener('click', abrirCRM);
elements.btnNovoClienteCRM.addEventListener('click', function() {
    elements.formClienteColeta.reset();
    elements.clienteColetaId.value = '';
    elements.modalClienteColetaTitle.textContent = 'Cadastrar Cliente';
    openModal(elements.modalClienteColeta);
});
elements.btnAtualizarCRM.addEventListener('click', async function() {
    await carregarClientesColeta();
    renderizarCRM(elements.buscaCRM.value);
    mostrarToast('Clientes atualizados!', 'success');
});
elements.buscaCRM.addEventListener('input', function() {
    renderizarCRM(this.value);
});

// Formulários
elements.formClienteColeta.addEventListener('submit', salvarClienteColeta);
elements.formNovaColeta.addEventListener('submit', publicarColeta);

// ============================================================
// EVENTOS GERAIS
// ============================================================
elements.btnNovo.addEventListener('click', abrirModalNovo);
elements.btnConfigurar.addEventListener('click', function() {
    preencherFormConfig();
    openModal(elements.modalConfig);
});
elements.btnBuscar.addEventListener('click', function() {
    renderizarTabelas(elements.searchInput.value);
});
elements.searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') renderizarTabelas(this.value);
});
elements.btnLimpar.addEventListener('click', function() {
    elements.searchInput.value = '';
    renderizarTabelas();
});
elements.form.addEventListener('submit', salvarTabela);
elements.formConfig.addEventListener('submit', salvarConfiguracoes);
elements.btnResetConfig.addEventListener('click', restaurarConfiguracoes);
document.getElementById('logoMaxHeight').addEventListener('input', function() {
    const val = parseInt(this.value) || 80;
    configImpressao.logoMaxHeight = val;
    elements.previewLogoTamanho.textContent = 'Logo: ' + val + 'px';
    atualizarPreview();
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', async function() {
    carregarConfiguracoes();
    await carregarDados();
    document.querySelectorAll('#formConfig input, #formConfig select, #formConfig textarea').forEach(el => {
        el.addEventListener('input', atualizarPreview);
        el.addEventListener('change', atualizarPreview);
    });
    atualizarPreview();
    carregarClientesColeta();
    carregarColetas();
});
