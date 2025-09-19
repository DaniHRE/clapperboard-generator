// Classe principal para gerenciar a claquete digital
class ClaquetelDigital {
    constructor() {
        this.fields = {
            title: document.getElementById('title'),
            director: document.getElementById('director'),
            dp: document.getElementById('dp'),
            date: document.getElementById('date'),
            fps: document.getElementById('fps'),
            camera: document.getElementById('camera'),
            slate: document.getElementById('slate'),
            roll: document.getElementById('roll'),
            scene: document.getElementById('scene'),
            take: document.getElementById('take'),
            notes: document.getElementById('notes'),
            teaser: document.getElementById('teaser')
        };
        
        this.buttons = {
            save: document.getElementById('save-btn'),
            reset: document.getElementById('reset-btn'),
            export: document.getElementById('export-btn')
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupAutoSave();
        this.setCurrentDate();
    }
    
    setupEventListeners() {
        // Botões de controle
        this.buttons.save.addEventListener('click', () => this.saveData());
        this.buttons.reset.addEventListener('click', () => this.resetData());
        this.buttons.export.addEventListener('click', () => this.exportAsImage());
        
        // Auto-incremento para TAKE com Enter
        this.fields.take.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.incrementTake();
            }
        });
        
        // Auto-save quando campos são alterados
        Object.values(this.fields).forEach(field => {
            field.addEventListener('input', () => {
                this.autoSave();
            });
            
            field.addEventListener('blur', () => {
                this.saveData();
            });
        });
        
        // Permitir apenas números em campos específicos
        ['fps', 'roll', 'scene', 'take'].forEach(fieldName => {
            this.fields[fieldName].addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        });
        
        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveData();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.resetData();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportAsImage();
                        break;
                }
            }
            
            // Enter no teaser para incrementar take
            if (e.key === 'Enter' && document.activeElement === this.fields.teaser) {
                e.preventDefault();
                this.incrementTake();
            }
        });
    }
    
    setupAutoSave() {
        // Auto-save a cada 30 segundos
        setInterval(() => {
            this.autoSave();
        }, 30000);
    }
    
    setCurrentDate() {
        if (!this.fields.date.value || this.fields.date.value === '') {
            const now = new Date();
            const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
                          'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
            this.fields.date.value = formattedDate;
        }
    }
    
    incrementTake() {
        const currentTake = parseInt(this.fields.take.value) || 0;
        this.fields.take.value = currentTake + 1;
        this.showNotification(`TAKE incrementado para ${currentTake + 1}`);
        this.saveData();
    }
    
    saveData() {
        const data = {};
        Object.keys(this.fields).forEach(key => {
            if (key === 'teaser') {
                data[key] = this.fields[key].textContent;
            } else {
                data[key] = this.fields[key].value;
            }
        });
        
        localStorage.setItem('claqueteData', JSON.stringify(data));
        this.showNotification('Dados salvos!');
    }
    
    loadData() {
        const savedData = localStorage.getItem('claqueteData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                if (this.fields[key]) {
                    if (key === 'teaser') {
                        this.fields[key].textContent = data[key];
                    } else {
                        this.fields[key].value = data[key];
                    }
                }
            });
        }
    }
    
    resetData() {
        if (confirm('Tem certeza que deseja limpar todos os campos?')) {
            Object.keys(this.fields).forEach(key => {
                if (key === 'teaser') {
                    this.fields[key].textContent = 'TEASER';
                } else if (key === 'date') {
                    this.setCurrentDate();
                } else if (['slate', 'roll', 'scene', 'take'].includes(key)) {
                    this.fields[key].value = '1';
                } else if (key === 'fps') {
                    this.fields[key].value = '24';
                } else {
                    this.fields[key].value = '';
                }
            });
            
            localStorage.removeItem('claqueteData');
            this.showNotification('Dados limpos!');
        }
    }
    
    autoSave() {
        // Salva automaticamente sem mostrar notificação
        const data = {};
        Object.keys(this.fields).forEach(key => {
            if (key === 'teaser') {
                data[key] = this.fields[key].textContent;
            } else {
                data[key] = this.fields[key].value;
            }
        });
        
        localStorage.setItem('claqueteData', JSON.stringify(data));
    }
    
    exportAsImage() {
        // Esta função requer uma biblioteca externa como html2canvas
        // Por enquanto, vamos mostrar uma mensagem
        this.showNotification('Funcionalidade de exportação será implementada em breve!');
        
        // Código para implementar com html2canvas:
        /*
        html2canvas(document.querySelector('.claquete')).then(canvas => {
            const link = document.createElement('a');
            link.download = `claquete_${this.fields.slate.value}_${this.fields.scene.value}_${this.fields.take.value}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
        */
    }
    
    showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px solid white;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Funcionalidade adicional: validação de campos
    validateFields() {
        const errors = [];
        
        if (!this.fields.title.value.trim()) {
            errors.push('Título é obrigatório');
        }
        
        if (!this.fields.director.value.trim()) {
            errors.push('Diretor é obrigatório');
        }
        
        if (!this.fields.slate.value.trim()) {
            errors.push('Slate é obrigatório');
        }
        
        if (errors.length > 0) {
            this.showNotification('Campos obrigatórios: ' + errors.join(', '));
            return false;
        }
        
        return true;
    }
    
    // Função para duplicar o take atual
    duplicateTake() {
        const currentData = {};
        Object.keys(this.fields).forEach(key => {
            if (key === 'teaser') {
                currentData[key] = this.fields[key].textContent;
            } else {
                currentData[key] = this.fields[key].value;
            }
        });
        
        // Incrementar o take
        this.incrementTake();
        
        // Salvar configuração anterior para possível restauração
        localStorage.setItem('previousTakeData', JSON.stringify(currentData));
    }
    
    // Função para restaurar take anterior
    restorePreviousTake() {
        const previousData = localStorage.getItem('previousTakeData');
        if (previousData) {
            const data = JSON.parse(previousData);
            Object.keys(data).forEach(key => {
                if (this.fields[key]) {
                    if (key === 'teaser') {
                        this.fields[key].textContent = data[key];
                    } else {
                        this.fields[key].value = data[key];
                    }
                }
            });
            this.showNotification('Take anterior restaurado!');
        } else {
            this.showNotification('Nenhum take anterior encontrado!');
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.claquete = new ClaquetelDigital();
});

// Adicionar funcionalidades globais para console
window.claqueteUtils = {
    exportData: () => {
        const data = localStorage.getItem('claqueteData');
        if (data) {
            console.log('Dados da claquete:', JSON.parse(data));
            return JSON.parse(data);
        }
        return null;
    },
    
    importData: (data) => {
        localStorage.setItem('claqueteData', JSON.stringify(data));
        window.claquete.loadData();
        console.log('Dados importados com sucesso!');
    },
    
    clearAllData: () => {
        localStorage.clear();
        console.log('Todos os dados limpos!');
        location.reload();
    }
};
