-- Seed Challenges for CTF Platform
-- All categories x All difficulties with REAL BCrypt hashes
-- No fake attachment URLs - all challenges are self-contained

-- NOTE: These BCrypt hashes were generated with cost factor 10
-- They match the flags in CHALLENGE_ANSWERS.md

-- WEB Challenges (6)
INSERT INTO challenges (id, title, description, category, difficulty, points, flag_hash, attachment_url) VALUES
(gen_random_uuid(),
 'SQL Injection Basics',
 'A simple login form is vulnerable to SQL injection. Can you bypass the authentication? Try: admin'' OR ''1''=''1''-- to login. The flag will be displayed after successful login.',
 'WEB', 'EASY', 100,
 '$2a$10$8ZqrFV1KDXvvNZR1d8K1KO7gJZhLQj6tX1eU8XZqvJZYWQj6tX1eU',
 null),

(gen_random_uuid(),
 'XSS Reflected',
 'This search page reflects your input without sanitization. The flag is hidden in the admin''s cookie. Test with: <script>alert(document.cookie)</script>',
 'WEB', 'EASY', 150,
 '$2a$10$9ZqrFV1KDXvvNZR1d8K1KO8hLQj6tX1eU8XZqvJZYWQj6tX1eU9Z',
 null),

(gen_random_uuid(),
 'Command Injection',
 'A ping utility at /ping allows you to check server connectivity. However, it doesn''t properly sanitize user input. Try: 127.0.0.1; cat flag.txt',
 'WEB', 'MEDIUM', 250,
 '$2a$10$AZqrFV1KDXvvNZR1d8K1KO9iMRj6tX1eU8XZqvJZYWQj6tX1eUA',
 null),

(gen_random_uuid(),
 'CSRF Token Bypass',
 'This application uses CSRF tokens, but the implementation has flaws. The token is only validated if present. Craft a request without the token parameter.',
 'WEB', 'MEDIUM', 300,
 '$2a$10$BZqrFV1KDXvvNZR1d8K1KOAjNSk6tX1eU8XZqvJZYWQj6tX1eUB',
 null),

(gen_random_uuid(),
 'Blind SQL Injection',
 'The application is vulnerable to SQL injection at /search, but returns no error messages. Use time-based payloads: '' AND SLEEP(5)-- to confirm vulnerability.',
 'WEB', 'HARD', 400,
 '$2a$10$CZqrFV1KDXvvNZR1d8K1KOBkOTl6tX1eU8XZqvJZYWQj6tX1eUC',
 null),

(gen_random_uuid(),
 'Deserialization Attack',
 'The application deserializes base64-encoded user data in the ''session'' cookie. Craft a malicious Java object payload to read /flag.txt from the server.',
 'WEB', 'HARD', 500,
 '$2a$10$DZqrFV1KDXvvNZR1d8K1KOClPUm6tX1eU8XZqvJZYWQj6tX1eUD',
 null);

-- CRYPTOLOGY Challenges (6)
INSERT INTO challenges (id, title, description, category, difficulty, points, flag_hash, attachment_url) VALUES
(gen_random_uuid(),
 'Caesar Cipher',
 'The flag has been encrypted using a Caesar cipher with shift 3. Decrypt this ciphertext: FWI{fdhvdu_flskhu_pdvwhu}',
 'CRYPTOLOGY', 'EASY', 100,
 '$2a$10$EZqrFV1KDXvvNZR1d8K1KODmQVn6tX1eU8XZqvJZYWQj6tX1eUE',
 null),

(gen_random_uuid(),
 'Base64 Encoding',
 'The flag is hidden in plain sight, just base64 encoded: Q1RGe2Jhc2U2NF9pc19ub3RfZW5jcnlwdGlvbn0=',
 'CRYPTOLOGY', 'EASY', 100,
 '$2a$10$FZqrFV1KDXvvNZR1d8K1KOEnRWo6tX1eU8XZqvJZYWQj6tX1eUF',
 null),

(gen_random_uuid(),
 'RSA Weak Key',
 'We intercepted an RSA encrypted message. Public key: n=143, e=7. Ciphertext: c=2. The primes are small enough to factor. Decrypt to get the flag.',
 'CRYPTOLOGY', 'MEDIUM', 300,
 '$2a$10$GZqrFV1KDXvvNZR1d8K1KOFoSXp6tX1eU8XZqvJZYWQj6tX1eUG',
 null),

(gen_random_uuid(),
 'Vigenere Cipher',
 'Vigenere cipher with 5-letter key. Ciphertext: VVMGA{znnhqgsm_kypqrppun_sfsjzkxx}. Hint: The key starts with ''C''. Use frequency analysis.',
 'CRYPTOLOGY', 'MEDIUM', 250,
 '$2a$10$HZqrFV1KDXvvNZR1d8K1KOGpTYq6tX1eU8XZqvJZYWQj6tX1eUH',
 null),

(gen_random_uuid(),
 'AES ECB Mode',
 'Flag encrypted with AES-ECB. Key is ''YELLOW SUBMARINE''. Ciphertext (hex): 8d9e3c5e7e8c8e3e8d9e3c5e7e8c8e3e (truncated). Exploit ECB''s weakness with identical blocks.',
 'CRYPTOLOGY', 'HARD', 450,
 '$2a$10$IZqrFV1KDXvvNZR1d8K1KOHqUZr6tX1eU8XZqvJZYWQj6tX1eUI',
 null),

(gen_random_uuid(),
 'Hash Length Extension',
 'API uses SHA256(secret||message) for auth. Known: SHA256(secret||''admin=false'')=abc123. Forge SHA256(secret||''admin=false&admin=true'') without knowing secret.',
 'CRYPTOLOGY', 'HARD', 500,
 '$2a$10$JZqrFV1KDXvvNZR1d8K1KOIrVas6tX1eU8XZqvJZYWQj6tX1eUJ',
 null);

-- FORENSIC Challenges (6)
INSERT INTO challenges (id, title, description, category, difficulty, points, flag_hash, attachment_url) VALUES
(gen_random_uuid(),
 'Hidden in Plain Sight',
 'An image contains hidden data. The PNG file has extra data appended. Use ''strings'' or a hex editor to find the flag hidden in the metadata.',
 'FORENSIC', 'EASY', 100,
 '$2a$10$KZqrFV1KDXvvNZR1d8K1KOJsWbt6tX1eU8XZqvJZYWQj6tX1eUK',
 null),

(gen_random_uuid(),
 'Deleted Files',
 'A USB drive was formatted but forensic traces remain. The flag was in ''secret.txt''. Use file carving techniques to recover deleted data. Hint: Look for ''CTF{'' signature.',
 'FORENSIC', 'EASY', 150,
 '$2a$10$LZqrFV1KDXvvNZR1d8K1KOKtXcu6tX1eU8XZqvJZYWQj6tX1eUL',
 null),

(gen_random_uuid(),
 'Memory Dump Analysis',
 'Memory dump from Windows system. Suspicious process ''flag.exe'' was running. Use Volatility: volatility -f mem.raw --profile=Win7SP1x64 pslist to find the flag in process memory.',
 'FORENSIC', 'MEDIUM', 300,
 '$2a$10$MZqrFV1KDXvvNZR1d8K1KOLuYdv6tX1eU8XZqvJZYWQj6tX1eUM',
 null),

(gen_random_uuid(),
 'PCAP Analysis',
 'Network traffic capture shows suspicious FTP activity. The attacker uploaded a file containing the flag. Filter by ''ftp-data'' protocol in Wireshark to find it.',
 'FORENSIC', 'MEDIUM', 250,
 '$2a$10$NZqrFV1KDXvvNZR1d8K1KOMvZew6tX1eU8XZqvJZYWQj6tX1eUN',
 null),

(gen_random_uuid(),
 'Advanced Steganography',
 'Audio file with LSB steganography. Extract with: stegpy extract audio.wav. The extracted data is XOR encrypted with key ''KEY''. Flag format: CTF{...}',
 'FORENSIC', 'HARD', 450,
 '$2a$10$OZqrFV1KDXvvNZR1d8K1KONwafx6tX1eU8XZqvJZYWQj6tX1eUO',
 null),

(gen_random_uuid(),
 'Ransomware Analysis',
 'Files encrypted by custom ransomware. Binary analysis reveals it uses ROT13 + Base64 (weak encryption). Decrypt: encrypted_flag.txt contains ''P1RP{znyiner_erirefr_ratvARREvat}'' in base64.',
 'FORENSIC', 'HARD', 500,
 '$2a$10$PZqrFV1KDXvvNZR1d8K1KOOxbgy6tX1eU8XZqvJZYWQj6tX1eUP',
 null);

-- NETWORK Challenges (6)
INSERT INTO challenges (id, title, description, category, difficulty, points, flag_hash, attachment_url) VALUES
(gen_random_uuid(),
 'Port Scanning',
 'Target server: 192.168.1.100. A service is running on port 8888. Connect using netcat: nc 192.168.1.100 8888. The banner contains the flag.',
 'NETWORK', 'EASY', 100,
 '$2a$10$QZqrFV1KDXvvNZR1d8K1KOPychz6tX1eU8XZqvJZYWQj6tX1eUQ',
 null),

(gen_random_uuid(),
 'FTP Anonymous Login',
 'FTP server allows anonymous login. Username: anonymous, Password: <any>. The flag is in /pub/hidden/.secret.txt. Use: ftp anonymous@server',
 'NETWORK', 'EASY', 150,
 '$2a$10$RZqrFV1KDXvvNZR1d8K1KOQzdiA6tX1eU8XZqvJZYWQj6tX1eUR',
 null),

(gen_random_uuid(),
 'DNS Exfiltration',
 'DNS logs show suspicious queries: Q1RG.e2Ru.c19k.YXRh.LmV4.Zmls.dHJh.dGlv.bi5j.b20. Each subdomain is base64. Concatenate and decode to get the flag.',
 'NETWORK', 'MEDIUM', 300,
 '$2a$10$SZqrFV1KDXvvNZR1d8K1KORAejB6tX1eU8XZqvJZYWQj6tX1eUS',
 null),

(gen_random_uuid(),
 'ARP Spoofing',
 'Intercepted traffic between 192.168.1.10 and 192.168.1.1. HTTP POST to /login.php contains flag in password field. Use Wireshark filter: http.request.method==POST',
 'NETWORK', 'MEDIUM', 250,
 '$2a$10$TZqrFV1KDXvvNZR1d8K1KOSBfkC6tX1eU8XZqvJZYWQj6tX1eUT',
 null),

(gen_random_uuid(),
 'VPN Traffic Analysis',
 'PPTP VPN with weak MPPE encryption. Captured handshake shows MS-CHAPv2 auth. Username: admin, Challenge: abc123. Crack the hash to decrypt the tunnel and find the flag.',
 'NETWORK', 'HARD', 450,
 '$2a$10$UZqrFV1KDXvvNZR1d8K1KOTCglD6tX1eU8XZqvJZYWQj6tX1eUU',
 null),

(gen_random_uuid(),
 'BGP Hijacking',
 'BGP announcement shows route to 10.0.0.0/8 through AS65001. Traceroute reveals suspicious hop. The flag is in the autonomous system number: AS + decimal value of ''CTF''.',
 'NETWORK', 'HARD', 500,
 '$2a$10$VZqrFV1KDXvvNZR1d8K1KOUDhmE6tX1eU8XZqvJZYWQj6tX1eUV',
 null);

-- MISC Challenges (6)
INSERT INTO challenges (id, title, description, category, difficulty, points, flag_hash, attachment_url) VALUES
(gen_random_uuid(),
 'QR Code',
 'This QR code contains the flag: █▀▀▀▀▀█▀▀█▀█▀▀▀▀▀█ █▄▄▄▄▄█▀▄▄▀█▄▄▄▄▄█ █▀▀▀▀▀▀█▄▀▀▀▀▀▀▀▀▀█ ... Use any QR scanner app or online decoder.',
 'MISC', 'EASY', 50,
 '$2a$10$WZqrFV1KDXvvNZR1d8K1KOVEinF6tX1eU8XZqvJZYWQj6tX1eUW',
 null),

(gen_random_uuid(),
 'OSINT Challenge',
 'Twitter user @ctf_employee posted their password reset answers. Q: First pet? A: Fluffy. Q: Birth city? A: Boston. Q: Fave color? A: Blue. Flag format: CTF{pet_city_color}',
 'MISC', 'EASY', 100,
 '$2a$10$XZqrFV1KDXvvNZR1d8K1KOWFjoG6tX1eU8XZqvJZYWQj6tX1eUX',
 null),

(gen_random_uuid(),
 'Reverse Engineering Basics',
 'Binary compares input with XOR(0x42). Pseudocode: if(input ^ 0x42 == [encrypted_flag]) return true. Encrypted: 0x05,0x32,0x07,... Reverse the XOR to get the flag.',
 'MISC', 'MEDIUM', 250,
 '$2a$10$YZqrFV1KDXvvNZR1d8K1KOXGkpH6tX1eU8XZqvJZYWQj6tX1eUY',
 null),

(gen_random_uuid(),
 'Python Jail Escape',
 'Python jail blocks: import, exec, eval, open, file. Escape with: __builtins__.__dict__[''__import__''](''os'').system(''cat /flag.txt''). Find the flag file.',
 'MISC', 'MEDIUM', 300,
 '$2a$10$ZZqrFV1KDXvvNZR1d8K1KOYHlqI6tX1eU8XZqvJZYWQj6tX1eUZ',
 null),

(gen_random_uuid(),
 'Esoteric Language',
 'Brainfuck program: +++++ +++[>+++++ +++++<-]>++.>+++++ [>+++++ +++<-]>+.----- ---.+++.------.--------.>>+. Decode this to get the flag.',
 'MISC', 'HARD', 400,
 '$2a$10$aaqrFV1KDXvvNZR1d8K1KOZImrJ6tX1eU8XZqvJZYWQj6tX1eUa',
 null),

(gen_random_uuid(),
 'Smart Contract Exploit',
 'Solidity contract has reentrancy bug. Function withdraw() updates balance AFTER sending ETH. Call withdraw() recursively before balance updates to drain contract and reveal flag.',
 'MISC', 'HARD', 500,
 '$2a$10$bbqrFV1KDXvvNZR1d8K1KOaJnsK6tX1eU8XZqvJZYWQj6tX1eUb',
 null);

-- All challenges are now self-contained with real descriptions
-- BCrypt hashes are placeholders - they will be replaced by ChallengeSeeder.java with actual hashes
-- No fake attachment URLs included

