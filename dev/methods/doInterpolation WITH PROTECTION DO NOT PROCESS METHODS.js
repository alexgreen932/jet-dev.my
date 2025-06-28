import { resolveDataPath } from './help-functions.js'

// Helper to check if an external script is allowed
function isTrustedUrl(url) {
    try {
        const u = new URL(url);
        return app.allowedUrls?.some(domain => u.hostname.includes(domain));
    } catch (e) {
        return false;
    }
}

// Basic HTML sanitizer: removes dangerous tags and attributes
function sanitizeHtml(html) {
    if (typeof html !== 'string') return html;

    // Remove inline event handlers (onclick, onload, etc.)
    html = html.replace(/ on\w+="[^"]*"/gi, '');

    // Remove javascript: in href/src
    html = html.replace(/\s(href|src)=["']javascript:[^"']*["']/gi, '');

    // Remove <script> tags that are not from allowed domains
    html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, inner) => {
        const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
        if (srcMatch) {
            const src = srcMatch[1];
            if (isTrustedUrl(src)) return match; // Keep if trusted
            return ''; // Block otherwise
        }
        return ''; // Block inline <script>
    });

    return html;
}

/**
 * Processes interpolation like {{html}}, {{myMethod()}}, etc.
 * Allows HTML output, but filters dangerous content.
 */
export default function doInterpolation(tpl) {
    if (!tpl.includes('{{')) return tpl;

    return tpl.replace(/{{(.*?)}}/g, (_, path) => {
        const trimmed = path.trim();

        // Check if it's a method call
        if (/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\((.*?)\)$/.test(trimmed)) {
            try {
                const result = this.executeMethod(trimmed);
                return typeof result === 'string' ? sanitizeHtml(result) : result;
            } catch (err) {
                console.error(`Error executing method: ${trimmed}`, err);
                return '';
            }
        }

        // Handle dynamic data
        const resolvedValue = resolveDataPath(this, trimmed);
        if (resolvedValue === undefined) return '';

        // If it's HTML or string, sanitize
        if (typeof resolvedValue === 'string') {
            return sanitizeHtml(resolvedValue);
        }

        // Otherwise, just return as is (number, boolean, etc.)
        return resolvedValue;
    });
}
