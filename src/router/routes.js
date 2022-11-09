const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
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
    path: "/checkout",
    component: () => import("layouts/Checkout.vue"),
    children: [{ path: "", component: () => import("pages/CheckoutPage.vue") }],
  },
  {
    path: "/erro/checkout",
    component: () => import("layouts/Checkout/falha.vue"),
    children: [
      { path: "", component: () => import("pages/errorCheckout.vue") },
    ],
  },
  // {
  //   path: "/dormakaba",
  //   component: () => import("pages/Dormakaba.vue"),
  // },
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
