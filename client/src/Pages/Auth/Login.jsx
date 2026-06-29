import { useState } from "react";
import { ArrowRight, BookOpen, Check, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegisterUserMutation, useUloginUserMutation } from "@/Features/Apis/authApi";

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[#7f938b]">{label}</span>
    <input {...props} className="h-13 w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#4e645b] focus:border-[#c9ff62]/60 focus:ring-4 focus:ring-[#c9ff62]/5"/>
  </label>
);

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ email: "", password: "", confirmPassword: "", role: "student" });
  const [errors, setErrors] = useState({});
  const [registerUser, { isLoading: registering }] = useRegisterUserMutation();
  const [loginUser, { isLoading: loggingIn }] = useUloginUserMutation();

  const update = (setter) => (event) => setter((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (type) => {
    setErrors({});
    const isSignup = type === "signup";
    const values = isSignup ? signup : login;

    if (!values.email || !values.password || (isSignup && !values.confirmPassword)) {
      return setErrors({ form: "Please complete every field." });
    }
    if (isSignup && values.password !== values.confirmPassword) {
      return setErrors({ form: "Those passwords don’t match yet." });
    }
    if (isSignup && !/^(?=.*[a-z])(?=.*[\W_]).{7,}$/.test(values.password)) {
      return setErrors({ form: "Use 7+ characters with a lowercase letter and a symbol." });
    }

    try {
      await (isSignup ? registerUser(values) : loginUser(values)).unwrap();
      if (isSignup) {
        setSignup({ email: "", password: "", confirmPassword: "", role: "student" });
        toast.success("Account ready. Sign in to start learning.");
      } else {
        toast.success("Welcome back.");
        navigate("/");
      }
    } catch (error) {
      setErrors({ form: error?.data?.message || "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="site-shell grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden border-r border-white/10 bg-[#10251f] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#c9ff62] text-[#07110f]"><BookOpen size={21}/></span>
          <span className="text-xl font-extrabold tracking-tight">Koursify.</span>
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="eyebrow"><Sparkles size={14}/> Your next chapter</span>
          <h1 className="mt-6 text-6xl font-extrabold leading-[.98] tracking-[-.07em] text-[#f6f3de]">Make learning your unfair advantage.</h1>
          <div className="mt-9 space-y-4 text-sm text-[#afc0b9]">
            {["Learn from focused, practical courses", "Track progress without the clutter", "Build skills you can actually use"].map((item) => (
              <p key={item} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#c9ff62]/10 text-[#c9ff62]"><Check size={13}/></span>{item}</p>
            ))}
          </div>
        </div>
        <p className="text-xs uppercase tracking-[.16em] text-[#5f766c]">Learn deliberately · Grow visibly</p>
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full border-[56px] border-[#c9ff62]/10"/>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c9ff62] text-[#07110f]"><BookOpen size={19}/></span>
            <span className="text-xl font-extrabold">Koursify.</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-[-.055em] text-[#f6f3de]">Welcome in.</h2>
          <p className="muted-copy mt-3">Sign in or create your learner account.</p>

          <Tabs defaultValue="login" className="mt-8">
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-full border border-white/10 bg-[#0d1d19] p-1">
              <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-[#c9ff62] data-[state=active]:text-[#07110f]">Sign in</TabsTrigger>
              <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-[#c9ff62] data-[state=active]:text-[#07110f]">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-7 space-y-5">
              <Field label="Email address" name="email" type="email" value={login.email} onChange={update(setLogin)} placeholder="you@example.com"/>
              <Field label="Password" name="password" type="password" value={login.password} onChange={update(setLogin)} placeholder="Your password"/>
              {errors.form && <p className="rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm text-red-300">{errors.form}</p>}
              <button disabled={loggingIn} onClick={() => submit("login")} className="lime-button w-full">
                {loggingIn ? "Signing in…" : "Sign in"} <ArrowRight size={17}/>
              </button>
            </TabsContent>

            <TabsContent value="register" className="mt-7 space-y-5">
              <Field label="Email address" name="email" type="email" value={signup.email} onChange={update(setSignup)} placeholder="you@example.com"/>
              <Field label="Create password" name="password" type="password" value={signup.password} onChange={update(setSignup)} placeholder="7+ characters"/>
              <Field label="Confirm password" name="confirmPassword" type="password" value={signup.confirmPassword} onChange={update(setSignup)} placeholder="Type it once more"/>
              
              {/* Account Type Selector */}
              <div className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[#7f938b]">I want to:</span>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <button 
                    type="button"
                    onClick={() => setSignup(prev => ({ ...prev, role: "student" }))}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 ${
                      signup.role === "student" 
                        ? "border-[#c9ff62]/30 bg-[#c9ff62]/5 text-[#c9ff62]" 
                        : "border-white/5 bg-[#0d1d19]/40 text-[#8ea197] hover:border-white/10"
                    }`}
                  >
                    <span>Learn Courses</span>
                    <span className="text-[10px] font-normal text-white/40">Student Account</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSignup(prev => ({ ...prev, role: "instructor" }))}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 ${
                      signup.role === "instructor" 
                        ? "border-[#c9ff62]/30 bg-[#c9ff62]/5 text-[#c9ff62]" 
                        : "border-white/5 bg-[#0d1d19]/40 text-[#8ea197] hover:border-white/10"
                    }`}
                  >
                    <span>Teach Courses</span>
                    <span className="text-[10px] font-normal text-white/40">Instructor Account</span>
                  </button>
                </div>
              </div>

              {errors.form && <p className="rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm text-red-300">{errors.form}</p>}
              <button disabled={registering} onClick={() => submit("signup")} className="lime-button w-full">
                {registering ? "Creating account…" : signup.role === "instructor" ? "Create instructor account" : "Create learner account"} <ArrowRight size={17}/>
              </button>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Login;
