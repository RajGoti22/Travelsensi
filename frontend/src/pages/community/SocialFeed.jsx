import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  IconButton,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add,
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  MoreVert,
  PhotoCamera,
  LocationOn,
  Public,
  Lock,
  Group,
} from '@mui/icons-material';

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [openNewPost, setOpenNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    location: '',
    photos: [],
    privacy: 'public'
  });

  // Sample social feed data
  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        author: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        content: 'Just had the most amazing sunset view from our hotel balcony in Santorini! The colors were absolutely breathtaking. Already planning our next trip back here! 🌅✈️',
        location: 'Santorini, Greece',
        timestamp: '2 hours ago',
        photos: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400'],
        likes: 24,
        comments: 8,
        shares: 3,
        isLiked: false,
        tags: ['sunset', 'santorini', 'vacation']
      },
      {
        id: 2,
        author: 'Mike Chen',
        avatar: 'https://i.pravatar.cc/150?img=2',
        content: 'Pro tip for Tokyo travelers: Don\'t miss the early morning tuna auction at Tsukiji Market! Even though the main market moved, the outer market is still incredible for fresh sushi. Got there at 5 AM and it was worth every minute!',
        location: 'Tokyo, Japan',
        timestamp: '5 hours ago',
        photos: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'],
        likes: 42,
        comments: 15,
        shares: 7,
        isLiked: true,
        tags: ['tokyo', 'foodie', 'sushi']
      },
      {
        id: 3,
        author: 'Emma Williams',
        avatar: 'https://i.pravatar.cc/150?img=3',
        content: 'Bucket list item checked! ✅ Just completed a 7-day safari in Kenya and saw all of the Big Five! Our guide was incredible and the conservation efforts here are truly inspiring. Nature at its finest! 🦁🐘',
        location: 'Masai Mara, Kenya',
        timestamp: '1 day ago',
        photos: ['https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=400'],
        likes: 67,
        comments: 23,
        shares: 12,
        isLiked: false,
        tags: ['safari', 'wildlife', 'bucketlist']
      },
      {
        id: 4,
        author: 'David Rodriguez',
        avatar: 'https://i.pravatar.cc/150?img=4',
        content: 'Paris in the spring hits different! 🌸 Spent the afternoon sketching by the Seine and people-watching at café sidewalks. Sometimes the best travel moments are the quiet ones. Already missing the croissants!',
        location: 'Paris, France',
        timestamp: '2 days ago',
        photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'],
        likes: 31,
        comments: 12,
        shares: 5,
        isLiked: true,
        tags: ['paris', 'spring', 'sketching']
      }
    ];
    setPosts(samplePosts);
  }, []);

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleNewPost = () => {
    const post = {
      id: posts.length + 1,
      author: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=8',
      content: newPost.content,
      location: newPost.location,
      timestamp: 'just now',
      photos: newPost.photos,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      tags: []
    };
    setPosts([post, ...posts]);
    setOpenNewPost(false);
    setNewPost({
      content: '',
      location: '',
      photos: [],
      privacy: 'public'
    });
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'public': return <Public />;
      case 'private': return <Lock />;
      case 'friends': return <Group />;
      default: return <Public />;
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 180, sm: 240, md: 280 },
          background: `linear-gradient(120deg, rgba(31,41,55,0.7) 0%, rgba(37,99,235,0.5) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          py: { xs: 4, sm: 6, md: 8 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 700,
            letterSpacing: '1px',
            textShadow: '0 2px 10px rgba(0,0,0,0.25)',
            fontSize: { xs: '1.4rem', sm: '2rem', md: '2.5rem' },
            mb: { xs: 1, sm: 2 },
            textAlign: 'center',
          }}
        >
          Social Feed
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            opacity: 0.9,
            fontWeight: 400,
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
            textShadow: '0 1px 6px rgba(0,0,0,0.18)',
          }}
        >
          Discover and share travel moments with the community. Post updates, tips, and inspiration from your journeys!
        </Typography>
      </Box>

      <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
        {/* Share Post Card */}
        <Card
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderColor: '#D1D5DB',
            },
          }}
          onClick={() => setOpenNewPost(true)}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={'https://i.pravatar.cc/150?img=1'}
                sx={{ width: 44, height: 44, border: '2px solid #E5E7EB' }}
              />
              <Box
                sx={{
                  flex: 1,
                  py: { xs: 1, sm: 2 },
                  px: { xs: 2, sm: 3 },
                  borderRadius: '20px',
                  border: '1px solid #D1D5DB',
                  color: '#6B7280',
                  fontSize: { xs: '15px', sm: '16px' },
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#9CA3AF' },
                }}
              >
                Share your travel experience...
              </Box>
            </Box>
            <Divider sx={{ my: { xs: 1.5, sm: 2 }, borderColor: '#E5E7EB' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 1 }}>
              <Button
                startIcon={<PhotoCamera sx={{ fontSize: 20, color: '#6B7280' }} />}
                sx={{
                  color: '#6B7280',
                  textTransform: 'none',
                  fontSize: { xs: '13px', sm: '14px' },
                  fontWeight: 500,
                  py: 1,
                  px: 2,
                  borderRadius: '8px',
                  minWidth: 100,
                  '&:hover': {
                    backgroundColor: '#F9FAFB',
                    color: '#374151',
                  },
                }}
                onClick={e => { e.stopPropagation(); setOpenNewPost(true); }}
              >
                Photo
              </Button>
              <Button
                startIcon={<LocationOn sx={{ fontSize: 20, color: '#6B7280' }} />}
                sx={{
                  color: '#6B7280',
                  textTransform: 'none',
                  fontSize: { xs: '13px', sm: '14px' },
                  fontWeight: 500,
                  py: 1,
                  px: 2,
                  borderRadius: '8px',
                  minWidth: 100,
                  '&:hover': {
                    backgroundColor: '#F9FAFB',
                    color: '#374151',
                  },
                }}
                onClick={e => { e.stopPropagation(); setOpenNewPost(true); }}
              >
                Location
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Posts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card 
                elevation={0}
                sx={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Post Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={post.avatar} 
                      sx={{ 
                        mr: 2,
                        width: 44,
                        height: 44,
                      }} 
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1F2937',
                          fontSize: '1rem',
                        }}
                      >
                        {post.author}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#6B7280',
                            fontSize: '0.875rem',
                          }}
                        >
                          {post.timestamp}
                        </Typography>
                        {post.location && (
                          <>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>•</Typography>
                            <LocationOn sx={{ fontSize: 14, color: '#6B7280' }} />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#6B7280',
                                fontSize: '0.875rem',
                              }}
                            >
                              {post.location}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                    <IconButton 
                      size="small"
                      sx={{
                        color: '#6B7280',
                        '&:hover': {
                          bgcolor: '#F3F4F6',
                        }
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Post Content */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      color: '#4B5563',
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                    }}
                  >
                    {post.content}
                  </Typography>

                  {/* Post Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {post.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`#${tag}`}
                          size="small"
                          sx={{
                            mr: 1, 
                            mb: 1,
                            bgcolor: '#EFF6FF',
                            color: '#1E40AF',
                            fontSize: '0.75rem',
                            height: 24,
                            border: 'none',
                            '&:hover': {
                              bgcolor: '#DBEAFE',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Post Photos */}
                  {post.photos && post.photos.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <img
                        src={post.photos[0]}
                        alt="Post"
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}
                      />
                    </Box>
                  )}

                  {/* Engagement Stats */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: '#6B7280',
                        fontSize: '0.875rem',
                      }}
                    >
                      {post.likes} likes • {post.comments} comments • {post.shares} shares
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2, borderColor: '#E5E7EB' }} />
                </CardContent>

                {/* Post Actions */}
                <CardActions sx={{ justifyContent: 'space-around', py: 1.5, px: 3 }}>
                  <Button
                    startIcon={post.isLiked ? <Favorite sx={{ color: '#EF4444' }} /> : <FavoriteBorder />}
                    onClick={() => handleLike(post.id)}
                    size="small"
                    sx={{ 
                      color: post.isLiked ? '#EF4444' : '#6B7280',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      '&:hover': { 
                        backgroundColor: post.isLiked ? 'rgba(239, 68, 68, 0.04)' : '#F9FAFB'
                      }
                    }}
                  >
                    Like
                  </Button>
                  <Button
                    startIcon={<Comment />}
                    size="small"
                    sx={{ 
                      color: '#6B7280',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      '&:hover': {
                        backgroundColor: '#F9FAFB'
                      }
                    }}
                  >
                    Comment
                  </Button>
                  <Button
                    startIcon={<Share />}
                    size="small"
                    sx={{ 
                      color: '#6B7280',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      '&:hover': {
                        backgroundColor: '#F9FAFB'
                      }
                    }}
                  >
                    Share
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Box>

        {/* Create Post Dialog */}
        <Dialog 
          open={openNewPost} 
          onClose={() => setOpenNewPost(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '2px',
              border: '1px solid #E5E7EB'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              fontSize: '18px',
              fontWeight: 600,
              color: '#1F2937',
              borderBottom: '1px solid #E5E7EB',
              pb: 2
            }}
          >
            Share Your Travel Experience
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="What's on your mind?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your travel story, tips, or experiences..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '2px',
                        '& fieldset': {
                          borderColor: '#D1D5DB',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9CA3AF'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563EB',
                          borderWidth: '1px'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        fontSize: '14px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={newPost.location}
                    onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                    placeholder="Where are you?"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '2px',
                        '& fieldset': {
                          borderColor: '#D1D5DB',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9CA3AF'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563EB',
                          borderWidth: '1px'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        fontSize: '14px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Privacy"
                    value={newPost.privacy}
                    onChange={(e) => setNewPost({ ...newPost, privacy: e.target.value })}
                    SelectProps={{
                      native: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '2px',
                        '& fieldset': {
                          borderColor: '#D1D5DB',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9CA3AF'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563EB',
                          borderWidth: '1px'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        fontSize: '14px'
                      }
                    }}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends</option>
                    <option value="private">Private</option>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #E5E7EB', gap: 2 }}>
            <Button 
              onClick={() => setOpenNewPost(false)}
              sx={{
                color: '#6B7280',
                borderColor: '#D1D5DB',
                borderRadius: '2px',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                  borderColor: '#9CA3AF'
                }
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleNewPost} 
              variant="contained"
              disabled={!newPost.content.trim()}
              sx={{
                backgroundColor: '#2563EB',
                borderRadius: '2px',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#1D4ED8',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                },
                '&:disabled': {
                  backgroundColor: '#9CA3AF',
                  color: '#ffffff'
                }
              }}
            >
              Share Post
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(10, 58, 100, 0.78)',
            '&:hover': {
              backgroundColor: 'rgba(10, 58, 100, 0.9)',
            },
          }}
          onClick={() => setOpenNewPost(true)}
        >
          <Add />
        </Fab>
      </Container>
    </>
  );
};

export default SocialFeed;