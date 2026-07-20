import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Brain, CalendarClock, ChevronRight, Flame, Route, Target } from "lucide-react";
import { subjects } from "../data/subjects";
import { readLearnerState } from "../utils/learnerState";

const paths = [
  { name: "Beginner Python", detail: "Variables → control flow → functions", color: "#6ef2a2", to: "/python" },
  { name: "Core DSA", detail: "Arrays → linked lists → trees", color: "#54e2ff", to: "/dsa" },
  { name: "Interview sprint", detail: "Patterns, complexity, deliberate practice", color: "#ffcf70", to: "/interview" },
];

const Dashboard = () => {
  const [state, setState] = useState(readLearnerState);
  useEffect(() => { const refresh = () => setState(readLearnerState()); window.addEventListener("learner-state-changed", refresh); return () => window.removeEventListener("learner-state-changed", refresh); }, []);
  const lessons = useMemo(() => subjects.flatMap(subject => subject.topics.flatMap(topic => topic.sections.map(section => ({ id: `${subject.id}/${topic.id}/${section.id}`, title: section.title, subject: subject.title, to: `/${subject.id}/topic/${topic.id}/${section.id}` })))), []);
  const completed = Object.values(state).filter(item => item.status === "understood").length;
  const learning = Object.values(state).filter(item => item.status === "learning").length;
  const due = lessons.filter(lesson => {
    const item = state[lesson.id];
    return item?.nextReviewAt && new Date(item.nextReviewAt) <= new Date();
  }).slice(0, 4);
  const resume = lessons.find(lesson => state[lesson.id]?.status === "learning") || lessons.find(l => l.id.includes("python"));
  const progress = Math.min(100, Math.round((completed / Math.max(lessons.length, 1)) * 100));
  return <div className="dashboard">
    <section className="dash-hero"><div><div className="eyebrow">Your learning system</div><h1>Study with a <span>next step.</span></h1><p>Understand, trace, implement, then bring the concept back before you forget it.</p></div><div className="streak"><Flame size={24}/><strong>Start your streak</strong><small>One focused lesson today</small></div></section>
    <section className="dash-stats" aria-label="Learning statistics"><div><BookOpen/><b>{completed}</b><span>lessons understood</span></div><div><Brain/><b>{learning}</b><span>currently learning</span></div><div><Target/><b>{progress}%</b><span>library progress</span></div></section>
    <section className="dash-grid"><article className="panel featured"><div className="eyebrow">Continue learning</div><h2>{resume?.title || "Choose a first lesson"}</h2><p>{resume ? "Pick up where you left off, then mark your confidence." : "Begin with a foundation lesson and build momentum."}</p>{resume && <Link className="primary-link" to={resume.to}>Open lesson <ChevronRight size={16}/></Link>}</article><article className="panel"><div className="panel-title"><CalendarClock size={18}/> Due for review</div>{due.length ? due.map(item => <Link className="queue-item" to={item.to} key={item.id}><span><b>{item.title}</b><small>{item.subject}</small></span><ChevronRight size={16}/></Link>) : <p className="empty">Mark a lesson as learning or lower your confidence to build your review queue.</p>}</article></section>
    <section className="paths"><div className="section-label"><Route size={18}/> Learning paths</div><div className="path-grid">{paths.map(path => <Link to={path.to} className="path-card" key={path.name} style={{ "--path": path.color }}><span>Guided route</span><h3>{path.name}</h3><p>{path.detail}</p><ChevronRight size={18}/></Link>)}</div></section>
    <section className="panel lesson-contract"><div><div className="eyebrow">The lesson contract</div><h2>Every concept has a finish line.</h2></div><div className="contract-steps"><span>Understand</span><span>Trace</span><span>Code</span><span>Practise</span><span>Recall</span></div></section>
  </div>;
};
export default Dashboard;
