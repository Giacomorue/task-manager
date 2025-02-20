# Task Manager

Un'applicazione web moderna per la gestione delle attività (tasks) con funzionalità di drag-and-drop per il riordinamento.

## 🚀 Caratteristiche

- ✨ Interfaccia utente moderna con shadcn/ui
- 🔄 Drag & drop per riordinare le task
- ✏️ Creazione, modifica ed eliminazione delle task
- 🎯 Gestione dello stato ottimizzata con React Query
- 📱 Design responsive
- 🌐 API RESTful con Express.js
- 🗄️ Database MongoDB con Prisma ORM

## 🛠️ Tecnologie Utilizzate

### Frontend
- Next.js
- TypeScript
- React Query
- shadcn/ui
- DnD Kit
- Axios
- date-fns

### Backend
- Express.js
- Prisma
- MongoDB
- Node.js

## 🚦 Come Iniziare

### Prerequisiti
- Node.js
- MongoDB
- npm/yarn

### Installazione

1. **Clone il repository**
```bash
git clone <repository-url>
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env    # Configura le variabili d'ambiente
npx prisma generate
npm run dev
```

3. **Setup Frontend**
```bash
cd client
npm install
cp .env.example .env    # Configura le variabili d'ambiente
npm run dev
```

## 🔑 Variabili d'Ambiente

### Backend (.env)
```env
PORT=5000
NODE_ENV=development o production
FRONTEND_URL="http://localhost:3000" o "https://..."
DATABASE_URL="mongodb+srv://????????????/task"
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000" o "https://..."
```

## 📝 Funzionalità

- **Gestione Task**
  - Creazione nuove task
  - Modifica task esistenti
  - Eliminazione task
  - Riordinamento tramite drag & drop

- **UI/UX**
  - Feedback visivo durante il drag & drop
  - Toast notifications per le azioni
  - Loading states
  - Gestione errori
  - Layout responsive

## 👥 Contribuire

Le pull request sono benvenute. Per modifiche importanti, apri prima un issue per discutere cosa vorresti cambiare.

## 📄 Licenza

[MIT](https://choosealicense.com/licenses/mit/)
