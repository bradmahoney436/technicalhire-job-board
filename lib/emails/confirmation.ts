const VERTICAL_LABELS: Record<string, string> = {
  fintech: "Fintech",
  "ai-ml": "AI / ML",
  healthtech: "Healthtech",
  "integration-etl": "Integration / ETL",
  insurtech: "Insurtech",
  hrtech: "HR Tech",
};

export function confirmationEmail(email: string, vertical: string | null) {
  const verticalLabel = vertical ? VERTICAL_LABELS[vertical] ?? vertical : null;
  const focusLine = verticalLabel
    ? `You'll hear from us when new <strong>${verticalLabel}</strong> roles are posted.`
    : "You'll hear from us when new roles are posted across all verticals.";

  const subject = "You're on the list — Technical Hire";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#4f46e5;padding:28px 40px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Technical Hire</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827;line-height:1.3;">
                You're on the list.
              </h1>
              <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
                ${focusLine}
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                In the meantime, browse what's live now:
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#4f46e5;">
                    <a href="https://technicalhire.io/jobs"
                       style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Browse open roles &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                You signed up at technicalhire.io with ${email}.<br/>
                If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `You're on the list — Technical Hire\n\n${focusLine.replace(/<strong>|<\/strong>/g, "")}\n\nBrowse open roles: https://technicalhire.io/jobs\n\nYou signed up with ${email}. If this wasn't you, ignore this email.`;

  return { subject, html, text };
}
