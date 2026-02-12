<template>
  <div class="container">
    <h1>🔐 Connexion</h1>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="jean.dupont@example.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="Votre mot de passe"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <div class="link">
      Pas encore de compte ? <router-link to="/register">S'inscrire</router-link>
    </div>

    <div class="divider">
      <span>OU</span>
    </div>

    <button @click="signInWithGoogle" type="button" class="google-btn">
      <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Se connecter avec Google
    </button>

    <button @click="signInWithDiscord" type="button" class="discord-btn">
      Se connecter avec Discord
    </button>

    <button @click="signInWithGitHub" type="button" class="github-btn">
      <svg class="github-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="white" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.84 1.31 3.53 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.52 11.52 0 0 1 3-.41c1.02 0 2.05.14 3 .41 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      Se connecter avec GitHub
    </button>


    <div class="jwt-info">
      <h3>💡 Démo JWT</h3>
      <p>
        ✅ Après connexion, un <strong>Access Token</strong> JWT est stocké<br>
        ✅ Ce token est envoyé dans le header <code>Authorization: Bearer ...</code><br>
        ✅ Le serveur vérifie le token sans consulter de session
      </p>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: null,
      success: null,
      loading: false
    }
  },
  mounted() {
    // Afficher un message d'erreur si OAuth a échoué
    const error = this.$route.query.error
    if (error === 'google_auth_failed') {
      this.error = 'Échec de l\'authentification Google'
    } else if (error === 'token_generation_failed') {
      this.error = 'Erreur lors de la génération du token'
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.success = null
      this.loading = true

      try {
        const response = await authService.login(this.form)
        this.success = response.message

        // Rediriger vers home après connexion réussie
        setTimeout(() => {
          this.$router.push('/home')
        }, 1000)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors de la connexion'
      } finally {
        this.loading = false
      }
    },
    signInWithGoogle() {
      // Redirection vers le backend qui initie OAuth
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    },
    signInWithDiscord() {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
    },
    signInWithGitHub() {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`
    }
  }
}
</script>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2rem 0;
  color: #666;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  background: #f8f9fa;
  border-color: #d2d4d6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.google-icon {
  width: 20px;
  height: 20px;
}

.jwt-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f0f7ff;
  border-left: 4px solid #2563eb;
  border-radius: 4px;
}

.jwt-info h3 {
  margin: 0 0 0.75rem 0;
  color: #1e40af;
  font-size: 1.1rem;
}

.jwt-info p {
  margin: 0;
  color: #1e3a8a;
  line-height: 1.6;
  font-size: 0.95rem;
}

.discord-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.discord-btn:hover {
  background: #4752c4;
}
.github-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #24292e; /* Couleur GitHub */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.github-btn:hover {
  background: #1b1f23;
}

.github-icon {
  width: 20px;
  height: 20px;
}


</style>
