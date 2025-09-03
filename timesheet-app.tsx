import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  Users, 
  BarChart3, 
  Search, 
  Filter, 
  X, 
  Edit2, 
  Check, 
  FileText, 
  Download, 
  AlertTriangle, 
  UserCheck, 
  CalendarDays, 
  TrendingUp, 
  Award, 
  Bell 
} from 'lucide-react';

const TimesheetApp = () => {
  const [currentUser, setCurrentUser] = useState('Jean Dupont');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [projects, setProjects] = useState([
    { id: 1, name: 'Développement Site Web', code: 'DEV-001', client: 'Client A', color: '#3B82F6', members: ['Jean Dupont', 'Marie Martin'] },
    { id: 2, name: 'Maintenance Application', code: 'MAINT-002', client: 'Client B', color: '#10B981', members: ['Jean Dupont', 'Pierre Durand'] },
    { id: 3, name: 'Formation Équipe', code: 'FORM-003', client: 'Interne', color: '#F59E0B', members: ['Marie Martin'] },
    { id: 4, name: 'Réunions Client', code: 'MEET-004', client: 'Client C', color: '#EF4444', members: ['Jean Dupont', 'Marie Martin', 'Pierre Durand'] }
  ]);
  const [selectedProject, setSelectedProject] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState('saisie');
  const [weekView, setWeekView] = useState(false);
  const [monthView, setMonthView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', code: '', client: '', color: '#3B82F6', members: [] });
  const [filterClient, setFilterClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // Gestion des congés et absences
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: 'conges',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending'
  });
  const [userRole, setUserRole] = useState('employee');
  const [leaveTypes] = useState([
    { id: 'conges', label: 'Congés payés', color: '#10B981', defaultDays: 25 },
    { id: 'maladie', label: 'Arrêt maladie', color: '#EF4444', defaultDays: 0 },
    { id: 'formation', label: 'Formation', color: '#3B82F6', defaultDays: 5 },
    { id: 'rtt', label: 'RTT', color: '#F59E0B', defaultDays: 10 },
    { id: 'personnel', label: 'Congé personnel', color: '#8B5CF6', defaultDays: 3 }
  ]);

  // Notifications et alertes
  const [notifications, setNotifications] = useState([]);
  const [pendingValidations, setPendingValidations] = useState([]);

  // Multi-utilisateurs
  const [users] = useState([
    { id: 1, name: 'Jean Dupont', role: 'employee', manager: 'Marie Martin', leaveDays: { conges: 22, rtt: 8, formation: 5, personnel: 2 } },
    { id: 2, name: 'Marie Martin', role: 'manager', manager: null, leaveDays: { conges: 25, rtt: 10, formation: 5, personnel: 3 } },
    { id: 3, name: 'Pierre Durand', role: 'employee', manager: 'Marie Martin', leaveDays: { conges: 20, rtt: 6, formation: 3, personnel: 1 } },
    { id: 4, name: 'Sophie Blanc', role: 'admin', manager: null, leaveDays: { conges: 25, rtt: 10, formation: 5, personnel: 3 } }
  ]);

  // Seuils d'alerte pour les heures
  const WEEKLY_HOUR_LIMITS = {
    normal: 35,
    warning: 40,
    overtime: 48
  };

  // Générer les données pour la semaine courante
  const getCurrentWeek = () => {
    const today = new Date(currentDate);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  // Générer les données pour le mois courant
  const getCurrentMonth = () => {
    const year = new Date(currentDate).getFullYear();
    const month = new Date(currentDate).getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().split('T')[0]);
    }
    return days;
  };

  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

  // Simuler des données existantes
  useEffect(() => {
    const sampleData = [
      { id: 1, date: currentDate, projectId: 1, hours: 8, description: 'Développement des fonctionnalités utilisateur', user: currentUser, status: 'submitted' },
      { id: 2, date: currentDate, projectId: 2, hours: 2, description: 'Correction de bugs', user: currentUser, status: 'draft' },
      { id: 3, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], projectId: 1, hours: 9, description: 'Configuration de l\'environnement', user: currentUser, status: 'approved' },
      { id: 4, date: new Date(Date.now() - 172800000).toISOString().split('T')[0], projectId: 3, hours: 7, description: 'Formation équipe', user: 'Marie Martin', status: 'submitted' },
      { id: 5, date: new Date(Date.now() - 259200000).toISOString().split('T')[0], projectId: 2, hours: 8.5, description: 'Tests et validation', user: 'Pierre Durand', status: 'approved' }
    ];
    setTimeEntries(sampleData);

    const sampleLeaves = [
      { id: 1, user: currentUser, type: 'conges', startDate: '2025-09-15', endDate: '2025-09-19', reason: 'Vacances d\'été', status: 'approved', requestDate: '2025-08-15' },
      { id: 2, user: 'Marie Martin', type: 'maladie', startDate: '2025-09-03', endDate: '2025-09-04', reason: 'Grippe', status: 'pending', requestDate: '2025-09-02' },
      { id: 3, user: 'Pierre Durand', type: 'rtt', startDate: '2025-09-10', endDate: '2025-09-10', reason: 'RTT', status: 'approved', requestDate: '2025-09-01' }
    ];
    setLeaveRequests(sampleLeaves);

    // Notifications d'exemple
    const sampleNotifications = [
      { id: 1, type: 'warning', message: 'Vous avez 9h saisies hier, attention aux heures supplémentaires', date: new Date().toISOString(), read: false },
      { id: 2, type: 'reminder', message: 'N\'oubliez pas de valider votre feuille de temps de la semaine', date: new Date().toISOString(), read: false },
      { id: 3, type: 'info', message: 'Nouvelle demande de congé de Marie Martin en attente', date: new Date().toISOString(), read: true }
    ];
    setNotifications(sampleNotifications);

    // Validations en attente
    if (userRole === 'manager' || userRole === 'admin') {
      setPendingValidations([
        { id: 1, type: 'timesheet', user: 'Pierre Durand', week: 'Semaine du 26/08', hours: 38 },
        { id: 2, type: 'leave', user: 'Marie Martin', request: 'Congé maladie 2 jours' }
      ]);
    }
  }, [currentUser, userRole]);

  const addTimeEntry = () => {
    if (!selectedProject || !hours) return;

    const newEntry = {
      id: Date.now(),
      date: currentDate,
      projectId: parseInt(selectedProject),
      hours: parseFloat(hours),
      description,
      user: currentUser,
      status: 'draft'
    };

    setTimeEntries([...timeEntries, newEntry]);
    setSelectedProject('');
    setHours('');
    setDescription('');

    // Alerte heures supplémentaires
    const weekTotal = getTotalHoursForWeek() + parseFloat(hours);
    if (weekTotal > WEEKLY_HOUR_LIMITS.warning) {
      const newNotification = {
        id: Date.now(),
        type: 'warning',
        message: `Attention: ${weekTotal}h cette semaine. Limite recommandée: ${WEEKLY_HOUR_LIMITS.normal}h`,
        date: new Date().toISOString(),
        read: false
      };
      setNotifications([newNotification, ...notifications]);
    }
  };

  const submitTimesheet = (weekDate) => {
    const weekEntries = timeEntries.filter(entry => 
      getCurrentWeek().includes(entry.date) && 
      entry.user === currentUser &&
      entry.status === 'draft'
    );
    
    const updatedEntries = timeEntries.map(entry => 
      weekEntries.includes(entry) ? { ...entry, status: 'submitted' } : entry
    );
    
    setTimeEntries(updatedEntries);
    
    const notification = {
      id: Date.now(),
      type: 'success',
      message: 'Feuille de temps soumise pour validation',
      date: new Date().toISOString(),
      read: false
    };
    setNotifications([notification, ...notifications]);
  };

  const validateTimesheet = (entryId, action) => {
    const updatedEntries = timeEntries.map(entry => 
      entry.id === entryId ? { ...entry, status: action === 'approve' ? 'approved' : 'rejected' } : entry
    );
    setTimeEntries(updatedEntries);
  };

  const updateTimeEntry = (id, updatedEntry) => {
    setTimeEntries(timeEntries.map(entry => 
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    ));
    setEditingEntry(null);
  };

  const deleteTimeEntry = (id) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  const addProject = () => {
    if (!newProject.name || !newProject.code) return;

    const project = {
      id: Date.now(),
      ...newProject,
      members: newProject.members || []
    };

    setProjects([...projects, project]);
    setNewProject({ name: '', code: '', client: '', color: '#3B82F6', members: [] });
    setShowProjectForm(false);
  };

  const submitLeaveRequest = () => {
    if (!newLeave.type || !newLeave.startDate || !newLeave.endDate) return;

    const leaveRequest = {
      id: Date.now(),
      user: currentUser,
      ...newLeave,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([...leaveRequests, leaveRequest]);
    setNewLeave({
      type: 'conges',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending'
    });
    setShowLeaveForm(false);

    // Notification
    const notification = {
      id: Date.now(),
      type: 'info',
      message: 'Demande de congé soumise, en attente de validation',
      date: new Date().toISOString(),
      read: false
    };
    setNotifications([notification, ...notifications]);
  };

  const approveLeaveRequest = (id) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'approved' } : request
    ));
  };

  const rejectLeaveRequest = (id) => {
    const reason = prompt('Raison du refus :');
    if (reason === null) return;

    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'rejected', rejectionReason: reason } : request
    ));
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getRemainingLeave = (type) => {
    const user = users.find(u => u.name === currentUser);
    if (!user) return 0;
    
    const usedDays = leaveRequests
      .filter(req => req.user === currentUser && req.type === type && req.status === 'approved')
      .reduce((sum, req) => sum + calculateLeaveDays(req.startDate, req.endDate), 0);
    
    return (user.leaveDays[type] || 0) - usedDays;
  };

  const getLeaveTypeById = (typeId) => {
    return leaveTypes.find(type => type.id === typeId);
  };

  const getUserLeaveRequests = () => {
    return leaveRequests.filter(request => request.user === currentUser);
  };

  const getPendingLeaveRequests = () => {
    return leaveRequests.filter(request => request.status === 'pending');
  };

  const getProjectById = (id) => {
    return projects.find(p => p.id === id);
  };

  const getEntriesForDate = (date) => {
    return timeEntries.filter(entry => entry.date === date);
  };

  const getTotalHoursForDate = (date) => {
    return getEntriesForDate(date).reduce((total, entry) => total + entry.hours, 0);
  };

  const getTotalHoursForWeek = () => {
    return currentWeek.reduce((total, date) => total + getTotalHoursForDate(date), 0);
  };

  const getTotalHoursForMonth = () => {
    return currentMonth.reduce((total, date) => total + getTotalHoursForDate(date), 0);
  };

  const getWeeklyHourStatus = () => {
    const total = getTotalHoursForWeek();
    if (total > WEEKLY_HOUR_LIMITS.overtime) return { status: 'critical', message: 'Heures supplémentaires excessives' };
    if (total > WEEKLY_HOUR_LIMITS.warning) return { status: 'warning', message: 'Attention aux heures supplémentaires' };
    if (total > WEEKLY_HOUR_LIMITS.normal) return { status: 'overtime', message: 'Heures supplémentaires' };
    return { status: 'normal', message: 'Dans les limites normales' };
  };

  const getMonthlyStats = () => {
    const monthEntries = timeEntries.filter(entry => 
      entry.date.startsWith(selectedMonth) && entry.user === currentUser
    );
    
    const totalHours = monthEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const uniqueDates = new Set(monthEntries.map(entry => entry.date)).size;
    const uniqueProjects = new Set(monthEntries.map(entry => entry.projectId)).size;
    
    const projectBreakdown = {};
    monthEntries.forEach(entry => {
      const project = getProjectById(entry.projectId);
      if (project) {
        if (!projectBreakdown[project.name]) {
          projectBreakdown[project.name] = { hours: 0, color: project.color };
        }
        projectBreakdown[project.name].hours += entry.hours;
      }
    });

    return { totalHours, uniqueDates, uniqueProjects, projectBreakdown };
  };

  const getDashboardStats = () => {
    const allEntries = timeEntries.filter(entry => entry.user === currentUser);
    const thisWeekEntries = allEntries.filter(entry => currentWeek.includes(entry.date));
    const thisMonthEntries = allEntries.filter(entry => entry.date.startsWith(selectedMonth));
    
    const occupationRate = (thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0) / (5 * 7)) * 100;
    
    const approvedLeaves = leaveRequests.filter(req => req.user === currentUser && req.status === 'approved');
    const totalLeaveDays = approvedLeaves.reduce((sum, req) => sum + calculateLeaveDays(req.startDate, req.endDate), 0);
    
    return {
      weeklyHours: thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0),
      monthlyHours: thisMonthEntries.reduce((sum, entry) => sum + entry.hours, 0),
      occupationRate: Math.min(occupationRate, 100),
      leaveDaysTaken: totalLeaveDays,
      projectCount: new Set(allEntries.map(entry => entry.projectId)).size
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Projet', 'Code', 'Client', 'Heures', 'Description', 'Statut'];
    const csvData = timeEntries
      .filter(entry => entry.user === currentUser)
      .map(entry => {
        const project = getProjectById(entry.projectId);
        return [
          entry.date,
          project?.name || '',
          project?.code || '',
          project?.client || '',
          entry.hours,
          entry.description || '',
          entry.status
        ];
      });
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${currentUser.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getUnreadNotifications = () => {
    return notifications.filter(notif => !notif.read);
  };

  const filteredProjects = projects.filter(project =>
    (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterClient === '' || project.client === filterClient) &&
    (project.members.includes(currentUser) || userRole === 'admin')
  );

  const uniqueClients = [...new Set(projects.map(p => p.client))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec notifications */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Saisie des Temps</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                  <Bell className="h-5 w-5" />
                  {getUnreadNotifications().length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {getUnreadNotifications().length}
                    </span>
                  )}
                </button>
              </div>
              
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <select
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.name}>{user.name} ({user.role})</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'saisie', label: 'Saisie des temps' },
              { id: 'conges', label: 'Congés & Absences' },
              { id: 'projets', label: 'Projets' },
              { id: 'validation', label: `Validation ${pendingValidations.length > 0 ? `(${pendingValidations.length})` : ''}` },
              { id: 'rapports', label: 'Rapports' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Alertes et notifications importantes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map(notif => (
                      <div
                        key={notif.id}
                        className={`flex items-start space-x-3 p-3 rounded ${
                          notif.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-400'
                        }`}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <div className={`mt-1 ${
                          notif.type === 'warning' ? 'text-yellow-500' : 
                          notif.type === 'success' ? 'text-green-500' : 'text-blue-500'
                        }`}>
                          {notif.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                          {notif.type === 'success' && <Check className="h-4 w-4" />}
                          {notif.type === 'info' && <Bell className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notif.message}</p>
                          <p className="text-xs text-gray-500">{new Date(notif.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                  <div className="text-sm opacity-90">Cette semaine</div>
                  <div className="text-2xl font-bold">{getDashboardStats().weeklyHours}h</div>
                  <div className={`text-xs mt-1 ${
                    getWeeklyHourStatus().status === 'critical' ? 'text-red-200' :
                    getWeeklyHourStatus().status === 'warning' ? 'text-yellow-200' : 'text-green-200'
                  }`}>
                    {getWeeklyHourStatus().message}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                  <div className="text-sm opacity-90">Taux d'occupation</div>
                  <div className="text-2xl font-bold">{Math.round(getDashboardStats().occupationRate)}%</div>
                  <div className="w-full bg-green-400 rounded-full h-2 mt-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300" 
                      style={{ width: `${Math.min(getDashboardStats().occupationRate, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                  <div className="text-sm opacity-90">Congés pris</div>
                  <div className="text-2xl font-bold">{getDashboardStats().leaveDaysTaken} jours</div>
                  <div className="text-xs opacity-90">Restant: {getRemainingLeave('conges')} CP</div>
                </div>
              </div>
            </div>

            {/* Validation en attente (pour managers) */}
            {(userRole === 'manager' || userRole === 'admin') && pendingValidations.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-400">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-orange-500" />
                  Actions en attente ({pendingValidations.length})
                </h2>
                <div className="space-y-3">
                  {pendingValidations.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-orange-50 rounded">
                      <div>
                        <span className="font-medium">{item.user}</span>
                        <span className="text-gray-600 ml-2">
                          {item.type === 'timesheet' ? `${item.week} - ${item.hours}h` : item.request}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                          Valider
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saisie' && (
          <div className="space-y-6">
            {/* Contrôles de date et vue */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Sélection de période</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setWeekView(false); setMonthView(false); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      !weekView && !monthView
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Jour
                  </button>
                  <button
                    onClick={() => { setWeekView(true); setMonthView(false); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      weekView && !monthView
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Semaine
                  </button>
                  <button
                    onClick={() => { setWeekView(false); setMonthView(true); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      monthView
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Mois
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => {
                    setCurrentDate(e.target.value);
                    const newDate = new Date(e.target.value);
                    // Mise à jour de la semaine
                    const startOfWeek = new Date(newDate.setDate(newDate.getDate() - newDate.getDay() + 1));
                    const week = [];
                    for (let i = 0; i < 7; i++) {
                      const date = new Date(startOfWeek);
                      date.setDate(startOfWeek.getDate() + i);
                      week.push(date.toISOString().split('T')[0]);
                    }
                    setCurrentWeek(week);
                    // Mise à jour du mois
                    setCurrentMonth(getCurrentMonth());
                  }}
                  className="block w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {weekView && (
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Total semaine: <span className="font-semibold">{getTotalHoursForWeek()}h</span>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      getWeeklyHourStatus().status === 'critical' ? 'bg-red-100 text-red-800' :
                      getWeeklyHourStatus().status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      getWeeklyHourStatus().status === 'overtime' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getWeeklyHourStatus().message}
                    </div>
                  </div>
                )}

                {monthView && (
                  <div className="text-sm text-gray-600">
                    Total mois: <span className="font-semibold">{getTotalHoursForMonth()}h</span>
                  </div>
                )}

                {/* Bouton de soumission pour validation */}
                <button
                  onClick={() => submitTimesheet()}
                  className="ml-auto flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  disabled={timeEntries.filter(e => e.user === currentUser && e.status === 'draft').length === 0}
                >
                  <Save className="h-4 w-4" />
                  <span>Soumettre pour validation</span>
                </button>
              </div>
            </div>

            {/* Formulaire de saisie */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Nouvelle saisie</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher un projet
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nom, code ou client du projet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrer par client
                  </label>
                  <select
                    value={filterClient}
                    onChange={(e) => setFilterClient(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les clients</option>
                    {uniqueClients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projet
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un projet</option>
                    {filteredProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.code} - {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heures
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="24"
                    placeholder="7.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Description des tâches réalisées..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={addTimeEntry}
                  disabled={!selectedProject || !hours}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {/* Vue jour par défaut */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Temps saisi le {formatDate(currentDate)}
                </h2>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold">{getTotalHoursForDate(currentDate)}h</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {getEntriesForDate(currentDate).filter(entry => entry.user === currentUser).map(entry => {
                  const project = getProjectById(entry.projectId);
                  const isEditing = editingEntry === entry.id;
                  
                  return (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      {!isEditing ? (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: project?.color }}
                              />
                              <span className="font-semibold text-blue-600">{project?.code}</span>
                              <span className="text-gray-600">-</span>
                              <span className="font-medium">{project?.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                                entry.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {entry.status === 'approved' ? 'Approuvé' :
                                 entry.status === 'submitted' ? 'En attente' :
                                 entry.status === 'rejected' ? 'Rejeté' : 'Brouillon'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Client: {project?.client}
                            </div>
                            {entry.description && (
                              <div className="text-sm text-gray-700 mt-2">
                                {entry.description}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-lg font-semibold text-green-600">
                              {entry.hours}h
                            </div>
                            {entry.status === 'draft' && (
                              <>
                                <button
                                  onClick={() => setEditingEntry(entry.id)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteTimeEntry(entry.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select
                              defaultValue={entry.projectId}
                              onChange={(e) => updateTimeEntry(entry.id, { projectId: parseInt(e.target.value) })}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {projects.filter(p => p.members.includes(currentUser) || userRole === 'admin').map(p => (
                                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              step="0.25"
                              defaultValue={entry.hours}
                              onChange={(e) => updateTimeEntry(entry.id, { hours: parseFloat(e.target.value) })}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <input
                            type="text"
                            defaultValue={entry.description}
                            onChange={(e) => updateTimeEntry(entry.id, { description: e.target.value })}
                            placeholder="Description des tâches..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingEntry(null)}
                              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              <Check className="h-3 w-3" />
                              <span>Valider</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {getEntriesForDate(currentDate).filter(entry => entry.user === currentUser).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun temps saisi pour cette date
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Autres onglets simplifiés */}
        {activeTab === 'conges' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Gestion des congés</h2>
            <p className="text-gray-600">Module de gestion des congés en développement...</p>
          </div>
        )}

        {activeTab === 'projets' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Gestion des projets</h2>
            <p className="text-gray-600">Module de gestion des projets en développement...</p>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Validation</h2>
            <p className="text-gray-600">Module de validation en développement...</p>
          </div>
        )}

        {activeTab === 'rapports' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Rapports</h2>
            <p className="text-gray-600">Module de rapports en développement...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimesheetApp;