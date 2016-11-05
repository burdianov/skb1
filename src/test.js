import canonize from './canonize';

const array = [
  'https://telegram.me/skillbranch',
  'https://telegrqwe.me/skillbranch',
  'https://telegrqwe.me/skillbranch123',
  'Https://Telegram.me/skillbranch',
  'Https://Telegram.mE/SkillBranch',
  'https://Telegram.me/SkillBranch',
  '//telegram.me/skillbranch',
  'http://telegram.me/skillbranch',
  'telegram.me/skillbranch',
  'skillbranch',
  '@skillbranch',
  'https://vk.com/skillbranch',
  'http://vk.com/skillbranch',
  'http://www.vk.com/skillbranch',
  '//vk.com/skillbranch',
  'vk.com/skillbranch',
  'https://vk.com/skillbranch?w=wall-117903599_1076',
  'vk.com/skillbranch/profile',
];

array.forEach(url => {
  const username = canonize(url);
  console.log(username);
});
