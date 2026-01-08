package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.models.Challenge;
import com.example.demo.models.EChallengeCategory;
import com.example.demo.models.EChallengeDifficulty;
import com.example.demo.repositories.ChallengeRepository;

/**
 * Seeds all 6 challenges from extracted_challenges folder - 2 file-based
 * challenges (files in uploads/) - 4 Docker-based challenges (require
 * deployment)
 */
@Configuration
public class ExtractedChallengeSeeder {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedExtractedChallenges(ChallengeRepository challengeRepository) {
        return args -> {
            // Only seed if database is empty
            if (challengeRepository.count() > 0) {
                System.out.println("Challenges already exist. Skipping extracted challenges seed.");
                return;
            }

            System.out.println("Seeding all 6 extracted challenges...");

            // Challenge 1: Base64 Secret Decode
            Challenge base64Challenge = Challenge.builder()
                    .title("Base64 Secret Decode")
                    .author("Vincze Balazs Ivan")
                    .description("You are given a text file containing a Base64-encoded string. "
                            + "Decode it to retrieve the flag in the format flag{...}.\n\n"
                            + "Hint: Look at the characters: long string of letters/numbers with possible '=' padding. "
                            + "Try base64 decoding. The file contains a base64 encoded string - decode it to get the flag.")
                    .category(EChallengeCategory.CRYPTOLOGY)
                    .difficulty(EChallengeDifficulty.EASY)
                    .points(100)
                    .flagHash(passwordEncoder.encode("flag{easy_base64_example}"))
                    .attachmentUrl("/api/challenges/download/base64-secret.txt")
                    .build();

            // Challenge 2: Hidden Cat
            Challenge hiddenCatChallenge = Challenge.builder()
                    .title("Hidden Cat")
                    .author("Vincze Balazs Ivan")
                    .description("A seemingly normal cat image hides a flag inside the file. "
                            + "Inspect the file contents (especially the end) to recover the flag in the format flag{...}.\n\n"
                            + "Hint: The flag isn't in the visible image; it's hiding somewhere in the file. "
                            + "Sometimes important info is appended after the image data. "
                            + "Look at the end of the file with a tool that shows raw bytes or use 'strings' command. "
                            + "Try: strings cat.png | grep flag")
                    .category(EChallengeCategory.FORENSIC)
                    .difficulty(EChallengeDifficulty.EASY)
                    .points(100)
                    .flagHash(passwordEncoder.encode("flag{stego_cat_example}"))
                    .attachmentUrl("/api/challenges/download/hidden-cat.png")
                    .build();

            // Challenge 3: Hidden Network Treasure (PCAP forensics - requires deployment)
            Challenge networkTreasureChallenge = Challenge.builder()
                    .title("Hidden Network Treasure")
                    .author("Bertalan Tóth")
                    .description("You are given a network capture file. A secret flag is hidden inside the packet payload. "
                            + "Analyze the pcap (Wireshark/tshark), find and extract the hidden payload (it contains a Base64 string), "
                            + "then decode to obtain the flag.\n\n"
                            + "Hint: Check Packet Bytes or use 'Follow TCP Stream'. The flag is encoded (Base64) within one payload.\n\n"
                            + "Note: This challenge requires Docker deployment. Files are in server/extracted_challenges/hidden-network-treasure/")
                    .category(EChallengeCategory.FORENSIC)
                    .difficulty(EChallengeDifficulty.MEDIUM)
                    .points(250)
                    .flagHash(passwordEncoder.encode("flag{network_forensics_master}"))
                    .attachmentUrl(null) // Requires Docker deployment
                    .build();

            // Challenge 4: Stored Comment Injector (Stored XSS - requires deployment)
            Challenge storedXssChallenge = Challenge.builder()
                    .title("Stored Comment Injector")
                    .author("Paweł Jamroziak")
                    .description("Two-step stored XSS challenge where an admin bot stores a secret in localStorage. "
                            + "Exploit the comment system to steal the admin's flag.\n\n"
                            + "Technical Details:\n"
                            + "- Go backend serves a vulnerable comment system\n"
                            + "- Node.js admin bot visits comments with Puppeteer\n"
                            + "- Admin bot stores flag in localStorage\n"
                            + "- Intentionally vulnerable to stored XSS\n\n"
                            + "Note: This challenge requires Docker deployment. Files are in server/extracted_challenges/stored-comment-injector/")
                    .category(EChallengeCategory.WEB)
                    .difficulty(EChallengeDifficulty.MEDIUM)
                    .points(300)
                    .flagHash(passwordEncoder.encode("flag{stored_xss_admin_pwned}"))
                    .attachmentUrl(null) // Requires Docker deployment
                    .build();

            // Challenge 5: Hidden Key Cookie Forge (Flask app - requires deployment)
            Challenge cookieForgeChallenge = Challenge.builder()
                    .title("Hidden Key Cookie Forge")
                    .author("Shane Samuel PRADEEP")
                    .description("Find the secret in PNG metadata and forge a session cookie to retrieve the flag.\n\n"
                            + "Steps to solve:\n"
                            + "1. Download the PNG and inspect its metadata (look for textual metadata)\n"
                            + "2. Extract the secret key\n"
                            + "3. Calculate HMAC-SHA256(username, secret) to forge signature\n"
                            + "4. Create cookie: session=admin|HEX_SIGNATURE\n"
                            + "5. Use cookie to access /flag endpoint\n\n"
                            + "Hint: Signature is HMAC-SHA256(username, secret). Cookie format: session=USERNAME|HEX_SIGNATURE\n\n"
                            + "Note: This challenge requires Docker deployment. Files are in server/extracted_challenges/hidden-key-cookie-forge/")
                    .category(EChallengeCategory.WEB)
                    .difficulty(EChallengeDifficulty.HARD)
                    .points(400)
                    .flagHash(passwordEncoder.encode("flag{cookie_forgery_master}"))
                    .attachmentUrl(null) // Requires Docker deployment
                    .build();

            // Challenge 6: Hard RSA Full (RSA cryptanalysis - requires deployment)
            Challenge hardRsaChallenge = Challenge.builder()
                    .title("Hard RSA Full")
                    .author("Rn7595 Navin")
                    .description("Full RSA challenge where you must recover the private key from the exposed public key "
                            + "and decrypt the encrypted flag. No hints are provided.\n\n"
                            + "API Endpoints:\n"
                            + "- GET /pub → Returns RSA public key (n, e)\n"
                            + "- GET /cipher → Returns ciphertext of the FLAG\n\n"
                            + "Your task: Cryptanalyze the RSA key to recover the plaintext flag.\n\n"
                            + "Note: This challenge requires Docker deployment. Files are in server/extracted_challenges/hard-rsa-full/")
                    .category(EChallengeCategory.CRYPTOLOGY)
                    .difficulty(EChallengeDifficulty.HARD)
                    .points(500)
                    .flagHash(passwordEncoder.encode("flag{rsa_cryptanalysis_expert}"))
                    .attachmentUrl(null) // Requires Docker deployment
                    .build();

            challengeRepository.save(base64Challenge);
            challengeRepository.save(hiddenCatChallenge);
            challengeRepository.save(networkTreasureChallenge);
            challengeRepository.save(storedXssChallenge);
            challengeRepository.save(cookieForgeChallenge);
            challengeRepository.save(hardRsaChallenge);

            System.out.println("Successfully seeded all 6 extracted challenges!");
            System.out.println("  - 2 file-based challenges (ready to use)");
            System.out.println("  - 4 Docker-based challenges (require deployment)");
        };
    }
}
