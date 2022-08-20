import { createStore } from "vuex";
import axiosClient from "@/axios";

const tmpSurveys = [
   {
      id: 100,
      title: "TheCodeholic Youtube channel content",
      slug: "thecodeholic-youtube-channel-content",
      status: "draft",
      image: "",
      description:
         "My name is Zura.<br>I am Web Developer with 9+ years of experience, free educational content",
      created_at: "",
      updated_at: "",
      expire_date: "",
      questions: [
         {
            id: 1,
            type: "select",
            question: "From which country are you?",
            description: null,
            data: {
               options: [
                  { uuid: "eb26dc71-0b11-4981-8ad1-3e1e2798c0b8", text: "USA" },
                  { uuid: "5c1b8326-92df-4e45-b73e-ef4e2ff2b7cc", text: "UK" },
                  {
                     uuid: "021e1e77-7756-422f-b184-a29ff5edb13f",
                     text: "India",
                  },
                  {
                     uuid: "021e1e77-7756-422f-b184-a29ff5edb13f",
                     text: "Georgia",
                  },
               ],
            },
         },
      ],
   },
];

const store = createStore({
   state: {
      user: {
         data: {},
         token: sessionStorage.getItem("TOKEN"),
      },
      surveys: [...tmpSurveys],
      currentSurvey: {
         loading: false,
         data: {},
      },
      questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
   },
   getters: {},
   actions: {
      register({ commit }, user) {
         return axiosClient.post("/register", user).then(({ data }) => {
            commit("setUser", data);
            return data;
         });
      },
      login({ commit }, user) {
         return axiosClient.post("/login", user).then(({ data }) => {
            commit("setUser", data);
            return data;
         });
      },
      logout({ commit }) {
         return axiosClient.post("/logout").then((response) => {
            commit("logout");
            return response;
         });
      },
      saveSurvey({ commit }, survey) {
         delete survey.image_url;
         let response;
         if (survey.id) {
            response = axiosClient
               .put(`/survey/${survey.id}`, survey)
               .then((res) => {
                  commit("updateSurvey", res.data);
                  return res;
               });
         } else {
            response = axiosClient
               .post("/survey", survey)
               .then((res) => {
                  commit("saveSurvey", res.data);
                  return res;
               })
               .catch((e) => {
                  console.log(e);
               });
         }

         return response;
      },
      getSurvey({ commit }, id) {
         commit("setCurrentSurveyLoading", true);
         return axiosClient
            .get(`/survey/${id}`)
            .then((res) => {
               commit("setCurrentSurvey", res.data);
               commit("setCurrentSurveyLoading", false);
               return res;
            })
            .catch((err) => {
               commit("setCurrentSurveyLoading", false);
               throw err;
            });
      },
   },
   mutations: {
      logout: (state) => {
         state.user.data = {};
         state.user.token = null;
         sessionStorage.removeItem("TOKEN");
      },
      setUser: (state, userData) => {
         state.user.token = userData.token;
         state.user.data = userData.user;
         sessionStorage.setItem("TOKEN", userData.token);
      },
      saveSurvey: (state, survey) => {
         state.surveys = [...state.surveys, survey.data];
      },
      updateSurvey: (state, survey) => {
         state.surveys = state.surveys.map((s) => {
            if (s.id == survey.data.id) {
               return survey.data;
            }
            return s;
         });
      },
      setCurrentSurvey: (state, survey) => {
         state.currentSurvey.data = survey.data;
      },
      setCurrentSurveyLoading: (state, loading) => {
         state.currentSurvey.loading = loading;
      },
   },
   modules: {},
});

export default store;
