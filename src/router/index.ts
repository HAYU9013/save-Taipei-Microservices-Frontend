import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FormView from '../views/FormView.vue';
import SurroundingServiceView from '../views/SurroundingServiceView.vue';
import TopQnAListView from '../views/TopQnAListView.vue';
import QnAListView from '../views/QnAListView.vue';
import CouponView from '../views/CouponView.vue';
import CouponListView from '../views/CouponListView.vue';
import HotSpotView from '../views/HotSpotView.vue';
import TicketDetail from '../views/TicketDetail.vue';
import CouponDetail from '../views/CouponDetail.vue';

import HomePage from '../views/HomePage.vue';
import ActivitiesList from "../views/ActivitiesList.vue";
import NoiceDetect from "../views//NoiceDetect.vue";
import ReportSubmit from "../views/ReportSubmit.vue";
import ReportManage from "../views/ReportManage.vue";
import DataDetect from "../views/DataDetect.vue";
import AutoFillForm from "../views/AutoFillForm.vue";
import VotePage from "../views/VotePage.vue"; // 確保這行存在
import CreateVoteActivity from '../views/CreateVoteActivity.vue';  // 新增這一行


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/form/:id',
      name: 'form',
      component: FormView
    },
    {
      path: '/surrounding-service',
      name: 'surrounding-service',
      component: SurroundingServiceView
    },
    {
      path: '/qna',
      name: 'top-qna-list',
      component: TopQnAListView
    },
    {
      path: '/qna/categories',
      name: 'qna-list',
      component: QnAListView
    },
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/activities",
      name: "activities",
      component: ActivitiesList,
    },
    {
      path: "/auto-fill-form",
      name: "auto-fill-form",
      component: AutoFillForm,
    },
    {
      path: "/detect",
      name: "noice-detect",
      component: NoiceDetect,
    },
    {
      path: "/report",
      name: "report",
      component: ReportSubmit,
    },
    {
      path: "/report-manage",
      name: "report-manage",
      component: ReportManage,
    },
    {
      path: "/data-detect",
      name: "data-detect",
      component: DataDetect,
    },
    {
      path: "/vote", // 確保這行存在
      name: "vote",
      component: VotePage,
    },
    {
      path: '/create-activity',  // 新增活動的路徑
      name: 'CreateActivity',
      component: CreateVoteActivity,
    },
    {
      path: '/coupon',
      children: [
        {
          path: '',
          name: 'coupon',
          component: CouponView
        },
        {
          path: 'list',
          name: 'coupon-list',
          component: CouponListView
        },
        {
          path: 'hotspot/:id',
          name: 'hotspot',
          component: HotSpotView
        },
        {
          path: 'ticket-detail/:id',
          name: 'ticket-detail',
          component: TicketDetail
        },
        {
          path: 'coupon-detail/:id',
          name: 'coupon-detail',
          component: CouponDetail
        }
      ]
    }
  ]
});

export default router;
// import { createRouter, createWebHistory } from "vue-router";
// import HomePage from "@/views/HomePage.vue";
// import ActivitiesList from "@/views/ActivitiesList.vue";
// import NoiceDetect from "@/views/NoiceDetect.vue";
// import ReportSubmit from "@/views/ReportSubmit.vue";
// import ReportManage from "@/views/ReportManage.vue";
// import DataDetect from "@/views/DataDetect.vue";
// import AutoFillForm from "@/views/AutoFillForm.vue";
// import VotePage from "@/views/VotePage.vue"; // 確保這行存在

// const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: HomePage,
  // },
  // {
  //   path: "/activities",
  //   name: "activities",
  //   component: ActivitiesList,
  // },
  // {
  //   path: "/auto-fill-form",
  //   name: "auto-fill-form",
  //   component: AutoFillForm,
  // },
  // {
  //   path: "/detect",
  //   name: "noice-detect",
  //   component: NoiceDetect,
  // },
  // {
  //   path: "/report",
  //   name: "report",
  //   component: ReportSubmit,
  // },
  // {
  //   path: "/report-manage",
  //   name: "report-manage",
  //   component: ReportManage,
  // },
  // {
  //   path: "/data-detect",
  //   name: "data-detect",
  //   component: DataDetect,
  // },
  // {
  //   path: "/vote", // 確保這行存在
  //   name: "vote",
  //   component: VotePage,
  // },
// ];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// });

// export default router;
