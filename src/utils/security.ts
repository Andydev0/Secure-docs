export function initSecurity(contentSelector: string = '.post-content') {
  if (typeof window === 'undefined') return;

  // Função para criar camada de proteção apenas sobre o conteúdo
  const createProtectionLayer = () => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    const rect = contentElement.getBoundingClientRect();
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = `${rect.top}px`;
    canvas.style.left = `${rect.left}px`;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999998';
    canvas.style.opacity = '0.1';
    canvas.style.mixBlendMode = 'difference';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const createPattern = () => {
      try {
        if (canvas.width <= 0 || canvas.height <= 0) {
          canvas.width = 100;
          canvas.height = 100;
        }

        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.random() * 255;
          data[i + 1] = Math.random() * 255;
          data[i + 2] = Math.random() * 255;
          data[i + 3] = 5;
        }

        ctx.putImageData(imageData, 0, 0);
      } catch (error) {
        console.error('Erro ao criar padrão:', error);
      }
    };

    setInterval(createPattern, 50);
  };

  // Função para esconder conteúdo
  const hideContent = () => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    const rect = contentElement.getBoundingClientRect();
    
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.innerHTML = '<h1 style="color: black;">Conteúdo protegido</h1>';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.remove();
    }, 1000);
  };

  // Inicializar proteção
  createProtectionLayer();

  // Aplicar proteções apenas ao elemento de conteúdo
  const contentElement = document.querySelector(contentSelector);
  if (contentElement) {
    // Desabilitar seleção de texto no conteúdo
    contentElement.addEventListener('selectstart', (e) => e.preventDefault());
    contentElement.addEventListener('dragstart', (e) => e.preventDefault());
    contentElement.addEventListener('contextmenu', (e) => e.preventDefault());
    contentElement.addEventListener('copy', (e) => e.preventDefault());
    contentElement.addEventListener('cut', (e) => e.preventDefault());
    contentElement.addEventListener('paste', (e) => e.preventDefault());

    // Adicionar CSS para prevenir seleção e cópia apenas no conteúdo
    const style = document.createElement('style');
    style.textContent = `
      ${contentSelector} {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      ${contentSelector} img, 
      ${contentSelector} video, 
      ${contentSelector} canvas {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }

      @media print {
        body * {
          display: none !important;
          visibility: hidden !important;
        }
        
        body:before {
          content: "Impressão não permitida";
          display: block !important;
          visibility: visible !important;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          color: #000;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Monitorar mudanças de visibilidade
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      hideContent();
    }
  });

  // Monitorar perda de foco
  window.addEventListener('blur', hideContent);

  // Monitorar alterações na janela
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth || window.innerHeight !== lastHeight) {
      hideContent();
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
    }
  });

  // Sobrescrever função de impressão
  window.print = () => {
    hideContent();
    return false;
  };

  // Proteção contra gravação de tela
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia = function() {
      hideContent();
      return Promise.reject(new Error('Screen capture is not allowed'));
    };
  }

  // Proteção contra ferramentas de captura
  setInterval(() => {
    const debuggerEnabled = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (debuggerEnabled && window.outerWidth - window.innerWidth > 160) {
      hideContent();
    }
  }, 1000);

  // Desabilitar print screen
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('');
      hideContent();
    }
  });

  // Desabilitar ctrl+p
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      hideContent();
    }
  });

  // Proteção contra ferramentas auxiliares
  const protectAgainstTools = () => {
    // Detectar ferramentas de desenvolvedor
    const devtools = /./;
    devtools.toString = function() {
      hideContent();
      return '';
    };
    console.log(devtools);

    // Monitorar alterações no DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const nodes = Array.from(mutation.addedNodes);
          nodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.id?.includes('lightshot') || 
                  node.className?.includes('lightshot') ||
                  node.id?.includes('screenshot') ||
                  node.className?.includes('screenshot')) {
                hideContent();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id']
    });
  };

  protectAgainstTools();
}
