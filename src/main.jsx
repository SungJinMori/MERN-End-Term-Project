import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen, Feather, LayoutDashboard, FileText, MessageSquareText, Plus,
  Search, Bell, ChevronDown, Clock3, CheckCircle2, Send, MoreHorizontal,
  PenLine, Sparkles, ArrowUpRight, BookMarked, PanelRightClose, X, Save,
  UserRound, Eye, CircleDot, Filter, Trash2
} from "lucide-react";
import "./styles.css";

const initialDrafts = [
  { id: "d1", title: "The City That Forgot the Rain", genre: "Fantasy", excerpt: "Every morning, the city woke beneath the same cloudless sky...", content: "Every morning, the city woke beneath the same cloudless sky. The fountains still ran, the gutters still glittered, but no one remembered the last time rain had touched the rooftops.\n\nMira kept a jar on her windowsill. Her grandmother had told her that one day, when the city needed it most, the jar would fill.", status: "In review", updated: "Today", author: "Mira Chen", feedback: "The opening image is strong. Could you give us one concrete clue about why the rain matters to Mira personally?", genreColor: "lilac" },
  { id: "d2", title: "A Small Map of Elsewhere", genre: "Literary fiction", excerpt: "At the back of the drawer, beneath the old receipts, was a map...", content: "At the back of the drawer, beneath the old receipts, was a map of a place that did not exist. My father had drawn it in blue ink, with careful labels and a tiny compass rose.", status: "Draft", updated: "Yesterday", author: "You", feedback: "", genreColor: "sage" },
  { id: "d3", title: "Salt on the Windowsill", genre: "Short story", excerpt: "The sea left its signature on everything we owned...", content: "The sea left its signature on everything we owned. It silvered the door hinges, softened the books, and left a faint white edge on the photographs.", status: "Approved", updated: "Oct 24", author: "You", feedback: "Beautiful atmosphere. The ending lands well; consider trimming the second paragraph for pace.", genreColor: "peach" },
  { id: "d4", title: "Notes from a Borrowed Moon", genre: "Fantasy", excerpt: "The moon was rented by the hour in the old quarter...", content: "The moon was rented by the hour in the old quarter. For three coins, a fisherman could have silver light over his boat; for five, a poet could borrow a sliver for a line.", status: "In review", updated: "Oct 23", author: "Jon Bell", feedback: "Lovely premise. I would like to see the protagonist make a choice earlier in the piece.", genreColor: "blue" }
];

function loadDrafts() {
  try {
    const saved = localStorage.getItem("draftbridge-drafts-v1");
    return saved ? JSON.parse(saved) : initialDrafts;
  } catch { return initialDrafts; }
}
const statusClass = (s) => s.toLowerCase().replaceAll(" ", "-");
const initials = (name) => name.split(" ").map(p => p[0]).slice(0,2).join("").toUpperCase();

function App() {
  const [drafts, setDrafts] = useState(loadDrafts);
  const [role, setRole] = useState("Author");
  const [page, setPage] = useState("Overview");
  const [selectedId, setSelectedId] = useState("d1");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("Fantasy");
  const [newContent, setNewContent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => { localStorage.setItem("draftbridge-drafts-v1", JSON.stringify(drafts)); }, [drafts]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const selected = drafts.find(d => d.id === selectedId) || drafts[0];
  useEffect(() => {
    if (selected) {
      setEditorTitle(selected.title);
      setEditorContent(selected.content || "");
      setFeedback(selected.feedback || "");
    }
  }, [selectedId, selected?.title, selected?.content, selected?.feedback]);

  const visibleDrafts = useMemo(() => drafts.filter(d => {
    const matchesSearch = (d.title + " " + d.genre + " " + d.author).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || d.status === filter;
    const matchesRole = role === "Author" ? (d.author === "You" || d.author === "Mira Chen") : d.status === "In review";
    return matchesSearch && matchesFilter && matchesRole;
  }), [drafts, search, filter, role]);

  const counts = {
    total: drafts.filter(d => d.author === "You" || role === "Editor").length,
    review: drafts.filter(d => d.status === "In review" && (role === "Editor" || d.author === "You" || d.author === "Mira Chen")).length,
    approved: drafts.filter(d => d.status === "Approved" && (role === "Editor" || d.author === "You")).length,
    drafts: drafts.filter(d => d.status === "Draft" && (role === "Editor" || d.author === "You")).length
  };

  function updateSelected(patch) {
    if (!selected) return;
    setDrafts(prev => prev.map(d => d.id === selected.id ? { ...d, ...patch, updated: "Just now" } : d));
  }
  function createDraft(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const d = { id: "d" + Date.now(), title: newTitle.trim(), genre: newGenre, excerpt: newContent.trim().slice(0,100) || "A new story waiting to be written...", content: newContent, status: "Draft", updated: "Just now", author: "You", feedback: "", genreColor: "lilac" };
    setDrafts(prev => [d, ...prev]); setSelectedId(d.id); setPage("Manuscripts");
    setShowCreate(false); setNewTitle(""); setNewContent(""); setToast("New manuscript created");
  }
  function submitReview() {
    if (!selected) return;
    updateSelected({ title: editorTitle, content: editorContent, excerpt: editorContent.slice(0,100), status: "In review" });
    setToast("Manuscript submitted for review");
  }
  function saveChanges() {
    updateSelected({ title: editorTitle, content: editorContent, excerpt: editorContent.slice(0,100) });
    setToast("Changes saved on this device");
  }
  function sendFeedback() {
    if (!feedback.trim()) { setToast("Write some feedback first"); return; }
    updateSelected({ feedback: feedback.trim() });
    setToast("Editorial feedback saved");
  }
  function approve() {
    updateSelected({ status: "Approved", feedback: feedback.trim() });
    setToast("Manuscript marked as approved");
  }
  function removeDraft() {
    if (!selected) return;
    const id = selected.id;
    setDrafts(prev => prev.filter(d => d.id !== id));
    setSelectedId(drafts.find(d => d.id !== id)?.id || "");
    setToast("Manuscript deleted");
  }

  const nav = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Manuscripts", icon: BookOpen },
    { name: "Review desk", icon: MessageSquareText }
  ];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Feather size={21}/></div><div><b>draftbridge</b><span>THE WRITING ROOM</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{nav.map(n => <button key={n.name} className={"nav-item " + (page === n.name ? "active" : "")} onClick={() => {setPage(n.name); if(n.name==="Review desk") setRole("Editor");}}><n.icon size={18}/><span>{n.name}</span>{n.name==="Review desk" && <i>{drafts.filter(d=>d.status==="In review").length}</i>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="invite-card"><div className="invite-icon"><Sparkles size={17}/></div><b>Good stories grow here.</b><p>Every draft is a chance to make something meaningful.</p></div>
        <div className="profile-row"><div className="avatar avatar-dark">NC</div><div className="profile-info"><b>Noel Carter</b><span>{role} workspace</span></div><button className="icon-button small" title="Switch role" onClick={()=>{setRole(role==="Author"?"Editor":"Author");setPage("Overview");setToast("Switched to "+(role==="Author"?"Editor":"Author")+" view")}}><ChevronDown size={16}/></button></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><span className="slash">/</span><b>{page}</b></div>
        <div className="top-actions"><div className="role-switch"><span>Viewing as</span><button onClick={()=>{setRole(role==="Author"?"Editor":"Author");setPage("Overview");setToast("Switched to "+(role==="Author"?"Editor":"Author")+" view")}}>{role}<ChevronDown size={14}/></button></div><button className="icon-button notification" onClick={()=>setToast("You're all caught up")} title="Notifications"><Bell size={18}/><i/></button><div className="avatar avatar-purple">NC</div></div>
      </header>

      {page === "Overview" && <section className="page-content">
        <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR CREATIVE SPACE</div><h1>{role==="Author"?"A little progress goes a long way.":"Good stories need good readers."}</h1><p className="subheading">{role==="Author"?"Welcome back, Noel. Ready to spend some time with your words?":"Here’s what’s waiting on your review desk today."}</p></div><button className="primary-button" onClick={()=>setShowCreate(true)}><Plus size={17}/> New manuscript</button></div>
        <div className="stat-grid">
          <Stat icon={FileText} label="Your manuscripts" value={counts.total} note="Stories in your workspace" tint="lavender"/>
          <Stat icon={Clock3} label="Awaiting review" value={counts.review} note="Ready for thoughtful eyes" tint="peach"/>
          <Stat icon={CheckCircle2} label="Approved" value={counts.approved} note="One step closer to done" tint="mint"/>
          <Stat icon={PenLine} label="In progress" value={counts.drafts} note="Ideas still taking shape" tint="blue-tint"/>
        </div>
        <div className="section-heading"><div><h2>{role==="Author"?"Pick up where you left off":"On your review desk"}</h2><p>{role==="Author"?"Your stories, all in one place.":"Drafts that could use your perspective."}</p></div><button className="text-button" onClick={()=>setPage(role==="Editor"?"Review desk":"Manuscripts")}>View all <ArrowUpRight size={15}/></button></div>
        <div className="manuscript-grid">{(role==="Editor"?drafts.filter(d=>d.status==="In review"):drafts.filter(d=>d.author==="You"||d.author==="Mira Chen")).slice(0,3).map(d=><ManuscriptCard key={d.id} draft={d} onClick={()=>{setSelectedId(d.id);setPage("Manuscripts")}}/>)}</div>
        <div className="bottom-note"><div className="note-symbol"><BookMarked size={20}/></div><div><b>Make room for the messy first draft.</b><p>Good writing rarely arrives finished. Keep showing up, one sentence at a time.</p></div><span>✦</span></div>
      </section>}

      {page === "Manuscripts" && <section className="page-content">
        <div className="welcome-row"><div><div className="eyebrow"><BookOpen size={14}/> THE LIBRARY</div><h1>Manuscripts</h1><p className="subheading">A home for every story in progress.</p></div><button className="primary-button" onClick={()=>setShowCreate(true)}><Plus size={17}/> New manuscript</button></div>
        <div className="library-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search manuscripts..." /></div><div className="filter-box"><Filter size={16}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Draft</option><option>In review</option><option>Approved</option></select></div></div>
        <div className="library-layout"><div className="library-list">{visibleDrafts.map(d=><button key={d.id} className={"library-row "+(selectedId===d.id?"selected":"")} onClick={()=>setSelectedId(d.id)}><div className={"book-thumb "+d.genreColor}><BookOpen size={22}/></div><div className="library-meta"><b>{d.title}</b><span>{d.genre} · Updated {d.updated}</span><p>{d.excerpt}</p></div><Status status={d.status}/></button>)}{visibleDrafts.length===0&&<div className="empty-state"><BookOpen size={25}/><b>No manuscripts found</b><span>Try another search or create a new draft.</span></div>}</div>
          {selected && <div className="editor-panel"><div className="editor-top"><span className="eyebrow">MANUSCRIPT EDITOR</span><button className="icon-button small" onClick={()=>setShowDetails(!showDetails)}><PanelRightClose size={16}/></button></div><input className="title-input" value={editorTitle} onChange={e=>setEditorTitle(e.target.value)} aria-label="Manuscript title"/><div className="editor-meta"><span>{selected.genre}</span><span>·</span><span>{selected.status}</span><span className="autosave"><CircleDot size={10}/> Local draft</span></div><textarea className="manuscript-textarea" value={editorContent} onChange={e=>setEditorContent(e.target.value)} placeholder="Your story begins here..." aria-label="Manuscript content"/><div className="editor-footer"><span>{editorContent.trim()?editorContent.trim().split(/\s+/).length:0} words</span><div><button className="secondary-button" onClick={saveChanges}><Save size={15}/> Save</button>{role==="Author"?<button className="primary-button" onClick={submitReview}><Send size={15}/> Submit for review</button>:<button className="primary-button" onClick={approve}><CheckCircle2 size={15}/> Approve</button>}</div></div>
            {showDetails&&<div className="feedback-panel"><div className="feedback-heading"><MessageSquareText size={17}/><b>Editorial notes</b><span>{selected.feedback?"1 note":"No notes yet"}</span></div>{selected.feedback&&<div className="existing-feedback"><div className="avatar avatar-peach">ED</div><div><b>{role==="Editor"?"Your feedback":"Editor feedback"}</b><p>{selected.feedback}</p></div></div>}<textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder={role==="Editor"?"Share specific, constructive feedback...":"Your editor's feedback will appear here. You can also add a note..."}/><div className="feedback-actions"><button className="text-button danger" onClick={removeDraft}><Trash2 size={14}/> Delete</button><button className="secondary-button" onClick={sendFeedback}><MessageSquareText size={14}/> Save note</button></div></div>}
          </div>}
        </div>
      </section>}

      {page === "Review desk" && <section className="page-content">
        <div className="welcome-row"><div><div className="eyebrow"><MessageSquareText size={14}/> EDITORIAL WORKSPACE</div><h1>The review desk</h1><p className="subheading">Thoughtful feedback can change everything.</p></div><div className="review-pill"><span className="pulse-dot"/>{drafts.filter(d=>d.status==="In review").length} awaiting review</div></div>
        <div className="review-intro"><div className="review-intro-icon"><Feather size={22}/></div><div><b>Read generously. Respond specifically.</b><p>Look for what a story is trying to become. Help the writer take the next step.</p></div></div>
        <div className="review-list">{drafts.filter(d=>d.status==="In review").map(d=><div className="review-card" key={d.id}><div className="review-card-head"><div className={"book-thumb "+d.genreColor}><BookOpen size={21}/></div><div className="review-title"><h3>{d.title}</h3><span>By {d.author} · {d.genre}</span></div><Status status={d.status}/></div><p className="review-excerpt">{d.content.slice(0,240)}{d.content.length>240?"…":""}</p><div className="review-card-bottom"><span><Clock3 size={14}/> Updated {d.updated}</span><button className="secondary-button" onClick={()=>{setSelectedId(d.id);setPage("Manuscripts");setRole("Editor")}}><Eye size={15}/> Open review</button></div></div>)}{drafts.filter(d=>d.status==="In review").length===0&&<div className="empty-state"><CheckCircle2 size={28}/><b>All caught up</b><span>There are no manuscripts waiting for review.</span></div>}</div>
      </section>}
      <footer className="app-footer"><span>© 2026 DraftBridge</span><span>Made for stories in progress <span className="footer-star">✦</span></span><span>Thoughtfully unfinished.</span></footer>
    </main>

    {showCreate&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCreate(false)}}><form className="create-modal" onSubmit={createDraft}><div className="modal-head"><div><div className="eyebrow">START SOMETHING NEW</div><h2>A new manuscript</h2></div><button type="button" className="icon-button" onClick={()=>setShowCreate(false)}><X size={19}/></button></div><label>Working title<input autoFocus value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Give your story a name" required/></label><label>Genre<select value={newGenre} onChange={e=>setNewGenre(e.target.value)}><option>Fantasy</option><option>Literary fiction</option><option>Short story</option><option>Science fiction</option><option>Mystery</option><option>Non-fiction</option><option>Poetry</option></select></label><label>First words <span className="optional">(optional)</span><textarea value={newContent} onChange={e=>setNewContent(e.target.value)} placeholder="A sentence, a scene, or just a note to yourself..." rows="4"/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowCreate(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Create manuscript</button></div></form></div>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

function Stat({icon:Icon,label,value,note,tint}) {
  return <div className="stat-card"><div className={"stat-icon "+tint}><Icon size={18}/></div><span className="stat-label">{label}</span><strong>{value}</strong><span className="stat-note">{note}</span></div>;
}
function Status({status}) { return <span className={"status status-"+statusClass(status)}><i/>{status}</span>; }
function ManuscriptCard({draft,onClick}) {
  return <button className="manuscript-card" onClick={onClick}><div className={"cover-art "+draft.genreColor}><div className="cover-top"><span>DRAFTBRIDGE EDITIONS</span><MoreHorizontal size={17}/></div><div className="cover-illustration"><BookOpen size={36}/><span>✳</span></div><div className="cover-title">{draft.title}</div><div className="cover-bottom"><span>{draft.genre.toUpperCase()}</span><span>{initials(draft.author)}</span></div></div><div className="manuscript-card-info"><div><b>{draft.title}</b><span>{draft.genre} · {draft.updated}</span></div><Status status={draft.status}/></div><p>{draft.excerpt}</p></button>;
}

createRoot(document.getElementById("root")).render(<App/>);
