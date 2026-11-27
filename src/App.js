import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useParams } from "react-router-dom";
import "./App.css";

const jobs = [
  { id: 1, category: "IT", title: "Web Developer Intern", company: "PixelWorks", location: "Remote", type: "OJT", description: "Build and test small web features." },
  { id: 2, category: "IT", title: "IT Support Intern", company: "Campus Connect", location: "Makati", type: "On-site", description: "Help with basic software and network support." },
  { id: 3, category: "IT", title: "QA Testing Intern", company: "Bright Apps", location: "Pasig", type: "Hybrid", description: "Test applications and report bugs." },
  { id: 4, category: "Engineering", title: "Civil Engineering Intern", company: "BuildPro", location: "Quezon City", type: "On-site", description: "Assist engineers with plans and site reports." },
  { id: 5, category: "Engineering", title: "Mechanical Intern", company: "Metro Machine", location: "Caloocan", type: "On-site", description: "Support equipment inspection and documentation." },
  { id: 6, category: "Engineering", title: "Electrical Intern", company: "PowerTek", location: "Mandaluyong", type: "Hybrid", description: "Assist in basic electrical layout and testing." },
  { id: 7, category: "Accountancy", title: "Accounting Intern", company: "Ledger & Co.", location: "Manila", type: "On-site", description: "Help prepare records and basic reports." },
  { id: 8, category: "Accountancy", title: "Audit Intern", company: "CountRight", location: "Taguig", type: "Hybrid", description: "Review documents and assist audit procedures." },
  { id: 9, category: "Accountancy", title: "Tax Intern", company: "TaxPoint", location: "Remote", type: "OJT", description: "Organize tax forms and supporting documents." }
];

const AppContext = createContext(null);

function Layout({ children }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);

  function logout() {
    setUser(null);
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate("/home")}>TrackInTern</button>
        <nav>
          <NavLink to="/home">Jobs</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/messages">Messages</NavLink>
          <NavLink to="/attendance">Attendance</NavLink>
        </nav>
        <div className="account">
          <span>{user?.name || "Student"}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError("Enter a mock username and password.");
      return;
    }
    setUser({ name: name.trim(), course: "IT" });
    navigate("/home");
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>TrackInTern</h1>
        <h2>Login</h2>
        <label>Username<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
        <button type="button" className="link-button" onClick={() => navigate("/signup")}>Create an account</button>
      </form>
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("IT");

  function submit(event) {
    event.preventDefault();
    setUser({ name: name.trim(), course });
    navigate("/home");
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>TrackInTern</h1>
        <h2>Sign Up</h2>
        <label>Username<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <label>Course<select value={course} onChange={(e) => setCourse(e.target.value)}><option>IT</option><option>Engineering</option><option>Accountancy</option></select></label>
        <button type="submit">Sign Up</button>
        <button type="button" className="link-button" onClick={() => navigate("/")}>Back to login</button>
      </form>
    </div>
  );
}

function Jobs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const visibleJobs = jobs.filter((job) =>
    (category === "All" || job.category === category) &&
    `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-heading">
        <div><h1>Available OJT Jobs</h1><p>Browse internship opportunities.</p></div>
      </div>
      <div className="filters">
        <input placeholder="Search jobs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option><option>IT</option><option>Engineering</option><option>Accountancy</option>
        </select>
      </div>
      <div className="job-grid">
        {visibleJobs.map((job) => (
          <article className="job-card" key={job.id}>
            <span className="category">{job.category}</span>
            <h2>{job.title}</h2>
            <p className="company">{job.company}</p>
            <p>{job.location} · {job.type}</p>
            <p>{job.description}</p>
            <button onClick={() => setSelectedJob(job)}>View / Message</button>
          </article>
        ))}
      </div>
      {visibleJobs.length === 0 && <p>No jobs found.</p>}
      {selectedJob && <JobModal job={selectedJob} close={() => setSelectedJob(null)} />}
    </div>
  );
}

function JobModal({ job, close }) {
  const [message, setMessage] = useState("");
  const { setConversations } = useContext(AppContext);

  function submit(event) {
    event.preventDefault();
    setConversations((current) => ({
      ...current,
      [job.company]: [
        ...(current[job.company] || []),
        { from: "Student", text: message, time: "Just now" }
      ]
    }));
    setMessage("");
  }

  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={close}>×</button>
        <span className="category">{job.category}</span>
        <h2>{job.title}</h2>
        <p><strong>{job.company}</strong></p>
        <p>{job.location} · {job.type}</p>
        <p>{job.description}</p>
        <form onSubmit={submit}>
          <label>Message the hirer
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Write a message..." />
          </label>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}

function Categories() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="page-heading"><div><h1>Job Categories</h1><p>Choose a course to see related jobs.</p></div></div>
      <div className="category-grid">
        {["IT", "Engineering", "Accountancy"].map((category) => (
          <button className="category-card" key={category} onClick={() => navigate(`/category/${category}`)}>
            <h2>{category}</h2>
            <p>{jobs.filter((job) => job.category === category).length} available jobs</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryJobs() {
  const { name } = useParams();
  const categoryJobs = jobs.filter((job) => job.category === name);
  return (
    <div className="page">
      <div className="page-heading"><div><h1>{name} Jobs</h1><p>Available internships for this category.</p></div></div>
      <div className="job-grid">
        {categoryJobs.map((job) => (
          <article className="job-card" key={job.id}>
            <h2>{job.title}</h2><p className="company">{job.company}</p>
            <p>{job.location} · {job.type}</p><p>{job.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Messages() {
  const { conversations, setConversations } = useContext(AppContext);
  const [selected, setSelected] = useState(Object.keys(conversations)[0] || "");
  const [draft, setDraft] = useState("");

  function send(event) {
    event.preventDefault();
    if (!selected || !draft.trim()) return;
    setConversations((current) => ({
      ...current,
      [selected]: [
        ...(current[selected] || []),
        { from: "Student", text: draft, time: "Just now" }
      ]
    }));
    setDraft("");
  }

  return (
    <div className="page">
      <h1>Messages</h1>
      <div className="messages-layout">
        <aside className="conversation-list">
          {Object.keys(conversations).length ? Object.keys(conversations).map((name) => (
            <button className={selected === name ? "active" : ""} key={name} onClick={() => setSelected(name)}>{name}</button>
          )) : <p>No conversations yet.</p>}
        </aside>
        <section className="conversation">
          {selected ? (
            <>
              <h2>{selected}</h2>
              <div className="chat">
                {(conversations[selected] || []).map((item, index) => (
                  <div className="chat-message" key={index}><strong>{item.from}</strong><p>{item.text}</p><small>{item.time}</small></div>
                ))}
              </div>
              <form onSubmit={send} className="chat-form">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message" />
                <button type="submit">Send</button>
              </form>
            </>
          ) : <p>Open a job and message the hirer to start a conversation.</p>}
        </section>
      </div>
    </div>
  );
}

function Attendance() {
  const { attendance, setAttendance } = useContext(AppContext);
  const rows = attendance;

  function update(index, field, value) {
    setAttendance((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row));
  }

  function addRow() {
    setAttendance((current) => [...current, { date: "", timeIn: "", timeOut: "", hours: "", status: "Present" }]);
  }

  return (
    <div className="page">
      <div className="page-heading"><div><h1>Attendance Sheet</h1><p>Record your daily OJT attendance.</p></div><button onClick={addRow}>Add Row</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Time In</th><th>Time Out</th><th>Hours</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type="date" value={row.date} onChange={(e) => update(index, "date", e.target.value)} /></td>
                <td><input type="time" value={row.timeIn} onChange={(e) => update(index, "timeIn", e.target.value)} /></td>
                <td><input type="time" value={row.timeOut} onChange={(e) => update(index, "timeOut", e.target.value)} /></td>
                <td><input value={row.hours} onChange={(e) => update(index, "hours", e.target.value)} placeholder="e.g. 8" /></td>
                <td><select value={row.status} onChange={(e) => update(index, "status", e.target.value)}><option>Present</option><option>Absent</option><option>Late</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Protected({ children }) {
  const { user } = useContext(AppContext);
  if (!user) return <Login />;
  return <Layout>{children}</Layout>;
}

function App() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState({
    PixelWorks: [
      { from: "Hirer", text: "Hi! Thanks for your interest in the Web Developer Intern position.", time: "Yesterday" },
      { from: "Student", text: "Hello! I am interested and available for OJT.", time: "Yesterday" }
    ]
  });
  const [attendance, setAttendance] = useState([
    { date: "2026-11-25", timeIn: "08:00", timeOut: "17:00", hours: "8", status: "Present" },
    { date: "2026-11-26", timeIn: "08:15", timeOut: "17:00", hours: "8", status: "Late" }
  ]);

  return (
    <AppContext.Provider value={{ user, setUser, conversations, setConversations, attendance, setAttendance }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Protected><Jobs /></Protected>} />
          <Route path="/categories" element={<Protected><Categories /></Protected>} />
          <Route path="/category/:name" element={<Protected><CategoryJobs /></Protected>} />
          <Route path="/messages" element={<Protected><Messages /></Protected>} />
          <Route path="/attendance" element={<Protected><Attendance /></Protected>} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
