<template>
  <div class="login-container">
    <h1 class="main-title">Bienvenido a Amarhu</h1>

    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Ingresa tu correo"
              aria-label="Correo Electrónico"
              :class="{ 'input-error': error && !email }"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              aria-label="Contraseña"
              :class="{ 'input-error': error && !password }"
              required
          />
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Ingresar</span>
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async login() {
      const userStore = useUserStore();

      this.error = null;

      if (!this.email.trim() || !this.password.trim()) {
        this.error = "Por favor, completa todos los campos.";
        return;
      }

      try {
        this.isLoading = true;

        // Llamar solo al login, que ya devuelve todo
        await userStore.login(this.email.trim(), this.password.trim());

        // Redirigir al Home después de login exitoso
        this.$router.push({ name: "Home" });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.error = "Correo o contraseña incorrectos.";
        } else if (error.message) {
          this.error = error.message;
        } else {
          this.error = "Ocurrió un error al iniciar sesión. Inténtalo nuevamente.";
        }
        console.error("Error al iniciar sesión:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* ⬅️ Usamos min-height para evitar overflow */
  width: 100%;
  background-color: #f9f9f9;
  padding: 20px;
  box-sizing: border-box; /* ✅ asegura que el padding no cree overflow */
  overflow: hidden; /* ⛔ elimina scroll innecesario */
}


.main-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.login-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.input-error {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 5px rgba(255, 77, 79, 0.5);
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.login-button {
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}
</style>
