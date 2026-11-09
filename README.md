# 📅 Mapa de Disponibilidade Semanal - ADA

Uma aplicação intuitiva desenvolvida para facilitar a coordenação de agendas e a busca por horários comuns entre os assessores de um time da **Empresa Júnior ADA**.

## 🎯 Objetivo

O objetivo principal desta ferramenta é eliminar a troca excessiva de mensagens para conciliar agendas. Ela permite que cada membro do time registre sua disponibilidade semanal, gerando automaticamente um mapa visual onde é possível identificar rapidamente os "melhores slots" (horários em que a maioria ou todos os membros estão disponíveis).

## 🚀 Como Funciona

1.  **Registro de Disponibilidade**: Cada assessor acessa a aplicação e marca no grid de horários os períodos em que está livre durante a semana.
2.  **Armazenamento em Nuvem**: As informações são salvas no Firebase Firestore, permitindo que as disponibilidades de todos os membros sejam sincronizadas e visualizadas em tempo real por qualquer pessoa com acesso à aplicação.
3.  **Cálculo de Slots**: O sistema analisa a intersecção de disponibilidades de todos os usuários cadastrados.
4.  **Visualização de Estatísticas**: A aplicação destaca os melhores horários para reuniões, facilitando a tomada de decisão do gestor ou do time.

## 🌐 Como Acessar

A aplicação está hospedada no GitHub Pages e pode ser acessada através do link abaixo:

👉 **[Acesse aqui o Mapa de Disponibilidade](https://adaejbr.github.io/mapa-disponibilidade-semanal-ada/)**

## 🛠️ Tecnologias Utilizadas

- **React** (Frontend)
- **TypeScript** (Tipagem estática)
- **Vite** (Build tool)
- **Firebase Firestore** (Banco de dados NoSQL em nuvem)
- **CSS Modules** (Estilização)

## 💻 Como executar localmente

Caso deseje contribuir ou testar o projeto localmente:

1. Clone o repositório:
   ```bash
   git clone https://github.com/adaejbr/mapa-disponibilidade-semanal-ada.git
   ```
2. Entre na pasta do projeto:
   ```bash
   cd mapa-disponibilidade-semanal-ada/mapa-disponibilidade-semanal-ada
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🔐 Configuração do Firebase (Firestore Security Rules)

### Regras de Segurança

As regras de segurança estão configuradas em `firestore.rules` (na raiz do repositório) para permitir **apenas o acesso ao documento específico** usado pela aplicação, mantendo o restante do banco protegido:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas no documento de disponibilidade
    match /availability/agenda-disponibilidade-v1 {
      allow read, write: if true;
    }
    
    // Bloquear todo o resto por padrão
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Como fazer deploy das regras

1. **Instalar Firebase CLI** (se não tiver):
   ```bash
   npm install -g firebase-tools
   ```

2. **Fazer login no Firebase**:
   ```bash
   firebase login
   ```

3. **Deploy das regras** (da raiz do repositório):
   ```bash
   firebase deploy --only firestore:rules
   ```

   Ou deploy completo (regras + índices + hosting):
   ```bash
   firebase deploy
   ```

### Testar localmente com Emulator

```bash
firebase emulators:start --only firestore
```

### Estrutura dos Dados no Firestore

A aplicação usa **um único documento** no Firestore:
- **Collection**: `availability`
- **Document**: `agenda-disponibilidade-v1`
- **Estrutura dos dados**:
  ```json
  {
    "users": {
      "nome_usuario": {
        "sector": "Jurídico-Financeiro | Comercial | Recursos Humanos | Projetos | Marketing | Presidência",
        "slots": ["0-9", "1-10", "2-14", ...]
      }
    }
  }
  ```
  Onde `slots` usa o formato `"dayIndex-hour"` (ex: `"0-9"` = Segunda-feira 9h).

### Segurança

✅ **Implementado:**
- Regras restringem acesso apenas ao documento `availability/agenda-disponibilidade-v1`
- Todo o resto do banco permanece inacessível publicamente

⚠️ **Considerações futuras para maior segurança:**
- A aplicação atualmente não usa autenticação (usuários digitam apenas nome/setor)
- Para evoluir a segurança, considere implementar:
  - **Autenticação anônima do Firebase** (`signInAnonymously()`)
  - **Validação de dados via Cloud Functions** (sanitizar entrada, limitar tamanho)
  - **Rate limiting** para evitar abuso
  - **Regras baseadas em usuário autenticado** (cada usuário edita apenas seus próprios dados)
