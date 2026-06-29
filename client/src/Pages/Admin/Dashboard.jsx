import { ArrowUpRight, BookOpen, IndianRupee, ShoppingBag, Sparkles } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGetAllPurchaseAdminCourseQuery } from "@/Features/Apis/purcaseApi";

const Metric = ({ icon: Icon, label, value, note }) => (
  <div className="rounded-[22px] border border-white/10 bg-[#10231e] p-5">
    <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#c9ff62]/10 text-[#c9ff62]"><Icon size={18}/></span><ArrowUpRight className="text-[#516860]" size={17}/></div>
    <p className="mt-7 text-xs font-bold uppercase tracking-[.13em] text-[#6f867d]">{label}</p>
    <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#f6f3de]">{value}</p>
    <p className="mt-2 text-xs text-[#789087]">{note}</p>
  </div>
);

const Dashboard = () => {
  const { data, isError, isLoading } = useGetAllPurchaseAdminCourseQuery();
  const purchases = data?.purchasedCourses || [];
  const totalRevenue = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);
  const uniqueCourses = new Set(purchases.map((item) => item.courseId?._id).filter(Boolean)).size;
  const chartData = purchases.map((item, index) => ({
    name: item.courseId?.courseTitle?.slice(0, 12) || `Sale ${index + 1}`,
    revenue: item.amount || 0,
  }));

  if (isLoading) return <div className="grid min-h-[60vh] place-items-center text-[#8da098]">Preparing your studio…</div>;
  if (isError) return <div className="grid min-h-[60vh] place-items-center text-[#ff9b8f]">We couldn’t load the studio data.</div>;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><span className="eyebrow"><Sparkles size={14}/> Studio pulse</span><h1 className="mt-4 text-4xl font-extrabold tracking-[-.055em] text-[#f6f3de]">Good work has momentum.</h1><p className="muted-copy mt-2">A clean view of how your courses are performing.</p></div>
        <div className="rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-xs text-[#8ea198]">Updated just now</div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric icon={ShoppingBag} label="Course sales" value={purchases.length} note="Completed purchases"/>
        <Metric icon={IndianRupee} label="Total revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} note="Across all published courses"/>
        <Metric icon={BookOpen} label="Active sellers" value={uniqueCourses} note="Courses with at least one sale"/>
      </div>

      <section className="mt-5 rounded-[24px] border border-white/10 bg-[#10231e] p-5 md:p-7">
        <div><p className="text-lg font-bold text-[#f6f3de]">Revenue rhythm</p><p className="mt-1 text-sm text-[#70877e]">Completed sales across your catalogue</p></div>
        {chartData.length ? (
          <div className="mt-8 h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,.07)"/>
                <XAxis dataKey="name" stroke="#60766d" tickLine={false} axisLine={false} fontSize={11}/>
                <YAxis stroke="#60766d" tickLine={false} axisLine={false} fontSize={11}/>
                <Tooltip contentStyle={{ background: "#07110f", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16 }} formatter={(value) => [`₹${value}`, "Revenue"]}/>
                <Line type="monotone" dataKey="revenue" stroke="#c9ff62" strokeWidth={3} dot={{ fill: "#07110f", stroke: "#c9ff62", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <div className="mt-8 grid h-[260px] place-items-center rounded-2xl border border-dashed border-white/10 text-sm text-[#6e857c]">Your first sale will start the chart.</div>}
      </section>
    </div>
  );
};

export default Dashboard;
