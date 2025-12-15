# Challenge Seeding Summary

## Overview
30 challenges have been created covering all categories and difficulties:
- **6 challenges per category** (WEB, CRYPTOLOGY, FORENSIC, NETWORK, MISC)
- **2 EASY, 2 MEDIUM, 2 HARD per category**

**Note:** All challenges are self-contained with instructions and clues in the descriptions. No external file attachments required - everything you need is provided in the challenge text!

---

## 🌐 WEB Challenges (6)

### EASY (2)
1. **SQL Injection Basics** (100 points)
   - Flag: `CTF{sql_injection_master}`
   - Description: Basic SQL injection in a login form
   - All instructions included in challenge description

2. **XSS Reflected** (150 points)
   - Flag: `CTF{xss_reflected_attack}`
   - Description: Reflected XSS in a search page

### MEDIUM (2)
3. **Command Injection** (250 points)
   - Flag: `CTF{command_injection_success}`
   - Description: OS command injection in a ping utility

4. **CSRF Token Bypass** (300 points)
   - Flag: `CTF{csrf_protection_bypassed}`
   - Description: Bypass flawed CSRF token implementation

### HARD (2)
5. **Blind SQL Injection** (400 points)
   - Flag: `CTF{blind_sqli_time_based}`
   - Description: Time-based blind SQL injection
   - Attachment: blind-sqli.zip

6. **Deserialization Attack** (500 points)
   - Flag: `CTF{deserialization_rce}`
   - Description: Exploit deserialization for RCE

---

## 🔐 CRYPTOLOGY Challenges (6)

### EASY (2)
1. **Caesar Cipher** (100 points)
   - Flag: `CTF{caesar_cipher_master}`
   - Description: Decrypt Caesar cipher with shift 3

2. **Base64 Encoding** (100 points)
   - Flag: `CTF{base64_is_not_encryption}`
   - Description: Decode Base64 encoded flag

### MEDIUM (2)
3. **RSA Weak Key** (300 points)
   - Flag: `CTF{rsa_factorization_attack}`
   - Description: Factor weak RSA primes
   - Attachment: rsa-weak.zip

4. **Vigenere Cipher** (250 points)
   - Flag: `CTF{vigenere_frequency_analysis}`
   - Description: Break Vigenere cipher with frequency analysis
   - Attachment: vigenere.txt

### HARD (2)
5. **AES ECB Mode** (450 points)
   - Flag: `CTF{aes_ecb_penguin_attack}`
   - Description: Exploit AES ECB mode weakness
   - Attachment: aes-ecb.zip

6. **Hash Length Extension** (500 points)
   - Flag: `CTF{hash_length_extension}`
   - Description: Perform hash length extension attack

---

## 🔍 FORENSIC Challenges (6)

### EASY (2)
1. **Hidden in Plain Sight** (100 points)
   - Flag: `CTF{steganography_basics}`
   - Description: Basic image steganography
   - Attachment: stego-basic.png

2. **Deleted Files** (150 points)
   - Flag: `CTF{file_carving_recovery}`
   - Description: Recover deleted files from disk image
   - Attachment: disk.img

### MEDIUM (2)
3. **Memory Dump Analysis** (300 points)
   - Flag: `CTF{memory_forensics_volatility}`
   - Description: Analyze memory dump with Volatility
   - Attachment: memdump.raw

4. **PCAP Analysis** (250 points)
   - Flag: `CTF{wireshark_packet_analysis}`
   - Description: Analyze network traffic in Wireshark
   - Attachment: traffic.pcap

### HARD (2)
5. **Advanced Steganography** (450 points)
   - Flag: `CTF{audio_steganography_lsb}`
   - Description: Extract flag from audio file LSB
   - Attachment: audio-stego.wav

6. **Ransomware Analysis** (500 points)
   - Flag: `CTF{malware_reverse_engineering}`
   - Description: Reverse engineer ransomware
   - Attachment: ransomware.zip

---

## 🌐 NETWORK Challenges (6)

### EASY (2)
1. **Port Scanning** (100 points)
   - Flag: `CTF{nmap_port_discovery}`
   - Description: Discover hidden service with nmap

2. **FTP Anonymous Login** (150 points)
   - Flag: `CTF{anonymous_ftp_access}`
   - Description: Find flag on anonymous FTP server

### MEDIUM (2)
3. **DNS Exfiltration** (300 points)
   - Flag: `CTF{dns_data_exfiltration}`
   - Description: Reconstruct data from DNS logs
   - Attachment: dns-logs.txt

4. **ARP Spoofing** (250 points)
   - Flag: `CTF{arp_man_in_the_middle}`
   - Description: Perform ARP MITM attack

### HARD (2)
5. **VPN Traffic Analysis** (450 points)
   - Flag: `CTF{vpn_weak_encryption}`
   - Description: Break weak VPN encryption
   - Attachment: vpn-traffic.pcap

6. **BGP Hijacking** (500 points)
   - Flag: `CTF{bgp_route_hijacking}`
   - Description: Trace BGP route hijacking
   - Attachment: bgp-dump.txt

---

## 🎲 MISC Challenges (6)

### EASY (2)
1. **QR Code** (50 points)
   - Flag: `CTF{qr_code_scanning}`
   - Description: Scan QR code
   - Attachment: qrcode.png

2. **OSINT Challenge** (100 points)
   - Flag: `CTF{open_source_intelligence}`
   - Description: Find flag using OSINT techniques

### MEDIUM (2)
3. **Reverse Engineering Basics** (250 points)
   - Flag: `CTF{reversing_crackme_101}`
   - Description: Reverse engineer simple binary
   - Attachment: crackme.exe

4. **Python Jail Escape** (300 points)
   - Flag: `CTF{python_sandbox_escape}`
   - Description: Escape Python sandbox

### HARD (2)
5. **Esoteric Language** (400 points)
   - Flag: `CTF{esoteric_programming}`
   - Description: Decode Brainfuck program
   - Attachment: brainfuck.bf

6. **Smart Contract Exploit** (500 points)
   - Flag: `CTF{smart_contract_reentrancy}`
   - Description: Exploit reentrancy vulnerability
   - Attachment: contract.sol

---

## 📊 Statistics

### By Category
- **WEB**: 6 challenges, 1,500 total points
- **CRYPTOLOGY**: 6 challenges, 1,550 total points
- **FORENSIC**: 6 challenges, 1,550 total points
- **NETWORK**: 6 challenges, 1,550 total points
- **MISC**: 6 challenges, 1,400 total points

### By Difficulty
- **EASY**: 10 challenges (50-150 points each)
- **MEDIUM**: 10 challenges (250-300 points each)
- **HARD**: 10 challenges (400-500 points each)

### Total
- **30 challenges**
- **7,550 total points available**

---

## 🚀 How to Seed

The challenges will be automatically seeded when the application starts **if the database is empty**.

### Manual Seeding

If you need to re-seed:

1. **Clear existing challenges:**
   ```sql
   DELETE FROM submissions;
   DELETE FROM challenges;
   ```

2. **Restart the application:**
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

The `ChallengeSeeder` bean will detect the empty database and seed all 30 challenges.

---

## 🔑 All Flags Reference

For testing purposes, here are all the flags:

```
CTF{sql_injection_master}
CTF{xss_reflected_attack}
CTF{command_injection_success}
CTF{csrf_protection_bypassed}
CTF{blind_sqli_time_based}
CTF{deserialization_rce}
CTF{caesar_cipher_master}
CTF{base64_is_not_encryption}
CTF{rsa_factorization_attack}
CTF{vigenere_frequency_analysis}
CTF{aes_ecb_penguin_attack}
CTF{hash_length_extension}
CTF{steganography_basics}
CTF{file_carving_recovery}
CTF{memory_forensics_volatility}
CTF{wireshark_packet_analysis}
CTF{audio_steganography_lsb}
CTF{malware_reverse_engineering}
CTF{nmap_port_discovery}
CTF{anonymous_ftp_access}
CTF{dns_data_exfiltration}
CTF{arp_man_in_the_middle}
CTF{vpn_weak_encryption}
CTF{bgp_route_hijacking}
CTF{qr_code_scanning}
CTF{open_source_intelligence}
CTF{reversing_crackme_101}
CTF{python_sandbox_escape}
CTF{esoteric_programming}
CTF{smart_contract_reentrancy}
```

**Note:** These flags are hashed with BCrypt before being stored in the database.

---

## ✅ Verification

After seeding, verify by:

```bash
curl -k https://localhost:9090/api/challenges
```

You should see all 30 challenges returned.

### Test Submission

Login as admin or a user, then test submitting a flag:

```bash
curl -k -X POST https://localhost:9090/api/challenges/{challenge-id}/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"CTF{sql_injection_master}"}'
```

If correct, you should receive points!

---

## 🎯 Educational Value

These challenges cover:
- **Web Security**: Injection attacks, XSS, CSRF, serialization
- **Cryptography**: Classical & modern ciphers, RSA, AES, hashing
- **Digital Forensics**: Steganography, memory analysis, file recovery
- **Network Security**: Port scanning, MITM, protocol analysis
- **Miscellaneous**: Reverse engineering, OSINT, smart contracts

Perfect for learning and practicing cybersecurity skills! 🛡️

