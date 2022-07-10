<template>
  <div id="q-app">
    <q-layout view="hHh lpR fFf">
      <q-page-container class="bg-grey-2">
        <q-page padding>
          <TextField v-model="fullname" label="FullName"/>
          <TextField v-model="fullname" label="Email"/>
          <TextField v-model="fullname" label="ID"/>
          <TextField v-model="fullname" label="Birthdate"/>
          <TextField v-model="fullname" label="Fater Name"/>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fullname: ''
    }
  }
}
</script>
