import { runNationalSEOAudit } from "./src/utils/SEOValidator";

const results = runNationalSEOAudit();
console.log("--- National SEO Health Audit Report ---");
console.table(results);

const stats = {
  totalAudited: results.length,
  passRate: (results.filter(r => r.schemaCoverage === "PASS").length / results.length * 100).toFixed(1) + "%",
  avgGeoScore: (results.reduce((acc, r) => acc + r.geoVectorScore, 0) / results.length).toFixed(1),
  avgGap: (results.reduce((acc, r) => acc + r.competitorGap, 0) / results.length).toFixed(1)
};

console.log("--- Statistical Metrics ---");
console.log(stats);
