const express = require('express');
const { chromium } = require('playwright');
const app = express();
const port = 3010;

app.use(express.json());

app.post('/search', async (req, res) => {
  const { jobDescription } = req.body;

  // Launch Playwright browser automation in headless mode
  const browser = await chromium.launch({ headless: true }); // Change headless to true
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/login');

  // Add login logic (replace with real credentials)
  await page.fill('#username', 'your-email@example.com');
  await page.fill('#password', 'your-password');
  await page.click('button[type="submit"]');

  // Wait for navigation after login
  try {
    await page.waitForNavigation({ timeout: 10000 });
    console.log('Login successful!');

    // Capture a screenshot to verify login success
    await page.screenshot({ path: 'login_success.png' });
    console.log('Screenshot taken: login_success.png');

    res.send({ status: 'success', message: 'Logged into LinkedIn successfully.' });
  } catch (error) {
    console.error('Login failed or timed out.');
    await page.screenshot({ path: 'login_failure.png' });
    console.log('Screenshot taken: login_failure.png');

    res.send({ status: 'error', message: 'Login failed or timed out.' });
  }

  await browser.close();
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

app.get('/search', (req, res) => {
  res.send('This endpoint only accepts POST requests.');
});
