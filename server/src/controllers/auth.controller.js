const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const axios = require('axios');

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, provider: 'email' },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({ user });
  } catch (err) {
    console.error('SIGNUP ERROR:', {
      message: err.message,
      stack: err.stack,
      body: { ...req.body, password: '***' } // Log everything but the password
    });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password (if user signed up via OAuth they won't have a password)
    if (!user.password) {
      return res.status(401).json({ error: `Please sign in using your ${user.provider} account.` });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.cookie('token', token, cookieOptions);

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    console.error('LOGIN ERROR:', {
      message: err.message,
      stack: err.stack,
      email: req.body.email
    });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      ...cookieOptions,
      maxAge: 0,
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        createdAt: true,
        avatarUrl: true,
        provider: true,
        _count: {
          select: {
            memberships: true,
            assignedTasks: true,
          }
        }
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('ME AUTH ERROR:', {
      message: err.message,
      userId: req.user?.userId
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        avatarUrl: true,
        provider: true,
        _count: {
          select: {
            memberships: true,
            assignedTasks: true,
          }
        }
      },
    });

    res.json({ user });
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==========================================
// GOOGLE OAUTH
// ==========================================
const googleLogin = (req, res) => {
  const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile%20email`;
  res.redirect(url);
};

const googleCallback = async (req, res) => {
  const { code } = req.query;
  const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;

    const profileRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    const profile = profileRes.data;
    await handleOAuthLogin(res, profile.email, profile.name, profile.picture, 'google', profile.id);
  } catch (err) {
    console.error('Google Auth Error:', err.response?.data || err.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// ==========================================
// GITHUB OAUTH
// ==========================================
const githubLogin = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(url);
};

const githubCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' }
    });

    const access_token = data.access_token;

    // Get user profile
    const profileRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profile = profileRes.data;

    // Get user emails (since email might be private in profile)
    const emailsRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const primaryEmail = emailsRes.data.find(e => e.primary)?.email || emailsRes.data[0]?.email;

    await handleOAuthLogin(res, primaryEmail, profile.name || profile.login, profile.avatar_url, 'github', String(profile.id));
  } catch (err) {
    console.error('GitHub Auth Error:', err.response?.data || err.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// Common handler for OAuth logic
const handleOAuthLogin = async (res, email, name, avatarUrl, provider, providerId) => {
  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Link account if it was an email user, or just update avatar
    await prisma.user.update({
      where: { id: user.id },
      data: {
        providerId,
        avatarUrl,
        provider: user.provider === 'email' ? provider : user.provider,
      }
    });
  } else {
    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        name,
        provider,
        providerId,
        avatarUrl,
      }
    });
  }

  // Generate token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Set cookie
  res.cookie('token', token, cookieOptions);

  // Redirect to dashboard with success query param
  res.redirect(`${process.env.CLIENT_URL}/dashboard?login_success=${provider}`);
};

module.exports = { signup, login, logout, me, updateProfile, googleLogin, googleCallback, githubLogin, githubCallback };
