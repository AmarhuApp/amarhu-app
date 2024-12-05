<template>
  <div class="sidebar">
    <ul>
      <li>
        <router-link to="/">
          <span class="material-icons icon">home</span> Home
        </router-link>
      </li>
      <li>
        <router-link to="/posts">
          <span class="material-icons icon">article</span> Posts
        </router-link>
      </li>
      <li>
        <router-link to="/statistics">
          <span class="material-icons icon">bar_chart</span> Statistics
        </router-link>
      </li>
      <li>
        <router-link to="/reports">
          <span class="material-icons icon">description</span> Reports
        </router-link>
      </li>
      <li>
        <router-link to="/settings">
          <span class="material-icons icon">settings</span> Settings
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 1px 0 1px rgba(0, 0, 0, 0.1);
  border-right: 1px #e0e0e0;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size: 16px;
  transition: color 0.3s ease;
}

.sidebar a:hover {
  color: #FF0000;
}

.icon {
  margin-right: 10px;
  font-size: 24px;
  color: #666;
}
</style>
