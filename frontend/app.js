/**
 * DocuMind-RAG — Document Intelligence Assistant
 * Frontend Application Logic & Simulation Engine
 *
 * NOTE: All vector search queries, similarity scores, latency figures, and LLM responses
 * are locally simulated for UI evaluation. No live backend servers or external APIs are connected.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Initial State & Configuration
  // =========================================================================
  const state = {
    currentView: 'chat',
    activeConversationId: 'monopoly-rules',
    sourcesPanelOpen: true,
    theme: localStorage.getItem('documind_theme') || 'dark',
    accentColor: localStorage.getItem('documind_accent') || 'indigo',
    temperature: parseFloat(localStorage.getItem('documind_temperature')) || 0.2,
    topK: parseInt(localStorage.getItem('documind_top_k'), 10) || 5,
    selectedModel: localStorage.getItem('documind_model') || 'mistral',
    selectedProvider: localStorage.getItem('documind_provider') || 'ollama',
    searchQuery: '',
    categoryFilter: 'all',
  };

  // =========================================================================
  // 2. Mock Grounded Knowledge Chunks (Extracted from repository PDFs)
  // =========================================================================
  const knowledgeChunks = {
    monopoly: [
      {
        id: 'data/monopoly.pdf:3:1',
        filename: 'monopoly.pdf',
        page: 3,
        chunk: 1,
        score: '94.2%',
        charCount: 382,
        text: "BANKER: Select as Banker a player who will also make a good Auctioneer. A Banker who plays in the game must keep their personal funds separate from the Bank's funds. Each player is given $1,500 divided as follows: 2 each of $500's, $100's and $50's; 6 $20's; 5 each of $10's, $5's and $1's. All remaining money and other equipment go to the Bank.",
      },
      {
        id: 'data/monopoly.pdf:4:0',
        filename: 'monopoly.pdf',
        page: 4,
        chunk: 0,
        score: '88.1%',
        charCount: 345,
        text: 'JAIL: You land in Jail when: (1) Your token lands on the space marked "Go to Jail"; (2) You draw a card marked "Go to Jail"; or (3) You throw doubles three times in succession. When you are sent to Jail you cannot collect your $200 salary in that move since, regardless of where your token is on the board, you must move directly into Jail.',
      },
      {
        id: 'data/monopoly.pdf:5:2',
        filename: 'monopoly.pdf',
        page: 5,
        chunk: 2,
        score: '93.5%',
        charCount: 420,
        text: 'BANKRUPTCY: You are declared bankrupt if you owe more than you can pay either to another player or to the Bank. If your debt is to another player, you must turn over to that player all that you have of value and retire from the game. In making this settlement, if you own houses or hotels, you must return these to the Bank for half their original value...',
      },
    ],
    ticket: [
      {
        id: 'data/ticket_to_ride.pdf:6:0',
        filename: 'ticket_to_ride.pdf',
        page: 6,
        chunk: 0,
        score: '91.0%',
        charCount: 360,
        text: 'LONGEST CONTINUOUS PATH BONUS: The player who has the Longest Continuous Path of routes gets the 10 point bonus card. If two or more players are tied for the longest path, each tied player receives 10 points. Players verify their paths by counting the continuous train cars along connected routes without looping.',
      },
      {
        id: 'data/ticket_to_ride.pdf:4:2',
        filename: 'ticket_to_ride.pdf',
        page: 4,
        chunk: 2,
        score: '89.6%',
        charCount: 395,
        text: 'DESTINATION TICKETS: A player can use their turn to draw more Destination Ticket cards. To do so, they draw 3 cards from the top of the Destination Ticket deck. The player must keep at least one of these tickets. If a Destination Ticket is completed by the end of the game, the points are added. If incomplete, the points are deducted.',
      },
      {
        id: 'data/ticket_to_ride.pdf:3:1',
        filename: 'ticket_to_ride.pdf',
        page: 3,
        chunk: 1,
        score: '84.8%',
        charCount: 330,
        text: 'CLAIMING ROUTES: To claim a route on the board, a player must play a set of Train Car cards matching the color and length of the route, and place their colored plastic trains on each space of the route. Once claimed, the player scores points according to the Route Scoring Table.',
      },
    ],
    supplemental: [
      {
        id: 'data/drafts/supplemental_rules.pdf:1:0',
        filename: 'supplemental_rules.pdf',
        page: 1,
        chunk: 0,
        score: '87.4%',
        charCount: 290,
        text: 'TOURNAMENT TIE-BREAKER PROTOCOL: In case of final score ties after applying standard bonuses and destination penalties, the tied player with the highest number of completed destination tickets wins. If still tied, the player with the longest single train route takes the victory.',
      },
      {
        id: 'data/drafts/supplemental_rules.pdf:2:1',
        filename: 'supplemental_rules.pdf',
        page: 2,
        chunk: 1,
        score: '82.0%',
        charCount: 310,
        text: 'SPEED PLAY TIME CONSTRAINTS: Each turn has a recommended maximum duration of 60 seconds. Players taking more than 90 seconds forfeit their train placement for that turn and may only draw a single train car card from the face-up pool.',
      },
    ],
  };

  // Pre-configured Sample Conversations
  const conversationLibrary = {
    'monopoly-rules': {
      title: 'Monopoly Starting Bankroll',
      breadcrumb: 'Chats > Monopoly Starting Bankroll',
      sources: [knowledgeChunks.monopoly[0], knowledgeChunks.monopoly[1], knowledgeChunks.monopoly[2]],
      messages: [
        {
          sender: 'user',
          text: 'How much total money does a player start with in Monopoly? Please list the exact breakdown of bills.',
          time: '10:42 AM',
        },
        {
          sender: 'assistant',
          time: '10:42 AM',
          retrievalMs: 18,
          genMs: 310,
          citationId: 'src-data-monopoly-pdf-3-1',
          citationText: 'monopoly.pdf:3:1',
          citationScore: '94% match',
          bodyHtml: `
            <p>According to the official Monopoly rules in <strong>data/monopoly.pdf</strong>, each player starts the game with a total of <strong>$1,500</strong>.</p>
            <div class="highlight-callout">
              <span class="callout-title">Official Starting Bankroll Breakdown:</span>
              <ul class="breakdown-list">
                <li><strong>2</strong> &times; $500 bills ($1,000)</li>
                <li><strong>2</strong> &times; $100 bills ($200)</li>
                <li><strong>2</strong> &times; $50 bills ($100)</li>
                <li><strong>6</strong> &times; $20 bills ($120)</li>
                <li><strong>5</strong> &times; $10 bills ($50)</li>
                <li><strong>5</strong> &times; $5 bills ($25)</li>
                <li><strong>5</strong> &times; $1 bills ($5)</li>
              </ul>
              <div class="callout-total"><strong>Total:</strong> $1,500 per player</div>
            </div>
          `,
        },
      ],
    },
    'ticket-to-ride': {
      title: 'Longest Continuous Path',
      breadcrumb: 'Chats > Longest Continuous Path',
      sources: [knowledgeChunks.ticket[0], knowledgeChunks.ticket[1], knowledgeChunks.ticket[2]],
      messages: [
        {
          sender: 'user',
          text: 'How many bonus points does a player earn for the longest continuous train path in Ticket to Ride?',
          time: '10:45 AM',
        },
        {
          sender: 'assistant',
          time: '10:45 AM',
          retrievalMs: 22,
          genMs: 245,
          citationId: 'src-data-ticket-to-ride-pdf-6-0',
          citationText: 'ticket_to_ride.pdf:6:0',
          citationScore: '91% match',
          bodyHtml: `
            <p>In <strong>Ticket to Ride</strong> (from <code>data/ticket_to_ride.pdf</code>, Page 6), the player who creates the continuous path of routes with the most connected trains receives the <strong>Longest Continuous Path Bonus card</strong>, which awards <strong>10 bonus points</strong> at final scoring.</p>
            <p>If two or more players are tied for the longest continuous path, both players receive the full 10-point bonus.</p>
          `,
        },
      ],
    },
    'bankruptcy-rules': {
      title: 'Bankruptcy & Mortgages',
      breadcrumb: 'Chats > Bankruptcy & Mortgages',
      sources: [knowledgeChunks.monopoly[2], knowledgeChunks.monopoly[0]],
      messages: [
        {
          sender: 'user',
          text: 'What happens when a player cannot pay their debt and goes bankrupt in Monopoly?',
          time: '11:02 AM',
        },
        {
          sender: 'assistant',
          time: '11:02 AM',
          retrievalMs: 26,
          genMs: 340,
          citationId: 'src-data-monopoly-pdf-5-2',
          citationText: 'monopoly.pdf:5:2',
          citationScore: '93% match',
          bodyHtml: `
            <p>Under official Monopoly rules (<code>data/monopoly.pdf</code>, Page 5), you are declared <strong>bankrupt</strong> if you owe more than you can pay either to another player or to the Bank:</p>
            <ul style="margin: 8px 0 8px 20px; line-height: 1.6;">
              <li><strong>Debt to a player:</strong> You must surrender all cash and properties of value to that creditor and immediately retire from the game.</li>
              <li><strong>Houses & Hotels:</strong> Must be sold back to the Bank at half price before surrendering property.</li>
              <li><strong>Debt to the Bank:</strong> All your assets turn over to the Bank, which immediately auctions all mortgaged properties to the highest bidder.</li>
            </ul>
          `,
        },
      ],
    },
  };

  // Keyword Matching for simulated dynamic Q&A
  const dynamicQA = [
    {
      keywords: ['jail', 'doubles', 'three times'],
      docKey: 'monopoly',
      chunkIndex: 1,
      answer:
        'In Monopoly (according to <code>data/monopoly.pdf</code>, Page 4), if you roll doubles <strong>three times in succession</strong> on the same turn, your turn ends immediately and you must go directly to <strong>Jail</strong>. You do not collect the $200 salary for passing GO.',
    },
    {
      keywords: ['destination', 'ticket', 'incomplete', 'score', 'end of game'],
      docKey: 'ticket',
      chunkIndex: 1,
      answer:
        'In Ticket to Ride (from <code>data/ticket_to_ride.pdf</code>, Page 4), at final scoring: completed Destination Tickets have their point value <strong>added</strong> to your final score. However, any <strong>uncompleted Destination Tickets are deducted</strong> from your score.',
    },
    {
      keywords: ['claim', 'route', 'card', 'scoring table'],
      docKey: 'ticket',
      chunkIndex: 2,
      answer:
        'To claim a route in Ticket to Ride (<code>data/ticket_to_ride.pdf</code>, Page 3), you must play a set of Train Car cards matching the route’s color and length, and place your colored trains on the spaces. Points are immediately scored according to route length.',
    },
    {
      keywords: ['money', 'starting', 'start', 'bankroll', '1500'],
      docKey: 'monopoly',
      chunkIndex: 0,
      answer:
        'Each player starts standard Monopoly with <strong>$1,500</strong>: two $500s, two $100s, two $50s, six $20s, five $10s, five $5s, and five $1s (<code>data/monopoly.pdf</code>, Page 3).',
    },
    {
      keywords: ['tie', 'tournament', 'tie-breaker', 'protocol'],
      docKey: 'supplemental',
      chunkIndex: 0,
      answer:
        'According to tournament house rules (<code>data/drafts/supplemental_rules.pdf</code>), ties are resolved first by the highest number of completed destination tickets, and second by the length of the longest continuous route.',
    },
  ];

  // =========================================================================
  // 3. DOM Elements Lookup
  // =========================================================================
  const elements = {
    // Navigation
    navChat: document.getElementById('navChat'),
    navDocuments: document.getElementById('navDocuments'),
    navSettings: document.getElementById('navSettings'),

    // Views
    viewChat: document.getElementById('viewChat'),
    viewDocuments: document.getElementById('viewDocuments'),
    viewSettings: document.getElementById('viewSettings'),
    breadcrumbTitle: document.getElementById('breadcrumbTitle'),

    // Sidebar & Mobile
    appSidebar: document.getElementById('appSidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileSidebarCloseBtn: document.getElementById('mobileSidebarCloseBtn'),
    btnNewChat: document.getElementById('btnNewChat'),
    historyList: document.getElementById('historyList'),
    footerModelMeta: document.getElementById('footerModelMeta'),

    // Chat Screen
    chatMessages: document.getElementById('chatMessages'),
    messageThread: document.getElementById('messageThread'),
    welcomeHero: document.getElementById('welcomeHero'),
    chatInput: document.getElementById('chatInput'),
    btnSendMessage: document.getElementById('btnSendMessage'),
    btnAttachDoc: document.getElementById('btnAttachDoc'),
    typingIndicator: document.getElementById('typingIndicator'),
    composerTopKPill: document.getElementById('composerTopKPill'),

    // Navbar Elements
    modelSelectorPill: document.getElementById('modelSelectorPill'),
    navbarModelLabel: document.getElementById('navbarModelLabel'),
    btnToggleSources: document.getElementById('btnToggleSources'),
    btnCloseSources: document.getElementById('btnCloseSources'),

    // Sources Panel
    sourcesPanel: document.getElementById('sourcesPanel'),
    sourcesList: document.getElementById('sourcesList'),
    sourceCountBadge: document.getElementById('sourceCountBadge'),

    // Document Library
    docSearchInput: document.getElementById('docSearchInput'),
    docCategoryFilters: document.getElementById('docCategoryFilters'),
    documentsGrid: document.getElementById('documentsGrid'),
    emptyDocsState: document.getElementById('emptyDocsState'),
    emptyDocsMsg: document.getElementById('emptyDocsMsg'),
    btnResetDocFilters: document.getElementById('btnResetDocFilters'),
    dropzoneBox: document.getElementById('dropzoneBox'),
    btnSelectFiles: document.getElementById('btnSelectFiles'),
    hiddenFileInput: document.getElementById('hiddenFileInput'),
    btnUploadDocDemo: document.getElementById('btnUploadDocDemo'),

    // Settings Controls
    settingTemperature: document.getElementById('settingTemperature'),
    tempValueDisplay: document.getElementById('tempValueDisplay'),
    settingTopK: document.getElementById('settingTopK'),
    kValueDisplay: document.getElementById('kValueDisplay'),
    settingModelName: document.getElementById('settingModelName'),
    settingModelProvider: document.getElementById('settingModelProvider'),
    settingEmbeddingFunc: document.getElementById('settingEmbeddingFunc'),
    btnSaveSettings: document.getElementById('btnSaveSettings'),
    btnResetSettings: document.getElementById('btnResetSettings'),

    // Modal & Toast
    chunksModal: document.getElementById('chunksModal'),
    modalDocTitle: document.getElementById('modalDocTitle'),
    modalChunkCount: document.getElementById('modalChunkCount'),
    modalChunksContent: document.getElementById('modalChunksContent'),
    btnCloseModal: document.getElementById('btnCloseModal'),
    btnFooterCloseModal: document.getElementById('btnFooterCloseModal'),
    toastContainer: document.getElementById('toastContainer'),
  };

  // =========================================================================
  // 4. Initialization & State Restoration
  // =========================================================================
  function init() {
    // 1. Restore Theme
    applyTheme(state.theme);
    applyAccent(state.accentColor);

    // 2. Restore Settings in UI controls
    if (elements.settingTemperature && elements.tempValueDisplay) {
      elements.settingTemperature.value = state.temperature;
      elements.tempValueDisplay.textContent = state.temperature;
    }
    if (elements.settingTopK && elements.kValueDisplay) {
      elements.settingTopK.value = state.topK;
      elements.kValueDisplay.textContent = state.topK;
      if (elements.composerTopKPill) elements.composerTopKPill.textContent = `k = ${state.topK} chunks`;
    }
    if (elements.settingModelName) {
      elements.settingModelName.value = state.selectedModel;
    }
    if (elements.settingModelProvider) {
      elements.settingModelProvider.value = state.selectedProvider;
    }
    updateNavbarModelLabel();

    // 3. Load initial conversation
    loadConversation(state.activeConversationId);
  }

  function applyTheme(themeName) {
    state.theme = themeName;
    document.body.className = themeName === 'slate' ? 'theme-slate' : 'theme-dark';
    localStorage.setItem('documind_theme', themeName);

    // Update active state in settings radio buttons
    document.querySelectorAll('.theme-option').forEach((opt) => {
      const active = opt.dataset.theme === themeName;
      opt.classList.toggle('active', active);
      opt.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  function applyAccent(colorName) {
    state.accentColor = colorName;
    document.body.dataset.accent = colorName;
    localStorage.setItem('documind_accent', colorName);

    document.querySelectorAll('.color-dot').forEach((dot) => {
      dot.classList.toggle('active', dot.dataset.color === colorName);
    });
  }

  function updateNavbarModelLabel() {
    if (elements.navbarModelLabel) {
      elements.navbarModelLabel.textContent = `${state.selectedModel} (${state.selectedProvider} • Demo)`;
    }
    if (elements.footerModelMeta) {
      elements.footerModelMeta.textContent = `${state.selectedModel} (${state.selectedProvider})`;
    }
  }

  // =========================================================================
  // 5. Navigation & View Switching
  // =========================================================================
  function switchView(viewName) {
    state.currentView = viewName;

    // Nav Buttons
    [elements.navChat, elements.navDocuments, elements.navSettings].forEach((btn) => {
      if (btn) btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // View Panels
    const panels = {
      chat: elements.viewChat,
      documents: elements.viewDocuments,
      settings: elements.viewSettings,
    };

    Object.entries(panels).forEach(([key, panel]) => {
      if (panel) panel.classList.toggle('active', key === viewName);
    });

    // Update Breadcrumb
    const titles = {
      chat: 'Chat Assistant',
      documents: 'Document Library',
      settings: 'Settings & Models',
    };
    if (elements.breadcrumbTitle) {
      elements.breadcrumbTitle.textContent = titles[viewName] || 'Dashboard';
    }

    closeMobileSidebar();
  }

  if (elements.navChat) elements.navChat.addEventListener('click', () => switchView('chat'));
  if (elements.navDocuments) elements.navDocuments.addEventListener('click', () => switchView('documents'));
  if (elements.navSettings) elements.navSettings.addEventListener('click', () => switchView('settings'));

  // Clicking model pill in navbar navigates to settings view
  if (elements.modelSelectorPill) {
    elements.modelSelectorPill.addEventListener('click', () => {
      switchView('settings');
      showToast('Opened Model Configuration settings');
    });
  }

  // Mobile sidebar drawer
  if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener('click', () => {
      elements.appSidebar.classList.add('mobile-open');
      elements.sidebarBackdrop.classList.add('active');
    });
  }

  if (elements.mobileSidebarCloseBtn) {
    elements.mobileSidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (elements.sidebarBackdrop) {
    elements.sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  function closeMobileSidebar() {
    if (elements.appSidebar) elements.appSidebar.classList.remove('mobile-open');
    if (elements.sidebarBackdrop) elements.sidebarBackdrop.classList.remove('active');
  }

  // =========================================================================
  // 6. Sources Drawer Controls & Highlights
  // =========================================================================
  function toggleSourcesPanel(forceOpen = null) {
    if (forceOpen !== null) {
      state.sourcesPanelOpen = forceOpen;
    } else {
      state.sourcesPanelOpen = !state.sourcesPanelOpen;
    }

    elements.sourcesPanel.classList.toggle('open', state.sourcesPanelOpen);
    elements.btnToggleSources.classList.toggle('active', state.sourcesPanelOpen);
    elements.btnToggleSources.setAttribute('aria-expanded', state.sourcesPanelOpen ? 'true' : 'false');
  }

  if (elements.btnToggleSources) {
    elements.btnToggleSources.addEventListener('click', () => toggleSourcesPanel());
  }

  if (elements.btnCloseSources) {
    elements.btnCloseSources.addEventListener('click', () => toggleSourcesPanel(false));
  }

  function highlightCitation(cardId) {
    toggleSourcesPanel(true);
    setTimeout(() => {
      const card = document.getElementById(cardId);
      if (card) {
        document.querySelectorAll('.source-card').forEach((c) => {
          c.classList.remove('active');
          c.classList.remove('flash-highlight');
        });
        card.classList.add('active');
        card.classList.add('flash-highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast(`Viewing cited excerpt: ${card.querySelector('.source-filename').textContent}`);
      }
    }, 150);
  }

  function renderSourcesList(sources) {
    if (!elements.sourcesList) return;
    elements.sourcesList.innerHTML = '';

    sources.forEach((chunk) => {
      const cardId = 'src-' + chunk.id.replace(/[^a-zA-Z0-9]/g, '-');
      const art = document.createElement('article');
      art.className = 'source-card';
      art.id = cardId;
      art.innerHTML = `
        <div class="source-card-header">
          <div class="source-file-info">
            <span class="file-icon-pdf">PDF</span>
            <div>
              <h4 class="source-filename">${chunk.filename}</h4>
              <span class="source-page-tag">Page ${chunk.page} &bull; Chunk #${chunk.chunk}</span>
            </div>
          </div>
          <div class="similarity-score-badge" title="Cosine distance similarity score (Simulated)">
            <span>${chunk.score} Match</span>
          </div>
        </div>
        <div class="source-card-body">
          <blockquote class="source-excerpt">
            "${escapeHtml(chunk.text)}"
          </blockquote>
        </div>
        <div class="source-card-footer">
          <span class="chunk-id-tag">ID: ${chunk.id}</span>
          <button class="btn btn-ghost btn-xs copy-excerpt-btn" title="Copy excerpt to clipboard">Copy</button>
        </div>
      `;
      elements.sourcesList.appendChild(art);
    });

    if (elements.sourceCountBadge) {
      elements.sourceCountBadge.textContent = sources.length;
    }
  }

  // =========================================================================
  // 7. Conversation Library & History Switching
  // =========================================================================
  function loadConversation(convId) {
    const conv = conversationLibrary[convId];
    if (!conv) return;

    state.activeConversationId = convId;

    // Update active history list styling
    document.querySelectorAll('.history-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.convId === convId);
    });

    // Hide hero and show thread
    if (elements.welcomeHero) elements.welcomeHero.style.display = 'none';
    if (elements.breadcrumbTitle) elements.breadcrumbTitle.textContent = conv.breadcrumb;

    // Render messages
    elements.messageThread.innerHTML = '';
    conv.messages.forEach((msg) => {
      if (msg.sender === 'user') {
        elements.messageThread.appendChild(renderUserMessage(msg.text, msg.time));
      } else {
        elements.messageThread.appendChild(renderAssistantMessage(msg));
      }
    });

    // Render matching sources
    renderSourcesList(conv.sources);
    bindMessageActions();
    scrollChatToBottom();
  }

  // History item clicks
  document.querySelectorAll('.history-list .history-item').forEach((item) => {
    item.addEventListener('click', () => {
      loadConversation(item.dataset.convId);
      switchView('chat');
      showToast(`Switched conversation: "${item.querySelector('.history-text').textContent}"`);
    });

    // Keyboard navigation (Enter / Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // =========================================================================
  // 8. New Chat Reset Action
  // =========================================================================
  if (elements.btnNewChat) {
    elements.btnNewChat.addEventListener('click', startNewChat);
  }

  function startNewChat() {
    switchView('chat');
    state.activeConversationId = null;

    // Deselect all history items
    document.querySelectorAll('.history-item').forEach((i) => i.classList.remove('active'));

    // Clear messages and reveal welcome hero
    elements.messageThread.innerHTML = '';
    if (elements.welcomeHero) elements.welcomeHero.style.display = 'flex';
    if (elements.breadcrumbTitle) elements.breadcrumbTitle.textContent = 'Chats > New Chat';

    // Clear input & focus
    if (elements.chatInput) {
      elements.chatInput.value = '';
      elements.chatInput.style.height = 'auto';
      elements.chatInput.focus();
    }

    // Reset sources to a clean state
    renderSourcesList([knowledgeChunks.monopoly[0], knowledgeChunks.ticket[0]]);
    showToast('Started new conversation thread');
  }

  // =========================================================================
  // 9. Chat Message Generation & Rendering
  // =========================================================================
  function renderUserMessage(text, time = getCurrentTime()) {
    const div = document.createElement('div');
    div.className = 'message message-user';
    div.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="sender-name">You</span>
          <span class="message-time">${time}</span>
        </div>
        <div class="message-body">
          <p>${escapeHtml(text)}</p>
        </div>
      </div>
    `;
    return div;
  }

  function renderAssistantMessage(data) {
    const div = document.createElement('div');
    div.className = 'message message-assistant';
    div.innerHTML = `
      <div class="message-avatar">
        <div class="ai-avatar-glow"></div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="sender-name">DocuMind-RAG</span>
          <span class="badge badge-model">${state.selectedModel} (${state.selectedProvider})</span>
          <span class="badge badge-simulated">Simulated Response</span>
          <span class="message-time">${data.time || getCurrentTime()}</span>
        </div>
        <div class="message-body">
          ${data.bodyHtml}
          ${
            data.citationId
              ? `
            <div class="citations-container">
              <span class="citation-label">Verified Citations:</span>
              <button class="citation-pill" data-source-id="${data.citationId}" title="Click to view and inspect cited chunk in Sources Panel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="citation-icon" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>${data.citationText}</span>
                <span class="citation-score">${data.citationScore}</span>
              </button>
            </div>
          `
              : ''
          }
        </div>
        <div class="message-footer">
          <div class="latency-pill" title="Simulated retrieval and generation performance metric">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Simulated Latency: ~${data.retrievalMs}ms vector search &bull; ~${data.genMs}ms inference</span>
          </div>
          <div class="action-buttons">
            <button class="action-btn copy-btn" title="Copy response to clipboard" aria-label="Copy response">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="action-btn thumb-up-btn" title="Mark response as helpful (Demo feedback)" aria-label="Mark helpful">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>
            <button class="action-btn thumb-down-btn" title="Mark response as unhelpful (Demo feedback)" aria-label="Mark unhelpful">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    return div;
  }

  function bindMessageActions() {
    // Citation Pills
    document.querySelectorAll('.citation-pill').forEach((pill) => {
      pill.onclick = () => {
        const srcId = pill.dataset.sourceId;
        if (srcId) highlightCitation(srcId);
      };
    });

    // Copy Response Buttons
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.onclick = () => {
        const bodyText = btn.closest('.message-content').querySelector('.message-body').innerText;
        navigator.clipboard.writeText(bodyText).then(() => {
          showToast('Copied message text to clipboard');
        });
      };
    });

    // Feedback Thumbs Buttons
    document.querySelectorAll('.thumb-up-btn').forEach((btn) => {
      btn.onclick = () => {
        const isAlready = btn.classList.contains('active-thumb-up');
        btn.classList.toggle('active-thumb-up');
        btn.parentElement.querySelector('.thumb-down-btn').classList.remove('active-thumb-down');
        showToast(isAlready ? 'Feedback removed' : 'Marked response as helpful (Simulated feedback)');
      };
    });

    document.querySelectorAll('.thumb-down-btn').forEach((btn) => {
      btn.onclick = () => {
        const isAlready = btn.classList.contains('active-thumb-down');
        btn.classList.toggle('active-thumb-down');
        btn.parentElement.querySelector('.thumb-up-btn').classList.remove('active-thumb-up');
        showToast(isAlready ? 'Feedback removed' : 'Marked response as needing improvement (Simulated feedback)');
      };
    });

    // Copy Excerpt in Sources Drawer
    document.querySelectorAll('.copy-excerpt-btn').forEach((btn) => {
      btn.onclick = () => {
        const excerpt = btn.closest('.source-card').querySelector('.source-excerpt').innerText;
        navigator.clipboard.writeText(excerpt).then(() => {
          showToast('Copied source chunk excerpt');
        });
      };
    });
  }

  // =========================================================================
  // 10. Message Submission & Intelligent Simulation
  // =========================================================================
  if (elements.chatInput) {
    elements.chatInput.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 180) + 'px';
    });

    elements.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitUserQuery();
      }
    });
  }

  if (elements.btnSendMessage) {
    elements.btnSendMessage.addEventListener('click', submitUserQuery);
  }

  function submitUserQuery() {
    const text = elements.chatInput.value.trim();
    if (!text) return;
    executeSimulatedQuestion(text);
    elements.chatInput.value = '';
    elements.chatInput.style.height = 'auto';
  }

  // Suggested Prompts Click
  document.querySelectorAll('.suggestion-card').forEach((card) => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt;
      if (prompt) {
        executeSimulatedQuestion(prompt);
      }
    });
  });

  function executeSimulatedQuestion(questionText) {
    switchView('chat');
    if (elements.welcomeHero) elements.welcomeHero.style.display = 'none';

    // 1. Render User Message
    elements.messageThread.appendChild(renderUserMessage(questionText));
    scrollChatToBottom();

    // 2. Show Typing Indicator
    if (elements.typingIndicator) {
      elements.typingIndicator.style.display = 'flex';
      scrollChatToBottom();
    }

    // 3. Simulate RAG Retrieval & LLM Generation Latency
    setTimeout(() => {
      if (elements.typingIndicator) elements.typingIndicator.style.display = 'none';

      const match = findBestMatch(questionText);
      const cardId = 'src-' + match.chunk.id.replace(/[^a-zA-Z0-9]/g, '-');

      const assistantMsg = {
        sender: 'assistant',
        time: getCurrentTime(),
        retrievalMs: Math.floor(Math.random() * 12) + 14,
        genMs: Math.floor(Math.random() * 120) + 210,
        citationId: cardId,
        citationText: `${match.chunk.filename}:${match.chunk.page}:${match.chunk.chunk}`,
        citationScore: match.chunk.score,
        bodyHtml: `<p>${match.answer}</p>`,
      };

      elements.messageThread.appendChild(renderAssistantMessage(assistantMsg));

      // Ensure chunk is in Sources drawer
      addChunkToSourcesDrawer(match.chunk);

      bindMessageActions();
      scrollChatToBottom();
    }, 850);
  }

  function findBestMatch(query) {
    const q = query.toLowerCase();

    for (const item of dynamicQA) {
      if (item.keywords.some((k) => q.includes(k))) {
        const chunk = knowledgeChunks[item.docKey][item.chunkIndex];
        return { answer: item.answer, chunk };
      }
    }

    // Fallback response with grounded context reminder
    const fallbackChunk = knowledgeChunks.monopoly[0];
    return {
      answer: `Based on semantic similarity search across <strong>data/monopoly.pdf</strong> and <strong>data/ticket_to_ride.pdf</strong>:
        <br/><br/>
        Regarding your query <em>"${escapeHtml(query)}"</em>, our indexed rules specify precise constraints for player interactions and scoring. Try asking:
        <em>"How much starting money in Monopoly?"</em> or <em>"How many points for longest route in Ticket to Ride?"</em> to view verified rule citations.`,
      chunk: fallbackChunk,
    };
  }

  function addChunkToSourcesDrawer(chunk) {
    const cardId = 'src-' + chunk.id.replace(/[^a-zA-Z0-9]/g, '-');
    if (!document.getElementById(cardId)) {
      const art = document.createElement('article');
      art.className = 'source-card';
      art.id = cardId;
      art.innerHTML = `
        <div class="source-card-header">
          <div class="source-file-info">
            <span class="file-icon-pdf">PDF</span>
            <div>
              <h4 class="source-filename">${chunk.filename}</h4>
              <span class="source-page-tag">Page ${chunk.page} &bull; Chunk #${chunk.chunk}</span>
            </div>
          </div>
          <div class="similarity-score-badge">
            <span>${chunk.score} Match</span>
          </div>
        </div>
        <div class="source-card-body">
          <blockquote class="source-excerpt">
            "${escapeHtml(chunk.text)}"
          </blockquote>
        </div>
        <div class="source-card-footer">
          <span class="chunk-id-tag">ID: ${chunk.id}</span>
          <button class="btn btn-ghost btn-xs copy-excerpt-btn">Copy</button>
        </div>
      `;
      elements.sourcesList.prepend(art);
      if (elements.sourceCountBadge) {
        elements.sourceCountBadge.textContent = elements.sourcesList.querySelectorAll('.source-card').length;
      }
    }
  }

  function scrollChatToBottom() {
    if (elements.chatMessages) {
      elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }
  }

  // Attachment Affordance Notice
  if (elements.btnAttachDoc) {
    elements.btnAttachDoc.addEventListener('click', () => {
      showToast('Document Attachment (Demo Mode): In a live system, uploads are processed by populate_database.py');
    });
  }

  // =========================================================================
  // 11. Document Library: Search, Filter, Modal & Query
  // =========================================================================

  // Search input filter
  if (elements.docSearchInput) {
    elements.docSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      filterDocuments();
    });
  }

  // Category filter pills
  if (elements.docCategoryFilters) {
    elements.docCategoryFilters.querySelectorAll('.pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        elements.docCategoryFilters.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.categoryFilter = btn.dataset.category;
        filterDocuments();
      });
    });
  }

  function filterDocuments() {
    const cards = elements.documentsGrid.querySelectorAll('.doc-card');
    let visibleCount = 0;

    cards.forEach((card) => {
      const name = card.dataset.docName.toLowerCase();
      const cat = card.dataset.category || '';
      const desc = card.querySelector('.doc-desc')?.textContent.toLowerCase() || '';

      const matchesSearch = !state.searchQuery || name.includes(state.searchQuery) || desc.includes(state.searchQuery);
      const matchesCategory = state.categoryFilter === 'all' || cat.includes(state.categoryFilter);

      const isVisible = matchesSearch && matchesCategory;
      card.style.display = isVisible ? 'flex' : 'none';
      if (isVisible) visibleCount++;
    });

    // Handle Empty State
    if (elements.emptyDocsState) {
      elements.emptyDocsState.style.display = visibleCount === 0 ? 'flex' : 'none';
      if (elements.emptyDocsMsg && state.searchQuery) {
        elements.emptyDocsMsg.textContent = `No documents matching "${state.searchQuery}" in category "${state.categoryFilter}".`;
      }
    }
  }

  // Reset Filters Button in Empty State
  if (elements.btnResetDocFilters) {
    elements.btnResetDocFilters.addEventListener('click', () => {
      if (elements.docSearchInput) elements.docSearchInput.value = '';
      state.searchQuery = '';
      state.categoryFilter = 'all';

      elements.docCategoryFilters.querySelectorAll('.pill-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.category === 'all');
      });

      filterDocuments();
      showToast('Reset document filters');
    });
  }

  // "Inspect Chunks" modal launcher
  document.querySelectorAll('.inspect-doc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const docKey = btn.dataset.doc;
      openChunksModal(docKey);
    });
  });

  // "Query Doc" direct trigger
  document.querySelectorAll('.query-doc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      executeSimulatedQuestion(q);
    });
  });

  function openChunksModal(docKey) {
    const chunks = knowledgeChunks[docKey] || [];
    const titles = {
      monopoly: 'monopoly.pdf',
      ticket: 'ticket_to_ride.pdf',
      supplemental: 'supplemental_rules.pdf',
    };

    const docName = titles[docKey] || 'Document';
    elements.modalDocTitle.textContent = `Chunk Inspection: ${docName}`;
    elements.modalChunkCount.textContent = `${chunks.length} Sample Chunks`;

    elements.modalChunksContent.innerHTML = chunks
      .map(
        (c) => `
      <div class="modal-chunk-card">
        <div class="modal-chunk-meta">
          <span>Chunk ID: <code>${c.id}</code></span>
          <span>Similarity: <strong>${c.score}</strong></span>
          <span>Length: <strong>${c.charCount} chars</strong></span>
        </div>
        <p class="modal-chunk-text">"${escapeHtml(c.text)}"</p>
        <div class="modal-chunk-footer">
          <button class="btn btn-ghost btn-xs copy-modal-chunk" data-chunk-text="${escapeHtml(c.text)}" title="Copy chunk text">
            Copy Chunk
          </button>
        </div>
      </div>
    `
      )
      .join('');

    // Bind modal copy buttons
    elements.modalChunksContent.querySelectorAll('.copy-modal-chunk').forEach((btn) => {
      btn.onclick = () => {
        navigator.clipboard.writeText(btn.dataset.chunkText).then(() => {
          showToast('Copied chunk to clipboard');
        });
      };
    });

    elements.chunksModal.classList.add('open');
  }

  function closeModal() {
    if (elements.chunksModal) elements.chunksModal.classList.remove('open');
  }

  if (elements.btnCloseModal) elements.btnCloseModal.addEventListener('click', closeModal);
  if (elements.btnFooterCloseModal) elements.btnFooterCloseModal.addEventListener('click', closeModal);
  if (elements.chunksModal) {
    elements.chunksModal.addEventListener('click', (e) => {
      if (e.target === elements.chunksModal) closeModal();
    });
  }

  // Upload Affordances
  if (elements.btnUploadDocDemo) elements.btnUploadDocDemo.addEventListener('click', () => elements.hiddenFileInput.click());
  if (elements.btnSelectFiles) elements.btnSelectFiles.addEventListener('click', () => elements.hiddenFileInput.click());

  if (elements.hiddenFileInput) {
    elements.hiddenFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        showToast(`Document uploaded: "${file.name}" (Preview added to demo library)`);
      }
    });
  }

  // Dropzone drag-and-drop
  if (elements.dropzoneBox) {
    ['dragenter', 'dragover'].forEach((evt) => {
      elements.dropzoneBox.addEventListener(evt, (e) => {
        e.preventDefault();
        elements.dropzoneBox.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach((evt) => {
      elements.dropzoneBox.addEventListener(evt, (e) => {
        e.preventDefault();
        elements.dropzoneBox.classList.remove('dragover');
      });
    });

    elements.dropzoneBox.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        showToast(`Simulated drop of: "${file.name}" (800-character chunking preview)`);
      }
    });
  }

  // =========================================================================
  // 12. Settings Controls & Local Persistence
  // =========================================================================

  // Sliders
  if (elements.settingTemperature) {
    elements.settingTemperature.addEventListener('input', (e) => {
      state.temperature = parseFloat(e.target.value);
      if (elements.tempValueDisplay) elements.tempValueDisplay.textContent = e.target.value;
      localStorage.setItem('documind_temperature', e.target.value);
    });
  }

  if (elements.settingTopK) {
    elements.settingTopK.addEventListener('input', (e) => {
      state.topK = parseInt(e.target.value, 10);
      if (elements.kValueDisplay) elements.kValueDisplay.textContent = e.target.value;
      if (elements.composerTopKPill) elements.composerTopKPill.textContent = `k = ${e.target.value} chunks`;
      localStorage.setItem('documind_top_k', e.target.value);
    });
  }

  // Model & Provider dropdowns
  if (elements.settingModelName) {
    elements.settingModelName.addEventListener('change', (e) => {
      state.selectedModel = e.target.value;
      updateNavbarModelLabel();
      localStorage.setItem('documind_model', e.target.value);
    });
  }

  if (elements.settingModelProvider) {
    elements.settingModelProvider.addEventListener('change', (e) => {
      state.selectedProvider = e.target.value;
      updateNavbarModelLabel();
      localStorage.setItem('documind_provider', e.target.value);
    });
  }

  // Theme Toggles
  document.querySelectorAll('.theme-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      applyTheme(opt.dataset.theme);
      showToast(`Applied ${opt.dataset.theme === 'slate' ? 'Slate Obsidian' : 'Midnight Dark'} theme`);
    });
  });

  // Accent Color Picker
  document.querySelectorAll('.color-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      applyAccent(dot.dataset.color);
      showToast(`Accent color updated to ${dot.dataset.color}`);
    });
  });

  // Save Settings Button
  if (elements.btnSaveSettings) {
    elements.btnSaveSettings.addEventListener('click', () => {
      localStorage.setItem('documind_theme', state.theme);
      localStorage.setItem('documind_accent', state.accentColor);
      localStorage.setItem('documind_temperature', state.temperature);
      localStorage.setItem('documind_top_k', state.topK);
      localStorage.setItem('documind_model', state.selectedModel);
      localStorage.setItem('documind_provider', state.selectedProvider);
      showToast('Settings saved to browser local storage');
    });
  }

  // Reset Settings to Defaults
  if (elements.btnResetSettings) {
    elements.btnResetSettings.addEventListener('click', () => {
      applyTheme('dark');
      applyAccent('indigo');
      state.temperature = 0.2;
      state.topK = 5;
      state.selectedModel = 'mistral';
      state.selectedProvider = 'ollama';

      if (elements.settingTemperature) elements.settingTemperature.value = 0.2;
      if (elements.tempValueDisplay) elements.tempValueDisplay.textContent = '0.2';
      if (elements.settingTopK) elements.settingTopK.value = 5;
      if (elements.kValueDisplay) elements.kValueDisplay.textContent = '5';
      if (elements.composerTopKPill) elements.composerTopKPill.textContent = 'k = 5 chunks';
      if (elements.settingModelName) elements.settingModelName.value = 'mistral';
      if (elements.settingModelProvider) elements.settingModelProvider.value = 'ollama';

      updateNavbarModelLabel();
      localStorage.removeItem('documind_temperature');
      localStorage.removeItem('documind_top_k');
      localStorage.removeItem('documind_model');
      localStorage.removeItem('documind_provider');

      showToast('Settings reset to tutorial defaults');
    });
  }

  // =========================================================================
  // 13. Global Keyboard Shortcuts
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    // Ctrl+K / Cmd+K -> New Chat
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      startNewChat();
    }

    // Escape -> Close modal, mobile drawer, or sources panel
    if (e.key === 'Escape') {
      if (elements.chunksModal && elements.chunksModal.classList.contains('open')) {
        closeModal();
      } else if (elements.appSidebar && elements.appSidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
      }
    }
  });

  // =========================================================================
  // 14. Toast Notification Utility
  // =========================================================================
  function showToast(message) {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--accent-primary)" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Helpers
  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run initialization
  init();
});
