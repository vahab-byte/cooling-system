import nodemailer from 'nodemailer';

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (NOT regular password)
  },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log('📧 Email service connected successfully'))
  .catch((err) => console.warn('⚠️  Email service not configured:', err.message));

/**
 * Send a verification OTP email with a premium HTML template
 */
export const sendVerificationEmail = async (toEmail, otpCode, fullName) => {
  const mailOptions = {
    from: `"ArcticFresh" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify Your Email — ArcticFresh',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="480" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:40px 40px 32px;text-align:center;">
              <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                ❄️ ArcticFresh
              </div>
              <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:3px;margin-top:8px;">
                Email Verification
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
                Hello, ${fullName || 'there'}! 👋
              </h2>
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
                Welcome to ArcticFresh! Please use the verification code below to complete your registration.
              </p>

              <!-- OTP Code Box -->
              <div style="background:#f8fafc;border:2px dashed #e2e8f0;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
                <div style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;">
                  Your Verification Code
                </div>
                <div style="font-size:40px;font-weight:900;color:#0f172a;letter-spacing:12px;font-family:'Courier New',monospace;">
                  ${otpCode}
                </div>
              </div>

              <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;">
                ⏰ This code expires in <strong style="color:#0f172a;">10 minutes</strong>.
              </p>
              <p style="margin:0;font-size:13px;color:#94a3b8;">
                🔒 If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;font-weight:600;">
                © ${new Date().getFullYear()} ArcticFresh • Premium AC Services
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (toEmail, otpCode, fullName) => {
  const mailOptions = {
    from: `"ArcticFresh" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Code — ArcticFresh',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="480" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#dc2626 0%,#7c3aed 100%);padding:40px 40px 32px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🔐 ArcticFresh</div>
            <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:3px;margin-top:8px;">Password Reset</div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Hi, ${fullName || 'there'}! 👋</h2>
            <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">We received a request to reset your ArcticFresh password. Use the code below — it expires in 10 minutes.</p>
            <div style="background:#fef2f2;border:2px dashed #fca5a5;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
              <div style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;">Your Reset Code</div>
              <div style="font-size:40px;font-weight:900;color:#dc2626;letter-spacing:12px;font-family:'Courier New',monospace;">${otpCode}</div>
            </div>
            <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;">⏰ This code expires in <strong style="color:#0f172a;">10 minutes</strong>.</p>
            <p style="margin:0;font-size:13px;color:#94a3b8;">🔒 If you didn't request this, your account is safe — please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
            <p style="margin:0;font-size:11px;color:#cbd5e1;font-weight:600;">© ${new Date().getFullYear()} ArcticFresh • Premium AC Services</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
  return transporter.sendMail(mailOptions);
};

export default transporter;
