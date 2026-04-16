package com.elmn.SecurityLastChance.service;

import com.elmn.SecurityLastChance.exception.EmailDeliveryException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:${spring.mail.username}}")
    private String from;

    @Value("${app.mail.verification.subject:Verify your email address}")
    private String verificationSubject;

    @Value("${app.mail.verification.expiry-minutes:10}")
    private int expiryMinutes;

    @Value("${app.mail.application-name:Elmn}")
    private String applicationName;

    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(toEmail);
        message.setSubject(verificationSubject);
        message.setText(buildVerificationBody(code));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new EmailDeliveryException("Unable to send verification email. Please try again.");
        }
    }

    private String buildVerificationBody(String code) {
        return String.join("\n",
                "Hello,",
                "",
                "Your " + applicationName + " verification code is: " + code,
                "",
                "This code expires in " + expiryMinutes + " minutes.",
                "",
                "If you did not create this account, please ignore this email.",
                "",
                "Best regards,",
                applicationName + " Team"
        );
    }
}
