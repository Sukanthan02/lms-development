/**
 * Seed 15 courses via the Create Course API
 * Updated with Language, Subtitles, and Banner
 */
const http = require('http');
const tokens = require('./tokens.json');
const API_URL = 'http://localhost:3000/api/courses';

// ── Course definitions ──
const courseDefs = [
  { 
    sub:'Web Development', name:'Complete HTML & CSS Bootcamp', desc:'Master modern web development from scratch with HTML5 and CSS3.', brief:'Learn HTML & CSS from zero to hero.', price:2999, discount:15, instructor:'Sarah Johnson', diff:1, 
    language:['English'], subtitles:['English', 'Spanish'], banner:'html-css-bootcamp.jpg',
    learns:['Write semantic HTML5','Master CSS Grid and Flexbox','Build responsive layouts','Create animations with CSS','Deploy static websites'], reqs:['Any computer with internet','No prior coding experience needed'] 
  },
  { 
    sub:'Web Development', name:'React.js - The Complete Guide', desc:'Dive deep into React.js including Hooks, Redux, React Router and Next.js.', brief:'Master React.js from fundamentals to advanced patterns.', price:5999, discount:20, instructor:'Max Schwarzmuller', diff:2, 
    language:['English', 'German'], subtitles:['English', 'German', 'Hindi'], banner:'react-complete-guide.jpg',
    learns:['React Hooks in depth','State management with Redux','Client-side routing','Server-side rendering with Next.js','Testing React components'], reqs:['JavaScript ES6 knowledge','Basic HTML and CSS'] 
  },
  { 
    sub:'Web Development', name:'Node.js and Express MasterClass', desc:'A complete backend development course using Node.js, Express, databases and deployment.', brief:'Learn backend development using Node.js.', price:4999, discount:18, instructor:'Andrew Mead', diff:2, 
    language:['English'], subtitles:['English', 'French'], banner:'nodejs-express-masterclass.jpg',
    learns:['Node.js fundamentals','Build REST APIs using Express','Work with databases','Implement authentication','Deploy backend applications'], reqs:['Basic JavaScript knowledge','Laptop with Node.js installed'] 
  },
  { 
    sub:'Mobile Development', name:'Flutter & Dart - The Complete Guide', desc:'Build beautiful cross-platform mobile apps with Flutter and Dart.', brief:'Create iOS and Android apps with a single codebase.', price:4499, discount:15, instructor:'Academind', diff:1, 
    language:['English'], subtitles:['English', 'Spanish', 'German'], banner:'flutter-dart-guide.jpg',
    learns:['Dart programming language','Flutter widget system','State management','Navigation and routing','Publishing to app stores'], reqs:['Basic programming knowledge','Computer with 8GB RAM'] 
  },
  { 
    sub:'Mobile Development', name:'iOS App Development with Swift', desc:'Learn iOS development with Swift, SwiftUI and Core Data.', brief:'Build professional iOS apps from scratch.', price:5499, discount:17, instructor:'Angela Yu', diff:2, 
    language:['English'], subtitles:['English', 'Spanish'], banner:'ios-swift-dev.jpg',
    learns:['Swift programming','SwiftUI framework','Core Data persistence','Networking and APIs','App Store submission'], reqs:['Mac computer required','No prior iOS experience needed'] 
  },
  { 
    sub:'Data Science', name:'Python for Data Science & AI', desc:'Learn Python programming for data analysis, visualization and machine learning.', brief:'Master Python for data science applications.', price:3999, discount:0, instructor:'IBM Skills Network', diff:1, 
    language:['English'], subtitles:['English', 'Hindi', 'Chinese'], banner:'python-data-science.jpg',
    learns:['Python fundamentals','NumPy and Pandas','Data visualization with Matplotlib','Basic machine learning','Jupyter Notebooks'], reqs:['No prior programming experience','Basic math knowledge'] 
  },
  { 
    sub:'Data Science', name:'Machine Learning A-Z', desc:'Master machine learning algorithms including regression, classification and deep learning.', brief:'Comprehensive machine learning course.', price:6999, discount:20, instructor:'Kirill Eremenko', diff:3, 
    language:['English'], subtitles:['English', 'Spanish', 'Portuguese'], banner:'machine-learning-az.jpg',
    learns:['Supervised learning algorithms','Unsupervised learning','Model evaluation','Feature engineering','Deep learning basics'], reqs:['Python programming skills','Basic statistics knowledge'] 
  },
  { 
    sub:'Finance', name:'The Complete Financial Analyst Course', desc:'Learn financial analysis, accounting, valuation and Excel modeling.', brief:'Become a professional financial analyst.', price:3499, discount:15, instructor:'Frank Kane', diff:2, 
    language:['English'], subtitles:['English'], banner:'financial-analyst-course.jpg',
    learns:['Financial statement analysis','Excel financial modeling','Business valuation methods','Capital budgeting','Risk management'], reqs:['Basic Excel skills','Interest in finance'] 
  },
  { 
    sub:'Finance', name:'Stock Market Investing for Beginners', desc:'Learn how to invest in stocks, build a portfolio and understand fundamentals.', brief:'Start investing in the stock market.', price:1999, discount:10, instructor:'Steve Ballinger', diff:1, 
    language:['English', 'Dutch'], subtitles:['English'], banner:'stock-market-investing.jpg',
    learns:['Stock market fundamentals','Portfolio diversification','Technical analysis basics','Reading financial statements','Risk management strategies'], reqs:['No prior investing knowledge','Basic math skills'] 
  },
  { 
    sub:'Marketing', name:'Digital Marketing Masterclass', desc:'Master SEO, social media marketing, Google Ads, email marketing and analytics.', brief:'Complete guide to digital marketing strategies.', price:3999, discount:18, instructor:'Daragh Walsh', diff:1, 
    language:['English'], subtitles:['English', 'Spanish', 'German'], banner:'digital-marketing-masterclass.jpg',
    learns:['SEO optimization','Google Ads campaigns','Social media strategy','Email marketing automation','Analytics and reporting'], reqs:['No prior marketing experience','Computer with internet access'] 
  },
  { 
    sub:'Marketing', name:'Content Marketing & Copywriting Pro', desc:'Learn to create compelling content and copy that drives conversions.', brief:'Master content marketing and copywriting.', price:2999, discount:12, instructor:'Gary Halbert', diff:2, 
    language:['English'], subtitles:['English'], banner:'content-marketing-pro.jpg',
    learns:['Content strategy development','SEO content writing','Email copywriting','Landing page optimization','Brand storytelling'], reqs:['Good English writing skills','Basic marketing understanding'] 
  },
  { 
    sub:'UI/UX Design', name:'UI/UX Design Bootcamp', desc:'Learn user interface and user experience design using Figma.', brief:'Master UI/UX design from research to prototyping.', price:4499, discount:18, instructor:'Jose Portilla', diff:2, 
    language:['English'], subtitles:['English', 'Spanish', 'French'], banner:'uiux-design-bootcamp.jpg',
    learns:['Design thinking process','Wireframing and prototyping','Figma mastery','User research methods','Design system creation'], reqs:['No design experience needed','Computer with Figma installed'] 
  },
  { 
    sub:'UI/UX Design', name:'Mobile App Design from Scratch', desc:'Design beautiful and functional mobile applications for iOS and Android.', brief:'Learn mobile-first design principles.', price:3499, discount:15, instructor:'Daniel Walter', diff:1, 
    language:['English'], subtitles:['English', 'Spanish'], banner:'mobile-app-design.jpg',
    learns:['Mobile design patterns','iOS and Android guidelines','Interactive prototypes','Micro-interactions','Design handoff to developers'], reqs:['Basic computer skills','Interest in mobile design'] 
  },
  { 
    sub:'Graphic Design', name:'Graphic Design Masterclass', desc:'Learn graphic design theory and practical skills using Adobe Creative Suite.', brief:'Become a professional graphic designer.', price:3999, discount:0, instructor:'Lindsay Marsh', diff:1, 
    language:['English'], subtitles:['English', 'German'], banner:'graphic-design-masterclass.jpg',
    learns:['Color theory and typography','Logo and brand design','Print design layouts','Digital illustration','Portfolio creation'], reqs:['No prior design experience','Access to Adobe Creative Suite'] 
  },
  { 
    sub:'Graphic Design', name:'Adobe Photoshop - Beginner to Pro', desc:'Master Adobe Photoshop from basic tools to advanced compositing.', brief:'Complete Photoshop course for all levels.', price:4499, discount:15, instructor:'Daniel Scott', diff:2, 
    language:['English'], subtitles:['English', 'Spanish', 'French'], banner:'adobe-photoshop-pro.jpg',
    learns:['Photoshop workspace mastery','Photo retouching techniques','Layer masks and compositing','Digital painting','Batch processing and automation'], reqs:['Adobe Photoshop installed','No prior Photoshop experience'] 
  },
];

// ── Section templates per subcategory (8 sections, 5 lectures each) ──
const sectionTemplates = {
  'Web Development': [
    { t:'Introduction and Setup', l:['Course Overview','Development Environment Setup','Understanding the Ecosystem','Installing Dependencies','First Project Walkthrough'] },
    { t:'Core Fundamentals', l:['Core Concepts Explained','Syntax and Structure','Variables and Data Types','Control Flow','Functions and Scope'] },
    { t:'Building Blocks', l:['Components and Modules','Reusable Code Patterns','Error Handling','Working with Forms','Event Handling'] },
    { t:'Data Management', l:['Data Fetching Strategies','State Management','Local Storage and Sessions','API Integration','Data Validation'] },
    { t:'Styling and Layout', l:['CSS Architecture','Responsive Design Patterns','Animation Techniques','Theme Implementation','Performance Optimization'] },
    { t:'Advanced Patterns', l:['Design Patterns Overview','Authentication Flows','Real-time Features','Testing Strategies','Code Splitting'] },
    { t:'Project Development', l:['Project Planning','Feature Implementation Part 1','Feature Implementation Part 2','Debugging and Fixes','Code Review Best Practices'] },
    { t:'Deployment and Beyond', l:['Build Configuration','Deployment Strategies','CI/CD Pipeline Basics','Monitoring and Analytics','Next Steps and Resources'] },
  ],
  'Mobile Development': [
    { t:'Getting Started', l:['Course Introduction','Setting Up Your IDE','Mobile Development Overview','Creating Your First App','Understanding Project Structure'] },
    { t:'UI Fundamentals', l:['Layout System Basics','Common UI Components','Navigation Patterns','Styling and Theming','Responsive Mobile Layouts'] },
    { t:'State and Data', l:['State Management Intro','Local Data Storage','Forms and User Input','Data Models','Reactive Programming'] },
    { t:'Networking', l:['HTTP Requests','REST API Consumption','JSON Parsing','Error Handling in Network','Caching Strategies'] },
    { t:'Native Features', l:['Camera Access','Location Services','Push Notifications','Sensors and Hardware','File System Access'] },
    { t:'Advanced UI', l:['Custom Animations','Gesture Handling','Complex Lists','Custom Drawing','Platform-specific UI'] },
    { t:'Testing and Debugging', l:['Unit Testing Basics','Widget Testing','Integration Tests','Debugging Tools','Performance Profiling'] },
    { t:'Publishing Your App', l:['App Store Guidelines','Building Release Version','App Signing','Store Listing Optimization','Post-launch Monitoring'] },
  ],
  'Data Science': [
    { t:'Foundations', l:['Course Overview','Setting Up Python','Jupyter Notebook Walkthrough','Basic Statistics Review','Data Types in Python'] },
    { t:'Data Wrangling', l:['Introduction to Pandas','DataFrames and Series','Data Cleaning','Handling Missing Data','Data Transformation'] },
    { t:'Data Visualization', l:['Matplotlib Basics','Seaborn for Statistical Plots','Interactive Visualizations','Dashboard Creation','Storytelling with Data'] },
    { t:'Statistical Analysis', l:['Descriptive Statistics','Probability Distributions','Hypothesis Testing','Correlation Analysis','Regression Analysis'] },
    { t:'Machine Learning Basics', l:['What is Machine Learning','Supervised vs Unsupervised','Linear Regression','Classification Algorithms','Model Evaluation'] },
    { t:'Advanced ML', l:['Ensemble Methods','Feature Engineering','Hyperparameter Tuning','Cross-validation','Handling Imbalanced Data'] },
    { t:'Deep Learning Intro', l:['Neural Network Basics','TensorFlow Setup','Building First Neural Net','Training and Optimization','Transfer Learning'] },
    { t:'Capstone Project', l:['Project Requirements','Data Collection','Exploratory Analysis','Model Building','Presentation and Documentation'] },
  ],
  'Finance': [
    { t:'Financial Foundations', l:['Course Welcome','Financial Markets Overview','Key Financial Terms','Time Value of Money','Financial Statements Intro'] },
    { t:'Accounting Basics', l:['Balance Sheet Analysis','Income Statement Deep Dive','Cash Flow Statement','Financial Ratios','Accounting Principles'] },
    { t:'Investment Fundamentals', l:['Asset Classes Overview','Risk and Return','Portfolio Theory','Diversification Strategies','Market Efficiency'] },
    { t:'Valuation Methods', l:['DCF Analysis','Comparable Company Analysis','Precedent Transactions','Enterprise Value','Equity Value Calculation'] },
    { t:'Technical Analysis', l:['Chart Patterns','Moving Averages','Volume Analysis','Support and Resistance','Technical Indicators'] },
    { t:'Excel Modeling', l:['Excel Financial Functions','Building Financial Models','Scenario Analysis','Sensitivity Tables','Dashboard Creation'] },
    { t:'Risk Management', l:['Types of Financial Risk','Value at Risk','Hedging Strategies','Insurance and Derivatives','Regulatory Framework'] },
    { t:'Personal Finance', l:['Budgeting Strategies','Emergency Fund Planning','Retirement Planning','Tax Optimization','Wealth Building Path'] },
  ],
  'Marketing': [
    { t:'Marketing Foundations', l:['Course Introduction','Marketing Landscape Today','Consumer Psychology','Marketing Funnel','Setting Goals and KPIs'] },
    { t:'Content Strategy', l:['Content Marketing Overview','Content Calendar Creation','Blog Writing Best Practices','Video Content Strategy','Content Distribution'] },
    { t:'SEO Mastery', l:['Search Engine Basics','Keyword Research','On-page SEO','Off-page SEO','Technical SEO Audit'] },
    { t:'Social Media Marketing', l:['Platform Selection Strategy','Instagram Marketing','LinkedIn for Business','Twitter Growth Hacks','Community Building'] },
    { t:'Paid Advertising', l:['Google Ads Fundamentals','Facebook Ads Manager','Ad Copywriting','A/B Testing Ads','Budget Optimization'] },
    { t:'Email Marketing', l:['Email List Building','Email Automation Workflows','Newsletter Design','Segmentation Strategies','Deliverability Best Practices'] },
    { t:'Analytics and Data', l:['Google Analytics Setup','Tracking Conversions','Attribution Models','Reporting Dashboards','Data-driven Decisions'] },
    { t:'Growth Strategies', l:['Growth Hacking Principles','Viral Marketing','Influencer Partnerships','Referral Programs','Scaling Campaigns'] },
  ],
  'UI/UX Design': [
    { t:'Design Thinking', l:['Course Introduction','What is Design Thinking','Empathy Mapping','Problem Definition','Ideation Techniques'] },
    { t:'User Research', l:['Research Methods Overview','User Interviews','Surveys and Questionnaires','Usability Testing','Persona Creation'] },
    { t:'Information Architecture', l:['IA Fundamentals','Card Sorting','Site Maps','User Flows','Navigation Patterns'] },
    { t:'Wireframing', l:['Low-fidelity Wireframes','Mid-fidelity Wireframes','Wireframing Tools','Responsive Wireframes','Wireframe Presentation'] },
    { t:'Visual Design', l:['Color Theory for UI','Typography in UI','Iconography','Spacing and Grid Systems','Visual Hierarchy'] },
    { t:'Prototyping', l:['Figma Prototyping Basics','Interactive Components','Micro-interactions','Animation Principles','Prototype Testing'] },
    { t:'Design Systems', l:['What is Design System','Component Library Creation','Documentation Standards','Token-based Design','Maintaining Design Systems'] },
    { t:'Portfolio and Career', l:['Building Your Portfolio','Case Study Writing','Design Interview Prep','Freelancing Tips','Industry Trends'] },
  ],
  'Graphic Design': [
    { t:'Design Principles', l:['Course Welcome','Elements of Design','Principles of Composition','Color Theory Deep Dive','Typography Fundamentals'] },
    { t:'Adobe Illustrator', l:['Illustrator Interface','Vector Drawing Basics','Pen Tool Mastery','Shape Builder Tool','Working with Text'] },
    { t:'Adobe Photoshop', l:['Photoshop Workspace','Layer Management','Selection Tools','Photo Retouching','Compositing Techniques'] },
    { t:'Logo Design', l:['Logo Design Process','Research and Sketching','Digital Logo Creation','Logo Variations','Brand Guidelines'] },
    { t:'Brand Identity', l:['Brand Strategy Basics','Visual Identity Systems','Business Card Design','Letterhead and Stationery','Brand Presentation'] },
    { t:'Print Design', l:['Print vs Digital','Resolution and Color Modes','Brochure Layout','Poster Design','Print Production'] },
    { t:'Digital Design', l:['Social Media Graphics','Web Banner Design','Email Template Design','Infographic Creation','Motion Graphics Intro'] },
    { t:'Portfolio Building', l:['Curating Your Work','Behance Portfolio Setup','Dribbble Presence','Client Presentation Skills','Freelance Business Basics'] },
  ],
};

function buildSections(subName) {
  const tpls = sectionTemplates[subName] || sectionTemplates['Web Development'];
  return tpls.map(s => ({
    title: s.t,
    lectures: s.l.map((title, i) => ({
      title,
      videoUrl: '',
      duration: `${String(5+Math.floor(Math.random()*8)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`,
      isPreview: i === 0
    }))
  }));
}

function postCourse(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(API_URL);
    const opts = { hostname:url.hostname, port:url.port, path:url.pathname, method:'POST', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)} };
    const req = http.request(opts, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => { try { resolve({status:res.statusCode, body:JSON.parse(chunks)}); } catch(e) { resolve({status:res.statusCode, body:chunks}); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('=== Seeding 15 Courses via Create Course API ===\n');
  for (let i = 0; i < courseDefs.length; i++) {
    const c = courseDefs[i];
    const t = tokens.find(x => x.subName === c.sub);
    if (!t) { console.log(`  x No token for ${c.sub}`); continue; }
    const payload = { 
      courseName:c.name, description:c.desc, briefDescription:c.brief, price:c.price, discount:c.discount, instructorName:c.instructor, 
      categorytoken:t.categorytoken, subcategorytoken:t.subcategorytoken, difficultyId:c.diff, 
      learningPoints:c.learns, requirements:c.reqs, 
      sections:buildSections(c.sub),
      language: c.language,
      subtitles: c.subtitles,
      banner: c.banner
    };
    try {
      const res = await postCourse(payload);
      if (res.status === 201) console.log(`  + [${i+1}/15] ${c.name}`);
      else console.log(`  x [${i+1}/15] ${c.name} - ${res.body.message||res.status}`);
    } catch (err) { console.log(`  x [${i+1}/15] ${c.name} - ${err.message}`); }
  }
  console.log('\n=== Done ===');
})();
