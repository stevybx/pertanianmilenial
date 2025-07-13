// scripts/generateIndex.js
const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../posts');
const outputFile = path.join(postsDir, 'index.json');

function parseFrontmatter(md) {
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return {};

  const yaml = match[1];
  const frontmatter = {};
  yaml.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length > 0) {
      frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  return frontmatter;
}

function estimateReadTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function getExcerpt(content, maxLength = 160) {
  return content
    .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links
    .replace(/[*_~`>#-]/g, '') // remove markdown syntax
    .slice(0, maxLength)
    .trim() + '...';
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

const index = files.map(file => {
  const fullPath = path.join(postsDir, file);
  const slug = path.basename(file, '.md');
  const content = fs.readFileSync(fullPath, 'utf-8');
  const frontmatter = parseFrontmatter(content);
  const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();

  return {
    slug,
    title: frontmatter.title || slug,
    date: frontmatter.date || '',
    thumbnail: frontmatter.thumbnail || '',
    writer: frontmatter.writer || '',
    category: frontmatter.category || 'umum',
    readTime: estimateReadTime(cleanContent),
    excerpt: getExcerpt(cleanContent)
  };
});

fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));
console.log('✅ index.json generated with', index.length, 'articles!');
