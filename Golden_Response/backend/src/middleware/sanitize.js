const sanitizeHtml = require('sanitize-html');

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'em', 'u', 's', 'code', 'pre',
  'blockquote',
  'ul', 'ol', 'li',
  'a',
  'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
];

const ALLOWED_ATTRIBUTES = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height', 'class'],
  '*': ['class', 'id'],
};

/**
 * Sanitizes rich HTML content (for post body)
 */
const sanitizeContent = (dirty) => {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.href && attribs.href.startsWith('http') ? '_blank' : undefined,
        },
      }),
    },
  });
};

/**
 * Sanitizes plain text input (strips all HTML)
 */
const sanitizeText = (dirty) => {
  return sanitizeHtml(dirty, { allowedTags: [], allowedAttributes: {} });
};

/**
 * Middleware to sanitize request body fields
 */
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        // Content field gets rich HTML sanitization
        if (key === 'content') {
          req.body[key] = sanitizeContent(req.body[key]);
        } else {
          req.body[key] = sanitizeText(req.body[key]);
        }
      }
    });
  }
  next();
};

module.exports = { sanitizeBody, sanitizeContent, sanitizeText };
