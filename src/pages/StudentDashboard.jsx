// src/pages/StudentDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  useMediaQuery,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  useScrollTrigger,
  Slide,
  Fab,
  Zoom,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Rating,
  Tooltip,
  Container,
  Stack,
  Breadcrumbs,
  Link as MuiLink
} from "@mui/material";
import {
  motion,
  AnimatePresence,
  LayoutGroup
} from "framer-motion";
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Description as PdfIcon,
  Quiz as TestIcon,
  Home as HomeIcon,
  VideoLibrary as VideoIcon,
  Menu as MenuIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  YouTube as YouTubeIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Assignment as AssignmentIcon,
  ArrowUpward as ArrowUpwardIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Quiz as QuizIcon,
  NavigateNext as NavigateNextIcon,
  Bookmark as BookmarkIcon,
  Bookmarks as BookmarksIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon
} from "@mui/icons-material";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// Hide on scroll for AppBar
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const StudentDashboard = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [tests, setTests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userStats, setUserStats] = useState({
    completedTests: 0,
    averageScore: 0,
    totalStudyTime: 0,
    enrolledCourses: 0,
    achievements: 0
  });
  const [openVideo, setOpenVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [openTest, setOpenTest] = useState(null);
  const [testDetail, setTestDetail] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Redirect if not student
  useEffect(() => {
    if (!token || !user || user.role !== "student") {
      navigate("/login");
    }
  }, [navigate, token, user]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setShowScrollTop(scrollTop > 300);
      }
    };
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- Fetch APIs ---
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await API.get("/videos");
      setVideos(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/pdfs");
      setPdfs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/tests");
      setTests(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await API.get("/users/stats");
      if (res.data.success) {
        setUserStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const res = await API.get("/tests/history");
      if (res.data.success) {
        setTestHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmarks");
      setBookmarkedItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (tab === 0) fetchVideos();
    if (tab === 1) fetchPdfs();
    if (tab === 2) {
      fetchTests();
      fetchTestHistory();
    }
    fetchNotifications();
    fetchUserStats();
    fetchBookmarks();
  }, [tab]);

  // --- Video ---
  const handleOpenVideo = (video) => {
    setCurrentVideo(video);
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
    setCurrentVideo(null);
  };

  // --- Tests ---
  const startTest = async (testId) => {
    try {
      setLoading(true);
      const res = await API.get(`/tests/${testId}`);
      if (!res.data.success) {
        alert(res.data.message || "Failed to fetch test");
        return;
      }
      
      const payloadTest = res.data.data || res.data;
      
      if (!payloadTest.questions || !Array.isArray(payloadTest.questions)) {
        alert("This test has no questions. Please contact your administrator.");
        return;
      }
      setTestDetail(payloadTest);
      setOpenTest(testId);
      setAnswers({});
      setResult(null);
      const durationMinutes = Number(payloadTest.duration || 30);
      const seconds = durationMinutes * 60;
      setTimeLeft(seconds);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
      alert("Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIdx, choice) => {
    setAnswers((a) => ({ ...a, [qIdx]: choice }));
  };

  const handleMultiSelect = (qIdx, optionIdx, checked) => {
    setAnswers((prev) => {
      const currentAnswers = prev[qIdx] || [];
      let newAnswers;
      if (checked) {
        newAnswers = [...currentAnswers, optionIdx];
      } else {
        newAnswers = currentAnswers.filter(idx => idx !== optionIdx);
      }
      return { ...prev, [qIdx]: newAnswers };
    });
  };

  const handleSubmitTest = async () => {
  if (!testDetail || !openTest) return;

  try {
    // ✅ Get student info (from localStorage or context)
    const student = JSON.parse(localStorage.getItem("student"));
    if (!student || !student._id) {
      alert("Student not found! Please login again.");
      return;
    }

    // ✅ Prepare payload
    const payload = {
      studentId: student._id,        // ✅ Must send studentId
      testId: openTest,             // ✅ Must send testId
      answers: Object.entries(answers).map(([qIdx, answer]) => ({
        questionIndex: Number(qIdx),
        selected: Array.isArray(answer) ? answer : [answer],
      })),
    };

    // ✅ API call
    const res = await API.post(`/tests/${openTest}/submit`, payload);

    // ✅ Handle response
    if (res.data.success) {
      setResult(res.data.data);
      fetchTests();
      fetchTestHistory();
      fetchUserStats();
      alert("Test submitted successfully!");
    } else {
      alert(res.data.message || "Submission failed");
    }

    // ✅ Stop timer
    if (timerRef.current) clearInterval(timerRef.current);
  } catch (e) {
    console.error("Submit Test Error:", e);
    if (e.response && e.response.data && e.response.data.message) {
      alert(e.response.data.message);
    } else {
      alert("Submit failed due to server error!");
    }
  }
};


  const formatTime = (s) => {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  const getVideoEmbed = (link) => {
    if (!link) return null;
    try {
      if (link.includes("youtube.com") || link.includes("youtu.be")) {
        let videoId = "";
        if (link.includes("youtube.com")) {
          const urlParams = new URLSearchParams(new URL(link).search);
          videoId = urlParams.get("v");
        } else if (link.includes("youtu.be")) {
          videoId = link.split("/").pop();
        }
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      return link;
    } catch (err) {
      return link;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getProgressValue = () => {
    if (!testDetail || !testDetail.duration) return 0;
    const totalSeconds = testDetail.duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Check if test is completed by current user
  const isTestCompleted = (testId) => {
    return testHistory.some(history => history.testId === testId);
  };

  // Get test score if completed
  const getTestScore = (testId) => {
    const history = testHistory.find(history => history.testId === testId);
    return history ? history.score : null;
  };

  // Check if item is bookmarked
  const isBookmarked = (id, type) => {
    return bookmarkedItems.some(item => item.itemId === id && item.type === type);
  };

  // Toggle bookmark
  const toggleBookmark = async (id, type, title) => {
    try {
      if (isBookmarked(id, type)) {
        await API.delete(`/bookmarks/${id}/${type}`);
        setBookmarkedItems(bookmarkedItems.filter(item => !(item.itemId === id && item.type === type)));
      } else {
        await API.post("/bookmarks", { itemId: id, type, title });
        setBookmarkedItems([...bookmarkedItems, { itemId: id, type, title }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter items based on search and filter
  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = searchQuery === "" || 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filter === "all" || 
        (filter === "bookmarked" && isBookmarked(item._id, tab === 0 ? "video" : tab === 1 ? "pdf" : "test"));
      
      return matchesSearch && matchesFilter;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Render question based on type
  const renderQuestion = (q, idx) => {
    const question = testDetail?.questions?.[idx] || q;
    
    if (!question) {
      return (
        <Typography variant="body2" color="error">
          Question data not available
        </Typography>
      );
    }
    
    const questionText = question.text || "Untitled Question";
    
    switch (question.type) {
      case "mcq":
        const options = question.options || ["Untitled Option 1", "Untitled Option 2"];
        return (
          <RadioGroup
            value={answers[idx] || ""}
            onChange={(e) => handleSelect(idx, e.target.value)}
          >
            {options.map((option, optIdx) => (
              <FormControlLabel
                key={optIdx}
                value={optIdx.toString()}
                control={<Radio />}
                label={
                  <Typography variant="body1">
                    <Box component="span" fontWeight="bold">
                      {String.fromCharCode(65 + optIdx)}:
                    </Box> {option || `Untitled Option ${optIdx + 1}`}
                  </Typography>
                }
                sx={{ 
                  mb: 1, 
                  borderRadius: 1, 
                  px: 1, 
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              />
            ))}
          </RadioGroup>
        );
      
      case "truefalse":
        return (
          <RadioGroup
            value={answers[idx] || ""}
            onChange={(e) => handleSelect(idx, e.target.value)}
          >
            <FormControlLabel
              value="0"
              control={<Radio />}
              label="True"
              sx={{ mb: 1, borderRadius: 1, px: 1, py: 0.5 }}
            />
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="False"
              sx={{ mb: 1, borderRadius: 1, px: 1, py: 0.5 }}
            />
          </RadioGroup>
        );
      
      case "multiselect":
        const currentAnswers = answers[idx] || [];
        const multiOptions = question.options || ["Untitled Option 1", "Untitled Option 2"];
        return (
          <FormGroup>
            {multiOptions.map((option, optIdx) => (
              <FormControlLabel
                key={optIdx}
                control={
                  <Checkbox
                    checked={currentAnswers.includes(optIdx.toString())}
                    onChange={(e) => handleMultiSelect(idx, optIdx.toString(), e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body1">
                    <Box component="span" fontWeight="bold">
                      {String.fromCharCode(65 + optIdx)}:
                    </Box> {option || `Untitled Option ${optIdx + 1}`}
                  </Typography>
                }
                sx={{ 
                  mb: 1, 
                  borderRadius: 1, 
                  px: 1, 
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              />
            ))}
          </FormGroup>
        );
      
      default:
        return (
          <Typography variant="body2" color="error">
            Unsupported question type: {question.type}
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: `linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(100, 181, 246, 0.1) 0%, transparent 20%),
                            radial-gradient(circle at 90% 80%, rgba(156, 39, 176, 0.1) 0%, transparent 20%),
                            linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 50%, 
                            rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.02) 75%, transparent 75%, transparent)`,
          backgroundSize: "100px 100px",
          zIndex: -1,
        }
      }}
    >
      {/* App Bar */}
      <HideOnScroll>
        <AppBar 
          position="sticky" 
          color="default" 
          elevation={0}
          sx={{ 
            background: "rgba(255, 255, 255, 0.95)",
            color: theme.palette.text.primary,
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                mr: 2,
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.2)",
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              background: "linear-gradient(90deg, #2196F3, #9C27B0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              EduPortal
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(33, 150, 243, 0.2)",
                    }
                  }}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ 
                    ml: 1,
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 0.2)",
                    }
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%)",
            boxShadow: "0 0 30px rgba(0, 0, 0, 0.1)",
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          }
        }}
      >
        <Box sx={{ 
          p: 3, 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          background: "linear-gradient(90deg, #2196F3, #9C27B0)",
          color: "white",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}>
          <Avatar
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.3)",
              fontSize: "28px",
              fontWeight: "bold"
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600">
              {user?.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Student Dashboard
            </Typography>
          </Box>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem 
            button 
            selected={tab === 0} 
            onClick={() => { setTab(0); setDrawerOpen(false); }}
            sx={{
              borderRadius: "0 24px 24px 0",
              mx: 1,
              my: 0.5,
              "&.Mui-selected": {
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                borderLeft: "4px solid #2196F3",
              },
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.05)",
              }
            }}
          >
            <ListItemIcon>
              <VideoIcon color={tab === 0 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Videos" />
          </ListItem>
          <ListItem 
            button 
            selected={tab === 1} 
            onClick={() => { setTab(1); setDrawerOpen(false); }}
            sx={{
              borderRadius: "0 24px 24px 0",
              mx: 1,
              my: 0.5,
              "&.Mui-selected": {
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                borderLeft: "4px solid #2196F3",
              },
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.05)",
              }
            }}
          >
            <ListItemIcon>
              <PdfIcon color={tab === 1 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="PDFs" />
          </ListItem>
          <ListItem 
            button 
            selected={tab === 2} 
            onClick={() => { setTab(2); setDrawerOpen(false); }}
            sx={{
              borderRadius: "0 24px 24px 0",
              mx: 1,
              my: 0.5,
              "&.Mui-selected": {
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                borderLeft: "4px solid #2196F3",
              },
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.05)",
              }
            }}
          >
            <ListItemIcon>
              <TestIcon color={tab === 2 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Tests" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => { setDrawerOpen(false); }}
            sx={{
              borderRadius: "0 24px 24px 0",
              mx: 1,
              my: 0.5,
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.05)",
              }
            }}
          >
            <ListItemIcon>
              <BookmarksIcon />
            </ListItemIcon>
            <ListItemText primary="Bookmarks" />
          </ListItem>
        </List>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Your Progress
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Tests Completed</Typography>
              <Chip 
                label={userStats.completedTests} 
                size="small" 
                sx={{ 
                  fontWeight: "bold",
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  color: "#2196F3",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Average Score</Typography>
              <Chip 
                label={`${userStats.averageScore}%`} 
                size="small" 
                sx={{ 
                  fontWeight: "bold",
                  backgroundColor: "rgba(156, 39, 176, 0.1)",
                  color: "#9C27B0",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Study Time</Typography>
              <Chip 
                label={`${Math.floor(userStats.totalStudyTime / 60)}h`} 
                size="small" 
                sx={{ 
                  fontWeight: "bold",
                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                  color: "#4CAF50",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Achievements</Typography>
              <Chip 
                label={userStats.achievements} 
                size="small" 
                sx={{ 
                  fontWeight: "bold",
                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                  color: "#FF9800",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <List sx={{ p: 0 }}>
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              borderRadius: "0 24px 24px 0",
              mx: 1,
              my: 0.5,
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.05)",
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ color: "error" }} />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          pb: { xs: 10, sm: 3 },
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 5 }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <MuiLink 
                  color="inherit" 
                  href="#" 
                  onClick={() => setTab(0)}
                  sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    "&:hover": {
                      color: "#2196F3",
                    }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  Dashboard
                </MuiLink>
                <Typography color="text.primary">
                  {tab === 0 ? "Videos" : tab === 1 ? "PDFs" : "Tests"}
                </Typography>
              </Breadcrumbs>
              
              <Typography variant="h4" fontWeight="700" gutterBottom sx={{ 
                background: "linear-gradient(90deg, #2196F3, #9C27B0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                Continue your learning journey with the materials below.
              </Typography>
              
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: "100%",
                    background: "linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)",
                    color: "white",
                    boxShadow: "0 8px 16px rgba(33, 150, 243, 0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 24px rgba(33, 150, 243, 0.3)",
                    }
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <CheckCircleIcon />
                      </Box>
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {userStats.completedTests}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Tests Completed
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: "100%",
                    background: "linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)",
                    color: "white",
                    boxShadow: "0 8px 16px rgba(156, 39, 176, 0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 24px rgba(156, 39, 176, 0.3)",
                    }
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <TrendingUpIcon />
                      </Box>
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {userStats.averageScore}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Average Score
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: "100%",
                    background: "linear-gradient(135deg, #81C784 0%, #4CAF50 100%)",
                    color: "white",
                    boxShadow: "0 8px 16px rgba(76, 175, 80, 0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 24px rgba(76, 175, 80, 0.3)",
                    }
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <AccessTimeIcon />
                      </Box>
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {Math.floor(userStats.totalStudyTime / 60)}h
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Study Time
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: "100%",
                    background: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
                    color: "white",
                    boxShadow: "0 8px 16px rgba(255, 152, 0, 0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 24px rgba(255, 152, 0, 0.3)",
                    }
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <EmojiEventsIcon />
                      </Box>
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {userStats.achievements}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Achievements
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* Content Tabs */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              mb: 4,
              background: "white",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              position: "sticky",
              top: isMobile ? 56 : 64,
              zIndex: 10,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
            }}
          >
            <Tabs
              value={tab}
              onChange={(e, newTab) => setTab(newTab)}
              indicatorColor="primary"
              textColor="primary"
              centered={!isMobile}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                "& .MuiTab-root": {
                  py: 2.5,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  minWidth: { xs: 80, sm: 120 },
                  transition: "all 0.3s",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "#2196F3",
                    transform: "scaleX(0)",
                    transition: "transform 0.3s",
                  },
                  "&.Mui-selected::after": {
                    transform: "scaleX(1)",
                  }
                }
              }}
            >
              <Tab 
                icon={<VideoIcon />} 
                iconPosition="start" 
                label="Videos" 
                sx={{ 
                  "&.Mui-selected": {
                    color: "#2196F3",
                    fontWeight: 600,
                  }
                }} 
              />
              <Tab 
                icon={<PdfIcon />} 
                iconPosition="start" 
                label="PDFs" 
                sx={{ 
                  "&.Mui-selected": {
                    color: "#2196F3",
                    fontWeight: 600,
                  }
                }} 
              />
              <Tab 
                icon={<TestIcon />} 
                iconPosition="start" 
                label="Tests" 
                sx={{ 
                  "&.Mui-selected": {
                    color: "#2196F3",
                    fontWeight: 600,
                  }
                }} 
              />
            </Tabs>
          </Paper>

          {/* Search and Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: "white",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", position: "relative" }}>
              <SearchIcon sx={{ position: "absolute", left: 12, color: theme.palette.text.secondary }} />
              <input
                type="text"
                placeholder={`Search ${tab === 0 ? "videos" : tab === 1 ? "PDFs" : "tests"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  borderRadius: 12,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  background: "#f8f9fa",
                  fontSize: "0.875rem",
                  transition: "all 0.3s",
                  "&:focus": {
                    outline: "none",
                    borderColor: "#2196F3",
                    boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.2)",
                  }
                }}
              />
            </Box>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="filter-label">Filter</InputLabel>
              <Select
                labelId="filter-label"
                value={filter}
                label="Filter"
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="all">All Items</MenuItem>
                <MenuItem value="bookmarked">Bookmarked</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {/* Content Section */}
          {!loading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Videos */}
              {tab === 0 && (
                <Grid container spacing={3}>
                  {filterItems(videos).length ? (
                    filterItems(videos).map((v) => (
                      <Grid key={v._id} item xs={12} sm={6} md={4} lg={3}>
                        <motion.div variants={itemVariants}>
                          <Card
                            elevation={0}
                            sx={{
                              borderRadius: 3,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              background: "white",
                              transition: "all 0.3s ease-in-out",
                              overflow: "hidden",
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                paddingTop: "56.25%", // 16:9 aspect ratio
                                background: "linear-gradient(45deg, #64B5F6 0%, #2196F3 100%)",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "rgba(0,0,0,0.1)",
                                }}
                              >
                                <PlayIcon sx={{ fontSize: 64, color: "#fff", opacity: 0.8 }} />
                              </Box>
                              {v.duration && (
                                <Chip
                                  icon={<AccessTimeIcon />}
                                  label={v.duration}
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    bottom: 12,
                                    right: 12,
                                    background: "rgba(0,0,0,0.7)",
                                    color: "#fff",
                                  }}
                                />
                              )}
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  background: "rgba(255,255,255,0.7)",
                                  "&:hover": {
                                    background: "rgba(255,255,255,0.9)",
                                  }
                                }}
                                onClick={() => toggleBookmark(v._id, "video", v.title)}
                              >
                                {isBookmarked(v._id, "video") ? (
                                  <BookmarkIcon color="primary" />
                                ) : (
                                  <BookmarkIcon />
                                )}
                              </IconButton>
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" fontWeight="600" gutterBottom>
                                {v.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {v.description}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                <Rating value={v.rating || 0} precision={0.5} size="small" readOnly />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  ({v.reviews || 0})
                                </Typography>
                              </Box>
                              {v.tags && (
                                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                  {v.tags.slice(0, 3).map((tag, index) => (
                                    <Chip
                                      key={index}
                                      label={tag}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              )}
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<PlayIcon />}
                                onClick={() => handleOpenVideo(v)}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.2,
                                  fontWeight: 600,
                                  background: "linear-gradient(90deg, #2196F3, #9C27B0)",
                                  "&:hover": {
                                    background: "linear-gradient(90deg, #1976D2, #7B1FA2)",
                                  }
                                }}
                              >
                                Watch Now
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))
                  ) : (
                    <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                      <VideoIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No videos available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check back later for new content
                      </Typography>
                    </Box>
                  )}
                </Grid>
              )}

              {/* PDFs */}
              {tab === 1 && (
                <Grid container spacing={3}>
                  {filterItems(pdfs).length ? (
                    filterItems(pdfs).map((p) => (
                      <Grid key={p._id} item xs={12} sm={6} md={4} lg={3}>
                        <motion.div variants={itemVariants}>
                          <Card
                            elevation={0}
                            sx={{
                              borderRadius: 3,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              background: "white",
                              transition: "all 0.3s ease-in-out",
                              overflow: "hidden",
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 140,
                                background: "linear-gradient(45deg, #EF5350 0%, #E53935 100%)",
                                position: "relative",
                              }}
                            >
                              <PdfIcon sx={{ fontSize: 64, color: "white" }} />
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  background: "rgba(255,255,255,0.7)",
                                  "&:hover": {
                                    background: "rgba(255,255,255,0.9)",
                                  }
                                }}
                                onClick={() => toggleBookmark(p._id, "pdf", p.title)}
                              >
                                {isBookmarked(p._id, "pdf") ? (
                                  <BookmarkIcon color="primary" />
                                ) : (
                                  <BookmarkIcon />
                                )}
                              </IconButton>
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" fontWeight="600" gutterBottom>
                                {p.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {p.description}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                {p.pageCount && (
                                  <Chip
                                    icon={<PictureAsPdfIcon />}
                                    label={`${p.pageCount} pages`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                                {p.size && (
                                  <Chip
                                    label={p.size}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                              <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<PdfIcon />}
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  borderRadius: 2,
                                  py: 1.2,
                                  fontWeight: 600,
                                  borderColor: "#E53935",
                                  color: "#E53935",
                                  "&:hover": {
                                    borderColor: "#D32F2F",
                                    backgroundColor: "rgba(229, 57, 53, 0.04)",
                                  }
                                }}
                              >
                                Open PDF
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))
                  ) : (
                    <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                      <PdfIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No PDFs available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check back later for new content
                      </Typography>
                    </Box>
                  )}
                </Grid>
              )}

              {/* Tests */}
              {tab === 2 && (
                <Box>
                  {/* Test History Section */}
                  {testHistory.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" fontWeight="600" gutterBottom>
                        Your Test History
                      </Typography>
                      <Grid container spacing={2}>
                        {testHistory.slice(0, 3).map((history) => (
                          <Grid key={history._id} item xs={12} md={4}>
                            <Paper elevation={0} sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              background: "white",
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              transition: "transform 0.3s, box-shadow 0.3s",
                              "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                              }
                            }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                <Typography variant="h6" fontWeight="600">
                                  {history.testTitle}
                                </Typography>
                                <Chip 
                                  label={`${history.score}%`} 
                                  color={history.score >= 70 ? "success" : history.score >= 50 ? "warning" : "error"}
                                  size="small"
                                  sx={{ fontWeight: "bold" }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Completed on {new Date(history.completedAt).toLocaleDateString()}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={history.score} 
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: "#f0f0f0",
                                }}
                                color={history.score >= 70 ? "success" : history.score >= 50 ? "warning" : "error"}
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Available Tests */}
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    Available Tests
                  </Typography>
                  {filterItems(tests).length ? (
                    <Grid container spacing={3}>
                      {filterItems(tests).map((t) => {
                        const completed = isTestCompleted(t._id);
                        const score = getTestScore(t._id);
                        return (
                          <Grid key={t._id} item xs={12} sm={6} md={4} lg={3}>
                            <motion.div variants={itemVariants}>
                              <Card
                                elevation={0}
                                sx={{
                                  borderRadius: 3,
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  background: "white",
                                  transition: "all 0.3s ease-in-out",
                                  overflow: "hidden",
                                  border: "1px solid rgba(0, 0, 0, 0.08)",
                                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                                  "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 140,
                                    background: completed 
                                      ? "linear-gradient(45deg, #81C784 0%, #4CAF50 100%)"
                                      : "linear-gradient(45deg, #64B5F6 0%, #2196F3 100%)",
                                    position: "relative",
                                  }}
                                >
                                  <TestIcon sx={{ 
                                    fontSize: 64, 
                                    color: "white"
                                  }} />
                                  {completed && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                      }}
                                    >
                                      <CheckCircleIcon sx={{ color: "white" }} />
                                    </Box>
                                  )}
                                  <IconButton
                                    sx={{
                                      position: "absolute",
                                      top: 12,
                                      right: 12,
                                      background: "rgba(255,255,255,0.7)",
                                      "&:hover": {
                                        background: "rgba(255,255,255,0.9)",
                                      }
                                    }}
                                    onClick={() => toggleBookmark(t._id, "test", t.title)}
                                  >
                                    {isBookmarked(t._id, "test") ? (
                                      <BookmarkIcon color="primary" />
                                    ) : (
                                      <BookmarkIcon />
                                    )}
                                  </IconButton>
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                  <Typography variant="h6" fontWeight="600" gutterBottom>
                                    {t.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {t.description}
                                  </Typography>
                                  <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                                    <Chip
                                      icon={<AccessTimeIcon />}
                                      label={`${t.duration || 30} min`}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <Chip
                                      icon={<PsychologyIcon />}
                                      label={`${t.questions?.length || 0} questions`}
                                      size="small"
                                      variant="outlined"
                                    />
                                    {t.passingScore && (
                                      <Chip
                                        icon={<EmojiEventsIcon />}
                                        label={`Pass: ${t.passingScore}%`}
                                        size="small"
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                  {completed && score !== null && (
                                    <Box sx={{ mt: 2 }}>
                                      <Typography variant="body2" fontWeight="medium">
                                        Your Score: {score}%
                                      </Typography>
                                      <LinearProgress 
                                        variant="determinate" 
                                        value={score} 
                                        sx={{ 
                                          height: 8, 
                                          borderRadius: 4, 
                                          mt: 1,
                                          backgroundColor: "#f0f0f0",
                                          "& .MuiLinearProgress-bar": {
                                            backgroundColor: score >= (t.passingScore || 60) 
                                              ? "#4CAF50" 
                                              : "#F44336"
                                          }
                                        }}
                                      />
                                    </Box>
                                  )}
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                  <Button
                                    variant="contained"
                                    color={completed ? "success" : "primary"}
                                    fullWidth
                                    startIcon={completed ? <VisibilityIcon /> : <QuizIcon />}
                                    onClick={() => completed ? alert("You've already completed this test") : startTest(t._id)}
                                    sx={{
                                      borderRadius: 2,
                                      py: 1.2,
                                      fontWeight: 600,
                                      background: completed 
                                        ? "linear-gradient(90deg, #81C784, #4CAF50)"
                                        : "linear-gradient(90deg, #2196F3, #9C27B0)",
                                      "&:hover": {
                                        background: completed 
                                          ? "linear-gradient(90deg, #66BB6A, #43A047)"
                                          : "linear-gradient(90deg, #1976D2, #7B1FA2)",
                                      }
                                    }}
                                  >
                                    {completed ? "View Results" : "Start Test"}
                                  </Button>
                                </CardActions>
                              </Card>
                            </motion.div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                      <TestIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No tests available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check back later for new content
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </motion.div>
          )}
        </Container>

        {/* Scroll to Top Button */}
        <Zoom in={showScrollTop}>
          <Fab
            color="primary"
            aria-label="scroll to top"
            onClick={scrollToTop}
            sx={{
              position: "fixed",
              bottom: { xs: 80, sm: 24 },
              right: 24,
              background: "linear-gradient(135deg, #2196F3, #9C27B0)",
              "&:hover": {
                background: "linear-gradient(135deg, #1976D2, #7B1FA2)",
              }
            }}
          >
            <ArrowUpwardIcon />
          </Fab>
        </Zoom>
      </Box>

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            background: "white",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.05)",
          }}
          elevation={0}
        >
          <BottomNavigation
            showLabels
            value={tab}
            onChange={(event, newValue) => {
              setTab(newValue);
            }}
            sx={{
              "& .MuiBottomNavigationAction-root": {
                paddingTop: 1.5,
                paddingBottom: 1.5,
                "&.Mui-selected": {
                  color: "#2196F3",
                }
              }
            }}
          >
            <BottomNavigationAction 
              label="Videos" 
              icon={<VideoIcon />} 
              sx={{ 
                "&.Mui-selected": {
                  color: "#2196F3",
                }
              }} 
            />
            <BottomNavigationAction 
              label="PDFs" 
              icon={<PdfIcon />} 
              sx={{ 
                "&.Mui-selected": {
                  color: "#2196F3",
                }
              }} 
            />
            <BottomNavigationAction 
              label="Tests" 
              icon={<TestIcon />} 
              sx={{ 
                "&.Mui-selected": {
                  color: "#2196F3",
                }
              }} 
            />
          </BottomNavigation>
        </Paper>
      )}

      {/* Video Dialog */}
      <Dialog
        open={openVideo}
        onClose={handleCloseVideo}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Slide}
        transitionDuration={300}
        PaperProps={{
          sx: {
            background: "white",
            overflow: "hidden",
            borderRadius: 3,
          }
        }}
      >
        <AppBar position="sticky" elevation={0} sx={{ px: 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseVideo}
              aria-label="close"
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {currentVideo?.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0, background: "#000" }}>
          {currentVideo && getVideoEmbed(currentVideo.link) && (
            currentVideo.link.includes("youtube.com") ||
            currentVideo.link.includes("youtu.be") ? (
              <iframe
                src={getVideoEmbed(currentVideo.link)}
                title={currentVideo.title}
                width="100%"
                height={isMobile ? "300px" : "540px"}
                allow="autoplay; fullscreen"
                style={{ border: "none", display: "block" }}
                allowFullScreen
              />
            ) : (
              <video
                src={currentVideo.link}
                controls
                autoPlay
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog
        open={!!openTest}
        onClose={() => {
          if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
            setOpenTest(null);
            setTestDetail(null);
            setResult(null);
            if (timerRef.current) clearInterval(timerRef.current);
          }
        }}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            background: "white",
          }
        }}
      >
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
                  setOpenTest(null);
                  setTestDetail(null);
                  setResult(null);
                  if (timerRef.current) clearInterval(timerRef.current);
                }
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
              {testDetail?.title}
            </Typography>
            {!result && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TimerIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            )}
          </Toolbar>
          {!result && (
            <LinearProgress
              variant="determinate"
              value={getProgressValue()}
              color={timeLeft < 60 ? "error" : "primary"}
              sx={{ height: 4 }}
            />
          )}
        </AppBar>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {!testDetail && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {testDetail && !result && (
            <Box>
              {testDetail.questions && Array.isArray(testDetail.questions) && testDetail.questions.length > 0 ? (
                testDetail.questions.map((q, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: "white",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        <Box component="span" fontWeight="bold">
                          Q{idx + 1}.
                        </Box> {q.text || "Untitled Question"}
                        <Typography
                          component="span"
                          sx={{ ml: 1, fontSize: "0.8rem", color: "text.secondary" }}
                        >
                          ({q.points || 1} point{q.points !== 1 ? 's' : ''})
                        </Typography>
                        {q.type === "multiselect" && (
                          <Typography
                            component="div"
                            variant="caption"
                            sx={{ display: "block", color: "#2196F3", mt: 0.5 }}
                          >
                            (Select all that apply)
                          </Typography>
                        )}
                      </Typography>
                      {renderQuestion(q, idx)}
                    </Paper>
                  </motion.div>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="error">
                    No questions available for this test.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please contact your administrator.
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2, px: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to submit your test?")) {
                      handleSubmitTest();
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    fontWeight: 600,
                    background: "linear-gradient(90deg, #2196F3, #9C27B0)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1976D2, #7B1FA2)",
                    }
                  }}
                >
                  Submit Test
                </Button>
              </Box>
            </Box>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ textAlign: "center", py: 2 }}>
                <EmojiEventsIcon sx={{ fontSize: 64, color: "#2196F3", mb: 2 }} />
                <Typography variant="h4" gutterBottom color="primary">
                  Test Completed!
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Your Score: {result.score} / {result.totalMarks}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {result.score >= result.totalMarks * 0.7
                    ? "Excellent work! You've mastered this material."
                    : result.score >= result.totalMarks * 0.5
                    ? "Good effort! Review the materials and try again."
                    : "Keep practicing! You'll improve with more study."}
                </Typography>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Question Review:
                </Typography>
                {(result.answers || []).map((a, i) => {
                  const question = testDetail?.questions?.[a.questionIndex];
                  if (!question) return null;
                  return (
                    <Paper
                      key={i}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: a.correct
                          ? "rgba(76, 175, 80, 0.1)"
                          : "rgba(244, 67, 54, 0.1)",
                        border: `1px solid ${a.correct ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"}`,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        <Box component="span" fontWeight="bold">
                          Q{a.questionIndex + 1}:
                        </Box> {question.text || "Untitled Question"}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        <Chip
                          label={`Your answer: ${Array.isArray(a.selected) ? a.selected.map(s => String.fromCharCode(65 + parseInt(s))).join(", ") : "Not answered"}`}
                          color={a.correct ? "success" : "error"}
                          variant="outlined"
                          size="small"
                        />
                        {!a.correct && (
                          <Chip
                            label={`Correct answer: ${Array.isArray(question.correctAnswer) 
                              ? question.correctAnswer.map(ca => String.fromCharCode(65 + parseInt(ca))).join(", ")
                              : String.fromCharCode(65 + parseInt(question.correctAnswer))}`}
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        <Chip
                          label={`Points: ${a.marksObtained}/${question.points || 1}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenTest(null);
                    setTestDetail(null);
                    setResult(null);
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    fontWeight: 600,
                    background: "linear-gradient(90deg, #2196F3, #9C27B0)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1976D2, #7B1FA2)",
                    }
                  }}
                >
                  Finish Review
                </Button>
              </Box>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;