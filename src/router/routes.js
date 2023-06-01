const routes = [
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },

  {
    path: "/",
    component: () => import("pages/Landingpage.vue"),
  },

  {
    path: "/hotmilk",
    component: () => import("pages/Hotmilk.vue"),
  },
  {
    path: "/galvao",
    component: () => import("layouts/Galvao.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
  {
    path: "/feedback",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Checkoutpage.vue") }],
  },
  {
    path: "/feedbackAprovacao",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/CheckoutPreAprovacao.vue") }],
  },

  {
    path: "/dormakaba",
    component: () => import("pages/Dormakaba.vue"),
  },

  {
    path: "/agora",
    component: () => import("pages/Agora.vue"),
  },
  {
    path: "/mindhub",
    component: () => import("pages/Mindhub.vue"),
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
  },
  {
    path: "/baggio",
    component: () => import("pages/Baggio.vue"),
  },
  {
    path: "/:entidadeId/:imovelRef",
    component: () => import("layouts/Registro.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
