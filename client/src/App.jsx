import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "./index.css";
import { ToastContainer } from "react-toastify";

import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./Pages/Student/HomePage.jsx";
import Auth from "./AppComonents/Auth/Auth.jsx";
import HeroPage from "./AppComonents/Student/HeroPage.jsx";
import MyLearning from "./Pages/Student/MyLearning.jsx";
import Profile from "./Pages/Student/Profile.jsx";
import Admin from "./AppComonents/Admin/Admin.jsx";
import Dashboard from "./Pages/Admin/Dashboard.jsx";
import AddCourse from "./Pages/Admin/AddCourse.jsx";
import CourseTable from "./AppComonents/Admin/CourseTable.jsx";
import EditCourse from "./Pages/Admin/EditCourse.jsx";
import LecturePage from "./Pages/Admin/LecturePage.jsx";
import EditLecture from "./Pages/Admin/EditLecture.jsx";
import CourseDetail from "./Pages/Student/CourseDetail.jsx";
import CourseProgress from "./Pages/Student/CourseProgress.jsx";
import SearchPage from "./Pages/Student/searchPage.jsx";
import { Authenticated, ProtectedRoute, AdminRoute } from "./AppComonents/Commom/ProtectedRoutes.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HeroPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "my-learning", element: <ProtectedRoute><MyLearning /></ProtectedRoute> },
        { path: "my-profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "course/search", element: <ProtectedRoute><SearchPage /></ProtectedRoute> },
        { path: "detail-page/:courseId", element: <ProtectedRoute><CourseDetail /></ProtectedRoute> },
        { path: "course-progress/:courseId", element: <ProtectedRoute><CourseProgress /></ProtectedRoute> },
      ],
    },
    {
      path: "/auth",
      element: (
        <Authenticated>
          <Auth />
        </Authenticated>
      ),
    },
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <Admin />
        </AdminRoute>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "add-course", element: <CourseTable /> },
        { path: "add-course/create-course", element: <AddCourse /> },
        { path: "add-course/:courseId", element: <EditCourse /> },
        { path: "add-course/:courseId/lectures", element: <LecturePage /> },
        { path: "add-course/:courseId/lectures/:lectureId/edit", element: <EditLecture /> },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName={() => "custom-toast"}
      />

      {/* Provide the router to the app */}
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
