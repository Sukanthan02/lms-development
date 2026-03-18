const db = require('./models');

const VIDEO_URLS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
];

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function seed() {
  try {
    const lectures = await db.CourseLecture.findAll();
    console.log(`Found ${lectures.length} lectures. Assigning random video URLs...`);

    const shuffled = shuffle(VIDEO_URLS);
    for (let i = 0; i < lectures.length; i++) {
      const url = shuffled[i % shuffled.length];
      await lectures[i].update({ videoUrl: url });
      console.log(`  [${i + 1}] ${lectures[i].title} -> ${url.split('/').pop()}`);
    }

    console.log('\nDone! All lectures now have video URLs.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding videos:', err.message);
    process.exit(1);
  }
}

seed();
