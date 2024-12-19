<template>
  <div class="user-avatar">
    <h2>Actualizar Avatar</h2>
    <div class="avatar-preview">
      <img :src="avatar" alt="Avatar" />
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
export default {
  name: "UserAvatar",
  data() {
    return {
      avatar: "https://via.placeholder.com/150", // Imagen de avatar por defecto
    };
  },
  methods: {
    uploadAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        this.avatar = URL.createObjectURL(file);
      }
    },
    saveAvatar() {
      alert("Avatar actualizado correctamente.");
    },
  },
};
</script>

<style scoped>
.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.user-avatar:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

h2 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.avatar-preview img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.upload-label {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background-color: #0056b3;
}

.file-input {
  display: none; /* Oculta el input real */
}

.save-button {
  margin-top: 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  max-width: 150px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.save-button:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}
</style>
