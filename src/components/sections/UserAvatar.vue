<template>
  <div class="user-avatar">
    <h2>Actualizar Avatar</h2>
    <div class="avatar-preview">
      <img :src="avatar || 'https://via.placeholder.com/150'" alt="Avatar" />
    </div>
    <label for="avatar-upload" class="upload-label">
      Seleccionar Imagen
      <input
          id="avatar-upload"
          type="file"
          @change="uploadAvatar"
          accept="image/*"
          class="file-input"
      />
    </label>
    <button class="save-button" @click="saveAvatar">Guardar Avatar</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserAvatar",
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({ avatar: "https://via.placeholder.com/150" }),
    },
  },
  data() {
    return {
      newAvatar: null, // Archivo seleccionado
      avatar: this.user.avatar, // Inicializa con el avatar actual
    };
  },
  methods: {
    uploadAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        this.newAvatar = file;
        this.avatar = URL.createObjectURL(file); // Vista previa
      }
    },
    async saveAvatar() {
      if (!this.newAvatar) {
        alert("Por favor selecciona una imagen antes de guardar.");
        return;
      }

      try {
        // Simula la subida del archivo y genera una URL temporal
        const formData = new FormData();
        formData.append("file", this.newAvatar);

        // Envío al endpoint de upload (temporal)
        const uploadResponse = await axios.post("http://localhost:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const newAvatarUrl = uploadResponse.data.url;

        // Actualiza en el backend temporal
        await axios.put(`http://localhost:3000/users/${this.user.id}`, {
          ...this.user,
          avatar: newAvatarUrl,
        });

        this.$emit("update-avatar", newAvatarUrl); // Comunica el cambio al componente padre
        alert("Avatar actualizado correctamente.");
        this.newAvatar = null; // Limpia el estado del archivo
      } catch (error) {
        console.error("Error al guardar el avatar:", error);
        alert("Ocurrió un error al actualizar el avatar.");
      }
    },
  },
};
</script>

<style scoped>
.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.user-avatar:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

h2 {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.avatar-preview img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.upload-label {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-block;
}

.upload-label:hover {
  background-color: #0056b3;
}

.file-input {
  display: none; /* Oculta el input real */
}

.save-button {
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.save-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}
</style>
