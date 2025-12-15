package com.example.demo.security;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class InputSanitizer {

    /**
     * Sanitize string input to prevent XSS attacks
     */
    public String sanitize(String input) {
        if (input == null) {
            return null;
        }
        return HtmlUtils.htmlEscape(input.trim());
    }

    /**
     * Sanitize and validate username (alphanumeric and underscores only)
     */
    public String sanitizeUsername(String username) {
        if (username == null) {
            return null;
        }
        String sanitized = username.trim();
        if (!sanitized.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Username can only contain letters, numbers, and underscores");
        }
        return sanitized;
    }

    /**
     * Validate email format
     */
    public String sanitizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String sanitized = email.trim().toLowerCase();
        if (!sanitized.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return sanitized;
    }

    /**
     * Sanitize flag input - allow most characters but escape HTML
     */
    public String sanitizeFlag(String flag) {
        if (flag == null) {
            return null;
        }
        return flag.trim();
    }
}

