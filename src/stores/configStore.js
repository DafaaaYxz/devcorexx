import { defineStore } from 'pinia';
export const useConfigStore = defineStore('config', {
  state: () => ({ loadingBoot: true }),
  actions: { setBootComplete() { this.loadingBoot = false; } }
});
