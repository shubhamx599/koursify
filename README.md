koursify
├─ client
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ stars.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ AppComonents
│  │  │  ├─ Admin
│  │  │  │  ├─ Admin.jsx
│  │  │  │  ├─ CourseTab.jsx
│  │  │  │  ├─ CourseTable.jsx
│  │  │  │  ├─ Lecture.jsx
│  │  │  │  ├─ LectureTab.jsx
│  │  │  │  └─ Slidebar.jsx
│  │  │  ├─ Auth
│  │  │  │  └─ Auth.jsx
│  │  │  ├─ Commom
│  │  │  │  ├─ AdminNavbar.jsx
│  │  │  │  ├─ BuyButton.jsx
│  │  │  │  ├─ CourseSkeleton.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  ├─ ProtectedRoutes.jsx
│  │  │  │  └─ TextEditor.jsx
│  │  │  └─ Student
│  │  │     ├─ course.jsx
│  │  │     ├─ Courses.jsx
│  │  │     ├─ Filter.jsx
│  │  │     ├─ HeroPage.jsx
│  │  │     └─ SearchResult.jsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ theme-provider.jsx
│  │  │  └─ ui
│  │  │     ├─ accordion.jsx
│  │  │     ├─ avatar.jsx
│  │  │     ├─ badge.jsx
│  │  │     ├─ button.jsx
│  │  │     ├─ card.jsx
│  │  │     ├─ carousel.jsx
│  │  │     ├─ checkbox.jsx
│  │  │     ├─ dialog.jsx
│  │  │     ├─ drawer.jsx
│  │  │     ├─ dropdown-menu.jsx
│  │  │     ├─ input.jsx
│  │  │     ├─ label.jsx
│  │  │     ├─ progress.jsx
│  │  │     ├─ radio-group.jsx
│  │  │     ├─ select.jsx
│  │  │     ├─ skeleton.jsx
│  │  │     ├─ switch.jsx
│  │  │     ├─ table.jsx
│  │  │     ├─ tabs.jsx
│  │  │     └─ textarea.jsx
│  │  ├─ Features
│  │  │  ├─ Apis
│  │  │  │  ├─ authApi.js
│  │  │  │  ├─ courseApi.js
│  │  │  │  ├─ progressApi.js
│  │  │  │  └─ purcaseApi.js
│  │  │  └─ auth
│  │  │     └─ authSlice.js
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  └─ utils.js
│  │  ├─ main.jsx
│  │  ├─ Pages
│  │  │  ├─ Admin
│  │  │  │  ├─ AddCourse.jsx
│  │  │  │  ├─ Dashboard.jsx
│  │  │  │  ├─ EditCourse.jsx
│  │  │  │  ├─ EditLecture.jsx
│  │  │  │  └─ LecturePage.jsx
│  │  │  ├─ Auth
│  │  │  │  └─ Login.jsx
│  │  │  └─ Student
│  │  │     ├─ CourseDetail.jsx
│  │  │     ├─ courseFail.jsx
│  │  │     ├─ CourseProgress.jsx
│  │  │     ├─ HomePage.jsx
│  │  │     ├─ MyLearning.jsx
│  │  │     ├─ Profile.jsx
│  │  │     └─ searchPage.jsx
│  │  └─ Store
│  │     ├─ rootReducer.js
│  │     └─ Store.js
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ Config
   │  └─ db.js
   ├─ Controllers
   │  ├─ AuthController.js
   │  ├─ CourseController.js
   │  ├─ progressController.js
   │  └─ purchaseController.js
   ├─ index.js
   ├─ MIddlewares
   │  └─ isAuthenticated.js
   ├─ Modles
   │  ├─ Course.js
   │  ├─ coursePurchased.js
   │  ├─ lecture.js
   │  ├─ progress.js
   │  └─ userModel.js
   ├─ package-lock.json
   ├─ package.json
   ├─ Routes
   │  ├─ AuthRoute.js
   │  ├─ CourseRoute.js
   │  ├─ mediaRoute.js
   │  ├─ progressRoute.js
   │  └─ purchaseCourseRoute.js
   └─ utils
      ├─ cloudinary.js
      ├─ Jwttoken.js
      ├─ multer.js
      └─ razorpay.js