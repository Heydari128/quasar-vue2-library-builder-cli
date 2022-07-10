<template>
  <div id="q-app">
    <q-layout view="hHh lpR fFf">
      <q-page-container>
        <q-page padding>
          <TextField v-model="fullname" label="FullName"/>
          <q-btn @click="SwitchTheme">Switch Theme</q-btn>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fullname: 'dasdsadww'
    }
  },
  methods: {
    SwitchTheme() {
      this.$q.dark.toggle()
    }
  }
}
</script>
