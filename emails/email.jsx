import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Preview,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

export default function BudgetAlertModern({
  name = "",
  type = "monthly-report",
  data = {},
}) {
  const remaining = data?.budgetAmount - data?.totalExpenses;

  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Summary</Preview>

        <Body style={style.body}>
          <Container style={style.container}>
            {/* Header */}
            <Section style={style.header}>
              <Heading style={style.title}>Monthly Financial Summary</Heading>
              <Text style={style.subtitle}>
                A clear snapshot of your finances for {data?.month}
              </Text>
            </Section>

            {/* Greeting */}
            <Section style={style.section}>
              <Text style={style.text}>
                Hi <strong>{name}</strong>,
              </Text>
              <Text style={style.text}>
                Here’s a clear summary of your financial activity for the month
              </Text>
            </Section>

            {/* Summary Cards */}
            <Section style={style.statsContainer}>
              <div style={{ ...style.statCard, marginRight: "2%" }}>
                <Text style={style.statLabel}>Total Income</Text>
                <Text style={style.statValuePositive}>
                  ${data?.stats.totalIncome}
                </Text>
              </div>

              <div style={{ ...style.statCard, marginRight: "2%" }}>
                <Text style={style.statLabel}>Total Expenses</Text>
                <Text style={style.statValueNegative}>
                  ${data?.stats.totalExpenses}
                </Text>
              </div>

              <div style={style.statCard}>
                <Text style={style.statLabel}>Net Balance</Text>
                <Text style={style.statValue}>
                  ${data?.stats.totalIncome - data?.stats.totalExpenses}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={style.section}>
                <Heading style={style.sectionTitle}>
                  Expense Breakdown by Category
                </Heading>

                <div style={style.table}>
                  {Object.entries(data.stats.byCategory).map(
                    ([category, amount]) => (
                      <div key={category} style={style.tableRow}>
                        <Text style={style.tableKey}>{category}</Text>
                        <Text style={style.tableValue}>${amount}</Text>
                      </div>
                    )
                  )}
                </div>
              </Section>
            )}

            {/* Insights */}
            {data?.insights?.length > 0 && (
              <Section style={style.section}>
                <Heading style={style.sectionTitle}>Smart Insights</Heading>

                {data.insights.map((insight, index) => (
                  <Text key={index} style={style.insight}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                Thank you for using Welth. Consistent tracking leads to better
                financial health.
              </Text>
              <Text style={styles.footerMuted}>— FinSight Team</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "bugdet-report") {
    return (
      <Html>
        <Head />
        <Preview>
          Budget alert: {data?.percentageUsed?.toFixed(1)}% of your budget used
        </Preview>

        <Body style={styles.body}>
          <Container style={styles.container}>
            {/* Header */}
            <Section style={styles.header}>
              <Text style={styles.headerEyebrow}>Budget Alert</Text>
              <Heading style={styles.headerTitle}>
                You’re approaching your limit
              </Heading>
            </Section>

            {/* Main Card */}
            <Section style={styles.card}>
              <Text style={styles.text}>
                Hi <strong>{name}</strong>,
              </Text>

              <Text style={styles.text}>
                You’ve used <strong>{data?.percentageUsed?.toFixed(1)}%</strong>{" "}
                of your monthly budget. Reviewing your spending now can help you
                avoid overshooting.
              </Text>

              {/* Highlight */}
              <Section style={styles.amountBox}>
                <Text style={styles.amountLabel}>Spent so far</Text>
                <Text style={styles.amountValue}>
                  ₹{data?.totalExpenses?.toLocaleString()}
                </Text>
              </Section>

              {/* Stats */}
              <Section style={styles.statList}>
                <Text style={styles.statRow}>
                  <span style={styles.statKey}>Monthly budget</span>
                  <span style={styles.statValue}>
                    ₹{data?.budgetAmount?.toLocaleString()}
                  </span>
                </Text>

                <Text style={styles.statRow}>
                  <span style={styles.statKey}>Total spent</span>
                  <span style={{ ...styles.statValue, color: "#b91c1c" }}>
                    ₹{data?.totalExpenses?.toLocaleString()}
                  </span>
                </Text>

                <Text style={styles.statRow}>
                  <span style={styles.statKey}>Remaining</span>
                  <span style={{ ...styles.statValue, color: "#15803d" }}>
                    ₹{remaining?.toLocaleString()}
                  </span>
                </Text>
              </Section>

              <Hr style={styles.divider} />

              {/* CTA */}
              <Section style={styles.ctaWrapper}>
                <Link
                  href="http://localhost:3000/dashboard"
                  style={styles.ctaButton}
                >
                  View detailed breakdown
                </Link>
              </Section>

              <Text style={styles.helper}>
                You’re receiving this email because budget alerts are enabled.
              </Text>
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 FinSight • Smart budgeting made simple
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
}

/* ---------------- STYLES ---------------- */

const styles = {
  body: {
    backgroundColor: "#f1f5f9",
    padding: "40px 0",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    overflow: "hidden",
  },

  header: {
    padding: "28px 24px",
    backgroundColor: "#1f2937",
  },

  headerEyebrow: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#c7d2fe",
  },

  headerTitle: {
    margin: "8px 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#ffffff",
  },

  headerSub: {
    margin: 0,
    fontSize: "13px",
    color: "#c7d2fe",
  },

  card: {
    padding: "24px",
  },

  text: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#020617",
  },

  amountBox: {
    margin: "20px 0",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },

  amountLabel: {
    fontSize: "12px",
    color: "#475569",
    margin: 0,
  },

  amountValue: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "4px 0 0",
  },

  statList: {
    marginTop: "16px",
  },

  statRow: {
    display: "block",
    margin: "10px 0",
    fontSize: "14px",
  },

  statKey: {
    display: "inline-block",
    width: "55%",
    color: "#475569",
  },

  statValue: {
    display: "inline-block",
    width: "45%",
    textAlign: "right",
    fontWeight: "600",
    color: "#020617",
  },

  divider: {
    margin: "24px 0",
    borderColor: "#e5e7eb",
  },

  ctaWrapper: {
    textAlign: "center",
  },

  ctaButton: {
    display: "inline-block",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 22px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
  },

  helper: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#64748b",
    textAlign: "center",
  },

  footer: {
    backgroundColor: "#f8fafc",
    padding: "16px",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
  },

  footerText: {
    fontSize: "12px",
    color: "#64748b",
    margin: 0,
  },
};

const style = {
  body: {
    backgroundColor: "#f4f6f8",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "24px",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    maxWidth: "600px",
  },

  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#111827",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  section: {
    marginBottom: "28px",
  },
  text: {
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
  },

  statsContainer: {
    fontSize: "0", // removes inline-block spacing bugs
  },

  statCard: {
    display: "inline-block",
    width: "30%",
    verticalAlign: "top",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    padding: "5px",
    textAlign: "center",
    fontSize: "14px", // reset
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },
  statValuePositive: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#16a34a",
  },
  statValueNegative: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#dc2626",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#111827",
  },

  table: {
    borderTop: "1px solid #e5e7eb",
  },
  tableRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  tableKey: {
    fontSize: "14px",
    color: "#374151",
  },
  tableValue: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111827",
  },

  insight: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "8px",
  },

  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "16px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#374151",
  },
  footerMuted: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
  },
  categoryBox: {
    marginTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },

  categoryRow: {
    display: "block",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  categoryLabel: {
    fontSize: "14px",
    color: "#374151",
    display: "inline-block",
    width: "65%",
    textTransform: "capitalize",
  },

  categoryAmount: {
    fontSize: "14px",
    color: "#111827",
    fontWeight: "600",
    display: "inline-block",
    width: "35%",
    textAlign: "right",
  },
};
