import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function exportDashboard() {
  const pdf = new jsPDF();

  // ====================================
  // PAGE 1 - COVER
  // ====================================

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 297, "F");

  pdf.setTextColor(255, 255, 255);

  pdf.setFontSize(28);
  pdf.text(
    "India Oil Risk",
    20,
    60
  );

  pdf.setFontSize(20);
  pdf.text(
    "Energy Intelligence Report",
    20,
    80
  );

  pdf.setFontSize(12);
  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    105
  );

  pdf.text(
    "Prepared for Strategic Energy Monitoring",
    20,
    120
  );

  // ====================================
  // PAGE 2 - EXECUTIVE SUMMARY
  // ====================================

  pdf.addPage();

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 20, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.text("Executive Summary", 20, 13);

  pdf.setTextColor(0, 0, 0);

  const summary = [
    "Russia remains highest geopolitical risk supplier.",
    "Brent crude remains above $90/bbl.",
    "India import dependency exceeds 87%.",
    "Supply disruption risk remains elevated.",
  ];

  summary.forEach((item, index) => {
    pdf.text(
      `• ${item}`,
      20,
      40 + index * 15
    );
  });

  // Risk box

  pdf.setFillColor(254, 242, 242);

  pdf.roundedRect(
    20,
    110,
    80,
    25,
    3,
    3,
    "F"
  );

  pdf.setTextColor(220, 38, 38);

  pdf.setFontSize(16);
  pdf.text(
    "Overall Risk: 57/100",
    25,
    125
  );

  pdf.setTextColor(0, 0, 0);

  // ====================================
  // PAGE 3 - KEY METRICS
  // ====================================

  pdf.addPage();

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 20, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.text("Key Metrics", 20, 13);

  autoTable(pdf, {
    startY: 35,

    head: [["Metric", "Value"]],

    body: [
      ["Brent Crude", "$90.20"],
      ["Import Dependency", "87.3%"],
      ["Average Risk Score", "57/100"],
      ["Top Supplier", "Russia"],
    ],

    headStyles: {
      fillColor: [15, 23, 42],
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // ====================================
  // PAGE 4 - COUNTRY RISK
  // ====================================

  pdf.addPage();

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 20, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.text(
    "Country Risk Analysis",
    20,
    13
  );

  autoTable(pdf, {
    startY: 35,

    head: [
      [
        "Country",
        "Risk Score",
        "Import Share",
      ],
    ],

    body: [
      ["Russia", "78", "35%"],
      ["Venezuela", "76", "3%"],
      ["Iraq", "65", "22%"],
      ["Nigeria", "60", "4%"],
      ["Saudi Arabia", "52", "18%"],
      ["UAE", "38", "10%"],
      ["USA", "32", "8%"],
    ],

    headStyles: {
      fillColor: [15, 23, 42],
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },

    didParseCell(data) {
      if (
        data.column.index === 1 &&
        data.section === "body"
      ) {
        const risk = Number(data.cell.raw);

        if (risk >= 70) {
          data.cell.styles.fillColor = [
            239,
            68,
            68,
          ];
          data.cell.styles.textColor = [
            255,
            255,
            255,
          ];
        } else if (risk < 50) {
          data.cell.styles.fillColor = [
            34,
            197,
            94,
          ];
          data.cell.styles.textColor = [
            255,
            255,
            255,
          ];
        }
      }
    },
  });

  // ====================================
  // PAGE 5 - AI INSIGHTS
  // ====================================

  pdf.addPage();

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 20, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.text(
    "AI Risk Insights",
    20,
    13
  );

  pdf.setTextColor(0, 0, 0);

  const insights = [
    "Russia remains highest geopolitical risk.",
    "Brent crude above $90 indicates supply stress.",
    "India import dependency remains elevated.",
  ];

  insights.forEach((item, index) => {
    pdf.roundedRect(
      15,
      35 + index * 30,
      170,
      18,
      3,
      3
    );

    pdf.text(
      item,
      20,
      46 + index * 30
    );
  });

  // ====================================
  // PAGE 6 - RECOMMENDATIONS
  // ====================================

  pdf.addPage();

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 20, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.text(
    "Strategic Recommendations",
    20,
    13
  );

  pdf.setTextColor(0, 0, 0);

  const recommendations = [
    "Increase imports from UAE.",
    "Increase imports from USA.",
    "Maintain strategic petroleum reserves.",
    "Monitor Brent crude above $95/bbl.",
  ];

  recommendations.forEach(
    (item, index) => {
      pdf.roundedRect(
        15,
        35 + index * 30,
        175,
        18,
        3,
        3
      );

      pdf.text(
        item,
        20,
        46 + index * 30
      );
    }
  );

  // ====================================
  // PAGE NUMBERS
  // ====================================

  const pageCount =
    pdf.getNumberOfPages();

  for (
    let i = 1;
    i <= pageCount;
    i++
  ) {
    pdf.setPage(i);

    pdf.setFontSize(10);

    pdf.setTextColor(120);

    pdf.text(
      `Page ${i} of ${pageCount}`,
      170,
      290
    );
  }

  pdf.save(
    "India-Oil-Risk-Report.pdf"
  );
}