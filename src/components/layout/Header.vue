<template>
  <div class="header">
    <div class="title">Amarhu - Prensa Alternativa El Jota</div>
    <div class="user-section">
      <img src="../../assets/logo-jota.png" alt="User Icon" class="user-icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #ffffff;
  color: #333333;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #333333;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
</style>
