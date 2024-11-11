<template>
  <div class="header">
    <div class="title">Amarhu - Prensa Alternativa El Jota</div>
    <div class="user-icon">
      <img src="@/assets/logo-jota.png" alt="User Icon" />
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
  padding: 10px 20px;
  background-color: #333;
  color: white;
  box-sizing: border-box;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.user-icon img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
