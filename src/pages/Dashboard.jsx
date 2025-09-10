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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel as MuiFormControlLabel,
  TextField
} from "@mui/material";
import {
  motion,
  AnimatePresence
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
  Save as SaveIcon,
  Send as SendIcon
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
  const scrollContainerRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Track completed tests
  const [completedTests, setCompletedTests] = useState({});

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

  // Check if test is completed
  const checkTestCompletion = async (testId) => {
    try {
      const res = await API.get(`/tests/${testId}/result`);
      if (res.data && res.data.completed) {
        setCompletedTests(prev => ({ ...prev, [testId]: true }));
        return true;
      }
    } catch (err) {
      console.error("Error checking test completion:", err);
    }
    return false;
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
      const testsData = res.data.data || res.data || [];
      setTests(testsData);
      
      // Check completion status for each test
      const completionStatus = {};
      for (const test of testsData) {
        completionStatus[test._id] = await checkTestCompletion(test._id);
      }
      setCompletedTests(completionStatus);
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

  useEffect(() => {
    if (tab === 0) fetchVideos();
    if (tab === 1) fetchPdfs();
    if (tab === 2) fetchTests();
    fetchNotifications();
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
      const payloadTest = res.data.data;
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

  const handleSelect = (qIdx, value) => {
    setAnswers((a) => ({ ...a, [qIdx]: value }));
  };

  const handleSubmitTest = async () => {
    if (!testDetail || !openTest) return;
    try {
      // Format answers according to the test structure
      const formattedAnswers = Object.entries(answers).map(([qIndex, answer]) => {
        const question = testDetail.questions[qIndex];
        return {
          questionId: question._id || qIndex,
          selectedAnswer: answer,
          questionType: question.type
        };
      });

      const payload = {
        testId: openTest,
        answers: formattedAnswers,
        timeSpent: (testDetail.duration * 60) - timeLeft
      };

      const res = await API.post(`/tests/${openTest}/submit`, payload);
      
      if (res.data.success) {
        setResult(res.data.data);
        setCompletedTests(prev => ({ ...prev, [openTest]: true }));
      } else {
        alert(res.data.message || "Submission failed");
      }
      
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (e) {
      console.error(e);
      alert("Submit failed");
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

  // Calculate total marks for a test
  const calculateTotalMarks = (test) => {
    if (test.totalMarks) return test.totalMarks;
    return test.questions ? test.questions.reduce((sum, q) => sum + (q.points || 1), 0) : 0;
  };

  // Render question based on type
  const renderQuestion = (question, index) => {
    switch (question.type) {
      case "mcq":
        return (
          <RadioGroup
            value={answers[index] || ""}
            onChange={(e) => handleSelect(index, e.target.value)}
          >
            {question.options.map((option, optIndex) => (
              <FormControlLabel
                key={optIndex}
                value={optIndex.toString()}
                control={<Radio />}
                label={
                  <Typography variant="body1">
                    <Box component="span" fontWeight="bold">
                      {String.fromCharCode(65 + optIndex)}:
                    </Box> {option}
                  </Typography>
                }
                sx={{ mb: 1, borderRadius: 1, px: 1, py: 0.5 }}
              />
            ))}
          </RadioGroup>
        );
      
      case "truefalse":
        return (
          <RadioGroup
            value={answers[index] || ""}
            onChange={(e) => handleSelect(index, e.target.value)}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="True"
              sx={{ mb: 1, borderRadius: 1, px: 1, py: 0.5 }}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="False"
              sx={{ mb: 1, borderRadius: 1, px: 1, py: 0.5 }}
            />
          </RadioGroup>
        );
      
      default:
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={answers[index] || ""}
            onChange={(e) => handleSelect(index, e.target.value)}
            placeholder="Type your answer here..."
            variant="outlined"
            sx={{ mt: 1 }}
          />
        );
    }
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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* App Bar */}
      <HideOnScroll>
        <AppBar 
          position="sticky" 
          color="default" 
          elevation={1}
          sx={{ 
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              EduPortal
            </Typography>
            
            <IconButton color="inherit">
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
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
            background: theme.palette.background.paper,
          }
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <List sx={{ p: 0 }}>
          <ListItem button selected={tab === 0} onClick={() => { setTab(0); setDrawerOpen(false); }}>
            <ListItemIcon>
              <VideoIcon />
            </ListItemIcon>
            <ListItemText primary="Videos" />
          </ListItem>
          
          <ListItem button selected={tab === 1} onClick={() => { setTab(1); setDrawerOpen(false); }}>
            <ListItemIcon>
              <PdfIcon />
            </ListItemIcon>
            <ListItemText primary="PDFs" />
          </ListItem>
          
          <ListItem button selected={tab === 2} onClick={() => { setTab(2); setDrawerOpen(false); }}>
            <ListItemIcon>
              <TestIcon />
            </ListItemIcon>
            <ListItemText primary="Tests" />
          </ListItem>
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <List sx={{ p: 0 }}>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: { xs: 2, sm: 3 },
          pb: { xs: 10, sm: 3 }, // Extra padding at bottom for mobile navigation
        }}
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Welcome back, {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Continue your learning journey with the materials below.
            </Typography>
          </Box>
        </motion.div>

        {/* Content Tabs */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            mb: 4,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            position: "sticky",
            top: isMobile ? 56 : 64,
            zIndex: 10,
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
              }
            }}
          >
            <Tab icon={<VideoIcon />} iconPosition="start" label="Videos" />
            <Tab icon={<PdfIcon />} iconPosition="start" label="PDFs" />
            <Tab icon={<TestIcon />} iconPosition="start" label="Tests" />
          </Tabs>
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
            <Grid container spacing={3}>
              {/* Videos */}
              {tab === 0 &&
                (videos.length ? (
                  videos.map((v) => (
                    <Grid key={v._id} item xs={12} sm={6} md={4} lg={3}>
                      <motion.div variants={itemVariants}>
                        <Card
                          elevation={2}
                          sx={{
                            borderRadius: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            background: theme.palette.background.paper,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 4,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              paddingTop: "56.25%", // 16:9 aspect ratio
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                              borderRadius: "12px 12px 0 0",
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
                              <PlayIcon sx={{ fontSize: 48, color: "#fff", opacity: 0.8 }} />
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
                          </Box>
                          
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {v.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {v.description}
                            </Typography>
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
                                py: 1,
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
                  <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                    <VideoIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No videos available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check back later for new content
                    </Typography>
                  </Box>
                ))}

              {/* PDFs */}
              {tab === 1 &&
                (pdfs.length ? (
                  pdfs.map((p) => (
                    <Grid key={p._id} item xs={12} sm={6} md={4} lg={3}>
                      <motion.div variants={itemVariants}>
                        <Card
                          elevation={2}
                          sx={{
                            borderRadius: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            background: theme.palette.background.paper,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 4,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 140,
                              background: `linear-gradient(45deg, ${theme.palette.error.light}20, ${theme.palette.error.main}20)`,
                              borderRadius: "12px 12px 0 0",
                            }}
                          >
                            <PdfIcon sx={{ fontSize: 64, color: theme.palette.error.main }} />
                          </Box>
                          
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {p.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {p.description}
                            </Typography>
                            {p.pageCount && (
                              <Typography variant="caption" color="text.secondary">
                                {p.pageCount} pages
                              </Typography>
                            )}
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
                                py: 1,
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
                  <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                    <PdfIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No PDFs available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check back later for new content
                    </Typography>
                  </Box>
                ))}

              {/* Tests */}
              {tab === 2 &&
                (tests.length ? (
                  tests.map((t) => (
                    <Grid key={t._id} item xs={12} sm={6} md={4} lg={3}>
                      <motion.div variants={itemVariants}>
                        <Card
                          elevation={2}
                          sx={{
                            borderRadius: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            background: theme.palette.background.paper,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 4,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 140,
                              background: `linear-gradient(45deg, ${theme.palette.success.light}20, ${theme.palette.success.main}20)`,
                              borderRadius: "12px 12px 0 0",
                              position: "relative",
                            }}
                          >
                            <TestIcon sx={{ fontSize: 64, color: theme.palette.success.main }} />
                            {completedTests[t._id] && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                }}
                              >
                                <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                              </Box>
                            )}
                          </Box>
                          
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {t.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {t.description}
                            </Typography>
                            
                            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: 'wrap' }}>
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={`${t.duration || 30} min`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                icon={<EmojiEventsIcon />}
                                label={`${calculateTotalMarks(t)} marks`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                icon={<QuizIcon />}
                                label={`${t.questions?.length || 0} questions`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </CardContent>
                          
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              startIcon={<QuizIcon />}
                              onClick={() => startTest(t._id)}
                              disabled={completedTests[t._id]}
                              sx={{
                                borderRadius: 2,
                                py: 1,
                              }}
                            >
                              {completedTests[t._id] ? "Completed" : "Start Test"}
                            </Button>
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                    <TestIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No tests available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check back later for new content
                    </Typography>
                  </Box>
                ))}
            </Grid>
          </motion.div>
        )}

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
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={tab}
            onChange={(event, newValue) => {
              setTab(newValue);
            }}
          >
            <BottomNavigationAction label="Videos" icon={<VideoIcon />} />
            <BottomNavigationAction label="PDFs" icon={<PdfIcon />} />
            <BottomNavigationAction label="Tests" icon={<TestIcon />} />
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
      >
        <AppBar position="sticky" elevation={0} sx={{ px: 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseVideo}
              aria-label="close"
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
              {testDetail.questions.map((q, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      <Box component="span" fontWeight="bold">
                        Q{idx + 1}.
                      </Box> {q.text}
                      <Typography
                        component="span"
                        sx={{ ml: 1, fontSize: "0.8rem", color: "text.secondary" }}
                      >
                        ({q.points || 1} marks)
                      </Typography>
                    </Typography>
                    
                    {renderQuestion(q, idx)}
                  </Paper>
                </motion.div>
              ))}

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2, px: 1 }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to submit your test?")) {
                      handleSubmitTest();
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
                <EmojiEventsIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                <Typography variant="h4" gutterBottom color="primary">
                  Test Completed!
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Your Score: {result.score} / {result.totalMarks}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {result.passed ? "Congratulations! You passed the test." : "You didn't pass this time. Keep practicing!"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Spent: {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Question Review:
                </Typography>
                
                {(result.answers || []).map((a, i) => {
                  const question = testDetail.questions[a.questionIndex || i];
                  const isCorrect = a.correct;
                  
                  return (
                    <Paper
                      key={i}
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: isCorrect
                          ? `${theme.palette.success.light}20`
                          : `${theme.palette.error.light}20`,
                        border: `1px solid ${isCorrect ? theme.palette.success.light : theme.palette.error.light}`,
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        <Box component="span" fontWeight="bold">
                          Q{(a.questionIndex || i) + 1}:
                        </Box> {question.text}
                      </Typography>
                      
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        <Chip
                          label={`Your answer: ${a.selectedAnswer || "Not answered"}`}
                          color={isCorrect ? "success" : "error"}
                          variant="outlined"
                          size="small"
                        />
                        {!isCorrect && question.type === "mcq" && (
                          <Chip
                            label={`Correct answer: ${String.fromCharCode(65 + question.correctAnswer)}`}
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        {!isCorrect && question.type === "truefalse" && (
                          <Chip
                            label={`Correct answer: ${question.correctAnswer === 0 ? "True" : "False"}`}
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        <Chip
                          label={`Marks: ${a.marksObtained || 0}/${question.points || 1}`}
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