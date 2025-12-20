<template>
  <div>
    <el-container>
      <el-aside width="250px">
        <A1LayoutMenu />
      </el-aside>
      <el-container>
        <el-header>
          <A1LayoutHeader />
        </el-header>
        <el-main>
          <slot />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped>
  .el-header,
  .el-main {
    padding: 0;
  }
</style>
