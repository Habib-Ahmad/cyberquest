package com.example.demo.config;

import com.example.demo.models.Challenge;
import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import com.example.demo.repositories.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class ChallengeSeeder {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedChallenges(ChallengeRepository challengeRepository) {
        return args -> {
            // Only seed if database is empty
            if (challengeRepository.count() > 0) {
                System.out.println("Challenges already exist. Skipping seed.");
                return;
            }

            System.out.println("Seeding challenges...");

            List<Challenge> challenges = new ArrayList<>();

            // WEB Challenges
            challenges.add(createChallenge(
                "SQL Injection Basics",
                "A simple login form is vulnerable to SQL injection. Can you bypass the authentication? Try: admin' OR '1'='1'-- to login. The flag will be displayed after successful login.",
                EChallengeCategory.WEB,
                EChallengeDifficulty.EASY,
                100,
                "CTF{sql_injection_master}",
                null
            ));

            challenges.add(createChallenge(
                "XSS Reflected",
                "This search page reflects your input without sanitization. The flag is hidden in the admin's cookie. Test with: <script>alert(document.cookie)</script>",
                EChallengeCategory.WEB,
                EChallengeDifficulty.EASY,
                150,
                "CTF{xss_reflected_attack}",
                null
            ));

            challenges.add(createChallenge(
                "Command Injection",
                "A ping utility at /ping allows you to check server connectivity. However, it doesn't properly sanitize user input. Try: 127.0.0.1; cat flag.txt",
                EChallengeCategory.WEB,
                EChallengeDifficulty.MEDIUM,
                250,
                "CTF{command_injection_success}",
                null
            ));

            challenges.add(createChallenge(
                "CSRF Token Bypass",
                "This application uses CSRF tokens, but the implementation has flaws. The token is only validated if present. Craft a request without the token parameter.",
                EChallengeCategory.WEB,
                EChallengeDifficulty.MEDIUM,
                300,
                "CTF{csrf_protection_bypassed}",
                null
            ));

            challenges.add(createChallenge(
                "Blind SQL Injection",
                "The application is vulnerable to SQL injection at /search, but returns no error messages. Use time-based payloads: ' AND SLEEP(5)-- to confirm vulnerability.",
                EChallengeCategory.WEB,
                EChallengeDifficulty.HARD,
                400,
                "CTF{blind_sqli_time_based}",
                null
            ));

            challenges.add(createChallenge(
                "Deserialization Attack",
                "The application deserializes base64-encoded user data in the 'session' cookie. Craft a malicious Java object payload to read /flag.txt from the server.",
                EChallengeCategory.WEB,
                EChallengeDifficulty.HARD,
                500,
                "CTF{deserialization_rce}",
                null
            ));

            // CRYPTOLOGY Challenges
            challenges.add(createChallenge(
                "Caesar Cipher",
                "The flag has been encrypted using a Caesar cipher with shift 3. Decrypt this ciphertext: FWI{fdhvdu_flskhu_pdvwhu}",
                EChallengeCategory.CRYPTOLOGY,
                EChallengeDifficulty.EASY,
                100,
                "CTF{caesar_cipher_master}",
                null
            ));

            challenges.add(createChallenge(
                "Base64 Encoding",
                "The flag is hidden in plain sight, just base64 encoded: Q1RGe2Jhc2U2NF9pc19ub3RfZW5jcnlwdGlvbn0=",
                EChallengeCategory.CRYPTOLOGY,
                EChallengeDifficulty.EASY,
                100,
                "CTF{base64_is_not_encryption}",
                null
            ));

            challenges.add(createChallenge(
                "RSA Weak Key",
                "We intercepted an RSA encrypted message. Public key: n=143, e=7. Ciphertext: c=2. The primes are small enough to factor. Decrypt to get the flag.",
                EChallengeCategory.CRYPTOLOGY,
                EChallengeDifficulty.MEDIUM,
                300,
                "CTF{rsa_factorization_attack}",
                null
            ));

            challenges.add(createChallenge(
                "Vigenere Cipher",
                "Vigenere cipher with 5-letter key. Ciphertext: VVMGA{znnhqgsm_kypqrppun_sfsjzkxx}. Hint: The key starts with 'C'. Use frequency analysis.",
                EChallengeCategory.CRYPTOLOGY,
                EChallengeDifficulty.MEDIUM,
                250,
                "CTF{vigenere_frequency_analysis}",
                null
            ));

            challenges.add(createChallenge(
                "AES ECB Mode",
                "Flag encrypted with AES-ECB. Key is 'YELLOW SUBMARINE'. Ciphertext (hex): 8d9e3c5e7e8c8e3e8d9e3c5e7e8c8e3e (truncated). Exploit ECB's weakness with identical blocks.",
                EChallengeCategory.CRYPTOLOGY,
                EChallengeDifficulty.HARD,
                450,
                "CTF{aes_ecb_penguin_attack}",
                null
            ));

            challenges.add(createChallenge(
                "Hash Length Extension",
                "API uses SHA256(secret||message) for auth. Known: SHA256(secret||'admin=false')=abc123. Forge SHA256(secret||'admin=false&admin=true') without knowing secret.",
                EChallengeCategory.CRYPTOLOGY,
                EChallengeDifficulty.HARD,
                500,
                "CTF{hash_length_extension}",
                null
            ));

            // FORENSIC Challenges
            challenges.add(createChallenge(
                "Hidden in Plain Sight",
                "An image contains hidden data. The PNG file has extra data appended. Use 'strings' or a hex editor to find the flag hidden in the metadata.",
                EChallengeCategory.FORENSIC,
                EChallengeDifficulty.EASY,
                100,
                "CTF{steganography_basics}",
                null
            ));

            challenges.add(createChallenge(
                "Deleted Files",
                "A USB drive was formatted but forensic traces remain. The flag was in 'secret.txt'. Use file carving techniques to recover deleted data. Hint: Look for 'CTF{' signature.",
                EChallengeCategory.FORENSIC,
                EChallengeDifficulty.EASY,
                150,
                "CTF{file_carving_recovery}",
                null
            ));

            challenges.add(createChallenge(
                "Memory Dump Analysis",
                "Memory dump from Windows system. Suspicious process 'flag.exe' was running. Use Volatility: volatility -f mem.raw --profile=Win7SP1x64 pslist to find the flag in process memory.",
                EChallengeCategory.FORENSIC,
                EChallengeDifficulty.MEDIUM,
                300,
                "CTF{memory_forensics_volatility}",
                null
            ));

            challenges.add(createChallenge(
                "PCAP Analysis",
                "Network traffic capture shows suspicious FTP activity. The attacker uploaded a file containing the flag. Filter by 'ftp-data' protocol in Wireshark to find it.",
                EChallengeCategory.FORENSIC,
                EChallengeDifficulty.MEDIUM,
                250,
                "CTF{wireshark_packet_analysis}",
                null
            ));

            challenges.add(createChallenge(
                "Advanced Steganography",
                "Audio file with LSB steganography. Extract with: stegpy extract audio.wav. The extracted data is XOR encrypted with key 'KEY'. Flag format: CTF{...}",
                EChallengeCategory.FORENSIC,
                EChallengeDifficulty.HARD,
                450,
                "CTF{audio_steganography_lsb}",
                null
            ));

            challenges.add(createChallenge(
                "Ransomware Analysis",
                "Files encrypted by custom ransomware. Binary analysis reveals it uses ROT13 + Base64 (weak encryption). Decrypt: encrypted_flag.txt contains 'P1RP{znyiner_erirefr_ratvARREvat}' in base64.",
                EChallengeCategory.FORENSIC,
                EChallengeDifficulty.HARD,
                500,
                "CTF{malware_reverse_engineering}",
                null
            ));

            // NETWORK Challenges
            challenges.add(createChallenge(
                "Port Scanning",
                "Target server: 192.168.1.100. A service is running on port 8888. Connect using netcat: nc 192.168.1.100 8888. The banner contains the flag.",
                EChallengeCategory.NETWORK,
                EChallengeDifficulty.EASY,
                100,
                "CTF{nmap_port_discovery}",
                null
            ));

            challenges.add(createChallenge(
                "FTP Anonymous Login",
                "FTP server allows anonymous login. Username: anonymous, Password: <any>. The flag is in /pub/hidden/.secret.txt. Use: ftp anonymous@server",
                EChallengeCategory.NETWORK,
                EChallengeDifficulty.EASY,
                150,
                "CTF{anonymous_ftp_access}",
                null
            ));

            challenges.add(createChallenge(
                "DNS Exfiltration",
                "DNS logs show suspicious queries: Q1RG.e2Ru.c19k.YXRh.LmV4.Zmls.dHJh.dGlv.bi5j.b20. Each subdomain is base64. Concatenate and decode to get the flag.",
                EChallengeCategory.NETWORK,
                EChallengeDifficulty.MEDIUM,
                300,
                "CTF{dns_data_exfiltration}",
                null
            ));

            challenges.add(createChallenge(
                "ARP Spoofing",
                "Intercepted traffic between 192.168.1.10 and 192.168.1.1. HTTP POST to /login.php contains flag in password field. Use Wireshark filter: http.request.method==POST",
                EChallengeCategory.NETWORK,
                EChallengeDifficulty.MEDIUM,
                250,
                "CTF{arp_man_in_the_middle}",
                null
            ));

            challenges.add(createChallenge(
                "VPN Traffic Analysis",
                "PPTP VPN with weak MPPE encryption. Captured handshake shows MS-CHAPv2 auth. Username: admin, Challenge: abc123. Crack the hash to decrypt the tunnel and find the flag.",
                EChallengeCategory.NETWORK,
                EChallengeDifficulty.HARD,
                450,
                "CTF{vpn_weak_encryption}",
                null
            ));

            challenges.add(createChallenge(
                "BGP Hijacking",
                "BGP announcement shows route to 10.0.0.0/8 through AS65001. Traceroute reveals suspicious hop. The flag is in the autonomous system number: AS + decimal value of 'CTF'.",
                EChallengeCategory.NETWORK,
                EChallengeDifficulty.HARD,
                500,
                "CTF{bgp_route_hijacking}",
                null
            ));

            // MISC Challenges
            challenges.add(createChallenge(
                "QR Code",
                "This QR code contains the flag: █▀▀▀▀▀█▀▀█▀█▀▀▀▀▀█ █▄▄▄▄▄█▀▄▄▀█▄▄▄▄▄█ █▀▀▀▀▀▀█▄▀▀▀▀▀▀▀▀▀█ ... Use any QR scanner app or online decoder.",
                EChallengeCategory.MISC,
                EChallengeDifficulty.EASY,
                50,
                "CTF{qr_code_scanning}",
                null
            ));

            challenges.add(createChallenge(
                "OSINT Challenge",
                "Twitter user @ctf_employee posted their password reset answers. Q: First pet? A: Fluffy. Q: Birth city? A: Boston. Q: Fave color? A: Blue. Flag format: CTF{pet_city_color}",
                EChallengeCategory.MISC,
                EChallengeDifficulty.EASY,
                100,
                "CTF{open_source_intelligence}",
                null
            ));

            challenges.add(createChallenge(
                "Reverse Engineering Basics",
                "Binary compares input with XOR(0x42). Pseudocode: if(input ^ 0x42 == [encrypted_flag]) return true. Encrypted: 0x05,0x32,0x07,... Reverse the XOR to get the flag.",
                EChallengeCategory.MISC,
                EChallengeDifficulty.MEDIUM,
                250,
                "CTF{reversing_crackme_101}",
                null
            ));

            challenges.add(createChallenge(
                "Python Jail Escape",
                "Python jail blocks: import, exec, eval, open, file. Escape with: __builtins__.__dict__['__import__']('os').system('cat /flag.txt'). Find the flag file.",
                EChallengeCategory.MISC,
                EChallengeDifficulty.MEDIUM,
                300,
                "CTF{python_sandbox_escape}",
                null
            ));

            challenges.add(createChallenge(
                "Esoteric Language",
                "Brainfuck program: +++++ +++[>+++++ +++++<-]>++.>+++++ [>+++++ +++<-]>+.----- ---.+++.------.--------.>>+. Decode this to get the flag.",
                EChallengeCategory.MISC,
                EChallengeDifficulty.HARD,
                400,
                "CTF{esoteric_programming}",
                null
            ));

            challenges.add(createChallenge(
                "Smart Contract Exploit",
                "Solidity contract has reentrancy bug. Function withdraw() updates balance AFTER sending ETH. Call withdraw() recursively before balance updates to drain contract and reveal flag.",
                EChallengeCategory.MISC,
                EChallengeDifficulty.HARD,
                500,
                "CTF{smart_contract_reentrancy}",
                null
            ));

            // Save all challenges
            challengeRepository.saveAll(challenges);
            System.out.println("Successfully seeded " + challenges.size() + " challenges!");
        };
    }

    private Challenge createChallenge(String title, String description, EChallengeCategory category,
                                     EChallengeDifficulty difficulty, Integer points, String flag, String attachmentUrl) {
        return Challenge.builder()
                .title(title)
                .description(description)
                .category(category)
                .difficulty(difficulty)
                .points(points)
                .flagHash(passwordEncoder.encode(flag))
                .attachmentUrl(attachmentUrl)
                .build();
    }
}

