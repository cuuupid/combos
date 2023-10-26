import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"
import Home from "@Muse/views/Home.vue"

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/:catchAll(.*)",
		name: "Home",
		component: Home,
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})
export default router