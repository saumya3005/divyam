const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log('Navigating...');
    await page.goto('http://localhost:3000/register');
    
    await page.type('input[name="firstName"]', 'John');
    await page.type('input[name="lastName"]', 'Doe');
    await page.type('input[name="email"]', 'newuser' + Date.now() + '@example.com');
    await page.type('input[name="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    console.log('Clicked signup.');
    
    await new Promise(r => setTimeout(r, 5000));
    console.log('Current URL:', page.url());
    
    await browser.close();
  } catch (err) {
    console.error('ERROR:', err);
  }
})();
