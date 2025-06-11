window.onload = () => {
    const splash = document.getElementById('splash');
    const desktop = document.getElementById('desktop');
    const cmdIcon = document.getElementById('cmd-icon');
    const shutdownBtn = document.getElementById('shutdown');
    const restartBtn = document.createElement('button');

    const shutdownEffect = () => {
        const audio = new Audio('assets/shutdown.mp3');
        audio.play();
        document.body.innerHTML = `
          <div style="color: red; font-size: 24px; text-align: center; margin-top: 20%">
            Desligando SpectraOS...<br>
            <span id="dots">.</span>
          </div>
        `;
        let dots = document.getElementById('dots');
        let interval = setInterval(() => {
            dots.innerText += '.';
            if (dots.innerText.length > 6) dots.innerText = '.';
        }, 500);
        setTimeout(() => {
            clearInterval(interval);
            window.close();
        }, 4000);
    };

    restartBtn.innerText = 'Reiniciar';
    restartBtn.style.position = 'absolute';
    restartBtn.style.top = '60px';
    restartBtn.style.right = '20px';
    restartBtn.style.padding = '10px';
    restartBtn.style.background = 'orange';
    restartBtn.style.color = 'white';
    restartBtn.style.border = 'none';
    restartBtn.style.fontWeight = 'bold';
    restartBtn.style.cursor = 'pointer';

    setTimeout(() => {
        splash.classList.add('hidden');
        desktop.classList.remove('hidden');
        desktop.appendChild(restartBtn);
    }, 3000);

    shutdownBtn.onclick = shutdownEffect;

    cmdIcon.onclick = () => {
        const terminalWindow = document.createElement('div');
        terminalWindow.className = 'terminal-window';
        terminalWindow.style.position = 'absolute';
        terminalWindow.style.top = '80px';
        terminalWindow.style.left = '100px';
        terminalWindow.style.width = '600px';
        terminalWindow.style.height = '400px';
        terminalWindow.style.background = 'black';
        terminalWindow.style.border = '2px solid #00ffcc';
        terminalWindow.style.display = 'flex';
        terminalWindow.style.flexDirection = 'column';
        terminalWindow.style.zIndex = 1000;

        terminalWindow.innerHTML = `
  <div class="terminal-header" style="cursor: move; background: #00ffcc; color: black; padding: 5px; text-align: center; font-weight: bold;">
    EchoKernel Terminal <button style="float: right; background: red; color: white; border: none; cursor: pointer;" onclick="this.closest('.terminal-window').remove()">X</button>
  </div>
  <div class="terminal-content" contenteditable="true" spellcheck="false" style="flex: 1; padding: 10px; outline: none; overflow-y: auto; white-space: pre-wrap; background: black; color: #00ffcc; font-family: monospace;"></div>
`;


        desktop.appendChild(terminalWindow);
        dragElement(terminalWindow);

        const terminal = terminalWindow.querySelector('.terminal-content');

        const promptText = 'echoByte@SpectraOS>> ';

        function toHTML(text) {
            return text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
        }

        let commandStartIndex = 0;

        function initTerminal() {
            terminal.innerHTML = ''; // Limpa o terminal

            const introLines = [
                'SpectraOS (versão 1.0.2025.alpha)',
                '© 2025 - EchoByte Research Division',
                '',
                promptText
            ];

            introLines.forEach(line => {
                const div = document.createElement('div');
                div.innerHTML = line.replace(/ /g, '&nbsp;');
                terminal.appendChild(div);
            });

            commandStartIndex = terminal.textContent.length;
            placeCaretAtEnd();
        }


        function placeCaretAtEnd() {
            terminal.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(terminal);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }


        function getCurrentCommand() {
            return terminal.textContent.substring(commandStartIndex);
        }

        function appendOutput(text) {
            const lines = text.split('\n');
            lines.forEach(line => {
                const div = document.createElement('div');
                div.innerHTML = line.replace(/ /g, '&nbsp;');
                terminal.appendChild(div);
            });

            const prompt = document.createElement('div');
            prompt.innerHTML = promptText.replace(/ /g, '&nbsp;');
            terminal.appendChild(prompt);

            commandStartIndex = terminal.textContent.length;
            placeCaretAtEnd();
        }


        function processCommand(cmd) {
            switch (cmd) {
                case 'scan':
                    return '[+] Encontrado: 192.168.0.1 - Porta 22 aberta';
                case 'trace':
                    return 'Rastreando origem...\nHOP 1 -> 192.168.1.1\nHOP 2 -> 172.16.23.8\nHOP 3 -> [REDE CAMUFLADA]';
                case 'link -q':
                    return '[link -q] Acesso à QuantumNet estabelecido. Canal seguro iniciado.';
                case 'echoid':
                    return 'EchoByte Signature ID: ECH0-8YT3-2036\nStatus: Ativa | Acesso: Full | Origem: [DESCONHECIDA]';
                case 'elevate':
                    return '[elevate] EchoByte Access Level: DELTA-VIOLET';
                case 'help':
                    return `[help] Comandos disponíveis:
 - scan       : Varredura de rede
 - trace      : Rastrear pacotes
 - link -q    : Acessar QuantumNet
 - echoid     : Ver identidade de EchoByte
 - elevate    : Acesso avançado
 - help       : Mostrar comandos
 - shutdown   : Desligar sistema
 - restart    : Reiniciar sistema`;
                case 'shutdown':
                    setTimeout(() => alert('Sistema desligando...'), 100);
                    return '[shutdown] Encerrando sessão...';
                case 'restart':
                    setTimeout(() => location.reload(), 100);
                    return '[restart] Reiniciando sistema...';
                default:
                    return `[erro] Comando desconhecido: ${cmd}`;
            }
        }

        function getCaretIndex() {
            const selection = window.getSelection();
            let position = 0;

            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const preRange = range.cloneRange();
                preRange.selectNodeContents(terminal);
                preRange.setEnd(range.endContainer, range.endOffset);
                position = preRange.toString().length;
            }

            return position;
        }

        function handleKeyDown(e) {
            const sel = window.getSelection();
            if ((e.key === 'Backspace' || e.key === 'ArrowLeft')) {
                const selection = window.getSelection();
                const node = selection.anchorNode;

                // Impede apagar o prompt ou conteúdo acima
                if (!node || !terminal.contains(node)) return;

                const fullText = terminal.textContent;
                const caretIndex = getCaretIndex();

                if (caretIndex <= commandStartIndex) {
                    e.preventDefault();
                    placeCaretAtEnd();
                }
            }


            if (e.key === 'Enter') {
                e.preventDefault();
                const cmd = getCurrentCommand().trim();
                if (cmd.length === 0) {
                    appendOutput('');
                    return;
                }
                appendOutput(processCommand(cmd));
            }
        }

        function handleSelectionChange() {
            const sel = window.getSelection();
            if (!sel.rangeCount) return;

            const range = sel.getRangeAt(0);
            if (range.startOffset < commandStartIndex) {
                placeCaretAtEnd();
            }
        }

        terminal.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectionchange', () => {
            if (document.activeElement === terminal) {
                handleSelectionChange();
            }
        });

        initTerminal();
    };
};

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector(".terminal-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
