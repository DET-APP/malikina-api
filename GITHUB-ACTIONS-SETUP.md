# Configuration GitHub Actions - Déploiement Automatique

## 🚀 Objectif
Déployer automatiquement l'API sur le serveur quand vous pushez vers GitHub.

## ⚙️ Configuration Manuelle (Interface GitHub)

### Étape 1: Récupérer votre clé SSH privée
```bash
cat ~/.ssh/id_rsa
```
Copiez tout le contenu (de `-----BEGIN OPENSSH PRIVATE KEY-----` à `-----END OPENSSH PRIVATE KEY-----`)

### Étape 2: Aller à GitHub Secrets
- URL: https://github.com/Sangoule/malikina-api/settings/secrets/actions
- Cliquez sur "New repository secret"

### Étape 3: Ajouter les secrets

**Secret 1:**
- Name: `SSH_PRIVATE_KEY`
- Value: (Collez la clé SSH complète de l'étape 1)
- Click "Add secret"

**Secret 2:**
- Name: `DEPLOY_HOST`
- Value: `165.245.211.201`
- Click "Add secret"

**Secret 3:**
- Name: `DEPLOY_USER`
- Value: `root`
- Click "Add secret"

**Secret 4:**
- Name: `DEPLOY_PATH`
- Value: `/var/www/malikina-api`
- Click "Add secret"

### Étape 4: Vérifier les secrets
Une fois ajoutés, vous les verrez comme des points dans la liste:
```
SSH_PRIVATE_KEY ●●●●●●●●●●●●●●●●●●●●●●●
DEPLOY_HOST : 165.245.211.201
DEPLOY_USER : root
DEPLOY_PATH : /var/www/malikina-api
```

## 🔄 Utiliser le Workflow

Une fois configurés, le workflow s'exécutera automatiquement quand vous:

```bash
# Pousser vers dev (déploie en dev)
git push origin dev

# Pousser vers main (déploie en production)
git push origin main
```

## ✅ Vérifier les Workflows

1. Allez sur: https://github.com/Sangoule/malikina-api/actions

2. Sélectionnez le commit que vous venez de pusher

3. Vous verrez l'exécution du workflow:
   - "Checkout code" ✅
   - "Deploy to server" ⏳ (en cours)
   - Si tout va bien: ✅

## 📊 Résultat

- Quand le workflow réussit, l'API se redéploie automatiquement
- Les anciens conteneurs Docker s'arrêtent
- De nouveaux conteneurs se construisent et démarrent
- L'API est accessible sur: https://165-245-211-201.sslip.io/api

## 🧪 Test

Après avoir configuré les secrets:

```bash
cd malikina-api
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger workflow"
git push origin dev
```

→ Allez sur GitHub Actions et regardez l'exécution

## ❌ Troubleshooting

Si le workflow échoue:

1. Vérifier les secrets sont bien définis
2. Vérifier la clé SSH privée n'a pas de caractères supplémentaires
3. Vérifier que le serveur est accessible: `ping 165.245.211.201`
4. Vérifier les logs du workflow: Cliquez sur l'exécution → Consultez "Deploy to server"

## 🔐 Sécurité

- Les secrets ne sont jamais affichés dans les logs
- Ils sont chiffrés chez GitHub
- Seul le workflow peut les utiliser
- Ne JAMAIS les committer dans le repo

## 💡 Alternative: Déploiement Manuel

Si vous préférez déployer manuellement sans GitHub Actions:

```bash
cd /var/www/malikina-api
git pull origin dev
docker-compose up -d --build
```

(À exécuter sur le serveur via SSH)
