const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url(), request.failure().errorText));
    
    console.log('Navigating...');
    await page.goto('http://localhost:3000/login');
    console.log('Loaded.');
    
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'password');
    console.log('Typed.');
    
    await page.click('button[type="submit"]');
    console.log('Clicked.');
    
    await new Promise(r => setTimeout(r, 5000));
    
    await browser.close();
    console.log('Done.');
  } catch (err) {
    console.error('ERROR:', err);
  }
})();
