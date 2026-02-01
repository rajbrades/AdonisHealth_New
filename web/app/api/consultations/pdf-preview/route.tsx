import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dataParam = searchParams.get("data")

  if (!dataParam) {
    return new NextResponse("Missing data parameter", { status: 400 })
  }

  const noteData = JSON.parse(decodeURIComponent(dataParam))

  // Generate PDF HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Clinical Note</title>
  <style>
    @page {
      margin: 0.75in;
      size: letter;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      max-width: 7.5in;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #E4C172;
      padding-bottom: 0.5in;
      margin-bottom: 0.3in;
    }
    .logo {
      font-size: 18pt;
      font-weight: bold;
      letter-spacing: 2px;
      color: #E4C172;
    }
    .patient-info {
      margin-top: 0.2in;
      font-size: 10pt;
    }
    .section {
      margin-bottom: 0.3in;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4pt;
      margin-bottom: 8pt;
      color: #E4C172;
    }
    .content {
      margin-left: 0.15in;
      white-space: pre-wrap;
    }
    .medication-entry {
      margin-bottom: 0.15in;
      padding: 8pt;
      border: 1px solid #ddd;
      background: #f9f9f9;
    }
    .medication-name {
      font-weight: bold;
      font-size: 11pt;
    }
    .medication-details {
      font-size: 10pt;
      margin-top: 4pt;
      color: #555;
    }
    .footer {
      margin-top: 0.5in;
      padding-top: 0.2in;
      border-top: 1px solid #ccc;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ADONIS</div>
    <div class="patient-info">
      <strong>Patient:</strong> Michael Chen<br>
      <strong>Consultation Date:</strong> January 20, 2026<br>
      <strong>Consultation Type:</strong> Initial Consultation<br>
      <strong>Provider:</strong> Dr. Miller
    </div>
  </div>

  ${noteData.sections.chiefComplaint ? `
  <div class="section">
    <div class="section-title">Chief Complaint</div>
    <div class="content">${noteData.sections.chiefComplaint}</div>
  </div>
  ` : ''}

  ${noteData.sections.labReview ? `
  <div class="section">
    <div class="section-title">Lab Review</div>
    <div class="content">${noteData.sections.labReview}</div>
  </div>
  ` : ''}

  ${noteData.sections.lifestyleReview ? `
  <div class="section">
    <div class="section-title">Lifestyle & Health Pillars</div>
    <div class="content">${noteData.sections.lifestyleReview}</div>
  </div>
  ` : ''}

  ${noteData.sections.medicationChanges && noteData.sections.medicationChanges.length > 0 ? `
  <div class="section">
    <div class="section-title">Medication Changes</div>
    <div class="content">
      ${noteData.sections.medicationChanges.map((med: any) => `
        <div class="medication-entry">
          <div class="medication-name">${med.name}</div>
          <div class="medication-details">
            <strong>Dose:</strong> ${med.dose} | <strong>Frequency:</strong> ${med.frequency}<br>
            <strong>Instructions:</strong> ${med.instructions}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${noteData.sections.supplementChanges && noteData.sections.supplementChanges.length > 0 ? `
  <div class="section">
    <div class="section-title">Supplement Changes</div>
    <div class="content">
      ${noteData.sections.supplementChanges.map((supp: any) => `
        <div class="medication-entry">
          <div class="medication-name">${supp.name}</div>
          <div class="medication-details">
            <strong>Dose:</strong> ${supp.dose} | <strong>Frequency:</strong> ${supp.frequency}<br>
            <strong>Instructions:</strong> ${supp.instructions}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${noteData.sections.assessment ? `
  <div class="section">
    <div class="section-title">Assessment</div>
    <div class="content">${noteData.sections.assessment}</div>
  </div>
  ` : ''}

  ${noteData.sections.plan ? `
  <div class="section">
    <div class="section-title">Plan</div>
    <div class="content">${noteData.sections.plan}</div>
  </div>
  ` : ''}

  <div class="footer">
    <strong>ADONIS Health</strong> | Premium Telemedicine for Executive Men's Health<br>
    This clinical note is confidential and intended for medical use only.
  </div>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
