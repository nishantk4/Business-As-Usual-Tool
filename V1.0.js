import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Calendar, User, CheckCircle, XCircle, Clock, FileText, MoreVertical, Filter, Search,
  LayoutDashboard, FolderKanban, UserCircle, History, ShieldCheck, X, Settings, BarChart, Link, Type, Upload, FilterX,
  Users // Added icon for Team View
} from 'lucide-react';

// --- Constants for Page Navigation ---
const PAGES = {
  DASHBOARD: 'DASHBOARD',
  PROJECTS: 'PROJECTS',
  PROFILE: 'PROFILE',
  HISTORY: 'HISTORY',
  AUDIT: 'AUDIT',
  TEAM_VIEW: 'TEAM_VIEW',
};

// --- Date Helper Functions ---
const getStartOfDay = (date) => { const newDate = new Date(date); newDate.setHours(0, 0, 0, 0); return newDate; };
const isSameDay = (date1, date2) => (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());

// --- Mock Data ---
// Manager and Employees (Updated Employee Names)
const MANAGER_NAME = "Dave Nomad";
const EMPLOYEES = ["John Doe", "Jimmy McGill", "Shanaya Jain", "Swati Mukherjee", "Liz Elliot"]; // Updated names
const ALL_USERS = [MANAGER_NAME, ...EMPLOYEES];

// Projects
const initialProjects = [
    { id: 'proj-1', name: 'Q2 Compliance Audit Prep', description: 'Tasks related to preparing for the Q2 SOC 2 audit.' },
    { id: 'proj-2', name: 'Website Redesign Launch', description: 'Coordination for the new website launch.' },
    { id: 'proj-3', name: 'General Operations', description: 'Ongoing operational tasks.' },
    { id: 'proj-4', name: 'New Feature Rollout - Alpha', description: 'Internal testing and feedback collection.'}
];

// Tasks (Assignees will now use the updated EMPLOYEES array)
const initialTasks = [
  // Dave Nomad's Tasks
  { id: 10, projectId: 'proj-4', projectName: 'New Feature Rollout - Alpha', title: 'Review Alpha Test Plan', description: 'Final review of the testing strategy.', assignee: MANAGER_NAME, dueDate: '2025-04-15', recurrence: 'One-time', status: 'To Do', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 2 },
  { id: 11, projectId: 'proj-3', projectName: 'General Operations', title: 'Approve Expense Reports', description: 'Review and approve submitted reports.', assignee: MANAGER_NAME, dueDate: '2025-04-16', recurrence: 'Weekly', status: 'To Do', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 1.5 },

  // John Doe's Tasks (EMPLOYEES[0])
  { id: 1, projectId: 'proj-3', projectName: 'General Operations', title: 'Submit Monthly Expense Report', description: 'Compile and submit expense report...', assignee: EMPLOYEES[0], dueDate: '2025-04-30', recurrence: 'Monthly', status: 'To Do', requiresValidation: true, evidenceAttached: false, evidence: null, estimatedHours: 2 },
  { id: 8, projectId: 'proj-3', projectName: 'General Operations', title: 'Review Yesterday\'s Backup Logs', description: 'Check backup completion status.', assignee: EMPLOYEES[0], dueDate: '2025-04-15', recurrence: 'Daily', status: 'To Do', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 0.5 },
  { id: 4, projectId: 'proj-1', projectName: 'Q2 Compliance Audit Prep', title: 'Update Compliance Documentation', description: 'Review and update SOC 2 docs...', assignee: EMPLOYEES[0], dueDate: '2025-05-15', recurrence: 'Quarterly', status: 'Approved', requiresValidation: true, evidenceAttached: true, evidence: { notes: 'Doc updated...', fileName: '', link: '...' }, estimatedHours: 8 },

  // Jimmy McGill's Tasks (EMPLOYEES[1])
  { id: 2, projectId: 'proj-2', projectName: 'Website Redesign Launch', title: 'Weekly Team Sync Notes', description: 'Prepare and distribute notes...', assignee: EMPLOYEES[1], dueDate: '2025-04-18', recurrence: 'Weekly', status: 'In Progress', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 1 },
  { id: 12, projectId: 'proj-2', projectName: 'Website Redesign Launch', title: 'Coordinate Content Migration', description: 'Track progress of content migration.', assignee: EMPLOYEES[1], dueDate: '2025-04-22', recurrence: 'One-time', status: 'To Do', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 6 },

  // Shanaya Jain's Tasks (EMPLOYEES[2])
  { id: 3, projectId: 'proj-3', projectName: 'General Operations', title: 'Daily Server Health Check', description: 'Perform routine health checks...', assignee: EMPLOYEES[2], dueDate: '2025-04-14', recurrence: 'Daily', status: 'Pending Validation', requiresValidation: true, evidenceAttached: true, evidence: { notes: 'Server health nominal...', fileName: 'server_log_0414.txt', link: '' }, estimatedHours: 0.5 },
  { id: 5, projectId: 'proj-3', projectName: 'General Operations', title: 'Onboard New Hire - IT Setup', description: 'Complete IT setup checklist...', assignee: EMPLOYEES[2], dueDate: '2025-04-10', recurrence: 'One-time', status: 'To Do', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 4 }, // Overdue

  // Swati Mukherjee's Tasks (EMPLOYEES[3])
  { id: 7, projectId: 'proj-2', projectName: 'Website Redesign Launch', title: 'Test Contact Form', description: 'Perform end-to-end testing...', assignee: EMPLOYEES[3], dueDate: '2025-04-19', recurrence: 'One-time', status: 'In Progress', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 2 },
  { id: 13, projectId: 'proj-4', projectName: 'New Feature Rollout - Alpha', title: 'Prepare User Feedback Survey', description: 'Draft survey questions for alpha testers.', assignee: EMPLOYEES[3], dueDate: '2025-04-21', recurrence: 'One-time', status: 'To Do', requiresValidation: false, evidenceAttached: false, evidence: null, estimatedHours: 3 },

   // Liz Elliot's Tasks (EMPLOYEES[4])
  { id: 6, projectId: 'proj-1', projectName: 'Q2 Compliance Audit Prep', title: 'Review Access Logs', description: 'Perform monthly review...', assignee: EMPLOYEES[4], dueDate: '2025-04-25', recurrence: 'Monthly', status: 'To Do', requiresValidation: true, evidenceAttached: false, evidence: null, estimatedHours: 3 },
  { id: 14, projectId: 'proj-1', projectName: 'Q2 Compliance Audit Prep', title: 'Gather Firewall Configs', description: 'Collect current firewall configurations for audit.', assignee: EMPLOYEES[4], dueDate: '2025-04-28', recurrence: 'One-time', status: 'To Do', requiresValidation: true, evidenceAttached: false, evidence: null, estimatedHours: 4 },
];

// Mock Current User Data (Updated to Dave Nomad)
const MOCK_CURRENT_USER = { name: MANAGER_NAME, email: 'dave.nomad@example.com', role: 'Manager', department: 'Technology', manager: 'Director Name', joinDate: '2020-05-10', avatar: 'https://placehold.co/80x80/0d9488/ffffff?text=DN' };


// --- UI Components (Mimicking shadcn/ui structure) ---
const Button = ({ children, variant = 'default', size = 'default', className = '', disabled = false, ...props }) => { const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"; const variants = { default: "bg-primary text-primary-foreground hover:bg-primary/90", destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90", outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", ghost: "hover:bg-accent hover:text-accent-foreground", link: "text-primary underline-offset-4 hover:underline", }; const sizes = { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-11 rounded-md px-8", icon: "h-10 w-10", }; return (<button disabled={disabled} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>); };
const Card = ({ children, className = '', ...props }) => (<div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>{children}</div>);
const CardHeader = ({ children, className = '', ...props }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>;
const CardTitle = ({ children, className = '', ...props }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>;
const CardDescription = ({ children, className = '', ...props }) => <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>;
const CardContent = ({ children, className = '', ...props }) => <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>;
const CardFooter = ({ children, className = '', ...props }) => <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>{children}</div>;
const Input = ({ className = '', type = 'text', ...props }) => (<input type={type} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />);
const Textarea = ({ className = '', ...props }) => (<textarea className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />);
const Select = ({ children, className = '', disabled = false, ...props }) => (<select disabled={disabled} className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</select>);
const SelectValue = ({ placeholder }) => <option value="" disabled>{placeholder}</option>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
const Modal = ({ children, open, onClose, title, className = '' }) => { if (!open) return null; return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}><div className={`relative m-4 bg-card rounded-lg shadow-xl w-full max-w-2xl ${className}`} onClick={(e) => e.stopPropagation()}><Card><CardHeader className="flex flex-row items-center justify-between border-b"><CardTitle>{title}</CardTitle><Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X size={20} /></Button></CardHeader>{children}</Card></div></div>); };


// --- Application Components ---

// Sidebar Navigation
function Sidebar({ currentPage, onNavigate }) {
    const navItems = [ { page: PAGES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard }, { page: PAGES.PROJECTS, label: 'Projects', icon: FolderKanban }, { page: PAGES.TEAM_VIEW, label: 'Team View', icon: Users }, { page: PAGES.HISTORY, label: 'History', icon: History }, { page: PAGES.AUDIT, label: 'Audit Log', icon: ShieldCheck }, { page: PAGES.PROFILE, label: 'Profile', icon: UserCircle }, ];
    return (<div className="w-64 min-h-screen bg-gray-800 text-gray-100 p-4 flex flex-col"><h2 className="text-2xl font-semibold mb-6 text-white">Task Pilot</h2><nav className="flex-grow"><ul>{navItems.map(item => (<li key={item.page} className="mb-2"><button onClick={() => onNavigate({ page: item.page })} className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${ currentPage === item.page ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white' }`}><item.icon size={18} className="mr-3" />{item.label}</button></li>))}</ul></nav><div className="mt-auto"><button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 ease-in-out"><Settings size={18} className="mr-3" />Settings</button></div></div>);
}


// Task List Item Card
function TaskListItemCard({ task, onClick }) {
    const getStatusColorClasses = (status, isOverdue) => { if (isOverdue) return 'border-red-200 bg-red-50 text-red-800'; switch (status) { case 'To Do': return 'border-blue-200 bg-blue-50 text-blue-800'; case 'In Progress': return 'border-yellow-200 bg-yellow-50 text-yellow-800'; case 'Pending Validation': return 'border-purple-200 bg-purple-50 text-purple-800'; case 'Approved': return 'border-green-200 bg-green-50 text-green-800'; case 'Rejected': return 'border-gray-200 bg-gray-50 text-gray-600'; default: return 'border-gray-200 bg-gray-50 text-gray-600'; } };
    const isOverdue = task.status !== 'Approved' && task.status !== 'Rejected' && getStartOfDay(new Date()) > getStartOfDay(new Date(task.dueDate));
    const statusColorClasses = getStatusColorClasses(task.status, isOverdue);
    return (<div className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:shadow-sm transition-shadow duration-150 ${statusColorClasses}`} onClick={() => onClick(task)}><div className="flex-1 overflow-hidden"><p className="text-sm font-medium truncate text-gray-900">{task.title}</p><p className="text-xs text-muted-foreground truncate">{task.projectName || 'No Project'}</p></div><div className="flex items-center gap-3 ml-4 text-xs whitespace-nowrap"><span className="hidden sm:inline-flex items-center gap-1 text-muted-foreground"><User size={12} /> {task.assignee}</span><span className="inline-flex items-center gap-1 text-muted-foreground"><Calendar size={12} /> {task.dueDate}</span><span className={`px-2 py-0.5 rounded-full font-medium ${statusColorClasses}`}>{isOverdue ? 'Overdue' : task.status}</span></div></div>);
}


// --- Evidence Modals ---
function AddEvidenceModal({ task, open, onClose, onSubmitEvidence }) { const [notes, setNotes] = useState(''); const [link, setLink] = useState(''); const [fileName, setFileName] = useState(''); useEffect(() => { if (open) { setNotes(''); setLink(''); setFileName(''); } }, [open]); const handleFileChange = (event) => { setFileName(event.target.files && event.target.files[0] ? event.target.files[0].name : ''); }; const handleSubmit = () => { if (!notes && !fileName && !link) { alert("Please add notes, upload a file, or provide a link."); return; } const evidenceData = { notes, fileName, link }; onSubmitEvidence(task.id, evidenceData); onClose(); }; if (!open || !task) return null; return (<Modal open={open} onClose={onClose} title={`Add Evidence for: ${task.title}`}><CardContent className="pt-4 space-y-4"><div><label htmlFor="evidence-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label><Textarea id="evidence-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any relevant notes..." rows={3}/></div><div><label htmlFor="evidence-file" className="block text-sm font-medium text-gray-700 mb-1">Upload File (Simulated)</label><div className="flex items-center gap-2"><Input id="evidence-file" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>{fileName && <span className="text-sm text-muted-foreground truncate">{fileName}</span>}</div><p className="text-xs text-muted-foreground mt-1">This is a simulation. The file itself is not uploaded.</p></div><div><label htmlFor="evidence-link" className="block text-sm font-medium text-gray-700 mb-1">Link</label><Input id="evidence-link" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://example.com/evidence"/></div></CardContent><CardFooter className="border-t pt-4 flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Submit Evidence</Button></CardFooter></Modal>); }
function ViewEvidenceModal({ task, open, onClose }) { if (!open || !task || !task.evidence) return null; const { notes, fileName, link } = task.evidence; return (<Modal open={open} onClose={onClose} title={`View Evidence for: ${task.title}`}><CardContent className="pt-4 space-y-4 text-sm">{notes && (<div><h4 className="font-semibold mb-1 flex items-center gap-1"><Type size={16}/> Notes:</h4><p className="p-2 bg-gray-50 rounded border text-muted-foreground whitespace-pre-wrap">{notes}</p></div>)}{fileName && (<div><h4 className="font-semibold mb-1 flex items-center gap-1"><Upload size={16}/> File (Simulated):</h4><p className="p-2 bg-gray-50 rounded border text-muted-foreground">{fileName}</p></div>)}{link && (<div><h4 className="font-semibold mb-1 flex items-center gap-1"><Link size={16}/> Link:</h4><a href={link} target="_blank" rel="noopener noreferrer" className="p-2 block bg-gray-50 rounded border text-primary hover:underline truncate">{link}</a></div>)}{!notes && !fileName && !link && (<p className="text-muted-foreground text-center py-4">No evidence details were submitted for this task.</p>)}</CardContent><CardFooter className="border-t pt-4 flex justify-end"><Button variant="outline" onClick={onClose}>Close</Button></CardFooter></Modal>); }


// Task Detail Modal (Inline reject reason)
function TaskDetailModal({ task, open, onClose, onUpdateStatus, onToggleEvidence, onSubmitEvidence }) { const [actionFeedback, setActionFeedback] = useState(''); const [isProcessing, setIsProcessing] = useState(false); const [showRejectInput, setShowRejectInput] = useState(false); const [rejectReason, setRejectReason] = useState(''); useEffect(() => { setActionFeedback(''); setIsProcessing(false); setShowRejectInput(false); setRejectReason(''); }, [open, task]); const showFeedback = (message) => { setActionFeedback(message); setIsProcessing(true); setTimeout(() => { setActionFeedback(''); setIsProcessing(false); }, 2000); }; if (!task) return null; const isOverdue = task.status !== 'Approved' && task.status !== 'Rejected' && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0); const handleStartProgress = () => { onUpdateStatus(task.id, 'In Progress'); showFeedback('Status updated to In Progress'); }; const handleAddEvidenceClick = () => { onClose(); onToggleEvidence(task.id, 'openAddModal'); }; const handleViewEvidenceClick = () => { onClose(); onToggleEvidence(task.id, 'openViewModal'); }; const handleRejectClick = () => { setShowRejectInput(true); }; const handleCancelReject = () => { setShowRejectInput(false); setRejectReason(''); }; const handleConfirmReject = () => { if (!rejectReason.trim()) { alert("Please provide a reason for rejection."); return; } console.log(`Task ${task.id} rejected. Reason: ${rejectReason}`); onUpdateStatus(task.id, 'Rejected'); showFeedback('Status updated to Rejected'); setShowRejectInput(false); setRejectReason(''); }; const handleApprove = () => { onUpdateStatus(task.id, 'Approved'); showFeedback('Status updated to Approved'); }; return (<Modal open={open} onClose={onClose} title={task.title}><CardContent className="pt-4 space-y-4">{actionFeedback && (<div className="p-2 mb-3 text-sm text-center bg-green-100 text-green-800 rounded-md transition-opacity duration-300">{actionFeedback}</div>)}<p className="text-sm text-muted-foreground">{task.description}</p><div className="grid grid-cols-2 gap-4 text-sm"><div><strong>Project:</strong> {task.projectName || 'N/A'}</div><div><strong>Assignee:</strong> {task.assignee}</div><div><strong>Due Date:</strong> {task.dueDate} {isOverdue && <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-red-800 bg-red-100 rounded-full">OVERDUE</span>}</div><div><strong>Recurrence:</strong> {task.recurrence}</div><div><strong>Status:</strong> {task.status}</div><div><strong>Requires Validation:</strong> {task.requiresValidation ? 'Yes' : 'No'}</div><div><strong>Evidence Attached:</strong> {task.evidenceAttached ? 'Yes' : 'No'}</div><div><strong>Est. Hours:</strong> {task.estimatedHours ?? 'N/A'}</div></div><div className="border-t pt-4 space-y-3">{showRejectInput && (<div className="p-3 border bg-red-50 border-red-200 rounded-md space-y-2"><label htmlFor="reject-reason" className="block text-sm font-medium text-red-800">Reason for Rejection *</label><Textarea id="reject-reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Provide details..." rows={2} className="border-red-300 focus:ring-red-500"/><div className="flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={handleCancelReject} disabled={isProcessing}>Cancel</Button><Button variant="destructive" size="sm" onClick={handleConfirmReject} disabled={isProcessing || !rejectReason.trim()}>Confirm Reject</Button></div></div>)}{!showRejectInput && (<div className="flex flex-wrap justify-end gap-2">{task.status === 'To Do' && <Button size="sm" onClick={handleStartProgress} disabled={isProcessing}>Start Progress</Button>}{task.status === 'In Progress' && !task.evidenceAttached && <Button size="sm" onClick={handleAddEvidenceClick} disabled={isProcessing}>Add Evidence</Button>}{task.evidenceAttached && <Button size="sm" variant="outline" onClick={handleViewEvidenceClick} disabled={isProcessing}>View Evidence</Button>}{task.status === 'Pending Validation' && (<><Button size="sm" variant="destructive" onClick={handleRejectClick} disabled={isProcessing}>Reject</Button><Button size="sm" onClick={handleApprove} disabled={isProcessing}>Approve</Button></>)}<Button size="sm" variant="outline" onClick={onClose} disabled={isProcessing}>Close</Button></div>)}</div></CardContent></Modal>); }


// Add Task Form (Added estimatedHours)
function AddTaskForm({ projects, onAddTask, onCancel, projectFilterId }) { const [title, setTitle] = React.useState(''); const [description, setDescription] = React.useState(''); const [assignee, setAssignee] = React.useState(''); const [dueDate, setDueDate] = React.useState(''); const [recurrence, setRecurrence] = React.useState('One-time'); const [requiresValidation, setRequiresValidation] = React.useState(false); const [selectedProjectId, setSelectedProjectId] = React.useState(projectFilterId || ''); const [estimatedHours, setEstimatedHours] = React.useState(''); useEffect(() => { setSelectedProjectId(projectFilterId || ''); }, [projectFilterId]); const handleSubmit = (e) => { e.preventDefault(); if (!title || !assignee || !dueDate || !selectedProjectId) { alert('Please fill in Title, Assignee, Due Date, and select a Project.'); return; } const selectedProject = projects.find(p => p.id === selectedProjectId); const hours = parseFloat(estimatedHours) || 0; const newTask = { id: Date.now(), projectId: selectedProjectId, projectName: selectedProject ? selectedProject.name : 'Unknown Project', title, description, assignee, dueDate, recurrence, status: 'To Do', requiresValidation, evidenceAttached: false, evidence: null, estimatedHours: hours }; onAddTask(newTask); setTitle(''); setDescription(''); setAssignee(''); setDueDate(''); setRecurrence('One-time'); setRequiresValidation(false); setSelectedProjectId(projectFilterId || ''); setEstimatedHours(''); }; return (<Card className="mb-6 border border-primary/50"><CardHeader><CardTitle>Add New Task</CardTitle></CardHeader><CardContent><form onSubmit={handleSubmit} className="space-y-4"><div><label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Project *</label><Select id="project" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} required disabled={!!projectFilterId}><SelectValue placeholder="Select a project..." />{projects.map(proj => (<SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>))}</Select>{projectFilterId && <p className="text-xs text-muted-foreground mt-1">Project selected based on current filter.</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Submit Monthly Report" required /></div><div><label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">Assignee *</label>{/* In real app, use searchable dropdown of users */} <Input id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="e.g., John Doe" required /></div></div><div><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label><Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add more details..." /></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label><Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required /></div><div><label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label><Select id="recurrence" value={recurrence} onChange={(e) => setRecurrence(e.target.value)}><SelectItem value="One-time">One-time</SelectItem><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Quarterly">Quarterly</SelectItem><SelectItem value="Yearly">Yearly</SelectItem></Select></div><div><label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Est. Hours</label><Input id="estimatedHours" type="number" step="0.5" min="0" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} placeholder="e.g., 4" /></div></div><div className="flex items-center space-x-2 pt-2"><input type="checkbox" id="requiresValidation" checked={requiresValidation} onChange={(e) => setRequiresValidation(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/><label htmlFor="requiresValidation" className="text-sm font-medium text-gray-700">Requires Validation/Approval</label></div><div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit"><PlusCircle size={16} className="mr-2" /> Add Task</Button></div></form></CardContent></Card>); }


// --- Page Components ---

// Dashboard Page (Refactored for List Views)
function DashboardPage({ tasks, projects, projectFilterId, onAddTaskRequest, onTaskClick, onUpdateStatus, onToggleEvidence, onSubmitEvidence, onClearProjectFilter }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showAddTaskForm, setShowAddTaskForm] = React.useState(false);
    const [selectedTaskForDetailModal, setSelectedTaskForDetailModal] = React.useState(null);
    const [taskForAddEvidenceModal, setTaskForAddEvidenceModal] = React.useState(null);
    const [taskForViewEvidenceModal, setTaskForViewEvidenceModal] = React.useState(null);

    const filteredProjectName = projectFilterId ? projects.find(p => p.id === projectFilterId)?.name : null;

    // --- Task Filtering and Grouping ---
    const today = getStartOfDay(new Date());
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date(today); endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // End of current Sunday

    const projectFilteredTasks = projectFilterId ? tasks.filter(task => task.projectId === projectFilterId) : tasks;
    const searchFilteredTasks = projectFilteredTasks.filter(task => { if (!searchTerm) return true; return ( task.title.toLowerCase().includes(searchTerm.toLowerCase()) || (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) || task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) || task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ); });

    const groupedTasks = React.useMemo(() => {
        if (projectFilterId) return null;
        const overdue = []; const todayTasks = []; const tomorrowTasks = []; const thisWeekTasks = []; const upcomingTasks = [];
        searchFilteredTasks.forEach(task => { if (task.status === 'Approved' || task.status === 'Rejected') return; const dueDate = getStartOfDay(new Date(task.dueDate)); if (dueDate < today) { overdue.push(task); } else if (isSameDay(dueDate, today)) { todayTasks.push(task); } else if (isSameDay(dueDate, tomorrow)) { tomorrowTasks.push(task); } else if (dueDate <= endOfWeek) { thisWeekTasks.push(task); } else { upcomingTasks.push(task); } });
        const sortByDueDate = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
        return { overdue: overdue.sort(sortByDueDate), today: todayTasks.sort(sortByDueDate), tomorrow: tomorrowTasks.sort(sortByDueDate), thisWeek: thisWeekTasks.sort(sortByDueDate), upcoming: upcomingTasks.sort(sortByDueDate), };
    }, [searchFilteredTasks, projectFilterId, today, tomorrow, endOfWeek]);
    // --- End Task Filtering and Grouping ---

    const handleAddTask = (newTask) => { onAddTaskRequest(newTask); setShowAddTaskForm(false); };
    const handleCardClick = (task) => { setSelectedTaskForDetailModal(task); onTaskClick(task); };
    const handleCloseDetailModal = () => { setSelectedTaskForDetailModal(null); };
    const handleEvidenceAction = (taskId, action) => { const task = tasks.find(t => t.id === taskId); if (!task) return; if (action === 'openAddModal') { setTaskForAddEvidenceModal(task); } else if (action === 'openViewModal') { setTaskForViewEvidenceModal(task); } };
    const handleCloseAddEvidenceModal = () => { setTaskForAddEvidenceModal(null); };
    const handleCloseViewEvidenceModal = () => { setTaskForViewEvidenceModal(null); };
    const handleEvidenceSubmit = (taskId, evidenceData) => { onSubmitEvidence(taskId, evidenceData); };

    // Consistent Section Header Style
    const renderTaskListSection = (title, taskArray) => { if (!taskArray || taskArray.length === 0) return null; return (<div className="mb-6"><h2 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">{title}</h2><div className="space-y-2">{taskArray.map(task => (<TaskListItemCard key={task.id} task={task} onClick={handleCardClick} />))}</div></div>); };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    {filteredProjectName ? `Project Tasks: ${filteredProjectName}` : 'My Dashboard'}
                </h1>
                <Button onClick={() => setShowAddTaskForm(!showAddTaskForm)} variant={showAddTaskForm ? 'outline' : 'default'}>
                    <PlusCircle size={16} className="mr-2" /> {showAddTaskForm ? 'Cancel' : 'Add New Task'}
                </Button>
            </div>

            {/* Add Task Form (Conditional) */}
            {showAddTaskForm && <AddTaskForm projects={projects} onAddTask={handleAddTask} onCancel={() => setShowAddTaskForm(false)} projectFilterId={projectFilterId} />}

            {/* Filter Controls */}
            <Card>
                <CardContent className="p-4"> {/* Use CardContent for padding */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Project Filter Indicator/Clear */}
                        {filteredProjectName && (
                            <div className="w-full md:w-auto p-2 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center flex-grow">
                                <p className="text-sm text-blue-800">
                                    Filtered by: <span className="font-semibold">{filteredProjectName}</span>
                                </p>
                                <Button variant="ghost" size="sm" onClick={onClearProjectFilter} className="text-blue-600 hover:text-blue-800 h-auto px-2 py-1">
                                    <FilterX size={14} className="mr-1" /> Clear
                                </Button>
                            </div>
                        )}
                        {/* Search Input */}
                        <div className="relative w-full md:w-1/3 flex-shrink-0">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                        </div>
                        {/* General Filter Button */}
                        <Button variant="outline" className="w-full md:w-auto flex-shrink-0">
                            <Filter size={16} className="mr-2" /> Filter Tasks
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Task Display Area */}
            <div>
                {projectFilterId ? (
                    // Project Filtered View: Simple List
                    <div className="space-y-2">
                        {searchFilteredTasks.length > 0 ? (
                            searchFilteredTasks.map(task => (<TaskListItemCard key={task.id} task={task} onClick={handleCardClick} />))
                        ) : (
                             <div className="text-center text-muted-foreground py-8"><p>No tasks found for this project matching your criteria.</p></div>
                        )}
                    </div>
                ) : (
                    // Default View: Calendar List Grouping
                    groupedTasks ? (
                        <>
                            {renderTaskListSection("Overdue", groupedTasks.overdue)}
                            {renderTaskListSection("Due Today", groupedTasks.today)}
                            {renderTaskListSection("Due Tomorrow", groupedTasks.tomorrow)}
                            {renderTaskListSection("Due This Week", groupedTasks.thisWeek)}
                            {renderTaskListSection("Upcoming", groupedTasks.upcoming)}
                            {(groupedTasks.overdue.length === 0 && groupedTasks.today.length === 0 && groupedTasks.tomorrow.length === 0 && groupedTasks.thisWeek.length === 0 && groupedTasks.upcoming.length === 0) && (
                                 <div className="text-center text-muted-foreground py-8"><p>No active tasks found matching your criteria.</p></div>
                            )}
                        </>
                    ) : (
                         <div className="text-center text-muted-foreground py-8"><p>Loading tasks...</p></div>
                    )
                )}
            </div>

            {/* Modals */}
            <TaskDetailModal task={selectedTaskForDetailModal} open={!!selectedTaskForDetailModal} onClose={handleCloseDetailModal} onUpdateStatus={onUpdateStatus} onToggleEvidence={handleEvidenceAction} onSubmitEvidence={handleEvidenceSubmit}/>
            <AddEvidenceModal task={taskForAddEvidenceModal} open={!!taskForAddEvidenceModal} onClose={handleCloseAddEvidenceModal} onSubmitEvidence={handleEvidenceSubmit}/>
            <ViewEvidenceModal task={taskForViewEvidenceModal} open={!!taskForViewEvidenceModal} onClose={handleCloseViewEvidenceModal}/>
        </div>
    );
}

// Projects Page (Themed and Clickable)
function ProjectsPage({ projects, onProjectSelect }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-2"> {/* Reduced margin-bottom */}
                 <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                 <Button><PlusCircle size={16} className="mr-2" /> Add Project</Button>
            </div>
            {/* Removed extra filter card for cleaner look */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> {/* Adjusted gap */}
                {projects.map(proj => (
                     <Card key={proj.id} className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 flex flex-col h-full" onClick={() => onProjectSelect(proj.id)}> {/* Ensure full height */}
                        <CardHeader className="pb-3"> {/* Reduced padding */}
                            <CardTitle className="text-base">{proj.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow pt-0"> {/* Ensure content grows, remove top padding */}
                            <p className="text-sm text-muted-foreground line-clamp-3">{proj.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}


// Profile Page (Hours estimate)
function ProfilePage({ user, tasks }) {
    const [workloadHours, setWorkloadHours] = useState(0);
    useEffect(() => { if (user && tasks) { const assignedActiveTasks = tasks.filter(task => task.assignee === user.name && (task.status === 'To Do' || task.status === 'In Progress')); const totalHours = assignedActiveTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0); setWorkloadHours(totalHours); } }, [user, tasks]);
    if (!user) return <p>Loading profile...</p>;
    return (<div className="space-y-6"><h1 className="text-2xl font-bold text-gray-800">Profile</h1><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><Card className="lg:col-span-2"><CardHeader><CardTitle>User Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex flex-col sm:flex-row items-center gap-4"><img src={user.avatar} alt="User Avatar" className="rounded-full w-20 h-20 border" /><div className="text-center sm:text-left"><p className="text-xl font-semibold">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p><p className="text-sm text-muted-foreground">Role: {user.role}</p></div></div><div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm"><div><strong>Department:</strong> {user.department}</div><div><strong>Manager:</strong> {user.manager}</div><div><strong>Joined Date:</strong> {user.joinDate}</div></div><Button variant="outline" size="sm">Edit Profile</Button></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart size={20}/> Current Workload</CardTitle><CardDescription>Based on estimated hours of active tasks.</CardDescription></CardHeader><CardContent className="text-center space-y-2"><p className="text-4xl font-bold">{workloadHours.toFixed(1)}</p><p className="text-sm text-muted-foreground">Estimated Active Hours</p></CardContent><CardFooter><Button variant="link" size="sm" className="mx-auto">View My Tasks</Button></CardFooter></Card><Card className="lg:col-span-3"><CardHeader><CardTitle>Preferences</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Notification settings, theme choices, and other user preferences would go here.</p><div className="mt-4 space-y-2"><div className="flex items-center justify-between"><label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</label><input type="checkbox" id="emailNotifications" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/></div><div className="flex items-center justify-between"><label htmlFor="darkMode" className="text-sm font-medium">Dark Mode</label><input type="checkbox" id="darkMode" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/></div></div></CardContent></Card></div></div>);
}


// History Page
function HistoryPage() {
    return (<div className="space-y-6"><h1 className="text-2xl font-bold text-gray-800">Task History</h1><Card><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">A list or timeline of completed tasks, status changes, etc., would appear here, likely fetched from an API.</p><div className="border-t mt-4 pt-4 text-sm"><p><span className="font-semibold">Submit Monthly Expense Report</span> marked as <span className="text-green-600">Approved</span> by Manager Name.</p><p className="text-xs text-muted-foreground">April 14, 2025, 10:30 AM</p></div><div className="border-t mt-4 pt-4 text-sm"><p><span className="font-semibold">Daily Server Health Check</span> submitted for validation by Charlie.</p><p className="text-xs text-muted-foreground">April 14, 2025, 9:05 AM</p></div></CardContent></Card></div>);
}


// Audit Page
function AuditPage() {
    return (<div className="space-y-6"><h1 className="text-2xl font-bold text-gray-800">Audit Log</h1><Card><CardHeader><CardTitle>System Activity Log</CardTitle><CardDescription>Detailed record of actions performed within the system (requires admin/auditor privileges).</CardDescription></CardHeader><CardContent><p className="text-muted-foreground">A detailed, searchable log of system events (task creation, updates, deletions, evidence uploads, approvals, user logins, permission changes, etc.) would be displayed here.</p><div className="border-t mt-4 pt-4 text-sm font-mono"><p>[2025-04-14 10:30:15] [User: manager@example.com] Approved Task ID: 4 (Update Compliance Documentation)</p><p>[2025-04-14 09:05:00] [User: charlie@example.com] Updated Task ID: 3 (Daily Server Health Check) - Status: Pending Validation, Evidence Attached: true</p><p>[2025-04-13 15:20:00] [User: admin@example.com] Created Project ID: proj-3 (General Operations)</p></div></CardContent></Card></div>);
}

// Team View Page (Placeholder - Updated employee list)
function TeamViewPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Team View</h1>
            <Card>
                 <CardHeader>
                    <CardTitle>Team Activity & Tasks</CardTitle>
                    <CardDescription>View tasks assigned to your team members or direct reports (requires appropriate permissions).</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section would display:</p>
                    {/* Updated list of employees */}
                    <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1">
                        <li>A list of team members/reportees (e.g., {EMPLOYEES.join(', ')}).</li>
                        <li>Ability to select a member to view their assigned tasks.</li>
                        <li>Summary statistics (e.g., completion rates, overdue tasks per member).</li>
                        <li>Filters for date ranges, task status, etc.</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">Implementation requires backend integration for user relationships and permissions.</p>
                </CardContent>
            </Card>
        </div>
    );
}


// Main Application Component (Routing updated)
function App() {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [projects, setProjects] = React.useState(initialProjects);
  const [currentPage, setCurrentPage] = React.useState(PAGES.DASHBOARD);
  const [projectFilterId, setProjectFilterId] = React.useState(null);

  // --- State Update Handlers ---
  const handleUpdateTaskStatus = (taskId, newStatus) => { setTasks(currentTasks => currentTasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task)); };
  const handleToggleEvidence = (taskId, action) => { console.log("Evidence action requested:", taskId, action); };
  const handleEvidenceSubmit = (taskId, evidenceData) => { setTasks(currentTasks => currentTasks.map(task => { if (task.id === taskId) { const updatedTask = { ...task, evidence: evidenceData, evidenceAttached: true }; if (updatedTask.requiresValidation && updatedTask.status === 'In Progress') { updatedTask.status = 'Pending Validation'; } else if (!updatedTask.requiresValidation && updatedTask.status === 'In Progress') { updatedTask.status = 'Completed'; } return updatedTask; } return task; })); };
  const handleAddTask = (newTask) => { setTasks([newTask, ...tasks]); setCurrentPage(PAGES.DASHBOARD); setProjectFilterId(null); };
  // --- End State Update Handlers ---

  // Navigation handler
  const handleNavigate = (navigationTarget) => { const { page, filter } = navigationTarget; setCurrentPage(page); if (page === PAGES.DASHBOARD) { if (filter?.projectId) { setProjectFilterId(filter.projectId); } else if (filter?.clear) { setProjectFilterId(null); } } else { setProjectFilterId(null); } };
  const handleProjectSelect = (projectId) => { handleNavigate({ page: PAGES.DASHBOARD, filter: { projectId: projectId } }); };
  const handleClearProjectFilter = () => { handleNavigate({ page: PAGES.DASHBOARD, filter: { clear: true } }); };
  const handleTaskClick = (task) => { console.log("Task clicked in App:", task); };


  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.DASHBOARD:
        return <DashboardPage tasks={tasks} projects={projects} projectFilterId={projectFilterId} onAddTaskRequest={handleAddTask} onTaskClick={handleTaskClick} onUpdateStatus={handleUpdateTaskStatus} onToggleEvidence={handleToggleEvidence} onSubmitEvidence={handleEvidenceSubmit} onClearProjectFilter={handleClearProjectFilter} />;
      case PAGES.PROJECTS:
        return <ProjectsPage projects={projects} onProjectSelect={handleProjectSelect}/>;
      case PAGES.PROFILE:
        return <ProfilePage user={MOCK_CURRENT_USER} tasks={tasks} />;
      case PAGES.HISTORY:
        return <HistoryPage />;
      case PAGES.AUDIT:
        return <AuditPage />;
      case PAGES.TEAM_VIEW:
        return <TeamViewPage />;
      default:
        return <DashboardPage tasks={tasks} projects={projects} projectFilterId={projectFilterId} onAddTaskRequest={handleAddTask} onTaskClick={handleTaskClick} onUpdateStatus={handleUpdateTaskStatus} onToggleEvidence={handleToggleEvidence} onSubmitEvidence={handleEvidenceSubmit} onClearProjectFilter={handleClearProjectFilter}/>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

