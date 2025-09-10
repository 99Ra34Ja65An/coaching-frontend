import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  TextField,
  Menu,
  MenuItem,
  Tooltip,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  Tabs,
  Tab,
  Badge,
  useTheme,
  useMediaQuery,
  alpha,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  InputAdornment,
  Fab
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  VideoLibrary as VideoLibraryIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Quiz as QuizIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Timer as TimerIcon,
  Psychology as PsychologyIcon,
  BarChart as BarChartIcon,
  Grading as GradingIcon
} from "@mui/icons-material";

// DataGrid and Charts
import { DataGrid } from "@mui/x-data-grid";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as ReTooltip, BarChart, Bar, XAxis, 
  YAxis, CartesianGrid, Legend, AreaChart, Area 
} from "recharts";

// Animations
import { motion, AnimatePresence } from "framer-motion";

import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const drawerWidth = 280;
const miniDrawerWidth = 80;
const COLORS = ["#1a4f8e", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboardPro() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingStudents: 0,
    totalVideos: 0,
    totalPdfs: 0,
    totalTests: 0
  });

  const [students, setStudents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [tests, setTests] = useState([]);
  const [activities, setActivities] = useState([]);

  const [query, setQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("video");
  const [formData, setFormData] = useState({ title: "", link: "" });
  const [tabValue, setTabValue] = useState(0);

  // Test creation states
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testForm, setTestForm] = useState({
    title: "",
    description: "",
    duration: 30,
    passingScore: 60,
    isActive: true,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "mcq",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!token || !user || user.role !== "admin") navigate("/login");
  }, [navigate, token, user]);

  // Fetchers
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/students");
      setStudents(res.data || []);
      setStats(prev => ({
        ...prev,
        totalStudents: res.data.length,
        activeStudents: res.data.filter(s => s.active).length,
        pendingStudents: res.data.filter(s => !s.active).length
      }));
    } catch (e) {
      console.error(e);
      setToast({ open: true, severity: "error", message: "Failed to load students" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/videos");
      setVideos(res.data || []);
      setStats(prev => ({ ...prev, totalVideos: res.data.length }));
    } catch (e) {
      console.error(e);
      setToast({ open: true, severity: "error", message: "Failed to load videos" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPdfs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/pdfs");
      setPdfs(res.data || []);
      setStats(prev => ({ ...prev, totalPdfs: res.data.length }));
    } catch (e) {
      console.error(e);
      setToast({ open: true, severity: "error", message: "Failed to load PDFs" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/tests");
      setTests(res.data.data || res.data || []);
      setStats(prev => ({ ...prev, totalTests: res.data.length }));
    } catch (e) {
      console.error(e);
      setToast({ open: true, severity: "error", message: "Failed to load Tests" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await API.get("/activities");
      setActivities(res.data || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    // Load essential data first
    fetchStudents();
    fetchActivities();
    
    // Load other data with a slight delay to improve perceived performance
    const timer = setTimeout(() => {
      fetchVideos();
      fetchPdfs();
      fetchTests();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [fetchStudents, fetchVideos, fetchPdfs, fetchTests, fetchActivities]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleDrawerCollapse = () => setCollapsed(!collapsed);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/students/${id}`, { active: true });
      setStudents((s) => s.map((st) => (st._id === id ? { ...st, active: true } : st)));
      setToast({ open: true, severity: "success", message: "Student approved" });
    } catch (e) {
      console.error(e);
      setToast({ open: true, severity: "error", message: "Approve failed" });
    }
  };

  const filteredStudents = useMemo(() => {
    if (!query) return students;
    const q = query.toLowerCase();
    return students.filter((s) => (s.name || "").toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q));
  }, [students, query]);

  const pieData = useMemo(() => [
    { name: "Active", value: students.filter((s) => s.active).length },
    { name: "Pending", value: students.filter((s) => !s.active).length },
  ], [students]);

  const activityData = [
    { day: "Mon", activities: 12 },
    { day: "Tue", activities: 19 },
    { day: "Wed", activities: 14 },
    { day: "Thu", activities: 23 },
    { day: "Fri", activities: 17 },
    { day: "Sat", activities: 9 },
    { day: "Sun", activities: 6 },
  ];

  const handleAddOpen = (mode) => { setDialogMode(mode); setOpenDialog(true); };
  const handleDialogSave = async () => {
    if (!formData.title || !formData.link) return setToast({ open: true, severity: "warning", message: "Title and link required" });
    try {
      if (dialogMode === "video") await API.post("/videos", formData);
      else await API.post("/pdfs", formData);
      setOpenDialog(false);
      setFormData({ title: "", link: "" });
      setToast({ open: true, severity: "success", message: "Saved" });
      if (dialogMode === "video") fetchVideos(); else fetchPdfs();
    } catch (e) {
      console.error(e);
      setToast({ open: true, severity: "error", message: "Save failed" });
    }
  };

  const handleLogout = async () => {
    try { await API.post("/auth/logout"); } catch (e) { }
    localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login");
  };

  const handleNotificationOpen = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);
  const handleProfileOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  // Test Creation Functions
  const handleTestCreate = () => {
    setTestForm({
      title: "",
      description: "",
      duration: 30,
      passingScore: 60,
      isActive: true,
      questions: []
    });
    setCurrentQuestion({
      text: "",
      type: "mcq",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1
    });
    setEditingQuestionIndex(null);
    setTestDialogOpen(true);
  };

  const handleTestSave = async () => {
    if (!testForm.title) {
      setToast({ open: true, severity: "error", message: "Test title is required" });
      return;
    }
    
    if (testForm.questions.length === 0) {
      setToast({ open: true, severity: "error", message: "Add at least one question" });
      return;
    }

    try {
      await API.post("/tests", testForm);
      setTestDialogOpen(false);
      setToast({ open: true, severity: "success", message: "Test created successfully" });
      fetchTests();
    } catch (e) {
      console.error(e);
      setToast({ open: true, severity: "error", message: "Failed to create test" });
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.text) {
      setToast({ open: true, severity: "error", message: "Question text is required" });
      return;
    }

    if (currentQuestion.type === "mcq" && currentQuestion.options.some(opt => !opt)) {
      setToast({ open: true, severity: "error", message: "All options must be filled" });
      return;
    }

    const newQuestions = [...testForm.questions];
    
    if (editingQuestionIndex !== null) {
      // Update existing question
      newQuestions[editingQuestionIndex] = {...currentQuestion};
    } else {
      // Add new question
      newQuestions.push({...currentQuestion});
    }
    
    setTestForm({...testForm, questions: newQuestions});
    setCurrentQuestion({
      text: "",
      type: "mcq",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1
    });
    setEditingQuestionIndex(null);
  };

  const editQuestion = (index) => {
    setCurrentQuestion({...testForm.questions[index]});
    setEditingQuestionIndex(index);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...testForm.questions];
    newQuestions.splice(index, 1);
    setTestForm({...testForm, questions: newQuestions});
    
    if (editingQuestionIndex === index) {
      setCurrentQuestion({
        text: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1
      });
      setEditingQuestionIndex(null);
    }
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, ""]
    });
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 2) {
      setToast({ open: true, severity: "error", message: "At least 2 options are required" });
      return;
    }
    
    const newOptions = [...currentQuestion.options];
    newOptions.splice(index, 1);
    
    // Adjust correct answer if needed
    let newCorrectAnswer = currentQuestion.correctAnswer;
    if (index === currentQuestion.correctAnswer) {
      newCorrectAnswer = 0;
    } else if (index < currentQuestion.correctAnswer) {
      newCorrectAnswer = currentQuestion.correctAnswer - 1;
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
      correctAnswer: newCorrectAnswer
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  // Columns for DataGrid
  const studentColumns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "joinDate", headerName: "Join Date", width: 120, renderCell: (params) => (
      <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
    ) },
    { field: "status", headerName: "Status", width: 120, renderCell: (params) => (
      <Chip 
        label={params.row.active ? "Active" : "Pending"} 
        color={params.row.active ? "success" : "warning"} 
        size="small" 
      />
    ) },
    { field: "action", headerName: "Action", width: 160, renderCell: (params) => (
      !params.row.active ? 
        <Button size="small" variant="contained" color="primary" onClick={() => handleApprove(params.row._id)}>
          Approve
        </Button> : 
        <Button size="small" disabled>—</Button>
    ) },
  ];

  const videoColumns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "link", headerName: "Link", flex: 1, renderCell: (p) => (
      <a href={p.value} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center">
        Open <VisibilityIcon fontSize="small" className="ml-1" />
      </a>
    ) },
    { field: "views", headerName: "Views", width: 100 },
    { field: "uploadDate", headerName: "Uploaded", width: 120, renderCell: (params) => (
      <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
    ) },
  ];

  // Glassmorphism Card component
  const GlassCard = ({ children, className = "", ...props }) => (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 dark:border-gray-700/30 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );

  const StatCard = ({ title, value, change, icon, color }) => (
    <GlassCard className="p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</h3>
          {change && (
            <div className={`flex items-center mt-2 text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUpIcon fontSize="small" className={change > 0 ? '' : 'transform rotate-180'} />
              <span className="ml-1">{Math.abs(change)}% from last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {React.cloneElement(icon, { className: `text-2xl ${color}` })}
        </div>
      </div>
    </GlassCard>
  );

  const MenuItemButton = ({ icon, text, active, onClick }) => (
    <ListItem 
      button 
      onClick={onClick}
      className={`rounded-lg mb-1 transition-all duration-200 ${active ? 
        'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-300 border-r-4 border-blue-500' : 
        'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
    >
      <ListItemIcon className={active ? 'text-blue-500 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}>
        {icon}
      </ListItemIcon>
      {!collapsed && <ListItemText primary={text} />}
    </ListItem>
  );

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Drawer
          variant="permanent"
          open={!collapsed}
          sx={{
            width: collapsed ? miniDrawerWidth : drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            [`& .MuiDrawer-paper`]: { 
              width: collapsed ? miniDrawerWidth : drawerWidth, 
              boxSizing: 'border-box',
              overflowX: 'hidden',
              transition: 'width 0.3s ease',
              bgcolor: darkMode ? 'rgb(17, 24, 39)' : 'white',
              border: 'none',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)'
            },
          }}
        >
          <div className="flex flex-col h-full">
            <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
              {!collapsed && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center text-white font-bold mr-2">
                    <SchoolIcon fontSize="small" />
                  </div>
                  <span className="font-bold text-lg">IBS Classes</span>
                </div>
              )}
              <IconButton onClick={toggleDrawerCollapse} size="small">
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            
            <Divider />

            <List className="px-2 mt-4 flex-1">
              <MenuItemButton 
                icon={<DashboardIcon />} 
                text="Overview" 
                active={activeMenu === "dashboard"} 
                onClick={() => setActiveMenu("dashboard")} 
              />
              <MenuItemButton 
                icon={<PeopleIcon />} 
                text="Students" 
                active={activeMenu === "students"} 
                onClick={() => setActiveMenu("students")} 
              />
              <MenuItemButton 
                icon={<VideoLibraryIcon />} 
                text="Videos" 
                active={activeMenu === "videos"} 
                onClick={() => setActiveMenu("videos")} 
              />
              <MenuItemButton 
                icon={<PictureAsPdfIcon />} 
                text="PDFs" 
                active={activeMenu === "pdfs"} 
                onClick={() => setActiveMenu("pdfs")} 
              />
              <MenuItemButton 
                icon={<QuizIcon />} 
                text="Tests" 
                active={activeMenu === "tests"} 
                onClick={() => setActiveMenu("tests")} 
              />
            </List>

            <div className="p-4">
              <GlassCard className="p-3">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10" src={user?.avatar}>
                    {(user?.name || "A").charAt(0)}
                  </Avatar>
                  {!collapsed && (
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </Drawer>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: darkMode ? 'rgb(17, 24, 39)' : 'white'
          },
        }}
      >
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center text-white font-bold mr-2">
              <SchoolIcon fontSize="small" />
            </div>
            <span className="font-bold text-lg">IBS Classes</span>
          </div>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </div>
        
        <Divider />

        <List className="px-2 mt-4">
          <MenuItemButton 
            icon={<DashboardIcon />} 
            text="Overview" 
            active={activeMenu === "dashboard"} 
            onClick={() => { setActiveMenu("dashboard"); handleDrawerToggle(); }} 
          />
          <MenuItemButton 
            icon={<PeopleIcon />} 
            text="Students" 
            active={activeMenu === "students"} 
            onClick={() => { setActiveMenu("students"); handleDrawerToggle(); }} 
          />
          <MenuItemButton 
            icon={<VideoLibraryIcon />} 
            text="Videos" 
            active={activeMenu === "videos"} 
            onClick={() => { setActiveMenu("videos"); handleDrawerToggle(); }} 
          />
          <MenuItemButton 
            icon={<PictureAsPdfIcon />} 
            text="PDFs" 
            active={activeMenu === "pdfs"} 
            onClick={() => { setActiveMenu("pdfs"); handleDrawerToggle(); }} 
          />
          <MenuItemButton 
            icon={<QuizIcon />} 
            text="Tests" 
            active={activeMenu === "tests"} 
            onClick={() => { setActiveMenu("tests"); handleDrawerToggle(); }} 
          />
        </List>
      </Drawer>

      {/* Main Content */}
      <main className={`flex-1 ${collapsed ? 'md:ml-20' : 'md:ml-80'} transition-margin duration-300`}>
        {/* Top AppBar */}
        <AppBar 
          position="sticky" 
          elevation={0} 
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
        >
          <Toolbar className="flex items-center gap-4">
            <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} className="md:hidden text-gray-800 dark:text-white">
              <MenuIcon />
            </IconButton>
            
            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <IconButton onClick={() => setDarkMode(!darkMode)} className="text-gray-700 dark:text-gray-300">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              <TextField 
                size="small" 
                placeholder="Search..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                InputProps={{ 
                  startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
                  className: "rounded-full bg-gray-100 dark:bg-gray-800"
                }} 
                className="hidden md:block"
              />
              
              <Tooltip title="Notifications">
                <IconButton onClick={handleNotificationOpen} className="text-gray-700 dark:text-gray-300">
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Add Content">
                <IconButton color="primary" onClick={() => handleAddOpen("video")}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              
              <IconButton onClick={handleProfileOpen} className="p-0 ml-2">
                <Avatar className="w-8 h-8" src={user?.avatar}>
                  {(user?.name || "A").charAt(0)}
                </Avatar>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            className: "mt-2 rounded-xl shadow-lg",
            style: { width: 320 }
          }}
        >
          <div className="p-3 border-b">
            <Typography variant="h6">Notifications</Typography>
          </div>
          {[1, 2, 3].map((item) => (
            <MenuItem key={item} onClick={handleNotificationClose} className="py-2">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <PeopleIcon color="primary" fontSize="small" />
                </div>
                <div>
                  <Typography variant="body2">New student registration</Typography>
                  <Typography variant="caption" color="textSecondary">2 hours ago</Typography>
                </div>
              </div>
            </MenuItem>
          ))}
          <div className="p-2 border-t">
            <Button fullWidth color="primary">View All</Button>
          </div>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
          PaperProps={{ className: "mt-2 rounded-xl shadow-lg" }}
        >
          <div className="p-4 border-b">
            <Typography variant="subtitle1">{user?.name || "Admin"}</Typography>
            <Typography variant="body2" color="textSecondary">{user?.email || "admin@ibsclasses.com"}</Typography>
          </div>
          <MenuItem onClick={handleProfileClose}>
            <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleProfileClose}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Main Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeMenu === "dashboard" && (
                <div>
                  <div className="mb-6">
                    <Typography variant="h4" className="font-bold mb-2 text-gray-800 dark:text-white">Dashboard Overview</Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                      Welcome back, {user?.name || "Admin"}. Here's what's happening with your platform today.
                    </Typography>
                  </div>

                  <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard 
                        title="Total Students" 
                        value={stats.totalStudents} 
                        change={12.5}
                        icon={<PeopleIcon />}
                        color="text-blue-600"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard 
                        title="Active Videos" 
                        value={stats.totalVideos} 
                        change={8.3}
                        icon={<VideoLibraryIcon />}
                        color="text-blue-600"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard 
                        title="PDF Resources" 
                        value={stats.totalPdfs} 
                        change={5.7}
                        icon={<PictureAsPdfIcon />}
                        color="text-blue-600"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard 
                        title="Tests Created" 
                        value={stats.totalTests} 
                        change={-2.1}
                        icon={<QuizIcon />}
                        color="text-blue-600"
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} lg={8}>
                      <GlassCard className="p-4 h-full">
                        <div className="flex justify-between items-center mb-4">
                          <Typography variant="h6" className="font-semibold">Weekly Activity</Typography>
                          <Chip label="This Week" size="small" variant="outlined" />
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                          <ResponsiveContainer>
                            <BarChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <XAxis dataKey="day" />
                              <YAxis />
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <ReTooltip />
                              <Bar dataKey="activities" fill="#1a4f8e" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </GlassCard>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <GlassCard className="p-4 h-full">
                        <Typography variant="h6" className="font-semibold mb-4">Student Status</Typography>
                        <div style={{ width: '100%', height: 250 }}>
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie 
                                data={pieData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={80} 
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <ReTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                          {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                              <span className="text-sm">{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                      <GlassCard className="p-4">
                        <Typography variant="h6" className="font-semibold mb-4">Recent Students</Typography>
                        <div className="space-y-4">
                          {students.slice(0, 4).map((student) => (
                            <div key={student._id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Avatar className="w-10 h-10 mr-3" src={student.avatar}>
                                  {student.name?.charAt(0)}
                                </Avatar>
                                <div>
                                  <Typography variant="body2" className="font-medium">{student.name}</Typography>
                                  <Typography variant="caption" className="text-gray-500">{student.email}</Typography>
                                </div>
                              </div>
                              <Chip 
                                label={student.active ? "Active" : "Pending"} 
                                color={student.active ? "success" : "warning"} 
                                size="small" 
                              />
                            </div>
                          ))}
                        </div>
                        <Button fullWidth className="mt-4" endIcon={<ChevronRightIcon />} onClick={() => setActiveMenu("students")}>
                          View All Students
                        </Button>
                      </GlassCard>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                      <GlassCard className="p-4">
                        <Typography variant="h6" className="font-semibold mb-4">Recent Activities</Typography>
                        <div className="space-y-4">
                          {activities.slice(0, 4).map((activity, index) => (
                            <div key={index} className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className={`p-2 rounded-full ${index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                  {activity.type === 'video' ? <VideoLibraryIcon fontSize="small" /> : 
                                   activity.type === 'test' ? <QuizIcon fontSize="small" /> : 
                                   <PeopleIcon fontSize="small" />}
                                </div>
                                {index < 3 && <div className="flex-1 w-0.5 bg-gray-200 my-1"></div>}
                              </div>
                              <div className="flex-1 pb-4">
                                <Typography variant="body2">{activity.description}</Typography>
                                <Typography variant="caption" className="text-gray-500">{activity.time}</Typography>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button fullWidth className="mt-2" endIcon={<ChevronRightIcon />}>
                          View All Activities
                        </Button>
                      </GlassCard>
                    </Grid>
                  </Grid>
                </div>
              )}

              {activeMenu === "students" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Typography variant="h4" className="font-bold mb-1 text-gray-800 dark:text-white">Student Management</Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        Manage student accounts, approvals, and access permissions
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <TextField 
                        size="small" 
                        placeholder="Search students..." 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        InputProps={{ 
                          startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
                          className: "rounded-full"
                        }} 
                      />
                      <Button variant="outlined" startIcon={<PeopleIcon />} onClick={fetchStudents}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <GlassCard className="p-0 overflow-hidden">
                    <div style={{ height: 600, width: '100%' }}>
                      <DataGrid
                        rows={filteredStudents.map(s => ({ ...s, id: s._id }))}
                        columns={studentColumns}
                        pageSize={10}
                        rowsPerPageOptions={[5,10,20]}
                        disableSelectionOnClick
                        getRowHeight={() => 'auto'}
                        sx={{
                          border: 'none',
                          '& .MuiDataGrid-row': {
                            '&:hover': {
                              backgroundColor: 'rgba(26, 79, 142, 0.04)'
                            }
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)',
                            borderBottom: '1px solid',
                            borderColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
                          },
                          '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid',
                            borderColor: darkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(229, 231, 235, 0.5)'
                          }
                        }}
                      />
                    </div>
                  </GlassCard>
                </div>
              )}

              {activeMenu === "videos" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Typography variant="h4" className="font-bold mb-1 text-gray-800 dark:text-white">Video Library</Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        Manage and organize your educational video content
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddOpen('video')}>
                        Add Video
                      </Button>
                      <Button variant="contained" onClick={fetchVideos}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} className="mb-4">
                    <Tab label="All Videos" />
                    <Tab label="Most Viewed" />
                    <Tab label="Recently Added" />
                  </Tabs>

                  <GlassCard className="p-0 overflow-hidden">
                    <div style={{ height: 600, width: '100%' }}>
                      <DataGrid
                        rows={videos.map(v => ({ ...v, id: v._id }))}
                        columns={videoColumns}
                        pageSize={8}
                        sx={{
                          border: 'none',
                          '& .MuiDataGrid-row': {
                            '&:hover': {
                              backgroundColor: 'rgba(26, 79, 142, 0.04)'
                            }
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)',
                            borderBottom: '1px solid',
                            borderColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
                          },
                          '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid',
                            borderColor: darkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(229, 231, 235, 0.5)'
                          }
                        }}
                      />
                    </div>
                  </GlassCard>
                </div>
              )}

              {activeMenu === "pdfs" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Typography variant="h4" className="font-bold mb-1 text-gray-800 dark:text-white">PDF Resources</Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        Manage and organize your educational PDF resources
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddOpen('pdf')}>
                        Add PDF
                      </Button>
                      <Button variant="contained" onClick={fetchPdfs}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <Grid container spacing={3}>
                    {pdfs.map(p => (
                      <Grid item xs={12} md={6} lg={4} key={p._id}>
                        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                          <Card className="rounded-xl overflow-hidden h-full">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-5 flex justify-center">
                              <PictureAsPdfIcon color="primary" style={{ fontSize: 48 }} />
                            </div>
                            <CardContent>
                              <Typography variant="h6" className="font-semibold mb-2">{p.title}</Typography>
                              <Typography variant="body2" color="textSecondary" className="mb-4">
                                Added on {new Date(p.createdAt).toLocaleDateString()}
                              </Typography>
                              <Chip label="PDF Resource" size="small" variant="outlined" />
                            </CardContent>
                            <CardActions className="justify-end">
                              <Button 
                                href={p.link} 
                                target="_blank" 
                                endIcon={<VisibilityIcon />}
                                className="text-blue-600"
                              >
                                View
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}

              {activeMenu === "tests" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Typography variant="h4" className="font-bold mb-1 text-gray-800 dark:text-white">Test Management</Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        Create and manage tests and assessments
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={handleTestCreate}
                        className="bg-gradient-to-r from-blue-600 to-blue-800"
                      >
                        Create Test
                      </Button>
                      <Button variant="outlined" onClick={fetchTests}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <Grid container spacing={3}>
                    {tests.map(t => (
                      <Grid item xs={12} md={6} lg={4} key={t._id}>
                        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                          <Card className="rounded-xl overflow-hidden h-full">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-5">
                              <div className="flex justify-between items-start">
                                <QuizIcon color="primary" style={{ fontSize: 40 }} />
                                <Chip label={t.isActive ? "Active" : "Inactive"} color={t.isActive ? "success" : "default"} size="small" />
                              </div>
                            </div>
                            <CardContent>
                              <Typography variant="h6" className="font-semibold mb-2">{t.title}</Typography>
                              <Typography variant="body2" color="textSecondary" className="mb-4">
                                {t.description || "Assessment test for students"}
                              </Typography>
                              <div className="flex gap-2 mb-3 flex-wrap">
                                <Chip icon={<PsychologyIcon />} label={`${t.questions?.length || 0} Questions`} size="small" variant="outlined" />
                                <Chip icon={<TimerIcon />} label={`${t.duration || 30} mins`} size="small" variant="outlined" />
                                <Chip icon={<GradingIcon />} label={`Pass: ${t.passingScore || 60}%`} size="small" variant="outlined" />
                              </div>
                            </CardContent>
                            <CardActions className="justify-between px-4 pb-4">
                              <Button 
                                startIcon={<BarChartIcon />} 
                                onClick={() => setToast({ open: true, severity: 'info', message: 'Results view coming' })}
                              >
                                Results
                              </Button>
                              <Button color="primary" variant="outlined">
                                Edit
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Add Video/PDF Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ className: "rounded-2xl" }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-800">
          <Typography variant="h6" className="font-bold">
            {dialogMode === 'video' ? 'Add New Video' : 'Add New PDF'}
          </Typography>
        </DialogTitle>
        <DialogContent className="mt-4">
          <div className="grid gap-4 py-2">
            <TextField 
              label="Title" 
              value={formData.title} 
              onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Link" 
              value={formData.link} 
              onChange={(e) => setFormData(f => ({ ...f, link: e.target.value }))} 
              fullWidth 
              variant="outlined"
              placeholder={dialogMode === 'video' ? "https://youtube.com/..." : "https://drive.google.com/..."}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setOpenDialog(false)} variant="outlined">
                Cancel
              </Button>
              <Button variant="contained" onClick={handleDialogSave} className="bg-gradient-to-r from-blue-600 to-blue-800">
                Save Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Test Dialog */}
      <Dialog 
        open={testDialogOpen} 
        onClose={() => setTestDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ className: "rounded-2xl" }}
        scroll="paper"
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-800">
          <Typography variant="h6" className="font-bold">
            Create New Test
          </Typography>
        </DialogTitle>
        <DialogContent className="mt-4">
          <div className="grid gap-4 py-2">
            <TextField 
              label="Test Title" 
              value={testForm.title} 
              onChange={(e) => setTestForm({...testForm, title: e.target.value})} 
              fullWidth 
              variant="outlined"
              required
            />
            
            <TextField 
              label="Description" 
              value={testForm.description} 
              onChange={(e) => setTestForm({...testForm, description: e.target.value})} 
              fullWidth 
              variant="outlined"
              multiline
              rows={2}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <TextField 
                label="Duration (minutes)" 
                type="number"
                value={testForm.duration} 
                onChange={(e) => setTestForm({...testForm, duration: parseInt(e.target.value) || 0})} 
                variant="outlined"
                InputProps={{
                  endAdornment: <InputAdornment position="end">mins</InputAdornment>,
                }}
              />
              
              <TextField 
                label="Passing Score (%)" 
                type="number"
                value={testForm.passingScore} 
                onChange={(e) => setTestForm({...testForm, passingScore: parseInt(e.target.value) || 0})} 
                variant="outlined"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </div>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={testForm.isActive} 
                  onChange={(e) => setTestForm({...testForm, isActive: e.target.checked})} 
                />
              }
              label="Active Test"
            />
            
            <Divider className="my-4" />
            
            <Typography variant="h6" className="font-semibold">Questions</Typography>
            
            <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <TextField 
                label="Question Text" 
                value={currentQuestion.text} 
                onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})} 
                fullWidth 
                variant="outlined"
                multiline
                rows={2}
                className="mb-4"
              />
              
              <FormControl fullWidth className="mb-3">
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={currentQuestion.type}
                  label="Question Type"
                  onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value})}
                >
                  <MenuItem value="mcq">Multiple Choice</MenuItem>
                  <MenuItem value="truefalse">True/False</MenuItem>
                </Select>
              </FormControl>
              
              {currentQuestion.type === "mcq" && (
                <div className="mb-4">
                  <Typography variant="subtitle2" className="mb-2">Options</Typography>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Radio 
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                        value={index}
                        className="mr-2"
                      />
                      <TextField
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      {currentQuestion.options.length > 2 && (
                        <IconButton 
                          size="small" 
                          onClick={() => removeOption(index)}
                          className="ml-2 text-red-500"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </div>
                  ))}
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={addOption}
                    size="small"
                    className="mt-2"
                  >
                    Add Option
                  </Button>
                </div>
              )}
              
              {currentQuestion.type === "truefalse" && (
                <FormControl component="fieldset" className="mb-4">
                  <Typography variant="subtitle2" className="mb-2">Correct Answer</Typography>
                  <RadioGroup
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: parseInt(e.target.value)})}
                  >
                    <FormControlLabel value={0} control={<Radio />} label="True" />
                    <FormControlLabel value={1} control={<Radio />} label="False" />
                  </RadioGroup>
                </FormControl>
              )}
              
              <TextField 
                label="Points" 
                type="number"
                value={currentQuestion.points} 
                onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 1})} 
                variant="outlined"
                size="small"
                className="w-32"
              />
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="contained" 
                  onClick={addQuestion}
                  startIcon={editingQuestionIndex !== null ? <SaveIcon /> : <AddIcon />}
                  disabled={!currentQuestion.text}
                >
                  {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                </Button>
              </div>
            </div>
            
            <Typography variant="subtitle1" className="font-medium">
              Added Questions ({testForm.questions.length})
            </Typography>
            
            {testForm.questions.length === 0 ? (
              <Typography variant="body2" color="textSecondary" className="text-center py-4">
                No questions added yet. Add questions using the form above.
              </Typography>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {testForm.questions.map((question, index) => (
                  <Accordion key={index} className="mb-2">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <div className="flex items-center justify-between w-full mr-2">
                        <Typography className="font-medium">Q{index + 1}: {question.text.length > 50 ? `${question.text.substring(0, 50)}...` : question.text}</Typography>
                        <Chip label={`${question.points} pt${question.points !== 1 ? 's' : ''}`} size="small" />
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="flex justify-end gap-2 mb-2">
                        <Button 
                          size="small" 
                          startIcon={<SaveIcon />}
                          onClick={() => editQuestion(index)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteQuestion(index)}
                        >
                          Delete
                        </Button>
                      </div>
                      {question.type === "mcq" && (
                        <div>
                          <Typography variant="body2" className="font-medium mb-2">Options:</Typography>
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center mb-1">
                              <Radio 
                                checked={question.correctAnswer === optIndex}
                                disabled
                              />
                              <Typography variant="body2" className={question.correctAnswer === optIndex ? "text-green-600 font-medium" : ""}>
                                {option}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === "truefalse" && (
                        <Typography variant="body2">
                          Correct Answer: {question.correctAnswer === 0 ? "True" : "False"}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button onClick={() => setTestDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleTestSave} 
            variant="contained" 
            disabled={testForm.questions.length === 0 || !testForm.title}
            className="bg-gradient-to-r from-blue-600 to-blue-800"
          >
            Create Test
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3500} 
        onClose={() => setToast(t => ({ ...t, open: false }))} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={toast.severity} 
          onClose={() => setToast(t => ({ ...t, open: false }))}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center"
          >
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body2" className="mt-3 text-gray-600 dark:text-gray-300">Loading data...</Typography>
          </motion.div>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      {activeMenu === "tests" && isMobile && (
        <Fab 
          color="primary" 
          aria-label="create test" 
          className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-blue-800 md:hidden"
          onClick={handleTestCreate}
        >
          <AddIcon />
        </Fab>
      )}
    </div>
  );
}