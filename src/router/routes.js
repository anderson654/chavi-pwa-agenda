const routes = [
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
  {
    path: "/coworkings",
    component: () => import("pages/Landingpage.vue"),
  },

  {
    path: "/hotmilk/agenda",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Hotmilk.vue") }]
  },
  {
    path: "/galvao",
    component: () => import("layouts/Galvao.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
  {
    path: "/feedback",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/CheckoutFeedback.vue") }],
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
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Agora.vue") }]
  },
  {
    path: "/mindhub",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Mindhub.vue") }]
  },
  {
    path: "/blaze",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/blazeCoworking.vue") }]
  },
  {
    path: "/dinastia",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/Dinastia.vue") }]
  },
  {
    path: "/h2u",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/H2UCoworking.vue") }]
  },
  {
    path: "/celepar",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/CeleparCoworking.vue") }]
  },
  {
    path: "/PinhaoHub",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/pinhaohub.vue") }]
  },
  {
    path: "/haus",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/HausCoworking.vue") }]
  },
  {
    path: "/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Login.vue") }]
  },
  {
    path: "/:entidadeId/:imovelRef",
    component: () => import("layouts/Registro.vue"),
  },
  {
    path: "/redirect",
    component: () => import("layouts/Redirect.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
