const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

// Folder
const postsDir = path.join(__dirname, '../posts');
const templatePath = path.join(__dirname, '../templates/blog.html');
const outputDir = path.join(__dirname, '../dist/blog');

// Baca template
const template = fs.readFileSync(templatePath, 'utf8');

// Buat folder output
fs.mkdirSync(outputDir, { recursive: true });

// Baca semua .md di posts/
fs.readdirSync(postsDir).forEach(file => {
  if (!file.endsWith('.md')) return;

  const filePath = path.join(postsDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const htmlContent = marked.parse(content);

  const output = template
    .replace(/{{title}}/g, data.title || '')
    .replace(/{{description}}/g, data.description || '')
    .replace(/{{image}}/g, data.image || '')
    .replace(/{{url}}/g, `https://pertanianmilenial.netlify.app/blog/${data.slug}.html`)
    .replace(/{{content}}/g, htmlContent);

  const outPath = path.join(outputDir, `${data.slug}.html`);
  fs.writeFileSync(outPath, output);
});
