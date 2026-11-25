# Orbite

Entraînement quotidien adaptatif pour un élève de 6e : 11 domaines (calcul mental, maths, logique, mémoire, français, anglais, sciences, histoire-géo, culture générale, argent & entreprise, algorithmes) + un défi écrit corrigé par l'IA, et un espace parent qui suit les progrès.

- **Interface** : `public/` (HTML/CSS/JS sans étape de build, installable sur l'écran d'accueil iPad/iPhone/Android).
- **Comptes et données** : Supabase (connexion identifiant + mot de passe, une ligne d'état + une ligne par session, sécurité RLS : chaque élève ne voit que ses données).
- **IA** : `api/ai.js` (fonction Vercel). La clé Claude reste sur le serveur ; le navigateur n'envoie que des données. Plafond de 80 appels IA par élève et par jour (`AI_DAILY_LIMIT`).
- Hors ligne : les résultats sont gardés sur l'appareil et envoyés au retour du réseau.

## Mise en ligne (une seule fois)

### 1. Supabase (base de données et comptes)
1. Sur https://supabase.com/dashboard → **New project** → nom `orbite`, région la plus proche (ex. Europe West).
2. **SQL Editor** → coller le contenu de `supabase/schema.sql` → **Run**.
3. **Authentication → Sign In / Providers → Email** : désactiver **Confirm email** (les élèves se connectent avec un identifiant, sans vraie adresse e-mail).
4. **Project Settings → API** : noter la **Project URL** et la clé **anon / publishable** (elle est faite pour le navigateur, ce n'est pas un secret).

### 2. Vercel (hébergement)
```bash
npx vercel login
npx vercel link
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_ANON_KEY production
npx vercel env add ANTHROPIC_API_KEY production
npx vercel deploy --prod
```
Le lien final ressemble à `https://orbite-xxxx.vercel.app`. Un nom de domaine peut être ajouté ensuite dans Vercel → Domains.

### 3. Sur l'iPad / le téléphone
Ouvrir le lien dans Safari → bouton Partager → **Sur l'écran d'accueil**. L'appli s'ouvre alors en plein écran comme une vraie app.

## Développement local
`npm install` puis `npx vercel dev` (avec les mêmes variables dans `.env.local`).
